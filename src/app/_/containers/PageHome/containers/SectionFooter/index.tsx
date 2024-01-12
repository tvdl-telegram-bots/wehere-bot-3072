import cx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import pngQrTelegram from "./assets/qr-telegram.png";
import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function SectionFooter({ className, style }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.divider}>
        <svg aria-hidden="true" width="100%" height="8" fill="none">
          <pattern id="a" width="91" height="8" patternUnits="userSpaceOnUse">
            <g clip-path="url(#clip0_2426_11367)">
              <path
                d="M114 4c-5.067 4.667-10.133 4.667-15.2 0S88.667-.667 83.6 4 73.467 8.667 68.4 4 58.267-.667 53.2 4 43.067 8.667 38 4 27.867-.667 22.8 4 12.667 8.667 7.6 4-2.533-.667-7.6 4s-10.133 4.667-15.2 0S-32.933-.667-38 4s-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0"
                stroke="currentColor"
                strokeLinecap="square"
              />
            </g>
          </pattern>
          <rect width="100%" height="100%" fill="url(#a)" />
        </svg>
      </div>
      <div className={styles.content}>
        <div className={styles.firstColumn}>
          <strong>{"WeHere"}</strong>
          <p>
            {
              "Là dự án do Thư viện Dương Liễu sáng lập, nhằm chia sẻ kiến thức về tâm lý cho tuổi vị thành niên."
            }
          </p>
          <p>{"© 2024 WeHere. Tất cả các quyền được bảo lưu."}</p>
        </div>
        <div className={styles.nextColumn}>
          <strong>{"Mạng xã hội"}</strong>
          <ul>
            <li>
              <Link href="#">{"Facebook"}</Link>
            </li>
            <li>
              <Link href="#">{"Instagram"}</Link>
            </li>
          </ul>
          <strong>{"Liên hệ"}</strong>
          <ul>
            <li>
              <Link href="#">{"support@example.com"}</Link>
            </li>
            <li>
              <Link href="#">{"+99 999999999"}</Link>
            </li>
          </ul>
        </div>
        <div className={styles.nextColumn}>
          <strong>{"Trạm Lắng Nghe trên Telegram"}</strong>
          <ul>
            <li>
              <Link href="#">{"WeHere_bot"}</Link>
            </li>
          </ul>
          <p>
            <Image
              className={styles.pngQrTelegram}
              style={{ width: "180px", height: "180px" }}
              src={pngQrTelegram}
              alt=""
            />
          </p>
        </div>
      </div>
    </div>
  );
}
