import { Api } from "grammy";
import { MongoClient, Db } from "mongodb";
import { unstable_serialize } from "swr";

import { getBot } from "@/bot/getBot";
import { getFluent } from "@/bot/getFluent";
import { ENV, FTL } from "@/env/next-server";
import { EssentialContext } from "@/types";

function getGlobalCache<R>(globalName: string): Map<string, R> {
  const g = globalThis as any;
  return g[globalName] || (g[globalName] = new Map());
}

function memoize<A extends unknown[], R>(
  fn: (...args: A) => R,
  cacheKey: string
) {
  return function (...args: A): R {
    const cache = getGlobalCache<R>(cacheKey);
    const key = unstable_serialize(args);
    if (cache.has(key)) {
      return cache.get(key) as R;
    } else {
      const result = fn(...args);
      cache.set(key, result);
      return result;
    }
  };
}

export async function getAppDb(): Promise<Db> {
  const connect = memoize(MongoClient.connect.bind(MongoClient), "d9c97d06");
  const client = await connect(ENV.MONGODB_URI);
  return client.db(ENV.MONGODB_DBNAME);
}

export async function getAppFluent() {
  return await memoize(getFluent, "af1cfb86")(FTL);
}

export async function getAppBot() {
  return await memoize(getBot, "aaae8238")({ env: ENV, ftl: FTL });
}

export async function getAppApi() {
  const getApi = memoize((token: string) => new Api(token), "1de5b691");
  return getApi(ENV.TELEGRAM_BOT_TOKEN);
}

export async function getAppCtx(): Promise<EssentialContext> {
  const [db, api, fluentInstance] = await Promise.all([
    getAppDb(),
    getAppApi(),
    getAppFluent(),
  ]);
  return { db, api, fluentInstance };
}
