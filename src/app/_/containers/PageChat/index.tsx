"use client";

import cx from "clsx";
import React from "react";
import useSWR from "swr";

import AppShell from "../../components/AppShell";
import AutoTrigger from "../../components/AutoTrigger";
import MessageComposer from "../../components/MessageComposer";
import MessageViewer from "../../components/MessageViewer";
import { httpGet, httpPost, useResourceInfinite } from "../../utils/swr";

import styles from "./index.module.scss";

import {
  Params$CreateThread,
  Result$CreateThread,
} from "@/app/api/CreateThread/typing";
import {
  Params$GetThreadMessages,
  Result$GetThreadMessages,
} from "@/app/api/GetThreadMessages/typing";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  origin: string;
};

export default function PageChat({ className, style, origin }: Props) {
  const swr$CreateThread = useSWR(
    { path: "/api/CreateThread", params: {} satisfies Params$CreateThread },
    httpPost(Result$CreateThread)
  );

  const threadId = swr$CreateThread.data?.threadId;

  const resource_prevMessages = useResourceInfinite<
    Params$GetThreadMessages,
    Result$GetThreadMessages
  >({
    path: "/api/GetThreadMessages",
    initialParams: threadId
      ? { threadId, prior: origin, limit: 12 }
      : undefined,
    getNextParams: ({ params, result }) =>
      result.nextPrior ? { ...params, prior: result.nextPrior } : undefined,
    fetcher: httpGet(Result$GetThreadMessages),
  });

  const resource_nextMessages = useResourceInfinite<
    Params$GetThreadMessages,
    Result$GetThreadMessages
  >({
    path: "/api/GetThreadMessages",
    initialParams: threadId
      ? { threadId, since: origin, limit: 12 }
      : undefined,
    getNextParams: ({ params, result }) =>
      result.nextPrior ? { ...params, prior: result.nextPrior } : undefined,
    fetcher: httpGet(Result$GetThreadMessages),
    swrConfig: { refreshInterval: 10000 },
  });

  const messages = [
    ...(resource_prevMessages.data?.slice().reverse() || []),
    ...(resource_nextMessages.data || []),
  ].flatMap((page) => page.results);

  return (
    <AppShell.Root
      className={cx(styles.container, className)}
      style={style}
      activePage="chat"
    >
      <AppShell.Left />
      <AppShell.Top label="Trò chuyện cùng WeHere" />
      <AppShell.Center className={styles.center}>
        <div className={styles.loadingIndicator}>
          {resource_prevMessages.isLoading ? (
            <span>{"Đang tải..."}</span>
          ) : resource_prevMessages.error ? (
            <button onClick={resource_prevMessages.loadMore}>
              {"Tải các tin nhắn trước đó"}
            </button>
          ) : (
            <AutoTrigger
              onVisible={
                resource_prevMessages.error
                  ? undefined
                  : resource_prevMessages.loadMore
              }
            />
          )}
        </div>
        <div className={styles.messageList}>
          {messages.map((m) => (
            <MessageViewer.Root key={m.id} message={m} />
          ))}
        </div>
        <div className={styles.loadingIndicator}>
          {resource_nextMessages.isLoading ? (
            <span>{"Đang tải..."}</span>
          ) : resource_nextMessages.error ? (
            <button onClick={resource_nextMessages.loadMore}>
              {"Tải các tin nhắn tiếp theo"}
            </button>
          ) : (
            <AutoTrigger
              onVisible={
                resource_nextMessages.error
                  ? undefined
                  : resource_nextMessages.loadMore
              }
            />
          )}
        </div>
      </AppShell.Center>
      <AppShell.Bottom className={styles.bottom}>
        {threadId ? (
          <MessageComposer
            threadId={threadId}
            onMessageSent={() => resource_nextMessages.swr.mutate()}
          />
        ) : undefined}
      </AppShell.Bottom>
    </AppShell.Root>
  );
}
