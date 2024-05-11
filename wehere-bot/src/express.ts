import fs from "fs";

import { config } from "dotenv";
import express from "express";

import { createBot } from "./bot";
import { Env, Ftl } from "./types";

config();

export const ENV = Env.parse({
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  MONGODB_URI:
    process.env.MONGODB_URI ||
    decodeURIComponent(process.env.MONGODB_URI__URLENCODED || ""),
  MONGODB_DBNAME: process.env.MONGODB_DBNAME,
  PORT: process.env.PORT,
  HOST: process.env.HOST,
});

export const FTL = Ftl.parse({
  en: fs.readFileSync("src/resources/locales/en.ftl", "utf-8"),
  vi: fs.readFileSync("src/resources/locales/vi.ftl", "utf-8"),
});

createBot(ENV, FTL)
  .then((bot) => bot.start())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

const app = express();

app.get("/", function (_req, res) {
  res.json({ now: Date.now() });
});

app.listen(ENV.PORT, ENV.HOST, () =>
  console.log(`Server ready on ${ENV.HOST}:${ENV.PORT}.`)
);

module.exports = app;
