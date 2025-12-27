// Temporary test file to verify route structure
// This should be deleted after testing

import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: NextRequest) {
  return NextResponse.json({
    message: "Test POST route works",
    timestamp: new Date().toISOString()
  });
}



