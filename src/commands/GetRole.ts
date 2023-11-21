import { createConversation } from "@grammyjs/conversations";

import { getRole } from "../operations/admin";
import { BotContext, Command } from "../types";
import { UserIsh } from "../typing";
import { withConversationErrorHandler } from "../utils/error";
import { toUserId } from "../utils/id";

const id = "a1fa4dc2-80d0-4eae-9cd2-e186e7637652";

const converse = withConversationErrorHandler(async (conversation, ctx) => {
  await ctx.reply("Which user?");
  ctx = await conversation.waitFor("message:text");
  const userIsh = UserIsh.parse(ctx.message?.text);
  const userId = toUserId(userIsh);
  const role = await conversation.external(
    async () => await getRole(ctx.db, userId)
  );
  ctx.reply(`The role of ${userId} is ${role}.`);
});

const GetRole: Command = {
  commandName: "get_role",
  handler: async (ctx: BotContext) => await ctx.conversation.enter(id),
  middleware: createConversation(converse, id),
};

export default GetRole;
