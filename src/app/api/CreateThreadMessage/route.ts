import { ObjectId, WithoutId } from "mongodb";
import { NextResponse } from "next/server";

import { Params$CreateThreadMessage } from "./typing";

import { getAppCtx } from "@/app/_/utils/globals";
import { withRouteErrorHandler } from "@/app/_/utils/route";
import { createMessage } from "@/bot/operations/createMessage";
import notifyNewMessage from "@/bot/operations/notifyNewMessage";
import { EssentialContext } from "@/types";
import { PersistentThreadMessage } from "@/typing/server";

async function run(ctx: EssentialContext, params: Params$CreateThreadMessage) {
  const message: WithoutId<PersistentThreadMessage> = {
    threadId: ObjectId.createFromHexString(params.threadId),
    direction: "from_mortal",
    originChatId: undefined, // TODO: handle this case
    originMessageId: undefined, // TODO: handle this case
    text: params.text,
    plainText: true,
    createdAt: Date.now(),
  };

  await createMessage(ctx.db, message);
  await notifyNewMessage(ctx, { message });
}

export const POST = withRouteErrorHandler(async (req) => {
  const params = await req.json().then(Params$CreateThreadMessage.parse);
  const ctx = await getAppCtx();

  await run(ctx, params);

  return NextResponse.json(null);
});
