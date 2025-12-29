"use client";

import Image from "next/image";
import { AccountDetailsForm } from "@/components/Account";
import { updateAccountDetails } from "../actions";
import { useState } from "react";
import styles from "./AccountDetailsFormWrapper.module.css";

type AccountDetailsFormWrapperProps = {
  userId: number;
  initialData: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    nickname?: string | null;
    description?: string | null;
    url?: string | null;
    job_title?: string | null;
    avatarUrl?: string | null;
  };
};

type AccountDetails = {
  firstName: string;
  lastName: string;
  email: string;
  newPassword?: string;
  nickname?: string;
  description?: string;
  url?: string;
  job_title?: string;
};

export function AccountDetailsFormWrapper({
  userId,
  initialData,
}: AccountDetailsFormWrapperProps) {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<
    AccountDetails & { avatarUrl?: string | null }
  >({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    email: initialData.email || "",
    nickname: initialData.nickname || "",
    description: initialData.description || "",
    url: initialData.url || "",
    job_title: initialData.job_title || "",
    avatarUrl: initialData.avatarUrl || null,
  });

  const handleSubmit = async (data: Partial<AccountDetails>) => {
    const updates: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      nickname?: string;
      description?: string;
      url?: string;
      job_title?: string;
    } = {};

    if (data.firstName) updates.firstName = data.firstName;
    if (data.lastName) updates.lastName = data.lastName;
    if (data.email) updates.email = data.email;
    if (data.newPassword) updates.password = data.newPassword;
    if (data.nickname !== undefined) updates.nickname = data.nickname;
    if (data.description !== undefined) updates.description = data.description;
    if (data.url !== undefined) updates.url = data.url;
    if (data.job_title !== undefined) updates.job_title = data.job_title;

    const result = await updateAccountDetails(userId, updates);
    if (!result.success) {
      throw new Error(result.error);
    }

    // Update local display values and exit edit mode
    setProfile(
      (prev) =>
        ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(data).filter(([, v]) => v !== undefined)
          ),
        }) as AccountDetails & { avatarUrl?: string | null }
    );

    setEditing(false);
  };

  if (!editing) {
    return (
      <div>
        <div className={styles.header}>
          {profile.avatarUrl && (
            <Image
              src={profile.avatarUrl}
              alt="Avatar"
              width={80}
              height={80}
              className={styles.avatar}
            />
          )}
          <div>
            <h2 className={styles.name}>
              {`${profile.firstName} ${profile.lastName}`}
            </h2>
            <div className={styles.nickname}>{profile.nickname || ""}</div>
          </div>
        </div>

        <div className={styles.field}>
          <strong>Email:</strong> {profile.email}
        </div>
        <div className={styles.field}>
          <strong>Job Title:</strong> {profile.job_title}
        </div>
        <div className={styles.field}>
          <strong>Website:</strong>{" "}
          {profile.url ? (
            <a href={profile.url} target="_blank" rel="noreferrer">
              {profile.url}
            </a>
          ) : (
            "—"
          )}
        </div>
        <div className={styles.bioField}>
          <strong>Bio:</strong>
          <div>{profile.description || "—"}</div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={styles.editButton}
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  return <AccountDetailsForm initialData={profile} onSubmit={handleSubmit} />;
}

