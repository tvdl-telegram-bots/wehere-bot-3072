import { Db, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import { Params$GetThreadMessages, Result$GetThreadMessages } from "./typing";

import { getAppDb } from "@/app/_/utils/globals";
import {
  getQuery,
  toPipeline,
  withRouteErrorHandler,
} from "@/app/_/utils/route";
import { PersistentThreadMessage } from "@/typing/server";
import { compareObjectId, parseDocs } from "@/utils/array";
import { assert } from "@/utils/assert";

async function getThreadMessages(
  db: Db,
  { threadId, since, prior, limit }: Params$GetThreadMessages
): Promise<Result$GetThreadMessages> {
  assert((since == null) !== (prior == null));

  const docs = await db
    .collection("thread_message")
    .aggregate(
      toPipeline(function* () {
        yield { $match: { threadId: ObjectId.createFromHexString(threadId) } };
        yield since
          ? { $match: { _id: { $gte: ObjectId.createFromHexString(since) } } }
          : prior
          ? { $match: { _id: { $lt: ObjectId.createFromHexString(prior) } } }
          : undefined;
        yield since
          ? { $sort: { _id: +1 } }
          : prior
          ? { $sort: { _id: -1 } }
          : undefined;
        yield { $limit: limit + 1 };
      })
    )
    .toArray();

  const messages = parseDocs(PersistentThreadMessage)(docs.slice(0, limit))
    .sort((a, b) => compareObjectId(a._id, b._id))
    .map((p) => ({
      id: p._id.toHexString(),
      direction: p.direction,
      text: p.text,
      createdAt: p.createdAt,
    }));

  return {
    nextPrior:
      prior != null ? docs[limit]?._id?.toHexString() || null : undefined,
    nextSince:
      since != null ? docs[limit]?._id?.toHexString() || null : undefined,
    results: messages,
  };
}

export const GET = withRouteErrorHandler(async (req) => {
  const db = await getAppDb();
  const params = Params$GetThreadMessages.parse(getQuery(req));
  const result = await getThreadMessages(db, params);
  return NextResponse.json(result);
});
