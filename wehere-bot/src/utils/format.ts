import { HttpError } from "grammy";

import { notNullish } from "./array";

import type { PersistentThread } from "@/typing/server";

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
    error =
      error instanceof HttpError
        ? error.error
        : error instanceof Error && error.cause
        ? error.cause
        : undefined;
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

// https://chat.openai.com/c/a414f704-580b-4e92-a1f2-e26500d51726
export function formatErrorAsObject(error: unknown): {
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
