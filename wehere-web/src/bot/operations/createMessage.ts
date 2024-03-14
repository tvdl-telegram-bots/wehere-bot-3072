import type { Db, WithoutId } from "mongodb";

import type { PersistentThreadMessage } from "@/typing/server";

export async function createMessage(
  { db }: { db: Db },
  { message }: { message: WithoutId<PersistentThreadMessage> }
): Promise<PersistentThreadMessage> {
  const ack = await db.collection("thread_message").insertOne(message);
  return { _id: ack.insertedId, ...message };
}
