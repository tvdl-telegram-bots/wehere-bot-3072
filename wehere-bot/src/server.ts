import { createBot } from "./bot";
import { config } from "dotenv";
import { Env } from "./types";

config();

export const ENV = Env.parse({
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
});

async function main() {
  const bot = createBot(ENV);
  await bot.start();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
