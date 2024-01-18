import { ObjectId, WithoutId } from "mongodb";

import { Params$CreateThreadMessage } from "./typing";

import { createMessage } from "@/bot/operations/createMessage";
import notifyNewMessage from "@/bot/operations/notifyNewMessage";
import { EssentialContext } from "@/types";
import { PersistentThreadMessage } from "@/typing/server";

export async function run$CreateThreadMessage(
  ctx: EssentialContext,
  params: Params$CreateThreadMessage
) {
  const message: WithoutId<PersistentThreadMessage> = {
    threadId: ObjectId.createFromHexString(params.threadId),
    direction: "from_mortal",
    originChatId: undefined,
    originMessageId: undefined,
    text: params.text,
    entities: params.entities,
    plainText: true,
    createdAt: Date.now(),
  };

  await createMessage(ctx.db, message);
  await notifyNewMessage(ctx, { message });
}
