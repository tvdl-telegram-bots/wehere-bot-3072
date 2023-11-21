import { conversations } from "@grammyjs/conversations";
import { useFluent } from "@grammyjs/fluent";
import { Bot, GrammyError, HttpError, session } from "grammy";

import { getDb } from "./getDb";
import { getFluent } from "./getFluent";

import Connect from "@/commands/Connect";
import Disconnect from "@/commands/Disconnect";
import GetRole from "@/commands/GetRole";
import SendMessage from "@/commands/SendMessage";
import SetRole from "@/commands/SetRole";
import Start from "@/commands/Start";
import Subscribe from "@/commands/Subscribe";
import Unsubscribe from "@/commands/Unsubscribe";
import { BotContext, Command } from "@/types";
import { Env, Ftl } from "@/typing";

export async function getBot({ env, ftl }: { env: Env; ftl: Ftl }) {
  const [db, fluent] = await Promise.all([getDb({ env }), getFluent(ftl)]);
  const bot = new Bot<BotContext>(env.TELEGRAM_BOT_TOKEN);

  bot.use(async (ctx, next) => {
    ctx.db = db;
    await next();
  });

  bot.use(session({ initial: () => ({}) })); // TODO: persistent session
  bot.use(useFluent({ fluent }));
  bot.use(conversations());

  bot.use(async (ctx, next) => {
    ctx.fluent.useLocale("vi");
    await next();
  });

  const commands: Command[] = [
    SetRole,
    GetRole,
    Subscribe,
    Unsubscribe,
    Connect,
    Disconnect,
    Start,
  ];

  for (const c of commands) {
    if (c.middleware) {
      bot.use(c.middleware);
    }
  }

  for (const c of commands) {
    bot.command(c.commandName, c.handler);
  }

  bot.on("callback_query:data", async (ctx, next) => {
    const data = ctx.callbackQuery.data;
    console.log(data);
    for (const c of commands) {
      if (!c.handleCallbackQuery) continue;
      const regexp = new RegExp("\\/" + c.commandName + "\\b");
      if (!regexp.test(data)) continue;
      return await c.handleCallbackQuery(ctx);
    }
    await next();
  });

  bot.on("message::bot_command", async (ctx) => {
    ctx.reply("Unknown command");
  });

  bot.on("message", async (ctx) => {
    return await SendMessage.handler(ctx);
  });

  bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
    } else {
      console.error("Unknown error:", e);
    }
  });

  return bot;
}
