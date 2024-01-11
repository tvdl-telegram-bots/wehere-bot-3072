import cx from "clsx";
import React from "react";

import styles from "./index.module.scss";

function Card({
  className,
  style,
  title,
  description,
}: {
  className?: string;
  style?: React.CSSProperties;
  title?: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <section className={cx(styles.Card, className)} style={style}>
      {title ? <div className={styles.title}>{title}</div> : undefined}
      {description ? (
        <div className={styles.description}>{description}</div>
      ) : undefined}
    </section>
  );
}

function Root({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={cx(styles.Root, className)} style={style}>
      <Card
        title="An toàn và thấu cảm"
        description="Với tôn chỉ “không phán xét”, chúng mình luôn cởi mở và sẵn sàng lắng nghe mọi cảm xúc, câu chuyện và chia sẻ đến từ các bạn. Bởi vì chúng mình tin rằng: “mọi cảm xúc đều xứng đáng được trân trọng.”"
      />
      <Card
        title="Bảo mật và ẩn danh"
        description="Với nguyên tắc bảo mật và ẩn danh, chúng mình sử dụng WeHere_bot là kênh liên lạc với khách hàng để đảm bảo quyền riêng tư giữa cả người chia sẻ và người lắng nghe."
      />
      <Card
        title="Lắng nghe và yêu thương"
        description="Theo những thống kê và khảo sát đã được WeHere thực hiện trong thời gian qua , chúng mình nhận thấy đã và đang có nhiều bạn trẻ ở độ tuổi vị thành niên gặp vấn đề tâm lý, nhưng ít tiếp cận dịch vụ hỗ trợ. Bởi vậy, chúng mình  muốn mở cánh cửa cho mọi người, đặc biệt là những bạn thanh thiếu niên khi phải cùng lúc đối mặt với nhiều vấn đề đến từ gia đình, học tập, tình cảm...."
      />
      <Card
        title="Hạnh phúc trong mỗi ca trực"
        description="Mỗi ca trực mang đến một câu chuyện độc đáo. Chúng mình luôn trân trọng và lắng nghe mọi cảm xúc. Đối với chúng mình, hạnh phúc là khi bạn cảm thấy an tâm, an toàn khi được chia sẻ câu chuyện của mình."
      />
    </div>
  );
}

const SectionFeatures = Object.assign(Root, { Root, Card });

export default SectionFeatures;
