import cx from "clsx";
import Link from "next/link";
import React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  href: string;
  icon?: React.ReactNode;
  label?: React.ReactNode;
};

export default function LinkButton({
  className,
  style,
  href,
  icon,
  label,
}: Props) {
  return (
    <Link className={cx(styles.container, className)} style={style} href={href}>
      <div className={styles.background}></div>
      <div className={styles.state}></div>
      <div className={styles.content}>
        {icon ? <div className={styles.icon}>{icon}</div> : undefined}
        {label ? <div className={styles.label}>{label}</div> : undefined}
      </div>
    </Link>
  );
}
