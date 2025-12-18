"use client";

import { AccountDetailsForm } from "@/components/Account";
import { updateAccountDetails } from "./actions";
import { useState } from "react";

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
        } as any)
    );

    setEditing(false);
  };

  if (!editing) {
    return (
      <div>
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          {profile.avatarUrl && (
            <img
              src={profile.avatarUrl}
              alt="Avatar"
              style={{ width: 80, height: 80, borderRadius: 8 }}
            />
          )}
          <div>
            <h2
              style={{ margin: 0 }}
            >{`${profile.firstName} ${profile.lastName}`}</h2>
            <div style={{ color: "#666" }}>{profile.nickname || ""}</div>
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <strong>Email:</strong> {profile.email}
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong>Job Title:</strong> {profile.job_title}
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong>Website:</strong>{" "}
          {profile.url ? (
            <a href={profile.url} target="_blank" rel="noreferrer">
              {profile.url}
            </a>
          ) : (
            "—"
          )}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Bio:</strong>
          <div>{profile.description || "—"}</div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            style={{ marginRight: 8 }}
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  return <AccountDetailsForm initialData={profile} onSubmit={handleSubmit} />;
}
