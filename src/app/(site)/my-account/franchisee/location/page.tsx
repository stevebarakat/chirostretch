import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { FranchiseeDashboardLayout } from "@/components/franchisee";
import { getViewerFranchiseLocation } from "@/lib/graphql/queries/franchisee";
import { LocationEditor } from "./LocationEditor";
import styles from "./page.module.css";

export const metadata = {
  title: "My Location - ChiroStretch",
  description: "View and edit your franchise location details",
};

export default async function FranchiseeLocationPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login?redirect=/my-account/franchisee/location");
  }

  const viewer = await getViewerFranchiseLocation();

  if (!viewer) {
    return (
      <FranchiseeDashboardLayout title="My Location">
        <div className={styles.errorState}>
          <h2>Unable to Load Location</h2>
          <p>Please try logging in again or contact support.</p>
        </div>
      </FranchiseeDashboardLayout>
    );
  }

  const location = viewer.franchiseLocation;

  if (!location) {
    return (
      <FranchiseeDashboardLayout title="My Location">
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
    <FranchiseeDashboardLayout title="My Location">
      <LocationEditor location={location} />
    </FranchiseeDashboardLayout>
  );
}
