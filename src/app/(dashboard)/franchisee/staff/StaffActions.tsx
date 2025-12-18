"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

type StaffActionsProps = {
  staffId: number;
  staffName: string;
};

export function StaffActions({ staffId, staffName }: StaffActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/franchisee/staff/${staffId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete staff member");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert(error instanceof Error ? error.message : "Failed to delete staff member");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className={styles.confirmDelete}>
        <p className={styles.confirmText}>Delete {staffName}?</p>
        <div className={styles.confirmActions}>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={styles.confirmDeleteButton}
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.actions}>
      <Link
        href={`/franchisee/staff/edit/${staffId}`}
        className={styles.editLink}
      >
        Edit
      </Link>
      <button
        onClick={() => setShowConfirm(true)}
        className={styles.deleteButton}
      >
        Delete
      </button>
    </div>
  );
}
