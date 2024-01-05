import styles from "./index.module.scss";
import { ThemeName } from "./typing";

export const THEME: Record<ThemeName, string> = {
  light: styles.light,
  dark: styles.dark,
};

export const DEFAULT_THEME_NAME: ThemeName = "light";

export function toThemeName(text: string | undefined): ThemeName | undefined {
  const sp = ThemeName.safeParse(text);
  return sp.success ? sp.data : undefined;
}

export function fromThemeName(
  themeName: ThemeName | undefined
): string | undefined {
  return themeName;
}
