import { InlineKeyboard } from "grammy";
import type { WithoutId } from "mongodb";

import html from "../utils/html";

import { getChatLocale } from "./getChatLocale";

import type { EssentialContext } from "@/types";
import type { ChatId } from "@/typing/common";
import type { PersistentThreadMessage } from "@/typing/server";
import {
  PersistentAngelSubscription,
  PersistentMortalSubscription,
} from "@/typing/server";
import { parseDocs } from "@/utils/array";
import { assert } from "@/utils/assert";
import {
  formatErrorAsObject,
  formatErrorDeeply,
  formatThread,
} from "@/utils/format";

type Params = {
  message: WithoutId<PersistentThreadMessage>;
  excludesChats?: ChatId[];
};

export async function notifyNewMessage(
  ctx: EssentialContext,
  { message, excludesChats = [] }: Params
) {
  // 1. Notify mortals
  const mortalSubs = await ctx.db
    .collection("mortal_subscription")
    .find({ threadId: message.threadId })
    .toArray()
    .then(parseDocs(PersistentMortalSubscription));

  for (const sub of mortalSubs) {
    if (excludesChats.includes(sub.chatId)) continue;

    if (message.originChatId && message.originMessageId) {
      await ctx.api.copyMessage(
        sub.chatId,
        message.originChatId,
        message.originMessageId
      );
    } else if (message.plainText && message.text) {
      await ctx.api.sendMessage(sub.chatId, message.text);
    } else {
      console.error("invalid message");
    }
  }

  // 2. Notify angels
  const angelSubs = await ctx.db
    .collection("angel_subscription")
    .find()
    .toArray()
    .then(parseDocs(PersistentAngelSubscription));

  const thread = await ctx.db
    .collection("thread")
    .findOne({ _id: message.threadId });
  assert(thread, "thread not found");

  const subject =
    message.direction === "from_mortal"
      ? html.strong(html.literal(formatThread(thread)))
      : [
          html.strong("🏢 WeHere"),
          `(${html.strong(html.literal(formatThread(thread)))})`,
        ].join(" ");

  for (const sub of angelSubs) {
    try {
      const locale = await getChatLocale(ctx, sub.chatId);
      const keyboard =
        message.direction === "from_mortal"
          ? new InlineKeyboard().text(
              ctx.withLocale(locale)("text-reply"),
              `wehere:/reply?threadId=${thread._id.toHexString()}`
            )
          : undefined;

      if (message.text && message.plainText) {
        await ctx.api.sendMessage(
          sub.chatId,
          [subject, html.literal(message.text)].join("\n"),
          { parse_mode: "HTML", reply_markup: keyboard }
        );
      } else if (message.originChatId && message.originMessageId) {
        const msg1 = await ctx.api.sendMessage(
          sub.chatId,
          subject,
          { parse_mode: "HTML", reply_markup: keyboard } //
        );

        await ctx.api.copyMessage(
          sub.chatId,
          message.originChatId,
          message.originMessageId,
          { reply_to_message_id: msg1.message_id }
        );
      } else {
        console.error("invalid message");
      }
    } catch (error) {
      console.error(formatErrorDeeply(error));
      await ctx.db.collection("error").insertOne(formatErrorAsObject(error));
    }
  }
}
