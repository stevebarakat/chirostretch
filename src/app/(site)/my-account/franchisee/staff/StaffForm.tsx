"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { STAFF_TYPE_LABELS } from "@/lib/graphql/queries/franchisee";
import styles from "./StaffForm.module.css";

const STAFF_TYPES = Object.entries(STAFF_TYPE_LABELS);

const SERVICES = [
  "Chiropractic",
  "Stretch Therapy",
  "Massage",
  "Physical Therapy",
  "Accident Rehab",
  "Sports Injuries",
  "Cupping Therapy",
  "Dry Needling",
  "Spinal Decompression",
  "Acupuncture",
];

type StaffFormData = {
  title: string;
  email: string;
  staffType: string;
  jobTitle: string;
  bio: string;
  credentials: string;
  servicesOffered: string[];
  isPublic: boolean;
  acceptingPatients: boolean;
};

type StaffFormProps = {
  locationId: number;
  locationName: string;
  initialData?: Partial<StaffFormData> & { id?: number };
  isEdit?: boolean;
};

export function StaffForm({
  locationId,
  locationName,
  initialData,
  isEdit = false,
}: StaffFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<StaffFormData>({
    title: initialData?.title || "",
    email: initialData?.email || "",
    staffType: initialData?.staffType || "chiropractor",
    jobTitle: initialData?.jobTitle || "",
    bio: initialData?.bio || "",
    credentials: initialData?.credentials || "",
    servicesOffered: initialData?.servicesOffered || [],
    isPublic: initialData?.isPublic ?? true,
    acceptingPatients: initialData?.acceptingPatients ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const url = isEdit
        ? `/api/franchisee/staff/${initialData?.id}`
        : "/api/franchisee/staff";
      const method = isEdit ? "PUT" : "POST";

      const body = isEdit
        ? {
            bio: formData.bio,
            credentials: formData.credentials,
            jobTitle: formData.jobTitle,
            servicesOffered: formData.servicesOffered,
            isPublic: formData.isPublic,
            acceptingPatients: formData.acceptingPatients,
          }
        : {
            ...formData,
            locationId,
          };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save staff member");
      }

      router.push("/my-account/franchisee/staff");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = <K extends keyof StaffFormData>(
    field: K,
    value: StaffFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      servicesOffered: prev.servicesOffered.includes(service)
        ? prev.servicesOffered.filter((s) => s !== service)
        : [...prev.servicesOffered, service],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.header}>
        <p className={styles.locationInfo}>Adding staff to: {locationName}</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Basic Information</h3>

        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Full Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            className={styles.input}
            required
            disabled={isEdit}
          />
          {isEdit && (
            <p className={styles.hint}>Name cannot be changed after creation.</p>
          )}
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email <span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={styles.input}
              required
              disabled={isEdit}
            />
            {!isEdit && (
              <p className={styles.hint}>
                A login account will be created with this email.
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="staffType" className={styles.label}>
              Staff Type <span className={styles.required}>*</span>
            </label>
            <select
              id="staffType"
              value={formData.staffType}
              onChange={(e) => updateField("staffType", e.target.value)}
              className={styles.select}
              required
              disabled={isEdit}
            >
              {STAFF_TYPES.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="jobTitle" className={styles.label}>
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              value={formData.jobTitle}
              onChange={(e) => updateField("jobTitle", e.target.value)}
              className={styles.input}
              placeholder="e.g., Lead Chiropractor"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="credentials" className={styles.label}>
              Credentials
            </label>
            <input
              type="text"
              id="credentials"
              value={formData.credentials}
              onChange={(e) => updateField("credentials", e.target.value)}
              className={styles.input}
              placeholder="e.g., DC, CCSP"
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Profile</h3>

        <div className={styles.formGroup}>
          <label htmlFor="bio" className={styles.label}>
            Bio
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            className={styles.textarea}
            rows={4}
            placeholder="Brief description of this staff member's background and expertise..."
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Services Offered</h3>
        <p className={styles.sectionDescription}>
          Select the services this staff member can provide.
        </p>

        <div className={styles.checkboxGrid}>
          {SERVICES.map((service) => (
            <label key={service} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.servicesOffered.includes(service)}
                onChange={() => toggleService(service)}
                className={styles.checkbox}
              />
              {service}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Visibility</h3>

        <div className={styles.toggleGroup}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => updateField("isPublic", e.target.checked)}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSwitch} />
            <span className={styles.toggleText}>
              <strong>Show on website</strong>
              <span>Display this staff member on the public location page</span>
            </span>
          </label>

          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={formData.acceptingPatients}
              onChange={(e) => updateField("acceptingPatients", e.target.checked)}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSwitch} />
            <span className={styles.toggleText}>
              <strong>Accepting patients</strong>
              <span>This staff member is currently accepting new patients</span>
            </span>
          </label>
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/my-account/franchisee/staff" className={styles.cancelButton}>
          Cancel
        </Link>
        <button type="submit" disabled={isSaving} className={styles.saveButton}>
          {isSaving
            ? "Saving..."
            : isEdit
            ? "Save Changes"
            : "Add Staff Member"}
        </button>
      </div>
    </form>
  );
}
