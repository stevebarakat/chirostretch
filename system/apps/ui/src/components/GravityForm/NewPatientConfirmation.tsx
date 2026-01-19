"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/Primitives";
import LocationSearchModal from "@/components/Search/LocationSearchModal";
import styles from "./NewPatientConfirmation.module.css";

export type NewPatientLeadData = {
  first_name: string;
  email: string;
  coupon_code?: string;
  coupon_expires?: string;
};

type NewPatientConfirmationProps = {
  lead: NewPatientLeadData;
};

export function NewPatientConfirmation({ lead }: NewPatientConfirmationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const expiresFormatted = lead.coupon_expires
    ? new Date(lead.coupon_expires).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>You&apos;re All Set, {lead.first_name}!</h2>

      <p className={styles.subtext}>Your exclusive coupon code:</p>

      <p className={styles.couponCode}>{lead.coupon_code || "Check your email"}</p>

      <p className={styles.emailNotice}>
        We&apos;ve also sent this to <strong>{lead.email}</strong>
      </p>

      <p className={styles.nextStep}>
        <strong>Next Step:</strong> Find a location to book your $29 consultation
      </p>

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
    </div>
  );
}
