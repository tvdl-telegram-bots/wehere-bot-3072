import React from "react";

export type WindowSizeClass = "compact" | "medium" | "expanded";

function getWindowSizeClass(): WindowSizeClass {
  const w = window.innerWidth;
  return w < 600 ? "compact" : w < 840 ? "medium" : "expanded";
}

export function useWindowSizeClass() {
  const [value, setValue] = React.useState<WindowSizeClass>();

  React.useEffect(() => {
    const handleResize = () => {
      const newValue = getWindowSizeClass();
      newValue !== value && setValue(newValue);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => void window.removeEventListener("resize", handleResize);
  }, [value]);

  return value;
}
