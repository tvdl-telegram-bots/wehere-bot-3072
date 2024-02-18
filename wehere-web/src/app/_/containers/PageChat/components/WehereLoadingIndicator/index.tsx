import cx from "clsx";
import React from "react";

import styles from "./index.module.scss";

import { zip } from "@/app/_/utils/array";

type Length = `${number}${"px" | "em"}`;

const A =
  "M 4.820 7.254 C 4.676 7.240 4.502 7.144 4.366 7.003 C 4.249 6.883 4.103 6.674 4.070 6.363 C 4.067 6.346 3.997 5.920 4.346 5.661 C 4.426 5.602 4.509 5.567 4.594 5.558 C 4.641 5.553 4.687 5.556 4.734 5.567 C 4.885 5.603 4.987 5.711 5.029 5.794 C 5.155 6.045 5.094 6.206 4.935 6.417 C 4.756 6.654 4.844 6.743 4.936 6.836 C 5.008 6.908 5.088 6.989 5.040 7.142 C 5.017 7.216 4.951 7.257 4.856 7.257 Z";
const B =
  "M 6.308 9.638 C 5.526 9.562 4.578 9.034 3.838 8.263 C 3.203 7.606 2.410 6.463 2.229 4.765 C 2.213 4.670 1.832 2.342 3.732 0.922 C 4.162 0.599 4.616 0.409 5.076 0.360 C 5.333 0.333 5.586 0.348 5.839 0.409 C 6.663 0.607 7.218 1.199 7.445 1.651 C 8.132 3.026 7.796 3.907 6.935 5.058 C 5.960 6.356 6.436 6.839 6.938 7.348 C 7.328 7.742 7.766 8.187 7.505 9.022 C 7.377 9.429 7.018 9.653 6.504 9.653 Z";

function d(a: string, b: string, t: number): string {
  return zip(a.split(" "), b.split(" "))
    .map(([x, y]) => {
      if (x === y) return x;
      const z = parseFloat(x) * t + parseFloat(y) * (1 - t);
      return z.toFixed(3);
    })
    .join(" ");
}

type Props = {
  className?: string;
  style?: React.CSSProperties;
  size?: Length;
  numSteps: number;
  strokeWidth: number;
  numSeconds?: number;
};

export default function WehereLoadingIndicator({
  className,
  style,
  size = "1em",
  numSteps,
  strokeWidth,
  numSeconds = 2,
}: Props) {
  return (
    <svg
      className={cx(styles.container, className)}
      style={{ ...style, width: size, height: size }}
      viewBox="0 0 10 10"
      fill="none"
    >
      {Array.from(Array(numSteps + 1), (_, i) => (
        <path
          key={i}
          d={d(A, B, i / numSteps)}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;1;0"
            calcMode="spline"
            begin={`${(i / numSteps) * numSeconds * 0.4}s`}
            dur={`${numSeconds}s`}
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            values="0 5 5;-6 5 5;0 5 5"
            calcMode="spline"
            begin={`${(i / numSteps) * numSeconds * 0.4}s`}
            dur={`${numSeconds}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}
    </svg>
  );
}
