import { z } from "zod";

export const ThemeName = z.enum(["light", "dark"]);

export type ThemeName = z.infer<typeof ThemeName>;
