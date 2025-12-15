export type PractitionerType =
  | "chiropractor"
  | "physical_therapist"
  | "massage_therapist"
  | "sports_medicine";

export type BookableService = {
  id: number;
  name: string;
  duration: number;
  durationUnit: "minute" | "hour" | "day";
  practitionerTypes: PractitionerType[];
  price?: string;
};

export type AvailableDate = {
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // Mon, Tue, etc.
  dayOfMonth: number;
  available: boolean;
};

export type TimeSlot = {
  start: string; // HH:mm format
  end: string;
  available: boolean;
};

export type BookingState = {
  serviceId: number | null;
  date: string | null; // YYYY-MM-DD
  time: string | null; // HH:mm
};
