export const VIEWER_STAFF_PROFILE_QUERY = `
  query ViewerStaffProfile {
    viewer {
      staffProfile {
        databaseId
        title
        staffType
        jobTitle
        credentials
        specialties
        bio
        acceptingPatients
        isPublic
        servicesOffered
        headshot {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
        assignedLocation {
          databaseId
          title
          slug
          streetAddress
          city
          state
          zip
          phone
          email
        }
      }
    }
  }
`;

export type StaffProfile = {
  databaseId: number;
  title: string;
  staffType: string;
  jobTitle: string;
  credentials: string;
  specialties: string[];
  bio: string;
  acceptingPatients: boolean;
  isPublic: boolean;
  servicesOffered: string[];
  headshot: {
    sourceUrl: string;
    altText: string;
    mediaDetails: {
      width: number;
      height: number;
    };
  } | null;
  assignedLocation: {
    databaseId: number;
    title: string;
    slug: string;
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
  } | null;
};

export type ViewerStaffProfileResponse = {
  viewer: {
    staffProfile: StaffProfile | null;
  } | null;
};

// Re-export from constants for backwards compatibility
export { STAFF_TYPE_LABELS } from "@/lib/constants/staff";
