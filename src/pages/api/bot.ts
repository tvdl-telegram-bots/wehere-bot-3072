import { webhookCallback } from "grammy";
import { NextApiRequest, NextApiResponse } from "next";

import { getAppDb, getAppFluent } from "@/app/_/utils/globals";
import { getBot0 } from "@/bot/getBot";
import { ENV } from "@/env/next-server";

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
    console.error(formatError(error));
    await db.collection("error").insertOne(formatError(error));
    res.status(299).json(formatError(error));
  }
}

// https://chat.openai.com/c/a414f704-580b-4e92-a1f2-e26500d51726
function formatError(error: unknown): {
  name?: string;
  message?: string;
  stack?: string | undefined;
} {
  if (error instanceof Error) {
    // If the input is an instance of Error, extract relevant properties
    const { name, message, stack } = error;

    return {
      name: name || undefined,
      message: message || undefined,
      stack: stack ? stack.toString() : undefined,
    };
  } else if (
    typeof error === "string" ||
    typeof error === "number" ||
    typeof error === "boolean" ||
    error === null
  ) {
    // If the input is a serializable type, create an object with the message property
    return {
      message: error?.toString(),
    };
  } else {
    // For other types, return an object with a generic message
    return {
      message: "Non-serializable error",
    };
  }
}
