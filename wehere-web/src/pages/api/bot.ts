import { webhookCallback } from "grammy";
import { NextApiRequest, NextApiResponse } from "next";

import { getAppDb, getAppFluent } from "@/app/_/utils/globals";
import { getBot0 } from "@/bot/getBot";
import { ENV } from "@/env/next-server";
import { formatErrorAsObject, formatErrorDeeply } from "@/utils/format";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getAppDb();
  const fluent = await getAppFluent();
  const bot = await getBot0({ db, fluent, env: ENV });

  try {
    await webhookCallback(bot, "next-js")(req, res);
  } catch (error) {
    console.error(formatErrorDeeply(error));
    await db.collection("error").insertOne(formatErrorAsObject(error));
    res.status(299).json(formatErrorAsObject(error));
  }
}
