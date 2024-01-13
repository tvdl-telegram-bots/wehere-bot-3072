import { createConversation } from "@grammyjs/conversations";
import { z } from "zod";

import { BotContext, Command } from "../../types";
import { Role, UserId } from "../../typing/common";
import { getChatLocale } from "../operations/getChatLocale";
import { getRole } from "../operations/getRole";
import {
  withConversationErrorHandler,
  withDefaultErrorHandler,
} from "../utils/error";
import html from "../utils/html";
import { parseCallbackQueryData } from "../utils/parse";

import { PersistentRole } from "@/typing/server";
import { assert, nonNullable } from "@/utils/assert";

const id = "796477c3-6c18-426f-b436-d12b5bf344d3";

const converse = withConversationErrorHandler(async (c, ctx) => {
  const msg0 = nonNullable(ctx.message);
  const locale = await c.external(() => getChatLocale(ctx, msg0.chat.id));
  const role0 = await c.external(() => getRole(ctx, msg0.from.id));
  assert(role0 === "admin", "forbidden");
  await ctx.api.sendMessage(
    msg0.chat.id,
    ctx.withLocale(locale)("html-which-user"),
    { parse_mode: "HTML" }
  );

  ctx = await c.waitFor("message:text");
  const userId = UserId.parse(ctx.message?.text);
  await ctx.reply("Which role?");

  ctx = await c.waitFor("message:text");
  const role = Role.parse(ctx.message?.text);
  await ctx.reply(`Setting ${userId} as ${role}...`);

  const ack = await c.external(
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
    msg0.chat.id,
    [
      ctx.withLocale(locale)("html-set-role-success", {
        user: html.strong(html.literal(userId)),
        role: html.strong(role),
      }),
      html.pre(html.literal(JSON.stringify({ ack }))),
    ].join("\n\n"),
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
  handleMessage: async (ctx: BotContext) => await ctx.conversation.enter(id),
  handleCallbackQuery,
  middleware: createConversation(converse, id),
};

export default SetRole;
