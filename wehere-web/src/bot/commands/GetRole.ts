import { createConversation } from "@grammyjs/conversations";

import { BotContext, Command } from "../../types";
import { UserId } from "../../typing/common";
import { getRole } from "../operations/getRole";
import { withConversationErrorHandler } from "../utils/error";

import { assert, nonNullable } from "@/utils/assert";

const id = "0e1e5067-3c10-4dc8-b196-2ac32b86ba5e";

const converse = withConversationErrorHandler(async (conversation, ctx) => {
  const msg0 = nonNullable(ctx.message);
  const role = await conversation.external(() => getRole(ctx, msg0.from.id));
  assert(["angel", "admin"].includes(role), "forbidden");
  await ctx.reply("Which user?");

  ctx = await conversation.waitFor("message:text");
  const userId = UserId.parse(ctx.message?.text);
  const userRole = await conversation.external(() => getRole(ctx, userId));
  ctx.reply(`The role of ${userId} is ${userRole}.`);
});

const GetRole: Command = {
  commandName: "get_role",
  handler: async (ctx: BotContext) => await ctx.conversation.enter(id),
  middleware: createConversation(converse, id),
};

export default GetRole;
