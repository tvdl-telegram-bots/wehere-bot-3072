import cx from "clsx";
import React from "react";

import LogoWeHere from "../LogoWeHere";

import styles from "./index.module.scss";
import { getEntityPartitions, renderPartition } from "./utils";

import { ThreadMessage } from "@/app/api/GetThreadMessages/typing";

function Content({
  className,
  style,
  message,
}: {
  className?: string;
  style?: React.CSSProperties;
  message: ThreadMessage;
  unstyled: true;
}) {
  const entityPartitions = React.useMemo(
    () => getEntityPartitions(message),
    [message]
  );

  return (
    <div className={cx(styles.Content, className)} style={style}>
      {entityPartitions.map((ptn, index) => (
        <React.Fragment key={index}>{renderPartition(ptn)}</React.Fragment>
      ))}
    </div>
  );
}

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
      <div className={styles.content}>
        <Content message={message} unstyled />
      </div>
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
      <div className={styles.avatar}>
        <LogoWeHere.Fixed size="48px" variant="color" />
      </div>
      <div className={styles.content}>
        <Content message={message} unstyled />
      </div>
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
