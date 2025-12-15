import { Suspense } from "react";
import { BookingWidget } from "@/components/bookings";
import type { BookableService } from "@/components/bookings";
import styles from "./page.module.css";

// Services - will be replaced with WooCommerce Bookings data
const SERVICES: BookableService[] = [
  {
    id: 1,
    name: "Initial Consultation",
    duration: 60,
    durationUnit: "minute",
    practitionerTypes: ["chiropractor"],
  },
  {
    id: 2,
    name: "Chiro Adjustment",
    duration: 15,
    durationUnit: "minute",
    practitionerTypes: ["chiropractor"],
  },
  {
    id: 3,
    name: "Stretch Therapy",
    duration: 30,
    durationUnit: "minute",
    practitionerTypes: ["physical_therapist"],
  },
  {
    id: 4,
    name: "Chiro + Stretch Combo",
    duration: 45,
    durationUnit: "minute",
    practitionerTypes: ["chiropractor", "physical_therapist"],
  },
  {
    id: 5,
    name: "Massage",
    duration: 30,
    durationUnit: "minute",
    practitionerTypes: ["massage_therapist"],
  },
  {
    id: 6,
    name: "Massage",
    duration: 60,
    durationUnit: "minute",
    practitionerTypes: ["massage_therapist"],
  },
  {
    id: 7,
    name: "Injury Rehab",
    duration: 60,
    durationUnit: "minute",
    practitionerTypes: ["sports_medicine"],
  },
];

export const metadata = {
  title: "Book an Appointment | ChiroStretch",
  description: "Schedule your chiropractic appointment online.",
};

function BookingWidgetWrapper() {
  return <BookingWidget services={SERVICES} />;
}

export default function BookPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Suspense fallback={<BookingWidgetSkeleton />}>
          <BookingWidgetWrapper />
        </Suspense>
      </div>
    </main>
  );
}

function BookingWidgetSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonHeader} />
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonField} />
        <div className={styles.skeletonField} />
        <div className={styles.skeletonField} />
      </div>
      <div className={styles.skeletonButton} />
    </div>
  );
}
