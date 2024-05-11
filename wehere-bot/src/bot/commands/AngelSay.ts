import { InlineKeyboard } from "grammy";
import type { Message } from "grammy/types";
import type { Db, WithoutId } from "mongodb";

import { getAngelSubscription } from "../operations/Angel";
import { getChatLocale } from "../operations/Chat";
import { getThread_givenThreadId } from "../operations/Thread";
import { createMessage, notifyNewMessage } from "../operations/ThreadMessage";

import type { BotContext, Command } from "@/types";
import type {
  PersistentObjectId,
  PersistentThreadMessage,
} from "@/typing/server";
import { nonNullable } from "@/utils/assert";
import { withDefaultErrorHandler } from "@/utils/error";
import { isMessagePlainText } from "@/utils/format";

function isMessageTooComplexForWeb(msg0: Message) {
  return msg0.entities?.some(
    (ent) =>
      ![
        "url",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "code",
        "pre",
        "text_link",
      ].includes(ent.type)
  );
}

async function isMortalUsingWeb(
  ctx: { db: Db },
  { threadId }: { threadId: PersistentObjectId }
) {
  const thread = await getThread_givenThreadId(ctx, threadId) //
    .catch(() => undefined);
  return thread?.platform === "web";
}

async function sayYouAreNotSubscribing(ctx: BotContext) {
  const msg0 = nonNullable(ctx.message);
  const locale = await getChatLocale(ctx, msg0.chat.id);

  await ctx.api.sendMessage(
    msg0.chat.id,
    ctx.withLocale(locale)("html-not-subscribing"),
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard().text(
        ctx.withLocale(locale)("text-subscribe"),
        `wehere:/subscribe`
      ),
    }
  );
}

async function sayYouAreNotReplyingAnyone(ctx: BotContext) {
  const msg0 = nonNullable(ctx.message);
  const locale = await getChatLocale(ctx, msg0.chat.id);

  await ctx.api.sendMessage(
    msg0.chat.id,
    ctx.withLocale(locale)("html-not-replying-anyone"),
    { parse_mode: "HTML" }
  );
}

async function sayYouAreSendingComplexMessage(ctx: BotContext) {
  const msg0 = nonNullable(ctx.message);
  const locale = await getChatLocale(ctx, msg0.chat.id);

  await ctx.api.sendMessage(
    msg0.chat.id,
    ctx.withLocale(locale)("html-can-only-send-plaintext"),
    { parse_mode: "HTML" }
  );
}

function composeMessage({
  threadId,
  msg0: msg0,
}: {
  threadId: PersistentObjectId;
  msg0: Message;
}): WithoutId<PersistentThreadMessage> {
  const message: WithoutId<PersistentThreadMessage> = {
    threadId,
    direction: "from_angel",
    originChatId: msg0.chat.id,
    originMessageId: msg0.message_id,
    text: msg0.text,
    entities: msg0.entities,
    plainText: isMessagePlainText(msg0),
    createdAt: Date.now(),
  };

  return message;
}

const handleMessage = withDefaultErrorHandler(async (ctx) => {
  const msg0 = nonNullable(ctx.message);
  const angelSub = await getAngelSubscription(ctx, { chatId: msg0.chat.id });

  if (!angelSub) {
    await sayYouAreNotSubscribing(ctx);
    return;
  }

  if (!angelSub.replyingToThreadId) {
    await sayYouAreNotReplyingAnyone(ctx);
    return;
  }

  const threadId = angelSub.replyingToThreadId;
  const message = composeMessage({ threadId, msg0 });
  await createMessage(ctx, { message });
  await notifyNewMessage(ctx, { message });

  if (!isMessagePlainText(msg0) && isMessageTooComplexForWeb(msg0)) {
    if (await isMortalUsingWeb(ctx, { threadId })) {
      await sayYouAreSendingComplexMessage(ctx);
    }
  }
});

const AngelSay = {
  commandName: "angel_say",
  handleMessage,
} satisfies Command;

export default AngelSay;
