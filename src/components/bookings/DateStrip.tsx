"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfDay } from "date-fns";
import { clsx } from "clsx";
import type { AvailableDate } from "./types";
import styles from "./DateStrip.module.css";

type DateStripProps = {
  availableDates: AvailableDate[];
  selectedDate: string | null;
  onSelect: (date: string | null) => void;
  startDate?: Date;
  daysToShow?: number;
  onNavigate?: (direction: "prev" | "next") => void;
  loading?: boolean;
};

export function DateStrip({
  availableDates,
  selectedDate,
  onSelect,
  startDate = new Date(),
  daysToShow = 5,
  onNavigate,
  loading,
}: DateStripProps) {
  const dates = useMemo(() => {
    const start = startOfDay(startDate);
    return Array.from({ length: daysToShow }, (_, i) => {
      const date = addDays(start, i);
      const dateStr = format(date, "yyyy-MM-dd");
      const availableDate = availableDates.find((d) => d.date === dateStr);

      return {
        date: dateStr,
        dayOfWeek: format(date, "EEE"),
        dayOfMonth: date.getDate(),
        available: availableDate?.available ?? false,
      };
    });
  }, [startDate, daysToShow, availableDates]);

  function handleSelect(dateStr: string, available: boolean) {
    if (!available || loading) return;
    onSelect(dateStr);
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>Select Date</label>
      <div className={styles.stripWrapper}>
        {onNavigate && (
          <button
            type="button"
            className={styles.navButton}
            onClick={() => onNavigate("prev")}
            aria-label="Previous dates"
            disabled={loading}
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div className={styles.strip}>
          {dates.map((d) => {
            const isSelected = selectedDate === d.date;
            return (
              <button
                key={d.date}
                type="button"
                className={clsx(styles.dateButton, isSelected && styles.selected, !d.available && styles.unavailable)}
                onClick={() => handleSelect(d.date, d.available)}
                disabled={!d.available || loading}
                aria-pressed={isSelected}
                aria-label={`${d.dayOfWeek} ${d.dayOfMonth}${!d.available ? ", unavailable" : ""}`}
              >
                <span className={styles.dayOfWeek}>{d.dayOfWeek}</span>
                <span className={styles.dayOfMonth}>{d.dayOfMonth}</span>
              </button>
            );
          })}
        </div>
        {onNavigate && (
          <button
            type="button"
            className={styles.navButton}
            onClick={() => onNavigate("next")}
            aria-label="Next dates"
            disabled={loading}
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
