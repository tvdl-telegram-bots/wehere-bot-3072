import { NextResponse } from "next/server";

import { run$CreateThread } from "./handler";
import { Params$CreateThread } from "./typing";

import { getAppDb } from "@/app/_/utils/globals";
import { withRouteErrorHandler } from "@/app/_/utils/routing";

export const POST = withRouteErrorHandler(async (req) => {
  const params = await req.json().then(Params$CreateThread.parse);
  const db = await getAppDb();

  const resCookies = new Map<string, string>();
  const result = await run$CreateThread(
    { db, reqCookies: req.cookies, resCookies },
    params
  );

  const response = NextResponse.json(result);
  Array.from(resCookies.entries()).forEach(([key, value]) =>
    response.cookies.set(key, value)
  );
  return response;
});
