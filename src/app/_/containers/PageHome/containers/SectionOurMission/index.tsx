import cx from "clsx";
import React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function SectionOurMission({ className, style }: Props) {
  return (
    <section className={cx(styles.container, className)} style={style}>
      <h2>{"Sứ mệnh của chúng tôi"}</h2>
      <p>
        {
          "Mang sứ mệnh nâng cao nhận thức của cộng đồng về sức khỏe tinh thần thông qua hoạt động lắng nghe, thấu cảm và lan tỏa tiếng nói bên trong của trẻ vị thành niên. Đặc biệt, Trạm Lắng Nghe chính là một trong những “công cụ” giúp chúng mình thực hiện những sứ mệnh này."
        }
      </p>
    </section>
  );
}
