import { useState, useEffect } from "react";

import { RefObject } from "react";

export default function useOnScreen(
  ref: RefObject<HTMLDivElement | null>,
  rootMargin = "0px",
) {
  const [isIntersecting, setIntersecting] = useState(false);

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
