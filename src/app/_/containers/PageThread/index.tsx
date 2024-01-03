"use client";

import cx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";
import { MdArrowBack, MdChat, MdHome } from "react-icons/md";

import AutoTrigger from "../../components/AutoTrigger";
import LayoutBasic from "../../components/LayoutBasic";
import { useLayoutBasicApi } from "../../components/LayoutBasic/hooks/useLayoutBasicApi";
import LogoWeHere from "../../components/LogoWeHere";
import MessageComposer from "../../components/MessageComposer";
import MessageViewer from "../../components/MessageViewer";
import Navigation from "../../components/Navigation";
import { Item$Navigation } from "../../components/Navigation/types";
import TopAppBar from "../../components/TopAppBar";
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
  const router = useRouter();

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
    ...(resource_prevMessages.data?.slice().reverse() || []),
    ...(resource_nextMessages.data || []),
  ].flatMap((page) => page.results);

  const layoutBasicApi = useLayoutBasicApi();

  const items: Item$Navigation[] = [
    { icon: <MdHome />, label: "Trang chủ", href: "/" },
    { icon: <MdChat />, label: "Trò chuyện", href: "/t" },
  ];

  return (
    <LayoutBasic.Root className={cx(styles.container, className)} style={style}>
      <LayoutBasic.Top>
        <TopAppBar.Root
          label={<TopAppBar.Label label={"Trò chuyện cùng WeHere"} />}
          iconL={
            <TopAppBar.Button
              icon={<MdArrowBack />}
              onClick={() => router.back()}
            />
          }
        />
      </LayoutBasic.Top>
      <LayoutBasic.Left>
        {layoutBasicApi.navigationSidebar ? (
          <Navigation.Sidebar
            items={items}
            slotProduct={<LogoWeHere.Fixed variant="color" size="120px" />}
          />
        ) : (
          <pre>
            {JSON.stringify([
              layoutBasicApi.navigationSidebar,
              layoutBasicApi.navigationRail,
            ])}
          </pre>
        )}
      </LayoutBasic.Left>
      <LayoutBasic.Center className={styles.LayoutBasic_Center}>
        <div className={styles.loadingIndicator}>
          {resource_prevMessages.isLoading ? (
            <span aria-busy="true">{"Loading..."}</span>
          ) : resource_prevMessages.error ? (
            <button onClick={resource_prevMessages.loadMore}>
              {"Load previous messages"}
            </button>
          ) : (
            <AutoTrigger onVisible={resource_prevMessages.loadMore} />
          )}
        </div>
        <div className={styles.messageList}>
          {messages.map((m) => (
            <MessageViewer.Root key={m.id} message={m} />
          ))}
        </div>
        <div className={styles.loadingIndicator}>
          {resource_nextMessages.isLoading ? (
            <span aria-busy="true">{"Loading..."}</span>
          ) : resource_nextMessages.error ? (
            <button onClick={resource_nextMessages.loadMore}>
              {"Load previous messages"}
            </button>
          ) : (
            <AutoTrigger onVisible={resource_nextMessages.loadMore} />
          )}
        </div>
      </LayoutBasic.Center>
      <LayoutBasic.Bottom className={styles.LayoutBasic_Bottom}>
        <MessageComposer
          threadId={threadId}
          onMessageSent={() => resource_nextMessages.swr.mutate()}
        />
      </LayoutBasic.Bottom>
    </LayoutBasic.Root>
  );
}
