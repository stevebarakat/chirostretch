"use client";

import { ChevronDown } from "lucide-react";
import type { BookableService, PractitionerType } from "./types";
import styles from "./ServiceSelect.module.css";

type ServiceSelectProps = {
  services: BookableService[];
  selectedId: number | null;
  onSelect: (id: string | null) => void;
  loading?: boolean;
};

function formatDuration(duration: number, unit: "minute" | "hour" | "day"): string {
  if (unit === "minute") {
    return `${duration} min`;
  }
  if (unit === "hour") {
    return duration === 1 ? "1 hour" : `${duration} hours`;
  }
  return duration === 1 ? "1 day" : `${duration} days`;
}

const PRACTITIONER_LABELS: Record<PractitionerType, string> = {
  chiropractor: "Chiropractor",
  physical_therapist: "Physical Therapist",
  massage_therapist: "Massage Therapist",
  sports_medicine: "Sports Medicine Specialist",
};

function formatPractitioners(types: PractitionerType[]): string {
  return types.map((t) => PRACTITIONER_LABELS[t]).join(" + ");
}

export function ServiceSelect({ services, selectedId, onSelect, loading }: ServiceSelectProps) {
  const selectedService = services.find((s) => s.id === selectedId);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    onSelect(value || null);
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>Service Type</label>
      <div className={styles.selectWrapper}>
        <select
          className={styles.select}
          value={selectedId?.toString() ?? ""}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="">Select a service...</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} ({formatDuration(service.duration, service.durationUnit)})
            </option>
          ))}
        </select>
        <ChevronDown className={styles.icon} size={20} />
      </div>
      {selectedService?.practitionerTypes && selectedService.practitionerTypes.length > 0 && (
        <p className={styles.practitioner}>
          {formatPractitioners(selectedService.practitionerTypes)}
        </p>
      )}
    </div>
  );
}
