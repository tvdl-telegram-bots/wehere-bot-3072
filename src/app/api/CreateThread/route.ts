import { NextResponse } from "next/server";

import { Result$CreateThread } from "./typing";

import { getAppCtx } from "@/app/_/utils/globals";
import { withRouteErrorHandler } from "@/app/_/utils/route";
import { createThread } from "@/bot/operations/createThread";
import { EssentialContext } from "@/types";

async function run(ctx: EssentialContext): Promise<Result$CreateThread> {
  const thread = await createThread(ctx);
  return { threadId: thread._id.toHexString() };
}

export const POST = withRouteErrorHandler(async () => {
  const ctx = await getAppCtx();
  const result = await run(ctx);
  return NextResponse.json(result);
});
