import { Context } from ".keystone/types";
import * as PrismaModule from ".prisma/client";
import { getContext } from "@keystone-6/core/context";

import config from "./keystone";

// Making sure multiple prisma clients are not created during dev hot reloading
export const keystoneContext: Context =
  (globalThis as any).keystoneContext || getContext(config, PrismaModule);

if (process.env.NODE_ENV !== "production") {
  (globalThis as any).keystoneContext = keystoneContext;
}
