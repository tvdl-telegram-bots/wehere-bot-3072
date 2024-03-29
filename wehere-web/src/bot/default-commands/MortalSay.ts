import type { Message } from "grammy/types";
import type { WithoutId } from "mongodb";

import { getThread_givenMortalChatId } from "../commands/GetThread";
import { autoReply, isAutoReplyNeeded } from "../operations/autoReply";
import { createMessage } from "../operations/createMessage";
import { getChatLocale } from "../operations/getChatLocale";
import { notifyNewMessage } from "../operations/notifyNewMessage";
import { withDefaultErrorHandler } from "../utils/error";
import { isMessagePlainText } from "../utils/misc";

import type { Command } from "@/types";
import type {
  PersistentThread,
  PersistentThreadMessage,
} from "@/typing/server";
import { nonNullable } from "@/utils/assert";

function composeMessage({
  thread,
  message,
}: {
  thread: PersistentThread;
  message: Message;
}): WithoutId<PersistentThreadMessage> {
  return {
    threadId: thread._id,
    direction: "from_mortal",
    originChatId: message.chat.id,
    originMessageId: message.message_id,
    text: message.text,
    entities: message.entities,
    plainText: isMessagePlainText(message),
    createdAt: Date.now(),
  };
}

const handleMessage = withDefaultErrorHandler(async (ctx) => {
  const msg0 = nonNullable(ctx.message);
  const locale = await getChatLocale(ctx, msg0.chat.id);
  const thread = await getThread_givenMortalChatId(ctx, msg0.chat.id);
  const threadId = thread._id;
  const message = composeMessage({ thread, message: msg0 });
  const shouldAutoReply = await isAutoReplyNeeded(ctx, { threadId });
  await createMessage(ctx, { message });
  await notifyNewMessage(ctx, { message, excludesChats: [msg0.chat.id] });
  shouldAutoReply && (await autoReply(ctx, { threadId, locale }));
});

const MortalSay = {
  commandName: "mortal_say",
  handleMessage,
} satisfies Command;

export default MortalSay;
