import { useRouter } from "next/navigation";
import React from "react";

import { useWindowSizeClass } from "./useWindowSizeClass";

type LayoutBasicApi = {
  topAppBar: {
    buttonMenu?: { onClick?: () => void };
    buttonBack?: { onClick?: () => void };
  };
  navigationSidebar?: true;
  navigationRail?: {
    buttonMenu?: { onClick?: () => void };
  };
  navigationModal?: {
    onClose?: () => void;
  };
};

export function useLayoutBasicApi(): LayoutBasicApi {
  const size = useWindowSizeClass();
  const router = useRouter();

  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    if (showModal && size === "expanded") {
      setShowModal(false);
    }
  }, [showModal, size]);

  switch (size) {
    case "compact":
      return {
        topAppBar: {
          buttonMenu: { onClick: () => setShowModal(true) },
        },
        navigationModal: showModal
          ? { onClose: () => setShowModal(false) }
          : undefined,
      };
    case "medium":
      return {
        topAppBar: {
          buttonBack: { onClick: () => router.back() },
        },
        navigationRail: {
          buttonMenu: {
            onClick: () => setShowModal(true),
          },
        },
        navigationModal: showModal
          ? { onClose: () => setShowModal(false) }
          : undefined,
      };
    case "expanded":
      return {
        topAppBar: {
          buttonBack: { onClick: () => router.back() },
        },
        navigationSidebar: true,
      };
    default:
      return {
        topAppBar: {},
      };
  }
}
