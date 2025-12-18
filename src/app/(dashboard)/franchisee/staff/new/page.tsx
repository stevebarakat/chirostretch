import { getViewerFranchiseLocation } from "@/lib/graphql/queries/franchisee";
import { StaffForm } from "../StaffForm";
import styles from "../page.module.css";

export const metadata = {
  title: "Add Staff Member - ChiroStretch",
  description: "Add a new staff member to your franchise",
};

export default async function AddStaffPage() {
  const viewer = await getViewerFranchiseLocation();

  if (!viewer?.franchiseLocation) {
    return (
      <div className={styles.errorState}>
        <h2>No Location Assigned</h2>
        <p>
          Your franchise location has not been set up yet. Please contact
          support for assistance.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 style={{ marginBottom: "1.5rem" }}>Add Staff Member</h1>
      <StaffForm
        locationId={viewer.franchiseLocation.databaseId}
        locationName={viewer.franchiseLocation.title}
      />
    </>
  );
}
