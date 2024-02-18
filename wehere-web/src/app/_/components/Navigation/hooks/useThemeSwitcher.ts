import useSWR, { mutate } from "swr";
import { z } from "zod";

import { DEFAULT_THEME_NAME, THEME } from "../../ThemeProvider/config";
import { ThemeName } from "../../ThemeProvider/typing";

import { httpPost } from "@/app/_/utils/swr";
import { Result$ReadSessionState } from "@/app/api/ReadSessionState/typing";
import { Params$UpdateSessionState } from "@/app/api/UpdateSessionState/typing";

export function nextThemeName(themeName: ThemeName) {
  const allThemeNames = Object.keys(THEME) as ThemeName[];
  const index = allThemeNames.indexOf(themeName);
  const newIndex =
    index >= 0 && index + 1 < allThemeNames.length ? index + 1 : 0;
  return allThemeNames[newIndex];
}

export function useThemeSwitcher() {
  const { data: result$ReadSessionState } = useSWR(
    { path: "/api/ReadSessionState", params: {} },
    httpPost(Result$ReadSessionState)
  );

  const themeName =
    result$ReadSessionState?.sessionState?.themeName || DEFAULT_THEME_NAME;

  const updateThemeName = async (themeName: ThemeName) => {
    await httpPost(z.unknown())({
      path: "/api/UpdateSessionState",
      params: {
        sessionState: { themeName },
      } satisfies Params$UpdateSessionState,
    });
    await mutate({ path: "/api/ReadSessionState", params: {} });
  };

  return {
    themeName,
    updateThemeName,
  };
}
