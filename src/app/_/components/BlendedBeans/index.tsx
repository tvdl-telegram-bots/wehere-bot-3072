import cx from "clsx";
import React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  numSteps: number;
  strokeWidth: number;
};

const A =
  "M 38.9087 100.463 C 36.8387 100.263 34.3287 98.8731 32.3687 96.8431 C 30.6887 95.1131 28.5887 92.1031 28.1087 87.6331 C 28.0687 87.3831 27.0587 81.2531 32.0887 77.5131 C 33.2287 76.6631 34.4287 76.1631 35.6487 76.0331 C 36.3287 75.9631 36.9987 76.0031 37.6687 76.1631 C 39.8487 76.6831 41.3187 78.2431 41.9187 79.4331 C 43.7387 83.0531 42.8487 85.3731 40.5687 88.4031 C 37.9887 91.8231 39.2487 93.0931 40.5787 94.4331 C 41.6087 95.4731 42.7687 96.6431 42.0787 98.8431 C 41.7387 99.9131 40.7887 100.503 39.4287 100.503 Z" //
    .split(" ");
const B =
  "M 60.3311 134.781 C 49.0726 133.688 35.421 126.086 24.7608 114.985 C 15.6234 105.524 4.20178 89.063 1.59111 64.6179 C 1.37356 63.2507 -4.11972 29.7276 23.2379 9.27466 C 29.4382 4.62627 35.9649 1.8919 42.6003 1.18097 C 46.2988 0.798165 49.9428 1.01694 53.5869 1.89193 C 65.4436 4.73565 73.4388 13.2668 76.7021 19.7746 C 86.6009 39.5712 81.7603 52.2586 69.3596 68.8288 C 55.3273 87.5317 62.1803 94.477 69.414 101.805 C 75.0161 107.492 81.3252 113.891 77.5723 125.922 C 75.7231 131.773 70.5562 135 63.1593 135 Z" //
    .split(" ");

function zip<A, B>(a: A[], b: B[]): [A, B][] {
  return Array.from(
    Array(Math.min(a.length, b.length)), //
    (_, i) => [a[i], b[i]]
  );
}

function lerp(a: string, b: string, t: number): string {
  if (a === b) return a;
  const c = parseFloat(a) * t + parseFloat(b) * (1 - t);
  return c.toFixed(3);
}

function d(t: number) {
  return zip(A, B)
    .map(([a, b]) => lerp(a, b, t))
    .join(" ");
}

export default function BlendedBeans({
  className,
  style,
  numSteps,
  strokeWidth,
}: Props) {
  return (
    <svg
      className={cx(styles.container, className)}
      style={style}
      viewBox="0 0 83 136"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from(Array(numSteps + 1), (_, i) => (
        <path
          key={i}
          d={d(i / numSteps)}
          stroke="currentColor"
          stroke-width={strokeWidth}
        />
      ))}
    </svg>
  );
}
