import { wpGraphQLFetch } from "@/lib/cms/wpgraphql";

export const VIEWER_FRANCHISE_LOCATION_QUERY = `
  query ViewerFranchiseLocation {
    viewer {
      databaseId
      firstName
      lastName
      email
      franchiseLocation {
        databaseId
        title
        slug
        streetAddress
        city
        state
        zip
        phone
        email
        shortDescription
        hours {
          day
          open
          close
        }
        servicesOffered
        staff {
          nodes {
            databaseId
            title
            staffType
            email
            isPublic
            acceptingPatients
            jobTitle
            headshot {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;

export type LocationHours = {
  day: string;
  open: string;
  close: string;
};

export type StaffMember = {
  databaseId: number;
  title: string;
  staffType: string;
  email: string;
  isPublic: boolean;
  acceptingPatients: boolean;
  jobTitle: string | null;
  headshot: {
    sourceUrl: string;
    altText: string;
  } | null;
};

export type FranchiseLocation = {
  databaseId: number;
  title: string;
  slug: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  shortDescription: string;
  hours: LocationHours[];
  servicesOffered: string[];
  staff: {
    nodes: StaffMember[];
  };
};

export type FranchiseeViewer = {
  databaseId: number;
  firstName: string;
  lastName: string;
  email: string;
  franchiseLocation: FranchiseLocation | null;
};

export type ViewerFranchiseLocationResponse = {
  viewer: FranchiseeViewer | null;
};

export async function getViewerFranchiseLocation(): Promise<FranchiseeViewer | null> {
  try {
    const data = await wpGraphQLFetch<ViewerFranchiseLocationResponse>({
      query: VIEWER_FRANCHISE_LOCATION_QUERY,
      auth: true,
    });
    return data.viewer;
  } catch (error) {
    console.error("Error fetching franchise location:", error);
    return null;
  }
}

// Re-export from constants for backwards compatibility
export { STAFF_TYPE_LABELS } from "@/lib/constants/staff";

export const GET_STAFF_BY_ID_QUERY = `
  query GetStaffById($id: ID!) {
    staffMember(id: $id, idType: DATABASE_ID) {
      databaseId
      title
      staffType
      email
      jobTitle
      bio
      credentials
      specialties
      servicesOffered
      isPublic
      acceptingPatients
      headshot {
        sourceUrl
        altText
      }
      assignedLocation {
        databaseId
        title
      }
    }
  }
`;

export type StaffDetail = {
  databaseId: number;
  title: string;
  staffType: string;
  email: string;
  jobTitle: string | null;
  bio: string | null;
  credentials: string | null;
  specialties: string[] | null;
  servicesOffered: string[];
  isPublic: boolean;
  acceptingPatients: boolean;
  headshot: {
    sourceUrl: string;
    altText: string;
  } | null;
  assignedLocation: {
    databaseId: number;
    title: string;
  } | null;
};

type GetStaffByIdResponse = {
  staffMember: StaffDetail | null;
};

export async function getStaffById(id: number): Promise<StaffDetail | null> {
  try {
    const data = await wpGraphQLFetch<GetStaffByIdResponse>({
      query: GET_STAFF_BY_ID_QUERY,
      variables: { id: id.toString() },
      auth: true,
    });
    return data.staffMember;
  } catch (error) {
    console.error("Error fetching staff member:", error);
    return null;
  }
}
