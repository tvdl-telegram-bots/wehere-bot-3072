import cx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaPhoneAlt,
  FaTelegram,
} from "react-icons/fa";

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
          <p style={{ fontWeight: "600" }}>{"WeHere Vietnam"}</p>
          <p>
            <span>{"Proudly created by "}</span>
            <Link
              href="https://thuvienduonglieu.com/"
              target="_blank"
              rel="noreferrer"
            >
              {"Duonglieu Library"}
            </Link>
          </p>
        </div>
        <div className={styles.nextColumn}>
          <strong>{"Mạng xã hội"}</strong>
          <ul>
            <li>
              <Link
                className={styles.socialLinkWithIcon}
                href="https://www.facebook.com/weherevietnam"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebook />
                <span>{"Facebook"}</span>
              </Link>
            </li>
            <li>
              <Link
                className={styles.socialLinkWithIcon}
                href="https://www.instagram.com/wehere.vn/"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram />
                <span>{"Instagram"}</span>
              </Link>
            </li>
          </ul>
          <strong>{"Liên hệ"}</strong>
          <ul>
            <li>
              <Link
                className={styles.socialLinkWithIcon}
                href="mailto:wehere.vn@gmail.com"
              >
                <FaEnvelope />
                <span>{"wehere.vn@gmail.com"}</span>
              </Link>
            </li>
            <li>
              <Link
                className={styles.socialLinkWithIcon}
                href="tel:+84968776964"
              >
                <FaPhoneAlt />
                <span>{"(+84) 96-877-6964"}</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.nextColumn}>
          <strong>{"Trạm Lắng Nghe trên Telegram"}</strong>
          <ul>
            <li>
              <Link
                className={styles.socialLinkWithIcon}
                href="https://t.me/WeHere_bot"
                target="_blank"
                rel="noreferrer"
              >
                <span>{"@WeHere_bot"}</span>
              </Link>
            </li>
          </ul>
          <p>
            <Link
              href="https://t.me/WeHere_bot"
              target="_blank"
              rel="noreferrer"
            >
              <Image
                className={styles.pngQrTelegram}
                style={{ width: "200px", height: "200px" }}
                src={pngQrTelegram}
                alt="link to WeHere_bot"
              />
            </Link>
          </p>
        </div>
      </div>
      <p className={styles.afterContent}>
        {"© 2024 WeHere. Tất cả các quyền được bảo lưu."}
      </p>
    </div>
  );
}
