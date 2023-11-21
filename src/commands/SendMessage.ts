import { InlineKeyboard } from "grammy";

import { getRole } from "../operations/admin";
import { getConnection } from "../operations/angel";
import { toChatIsh } from "../operations/mortal";
import { Command } from "../types";
import { ChatId, PersistentMessage, PersistentSubscription } from "../typing";
import { assert } from "../utils/assert";
import { withDefaultErrorHandler } from "../utils/error";
import html from "../utils/html";

const handler = withDefaultErrorHandler(async (ctx) => {
  if (!ctx.message) return;
  const msg0 = ctx.message;
  const role = await getRole(ctx.db, msg0.from.id);
  const now = Date.now();

  const connection =
    role !== "mortal"
      ? await getConnection(ctx.db, { angelChatId: msg0.chat.id })
      : undefined;

  const mortalChatId =
    role === "mortal" ? msg0.chat.id : connection?.mortalChatId;

  assert(mortalChatId, "You are not connecting to any mortals.");

  const numRecentMessagesFromMortal = await ctx.db
    .collection("message")
    .countDocuments(
      {
        mortalChatId,
        fromRole: "mortal",
        createdAt: {
          $gte: now - 600 * 1000, // 10 minutes
          $lt: now,
        },
      },
      { limit: 1 }
    );

  await ctx.db.collection("message").insertOne({
    mortalChatId,
    fromRole: role,
    createdAt: now,
    createdBy: role !== "mortal" ? msg0.from.id : undefined,
  } satisfies PersistentMessage);

  const notifyAngel = async (angelChatId: ChatId) => {
    const subject =
      role === "mortal"
        ? html.strong(html.literal(toChatIsh(msg0.chat.id)))
        : `${html.strong("🏢 WeHere")} (${html.strong(
            html.literal(
              connection?.mortalChatId
                ? toChatIsh(connection.mortalChatId)
                : "-"
            )
          )})`;

    const keyboard =
      role === "mortal" && !numRecentMessagesFromMortal
        ? InlineKeyboard.from([
            [
              InlineKeyboard.text(
                ctx.t("text-connect"),
                `/connect ${msg0.chat.id}`
              ),
            ],
          ])
        : undefined;

    if (msg0.text && msg0.text.length <= 2048 && !msg0.entities?.length) {
      await ctx.api.sendMessage(
        angelChatId,
        [subject, html.literal(msg0.text)].join("\n"),
        { parse_mode: "HTML", reply_markup: keyboard }
      );
    } else {
      const msg1 = await ctx.api.sendMessage(
        angelChatId,
        [
          subject,
          html.em(
            msg0.photo
              ? ctx.t("html-has-sent-a-photo")
              : msg0.video
              ? ctx.t("html-has-sent-a-video")
              : ctx.t("html-has-sent-a-message")
          ),
        ].join("\n"), //
        { parse_mode: "HTML", reply_markup: keyboard }
      );

      await ctx.api.copyMessage(angelChatId, msg0.chat.id, msg0.message_id, {
        reply_to_message_id: msg1.message_id,
      });
    }
  };

  if (role !== "mortal") {
    assert(connection?.mortalChatId, "not connected to any mortals");
    await ctx.api.copyMessage(
      connection.mortalChatId,
      msg0.chat.id,
      msg0.message_id
    );
  }

  const subscriptions = await ctx.db
    .collection("subscription")
    .find({ enabled: true })
    .toArray()
    .then((docs) => docs.map((d) => PersistentSubscription.parse(d)));

  for (const sub of subscriptions) {
    await notifyAngel(sub.chatId);
  }
});

const SendMessage: Command = {
  commandName: "send_message",
  handler,
};

export default SendMessage;
