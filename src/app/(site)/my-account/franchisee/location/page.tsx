import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { FranchiseeDashboardLayout } from "@/components/franchisee";
import { getViewerFranchiseLocation } from "@/lib/graphql/queries/franchisee";
import { LocationEditor } from "./LocationEditor";
import styles from "./page.module.css";

export const metadata = {
  title: "Location Management - ChiroStretch",
  description: "View and edit your franchise location details",
};

export default async function FranchiseeLocationPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login?redirect=/my-account/franchisee/location");
  }

  const viewer = await getViewerFranchiseLocation();

  const viewerError = !viewer && (
    <div className={styles.errorState}>
      <h2>Unable to Load Location</h2>
      <p>Please try logging in again or contact support.</p>
    </div>
  );

  const location = viewer?.franchiseLocation || null;

  const locationError = !location && (
    <div className={styles.errorState}>
      <h2>No Location Assigned</h2>
      <p>
        Your franchise location has not been set up yet. Please contact support
        for assistance.
      </p>
    </div>
  );

  const content =
    viewerError || locationError ? (
      viewerError || locationError
    ) : (
      <LocationEditor location={location!} />
    );

  return (
    <FranchiseeDashboardLayout title="Location Management">
      {content}
    </FranchiseeDashboardLayout>
  );
}
