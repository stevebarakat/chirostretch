// eslint-disable-next-line no-restricted-imports
import { useCallback, useEffect, type RefObject } from "react";

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  const listener = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    },
    [ref, handler]
  );

  // Reason this hook must use useEffect:
  // - Syncing with external browser API (DOM event listeners)
  // - Must subscribe/unsubscribe to document events for click-outside detection
  // - This is a side effect that manages external system (DOM) subscriptions
  useEffect(() => {
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [listener]);
}

export default useOnClickOutside;
