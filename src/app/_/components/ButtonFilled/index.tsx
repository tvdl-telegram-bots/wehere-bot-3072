import cx from "clsx";
import React from "react";

import styles from "./index.module.scss";

type OwnProps = {
  className?: string;
  style?: React.CSSProperties;
  label?: React.ReactNode;
};

type ForwardedProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

type Props = OwnProps & Omit<ForwardedProps, keyof OwnProps>;

export default function ButtonFilled({
  className,
  style,
  label,
  ...otherProps
}: Props) {
  return (
    <button
      className={cx(styles.container, className)}
      style={style}
      {...otherProps}
    >
      <div className={styles.background}></div>
      <div className={styles.state}></div>
      <div className={styles.content}>
        <div className={styles.label}>{label}</div>
      </div>
    </button>
  );
}
