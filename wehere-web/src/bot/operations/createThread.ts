import { Db, WithoutId } from "mongodb";

import { generateThreadEmoji, generateThreadName } from "./__deprecated/mortal";

import { ThreadPlatform } from "@/typing/common";
import { PersistentThread } from "@/typing/server";

type Params = {
  platform: ThreadPlatform;
};

export async function createThread(
  ctx: { db: Db },
  params: Params
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
