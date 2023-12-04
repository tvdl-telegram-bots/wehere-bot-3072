import { webhookCallback } from "grammy";
import { NextApiRequest, NextApiResponse } from "next";

import { getAppBot } from "@/app/_/utils/globals";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bot = await getAppBot();
  await webhookCallback(bot, "next-js")(req, res);
}
