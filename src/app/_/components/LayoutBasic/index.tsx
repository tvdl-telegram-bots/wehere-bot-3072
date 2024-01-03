import cx from "clsx";
import React from "react";

import styles from "./index.module.scss";

interface ContainerProps {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
}

function createContainer(componentName: string, containerStyles: string[]) {
  const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, style, content, children = content }, ref) => {
      return (
        <div
          ref={ref}
          className={cx(...containerStyles, className)}
          style={style}
        >
          {children}
        </div>
      );
    }
  );

  Container.displayName = componentName;
  return Container;
}

const LayoutBasic = {
  Root: createContainer("Root", [styles.Root]),
  Left: createContainer("Left", [styles.Left]),
  Top: createContainer("Top", [styles.Top]),
  Center: createContainer("Center", [styles.Center]),
  Right: createContainer("Right", [styles.Right]),
  Bottom: createContainer("Bottom", [styles.Bottom]),
};

export default LayoutBasic;
