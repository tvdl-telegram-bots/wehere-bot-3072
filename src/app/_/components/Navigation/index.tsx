import cx from "clsx";
import Link from "next/link";
import React from "react";

import styles from "./index.module.scss";
import { Item } from "./types";

function ItemViewer({
  className,
  style,
  item,
}: {
  className?: string;
  style?: React.CSSProperties;
  item: Item;
}) {
  return (
    <Link
      className={cx(styles.ItemViewer, className)}
      style={style}
      title={item.tooltip}
      href={item.href}
    >
      <div className={styles.icon}>{item.icon}</div>
      <div className={styles.label}>{item.label}</div>
    </Link>
  );
}

function Sidebar({
  className,
  style,
  items,
  slotProduct,
}: {
  className?: string;
  style?: React.CSSProperties;
  items: Item[];
  slotProduct?: React.ReactNode;
}) {
  return (
    <div className={cx(styles.Sidebar, className)} style={style}>
      {slotProduct ? (
        <div className={styles.slotProduct}>{slotProduct}</div>
      ) : undefined}
      <ul>
        {items.map((item, index) => (
          <li key={item.key ?? index}>
            <ItemViewer item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Modal({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={cx(styles.Modal, className)} style={style}>
      Modal
    </div>
  );
}

type Rail_Props = {
  className?: string;
  style?: React.CSSProperties;
};

function Rail({ className, style }: Rail_Props) {
  return (
    <div className={cx(styles.Rail, className)} style={style}>
      Rail
    </div>
  );
}

const Navigation = { Sidebar, Modal, Rail };

export default Navigation;
