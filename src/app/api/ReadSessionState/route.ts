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
  cookies: ICookies;
};

export async function run$ReadSessionState(
  ctx: Context$ReadSessionState
): Promise<Result$ReadSessionState> {
  const themeName =
    toThemeName(ctx.cookies.get("theme")?.value) || DEFAULT_THEME_NAME;
  return { sessionState: { themeName } };
}

export const GET = withRouteErrorHandler(async (req) => {
  const result = await run$ReadSessionState({ cookies: req.cookies });
  return NextResponse.json(result);
});
