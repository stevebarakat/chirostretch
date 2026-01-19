"use client";

// eslint-disable-next-line no-restricted-imports
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import type { TimeSlot } from "./types";
import styles from "./TimeSlotGrid.module.css";

type TimeSlotGridProps = {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string | null) => void;
  loading?: boolean;
};

const SCROLL_THRESHOLD = 12;
const SLOTS_PER_SECTION = 9;

function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function TimeSlotGrid({
  slots,
  selectedTime,
  onSelect,
  loading,
}: TimeSlotGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const shouldSection = slots.length > SCROLL_THRESHOLD;

  // Divide slots into sections of 9 slots each
  const sections: TimeSlot[][] = [];
  if (shouldSection) {
    for (let i = 0; i < slots.length; i += SLOTS_PER_SECTION) {
      sections.push(slots.slice(i, i + SLOTS_PER_SECTION));
    }
  } else {
    sections.push(slots);
  }

  // Reason this component must use useEffect:
  // - Syncing with browser scroll position to update button disabled states
  // - Must check scroll position when slots change or user scrolls
  // - This is a side effect that syncs UI state with browser scroll API
  useEffect(() => {
    if (!shouldSection || !scrollContainerRef.current) {
      // Use setTimeout to defer state updates and avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        setCanScrollLeft(false);
        setCanScrollRight(false);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    function updateScrollState() {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      const threshold = 1;

      setCanScrollLeft(scrollLeft > threshold);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - threshold);
    }

    // Initial state update deferred to avoid synchronous setState
    const initialTimeoutId = setTimeout(updateScrollState, 0);

    const container = scrollContainerRef.current;
    container.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      clearTimeout(initialTimeoutId);
      container.removeEventListener("scroll", updateScrollState);
    };
  }, [shouldSection, slots]);

  function handleScrollPrevious() {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Scroll left by one section width
    container.scrollBy({ left: -container.clientWidth, behavior: "smooth" });
  }

  function handleScrollNext() {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Scroll right by one section width
    container.scrollBy({ left: container.clientWidth, behavior: "smooth" });
  }

  if (slots.length === 0 && !loading) {
    return (
      <div className={styles.container}>
        <label className={styles.label}>Available Times</label>
        <p className={styles.empty}>No available times for this date.</p>
      </div>
    );
  }

  function renderSection(sectionSlots: TimeSlot[], sectionIndex: number) {
    return (
      <div key={sectionIndex} className={styles.section}>
        <div className={styles.grid}>
          {sectionSlots.map((slot) => {
            const isSelected = selectedTime === slot.start;
            return (
              <button
                key={slot.start}
                type="button"
                className={clsx(
                  styles.slot,
                  isSelected && styles.selected,
                  !slot.available && styles.unavailable
                )}
                onClick={() => slot.available && onSelect(slot.start)}
                disabled={!slot.available || loading}
                aria-pressed={isSelected}
              >
                {formatTime(slot.start)}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>Available Times</label>
      {shouldSection ? (
        <div className={styles.stripWrapper}>
          <button
            type="button"
            className={styles.navigationButton}
            onClick={handleScrollPrevious}
            disabled={!canScrollLeft}
            aria-label="Scroll to previous time slots"
          >
            <ChevronLeft size={20} />
          </button>
          <div
            ref={scrollContainerRef}
            className={styles.horizontalScrollContainer}
          >
            {sections.map((section, index) => renderSection(section, index))}
          </div>
          <button
            type="button"
            className={styles.navigationButton}
            onClick={handleScrollNext}
            disabled={!canScrollRight}
            aria-label="Scroll to next time slots"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {slots.map((slot) => {
            const isSelected = selectedTime === slot.start;
            return (
              <button
                key={slot.start}
                type="button"
                className={clsx(
                  styles.slot,
                  isSelected && styles.selected,
                  !slot.available && styles.unavailable
                )}
                onClick={() => slot.available && onSelect(slot.start)}
                disabled={!slot.available || loading}
                aria-pressed={isSelected}
              >
                {formatTime(slot.start)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
