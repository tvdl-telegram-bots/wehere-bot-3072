import { ConversationFlavor } from "@grammyjs/conversations";
import { Fluent } from "@moebius/fluent";
import { Context, Middleware } from "grammy";
import { Db } from "mongodb";

export type BotContext = Context &
  ConversationFlavor & {
    db: Db;
    withLocale: Fluent["withLocale"];
  };

export type EssentialContext = Pick<BotContext, "db" | "api" | "withLocale">;

export type Command = {
  commandName: string;
  middleware?: Middleware<BotContext>;
  handler?: (ctx: BotContext) => Promise<void>;
  handleMessage?: (ctx: BotContext) => Promise<void>;
  handleCallbackQuery?: (ctx: BotContext) => Promise<void>;
};

export type IParse<T> = {
  parse: (value: unknown) => T;
};
