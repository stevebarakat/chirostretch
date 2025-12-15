"use client";

import type { TimeSlot } from "./types";
import styles from "./TimeSlotGrid.module.css";

type TimeSlotGridProps = {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string | null) => void;
  loading?: boolean;
};

function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function TimeSlotGrid({ slots, selectedTime, onSelect, loading }: TimeSlotGridProps) {
  if (slots.length === 0 && !loading) {
    return (
      <div className={styles.container}>
        <label className={styles.label}>Available Times</label>
        <p className={styles.empty}>No available times for this date.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>Available Times</label>
      <div className={styles.grid}>
        {slots.map((slot) => {
          const isSelected = selectedTime === slot.start;
          return (
            <button
              key={slot.start}
              type="button"
              className={`${styles.slot} ${isSelected ? styles.selected : ""} ${!slot.available ? styles.unavailable : ""}`}
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
