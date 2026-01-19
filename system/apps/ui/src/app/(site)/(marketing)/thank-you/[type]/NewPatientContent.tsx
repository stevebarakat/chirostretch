"use client";

import { useState } from "react";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/Primitives";
import { Confirmation } from "@/components/Confirmation";
import LocationSearchModal from "@/components/Search/LocationSearchModal";
import styles from "./NewPatientContent.module.css";

type NewPatientContentProps = {
  name: string;
  email: string;
  couponCode?: string;
  couponExpires?: string;
};

export function NewPatientContent({ name, email, couponCode, couponExpires }: NewPatientContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const expiresFormatted = couponExpires
    ? new Date(couponExpires).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Confirmation
      heading={`You're All Set, ${name}!`}
      subtext="Your new patient special is confirmed"
    >
      <div className={styles.couponBox}>
        <p className={styles.couponLabel}>Your Exclusive Coupon Code</p>
        <p className={styles.couponCode}>{couponCode || "Check your email"}</p>
      </div>

      <p className={styles.emailNotice}>
        We&apos;ve sent a copy to <strong>{email}</strong>
      </p>

      <div className={styles.nextStepBox}>
        <p className={styles.nextStepLabel}>
          <ArrowRight size={14} />
          Next Step
        </p>
        <p className={styles.nextStepText}>Find a location to book your $29 consultation</p>
      </div>

      <Button
        size="lg"
        icon={<MapPin size={20} />}
        iconPosition="left"
        onClick={() => setIsModalOpen(true)}
      >
        Find A Location
      </Button>

      <LocationSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {expiresFormatted && (
        <p className={styles.expiry}>Coupon valid until {expiresFormatted}</p>
      )}
    </Confirmation>
  );
}
