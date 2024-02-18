import { Db } from "mongodb";

import { UserId } from "../../../typing/common";

import { PersistentRole } from "@/typing/server";

export async function getRole(db: Db, userId: UserId) {
  const doc = await db
    .collection("role")
    .findOne({ userId })
    .then((doc) => doc && PersistentRole.parse(doc));
  return doc?.role || "mortal";
}
