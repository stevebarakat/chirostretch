import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { FranchiseeDashboardLayout } from "@/components/franchisee";
import { getViewerFranchiseLocation } from "@/lib/graphql/queries/franchisee";
import { StaffForm } from "../StaffForm";
import styles from "../page.module.css";

export const metadata = {
  title: "Add Staff Member - ChiroStretch",
  description: "Add a new staff member to your franchise",
};

export default async function AddStaffPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login?redirect=/my-account/franchisee/staff/new");
  }

  const viewer = await getViewerFranchiseLocation();

  if (!viewer?.franchiseLocation) {
    return (
      <FranchiseeDashboardLayout title="Add Staff Member">
        <div className={styles.errorState}>
          <h2>No Location Assigned</h2>
          <p>
            Your franchise location has not been set up yet. Please contact
            support for assistance.
          </p>
        </div>
      </FranchiseeDashboardLayout>
    );
  }

  return (
    <FranchiseeDashboardLayout title="Add Staff Member">
      <StaffForm
        locationId={viewer.franchiseLocation.databaseId}
        locationName={viewer.franchiseLocation.title}
      />
    </FranchiseeDashboardLayout>
  );
}
