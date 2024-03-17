import type { Db } from "mongodb";

import type { Timestamp } from "@/typing/common";
import { PersistentAvailability } from "@/typing/server";

type ParsedAvailability = {
  value: boolean;
  since: Timestamp | null;
};

export async function getAvailability(ctx: {
  db: Db;
}): Promise<ParsedAvailability> {
  const persistentAvailability = await ctx.db
    .collection("availability")
    .findOne({}, { sort: { createdAt: -1 }, limit: 1 })
    .then(PersistentAvailability.parse)
    .catch(() => undefined);

  if (!persistentAvailability) {
    return { value: false, since: null };
  } else {
    return {
      value: persistentAvailability.value,
      since: persistentAvailability.createdAt,
    };
  }
}
