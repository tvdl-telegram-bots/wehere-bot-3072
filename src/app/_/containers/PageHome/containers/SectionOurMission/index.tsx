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
      <h1>{"Sứ mệnh của chúng tôi"}</h1>
      <p>
        {
          "WeHere, được sáng lập bởi Thư viện Dương Liễu, cam kết chia sẻ kiến thức về tâm lý cho tuổi vị thành niên. Chúng tôi tin rằng thông tin và hỗ trợ tâm lý là chìa khóa để nâng cao sức khoẻ tinh thần của cộng đồng."
        }
      </p>
    </section>
  );
}
