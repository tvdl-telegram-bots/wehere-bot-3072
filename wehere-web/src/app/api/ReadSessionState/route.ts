import { NextResponse } from "next/server";

import { run$ReadSessionState } from "./handler";

import { withRouteErrorHandler } from "@/app/_/utils/routing";

export const GET = withRouteErrorHandler(async (req) => {
  const result = await run$ReadSessionState({ reqCookies: req.cookies });
  return NextResponse.json(result);
});

export const POST = withRouteErrorHandler(async (req) => {
  const result = await run$ReadSessionState({ reqCookies: req.cookies });
  return NextResponse.json(result);
});
