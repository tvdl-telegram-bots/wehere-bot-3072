import { z } from "zod";

import { MessageDirection, Timestamp } from "@/typing/common";
import * as Telegram from "@/typing/telegram";

export const ThreadMessage = z.object({
  id: z.string(),
  direction: MessageDirection,
  text: z.string().nullish(),
  entities: Telegram.MessageEntity.array().nullish(),
  createdAt: Timestamp.nullish(),
});

export type ThreadMessage = z.infer<typeof ThreadMessage>;

export const Params$GetThreadMessages = z
  .object({
    threadId: z.string(),
    since: z.string().nullish(),
    prior: z.string().nullish(),
    limit: z.coerce.number().safe(),
  })
  .refine(
    (data) => (data.since != null) !== (data.prior != null),
    "since xor prior is required"
  );

export type Params$GetThreadMessages = z.infer<typeof Params$GetThreadMessages>;

export const Result$GetThreadMessages = z.object({
  nextSince: z.string().nullish(),
  nextPrior: z.string().nullish(),
  results: ThreadMessage.array(),
});

export type Result$GetThreadMessages = z.infer<typeof Result$GetThreadMessages>;
