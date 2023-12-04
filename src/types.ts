import { ConversationFlavor } from "@grammyjs/conversations";
import { FluentContextFlavor } from "@grammyjs/fluent";
import { Fluent } from "@moebius/fluent";
import { Context, Middleware } from "grammy";
import { Db } from "mongodb";

export type BotContext = Context &
  ConversationFlavor &
  FluentContextFlavor & {
    db: Db;
    fluentInstance: Fluent;
  };

export type EssentialContext = Pick<
  BotContext,
  "db" | "api" | "fluentInstance"
>;

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
