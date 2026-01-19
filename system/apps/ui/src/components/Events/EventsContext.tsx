"use client";

import { createContext, useContext, useRef, useCallback, useMemo } from "react";

type ScrollToEventFn = (slug: string, startDate?: string) => void;

type EventsContextValue = {
  scrollToEvent: (slug: string, startDate?: string) => void;
  registerScrollToEvent: (fn: ScrollToEventFn) => void;
};

const EventsContext = createContext<EventsContextValue | null>(null);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const scrollToEventRef = useRef<ScrollToEventFn | null>(null);

  const registerScrollToEvent = useCallback((fn: ScrollToEventFn) => {
    scrollToEventRef.current = fn;
  }, []);

  const scrollToEvent = useCallback((slug: string, startDate?: string) => {
    scrollToEventRef.current?.(slug, startDate);
  }, []);

  const value = useMemo(
    () => ({ scrollToEvent, registerScrollToEvent }),
    [scrollToEvent, registerScrollToEvent]
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
}

export function useEventsContext() {
  return useContext(EventsContext);
}
