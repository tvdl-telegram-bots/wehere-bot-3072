import { Db, ObjectId } from "mongodb";

import { createThread } from "./createThread";

import { ChatId } from "@/typing/common";
import {
  PersistentMortalSubscription,
  PersistentThread,
} from "@/typing/server";

export async function getThread$GivenMortalChatId(
  ctx: { db: Db },
  chatId: ChatId
) {
  const existingMortalSub = await ctx.db
    .collection("mortal_subscription")
    .findOne({ chatId })
    .then((doc) => PersistentMortalSubscription.parse(doc))
    .catch(() => undefined);

  const existingThread = existingMortalSub?.threadId
    ? await ctx.db
        .collection("thread")
        .findOne({ _id: existingMortalSub.threadId })
        .then((doc) => PersistentThread.parse(doc))
        .catch(() => undefined)
    : undefined;

  if (existingThread) {
    return existingThread;
  }

  const newThread = await createThread(ctx);

  await ctx.db.collection("mortal_subscription").updateOne(
    { chatId },
    {
      $set: {
        threadId: newThread._id,
        updatedAt: Date.now(),
      } satisfies Partial<PersistentMortalSubscription>,
    },
    { upsert: true }
  );

  return newThread;
}

export async function getThread_givenThreadId(
  ctx: { db: Db },
  threadId: ObjectId
) {
  return await ctx.db
    .collection("thread")
    .findOne(threadId)
    .then((doc) => PersistentThread.parse(doc))
    .catch(() => undefined);
}
