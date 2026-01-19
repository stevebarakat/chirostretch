/**
 * Zoho CRM Client
 *
 * Handles OAuth token management and API calls to Zoho CRM.
 * Uses refresh token flow to obtain access tokens.
 */

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_API_DOMAIN = process.env.ZOHO_API_DOMAIN || "https://www.zohoapis.com";
const ZOHO_ACCOUNTS_DOMAIN = process.env.ZOHO_ACCOUNTS_DOMAIN || "https://accounts.zoho.com";

type ZohoTokenResponse = {
  access_token: string;
  expires_in: number;
  api_domain: string;
  token_type: string;
  error?: string;
};

type ZohoLead = {
  id: string;
  Email: string;
  Lead_Status?: string;
  First_Name?: string;
  Last_Name?: string;
};

type ZohoSearchResponse = {
  data: ZohoLead[];
  info?: {
    count: number;
    more_records: boolean;
  };
};

type ZohoUpdateResponse = {
  data: Array<{
    code: string;
    details: {
      id: string;
    };
    message: string;
    status: string;
  }>;
};

// In-memory token cache
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Get a valid access token, refreshing if necessary
 */
export async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.token;
  }

  if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
    throw new Error("Zoho CRM credentials not configured");
  }

  const params = new URLSearchParams({
    refresh_token: ZOHO_REFRESH_TOKEN,
    client_id: ZOHO_CLIENT_ID,
    client_secret: ZOHO_CLIENT_SECRET,
    grant_type: "refresh_token",
  });

  const response = await fetch(`${ZOHO_ACCOUNTS_DOMAIN}/oauth/v2/token?${params}`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[Zoho] Failed to refresh token:", error);
    throw new Error("Failed to refresh Zoho access token");
  }

  const data: ZohoTokenResponse = await response.json();

  if (data.error) {
    console.error("[Zoho] Token refresh error:", data.error);
    throw new Error(`Zoho token error: ${data.error}`);
  }

  // Cache the token with expiry (expires_in is in seconds)
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

/**
 * Search for a lead by email
 */
async function searchLeadByEmail(email: string): Promise<ZohoLead | null> {
  const accessToken = await getAccessToken();

  const criteria = `(Email:equals:${email})`;
  const url = `${ZOHO_API_DOMAIN}/crm/v2/Leads/search?criteria=${encodeURIComponent(criteria)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
    },
  });

  if (response.status === 204) {
    // No records found
    return null;
  }

  if (!response.ok) {
    const error = await response.text();
    console.error("[Zoho] Search failed:", error);
    throw new Error("Failed to search for lead in Zoho CRM");
  }

  const data: ZohoSearchResponse = await response.json();

  if (!data.data || data.data.length === 0) {
    return null;
  }

  return data.data[0];
}

/**
 * Update a lead's status by ID
 */
async function updateLead(leadId: string, updates: Partial<ZohoLead>): Promise<boolean> {
  const accessToken = await getAccessToken();

  const url = `${ZOHO_API_DOMAIN}/crm/v2/Leads`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: [
        {
          id: leadId,
          ...updates,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[Zoho] Update failed:", error);
    throw new Error("Failed to update lead in Zoho CRM");
  }

  const data: ZohoUpdateResponse = await response.json();

  if (!data.data || data.data.length === 0) {
    return false;
  }

  return data.data[0].status === "success";
}

/**
 * Update lead status by email
 *
 * Searches for a lead by email and updates their Lead_Status field.
 * Returns true if successful, false if lead not found.
 */
export async function updateLeadStatus(email: string, status: string): Promise<boolean> {
  console.log(`[Zoho] Updating lead status for ${email} to "${status}"`);

  const lead = await searchLeadByEmail(email);

  if (!lead) {
    console.log(`[Zoho] No lead found for email: ${email}`);
    return false;
  }

  console.log(`[Zoho] Found lead ${lead.id}, updating status`);

  const success = await updateLead(lead.id, { Lead_Status: status });

  if (success) {
    console.log(`[Zoho] Successfully updated lead ${lead.id} status to "${status}"`);
  }

  return success;
}

/**
 * Check if Zoho integration is configured
 */
export function isZohoConfigured(): boolean {
  return Boolean(ZOHO_CLIENT_ID && ZOHO_CLIENT_SECRET && ZOHO_REFRESH_TOKEN);
}
