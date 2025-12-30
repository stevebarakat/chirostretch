import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { wpGraphQLFetch } from "@/lib/cms/wpgraphql";

const CREATE_STAFF_MUTATION = `
  mutation CreateStaff($input: CreateStaffInput!) {
    createStaff(input: $input) {
      success
      staff {
        databaseId
        title
      }
    }
  }
`;

type CreateStaffInput = {
  title: string;
  email: string;
  staffType: string;
  locationId: number;
  jobTitle?: string;
  bio?: string;
  credentials?: string;
  servicesOffered?: string[];
  isPublic?: boolean;
  acceptingPatients?: boolean;
};

type CreateStaffResponse = {
  createStaff: {
    success: boolean;
    staff: {
      databaseId: number;
      title: string;
    } | null;
  };
};

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("wp-auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body: CreateStaffInput = await request.json();

    if (!body.title || !body.email || !body.staffType || !body.locationId) {
      return NextResponse.json(
        { error: "Name, email, staff type, and location are required" },
        { status: 400 }
      );
    }

    const input: Record<string, unknown> = {
      title: body.title,
      email: body.email,
      staffType: body.staffType,
      locationId: body.locationId,
    };

    if (body.jobTitle) input.jobTitle = body.jobTitle;
    if (body.bio) input.bio = body.bio;
    if (body.credentials) input.credentials = body.credentials;
    if (body.servicesOffered) input.servicesOffered = body.servicesOffered;
    if (body.isPublic !== undefined) input.isPublic = body.isPublic;
    if (body.acceptingPatients !== undefined) input.acceptingPatients = body.acceptingPatients;

    const data = await wpGraphQLFetch<CreateStaffResponse>({
      query: CREATE_STAFF_MUTATION,
      variables: { input },
      auth: true,
    });

    if (!data.createStaff?.success) {
      return NextResponse.json(
        { error: "Failed to create staff member" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      staff: data.createStaff.staff,
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
