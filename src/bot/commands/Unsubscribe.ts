import { Command } from "../../types";
import { withDefaultErrorHandler } from "../utils/error";

import { setAngelSubscription } from "@/bot/operations/__deprecated/angel";
import html from "@/bot/utils/html";
import { nonNullable } from "@/utils/assert";

const handler = withDefaultErrorHandler(async (ctx) => {
  const msg0 = nonNullable(ctx.message);
  const ack = await setAngelSubscription(
    ctx.db,
    { chatId: msg0.chat.id },
    null
  );
  await ctx.api.sendMessage(
    msg0.chat.id,
    html.pre(html.literal(JSON.stringify({ ack }))),
    { parse_mode: "HTML" }
  );
});

const Unsubscribe: Command = {
  commandName: "unsubscribe",
  handler,
  middleware: undefined,
};

export default Unsubscribe;
