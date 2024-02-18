import cx from "clsx";
import React from "react";

import styles from "./index.module.scss";

type Length = `${number}${"px" | "em"}`;

function Fixed({
  className,
  style,
  width,
  height,
  content,
  children = content,
}: {
  className?: string;
  style?: React.CSSProperties;
  width: Length;
  height: Length;
  content?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cx(styles.Fixed, className)}
      style={
        {
          "--width": width,
          "--height": height,
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

function Fill({
  className,
  style,
  content,
  children = content,
}: {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className={cx(styles.Fill, className)} style={style}>
      {children}
    </div>
  );
}

function AutoHeight({
  className,
  style,
  ratio,
  content,
  children = content,
}: {
  className?: string;
  style?: React.CSSProperties;
  ratio: number;
  content?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cx(styles.AutoHeight, className)}
      style={
        {
          "--relative-height": `${(100 / ratio).toFixed(6)}%`,
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

const Frame = { Fixed, Fill, AutoHeight };

export default Frame;
