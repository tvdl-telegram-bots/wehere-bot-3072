import { Db } from "mongodb";

import { PersistentRole, UserId } from "../typing";

export async function getRole(db: Db, userId: UserId) {
  const doc = await db
    .collection("role")
    .findOne({ userId })
    .then((doc) => doc && PersistentRole.parse(doc));
  return doc?.role || "mortal";
}
