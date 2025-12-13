import { describe, it, expect, vi, beforeEach } from "vitest";
import { createWebhookRequest } from "@/test/helpers/request";

// Hoist mock functions
const { mockGenerateAdminEmail, mockGenerateApplicantEmail } = vi.hoisted(() => ({
  mockGenerateAdminEmail: vi.fn(),
  mockGenerateApplicantEmail: vi.fn(),
}));

// Mock email template generators
vi.mock("@/lib/email/franchise-application-templates", () => ({
  generateAdminNotificationEmail: mockGenerateAdminEmail,
  generateApplicantConfirmationEmail: mockGenerateApplicantEmail,
}));

import { POST, GET } from "./route";

describe("Franchise Application Webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock returns for email generators
    mockGenerateAdminEmail.mockReturnValue({
      subject: "New Franchise Application",
      html: "<p>Admin notification</p>",
      text: "Admin notification",
    });
    mockGenerateApplicantEmail.mockReturnValue({
      subject: "Thank You for Your Application",
      html: "<p>Applicant confirmation</p>",
      text: "Applicant confirmation",
    });
  });

  describe("Webhook Authentication", () => {
    it("rejects requests with invalid webhook secret", async () => {
      const req = createWebhookRequest(
        {
          form_id: "16",
          entry_id: "123",
          email: "test@example.com",
          first_name: "John",
          last_name: "Doe",
        },
        {
          webhookSecret: "wrong-secret",
          url: "http://localhost:3000/api/gravity-forms/webhook/franchise",
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("accepts requests with valid webhook secret", async () => {
      const req = createWebhookRequest(
        {
          form_id: "16",
          entry_id: "456",
          date_created: new Date().toISOString(),
          email: "valid@example.com",
          first_name: "Jane",
          last_name: "Smith",
        },
        {
          webhookSecret: "test-franchise-webhook-secret",
          url: "http://localhost:3000/api/gravity-forms/webhook/franchise",
        }
      );

      const response = await POST(req);
      expect(response.status).toBe(200);
    });

    it("accepts requests when no secret is configured", async () => {
      // When GRAVITY_FORMS_WEBHOOK_SECRET is not set, all requests are accepted
      const originalEnv = process.env.GRAVITY_FORMS_WEBHOOK_SECRET;
      delete process.env.GRAVITY_FORMS_WEBHOOK_SECRET;

      const req = createWebhookRequest(
        {
          form_id: "16",
          entry_id: "789",
          date_created: new Date().toISOString(),
          email: "test@example.com",
          first_name: "Test",
          last_name: "User",
        },
        {
          url: "http://localhost:3000/api/gravity-forms/webhook/franchise",
        }
      );

      const response = await POST(req);
      expect(response.status).toBe(200);

      process.env.GRAVITY_FORMS_WEBHOOK_SECRET = originalEnv;
    });
  });

  describe("Request Validation", () => {
    it("returns 400 when email is missing", async () => {
      const req = createWebhookRequest(
        {
          form_id: "16",
          entry_id: "100",
          first_name: "John",
          last_name: "Doe",
          // email missing
        },
        {
          webhookSecret: "test-franchise-webhook-secret",
          url: "http://localhost:3000/api/gravity-forms/webhook/franchise",
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing required fields");
    });

    it("returns 400 when first_name is missing", async () => {
      const req = createWebhookRequest(
        {
          form_id: "16",
          entry_id: "101",
          email: "test@example.com",
          last_name: "Doe",
          // first_name missing
        },
        {
          webhookSecret: "test-franchise-webhook-secret",
          url: "http://localhost:3000/api/gravity-forms/webhook/franchise",
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing required fields");
    });

    it("returns 400 when last_name is missing", async () => {
      const req = createWebhookRequest(
        {
          form_id: "16",
          entry_id: "102",
          email: "test@example.com",
          first_name: "John",
          // last_name missing
        },
        {
          webhookSecret: "test-franchise-webhook-secret",
          url: "http://localhost:3000/api/gravity-forms/webhook/franchise",
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing required fields");
    });
  });

  describe("Success Path", () => {
    it("returns 200 with success message and entry_id", async () => {
      const req = createWebhookRequest(
        {
          form_id: "16",
          entry_id: "200",
          date_created: "2025-01-15T10:30:00",
          email: "applicant@example.com",
          first_name: "Sarah",
          last_name: "Johnson",
        },
        {
          webhookSecret: "test-franchise-webhook-secret",
          url: "http://localhost:3000/api/gravity-forms/webhook/franchise",
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Franchise application received successfully");
      expect(data.entry_id).toBe("200");
    });

    it("calls email template generators with submission data", async () => {
      const submission = {
        form_id: "16",
        entry_id: "300",
        date_created: "2025-01-15T10:30:00",
        email: "franchise@example.com",
        first_name: "Michael",
        last_name: "Brown",
        phone: "555-1234",
        city: "Austin",
        state: "TX",
        liquid_capital: "$150,000 - $250,000",
      };

      const req = createWebhookRequest(submission, {
        webhookSecret: "test-franchise-webhook-secret",
        url: "http://localhost:3000/api/gravity-forms/webhook/franchise",
      });

      await POST(req);

      expect(mockGenerateAdminEmail).toHaveBeenCalledTimes(1);
      expect(mockGenerateAdminEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "franchise@example.com",
          first_name: "Michael",
          last_name: "Brown",
          entry_id: "300",
        })
      );

      expect(mockGenerateApplicantEmail).toHaveBeenCalledTimes(1);
      expect(mockGenerateApplicantEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "franchise@example.com",
          first_name: "Michael",
          last_name: "Brown",
        })
      );
    });
  });

  describe("Complete Application Handling", () => {
    it("processes full franchise application with all fields", async () => {
      const fullApplication = {
        form_id: "16",
        entry_id: "400",
        date_created: "2025-01-15T14:00:00",
        first_name: "Dr. Robert",
        last_name: "Williams",
        email: "dr.williams@clinic.com",
        phone: "555-987-6543",
        contact_method: "Phone",
        country: "United States",
        state: "California",
        city: "San Diego",
        lead_source: "Google Search",
        licensed_chiro: "Yes",
        license_number: "DC12345",
        license_state: "CA",
        license_years: "10+ years",
        occupation: "Practicing Chiropractor",
        business_experience: "Yes",
        business_experience_desc: "Owned a wellness center for 5 years",
        industry_experience: "Yes",
        liquid_capital: "$250,000 - $500,000",
        net_worth: "$1,000,000+",
        invest_timeline: "3-6 months",
        seeking_financing: "No",
        desired_market: "San Diego metro area",
        alt_locations: "Orange County, LA",
        clinic_units: "2-3 units",
        ownership_style: "Owner-Operator",
        motivation: "Looking to expand my practice with a proven franchise model",
        strengths: "Patient care, business management, community engagement",
        other_franchises: "None",
        additional_info: "Excited about the ChiroStretch model",
        utm_source: "google",
        utm_campaign: "franchise-2025",
        utm_medium: "cpc",
        referrer: "https://google.com",
      };

      const req = createWebhookRequest(fullApplication, {
        webhookSecret: "test-franchise-webhook-secret",
        url: "http://localhost:3000/api/gravity-forms/webhook/franchise",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.entry_id).toBe("400");

      // Verify all data was passed to email generators
      expect(mockGenerateAdminEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          licensed_chiro: "Yes",
          license_number: "DC12345",
          liquid_capital: "$250,000 - $500,000",
          desired_market: "San Diego metro area",
          utm_source: "google",
        })
      );
    });

    it("handles minimal required fields gracefully", async () => {
      const minimalApplication = {
        form_id: "16",
        entry_id: "500",
        date_created: "2025-01-15T15:00:00",
        first_name: "Test",
        last_name: "User",
        email: "minimal@test.com",
        // All other fields are undefined
      };

      const req = createWebhookRequest(minimalApplication, {
        webhookSecret: "test-franchise-webhook-secret",
        url: "http://localhost:3000/api/gravity-forms/webhook/franchise",
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("handles individual processing errors gracefully via Promise.allSettled", async () => {
      // Since the route uses Promise.allSettled, individual errors don't fail the request
      mockGenerateAdminEmail.mockImplementation(() => {
        throw new Error("Email template error");
      });

      const req = createWebhookRequest(
        {
          form_id: "16",
          entry_id: "600",
          date_created: "2025-01-15T16:00:00",
          email: "error@test.com",
          first_name: "Error",
          last_name: "Test",
        },
        {
          webhookSecret: "test-franchise-webhook-secret",
          url: "http://localhost:3000/api/gravity-forms/webhook/franchise",
        }
      );

      const response = await POST(req);
      const data = await response.json();

      // Request still succeeds - Promise.allSettled catches individual errors
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("returns 500 when request body parsing fails", async () => {
      // Create a request with invalid JSON
      const headers = new Headers({
        "content-type": "application/json",
        "x-webhook-secret": "test-franchise-webhook-secret",
      });

      const { NextRequest } = await import("next/server");
      const req = new NextRequest(
        "http://localhost:3000/api/gravity-forms/webhook/franchise",
        {
          method: "POST",
          headers,
          body: "invalid json {{{",
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to process webhook");
    });
  });

  describe("GET Endpoint", () => {
    it("returns status information", async () => {
      const response = await GET();
      const data = await response.json();

      expect(data.message).toBe("Franchise Application Webhook Endpoint");
      expect(data.status).toBe("active");
      expect(data.instructions).toContain("Gravity Forms webhook settings");
    });
  });
});
