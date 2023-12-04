import { InlineKeyboard } from "grammy";

import { Command } from "../../types";
import { setAngelSubscription } from "../operations/__deprecated/angel";
import { withDefaultErrorHandler } from "../utils/error";

import html from "@/bot/utils/html";
import { nonNullable } from "@/utils/assert";

const handler = withDefaultErrorHandler(async (ctx) => {
  const msg0 = nonNullable(ctx.msg);
  const ack = await setAngelSubscription(
    ctx.db,
    { chatId: msg0.chat.id },
    { replyingToThreadId: null }
  );
  const keyboard = InlineKeyboard.from([
    [InlineKeyboard.text(ctx.t("text-unsubscribe"), "wehere:/unsubscribe")],
  ]);
  await ctx.api.sendMessage(
    msg0.chat.id,
    [
      ctx.t("html-alright-you-subscribing"),
      "",
      html.pre(html.literal(JSON.stringify({ ack }))),
    ].join("\n"),
    { parse_mode: "HTML", reply_markup: keyboard }
  );
});

const Subscribe: Command = {
  commandName: "subscribe",
  handleMessage: handler,
  handleCallbackQuery: handler,
  middleware: undefined,
};

export default Subscribe;
