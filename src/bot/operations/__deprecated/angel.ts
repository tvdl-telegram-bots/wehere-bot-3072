import { Db } from "mongodb";

import { ChatId } from "../../../typing/common";

import { PersistentAngelSubscription } from "@/typing/server";

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

export async function getAngelSubscription(
  db: Db,
  { chatId }: { chatId: ChatId }
) {
  const angelSub = await db
    .collection("angel_subscription")
    .findOne({ chatId })
    .then((doc) => PersistentAngelSubscription.parse(doc))
    .catch(() => undefined);
  return angelSub;
}
