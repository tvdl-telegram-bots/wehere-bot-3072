import { getRole } from "@/bot/operations/__deprecated/admin";
import { getThreadFromMortalChatId } from "@/bot/operations/__deprecated/mortal";
import { withDefaultErrorHandler } from "@/bot/utils/error";
import { Command } from "@/types";
import { nonNullable } from "@/utils/assert";
import { formatThread } from "@/utils/format";

const handleMessage = withDefaultErrorHandler(async (ctx) => {
  const msg0 = nonNullable(ctx.message);

  const thread = await getThreadFromMortalChatId(ctx.db, {
    chatId: msg0.chat.id,
  });

  const role = await getRole(ctx.db, msg0.from.id);

  ctx.api.sendMessage(
    msg0.chat.id,
    [
      //
      `Welcome ${formatThread(thread)}!`,
      `Your user ID is ${msg0.from.id}.`,
      `Your role is ${role}.`,
    ].join("\n"),
    { parse_mode: "HTML" }
  );
});

const Status: Command = {
  commandName: "status",
  handleMessage,
};

export default Status;
