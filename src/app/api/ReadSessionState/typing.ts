import { z } from "zod";

import { ThemeName } from "@/app/_/components/ThemeProvider/typing";

export const SessionState = z.object({
  themeName: ThemeName,
});

export type SessionState = z.infer<typeof SessionState>;

export const Result$ReadSessionState = z.object({
  sessionState: SessionState,
});

export type Result$ReadSessionState = z.infer<typeof Result$ReadSessionState>;
