import cx from "clsx";
import React from "react";
import useSWR from "swr";

import useBodyClasses from "../../hooks/useBodyClasses";
import { httpGet } from "../../utils/swr";

import { DEFAULT_THEME_NAME, THEME } from "./config";
import styles from "./index.module.scss";

import { Result$ReadSessionState } from "@/app/api/ReadSessionState/typing";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
};

export default function ThemeProvider({
  className,
  style,
  content,
  children = content,
}: Props) {
  const { data: result$ReadSessionState } = useSWR(
    { path: "/api/ReadSessionState", params: {} },
    httpGet(Result$ReadSessionState)
  );

  const themeName =
    result$ReadSessionState?.sessionState?.themeName || DEFAULT_THEME_NAME;

  return (
    <div
      className={cx(styles.container, className, THEME[themeName])}
      style={style}
    >
      {children}
    </div>
  );
}
