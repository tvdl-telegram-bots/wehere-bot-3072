import cx from "clsx";
import React from "react";

import styles from "./index.module.scss";

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
      await fetch("/api/CreateThreadMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, threadId }),
      });
      setText("");
      onMessageSent?.();
    } catch {
      alert("an error occured");
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
        {"Send"}
      </button>
    </div>
  );
}
