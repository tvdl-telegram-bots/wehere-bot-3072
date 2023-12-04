import { z } from "zod";

export const Params$CreateThreadMessage = z.object({
  threadId: z.string(),
  text: z.string(),
});

export type Params$CreateThreadMessage = z.infer<
  typeof Params$CreateThreadMessage
>;

export const Result$CreateThreadMessage = z.null();

export type Result$CreateThreadMessage = z.infer<
  typeof Result$CreateThreadMessage
>;
