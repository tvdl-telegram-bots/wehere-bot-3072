import { NextResponse } from "next/server";

import { run$GetThreadMessages } from "./handler";
import { Params$GetThreadMessages } from "./typing";

import { getAppDb } from "@/app/_/utils/globals";
import { getQuery, withRouteErrorHandler } from "@/app/_/utils/routing";

export const GET = withRouteErrorHandler(async (req) => {
  const db = await getAppDb();
  const params = Params$GetThreadMessages.parse(getQuery(req));
  const result = await run$GetThreadMessages(db, params);
  return NextResponse.json(result);
});
