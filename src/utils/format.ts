import { notNullish } from "./array";

import { PersistentThread } from "@/typing/server";

export function formatThread(thread: PersistentThread) {
  return [thread.emoji || "❓", thread.name || "-"].join(" ");
}

export function formatErrorShallowly(error: unknown) {
  if (error instanceof Error) {
    return [error.name || "Error", error.message, error.stack]
      .filter(notNullish)
      .join("\n\n");
  } else if (error) {
    return JSON.stringify(error, null, 2);
  } else {
    return "Error";
  }
}

export function flattenError(error: unknown) {
  const causes = [];

  while (error) {
    causes.push(error);
    error = error instanceof Error && error.cause ? error.cause : undefined;
  }

  return causes;
}

export function formatErrorDeeply(error: unknown) {
  let result = "";
  const SEPARATOR = "\n\n" + "-".repeat(72) + "\n\n";
  const LENGTH_LIMIT = 100_000;

  for (const cause of flattenError(error)) {
    const chunk = formatErrorShallowly(cause);
    if (!result) {
      result = chunk;
    } else if (result.length + SEPARATOR.length + chunk.length > LENGTH_LIMIT) {
      break;
    } else {
      result += SEPARATOR + chunk;
    }
  }
  return result;
}
