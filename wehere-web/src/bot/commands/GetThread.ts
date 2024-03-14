import type { Db } from "mongodb";

import { createThread } from "../operations/createThread";

import type { ChatId } from "@/typing/common";
import type { PersistentObjectId } from "@/typing/server";
import {
  PersistentMortalSubscription,
  PersistentThread,
} from "@/typing/server";

export async function queryThread_givenMortalChatId(
  { db }: { db: Db },
  chatId: ChatId
) {
  // Given the `chatId`, find the `threadId`
  const threadId = await db
    .collection("mortal_subscription")
    .findOne({ chatId })
    .then((doc) => PersistentMortalSubscription.parse(doc))
    .then((sub) => sub.threadId)
    .catch(() => undefined);
  if (!threadId) return undefined;

  // Given the `threadId`, find the `thread`
  const thread = await db
    .collection("thread")
    .findOne({ _id: threadId })
    .then((doc) => PersistentThread.parse(doc))
    .catch(() => undefined);
  return thread;
}

export async function updateMortalSubscription(
  ctx: { db: Db },
  params: { chatId: ChatId; threadId: PersistentObjectId }
) {
  await ctx.db.collection("mortal_subscription").updateOne(
    { chatId: params.chatId },
    {
      $set: {
        threadId: params.threadId,
        updatedAt: Date.now(),
      } satisfies Partial<PersistentMortalSubscription>,
    },
    { upsert: true }
  );
}

/**
 * Retrieves a thread from the mortal chat ID.
 * If the thread exists, it is returned.
 * If the thread does not exist, a new thread is created, subscribed, and returned.
 */
export async function getThread_givenMortalChatId(
  ctx: { db: Db },
  chatId: ChatId
) {
  // Find the thread given `chatId`. If exists, return.
  const existingThread = await queryThread_givenMortalChatId(ctx, chatId);
  if (existingThread) return existingThread;

  // If not exists, create a new thread, subscribe, and return.
  const newThread = await createThread(ctx, { platform: "telegram" });
  await updateMortalSubscription(ctx, { chatId, threadId: newThread._id });
  return newThread;
}

export async function getThread_givenThreadId(
  ctx: { db: Db },
  threadId: PersistentObjectId
) {
  return await ctx.db
    .collection("thread")
    .findOne(threadId)
    .then((doc) => PersistentThread.parse(doc))
    .catch(() => undefined);
}
