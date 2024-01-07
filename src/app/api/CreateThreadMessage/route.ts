import { NextResponse } from "next/server";

import { run$CreateThreadMessage } from "./handler";
import { Params$CreateThreadMessage } from "./typing";

import { getAppCtx } from "@/app/_/utils/globals";
import { withRouteErrorHandler } from "@/app/_/utils/routing";

export const POST = withRouteErrorHandler(async (req) => {
  const params = await req.json().then(Params$CreateThreadMessage.parse);
  const ctx = await getAppCtx();
  await run$CreateThreadMessage(ctx, params);
  return NextResponse.json(null);
});
