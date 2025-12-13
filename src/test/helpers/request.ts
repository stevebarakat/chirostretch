import { NextRequest } from "next/server";

type WebhookPayload = {
  post_id: number;
  action?: "update" | "delete" | "create";
  post_type?: string;
  new_status?: string;
  old_status?: string;
};

/**
 * Create a mock NextRequest for webhook testing
 */
export function createWebhookRequest(
  payload: WebhookPayload,
  options: {
    webhookSecret?: string;
    url?: string;
  } = {}
): NextRequest {
  const { webhookSecret, url = "http://localhost:3000/api/algolia/index-locations" } = options;

  const headers = new Headers({
    "content-type": "application/json",
  });

  if (webhookSecret) {
    headers.set("x-webhook-secret", webhookSecret);
  }

  return new NextRequest(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}

/**
 * Create a mock NextRequest for bulk reindex (no webhook secret)
 */
export function createBulkReindexRequest(
  url: string = "http://localhost:3000/api/algolia/index-locations"
): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });
}
