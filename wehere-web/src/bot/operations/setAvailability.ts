import type { Db, WithoutId } from "mongodb";

import type { PersistentAvailability } from "@/typing/server";

export async function setAvailability(
  ctx: { db: Db },
  { value }: { value: boolean }
) {
  const ack = await ctx.db
    .collection("availability") //
    .insertOne({
      createdAt: Date.now(),
      value,
    } satisfies WithoutId<PersistentAvailability>);
  return ack;
}
