import cx from "clsx";
import React from "react";

import styles from "./index.module.scss";

import { ThreadMessage } from "@/app/api/GetThreadMessages/typing";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  message: ThreadMessage;
};

export default function MessageViewer({ className, style, message }: Props) {
  return (
    <div
      className={cx(
        styles.container,
        className,
        message.direction === "from_mortal"
          ? styles.direction_fromMortal
          : message.direction === "from_angel"
          ? styles.direction_fromAngel
          : undefined
      )}
      style={style}
      data-direction={message.direction}
    >
      <div className={styles.avatar}></div>
      <div className={styles.content}>{message.text}</div>
      <div className={styles.space}></div>
    </div>
  );
}
