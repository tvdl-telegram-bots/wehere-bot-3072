import cx from "clsx";
import React from "react";

import styles from "./index.module.scss";

function Root({
  className,
  style,
  label,
  iconL,
  iconR,
}: {
  className?: string;
  style?: React.CSSProperties;
  label: React.ReactNode;
  iconL?: React.ReactNode;
  iconR?: React.ReactNode;
}) {
  return (
    <div className={cx(styles.Root, className)} style={style}>
      <div className={styles.icon}>{iconL}</div>
      <div className={styles.label}>{label}</div>
      <div className={styles.icon}>{iconR}</div>
    </div>
  );
}

function Button({
  className,
  style,
  icon,
  ...otherProps
}: {
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "style"
>) {
  return (
    <button
      className={cx(styles.Button, className)}
      style={style}
      {...otherProps}
    >
      {icon}
    </button>
  );
}

function Label({
  className,
  style,
  label,
}: {
  className?: string;
  style?: React.CSSProperties;
  label: React.ReactNode;
}) {
  return (
    <div className={cx(styles.Label, className)} style={style}>
      {label}
    </div>
  );
}

const TopAppBar = { Root, Button, Label };

export default TopAppBar;
