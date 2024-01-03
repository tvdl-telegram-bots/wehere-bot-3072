import cx from "clsx";
import React from "react";
import { MdSend } from "react-icons/md";

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
  const [text, setText] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const handleSend = async () => {
    try {
      setBusy(true);
      await httpPost(Result$CreateThreadMessage)({
        path: "/api/CreateThreadMessage",
        params: { text, threadId },
      });
      setText("");
      onMessageSent?.();
    } catch (e) {
      console.error(e);
      alert(formatErrorShallowly(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={cx(styles.container, className)} style={style}>
      <textarea
        disabled={busy}
        className={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className={styles.button} onClick={handleSend} disabled={busy}>
        <MdSend />
      </button>
    </div>
  );
}
