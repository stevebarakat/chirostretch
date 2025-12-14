"use client";

import { useState } from "react";
import type { FranchiseLocation, LocationHours } from "@/lib/graphql/queries/franchisee";
import styles from "./page.module.css";

type LocationEditorProps = {
  location: FranchiseLocation;
};

type LocationFormData = {
  title: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  shortDescription: string;
  hours: LocationHours[];
};

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function LocationEditor({ location }: LocationEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LocationFormData>({
    title: location.title,
    streetAddress: location.streetAddress || "",
    city: location.city || "",
    state: location.state || "",
    zip: location.zip || "",
    phone: location.phone || "",
    email: location.email || "",
    shortDescription: location.shortDescription || "",
    hours: location.hours?.length
      ? location.hours
      : DAYS_OF_WEEK.map((day) => ({ day, open: "", close: "" })),
  });

  const handleCancel = () => {
    setFormData({
      title: location.title,
      streetAddress: location.streetAddress || "",
      city: location.city || "",
      state: location.state || "",
      zip: location.zip || "",
      phone: location.phone || "",
      email: location.email || "",
      shortDescription: location.shortDescription || "",
      hours: location.hours?.length
        ? location.hours
        : DAYS_OF_WEEK.map((day) => ({ day, open: "", close: "" })),
    });
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/franchisee/location", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: location.databaseId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save location");
      }

      setIsEditing(false);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof LocationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateHours = (index: number, field: "open" | "close", value: string) => {
    setFormData((prev) => ({
      ...prev,
      hours: prev.hours.map((h, i) =>
        i === index ? { ...h, [field]: value } : h
      ),
    }));
  };

  if (isEditing) {
    return (
      <div className={styles.editor}>
        <div className={styles.editorHeader}>
          <h2 className={styles.sectionTitle}>Edit Location</h2>
          <div className={styles.editorActions}>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={styles.saveButton}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.form}>
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Basic Information</h3>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>
                Location Name
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="shortDescription" className={styles.label}>
                Description
              </label>
              <textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => updateField("shortDescription", e.target.value)}
                className={styles.textarea}
                rows={3}
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Address</h3>
            <div className={styles.formGroup}>
              <label htmlFor="streetAddress" className={styles.label}>
                Street Address
              </label>
              <input
                type="text"
                id="streetAddress"
                value={formData.streetAddress}
                onChange={(e) => updateField("streetAddress", e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city" className={styles.label}>
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroupSmall}>
                <label htmlFor="state" className={styles.label}>
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  value={formData.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  className={styles.input}
                  maxLength={2}
                />
              </div>
              <div className={styles.formGroupSmall}>
                <label htmlFor="zip" className={styles.label}>
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => updateField("zip", e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Contact Information</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>Business Hours</h3>
            <div className={styles.hoursGrid}>
              {formData.hours.map((hour, index) => (
                <div key={hour.day} className={styles.hoursRow}>
                  <span className={styles.dayLabel}>{hour.day}</span>
                  <input
                    type="time"
                    value={hour.open}
                    onChange={(e) => updateHours(index, "open", e.target.value)}
                    className={styles.timeInput}
                  />
                  <span className={styles.timeSeparator}>to</span>
                  <input
                    type="time"
                    value={hour.close}
                    onChange={(e) => updateHours(index, "close", e.target.value)}
                    className={styles.timeInput}
                  />
                </div>
              ))}
            </div>
            <p className={styles.hoursNote}>
              Leave times empty for closed days.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // View mode
  return (
    <div className={styles.viewer}>
      <div className={styles.viewerHeader}>
        <h2 className={styles.locationTitle}>{location.title}</h2>
        <button onClick={() => setIsEditing(true)} className={styles.editButton}>
          Edit
        </button>
      </div>

      <div className={styles.sections}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Address</h3>
          {location.streetAddress ? (
            <p className={styles.sectionContent}>
              {location.streetAddress}
              <br />
              {location.city}, {location.state} {location.zip}
            </p>
          ) : (
            <p className={styles.emptyContent}>No address set</p>
          )}
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Contact</h3>
          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Phone</span>
              <span className={styles.contactValue}>
                {location.phone || "Not set"}
              </span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Email</span>
              <span className={styles.contactValue}>
                {location.email || "Not set"}
              </span>
            </div>
          </div>
        </div>

        {location.shortDescription && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Description</h3>
            <p className={styles.sectionContent}>{location.shortDescription}</p>
          </div>
        )}

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Business Hours</h3>
          {location.hours && location.hours.length > 0 ? (
            <div className={styles.hoursDisplay}>
              {location.hours.map((hour) => (
                <div key={hour.day} className={styles.hoursDisplayRow}>
                  <span className={styles.dayLabel}>{hour.day}</span>
                  <span className={styles.hoursValue}>
                    {hour.open && hour.close
                      ? `${formatTime(hour.open)} - ${formatTime(hour.close)}`
                      : "Closed"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyContent}>No hours set</p>
          )}
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Public Page</h3>
          <a
            href={`/locations/${location.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.publicLink}
          >
            View your public location page
          </a>
        </div>
      </div>
    </div>
  );
}

function formatTime(time: string): string {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}
