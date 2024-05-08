import { Env } from "@/types";
import { Bot } from "grammy";

export function createBot(env: Env): Bot {
  const bot = new Bot(env.TELEGRAM_BOT_TOKEN);

  bot.on("message", async (ctx) => {
    ctx.reply(ctx.message.text || "?");
  });

  return bot;
}
