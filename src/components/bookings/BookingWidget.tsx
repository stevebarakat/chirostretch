"use client";

import { useState, useEffect, useCallback } from "react";
import { addDays, format } from "date-fns";
import { ServiceSelect } from "./ServiceSelect";
import { DateStrip } from "./DateStrip";
import { TimeSlotGrid } from "./TimeSlotGrid";
import { useBookingParams } from "./useBookingParams";
import type { BookableService, AvailableDate, TimeSlot } from "./types";
import styles from "./BookingWidget.module.css";

type BookingWidgetProps = {
  services: BookableService[];
  onConfirm?: (booking: { serviceId: number; date: string; time: string }) => void;
};

const DAYS_TO_SHOW = 5;

export function BookingWidget({ services, onConfirm }: BookingWidgetProps) {
  const { serviceId, date, time, setServiceId, setDate, setTime, isComplete } = useBookingParams();

  const [startDate, setStartDate] = useState(() => new Date());
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const selectedService = services.find((s) => s.id === serviceId);

  // Fetch availability when service or date range changes
  useEffect(() => {
    if (!serviceId) {
      setAvailableDates([]);
      return;
    }

    async function fetchAvailability() {
      setLoadingDates(true);
      try {
        const endDate = addDays(startDate, DAYS_TO_SHOW);
        const res = await fetch(
          `/api/bookings/slots?productId=${serviceId}&startDate=${format(startDate, "yyyy-MM-dd")}&endDate=${format(endDate, "yyyy-MM-dd")}`
        );

        if (!res.ok) throw new Error("Failed to fetch availability");

        const data = await res.json();

        // Transform slots data to available dates
        const dateMap = new Map<string, boolean>();
        if (Array.isArray(data)) {
          data.forEach((slot: { date?: string; available?: boolean }) => {
            if (slot.date) {
              dateMap.set(slot.date, slot.available ?? true);
            }
          });
        }

        // Generate date objects for the strip
        const dates: AvailableDate[] = Array.from({ length: DAYS_TO_SHOW }, (_, i) => {
          const d = addDays(startDate, i);
          const dateStr = format(d, "yyyy-MM-dd");
          return {
            date: dateStr,
            dayOfWeek: format(d, "EEE"),
            dayOfMonth: d.getDate(),
            available: dateMap.get(dateStr) ?? true, // Default to available if not specified
          };
        });

        setAvailableDates(dates);
      } catch (error) {
        console.error("Error fetching availability:", error);
        // Set all dates as available on error (fallback)
        const dates: AvailableDate[] = Array.from({ length: DAYS_TO_SHOW }, (_, i) => {
          const d = addDays(startDate, i);
          return {
            date: format(d, "yyyy-MM-dd"),
            dayOfWeek: format(d, "EEE"),
            dayOfMonth: d.getDate(),
            available: true,
          };
        });
        setAvailableDates(dates);
      } finally {
        setLoadingDates(false);
      }
    }

    fetchAvailability();
  }, [serviceId, startDate]);

  // Fetch time slots when date changes
  useEffect(() => {
    if (!serviceId || !date) {
      setTimeSlots([]);
      return;
    }

    async function fetchTimeSlots() {
      setLoadingSlots(true);
      try {
        const res = await fetch(
          `/api/bookings/slots?productId=${serviceId}&startDate=${date}&endDate=${date}`
        );

        if (!res.ok) throw new Error("Failed to fetch time slots");

        const data = await res.json();

        // Transform to time slots
        const slots: TimeSlot[] = [];
        if (Array.isArray(data)) {
          data.forEach((slot: { start?: string; end?: string; available?: boolean }) => {
            if (slot.start) {
              // Extract time from datetime if full ISO string, or use as-is
              const startTime = slot.start.includes("T")
                ? slot.start.split("T")[1].substring(0, 5)
                : slot.start;
              const endTime = slot.end
                ? (slot.end.includes("T") ? slot.end.split("T")[1].substring(0, 5) : slot.end)
                : "";

              slots.push({
                start: startTime,
                end: endTime,
                available: slot.available ?? true,
              });
            }
          });
        }

        setTimeSlots(slots);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        setTimeSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchTimeSlots();
  }, [serviceId, date]);

  const handleNavigate = useCallback((direction: "prev" | "next") => {
    setStartDate((current) => addDays(current, direction === "next" ? DAYS_TO_SHOW : -DAYS_TO_SHOW));
  }, []);

  async function handleConfirm() {
    if (!isComplete || !serviceId || !date || !time) return;

    setConfirming(true);
    try {
      if (onConfirm) {
        onConfirm({ serviceId, date, time });
      } else {
        // Default: add to cart and redirect
        const res = await fetch("/api/cart/add-item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: serviceId,
            quantity: 1,
            booking: {
              date,
              time,
            },
          }),
        });

        if (!res.ok) throw new Error("Failed to add booking to cart");

        window.location.href = "/cart";
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Failed to confirm booking. Please try again.");
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h2 className={styles.title}>New Appointment</h2>
        <a href="/account" className={styles.signIn}>Sign in</a>
      </div>

      <div className={styles.content}>
        <ServiceSelect
          services={services}
          selectedId={serviceId}
          onSelect={setServiceId}
          loading={loadingDates}
        />

        {serviceId && (
          <DateStrip
            availableDates={availableDates}
            selectedDate={date}
            onSelect={setDate}
            startDate={startDate}
            daysToShow={DAYS_TO_SHOW}
            onNavigate={handleNavigate}
            loading={loadingDates}
          />
        )}

        {serviceId && date && (
          <TimeSlotGrid
            slots={timeSlots}
            selectedTime={time}
            onSelect={setTime}
            loading={loadingSlots}
          />
        )}
      </div>

      <button
        type="button"
        className={styles.confirmButton}
        onClick={handleConfirm}
        disabled={!isComplete || confirming}
      >
        {confirming ? "Confirming..." : "Confirm Booking"}
      </button>
    </div>
  );
}
