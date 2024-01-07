import cx from "clsx";
import React from "react";

import styles from "./index.module.scss";

import { ThreadMessage } from "@/app/api/GetThreadMessages/typing";

function FromYou({
  className,
  style,
  message,
}: {
  className?: string;
  style?: React.CSSProperties;
  message: ThreadMessage;
}) {
  return (
    <div className={cx(styles.FromYou, className)} style={style}>
      <div className={styles.space}></div>
      <div className={styles.content}>{message.text}</div>
    </div>
  );
}

function FromZir({
  className,
  style,
  message,
}: {
  className?: string;
  style?: React.CSSProperties;
  message: ThreadMessage;
}) {
  return (
    <div className={cx(styles.FromZir, className)} style={style}>
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
      return <FromZir className={className} style={style} message={message} />;
    case "from_mortal":
      return <FromYou className={className} style={style} message={message} />;
  }
}

const MessageViewer = { FromYou, FromZir, Root };

export default MessageViewer;
