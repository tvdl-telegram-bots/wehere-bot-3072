import cx from "clsx";
import React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
  onVisible?: () => void;
};

export default function AutoTrigger({
  className,
  style,
  content,
  children = content,
  onVisible,
}: Props) {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!container) return;

    const intersectionObserver = new IntersectionObserver(
      (entries) => setVisible(entries.some((e) => e.isIntersecting)),
      { rootMargin: "0px", threshold: 0 }
    );

    intersectionObserver.observe(container);

    return () => {
      intersectionObserver.disconnect();
      setVisible(false);
    };
  }, [container]);

  React.useEffect(() => {
    if (visible) {
      onVisible?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, !!onVisible]);

  return (
    <div
      ref={setContainer}
      className={cx(styles.container, className)}
      style={style}
    >
      {children}
    </div>
  );
}
