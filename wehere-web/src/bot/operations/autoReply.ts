import type { WithoutId } from "mongodb";

import { createMessage } from "./createMessage";
import { notifyNewMessage } from "./notifyNewMessage";

import type { EssentialContext } from "@/types";
import type {
  PersistentObjectId,
  PersistentThreadMessage,
} from "@/typing/server";

function composeMessage({
  threadId,
}: {
  threadId: PersistentObjectId;
}): WithoutId<PersistentThreadMessage> {
  return {
    threadId,
    direction: "from_angel",
    originChatId: null,
    originMessageId: null,
    text: "We are online", // TODO: improve message
    entities: null,
    plainText: true,
    createdAt: Date.now(),
  };
}

export async function autoReplyIfNeeded(
  ctx: EssentialContext,
  { threadId }: { threadId: PersistentObjectId }
) {
  if (threadId.toHexString() === "") {
    return;
  }
  // TODO: improve condition

  const message = composeMessage({ threadId });
  await createMessage(ctx, { message });
  await notifyNewMessage(ctx, { message });
}
