// Temporary test file to verify route structure
// This should be deleted after testing

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: "Test POST route works",
    timestamp: new Date().toISOString()
  });
}



