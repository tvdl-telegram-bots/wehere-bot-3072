import { z } from "zod";

export type Env = z.infer<typeof Env>;
export const Env = z.object({
  TELEGRAM_BOT_TOKEN: z.string(),
});
