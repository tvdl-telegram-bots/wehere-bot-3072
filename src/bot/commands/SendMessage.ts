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

  const angelSub = await getAngelSubscription(ctx.db, { chatId: msg0.chat.id });
  if (!angelSub) {
    const keyboard = InlineKeyboard.from([
      [InlineKeyboard.text(ctx.t("text-subscribe"), `wehere:/subscribe`)],
    ]);
    ctx.api.sendMessage(
      msg0.chat.id,
      ctx.t("html-not-subscribing"),
      { parse_mode: "HTML", reply_markup: keyboard } //
    );
    return;
  }

  if (!angelSub.replyingToThreadId) {
    await ctx.reply("You are not replying to anyone.");
    return;
  }

  const message: WithoutId<PersistentThreadMessage> = {
    threadId: angelSub.replyingToThreadId,
    direction: "from_angel",
    originChatId: msg0.chat.id,
    originMessageId: msg0.message_id,
    text: msg0.text,
    plainText: isMessagePlainText(msg0),
    createdAt: Date.now(),
  };

  await createMessage(ctx.db, message);
  await notifyNewMessage(ctx, { message });
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
