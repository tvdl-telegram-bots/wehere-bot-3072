"use client";

import cx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";
import { MdArrowBack, MdChat, MdHome, MdMenu } from "react-icons/md";
import useSWR from "swr";

import AutoTrigger from "../../components/AutoTrigger";
import LayoutBasic from "../../components/LayoutBasic";
import { useLayoutBasicApi } from "../../components/LayoutBasic/hooks/useLayoutBasicApi";
import LogoWeHere from "../../components/LogoWeHere";
import MessageComposer from "../../components/MessageComposer";
import MessageViewer from "../../components/MessageViewer";
import Navigation from "../../components/Navigation";
import { Item$Navigation } from "../../components/Navigation/types";
import ThemeProvider from "../../components/ThemeProvider";
import TopAppBar from "../../components/TopAppBar";
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
  const layoutBasicApi = useLayoutBasicApi();

  const items: Item$Navigation[] = [
    { icon: <MdHome />, label: "Trang chủ", href: "/" },
    { icon: <MdChat />, label: "Trò chuyện", href: "/chat", active: true },
  ];

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
    <ThemeProvider className={cx(styles.container, className)} style={style}>
      <LayoutBasic.Root>
        <LayoutBasic.Top>
          <TopAppBar.Root
            label={<TopAppBar.Label label={"Trò chuyện cùng WeHere"} />}
            iconL={
              layoutBasicApi.topAppBar.buttonBack ? (
                <TopAppBar.Button
                  icon={<MdArrowBack />}
                  onClick={layoutBasicApi.topAppBar.buttonBack.onClick}
                />
              ) : layoutBasicApi.topAppBar.buttonMenu ? (
                <TopAppBar.Button
                  icon={<MdMenu />}
                  onClick={layoutBasicApi.topAppBar.buttonMenu.onClick}
                />
              ) : undefined
            }
          />
        </LayoutBasic.Top>
        <LayoutBasic.Left>
          {layoutBasicApi.navigationSidebar ? (
            <Navigation.Sidebar
              items={items}
              slotProduct={<LogoWeHere.Fixed variant="color" size="120px" />}
            />
          ) : layoutBasicApi.navigationRail ? (
            <Navigation.Rail
              items={items}
              buttonMenu={layoutBasicApi.navigationRail.buttonMenu}
            />
          ) : undefined}
        </LayoutBasic.Left>
        <LayoutBasic.Center className={styles.LayoutBasic_Center}>
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
        </LayoutBasic.Center>
        <LayoutBasic.Bottom className={styles.LayoutBasic_Bottom}>
          {threadId ? (
            <MessageComposer
              threadId={threadId}
              onMessageSent={() => resource_nextMessages.swr.mutate()}
            />
          ) : undefined}
        </LayoutBasic.Bottom>
        {layoutBasicApi.navigationModal ? (
          <LayoutBasic.Modal>
            <Navigation.Modal
              items={items}
              slotProduct={<LogoWeHere.Fixed variant="color" size="120px" />}
              onClickScrim={layoutBasicApi.navigationModal.onClose}
            />
          </LayoutBasic.Modal>
        ) : undefined}
      </LayoutBasic.Root>
    </ThemeProvider>
  );
}
