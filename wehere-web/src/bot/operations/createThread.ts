import type { Db, WithoutId } from "mongodb";

import { generateThreadEmoji, generateThreadName } from "./__deprecated/mortal";

import type { ThreadPlatform } from "@/typing/common";
import type { PersistentThread } from "@/typing/server";

export async function createThread(
  ctx: { db: Db },
  params: { platform: ThreadPlatform }
): Promise<PersistentThread> {
  const thread: WithoutId<PersistentThread> = {
    name: generateThreadName(),
    emoji: generateThreadEmoji(),
    createdAt: Date.now(),
    platform: params.platform,
  };

  const ack = await ctx.db.collection("thread").insertOne(thread);
  return { _id: ack.insertedId, ...thread };
}
