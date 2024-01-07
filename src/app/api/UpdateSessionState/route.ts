import { NextResponse } from "next/server";

import { Params$UpdateSessionState } from "./typing";

import { withRouteErrorHandler } from "@/app/_/utils/route";

type Context$UpdateSessionState = { responseCookies: NextResponse["cookies"] };

export async function run$UpdateSessionState(
  ctx: Context$UpdateSessionState,
  params: Params$UpdateSessionState
) {
  if (params.sessionState.themeName !== undefined) {
    ctx.responseCookies.set("theme", params.sessionState.themeName);
  }
  if (params.sessionState.threadId !== undefined) {
    ctx.responseCookies.set("threadId", params.sessionState.threadId);
  }
}

export const POST = withRouteErrorHandler(async (req) => {
  const params = await req.json().then(Params$UpdateSessionState.parse);
  const response = NextResponse.json(null);
  await run$UpdateSessionState({ responseCookies: response.cookies }, params);
  return response;
});
