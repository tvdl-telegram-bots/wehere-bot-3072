import type { Db } from "mongodb";

import type { Role, UserId } from "@/typing/common";
import { PersistentRole } from "@/typing/server";

export async function readRole(
  ctx: { db: Db },
  { userId }: { userId: UserId }
) {
  return await ctx.db
    .collection("role")
    .findOne({ userId })
    .then((doc) => PersistentRole.parse(doc))
    .catch(() => undefined);
}

export async function getRole(ctx: { db: Db }, userId: UserId): Promise<Role> {
  const persistentRole = await readRole(ctx, { userId });
  return persistentRole?.role || "mortal";
}
