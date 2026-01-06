import {
  getDay,
  setDate,
  addDays,
  subDays,
  endOfMonth,
  startOfMonth,
  getDaysInMonth,
} from "date-fns";

/**
 * Generates a 2D array of dates for a calendar month view.
 * Includes overflow days from previous/next months to fill complete weeks.
 */
export function useCalendarDates(focusedMonth: Date): Date[][] {
  const daysInMonth = getDaysInMonth(focusedMonth);
  const firstOfMonth = startOfMonth(focusedMonth);
  const lastOfMonth = endOfMonth(focusedMonth);
  const startWeekday = getDay(firstOfMonth); // 0 (Sun) - 6 (Sat)
  const endWeekday = getDay(lastOfMonth);
  const daysLeft = 6 - endWeekday;

  // Calculate first date to show (may be from previous month)
  const firstDayLastMonth = subDays(firstOfMonth, startWeekday);
  const firstDayNextMonth = addDays(lastOfMonth, 1);

  // Build array of all dates to display
  const allDates: Date[] = [];

  // Previous month overflow
  for (let i = 0; i < startWeekday; i++) {
    allDates.push(addDays(firstDayLastMonth, i));
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    allDates.push(setDate(focusedMonth, i));
  }

  // Next month overflow
  for (let i = 0; i < daysLeft; i++) {
    allDates.push(addDays(firstDayNextMonth, i));
  }

  // Chunk into weeks (7 days each)
  const weeks: Date[][] = [];
  for (let i = 0; i < allDates.length; i += 7) {
    weeks.push(allDates.slice(i, i + 7));
  }

  return weeks;
}

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
