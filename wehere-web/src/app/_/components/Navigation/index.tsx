import cx from "clsx";
import Link from "next/link";
import React from "react";
import { MdColorLens, MdMenu } from "react-icons/md";
import { RemoveScroll } from "react-remove-scroll";

import { nextThemeName, useThemeSwitcher } from "./hooks/useThemeSwitcher";
import styles from "./index.module.scss";
import { Item } from "./types";

function ListItem({
  className,
  style,
  item,
  active,
}: {
  className?: string;
  style?: React.CSSProperties;
  item: Item;
  active?: boolean;
}) {
  return (
    <Link
      className={cx(
        styles.ListItem,
        className,
        active ? styles.active : undefined
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

function ButtonText({
  className,
  style,
  icon,
  label,
  ...otherProps
}: {
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  label?: React.ReactNode;
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "style"
>) {
  return (
    <button
      className={cx(styles.ButtonText, className)}
      style={style}
      {...otherProps}
    >
      <div className={styles.state}></div>
      <div className={styles.content}>
        <div className={styles.icon}>{icon}</div>
        <div className={styles.label}>{label}</div>
      </div>
    </button>
  );
}

function Sidebar({
  className,
  style,
  items,
  slotProduct,
  activeKey,
}: {
  className?: string;
  style?: React.CSSProperties;
  items: Item[];
  slotProduct?: React.ReactNode;
  activeKey?: React.Key;
}) {
  const themeSwitcher = useThemeSwitcher();

  return (
    <div className={cx(styles.Sidebar, className)} style={style}>
      {slotProduct ? (
        <>
          <div className={styles.slotProduct}>{slotProduct}</div>
          <hr className={styles.divider} />
        </>
      ) : undefined}
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={item.key ?? index}>
            <ListItem
              item={item}
              active={!!activeKey && activeKey === item.key}
            />
          </li>
        ))}
      </ul>
      <ButtonText
        className={styles.buttonSwitchTheme}
        icon={<MdColorLens />}
        label="Đổi giao diện"
        onClick={() =>
          themeSwitcher.updateThemeName(nextThemeName(themeSwitcher.themeName))
        }
      />
    </div>
  );
}

function Modal({
  className,
  style,
  items,
  slotProduct,
  onClickScrim,
  activeKey,
}: {
  className?: string;
  style?: React.CSSProperties;
  items: Item[];
  slotProduct?: React.ReactNode;
  onClickScrim?: () => void;
  activeKey?: React.Key;
}) {
  return (
    <RemoveScroll>
      <div className={cx(styles.Modal, className)} style={style}>
        <div className={styles.scrim} onClick={onClickScrim}></div>
        <div className={styles.content}>
          <Sidebar
            items={items}
            slotProduct={slotProduct}
            activeKey={activeKey}
          />
        </div>
      </div>
    </RemoveScroll>
  );
}

function ButtonIcon({
  className,
  style,
  icon,
  ...otherProps
}: {
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "style"
>) {
  return (
    <button
      className={cx(styles.ButtonIcon, className)}
      style={style}
      {...otherProps}
    >
      <div className={styles.state}></div>
      <div className={styles.content}>{icon}</div>
    </button>
  );
}

function RailItem({
  className,
  style,
  item,
  active,
}: {
  className?: string;
  style?: React.CSSProperties;
  item: Item;
  active?: boolean;
}) {
  return (
    <Link
      className={cx(
        styles.RailItem,
        className,
        active ? styles.active : undefined
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
  activeKey,
}: {
  className?: string;
  style?: React.CSSProperties;
  items: Item[];
  buttonMenu?: { onClick?: () => void };
  activeKey?: React.Key;
}) {
  const themeSwitcher = useThemeSwitcher();

  return (
    <div className={cx(styles.Rail, className)} style={style}>
      {buttonMenu ? (
        <ButtonIcon
          className={styles.buttonMenu}
          onClick={buttonMenu.onClick}
          icon={<MdMenu />}
        />
      ) : undefined}
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={item.key ?? index}>
            <RailItem
              item={item}
              active={!!activeKey && activeKey === item.key}
            />
          </li>
        ))}
      </ul>
      <ButtonIcon
        icon={<MdColorLens />}
        onClick={() =>
          themeSwitcher.updateThemeName(nextThemeName(themeSwitcher.themeName))
        }
      />
    </div>
  );
}

const Navigation = { Sidebar, Modal, Rail, ButtonIcon, ButtonText };

export default Navigation;
