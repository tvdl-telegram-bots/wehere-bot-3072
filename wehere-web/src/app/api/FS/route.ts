import fs from "fs";

import { NextResponse } from "next/server";

import { getQuery, withRouteErrorHandler } from "@/app/_/utils/routing";

export const dynamic = "force-dynamic";

export const GET = withRouteErrorHandler(async (req) => {
  const { q } = getQuery(req);
  const names = fs.readdirSync(q ?? ".");
  return NextResponse.json({ names });
});
