import { autoRetry } from "@grammyjs/auto-retry";
import { conversations } from "@grammyjs/conversations";
import { MongoDBAdapter } from "@grammyjs/storage-mongodb";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import type { Fluent } from "@moebius/fluent";
import { Bot, GrammyError, HttpError, session } from "grammy";
import type { Db } from "mongodb";

import Availability from "./commands/Availability";
import AngelSay from "./default-commands/AngelSay";
import MortalSay from "./default-commands/MortalSay";
import { getDb } from "./getDb";
import { getFluent } from "./getFluent";
import { getRole } from "./operations/getRole";

import GetRole from "@/bot/commands/GetRole";
import Reply from "@/bot/commands/Reply";
import SetRole from "@/bot/commands/SetRole";
import Start from "@/bot/commands/Start";
import Status from "@/bot/commands/Status";
import Subscribe from "@/bot/commands/Subscribe";
import Unsubscribe from "@/bot/commands/Unsubscribe";
import type { BotContext, Command } from "@/types";
import type { Env, Ftl } from "@/typing/common";
import { assert, nonNullable } from "@/utils/assert";

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

  // https://grammy.dev/plugins/conversations#installing-and-entering-a-conversation
  // https://grammy.dev/plugins/session#external-storage-solutions
  // https://github.com/grammyjs/storages/blob/main/packages/mongodb/examples/node.ts
  bot.use(
    session({
      initial: () => ({}),
      storage: new MongoDBAdapter({ collection: db.collection("session") }),
    })
  );

  bot.use(conversations());

  bot.api.config.use(apiThrottler());
  bot.api.config.use(autoRetry());

  const commands: Command[] = [
    GetRole, // Status should allow admin to see all angels
    Reply,
    SetRole,
    Start,
    Status,
    Subscribe,
    Unsubscribe,
    Availability,
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

export async function getBot({ env, ftl }: { env: Env; ftl: Ftl }) {
  const [db, fluent] = await Promise.all([getDb({ env }), getFluent(ftl)]);
  return await getBot0({ db, fluent, env });
}
