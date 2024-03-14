import type { WithoutId } from "mongodb";
import { ObjectId } from "mongodb";

import type { Params$CreateThreadMessage } from "./typing";

import { autoReplyIfNeeded } from "@/bot/operations/autoReply";
import { createMessage } from "@/bot/operations/createMessage";
import { notifyNewMessage } from "@/bot/operations/notifyNewMessage";
import type { EssentialContext } from "@/types";
import type { PersistentThreadMessage } from "@/typing/server";

export async function run$CreateThreadMessage(
  ctx: EssentialContext,
  params: Params$CreateThreadMessage
) {
  const threadId = ObjectId.createFromHexString(params.threadId);
  const message: WithoutId<PersistentThreadMessage> = {
    threadId,
    direction: "from_mortal",
    originChatId: undefined,
    originMessageId: undefined,
    text: params.text,
    entities: params.entities,
    plainText: true,
    createdAt: Date.now(),
  };

  await createMessage(ctx, { message });
  await notifyNewMessage(ctx, { message });
  await autoReplyIfNeeded(ctx, { threadId });
}
