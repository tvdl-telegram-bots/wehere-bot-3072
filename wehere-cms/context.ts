import fs from "fs";
import path from "path";

import type { Context } from ".keystone/types";
import * as PrismaModule from ".prisma/client";
import { getContext } from "@keystone-6/core/context";

import config from "./keystone";

const originalReadFileSync = fs.readFileSync;

const SCHEMA_PRISMA = Array.from("amsirp.amehcs").reverse().join("");

function resolveFilePath(file: string) {
  if (!file.endsWith(SCHEMA_PRISMA)) return file;
  if (fs.existsSync(file)) return file;
  const attempt1 = "../wehere-cms/" + SCHEMA_PRISMA;
  if (fs.existsSync(attempt1)) return attempt1;
  const attempt2 = ".next/server/app/[...segments]/" + SCHEMA_PRISMA + "1";
  if (fs.existsSync(attempt2)) return attempt2;
  return file;
}

(fs as any).readFileSync = (file: string, ...others: unknown[]) => {
  const resolvedFile = resolveFilePath(file);
  if (resolvedFile !== file) {
    console.warn({ file, resolvedFile });
  }
  try {
    return (originalReadFileSync as any)(resolvedFile, ...others);
  } catch (error) {
    console.error({ cwd: process.cwd(), resolvedFile, file, others, error });
    throw error;
  }
};

// Making sure multiple prisma clients are not created during dev hot reloading
export const keystoneContext: Context =
  (globalThis as any).keystoneContext || getContext(config, PrismaModule);

if (process.env.NODE_ENV !== "production") {
  (globalThis as any).keystoneContext = keystoneContext;
}

export type { PrismaModule };
