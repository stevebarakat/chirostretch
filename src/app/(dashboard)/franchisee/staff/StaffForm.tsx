"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { STAFF_TYPE_LABELS } from "@/lib/constants/staff";
import styles from "./StaffForm.module.css";

const STAFF_TYPES = Object.entries(STAFF_TYPE_LABELS);

const SERVICES = [
  "Chiropractic",
  "Stretch Therapy",
  "Massage",
  "Sports Medicine",
];

type Headshot = {
  sourceUrl: string;
  altText: string;
} | null;

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
  initialData?: Partial<StaffFormData> & { id?: number; headshot?: Headshot };
  isEdit?: boolean;
};

export function StaffForm({
  locationId,
  locationName,
  initialData,
  isEdit = false,
}: StaffFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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

  // Photo state
  const [currentHeadshot] = useState<Headshot>(
    initialData?.headshot || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  const removePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadPhoto = async (): Promise<number | null> => {
    if (!selectedFile) return null;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("staffId", String(initialData?.id || 0));

      const response = await fetch("/api/franchisee/staff/upload-photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload photo");
      }

      const data = await response.json();
      return data.attachmentId;
    } catch (err) {
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Upload photo first if one is selected
      let headshotId: number | null = null;
      if (selectedFile) {
        headshotId = await uploadPhoto();
      }

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
            ...(headshotId && { headshot: headshotId }),
          }
        : {
            ...formData,
            locationId,
            ...(headshotId && { headshot: headshotId }),
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

      router.push("/franchisee/staff");
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

  const displayImageUrl = previewUrl || currentHeadshot?.sourceUrl;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.header}>
        <p className={styles.locationInfo}>Staff Location: {locationName}</p>
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
        <h3 className={styles.sectionTitle}>Profile Photo</h3>
        <p className={styles.sectionDescription}>
          Upload a professional headshot for the website.
        </p>

        <div className={styles.photoUpload}>
          {displayImageUrl ? (
            <div className={styles.photoPreview}>
              <Image
                src={displayImageUrl}
                alt={formData.title || "Staff headshot"}
                width={150}
                height={150}
                className={styles.photoImage}
              />
              <div className={styles.photoActions}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={styles.changePhotoButton}
                >
                  Change Photo
                </button>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className={styles.removePhotoButton}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.photoPlaceholder}>
              <div className={styles.photoPlaceholderIcon}>📷</div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={styles.uploadButton}
              >
                Upload Photo
              </button>
              <p className={styles.hint}>JPG, PNG, or WebP. Max 5MB.</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className={styles.fileInput}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Bio</h3>

        <div className={styles.formGroup}>
          <label htmlFor="bio" className={styles.label}>
            Biography
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
        <Link href="/franchisee/staff" className={styles.cancelButton}>
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSaving || isUploading}
          className={styles.saveButton}
        >
          {isUploading
            ? "Uploading photo..."
            : isSaving
            ? "Saving..."
            : isEdit
            ? "Save Changes"
            : "Add Staff Member"}
        </button>
      </div>
    </form>
  );
}
