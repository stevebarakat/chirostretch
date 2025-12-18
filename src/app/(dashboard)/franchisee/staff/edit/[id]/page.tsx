import { notFound } from "next/navigation";
import {
  getViewerFranchiseLocation,
  getStaffById,
} from "@/lib/graphql/queries/franchisee";
import { StaffForm } from "../../StaffForm";
import styles from "../../page.module.css";

type EditStaffPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EditStaffPageProps) {
  const { id } = await params;
  const staff = await getStaffById(parseInt(id, 10));

  return {
    title: staff ? `Edit ${staff.title} - ChiroStretch` : "Edit Staff - ChiroStretch",
    description: "Edit staff member details",
  };
}

export default async function EditStaffPage({ params }: EditStaffPageProps) {
  const { id } = await params;
  const staffId = parseInt(id, 10);

  if (isNaN(staffId)) {
    notFound();
  }

  const [viewer, staff] = await Promise.all([
    getViewerFranchiseLocation(),
    getStaffById(staffId),
  ]);

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

  if (!staff) {
    notFound();
  }

  // Verify staff belongs to franchisee's location
  if (staff.assignedLocation?.databaseId !== viewer.franchiseLocation.databaseId) {
    return (
      <div className={styles.errorState}>
        <h2>Not Authorized</h2>
        <p>You can only edit staff members at your location.</p>
      </div>
    );
  }

  return (
    <>
      <h1 style={{ marginBottom: "1.5rem" }}>Edit Staff Member</h1>
      <StaffForm
        locationId={viewer.franchiseLocation.databaseId}
        locationName={viewer.franchiseLocation.title}
        initialData={{
          id: staff.databaseId,
          title: staff.title,
          email: staff.email,
          staffType: staff.staffType,
          jobTitle: staff.jobTitle || "",
          bio: staff.bio || "",
          credentials: staff.credentials || "",
          servicesOffered: staff.servicesOffered || [],
          isPublic: staff.isPublic,
          acceptingPatients: staff.acceptingPatients,
          headshot: staff.headshot,
        }}
        isEdit
      />
    </>
  );
}
