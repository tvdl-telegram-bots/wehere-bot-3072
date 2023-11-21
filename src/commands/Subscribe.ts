import { escape } from "html-escaper";

import { setSubscription } from "../operations/angel";
import { Command } from "../types";
import { ChatId } from "../typing";
import { withDefaultErrorHandler } from "../utils/error";

const handler = withDefaultErrorHandler(async (ctx) => {
  const ack = await setSubscription(ctx.db, {
    chatId: ChatId.parse(ctx.chat?.id),
    enabled: true,
    operator: ctx.from?.id,
  });
  await ctx.api.sendMessage(
    ChatId.parse(ctx.chat?.id),
    `<pre>${escape(JSON.stringify({ ack }))}</pre>`,
    { parse_mode: "HTML" }
  );
});

const Subscribe: Command = {
  commandName: "subscribe",
  handler,
  middleware: undefined,
};

export default Subscribe;
