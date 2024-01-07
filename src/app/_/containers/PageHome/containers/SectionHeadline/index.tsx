import cx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdChat, MdSend } from "react-icons/md";

import jpgEins from "./assets/eins.jpg";
import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function SectionHeadline({ className, style }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.leftColumn}>
        <h1>{"WeHere"}</h1>
        <p>
          {
            "Chào mừng bạn đến với WeHere, dự án tâm lý phi lợi nhuận do Thư viện Dương Liễu bảo trợ. Chúng tôi chấp nhận và lắng nghe mọi người, đặc biệt là nhóm tuổi vị thành niên và mở rộng đến phụ huynh, giáo viên."
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
            sizes="(min-width: 840px) 50vw, 100vw"
            fill
          />
        </div>
      </div>
    </div>
  );
}
