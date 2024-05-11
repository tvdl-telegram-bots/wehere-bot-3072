import type { Db } from "mongodb";

import type { ChatId } from "@/typing/common";
import { PersistentAngelSubscription } from "@/typing/server";

export async function getAngelSubscription(
  ctx: { db: Db },
  { chatId }: { chatId: ChatId }
) {
  return await ctx.db
    .collection("angel_subscription")
    .findOne({ chatId })
    .then((doc) => PersistentAngelSubscription.parse(doc))
    .catch(() => undefined);
}

export async function setAngelSubscription(
  db: Db,
  { chatId }: { chatId: ChatId },
  updates: Partial<PersistentAngelSubscription> | null
) {
  if (updates == null) {
    return await db //
      .collection("angel_subscription")
      .deleteOne({ chatId });
  }
  return await db
    .collection("angel_subscription")
    .updateOne(
      { chatId },
      { $set: { updatedAt: Date.now(), ...updates } },
      { upsert: true }
    );
}
