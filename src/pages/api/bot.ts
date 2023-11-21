import { webhookCallback } from "grammy";
import { NextApiRequest, NextApiResponse } from "next";

import { getBot } from "@/bot/getBot";
import { ENV, FTL } from "@/env/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bot = await getBot({ env: ENV, ftl: FTL });
  await webhookCallback(bot, "next-js")(req, res);
}
