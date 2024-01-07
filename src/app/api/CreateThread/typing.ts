import { z } from "zod";

export const Params$CreateThread = z.object({
  force: z.boolean().nullish(),
});

export type Params$CreateThread = z.infer<typeof Params$CreateThread>;

export const Result$CreateThread = z.object({
  threadId: z.string(),
});

export type Result$CreateThread = z.infer<typeof Result$CreateThread>;
