"use client";

import cx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";

import { httpPost } from "../../utils/swr";

import styles from "./index.module.scss";

import { Result$CreateThread } from "@/app/api/CreateThread/typing";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function PageHome({ className, style }: Props) {
  const [busy, setBusy] = React.useState(false);
  const router = useRouter();

  const handleStart = async () => {
    try {
      setBusy(true);
      const result = await httpPost(Result$CreateThread)({
        path: "/api/CreateThread",
        params: {},
      });
      router.push(`/t/${result.threadId}`);
    } catch (e) {
      console.error(e);
      alert("an error occured");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main
      className={cx(styles.container, className, "container")}
      style={style}
    >
      <h1>{"WeHere"}</h1>
      <p>
        {
          "Là dự án do Thư viện Dương Liễu sáng lập, nhằm chia sẻ kiến thức về tâm lý cho tuổi vị thành niên."
        }
      </p>
      <button disabled={busy} onClick={handleStart}>
        {"Trò chuyện với chúng tôi"}
      </button>
    </main>
  );
}
