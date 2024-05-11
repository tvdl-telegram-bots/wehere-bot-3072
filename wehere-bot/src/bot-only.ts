import fs from "fs";

import { config } from "dotenv";

import { createBot } from "./bot";
import { Env, Ftl } from "./types";

config();

export const ENV = Env.parse({
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  MONGODB_URI:
    process.env.MONGODB_URI ||
    decodeURIComponent(process.env.MONGODB_URI__URLENCODED || ""),
  MONGODB_DBNAME: process.env.MONGODB_DBNAME,
});

export const FTL = Ftl.parse({
  en: fs.readFileSync("src/resources/locales/en.ftl", "utf-8"),
  vi: fs.readFileSync("src/resources/locales/vi.ftl", "utf-8"),
});

async function main() {
  const bot = await createBot(ENV, FTL);
  await bot.start();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
