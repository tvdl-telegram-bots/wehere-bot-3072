import React from "react";

export function useWithErrorHandler(handler: (error: unknown) => void) {
  const [busyCount, setBusyCount] = React.useState(0);

  const withErrorHandler = <F extends (...args: unknown[]) => void>(fn: F) => {
    return async (...args: Parameters<F>): Promise<void> => {
      setBusyCount((prevCount) => prevCount + 1);
      try {
        await Promise.resolve(fn(...args));
      } catch (error) {
        await Promise.resolve(handler(error));
      } finally {
        setBusyCount((prevCount) => prevCount - 1);
      }
    };
  };

  const busy = busyCount > 0;

  return {
    busy,
    withErrorHandler,
  };
}
