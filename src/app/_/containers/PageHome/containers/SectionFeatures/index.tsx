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
    <div className={cx(styles.Card, className)} style={style}>
      {title ? <div className={styles.title}>{title}</div> : undefined}
      {description ? (
        <div className={styles.description}>{description}</div>
      ) : undefined}
    </div>
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
        description="Trạm Lắng Nghe là một môi trường tâm lý an toàn trực tuyến trên nền tảng Telegram, nơi chúng tôi cung cấp sự hỗ trợ tâm lý tức thì. Chúng tôi tin rằng mỗi câu chuyện, mỗi mảnh ghép cảm xúc là quan trọng và xây dựng hành trình của chúng tôi."
      />
      <Card
        title="Bảo mật và ẩn danh"
        description="Với nguyên tắc bảo mật và ẩn danh, chúng tôi cam kết đảm bảo sự riêng tư và tin cậy. WeHere_bot, đồng hành ẩn danh của chúng tôi, sẽ lắng nghe và chia sẻ yêu thương, hỗ trợ mọi lúc, mọi nơi."
      />
      <Card
        title="Lắng nghe và yêu thương"
        description="Theo thống kê, nhiều tuổi vị thành niên gặp vấn đề tâm thần, nhưng ít tiếp cận dịch vụ hỗ trợ. Chúng tôi muốn mở cánh cửa cho mọi người, đặc biệt là những người đối mặt với vấn đề gia đình, học tập."
      />
      <Card
        title="Cuộc sống là câu chuyện"
        description="Mỗi ca trực mang đến một câu chuyện độc đáo. Chúng tôi luôn trân trọng và lắng nghe mọi cảm xúc. Đối với chúng tôi, hạnh phúc là khi bạn cảm thấy an tâm khi chia sẻ câu chuyện của mình."
      />
    </div>
  );
}

const SectionFeatures = Object.assign(Root, { Root, Card });

export default SectionFeatures;
