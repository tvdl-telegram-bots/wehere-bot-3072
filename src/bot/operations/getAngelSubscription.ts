import { Db } from "mongodb";

import { ChatId } from "@/typing/common";
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
