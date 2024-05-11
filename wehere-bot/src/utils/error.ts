import { nonNullable } from "./assert";
import { html } from "./format";

import type { BotContext } from "@/types";

export function withDefaultErrorHandler(handler: (ctx: BotContext) => void) {
  return async (ctx: BotContext) => {
    try {
      await Promise.resolve(handler(ctx));
    } catch (error) {
      if (error instanceof Error) {
        const chatId = nonNullable(ctx.chat?.id);
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
