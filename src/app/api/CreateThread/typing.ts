import { z } from "zod";

export const Result$CreateThread = z.object({
  threadId: z.string(),
});

export type Result$CreateThread = z.infer<typeof Result$CreateThread>;
