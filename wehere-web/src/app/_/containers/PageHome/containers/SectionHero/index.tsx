import cx from "clsx";
import React from "react";
import { MdChat } from "react-icons/md";

import LinkButton from "./components/LinkButton";
import styles from "./index.module.scss";

import LogoWeHere from "@/app/_/components/LogoWeHere";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function SectionHero({ className, style }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.content}>
        <LogoWeHere.Fixed size="192px" useCurrentColor />
        <p className={styles.subtitle}>{"“you always have WeHere”"}</p>
        <p>
          {
            "WeHere là dự án tâm lý do Thư viện Dương Liễu sáng lập, nhằm chia sẻ kiến thức, câu chuyện, sự kiện về sức khỏe tinh thần của trẻ vị thành niên."
          }
        </p>
        <p>
          {
            "Chào mừng đến với Trạm Lắng Nghe - một môi trường tâm lý an toàn dành cho những người gặp khó khăn về sức khỏe tinh thần. Dự án hoạt động trực tuyến trên nền tảng Telegram và website chính thức của WeHere, cung cấp sự hỗ trợ tâm lý tức thời thông qua hoạt động lắng nghe, thấu cảm."
          }
        </p>
        <LinkButton
          href="/chat"
          icon={<MdChat />}
          label={"Trò chuyện cùng WeHere"}
        />
      </div>
    </div>
  );
}
