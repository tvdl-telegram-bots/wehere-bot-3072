"use client";

import cx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";
import { MdArrowBack, MdChat, MdHome, MdMenu } from "react-icons/md";

import ButtonFilled from "../../components/ButtonFilled";
import EmphasisContainer from "../../components/EmphasisContainer";
import LayoutBasic from "../../components/LayoutBasic";
import { useLayoutBasicApi } from "../../components/LayoutBasic/hooks/useLayoutBasicApi";
import LogoWeHere from "../../components/LogoWeHere";
import Navigation from "../../components/Navigation";
import { Item$Navigation } from "../../components/Navigation/types";
import ThemeProvider from "../../components/ThemeProvider";
import TopAppBar from "../../components/TopAppBar";
import { httpPost } from "../../utils/swr";

import SectionFeatures from "./containers/SectionFeatures";
import SectionHeadline from "./containers/SectionHeadline";
import SectionOurMission from "./containers/SectionOurMission";
import styles from "./index.module.scss";

import { Result$CreateThread } from "@/app/api/CreateThread/typing";
import { formatErrorShallowly } from "@/utils/format";

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
      alert(formatErrorShallowly(e));
    } finally {
      setBusy(false);
    }
  };

  const layoutBasicApi = useLayoutBasicApi();

  const items: Item$Navigation[] = [
    { icon: <MdHome />, label: "Trang chủ", href: "/", active: true },
    { icon: <MdChat />, label: "Trò chuyện", href: "/chat" },
  ];

  return (
    <ThemeProvider className={cx(styles.container, className)} style={style}>
      <LayoutBasic.Root>
        {!layoutBasicApi.navigationSidebar && !layoutBasicApi.navigationRail ? (
          <LayoutBasic.Top>
            <TopAppBar.Root
              label={<TopAppBar.Label label={"Trò chuyện cùng WeHere"} />}
              iconL={
                layoutBasicApi.topAppBar.buttonMenu ? (
                  <TopAppBar.Button
                    icon={<MdMenu />}
                    onClick={layoutBasicApi.topAppBar.buttonMenu.onClick}
                  />
                ) : layoutBasicApi.topAppBar.buttonBack ? (
                  <TopAppBar.Button
                    icon={<MdArrowBack />}
                    onClick={layoutBasicApi.topAppBar.buttonBack.onClick}
                  />
                ) : undefined
              }
            />
          </LayoutBasic.Top>
        ) : undefined}
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
          <SectionHeadline />
          <SectionOurMission />
          <SectionFeatures />
        </LayoutBasic.Center>
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
