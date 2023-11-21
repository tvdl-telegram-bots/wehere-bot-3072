import { ConversationFlavor } from "@grammyjs/conversations";
import { FluentContextFlavor } from "@grammyjs/fluent";
import { Context, Middleware } from "grammy";
import { Db } from "mongodb";

export type BotContext = Context &
  ConversationFlavor &
  FluentContextFlavor & {
    db: Db;
  };

export type Command = {
  commandName: string;
  handler: (ctx: BotContext) => Promise<void>;
  middleware?: Middleware<BotContext>;
  handleCallbackQuery?: (ctx: BotContext) => Promise<void>;
};
