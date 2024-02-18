import cx from "clsx";
import Image from "next/image";
import React from "react";

import pngColor from "./assets/color.png";
import styles from "./index.module.scss";

type Length = `${number}${"px" | "em"}`;

function Fixed({
  className,
  style,
  size,
  useCurrentColor,
}: {
  className?: string;
  style?: React.CSSProperties;
  variant?: "color";
  size: Length;
  useCurrentColor?: boolean;
}) {
  const [src, setSrc] = React.useState<string>();

  const imageOpacity = useCurrentColor ? "0" : "100%";
  const matteOpacity = useCurrentColor && src ? "100%" : "0";

  return (
    <div
      className={cx(styles.Fixed, className)}
      style={
        {
          ...style,
          "--size": size,
          "--mask-image": src ? `url(${src})` : undefined,
        } as React.CSSProperties
      }
    >
      <Image
        className={styles.image}
        style={{ opacity: imageOpacity }}
        src={pngColor}
        alt="logo WeHere"
        sizes={size}
        fill
        onLoad={(e) => setSrc(e.currentTarget.src)}
      />
      {useCurrentColor ? (
        <div className={styles.colorMatte} style={{ opacity: matteOpacity }} />
      ) : undefined}
    </div>
  );
}

const LogoWeHere = { Fixed };

export default LogoWeHere;
