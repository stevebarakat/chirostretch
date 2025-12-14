import { redirect, notFound } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { FranchiseeDashboardLayout } from "@/components/franchisee";
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
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    const { id } = await params;
    redirect(`/login?redirect=/my-account/franchisee/staff/edit/${id}`);
  }

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
      <FranchiseeDashboardLayout title="Edit Staff Member">
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

  if (!staff) {
    notFound();
  }

  // Verify staff belongs to franchisee's location
  if (staff.assignedLocation?.databaseId !== viewer.franchiseLocation.databaseId) {
    return (
      <FranchiseeDashboardLayout title="Edit Staff Member">
        <div className={styles.errorState}>
          <h2>Not Authorized</h2>
          <p>You can only edit staff members at your location.</p>
        </div>
      </FranchiseeDashboardLayout>
    );
  }

  return (
    <FranchiseeDashboardLayout title="Edit Staff Member">
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
        }}
        isEdit
      />
    </FranchiseeDashboardLayout>
  );
}
