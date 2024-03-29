import type { Db } from "mongodb";
import { ObjectId } from "mongodb";

import { run$ReadSessionState } from "../ReadSessionState/handler";

import type { Params$CreateThread, Result$CreateThread } from "./typing";

import { getThread_givenThreadId } from "@/bot/commands/GetThread";
import { createThread } from "@/bot/operations/createThread";

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

export async function run$CreateThread(
  ctx: Context$CreateThread,
  params: Params$CreateThread
): Promise<Result$CreateThread> {
  if (params.oneTimeUse) {
    const thread = await createThread(ctx, { platform: "web" });
    return { threadId: thread._id.toHexString() };
  }

  if (!params.force) {
    // NOTE: currently, if some error occurs, e.g. DB connection lost,
    // the mortal might end up losing the existing conversation entirely.
    // we should save the thread id to localStorage and allow user to
    // restore it. If we do so, we should introduce route /t/<threadId>
    // and add password to each thread.
    const currentThreadId = await run$ReadSessionState(ctx)
      .then((r) => r.sessionState.threadId)
      .catch(() => undefined);
    const currentThread = currentThreadId
      ? await getThread_givenThreadId(
          ctx,
          ObjectId.createFromHexString(currentThreadId)
        ).catch(() => undefined)
      : undefined;
    if (currentThread) {
      return { threadId: currentThread._id.toHexString() };
    }
  }

  const thread = await createThread(ctx, { platform: "web" });
  ctx.resCookies.set("threadId", thread._id.toHexString());
  return { threadId: thread._id.toHexString() };
}
