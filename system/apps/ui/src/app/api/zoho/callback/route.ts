import { NextResponse } from "next/server";

/**
 * OAuth Callback Route for Zoho
 *
 * Receives the authorization code from Zoho OAuth redirect.
 * Used during initial OAuth setup to obtain a refresh token.
 *
 * Setup steps:
 * 1. Add redirect URI in Zoho Console: http://localhost:3000/api/zoho/callback
 * 2. Visit Zoho authorize URL with required params
 * 3. After consent, this route receives the code
 * 4. Exchange code for refresh token using curl
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json(
      { ok: false, error: "No authorization code received" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    code,
    next: "Exchange this code for a refresh token using curl:",
    command: `curl -X POST "https://accounts.zoho.com/oauth/v2/token" -d "grant_type=authorization_code" -d "client_id=$ZOHO_CLIENT_ID" -d "client_secret=$ZOHO_CLIENT_SECRET" -d "redirect_uri=http://localhost:3000/api/zoho/callback" -d "code=${code}"`,
  });
}
