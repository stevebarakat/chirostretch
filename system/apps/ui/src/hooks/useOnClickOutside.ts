// eslint-disable-next-line no-restricted-imports
import { useEffect, useRef, type RefObject } from "react";

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  const handlerRef = useRef(handler);

  // Update ref in effect to avoid "Cannot update ref during render" (react-hooks/refs)
  useEffect(() => {
    handlerRef.current = handler;
  });

  // Reason this hook must use useEffect:
  // - Syncing with external browser API (DOM event listeners)
  // - Must subscribe/unsubscribe to document events for click-outside detection
  // - This is a side effect that manages external system (DOM) subscriptions
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handlerRef.current(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref]);
}

export default useOnClickOutside;
