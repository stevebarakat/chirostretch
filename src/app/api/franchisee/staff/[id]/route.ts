import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { wpGraphQLFetch } from "@/lib/cms/wpgraphql";

const DELETE_STAFF_MUTATION = `
  mutation DeleteStaff($input: DeleteStaffInput!) {
    deleteStaff(input: $input) {
      success
      deletedId
    }
  }
`;

const UPDATE_STAFF_MUTATION = `
  mutation UpdateStaff($input: UpdateStaffInput!) {
    updateStaff(input: $input) {
      success
      staff {
        databaseId
        title
      }
    }
  }
`;

type DeleteStaffResponse = {
  deleteStaff: {
    success: boolean;
    deletedId: number | null;
  };
};

type UpdateStaffResponse = {
  updateStaff: {
    success: boolean;
    staff: {
      databaseId: number;
      title: string;
    } | null;
  };
};

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("wp-auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const staffId = parseInt(id, 10);

    if (isNaN(staffId)) {
      return NextResponse.json(
        { error: "Invalid staff ID" },
        { status: 400 }
      );
    }

    const data = await wpGraphQLFetch<DeleteStaffResponse>({
      query: DELETE_STAFF_MUTATION,
      variables: { input: { id: staffId } },
      auth: true,
    });

    if (!data.deleteStaff?.success) {
      return NextResponse.json(
        { error: "Failed to delete staff member" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      deletedId: data.deleteStaff.deletedId,
    });
  } catch (error) {
    console.error("Error deleting staff:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("wp-auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const staffId = parseInt(id, 10);

    if (isNaN(staffId)) {
      return NextResponse.json(
        { error: "Invalid staff ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const input: Record<string, unknown> = {
      id: staffId,
    };

    if (body.bio !== undefined) input.bio = body.bio;
    if (body.headshot !== undefined) input.headshot = body.headshot;
    if (body.acceptingPatients !== undefined) input.acceptingPatients = body.acceptingPatients;
    if (body.isPublic !== undefined) input.isPublic = body.isPublic;
    if (body.credentials !== undefined) input.credentials = body.credentials;
    if (body.specialties !== undefined) input.specialties = body.specialties;
    if (body.servicesOffered !== undefined) input.servicesOffered = body.servicesOffered;
    if (body.jobTitle !== undefined) input.jobTitle = body.jobTitle;

    const data = await wpGraphQLFetch<UpdateStaffResponse>({
      query: UPDATE_STAFF_MUTATION,
      variables: { input },
      auth: true,
    });

    if (!data.updateStaff?.success) {
      return NextResponse.json(
        { error: "Failed to update staff member" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      staff: data.updateStaff.staff,
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
