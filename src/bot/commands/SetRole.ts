import { createConversation } from "@grammyjs/conversations";
import { escape } from "html-escaper";
import { z } from "zod";

import { BotContext, Command } from "../../types";
import { ChatId, Role, UserIsh } from "../../typing/common";
import { toUserId } from "../../utils/id";
import { getChatLocale } from "../operations/getChatLocale";
import {
  withConversationErrorHandler,
  withDefaultErrorHandler,
} from "../utils/error";
import html from "../utils/html";
import { parseCallbackQueryData } from "../utils/parse";

import { PersistentRole } from "@/typing/server";
import { nonNullable } from "@/utils/assert";

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

const Params$SetRole = z.object({
  user: z.coerce.number().safe(),
  role: Role,
});

const handleCallbackQuery = withDefaultErrorHandler(async (ctx) => {
  const msg0 = nonNullable(ctx.callbackQuery?.message);
  const data = nonNullable(ctx.callbackQuery?.data);
  const { query } = parseCallbackQueryData(data);
  const params = Params$SetRole.parse(query);
  const locale = await getChatLocale(ctx, msg0.chat.id);

  const ack = await ctx.db.collection("role").updateOne(
    { userId: { $eq: params.user } },
    {
      $set: {
        role: params.role,
        updatedAt: Date.now(),
      } satisfies Partial<PersistentRole>,
    },
    { upsert: true }
  );

  await ctx.api.sendMessage(
    msg0.chat.id,
    [
      ctx.withLocale(locale)("html-user-been-assigned-role", {
        user: html.strong(html.literal(params.user)),
        role: html.strong(html.literal(params.role)),
      }),
      html.pre(html.literal(JSON.stringify(ack))),
    ].join("\n\n"),
    { parse_mode: "HTML" } //
  );
});

const SetRole: Command = {
  commandName: "set_role",
  handler: async (ctx: BotContext) => await ctx.conversation.enter(id),
  handleCallbackQuery,
  middleware: createConversation(converse, id),
};

export default SetRole;
