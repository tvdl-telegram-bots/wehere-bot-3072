import cx from "clsx";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { MdArrowBack, MdChat, MdHome, MdMenu, MdPhone } from "react-icons/md";

import LayoutBasic from "../LayoutBasic";
import type { WindowSizeClass } from "../LayoutBasic/hooks/useWindowSizeClass";
import { useWindowSizeClass } from "../LayoutBasic/hooks/useWindowSizeClass";
import LogoWeHere from "../LogoWeHere";
import Navigation from "../Navigation";
import type { Item$Navigation } from "../Navigation/types";
import ThemeProvider from "../ThemeProvider";
import TopAppBar from "../TopAppBar";

import styles from "./index.module.scss";

type ActivePage = "home" | "chat" | "contact" | "info";

type ContextValue$AppShell = {
  activePage: ActivePage | undefined;
  windowSizeClass: WindowSizeClass | undefined;
  navigationModal: {
    visible: boolean;
    setVisible: (visible: boolean) => void;
  };
};

const Context$AppShell = React.createContext<ContextValue$AppShell>({
  activePage: undefined,
  windowSizeClass: undefined,
  navigationModal: {
    visible: false,
    setVisible: () => void undefined,
  },
});

const NAVIGATION_ITEMS: Item$Navigation[] = [
  {
    key: "home" satisfies ActivePage,
    icon: <MdHome />,
    label: "Trang chủ",
    href: "/",
  },
  {
    key: "chat" satisfies ActivePage,
    icon: <MdChat />,
    label: "Trò chuyện",
    href: "/chat",
  },
  {
    key: "contact" satisfies ActivePage,
    icon: <MdPhone />,
    label: "Liên hệ",
    href: "/contact",
  },
];

function Root({
  className,
  style,
  content,
  children = content,
  activePage,
}: {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
  activePage?: ActivePage;
}) {
  const windowSizeClass = useWindowSizeClass();
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    if (showModal && windowSizeClass === "expanded") {
      setShowModal(false);
    }
  }, [showModal, windowSizeClass]);

  return (
    <Context$AppShell.Provider
      value={{
        activePage,
        windowSizeClass,
        navigationModal: {
          visible: showModal,
          setVisible: setShowModal,
        },
      }}
    >
      <ThemeProvider className={cx(styles.Root, className)} style={style}>
        <LayoutBasic.Root>
          {children}
          {showModal ? (
            <LayoutBasic.Modal>
              <Navigation.Modal
                items={NAVIGATION_ITEMS}
                slotProduct={<LogoWeHere.Fixed variant="color" size="120px" />}
                onClickScrim={() => setShowModal(false)}
                activeKey={activePage}
              />
            </LayoutBasic.Modal>
          ) : undefined}
        </LayoutBasic.Root>
      </ThemeProvider>
    </Context$AppShell.Provider>
  );
}

function Top({
  className,
  style,
  label,
}: {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}) {
  const api = React.useContext(Context$AppShell);
  const router = useRouter();

  return (
    <LayoutBasic.Top className={cx(styles.Top, className)} style={style}>
      <TopAppBar.Root
        label={<TopAppBar.Label label={label} />}
        iconL={
          api.windowSizeClass === "compact" ? (
            <TopAppBar.Button
              icon={<MdMenu />}
              onClick={() => api.navigationModal.setVisible(true)}
            />
          ) : (
            <TopAppBar.Button
              icon={<MdArrowBack />}
              onClick={() => router.back()}
            />
          )
        }
      />
    </LayoutBasic.Top>
  );
}

function Left({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const api = useContext(Context$AppShell);

  return (
    <LayoutBasic.Left className={cx(styles.Left, className)} style={style}>
      {api.windowSizeClass === "expanded" ? (
        <Navigation.Sidebar
          items={NAVIGATION_ITEMS}
          slotProduct={<LogoWeHere.Fixed variant="color" size="120px" />}
          activeKey={api.activePage}
        />
      ) : api.windowSizeClass === "medium" ? (
        <Navigation.Rail
          items={NAVIGATION_ITEMS}
          buttonMenu={{ onClick: () => api.navigationModal.setVisible(true) }}
          activeKey={api.activePage}
        />
      ) : undefined}
    </LayoutBasic.Left>
  );
}

function Center({
  className,
  style,
  content,
  children = content,
}: {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <LayoutBasic.Center className={cx(styles.Center, className)} style={style}>
      {children}
    </LayoutBasic.Center>
  );
}

function Bottom({
  className,
  style,
  content,
  children = content,
}: {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <LayoutBasic.Bottom className={cx(styles.Bottom, className)} style={style}>
      {children}
    </LayoutBasic.Bottom>
  );
}

function Right({
  className,
  style,
  content,
  children = content,
}: {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <LayoutBasic.Right className={cx(styles.Right, className)} style={style}>
      {children}
    </LayoutBasic.Right>
  );
}

const AppShell = { Root, Left, Top, Center, Bottom, Right };

export default AppShell;
