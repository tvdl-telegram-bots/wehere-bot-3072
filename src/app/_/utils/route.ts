import { Document } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { notNullish } from "@/utils/array";
import { formatErrorDeeply } from "@/utils/format";

export function getQuery(req: NextRequest) {
  const entries = req.nextUrl.searchParams.entries();
  return Object.fromEntries(entries);
}

export function withRouteErrorHandler(
  cb: (req: NextRequest) => Promise<NextResponse>
) {
  return async function (req: NextRequest) {
    try {
      return await cb(req);
    } catch (error) {
      console.error(error);
      return new NextResponse(formatErrorDeeply(error), { status: 500 });
    }
  };
}

type StageKey =
  | "$addFields"
  | "$bucket"
  | "$bucketAuto"
  | "$changeStream"
  | "$changeStreamSplitLargeEvent"
  | "$collStats"
  | "$count"
  | "$densify"
  | "$documents"
  | "$facet"
  | "$fill"
  | "$geoNear"
  | "$graphLookup"
  | "$group"
  | "$indexStats"
  | "$limit"
  | "$listSampledQueries"
  | "$listSearchIndexes"
  | "$listSessions"
  | "$lookup"
  | "$match"
  | "$merge"
  | "$out"
  | "$planCacheStats"
  | "$project"
  | "$redact"
  | "$replaceRoot"
  | "$replaceWith"
  | "$sample"
  | "$search"
  | "$searchMeta"
  | "$set"
  | "$setWindowFields"
  | "$skip"
  | "$sort"
  | "$sortByCount"
  | "$unionWith"
  | "$unset"
  | "$unwind";

type Stage = Partial<Record<StageKey, unknown>>;

export function toPipeline(
  cb: () => Generator<Stage | null | undefined>
): Document[] {
  return Array.from(cb()).filter(notNullish);
}
