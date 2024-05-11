import { autoRetry } from "@grammyjs/auto-retry";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import { Fluent } from "@moebius/fluent";
import { Bot, GrammyError, HttpError } from "grammy";
import { MongoClient } from "mongodb";

import AngelSay from "./commands/AngelSay";
import MortalSay from "./commands/MortalSay";
import Start from "./commands/Start";
import Subscribe from "./commands/Subscribe";
import { getRole } from "./operations/Role";

import type { BotContext, Command, Env, Ftl } from "@/types";
import { assert, nonNullable } from "@/utils/assert";

export async function createBot(env: Env, ftl: Ftl): Promise<Bot<BotContext>> {
  // get db
  console.log("Connecting to:", env.MONGODB_URI);
  const client = await MongoClient.connect(env.MONGODB_URI);
  const db = client.db(env.MONGODB_DBNAME);
  console.log("Connected. The db is:", env.MONGODB_DBNAME);

  // get fluent
  const fluent = new Fluent();
  await fluent.addTranslation({ locales: "en", source: ftl.en });
  await fluent.addTranslation({ locales: "vi", source: ftl.vi });

  // get bot
  const bot = new Bot<BotContext>(env.TELEGRAM_BOT_TOKEN);

  bot.use(async (ctx, next) => {
    ctx.db = db;
    ctx.withLocale = fluent.withLocale.bind(fluent);
    await next();
  });

  bot.api.config.use(apiThrottler());
  bot.api.config.use(autoRetry());

  const commands: Command[] = [Start, Subscribe];

  for (const c of commands) {
    if (c.middleware) {
      bot.use(c.middleware);
    }
  }

  for (const c of commands) {
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
    const msg0 = nonNullable(ctx.message);
    const role = await getRole(ctx, msg0.from.id);
    if (role === "mortal") {
      return await MortalSay.handleMessage(ctx);
    } else {
      return await AngelSay.handleMessage(ctx);
    }
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
