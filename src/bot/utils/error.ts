import { Conversation } from "@grammyjs/conversations";

import { BotContext } from "../../types";
import { ChatId } from "../../typing/common";

import html from "./html";

export function withConversationErrorHandler(
  converse: (conversation: Conversation<BotContext>, ctx: BotContext) => void
) {
  return async (conversation: Conversation<BotContext>, ctx: BotContext) => {
    try {
      await Promise.resolve(converse(conversation, ctx));
    } catch (error) {
      if (error instanceof Error) {
        await ctx.api.sendMessage(
          ChatId.parse(ctx.chat?.id),
          html.pre(html.literal(error.message)),
          { parse_mode: "HTML" }
        );
      }
      throw error;
    }
  };
}

export function withDefaultErrorHandler(handler: (ctx: BotContext) => void) {
  return async (ctx: BotContext) => {
    try {
      await Promise.resolve(handler(ctx));
    } catch (error) {
      if (error instanceof Error) {
        const chatId = ChatId.parse(ctx.chat?.id);
        await ctx.api.sendMessage(
          chatId,
          html.pre(html.literal(error.message)),
          { parse_mode: "HTML" }
        );
      }
      throw error;
    }
  };
}
