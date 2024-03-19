import cx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdChat } from "react-icons/md";

import jpgEins from "./assets/eins.jpg";
import styles from "./index.module.scss";

import BlendedBeans from "@/app/_/components/BlendedBeans";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function SectionHeadline({ className, style }: Props) {
  return (
    <section className={cx(styles.container, className)} style={style}>
      <div className={styles.leftColumn}>
        <BlendedBeans
          className={styles.blendedBeans1}
          numSteps={32}
          strokeWidth={0.5}
        />
        <BlendedBeans
          className={styles.blendedBeans2}
          numSteps={16}
          strokeWidth={0.5}
        />
        <h1>{"WeHere"}</h1>
        <p>
          {
            "WeHere là dự án tâm lý do Thư viện Dương Liễu sáng lập, nhằm chia sẻ kiến thức, câu chuyện, sự kiện về sức khỏe tinh thần của người trẻ."
          }
        </p>
        <p>
          {
            "Chào mừng đến với Trạm Lắng Nghe - một môi trường tâm lý an toàn dành cho những người gặp khó khăn về sức khỏe tinh thần. Dự án hoạt động trực tuyến trên nền tảng Telegram, cung cấp sự hỗ trợ tâm lý tức thời thông qua hoạt động lắng nghe, thấu cảm."
          }
        </p>
        <Link href="/chat">
          <div className={styles.background}></div>
          <div className={styles.state}></div>
          <div className={styles.content}>
            <div className={styles.icon}>
              <MdChat />
            </div>
            <div className={styles.label}>{"Trò chuyện cùng WeHere"}</div>
          </div>
        </Link>
      </div>
      <div className={styles.rightColumn}>
        <div className={styles.imageContainer}>
          <Image
            className={styles.image}
            src={jpgEins}
            alt=""
            sizes="(min-width: 840px) 67vw, 100vw"
            fill
          />
        </div>
      </div>
    </section>
  );
}
