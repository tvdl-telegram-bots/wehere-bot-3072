"use client";

import cx from "clsx";
import Link from "next/link";
import React from "react";

import AppShell from "../../components/AppShell";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function PageContact({ className, style }: Props) {
  return (
    <AppShell.Root
      className={cx(styles.container, className)}
      style={style}
      activePage="contact"
    >
      <AppShell.Left />
      <AppShell.Top label="Liên hệ" />
      <AppShell.Center className={styles.center}>
        <p>
          {
            "Nếu bạn có bất kỳ câu hỏi, cần tư vấn, muốn góp ý hoặc phản ánh về dịch vụ của chúng tôi, hãy đừng ngần ngại liên hệ với chúng tôi. Chúng tôi sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc."
          }
        </p>
        <ul>
          <li>
            <span>{"Email: "}</span>
            <Link href="mailto:wehere.vn@gmail.com">
              {"wehere.vn@gmail.com"}
            </Link>
          </li>
          <li>
            <span>{"Hotline: "}</span>
            <Link href="tel:+84968776964">{"(+84) 96-877-6964"}</Link>
          </li>
        </ul>
        <p>
          {
            "Chúng tôi cam kết đáp ứng và giải quyết mọi yêu cầu của bạn một cách nhanh chóng và chuyên nghiệp. Hãy để chúng tôi hỗ trợ bạn trên hành trình chăm sóc tâm lý của mình."
          }
        </p>
      </AppShell.Center>
    </AppShell.Root>
  );
}
