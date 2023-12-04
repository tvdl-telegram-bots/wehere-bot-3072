"use client";

import cx from "clsx";
import React from "react";

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
  const resource_previousMessages = useResourceInfinite<
    Params$GetThreadMessages,
    Result$GetThreadMessages
  >({
    path: "/api/GetThreadMessages",
    initialParams: { threadId, prior: origin, limit: 12 },
    getNextParams: ({ params, result }) =>
      result.nextPrior ? { ...params, prior: result.nextPrior } : undefined,
    fetcher: httpGet(Result$GetThreadMessages),
  });

  return (
    <main
      className={cx(styles.container, className, "container")}
      style={style}
    >
      <ul>
        {resource_previousMessages.data?.map((page, index) => (
          <li key={index}>
            <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(page)}</pre>
          </li>
        ))}
      </ul>
      <button
        onClick={resource_previousMessages.loadMore}
        disabled={!resource_previousMessages.loadMore}
        aria-busy={resource_previousMessages.isLoading ? "true" : undefined}
      >
        Load More
      </button>
    </main>
  );
}
