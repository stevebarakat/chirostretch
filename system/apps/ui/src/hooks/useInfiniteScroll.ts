// eslint-disable-next-line no-restricted-imports
import { useEffect, RefObject } from "react";

type UseInfiniteScrollOptions = {
  sentinelRef: RefObject<Element | null>;
  isLastPage: boolean;
  showMore: () => void;
  rootMargin?: string;
};

export default function useInfiniteScroll({
  sentinelRef,
  isLastPage,
  showMore,
  rootMargin = "400px",
}: UseInfiniteScrollOptions) {
  // Reason this hook must use useEffect:
  // - Syncing with browser API (IntersectionObserver) for infinite scroll
  // - IntersectionObserver is a browser API that requires DOM access
  // - This is a side effect that sets up and cleans up an observer when dependencies change
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLastPage) {
            showMore();
          }
        });
      },
      { rootMargin }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinelRef, isLastPage, showMore, rootMargin]);
}
