import { getViewerFranchiseLocation } from "@/lib/graphql/queries/franchisee";
import { LocationEditor } from "./LocationEditor";
import styles from "./page.module.css";

export const metadata = {
  title: "Location Management - ChiroStretch",
  description: "View and edit your franchise location details",
};

export default async function FranchiseeLocationPage() {
  const viewer = await getViewerFranchiseLocation();

  if (!viewer) {
    return (
      <div className={styles.errorState}>
        <h2>Unable to Load Location</h2>
        <p>Please try logging in again or contact support.</p>
      </div>
    );
  }

  const location = viewer.franchiseLocation;

  if (!location) {
    return (
      <div className={styles.errorState}>
        <h2>No Location Assigned</h2>
        <p>
          Your franchise location has not been set up yet. Please contact support
          for assistance.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 style={{ marginBottom: "1.5rem" }}>Location Management</h1>
      <LocationEditor location={location} />
    </>
  );
}
