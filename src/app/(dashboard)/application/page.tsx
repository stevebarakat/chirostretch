import { redirect } from "next/navigation";
import Link from "next/link";
import { wpGraphQLFetch } from "@/lib/cms/wpgraphql";
import styles from "./page.module.css";

export const metadata = {
  title: "Franchise Application Status - ChiroStretch",
  description: "View your franchise application status",
};

type FranchiseApplication = {
  databaseId: number;
  title: string;
  applicationStatus: string;
  submittedDate: string;
  applicantLocation: string;
};

type ViewerApplicationsResponse = {
  viewer: {
    roles: {
      nodes: { name: string }[];
    };
    franchiseApplications: {
      nodes: FranchiseApplication[];
    };
  } | null;
};

const GET_MY_APPLICATION = `
  query GetMyApplication {
    viewer {
      roles {
        nodes {
          name
        }
      }
      franchiseApplications(first: 1) {
        nodes {
          databaseId
          title
          applicationStatus
          submittedDate
          applicantLocation
        }
      }
    }
  }
`;

type ApplicationData = {
  application: FranchiseApplication | null;
  roles: string[];
};

async function getMyApplication(): Promise<ApplicationData> {
  try {
    const data = await wpGraphQLFetch<ViewerApplicationsResponse>({
      query: GET_MY_APPLICATION,
      auth: true,
    });

    const roles = data.viewer?.roles?.nodes?.map((r) => r.name) || [];
    const application = data.viewer?.franchiseApplications?.nodes?.[0] || null;

    return { application, roles };
  } catch (error) {
    console.error("Error fetching franchise application:", error);
    return { application: null, roles: [] };
  }
}

function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "Pending Review",
    reviewing: "Under Review",
    approved: "Approved",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
  };
  return statusMap[status] || status;
}

function getStatusClass(status: string): string {
  return styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`] || "";
}

export default async function ApplicationStatusPage() {
  const { application, roles } = await getMyApplication();

  // If user has been promoted to franchisee, redirect to franchisee dashboard
  if (roles.includes("franchisee")) {
    redirect("/franchisee");
  }

  return (
    <>
      <h1 style={{ marginBottom: "1.5rem" }}>Franchise Application</h1>

      {application ? (
        <div className={styles.applicationCard}>
          <div className={styles.statusBadge}>
            <span className={`${styles.status} ${getStatusClass(application.applicationStatus)}`}>
              {getStatusLabel(application.applicationStatus)}
            </span>
          </div>

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Application:</span>
              <span className={styles.value}>{application.title}</span>
            </div>

            {application.submittedDate && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Submitted:</span>
                <span className={styles.value}>
                  {new Date(application.submittedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}

            {application.applicantLocation && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Desired Territory:</span>
                <span className={styles.value}>{application.applicantLocation}</span>
              </div>
            )}
          </div>

          <div className={styles.statusMessage}>
            {application.applicationStatus === "pending" && (
              <p>Your application has been received and is awaiting review. We will contact you once our team begins the review process.</p>
            )}
            {application.applicationStatus === "reviewing" && (
              <p>Great news! Your application is currently being reviewed by our franchising team. We will be in touch soon with next steps.</p>
            )}
            {application.applicationStatus === "approved" && (
              <p>Congratulations! Your franchise application has been approved. Our team will contact you shortly with onboarding information.</p>
            )}
            {application.applicationStatus === "rejected" && (
              <p>Thank you for your interest in ChiroStretch. Unfortunately, we are unable to move forward with your application at this time.</p>
            )}
            {application.applicationStatus === "withdrawn" && (
              <p>Your application has been withdrawn. If you have any questions, please contact our support team.</p>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.noApplication}>
          <p>No franchise application found.</p>
          <p>If you recently submitted an application, please allow a few moments for it to appear.</p>
        </div>
      )}

      <div className={styles.actions}>
        <Link href="/contact" className={styles.contactLink}>
          Contact Support
        </Link>
        <Link href="/logout" className={styles.logoutLink}>
          Log Out
        </Link>
      </div>
    </>
  );
}
