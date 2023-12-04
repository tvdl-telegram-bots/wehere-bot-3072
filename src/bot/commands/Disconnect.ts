import { escape } from "html-escaper";

import { Command } from "../../types";
import { nonNullable } from "../../utils/assert";
import { setConnection } from "../operations/__deprecated/angel";
import { withDefaultErrorHandler } from "../utils/error";

const handler = withDefaultErrorHandler(async (ctx) => {
  const ack = await setConnection(ctx.db, {
    angelChatId: nonNullable(ctx.chat?.id),
    mortalChatId: null,
    operator: nonNullable(ctx.from?.id),
  });
  await ctx.api.sendMessage(
    nonNullable(ctx.chat?.id),
    `<pre>${escape(JSON.stringify({ ack }))}</pre>`,
    { parse_mode: "HTML" }
  );
});

const Disconnect: Command = {
  commandName: "disconnect",
  handler,
  middleware: undefined,
};

export default Disconnect;
