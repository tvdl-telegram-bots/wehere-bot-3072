import cx from "clsx";
import Image from "next/image";
import React from "react";

import pngColor from "./assets/color.png";
import pngWhite from "./assets/white.png";
import styles from "./index.module.scss";

type Length = `${number}${"px" | "em"}`;
type Variant = "color" | "white";

function Fixed({
  className,
  style,
  variant,
  size,
}: {
  className?: string;
  style?: React.CSSProperties;
  variant: Variant;
  size: Length;
}) {
  const imageUrl =
    variant === "color"
      ? pngColor
      : variant === "white"
      ? pngWhite
      : "#disabled";

  return (
    <div
      className={cx(styles.container, className)}
      style={{ ...style, width: size, height: size, position: "relative" }}
    >
      <Image src={imageUrl} alt="logo WeHere" sizes={size} fill />
    </div>
  );
}

const LogoWeHere = { Fixed };

export default LogoWeHere;
