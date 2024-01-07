import { Db, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import { run$ReadSessionState } from "../ReadSessionState/route";

import { Params$CreateThread, Result$CreateThread } from "./typing";

import { getAppDb } from "@/app/_/utils/globals";
import { withRouteErrorHandler } from "@/app/_/utils/route";
import { createThread } from "@/bot/operations/createThread";
import { getThread_givenThreadId } from "@/bot/operations/getThread";

type IRequestCookies = {
  get(name: string): { value: string } | undefined;
};

type IResponseCookies = {
  set(name: string, value: string): void;
};

type Context$CreateThread = {
  db: Db;
  reqCookies: IRequestCookies;
  resCookies: IResponseCookies;
};

async function run$CreateThread(
  ctx: Context$CreateThread,
  params: Params$CreateThread
): Promise<Result$CreateThread> {
  try {
    if (!params.force) {
      const { sessionState } = await run$ReadSessionState(ctx);
      if (sessionState.threadId) {
        const thread = await getThread_givenThreadId(
          ctx,
          ObjectId.createFromHexString(sessionState.threadId)
        );
        if (thread) {
          return { threadId: thread?._id.toHexString() };
        }
      }
    }
  } catch (e) {
    console.error(e); // intentional
  }

  const thread = await createThread(ctx);
  ctx.resCookies.set("threadId", thread._id.toHexString());
  return { threadId: thread._id.toHexString() };
}

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
