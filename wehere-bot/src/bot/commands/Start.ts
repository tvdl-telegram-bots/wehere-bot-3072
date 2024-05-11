import { InlineKeyboard } from "grammy";

import type { Command } from "../../types";
import { getAngelSubscription } from "../operations/Angel";
import { getChatLocale } from "../operations/Chat";
import { getThread_givenMortalChatId } from "../operations/Thread";

import type { Role } from "@/typing/common";
import { PersistentRole, PersistentThread } from "@/typing/server";
import { parseDocs } from "@/utils/array";
import { nonNullable } from "@/utils/assert";
import { withDefaultErrorHandler } from "@/utils/error";
import { formatThread, html } from "@/utils/format";

const handleMessage = withDefaultErrorHandler(async (ctx) => {
  const msg0 = nonNullable(ctx.message);
  const locale = await getChatLocale(ctx, msg0.chat.id);

  const roles = await ctx.db
    .collection("role")
    .find()
    .toArray()
    .then(parseDocs(PersistentRole));

  const greetFirstUser = async () => {
    await ctx.api.sendMessage(
      msg0.chat.id,
      ctx.withLocale(locale)("html-hello-you-alone", {
        user: html.strong(html.literal(msg0.from.id)),
      }),
      {
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard().text(
          ctx.withLocale(locale)("html-make-me-an-admin"),
          `wehere:/set_role?user=${msg0.from.id}&role=admin`
        ),
      }
    );
  };

  const greetAdmin = async () => {
    await ctx.api.sendMessage(
      msg0.chat.id,
      ctx.withLocale(locale)(
        "html-hello-admin",
        { user: html.strong(html.literal(msg0.from.id)) } //
      ),
      { parse_mode: "HTML" }
    );
  };

  const greetAngel = async () => {
    const angelSub = await getAngelSubscription(ctx, { chatId: msg0.chat.id });
    if (!angelSub) {
      await ctx.api.sendMessage(
        msg0.chat.id,
        [
          ctx.withLocale(locale)("html-hello-angel", {
            user: html.strong(html.literal(msg0.from.id)),
          }),
          ctx.withLocale(locale)("html-you-not-subscribing"),
        ].join("\n\n"),
        {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard().text(
            ctx.withLocale(locale)("text-subscribe"),
            "wehere:/subscribe"
          ),
        }
      );
    } else if (!angelSub.replyingToThreadId) {
      await ctx.api.sendMessage(
        msg0.chat.id,
        [
          ctx.withLocale(locale)(
            "html-hello-angel",
            { user: html.strong(html.literal(msg0.from.id)) } //
          ),
          ctx.withLocale(locale)("html-you-subscribed-but-replying"),
        ].join("\n\n"),
        {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard().text(
            ctx.withLocale(locale)("text-unsubscribe"),
            "wehere:/unsubscribe"
          ),
        }
      );
    } else {
      const thread = await ctx.db
        .collection("thread")
        .findOne(angelSub.replyingToThreadId)
        .then((doc) => PersistentThread.parse(doc));
      await ctx.api.sendMessage(
        msg0.chat.id,
        [
          ctx.withLocale(locale)(
            "html-hello-angel",
            { user: html.strong(html.literal(msg0.from.id)) } //
          ),
          ctx.withLocale(locale)(
            "html-you-subscribed-and-replying-to",
            { thread: html.strong(html.literal(formatThread(thread))) } //
          ),
        ].join("\n\n"),
        {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard().text(
            ctx.withLocale(locale)(
              "text-stop-replying",
              { thread: formatThread(thread) } //
            ),
            "wehere:/unsubscribe"
          ),
        }
      );
    }
  };

  const greetMortal = async () => {
    const thread = await getThread_givenMortalChatId(ctx, msg0.chat.id);
    await ctx.api.sendMessage(
      msg0.chat.id,
      ctx.withLocale(locale)(
        "html-hello-mortal",
        { user: html.strong(html.literal(formatThread(thread))) } //
      ),
      { parse_mode: "HTML" }
    );
  };

  const senderRole: Role =
    roles.find((r) => r.userId === msg0.from.id)?.role || "mortal";

  if (!roles.some((r) => r.role === "admin")) {
    await greetFirstUser();
  } else {
    switch (senderRole) {
      case "admin":
        await greetAdmin();
        await greetAngel();
        break;
      case "angel":
        await greetAngel();
        break;
      case "mortal":
        await greetMortal();
        break;
    }
  }
});

const Start: Command = {
  commandName: "start",
  handleMessage,
};

export default Start;
