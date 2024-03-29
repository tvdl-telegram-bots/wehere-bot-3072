import cx from "clsx";
import React from "react";
import { MdSend } from "react-icons/md";

import { useWithErrorHandler } from "../../hooks/useWithErrorHandler";
import { httpPost } from "../../utils/swr";

import styles from "./index.module.scss";

import { Result$CreateThreadMessage } from "@/app/api/CreateThreadMessage/typing";
import { formatErrorShallowly } from "@/utils/format";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  threadId: string;
  onMessageSent?: () => void;
};

export default function MessageComposer({
  className,
  style,
  threadId,
  onMessageSent,
}: Props) {
  const { busy, withErrorHandler } = useWithErrorHandler((error) => {
    console.error(error);
    alert(["Đã có lỗi xảy ra.", formatErrorShallowly(error)].join("\n\n"));
  });

  const [text, setText] = React.useState("");

  const handleSend = withErrorHandler(async () => {
    await httpPost(Result$CreateThreadMessage)({
      path: "/api/CreateThreadMessage",
      params: { text, threadId },
    });
    setText("");
    onMessageSent?.();
  });

  return (
    <div className={cx(styles.container, className)} style={style}>
      <textarea
        disabled={busy}
        className={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={2048}
      />
      <button className={styles.button} onClick={handleSend} disabled={busy}>
        <MdSend />
      </button>
    </div>
  );
}
