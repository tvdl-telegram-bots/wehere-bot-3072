import cx from "clsx";
import Link from "next/link";
import React from "react";
import { MdMenu } from "react-icons/md";
import { mutate } from "swr";
import { z } from "zod";

import { httpPost } from "../../utils/swr";

import styles from "./index.module.scss";
import { Item } from "./types";

import { Params$UpdateSessionState } from "@/app/api/UpdateSessionState/typing";

function ListItem({
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
      className={cx(
        styles.ItemViewer,
        className,
        item.active ? styles.active : undefined
      )}
      style={style}
      title={item.tooltip}
      href={item.href}
    >
      <div className={styles.state} />
      <div className={styles.content}>
        <div className={styles.icon}>{item.icon}</div>
        <div className={styles.label}>{item.label}</div>
      </div>
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
        <>
          <div className={styles.slotProduct}>{slotProduct}</div>
          <hr className={styles.divider} />
        </>
      ) : undefined}
      <ul>
        {items.map((item, index) => (
          <li key={item.key ?? index}>
            <ListItem item={item} />
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

function RailItem({
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
      className={cx(
        styles.RailItem,
        className,
        item.active ? styles.active : undefined
      )}
      style={style}
      href={item.href}
    >
      <div className={styles.icon}>{item.icon}</div>
      <div className={styles.label}>{item.label}</div>
    </Link>
  );
}

function Rail({
  className,
  style,
  items,
  buttonMenu,
}: {
  className?: string;
  style?: React.CSSProperties;
  items: Item[];
  buttonMenu?: { onClick?: () => void };
}) {
  return (
    <div className={cx(styles.Rail, className)} style={style}>
      {buttonMenu ? (
        <button className={styles.buttonMenu}>
          <MdMenu />
        </button>
      ) : undefined}
      <ul>
        {items.map((item, index) => (
          <li key={item.key ?? index}>
            <RailItem item={item} />
          </li>
        ))}
      </ul>

      <button
        onClick={async () => {
          await httpPost(z.unknown())({
            path: "/api/UpdateSessionState",
            params: {
              sessionState: {
                themeName:
                  Math.random() > 0.5
                    ? "faith"
                    : Math.random() > 0.5
                    ? "light"
                    : "dark",
              },
            } satisfies Params$UpdateSessionState,
          });
          await mutate({ path: "/api/ReadSessionState", params: {} });
        }}
      >
        {"Switch Theme"}
      </button>
    </div>
  );
}

const Navigation = { Sidebar, Modal, Rail };

export default Navigation;
