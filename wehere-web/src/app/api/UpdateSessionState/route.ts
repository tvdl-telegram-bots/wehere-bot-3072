import { NextResponse } from "next/server";

import { run$UpdateSessionState } from "./handler";
import { Params$UpdateSessionState } from "./typing";

import { withRouteErrorHandler } from "@/app/_/utils/routing";

export const POST = withRouteErrorHandler(async (req) => {
  const params = await req.json().then(Params$UpdateSessionState.parse);
  const response = NextResponse.json(null);
  await run$UpdateSessionState({ responseCookies: response.cookies }, params);
  return response;
});
