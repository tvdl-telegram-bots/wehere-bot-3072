"use client";

import cx from "clsx";
import React from "react";

import AppShell from "../../components/AppShell";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function PageInfo({ className, style }: Props) {
  return (
    <AppShell.Root
      className={cx(styles.container, className)}
      style={style}
      // activePage=
    >
      <AppShell.Left />
      <AppShell.Top label="Thông tin" />
      <AppShell.Center></AppShell.Center>
    </AppShell.Root>
  );
}
