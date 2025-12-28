"use client";

import { useReducer, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  subMonths,
  addMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NoImage } from "@/components/UI/NoImage";
import type { Event } from "../types";
import { useCalendarDates, WEEKDAYS } from "./useCalendarDates";
import styles from "./EventsCalendar.module.css";

type CalendarState = {
  focusedMonth: Date;
};

type CalendarAction =
  | { type: "PREV_MONTH" }
  | { type: "NEXT_MONTH" }
  | { type: "GO_TO_TODAY" };

function calendarReducer(
  state: CalendarState,
  action: CalendarAction
): CalendarState {
  switch (action.type) {
    case "PREV_MONTH":
      return { focusedMonth: subMonths(state.focusedMonth, 1) };
    case "NEXT_MONTH":
      return { focusedMonth: addMonths(state.focusedMonth, 1) };
    case "GO_TO_TODAY":
      return { focusedMonth: startOfMonth(new Date()) };
    default:
      return state;
  }
}

function groupEventsByDate(events: Event[]): Map<string, Event[]> {
  const map = new Map<string, Event[]>();
  events.forEach((event) => {
    if (!event.startDate) return;
    const key = format(new Date(event.startDate), "yyyy-MM-dd");
    map.set(key, [...(map.get(key) || []), event]);
  });
  return map;
}

function stripCitySuffix(title?: string): string {
  if (!title) return "";
  return title.replace(/\s+at\s+[A-Za-z\s]+$/i, "").trim();
}

function formatEventDate(startDate?: string): string {
  if (!startDate) return "";
  const date = new Date(startDate);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatEventTime(startDate?: string): string {
  if (!startDate) return "";
  const date = new Date(startDate);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCost(cost?: string | null): string {
  if (!cost || cost === "0" || cost === "$0" || cost === "$0.00") return "Free";
  return cost.startsWith("$") ? cost : `$${cost}`;
}

type EventsCalendarProps = {
  events: Event[];
  basePath?: string;
};

export function EventsCalendar({ events, basePath = "/events" }: EventsCalendarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, dispatch] = useReducer(calendarReducer, {
    focusedMonth: startOfMonth(new Date()),
  });

  const weeks = useCalendarDates(state.focusedMonth);
  const eventsByDate = useMemo(() => groupEventsByDate(events), [events]);

  function handleEventClick(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("event", slug);
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className={styles.calendar}>
      {/* Month Navigation Header */}
      <header className={styles.header}>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => dispatch({ type: "PREV_MONTH" })}
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className={styles.monthYear}>
          {format(state.focusedMonth, "MMMM yyyy")}
        </h2>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => dispatch({ type: "NEXT_MONTH" })}
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </header>

      {/* Desktop: Calendar Grid */}
      <div className={styles.desktopView}>
        <div className={styles.weekdayHeader} role="row">
          {WEEKDAYS.map((day) => (
            <div key={day} className={styles.weekday} role="columnheader">
              {day}
            </div>
          ))}
        </div>

        <div className={styles.grid} role="grid" aria-label="Events calendar">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className={styles.week} role="row">
              {week.map((date, dayIndex) => {
                const dateKey = format(date, "yyyy-MM-dd");
                const dayEvents = eventsByDate.get(dateKey) || [];
                const isCurrentMonth = isSameMonth(date, state.focusedMonth);
                const isCurrentDay = isToday(date);

                return (
                  <div
                    key={dayIndex}
                    className={`${styles.dayCell} ${!isCurrentMonth ? styles.otherMonth : ""} ${isCurrentDay ? styles.today : ""}`}
                    role="gridcell"
                    aria-label={format(date, "EEEE, MMMM d, yyyy")}
                  >
                    <span className={styles.dayNumber}>{format(date, "d")}</span>
                    <div className={styles.dayEvents}>
                      {dayEvents.map((event) => (
                        <EventCard
                          key={event.slug}
                          event={event}
                          onClick={() => handleEventClick(event.slug!)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: List View */}
      <div className={styles.mobileView}>
        <MobileEventsList
          events={events}
          focusedMonth={state.focusedMonth}
          basePath={basePath}
        />
      </div>
    </div>
  );
}

type EventCardProps = {
  event: Event;
  onClick: () => void;
};

function EventCard({ event, onClick }: EventCardProps) {
  const city = event.venue?.city;
  const title = stripCitySuffix(event.title);

  return (
    <button type="button" className={styles.eventItem} onClick={onClick}>
      {city && <span className={styles.eventCity}>{city}</span>}
      {city && <span className={styles.eventSeparator}>-</span>}
      <span className={styles.eventTitle}>{title}</span>
    </button>
  );
}

type MobileEventsListProps = {
  events: Event[];
  focusedMonth: Date;
  basePath: string;
};

function MobileEventsList({
  events,
  focusedMonth,
  basePath,
}: MobileEventsListProps) {
  const monthEvents = events
    .filter(
      (e) => e.startDate && isSameMonth(new Date(e.startDate), focusedMonth)
    )
    .sort(
      (a, b) =>
        new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime()
    );

  const grouped = groupEventsByDate(monthEvents);
  const sortedDates = Array.from(grouped.keys()).sort();

  if (sortedDates.length === 0) {
    return <p className={styles.emptyMonth}>No events this month</p>;
  }

  return (
    <div className={styles.listView}>
      {sortedDates.map((dateKey) => {
        const dayEvents = grouped.get(dateKey) || [];
        const date = new Date(dateKey);
        return (
          <div key={dateKey} className={styles.dateGroup}>
            <h3 className={styles.dateHeader}>{format(date, "MMMM d")}</h3>
            <div className={styles.dateEvents}>
              {dayEvents.map((event) => (
                <MobileEventCard
                  key={event.slug}
                  event={event}
                  basePath={basePath}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MobileEventCard({
  event,
  basePath,
}: {
  event: Event;
  basePath: string;
}) {
  const title = stripCitySuffix(event.title);
  const image = event.featuredImage?.node;
  const dateStr = formatEventDate(event.startDate);
  const timeStr = formatEventTime(event.startDate);
  const venue = event.venue?.title;

  return (
    <article className={styles.mobileCard}>
      <div className={styles.mobileCardThumb}>
        {image?.sourceUrl ? (
          <Image
            src={image.sourceUrl}
            alt={image.altText || title}
            width={100}
            height={100}
            className={styles.mobileCardImage}
          />
        ) : (
          <NoImage />
        )}
      </div>
      <div className={styles.mobileCardContent}>
        <h4 className={styles.mobileCardTitle}>{title}</h4>
        {event.startDate && (
          <p className={styles.mobileCardMeta}>
            {dateStr} · {timeStr}
          </p>
        )}
        {venue && <p className={styles.mobileCardMeta}>{venue}</p>}
        <p className={styles.mobileCardCost}>{formatCost(event.cost)}</p>
        <Link
          href={`${basePath}/${event.slug}`}
          className={styles.mobileCardLink}
          aria-label={`View full event: ${title}`}
        >
          View Full Event <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
