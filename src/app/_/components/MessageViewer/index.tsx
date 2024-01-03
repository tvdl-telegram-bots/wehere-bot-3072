import cx from "clsx";
import React from "react";

import styles from "./index.module.scss";

import { ThreadMessage } from "@/app/api/GetThreadMessages/typing";

function FromMe({
  className,
  style,
  message,
}: {
  className?: string;
  style?: React.CSSProperties;
  message: ThreadMessage;
}) {
  return (
    <div className={cx(styles.FromMe, className)} style={style}>
      <div className={styles.space}></div>
      <div className={styles.content}>{message.text}</div>
    </div>
  );
}

function FromThem({
  className,
  style,
  message,
}: {
  className?: string;
  style?: React.CSSProperties;
  message: ThreadMessage;
}) {
  return (
    <div className={cx(styles.FromThem, className)} style={style}>
      <div className={styles.avatar}></div>
      <div className={styles.content}>{message.text}</div>
      <div className={styles.space}></div>
    </div>
  );
}

function Root({
  className,
  style,
  message,
}: {
  className?: string;
  style?: React.CSSProperties;
  message: ThreadMessage;
}) {
  switch (message.direction) {
    case "from_angel":
      return <FromThem className={className} style={style} message={message} />;
    case "from_mortal":
      return <FromMe className={className} style={style} message={message} />;
  }
}

function Legacy({
  className,
  style,
  message,
}: {
  className?: string;
  style?: React.CSSProperties;
  message: ThreadMessage;
}) {
  return (
    <div
      className={cx(
        styles.Legacy,
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

const MessageViewer = { Legacy, FromMe, FromThem, Root };

export default MessageViewer;
