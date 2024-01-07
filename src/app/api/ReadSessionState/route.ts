import { NextResponse } from "next/server";

import { Result$ReadSessionState } from "./typing";

import {
  DEFAULT_THEME_NAME,
  toThemeName,
} from "@/app/_/components/ThemeProvider/config";
import { withRouteErrorHandler } from "@/app/_/utils/route";

type ICookies = {
  get(name: string): { value: string } | undefined;
};

type Context$ReadSessionState = {
  reqCookies: ICookies;
};

export async function run$ReadSessionState(
  ctx: Context$ReadSessionState
): Promise<Result$ReadSessionState> {
  const themeName =
    toThemeName(ctx.reqCookies.get("theme")?.value) || DEFAULT_THEME_NAME;
  const threadId = ctx.reqCookies.get("threadId")?.value;
  return { sessionState: { themeName, threadId } };
}

export const GET = withRouteErrorHandler(async (req) => {
  const result = await run$ReadSessionState({ reqCookies: req.cookies });
  return NextResponse.json(result);
});
