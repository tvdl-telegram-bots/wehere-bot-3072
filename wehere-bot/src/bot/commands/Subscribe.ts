import { InlineKeyboard } from "grammy";

import { setAngelSubscription } from "../operations/Angel";
import { getChatLocale } from "../operations/Chat";

import type { Command } from "@/types";
import { nonNullable } from "@/utils/assert";
import { withDefaultErrorHandler } from "@/utils/error";

const handler = withDefaultErrorHandler(async (ctx) => {
  const msg0 = nonNullable(ctx.msg);
  const locale = await getChatLocale(ctx, msg0.chat.id);

  await setAngelSubscription(
    ctx.db,
    { chatId: msg0.chat.id },
    { replyingToThreadId: null }
  );

  await ctx.api.sendMessage(
    msg0.chat.id,
    ctx.withLocale(locale)("html-alright-you-subscribing"),
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard().text(
        ctx.withLocale(locale)("text-unsubscribe"),
        "wehere:/unsubscribe"
      ),
    }
  );
});

const Subscribe: Command = {
  commandName: "subscribe",
  handleMessage: handler,
  handleCallbackQuery: handler,
  middleware: undefined,
};

export default Subscribe;
