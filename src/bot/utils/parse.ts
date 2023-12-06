import { assert } from "@/utils/assert";

type ParsedCallbackQueryData = {
  scheme: "wehere:";
  command: string;
  query: Record<string, string>;
};

export function parseCallbackQueryData(data: string): ParsedCallbackQueryData {
  const url = new URL(data);
  assert(url.protocol === "wehere:", `invalid protocol`);
  const matches = /^\/([a-z_]+)$/.exec(url.pathname);
  assert(matches?.length, "invalid pathname");

  return {
    scheme: url.protocol,
    command: matches[1],
    query: Object.fromEntries(url.searchParams.entries()),
  };
}
