import { createConversation } from "@grammyjs/conversations";
import { escape } from "html-escaper";

import { BotContext } from "../../types";
import { ChatId, PersistentRole, Role, UserIsh } from "../../typing/common";
import { toUserId } from "../../utils/id";
import { withConversationErrorHandler } from "../utils/error";

const id = "3e4d600d-3be5-40be-82f4-cf806ec1459d";

const converse = withConversationErrorHandler(async (conversation, ctx) => {
  await ctx.reply("Which user?");
  ctx = await conversation.waitFor("message:text");
  const userIsh = UserIsh.parse(ctx.message?.text);
  const userId = toUserId(userIsh);

  await ctx.reply("Which role?");
  ctx = await conversation.waitFor("message:text");
  const role = Role.parse(ctx.message?.text);

  await ctx.reply(`Setting ${userId} as ${role}...`);

  const ack = await conversation.external(
    async () =>
      await ctx.db.collection("role").updateOne(
        { userId },
        {
          $set: {
            role: role,
            updatedAt: Date.now(),
            updatedBy: ctx.from?.id,
          } satisfies Partial<PersistentRole>,
        },
        { upsert: true }
      )
  );

  await ctx.api.sendMessage(
    ChatId.parse(ctx.chat?.id),
    `<pre>${escape(JSON.stringify({ ack }))}</pre>`,
    { parse_mode: "HTML" }
  );
});

const SetRole = {
  commandName: "set_role",
  handler: async (ctx: BotContext) => await ctx.conversation.enter(id),
  middleware: createConversation(converse, id),
};

export default SetRole;
