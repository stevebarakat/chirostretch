/**
 * Business Hours Formatter
 *
 * Converts normalized weekly hour intervals into compact display format.
 * See: .claude/skills/business-hours/SKILL.md
 */

type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type HourEntry = {
  day: DayOfWeek;
  opens_at: string; // 24h format: "09:00"
  closes_at: string; // 24h format: "18:00"
  is_closed: boolean;
};

type FormattedLine = {
  days: string;
  hours: string;
};

const DAY_ORDER: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DAY_ABBREV: Record<DayOfWeek, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

/**
 * Format 24h time to compact 12h format
 * "09:00" → "9am"
 * "14:30" → "2:30pm"
 * "12:00" → "12pm"
 */
function formatTime(time24: string): string {
  const [hourStr, minuteStr] = time24.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const period = hour >= 12 ? "pm" : "am";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  if (minute === 0) {
    return `${hour12}${period}`;
  }
  return `${hour12}:${minuteStr}${period}`;
}

/**
 * Get a signature for grouping identical hours
 */
function getHoursSignature(entry: HourEntry): string {
  if (entry.is_closed) {
    return "CLOSED";
  }
  return `${entry.opens_at}-${entry.closes_at}`;
}

/**
 * Format a range of days
 * Single day: "Mon"
 * Two days: "Mon–Tue"
 * Multiple: "Mon–Fri"
 */
function formatDayRange(days: DayOfWeek[]): string {
  if (days.length === 1) {
    return DAY_ABBREV[days[0]];
  }
  return `${DAY_ABBREV[days[0]]}–${DAY_ABBREV[days[days.length - 1]]}`;
}

/**
 * Format hours for a group
 * Returns "9am–6pm" or "Closed"
 */
function formatHoursRange(entry: HourEntry): string {
  if (entry.is_closed) {
    return "Closed";
  }
  return `${formatTime(entry.opens_at)}–${formatTime(entry.closes_at)}`;
}

/**
 * Group consecutive days with identical hours
 */
function groupConsecutiveDays(entries: HourEntry[]): FormattedLine[] {
  // Sort entries by day order
  const sorted = [...entries].sort(
    (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
  );

  const groups: FormattedLine[] = [];
  let currentGroup: DayOfWeek[] = [];
  let currentSignature: string | null = null;
  let currentEntry: HourEntry | null = null;

  for (const entry of sorted) {
    const signature = getHoursSignature(entry);
    const dayIndex = DAY_ORDER.indexOf(entry.day);
    const lastDayInGroup =
      currentGroup.length > 0
        ? DAY_ORDER.indexOf(currentGroup[currentGroup.length - 1])
        : -1;

    // Check if this day is consecutive and has same hours
    const isConsecutive = dayIndex === lastDayInGroup + 1;
    const isSameHours = signature === currentSignature;

    if (isConsecutive && isSameHours) {
      currentGroup.push(entry.day);
    } else {
      // Flush current group
      if (currentGroup.length > 0 && currentEntry) {
        groups.push({
          days: formatDayRange(currentGroup),
          hours: formatHoursRange(currentEntry),
        });
      }
      // Start new group
      currentGroup = [entry.day];
      currentSignature = signature;
      currentEntry = entry;
    }
  }

  // Flush final group
  if (currentGroup.length > 0 && currentEntry) {
    groups.push({
      days: formatDayRange(currentGroup),
      hours: formatHoursRange(currentEntry),
    });
  }

  return groups;
}

/**
 * Format business hours into compact display format
 *
 * @example
 * const hours = [
 *   { day: 'monday', opens_at: '09:00', closes_at: '18:00', is_closed: false },
 *   { day: 'tuesday', opens_at: '09:00', closes_at: '18:00', is_closed: false },
 *   // ...
 * ];
 * formatBusinessHours(hours);
 * // Returns: [
 * //   { days: 'Mon–Fri', hours: '9am–6pm' },
 * //   { days: 'Sat', hours: '10am–2pm' },
 * //   { days: 'Sun', hours: 'Closed' },
 * // ]
 */
export function formatBusinessHours(entries: HourEntry[]): FormattedLine[] {
  if (!entries || entries.length === 0) {
    return [];
  }
  return groupConsecutiveDays(entries);
}

/**
 * Format business hours as a plain text string
 * Each line separated by newline
 *
 * @example
 * formatBusinessHoursText(hours);
 * // Returns: "Mon–Fri: 9am–6pm\nSat: 10am–2pm\nSun: Closed"
 */
export function formatBusinessHoursText(entries: HourEntry[]): string {
  return formatBusinessHours(entries)
    .map((line) => `${line.days}: ${line.hours}`)
    .join("\n");
}
