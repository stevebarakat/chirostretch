// eslint-disable-next-line no-restricted-imports
import { useState, useEffect } from "react";

import { RefObject } from "react";

export default function useOnScreen(
  ref: RefObject<HTMLDivElement | null>,
  rootMargin = "0px",
) {
  const [isIntersecting, setIntersecting] = useState(false);

  // Reason this hook must use useEffect:
  // - Syncing with external browser API (IntersectionObserver)
  // - Must subscribe/unsubscribe to intersection observer for visibility detection
  // - This is a side effect that manages external system (browser observer API)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      { rootMargin },
    );

    let el: Element | null = null;

    if (ref.current) {
      el = ref.current;
      if (!el) return;
      observer.observe(el);
    }

    return () => {
      observer.unobserve(el as Element);
    };
  }, [ref, rootMargin]);

  return isIntersecting;
}
