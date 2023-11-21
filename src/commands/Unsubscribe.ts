import { escape } from "html-escaper";

import { setSubscription } from "../operations/angel";
import { Command } from "../types";
import { ChatId } from "../typing";
import { withDefaultErrorHandler } from "../utils/error";

const handler = withDefaultErrorHandler(async (ctx) => {
  const ack = await setSubscription(ctx.db, {
    chatId: ChatId.parse(ctx.chat?.id),
    enabled: false,
    operator: ctx.from?.id,
  });
  await ctx.api.sendMessage(
    ChatId.parse(ctx.chat?.id),
    `<pre>${escape(JSON.stringify({ ack }))}</pre>`,
    { parse_mode: "HTML" }
  );
});

const Unsubscribe: Command = {
  commandName: "unsubscribe",
  handler,
  middleware: undefined,
};

export default Unsubscribe;
