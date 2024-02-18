import { Db, MongoClient } from "mongodb";

import { Env } from "@/typing/common";

async function connect(uri: string): Promise<MongoClient> {
  console.log("Connecting to:", uri);
  return await MongoClient.connect(uri);
}

export async function getDb({ env }: { env: Env }): Promise<Db> {
  const client = await connect(env.MONGODB_URI);
  return client.db(env.MONGODB_DBNAME);
}
