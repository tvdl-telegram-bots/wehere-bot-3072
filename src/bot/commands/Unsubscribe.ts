import { InlineKeyboard } from "grammy";

import { Command } from "../../types";
import { getChatLocale } from "../operations/getChatLocale";
import { withDefaultErrorHandler } from "../utils/error";

import { setAngelSubscription } from "@/bot/operations/__deprecated/angel";
import html from "@/bot/utils/html";
import { nonNullable } from "@/utils/assert";

const handler = withDefaultErrorHandler(async (ctx) => {
  const msg0 = nonNullable(ctx.msg);
  const locale = await getChatLocale(ctx, msg0.chat.id);

  const ack = await setAngelSubscription(
    ctx.db,
    { chatId: msg0.chat.id },
    null
  );
  await ctx.api.sendMessage(
    msg0.chat.id,
    [
      ctx.withLocale(locale)("html-done-you-unsubscribed"),
      html.pre(html.literal(JSON.stringify({ ack }))),
    ].join("\n\n"),
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard().text(
        ctx.withLocale(locale)("text-subscribe"),
        "wehere:/subscribe"
      ),
    }
  );
});

const Unsubscribe: Command = {
  commandName: "unsubscribe",
  handleMessage: handler,
  handleCallbackQuery: handler,
  middleware: undefined,
};

export default Unsubscribe;
