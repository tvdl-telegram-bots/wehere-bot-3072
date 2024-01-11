import cx from "clsx";
import React from "react";
import { MdSend } from "react-icons/md";

import styles from "./index.module.scss";

import { useWithErrorHandler } from "@/app/_/hooks/useWithErrorHandler";
import { httpPost } from "@/app/_/utils/swr";
import {
  Params$CreateThread,
  Result$CreateThread,
} from "@/app/api/CreateThread/typing";
import {
  Params$CreateThreadMessage,
  Result$CreateThreadMessage,
} from "@/app/api/CreateThreadMessage/typing";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function SectionNewsSubscription({ className, style }: Props) {
  const { busy, withErrorHandler } = useWithErrorHandler((error) => {
    console.error(error);
    alert(
      [
        "Đã có lỗi xảy ra.",
        error instanceof Error ? error.message : JSON.stringify(error),
      ].join("\n\n")
    );
  });
  const [email, setEmail] = React.useState("");

  return (
    <section className={cx(styles.container, className)} style={style}>
      <h2 className={styles.title}>{"Đăng ký nhận thông tin từ WeHere"}</h2>
      <fieldset className={styles.fieldset}>
        <input
          className={styles.input}
          type="email"
          placeholder="Email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
        />
        <ButtonFilled
          className={styles.button}
          icon={<MdSend />}
          label="Gửi"
          disabled={!email.includes("@") || busy}
          onClick={withErrorHandler(async () => {
            const { threadId } = await httpPost(Result$CreateThread)({
              path: "/api/CreateThread",
              params: { oneTimeUse: true } satisfies Params$CreateThread,
            });
            await httpPost(Result$CreateThreadMessage)({
              path: "/api/CreateThreadMessage",
              params: {
                text: ["Yêu cầu đăng ký nhận thông tin", email].join("\n\n"),
                threadId,
              } satisfies Params$CreateThreadMessage,
            });
            alert(`Đã đăng ký nhận thông tin từ WeHere với email: ${email}`);
            setEmail("");
          })}
        />
      </fieldset>
    </section>
  );
}

function ButtonFilled({
  className,
  style,
  icon,
  label,
  ...otherProps
}: {
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  label?: React.ReactNode;
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "style"
>) {
  return (
    <button
      className={cx(styles.ButtonFilled, className)}
      style={style}
      {...otherProps}
    >
      <div className={styles.background}></div>
      <div className={styles.state}></div>
      <div className={styles.content}>
        <div className={styles.icon}>{icon}</div>
        <div className={styles.label}>{label}</div>
      </div>
    </button>
  );
}
