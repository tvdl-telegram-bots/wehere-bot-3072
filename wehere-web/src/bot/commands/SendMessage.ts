import { InlineKeyboard } from "grammy";
import { Message } from "grammy/types";
import { WithoutId } from "mongodb";

import { BotContext, Command } from "../../types";
import { nonNullable } from "../../utils/assert";
import { getRole } from "../operations/__deprecated/admin";
import { getAngelSubscription } from "../operations/__deprecated/angel";
import {
  createMessage,
  getThreadFromMortalChatId,
} from "../operations/__deprecated/mortal";
import { getChatLocale } from "../operations/getChatLocale";
import { getThread_givenThreadId } from "../operations/getThread";
import notifyNewMessage from "../operations/notifyNewMessage";
import { withDefaultErrorHandler } from "../utils/error";

import { PersistentThreadMessage } from "@/typing/server";

function isMessagePlainText(msg: Message): boolean {
  return !!msg.text && msg.text.length <= 2048 && !msg.entities?.length;
}

async function handlerForMortal(ctx: BotContext) {
  const msg0 = nonNullable(ctx.message);

  const thread = await getThreadFromMortalChatId(ctx.db, {
    chatId: msg0.chat.id,
  });

  const message: WithoutId<PersistentThreadMessage> = {
    threadId: thread._id,
    direction: "from_mortal",
    originChatId: msg0.chat.id,
    originMessageId: msg0.message_id,
    text: msg0.text,
    entities: msg0.entities,
    plainText: isMessagePlainText(msg0),
    createdAt: Date.now(),
  };

  await createMessage(ctx.db, message);
  await notifyNewMessage(ctx, {
    message,
    excludesChats: [msg0.chat.id],
  });
}

async function handlerForAngel(ctx: BotContext) {
  const msg0 = nonNullable(ctx.message);
  const locale = await getChatLocale(ctx, msg0.chat.id);
  const angelSub = await getAngelSubscription(ctx.db, { chatId: msg0.chat.id });

  if (!angelSub) {
    await ctx.api.sendMessage(
      msg0.chat.id,
      ctx.withLocale(locale)("html-not-subscribing"),
      {
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard().text(
          ctx.withLocale(locale)("text-subscribe"),
          `wehere:/subscribe`
        ),
      }
    );
    return;
  }

  if (!angelSub.replyingToThreadId) {
    await ctx.api.sendMessage(
      msg0.chat.id,
      ctx.withLocale(locale)("html-not-replying-anyone"),
      { parse_mode: "HTML" }
    );
    return;
  }

  const message: WithoutId<PersistentThreadMessage> = {
    threadId: angelSub.replyingToThreadId,
    direction: "from_angel",
    originChatId: msg0.chat.id,
    originMessageId: msg0.message_id,
    text: msg0.text,
    entities: msg0.entities,
    plainText: isMessagePlainText(msg0),
    createdAt: Date.now(),
  };

  await createMessage(ctx.db, message);
  await notifyNewMessage(ctx, { message });

  if (!isMessagePlainText(msg0)) {
    const threadPlatform = await getThread_givenThreadId(
      ctx,
      angelSub.replyingToThreadId
    )
      .then((t) => t?.platform)
      .catch(() => undefined);
    if (
      threadPlatform === "web" &&
      message.entities?.some(
        (ent) =>
          ![
            "url",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "code",
            "pre",
            "text_link",
          ].includes(ent.type)
      )
    ) {
      await ctx.api.sendMessage(
        msg0.chat.id,
        ctx.withLocale(locale)("html-can-only-send-plaintext"),
        { parse_mode: "HTML" }
      );
      return;
    }
  }
}

const handler = withDefaultErrorHandler(async (ctx) => {
  const msg0 = nonNullable(ctx.message);
  const role = await getRole(ctx.db, msg0.from.id);

  if (role === "mortal") {
    return handlerForMortal(ctx);
  } else {
    return handlerForAngel(ctx);
  }
});

const SendMessage: Command = {
  commandName: "send_message",
  handler,
};

export default SendMessage;
