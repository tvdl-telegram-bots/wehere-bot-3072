import { Db, ObjectId } from "mongodb";

import { run$ReadSessionState } from "../ReadSessionState/handler";

import { Params$CreateThread, Result$CreateThread } from "./typing";

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

export async function run$CreateThread(
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
