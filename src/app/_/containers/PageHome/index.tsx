"use client";

import cx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";
import { MdArrowBack, MdChat, MdHome } from "react-icons/md";

import ButtonFilled from "../../components/ButtonFilled";
import EmphasisContainer from "../../components/EmphasisContainer";
import LayoutBasic from "../../components/LayoutBasic";
import { useLayoutBasicApi } from "../../components/LayoutBasic/hooks/useLayoutBasicApi";
import LogoWeHere from "../../components/LogoWeHere";
import Navigation from "../../components/Navigation";
import { Item$Navigation } from "../../components/Navigation/types";
import TopAppBar from "../../components/TopAppBar";
import { httpPost } from "../../utils/swr";

import SectionFeatures from "./containers/SectionFeatures";
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
    { icon: <MdChat />, label: "Trò chuyện", href: "/t" },
  ];

  return (
    <LayoutBasic.Root className={cx(styles.container, className)} style={style}>
      {/* <LayoutBasic.Top>
        <TopAppBar.Root
          label={<TopAppBar.Label label={"Trò chuyện cùng WeHere"} />}
          iconL={
            <TopAppBar.Button
              icon={<MdArrowBack />}
              onClick={() => router.back()}
            />
          }
        />
      </LayoutBasic.Top> */}
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
        <EmphasisContainer
          title={"WeHere"}
          description={
            "Chào mừng bạn đến với WeHere, dự án tâm lý phi lợi nhuận do Thư viện Dương Liễu bảo trợ. Chúng tôi chấp nhận và lắng nghe mọi người, đặc biệt là nhóm tuổi vị thành niên và mở rộng đến phụ huynh, giáo viên."
          }
          slotAction={
            <ButtonFilled
              label="Trò chuyện với WeHere"
              onClick={handleStart}
              disabled={busy}
            />
          }
        />
        <SectionOurMission />
        <SectionFeatures />
      </LayoutBasic.Center>
    </LayoutBasic.Root>
  );
}
