import { z } from "zod";

import * as Telegram from "@/typing/telegram";

export const Params$CreateThreadMessage = z.object({
  threadId: z.string(),
  text: z.string(),
  entities: Telegram.MessageEntity.array().nullish(),
});

export type Params$CreateThreadMessage = z.infer<
  typeof Params$CreateThreadMessage
>;

export const Result$CreateThreadMessage = z.null();

export type Result$CreateThreadMessage = z.infer<
  typeof Result$CreateThreadMessage
>;
