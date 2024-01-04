import cx from "clsx";
import Image from "next/image";
import React from "react";

import pngBackground from "./background.png";
import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  title?: React.ReactNode;
  description?: React.ReactNode;
  slotAction?: React.ReactNode;
};

export default function EmphasisContainer({
  className,
  style,
  title,
  description,
  slotAction,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Image
        style={{ objectFit: "cover" }}
        src={pngBackground}
        alt=""
        fill
        sizes="100vw"
        quality={100}
      />
      <div className={styles.content}>
        {title ? <div className={styles.title}>{title}</div> : undefined}
        {description ? (
          <div className={styles.description}>{description}</div>
        ) : undefined}
        {slotAction ? (
          <div className={styles.slotAction}>{slotAction}</div>
        ) : undefined}
      </div>
    </div>
  );
}
