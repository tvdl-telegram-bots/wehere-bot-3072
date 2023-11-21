import { Db } from "mongodb";

import {
  ChatId,
  PersistentConnection,
  PersistentSubscription,
  UserId,
} from "../typing";

export async function setSubscription(
  db: Db,
  {
    chatId,
    enabled,
    operator,
  }: {
    chatId: ChatId;
    enabled: boolean;
    operator: UserId | null | undefined;
  }
) {
  return await db.collection("subscription").updateOne(
    { chatId },
    {
      $set: {
        enabled,
        updatedAt: Date.now(),
        updatedBy: operator || null,
      } satisfies Partial<PersistentSubscription>,
    },
    { upsert: true }
  );
}

export async function setConnection(
  db: Db,
  {
    angelChatId,
    mortalChatId,
    operator,
  }: {
    angelChatId: ChatId;
    mortalChatId: ChatId | null;
    operator: UserId | null | undefined;
  }
) {
  return await db
    .collection("connection")
    .updateOne(
      { angelChatId },
      { $set: { mortalChatId, updatedBy: operator, updatedAt: Date.now() } },
      { upsert: true }
    );
}

export async function getConnection(
  db: Db,
  { angelChatId }: { angelChatId: ChatId }
): Promise<PersistentConnection | undefined> {
  return await db
    .collection("connection")
    .findOne({ angelChatId })
    .then((doc) => (doc ? PersistentConnection.parse(doc) : undefined));
}

export async function getAngelName(_db: Db, userId: UserId) {
  return `🤵 ${userId}`;
}

export async function getAdminName(_db: Db, userId: UserId) {
  return `🦸 ${userId}`;
}
