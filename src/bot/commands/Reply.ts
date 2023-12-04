import { ObjectId } from "mongodb";
import { z } from "zod";

import { withDefaultErrorHandler } from "@/bot/utils/error";
import html from "@/bot/utils/html";
import { Command } from "@/types";
import { PersistentAngelSubscription, PersistentThread } from "@/typing/server";
import { assert, nonNullable } from "@/utils/assert";

const handleCallbackQuery = withDefaultErrorHandler(async (ctx) => {
  const msg0 = nonNullable(ctx.callbackQuery?.message);
  const data = nonNullable(ctx.callbackQuery?.data);
  const url = new URL(data);
  const threadId = ObjectId.createFromHexString(
    z.string().parse(url.searchParams.get("threadId"))
  );

  const thread = await ctx.db
    .collection("thread")
    .findOne({ _id: threadId })
    .then((doc) => PersistentThread.parse(doc));

  const ack = await ctx.db.collection("angel_subscription").updateOne(
    { chatId: msg0.chat.id }, //
    {
      $set: {
        replyingToThreadId: threadId,
        updatedAt: Date.now(),
      } satisfies Partial<PersistentAngelSubscription>,
    },
    { upsert: true }
  );

  assert(ack.matchedCount > 0);

  await ctx.api.sendMessage(
    nonNullable(msg0.chat.id),
    [
      ctx.t("html-replying-to", {
        name: html.strong(formatThread(thread)),
      }),
      "",
      html.pre(html.literal(JSON.stringify({ ack }))),
    ].join("\n"),
    { parse_mode: "HTML" }
  );
});

function formatThread(thread: PersistentThread) {
  return [thread.emoji || "❓", thread.name || "-"].join(" ");
}

const Reply: Command = {
  commandName: "reply",
  handler: undefined,
  handleCallbackQuery,
};

export default Reply;
