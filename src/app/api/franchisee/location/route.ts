import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { wpGraphQLFetch } from "@/lib/wpgraphql";

const UPDATE_LOCATION_MUTATION = `
  mutation UpdateLocation($input: UpdateLocationInput!) {
    updateLocation(input: $input) {
      success
      location {
        databaseId
        title
      }
    }
  }
`;

type UpdateLocationInput = {
  id: number;
  title?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  shortDescription?: string;
  hours?: Array<{
    day: string;
    open: string;
    close: string;
  }>;
};

type UpdateLocationResponse = {
  updateLocation: {
    success: boolean;
    location: {
      databaseId: number;
      title: string;
    } | null;
  };
};

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("wp-auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body: UpdateLocationInput = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Location ID is required" },
        { status: 400 }
      );
    }

    const input: Record<string, unknown> = {
      id: body.id,
    };

    if (body.title !== undefined) input.title = body.title;
    if (body.streetAddress !== undefined) input.streetAddress = body.streetAddress;
    if (body.city !== undefined) input.city = body.city;
    if (body.state !== undefined) input.state = body.state;
    if (body.zip !== undefined) input.zip = body.zip;
    if (body.phone !== undefined) input.phone = body.phone;
    if (body.email !== undefined) input.email = body.email;
    if (body.shortDescription !== undefined) input.description = body.shortDescription;
    if (body.hours !== undefined) input.hours = body.hours;

    const data = await wpGraphQLFetch<UpdateLocationResponse>({
      query: UPDATE_LOCATION_MUTATION,
      variables: { input },
      auth: true,
    });

    if (!data.updateLocation?.success) {
      return NextResponse.json(
        { error: "Failed to update location" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      location: data.updateLocation.location,
    });
  } catch (error) {
    console.error("Error updating location:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
