import { NextResponse } from "next/server";

import { Params$UpdateSessionState } from "./typing";

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
