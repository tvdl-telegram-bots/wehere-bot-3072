import { conversations } from "@grammyjs/conversations";
import { Fluent } from "@moebius/fluent";
import { Bot, GrammyError, HttpError, session } from "grammy";
import { Db } from "mongodb";

import { getDb } from "./getDb";
import { getFluent } from "./getFluent";

import Connect from "@/bot/commands/Connect";
import Disconnect from "@/bot/commands/Disconnect";
import GetRole from "@/bot/commands/GetRole";
import Reply from "@/bot/commands/Reply";
import SendMessage from "@/bot/commands/SendMessage";
import SetRole from "@/bot/commands/SetRole";
import Start from "@/bot/commands/Start";
import Status from "@/bot/commands/Status";
import Subscribe from "@/bot/commands/Subscribe";
import Unsubscribe from "@/bot/commands/Unsubscribe";
import { BotContext, Command } from "@/types";
import { Env, Ftl } from "@/typing/common";
import { assert } from "@/utils/assert";

export async function getBot0({
  db,
  fluent,
  env,
}: {
  db: Db;
  fluent: Fluent;
  env: Env;
}) {
  const bot = new Bot<BotContext>(env.TELEGRAM_BOT_TOKEN);

  bot.use(async (ctx, next) => {
    ctx.db = db;
    ctx.withLocale = fluent.withLocale.bind(fluent);
    await next();
  });

  bot.use(session({ initial: () => ({}) })); // TODO: persistent session
  bot.use(conversations());

  const commands: Command[] = [
    Connect,
    Disconnect,
    GetRole,
    Reply,
    SetRole,
    Start,
    Status,
    Subscribe,
    Unsubscribe,
  ];

  for (const c of commands) {
    if (c.middleware) {
      bot.use(c.middleware);
    }
  }

  for (const c of commands) {
    if (c.handler) {
      bot.command(c.commandName, c.handler);
    }
    if (c.handleMessage) {
      bot.command(c.commandName, c.handleMessage);
    }
  }

  bot.on("callback_query:data", async (ctx) => {
    const url = new URL(ctx.callbackQuery.data);
    assert(url.protocol === "wehere:", "invalid protocol");

    for (const c of commands) {
      if (!c.handleCallbackQuery) continue;
      if (url.pathname !== "/" + c.commandName) continue;
      return await c.handleCallbackQuery(ctx);
    }

    ctx.reply("Unknown callback query");
  });

  bot.on("message::bot_command", async (ctx) => {
    ctx.reply("Unknown command");
  });

  bot.on("message", async (ctx) => {
    return await SendMessage.handler?.(ctx);
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

export async function getBot({ env, ftl }: { env: Env; ftl: Ftl }) {
  const [db, fluent] = await Promise.all([getDb({ env }), getFluent(ftl)]);
  return await getBot0({ db, fluent, env });
}
