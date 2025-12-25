"use client";

import { useState, useEffect, useCallback } from "react";
import { addDays, format } from "date-fns";
import { ServiceSelect } from "./ServiceSelect";
import { DateStrip } from "./DateStrip";
import { TimeSlotGrid } from "./TimeSlotGrid";
import { useBookingParams } from "./useBookingParams";
import type { BookableService, AvailableDate, TimeSlot } from "./types";
import styles from "./BookingWidget.module.css";
import { Button } from "@/components/UI/Button";

type BookingWidgetProps = {
  services: BookableService[];
  onConfirm?: (booking: {
    serviceId: number;
    date: string;
    time: string;
  }) => void;
};

const DAYS_TO_SHOW = 5;

export function BookingWidget({ services, onConfirm }: BookingWidgetProps) {
  const {
    serviceId,
    date,
    time,
    setServiceId,
    setDate,
    setTime,
    isComplete,
  } = useBookingParams();

  const [startDate, setStartDate] = useState(() => new Date());
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [confirming, setConfirming] = useState(false);

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
          `/api/bookings/slots?productId=${serviceId}&startDate=${format(
            startDate,
            "yyyy-MM-dd"
          )}&endDate=${format(endDate, "yyyy-MM-dd")}`
        );

        if (!res.ok) throw new Error("Failed to fetch availability");

        const data = await res.json();

        // Transform slots data to available dates
        // API returns { success: true, slots: [{ date, available, slots: [...] }] }
        const dateMap = new Map<string, boolean>();
        const slotsArray = data.slots ?? data;
        if (Array.isArray(slotsArray)) {
          slotsArray.forEach((slot: { date?: string; available?: boolean }) => {
            if (slot.date) {
              dateMap.set(slot.date, slot.available ?? true);
            }
          });
        }

        // Generate date objects for the strip
        const dates: AvailableDate[] = Array.from(
          { length: DAYS_TO_SHOW },
          (_, i) => {
            const d = addDays(startDate, i);
            const dateStr = format(d, "yyyy-MM-dd");
            return {
              date: dateStr,
              dayOfWeek: format(d, "EEE"),
              dayOfMonth: d.getDate(),
              available: dateMap.get(dateStr) ?? true, // Default to available if not specified
            };
          }
        );

        setAvailableDates(dates);
      } catch (error) {
        console.error("Error fetching availability:", error);
        // Set all dates as available on error (fallback)
        const dates: AvailableDate[] = Array.from(
          { length: DAYS_TO_SHOW },
          (_, i) => {
            const d = addDays(startDate, i);
            return {
              date: format(d, "yyyy-MM-dd"),
              dayOfWeek: format(d, "EEE"),
              dayOfMonth: d.getDate(),
              available: true,
            };
          }
        );
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
        // API returns { slots: [{ date, available, slots: [{ time, available }] }] }
        const slots: TimeSlot[] = [];
        const slotsArray = data.slots ?? data;
        if (Array.isArray(slotsArray)) {
          // Find the slot for the selected date
          const dateSlot = slotsArray.find(
            (s: { date?: string }) => s.date === date
          );
          if (dateSlot?.slots && Array.isArray(dateSlot.slots)) {
            dateSlot.slots.forEach(
              (slot: { time?: string; available?: boolean }) => {
                if (slot.time) {
                  slots.push({
                    start: slot.time,
                    end: "",
                    available: slot.available ?? true,
                  });
                }
              }
            );
          }
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
    setStartDate((current) =>
      addDays(current, direction === "next" ? DAYS_TO_SHOW : -DAYS_TO_SHOW)
    );
  }, []);

  async function handleConfirm() {
    if (!isComplete || !serviceId || !date || !time) return;

    setConfirming(true);
    try {
      if (onConfirm) {
        onConfirm({ serviceId, date, time });
      } else {
        // Add booking to cart via custom endpoint
        const res = await fetch("/api/bookings/add-to-cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: serviceId,
            date,
            time,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to add booking to cart");
        }

        window.location.href = "/cart";
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to confirm booking. Please try again."
      );
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h2 className={styles.title}>New Appointment</h2>
        <a href="/account" className={styles.signIn}>
          Sign in
        </a>
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
        <Button
          fullWidth
          onClick={handleConfirm}
          disabled={!isComplete || confirming}
        >
          {confirming ? "Confirming..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  );
}
