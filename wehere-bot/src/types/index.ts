import type { Fluent } from "@moebius/fluent";
import type { Context, Middleware } from "grammy";
import type { Db } from "mongodb";
import { z } from "zod";

export type Env = z.infer<typeof Env>;
export const Env = z.object({
  TELEGRAM_BOT_TOKEN: z.string(),
  MONGODB_URI: z.string().startsWith("mongodb"),
  MONGODB_DBNAME: z.string().min(1),
  PORT: z.coerce.number().default(3070),
  HOST: z.string().default("0.0.0.0"),
});

export type Ftl = z.infer<typeof Ftl>;
export const Ftl = z.object({
  en: z.string(),
  vi: z.string(),
});

export type BotContext = Context & {
  db: Db;
  withLocale: Fluent["withLocale"];
};

export type Command = {
  commandName: string;
  middleware?: Middleware<BotContext>;
  handleMessage?: (ctx: BotContext) => Promise<void>;
  handleCallbackQuery?: (ctx: BotContext) => Promise<void>;
};
