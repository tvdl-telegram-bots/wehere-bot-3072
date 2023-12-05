"use client";

import cx from "clsx";
import React from "react";

import AutoTrigger from "../../components/AutoTrigger";
import MessageComposer from "../../components/MessageComposer";
import MessageViewer from "../../components/MessageViewer";
import { httpGet, useResourceInfinite } from "../../utils/swr";

import styles from "./index.module.scss";

import {
  Params$GetThreadMessages,
  Result$GetThreadMessages,
} from "@/app/api/GetThreadMessages/typing";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  threadId: string;
  origin: string;
};

export default function PageThread({
  className,
  style,
  threadId,
  origin,
}: Props) {
  const resource_prevMessages = useResourceInfinite<
    Params$GetThreadMessages,
    Result$GetThreadMessages
  >({
    path: "/api/GetThreadMessages",
    initialParams: { threadId, prior: origin, limit: 12 },
    getNextParams: ({ params, result }) =>
      result.nextPrior ? { ...params, prior: result.nextPrior } : undefined,
    fetcher: httpGet(Result$GetThreadMessages),
  });

  const resource_nextMessages = useResourceInfinite<
    Params$GetThreadMessages,
    Result$GetThreadMessages
  >({
    path: "/api/GetThreadMessages",
    initialParams: { threadId, since: origin, limit: 12 },
    getNextParams: ({ params, result }) =>
      result.nextPrior ? { ...params, prior: result.nextPrior } : undefined,
    fetcher: httpGet(Result$GetThreadMessages),
    swrConfig: { refreshInterval: 10000 },
  });

  const messages = [
    ...(resource_prevMessages.data?.toReversed() || []),
    ...(resource_nextMessages.data || []),
  ].flatMap((page) => page.results);

  return (
    <main
      className={cx(styles.container, className, "container")}
      style={style}
    >
      <div className={styles.loadingIndicator}>
        {resource_prevMessages.isLoading ? (
          <span aria-busy="true">{"Loading..."}</span>
        ) : (
          <AutoTrigger onVisible={resource_prevMessages.loadMore} />
        )}
      </div>
      <div className={styles.messageList}>
        {messages.map((m) => (
          <MessageViewer key={m.id} message={m} />
        ))}
      </div>
      <div className={styles.loadingIndicator}>
        {resource_nextMessages.isLoading ? (
          <span aria-busy="true">{"Loading..."}</span>
        ) : (
          <AutoTrigger onVisible={resource_nextMessages.loadMore} />
        )}
      </div>
      <MessageComposer
        style={{ margin: "12px 0" }}
        threadId={threadId}
        onMessageSent={() => resource_nextMessages.swr.mutate()}
      />
    </main>
  );
}
