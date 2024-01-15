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
      <div className={styles.content}>
        <div className={styles.firstColumn}>
          <strong>{"WeHere Vietnam"}</strong>
          <p>{"Proudly created by Duonglieu Library"}</p>
          <p>{"© 2024 WeHere. Tất cả các quyền được bảo lưu."}</p>
        </div>
        <div className={styles.nextColumn}>
          <strong>{"Mạng xã hội"}</strong>
          <ul>
            <li>
              <Link
                href="https://www.facebook.com/weherevietnam"
                target="_blank"
                rel="noreferrer"
              >
                {"Facebook"}
              </Link>
            </li>
            <li>
              <Link
                href="https://www.instagram.com/wehere.vn/"
                target="_blank"
                rel="noreferrer"
              >
                {"Instagram"}
              </Link>
            </li>
          </ul>
          <strong>{"Liên hệ"}</strong>
          <ul>
            <li>
              <Link href="mailto:wehere.vn@gmail.com">
                {"wehere.vn@gmail.com"}
              </Link>
            </li>
            <li>
              <Link href="tel:+84968776964">{"(+84) 96-877-6964"}</Link>
            </li>
          </ul>
        </div>
        <div className={styles.nextColumn}>
          <strong>{"Trạm Lắng Nghe trên Telegram"}</strong>
          <ul>
            <li>
              <Link
                href="https://t.me/WeHere_bot"
                target="_blank"
                rel="noreferrer"
              >
                {"WeHere_bot"}
              </Link>
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
