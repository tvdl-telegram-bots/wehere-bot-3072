import { createConversation } from "@grammyjs/conversations";
import { z } from "zod";

import { setConnection } from "@/bot/operations/__deprecated/angel";
import { fromChatIsh } from "@/bot/operations/__deprecated/mortal";
import {
  withConversationErrorHandler,
  withDefaultErrorHandler,
} from "@/bot/utils/error";
import html from "@/bot/utils/html";
import { BotContext, Command } from "@/types";
import { ChatId } from "@/typing/common";
import { assert, nonNullable } from "@/utils/assert";

const id = "4bb6b29a-653a-49a9-9205-de939ccfbedf";

const converse = withConversationErrorHandler(async (conversation, ctx) => {
  await ctx.reply("Which chat?");
  ctx = await conversation.waitFor("message:text");
  const chatId = fromChatIsh(nonNullable(ctx.message?.text));
  assert(chatId, "invalid chatId");

  const ack = await conversation.external(
    async () =>
      await setConnection(ctx.db, {
        angelChatId: nonNullable(ctx.chat?.id),
        mortalChatId: chatId,
        operator: ctx.from?.id,
      })
  );

  await ctx.api.sendMessage(
    nonNullable(ctx.chat?.id),
    html.pre(html.literal(JSON.stringify({ ack }))),
    { parse_mode: "HTML" }
  );
});

const handleCallbackQuery = withDefaultErrorHandler(async (ctx) => {
  const msg0 = nonNullable(ctx.callbackQuery?.message);
  const data = nonNullable(ctx.callbackQuery?.data);
  const Args = z.tuple([z.literal("/connect"), ChatId]);
  const [, mortalChatId] = Args.parse(data.trim().split(/\s+/));

  const ack = await setConnection(ctx.db, {
    angelChatId: msg0.chat.id,
    mortalChatId: mortalChatId,
    operator: msg0.from?.id,
  });

  await ctx.api.sendMessage(
    nonNullable(msg0.chat.id),
    html.pre(html.literal(JSON.stringify({ ack }))),
    { parse_mode: "HTML" }
  );
});

const Connect: Command = {
  commandName: "connect",
  handler: async (ctx: BotContext) => await ctx.conversation.enter(id),
  middleware: createConversation(converse, id),
  handleCallbackQuery,
};

export default Connect;
