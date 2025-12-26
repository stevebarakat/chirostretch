import { NextRequest, NextResponse } from "next/server";
import {
  generateAdminNotificationEmail,
  generateApplicantConfirmationEmail,
} from "@/lib/email/franchise-application-templates";

/**
 * Webhook endpoint for Gravity Forms Franchise Application submissions
 *
 * This endpoint receives form submissions from Gravity Forms via webhook
 * Configure in WordPress: Forms > Settings > Webhooks
 *
 * Webhook URL: https://yoursite.com/api/gravity-forms/webhook/franchise
 * Request Format: JSON
 */

type FranchiseSubmission = {
  form_id: string;
  entry_id: string;
  date_created: string;
  // Contact Information
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  contact_method?: string;
  country?: string;
  state?: string;
  city?: string;
  lead_source?: string;
  // Professional Background
  licensed_chiro?: string;
  license_number?: string;
  license_state?: string;
  license_years?: string;
  occupation?: string;
  business_experience?: string;
  business_experience_desc?: string;
  industry_experience?: string;
  // Financial Readiness
  liquid_capital?: string;
  net_worth?: string;
  invest_timeline?: string;
  seeking_financing?: string;
  // Market & Opportunity
  desired_market?: string;
  alt_locations?: string;
  clinic_units?: string;
  ownership_style?: string;
  // Motivation & Fit
  motivation?: string;
  strengths?: string;
  other_franchises?: string;
  additional_info?: string;
  // Tracking
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  referrer?: string;
  [key: string]: unknown; // Allow additional fields
};

/**
 * Send admin notification email about new franchise application
 */
async function sendAdminNotification(submission: FranchiseSubmission) {
  const { subject, html, text } = generateAdminNotificationEmail(submission);

  console.log("📧 Admin notification generated:", {
    subject,
    to: process.env.ADMIN_EMAIL || "admin@chirostretch.com",
    applicant: `${submission.first_name} ${submission.last_name}`,
    entry_id: submission.entry_id,
  });

  // TODO: Uncomment to enable email sending via Resend
  // const { Resend } = await import('resend');
  // const resend = new Resend(process.env.RESEND_API_KEY);
  //
  // await resend.emails.send({
  //   from: 'ChiroStretch <notifications@chirostretch.com>',
  //   to: process.env.ADMIN_EMAIL || 'admin@chirostretch.com',
  //   subject,
  //   html,
  //   text,
  // });
}

/**
 * Send confirmation email to the applicant
 */
async function sendApplicantConfirmation(submission: FranchiseSubmission) {
  if (!submission.email) {
    console.warn("⚠️ No email address provided, skipping applicant confirmation");
    return;
  }

  const { subject, html, text } =
    generateApplicantConfirmationEmail(submission);

  console.log("📧 Applicant confirmation generated:", {
    subject,
    to: submission.email,
    applicant: `${submission.first_name} ${submission.last_name}`,
    entry_id: submission.entry_id,
  });

  // TODO: Uncomment to enable email sending via Resend
  // const { Resend } = await import('resend');
  // const resend = new Resend(process.env.RESEND_API_KEY);
  //
  // await resend.emails.send({
  //   from: 'ChiroStretch Franchise <franchise@chirostretch.com>',
  //   to: submission.email,
  //   subject,
  //   html,
  //   text,
  // });
}

/**
 * Send data to CRM (e.g., HubSpot, Salesforce, etc.)
 */
async function sendToCRM(submission: FranchiseSubmission) {
  // TODO: Integrate with your CRM
  console.log("📊 Sending to CRM:", submission.email);

  // Example: HubSpot contact creation
  // const hubspotResponse = await fetch('https://api.hubapi.com/contacts/v1/contact', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     properties: [
  //       { property: 'email', value: submission.email },
  //       { property: 'firstname', value: submission.first_name },
  //       { property: 'lastname', value: submission.last_name },
  //       // ... map other fields
  //     ]
  //   })
  // });
}

/**
 * Note: Gravity Forms already stores submissions in WordPress database
 * This function is here in case you need additional storage (analytics DB, data warehouse, etc.)
 */
async function logSubmissionMetrics(submission: FranchiseSubmission) {
  // Gravity Forms stores all form data in wp_gf_entries and wp_gf_entry_meta tables
  // You can access entries via WordPress admin or GraphQL

  console.log("📊 Submission stored in WordPress:", {
    entry_id: submission.entry_id,
    form_id: submission.form_id,
    view_url: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-admin/admin.php?page=gf_entries&view=entry&id=16&lid=${submission.entry_id}`,
  });

  // Optional: Log to external analytics/data warehouse
  // await analytics.track('franchise_application_submitted', {
  //   entry_id: submission.entry_id,
  //   location: `${submission.city}, ${submission.state}`,
  //   liquid_capital: submission.liquid_capital,
  // });
}

/**
 * Verify webhook authenticity using custom X-Webhook-Secret header
 */
function verifyWebhookSignature(request: NextRequest): boolean {
  const webhookSecret = request.headers.get("x-webhook-secret");
  const expectedSecret = process.env.GRAVITY_FORMS_WEBHOOK_SECRET;

  if (expectedSecret && webhookSecret !== expectedSecret) {
    console.warn("⚠️ Invalid webhook secret received");
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook authenticity
    if (!verifyWebhookSignature(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const submission: FranchiseSubmission = await request.json();

    // Validate required fields
    if (!submission.email || !submission.first_name || !submission.last_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Log submission for debugging
    console.log("📝 Franchise Application Submission:", {
      entry_id: submission.entry_id,
      applicant: `${submission.first_name} ${submission.last_name}`,
      email: submission.email,
      location: `${submission.city}, ${submission.state}`,
      timestamp: submission.date_created,
    });

    // Process submission in parallel
    await Promise.allSettled([
      sendAdminNotification(submission),
      sendApplicantConfirmation(submission),
      sendToCRM(submission),
      logSubmissionMetrics(submission),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Franchise application received successfully",
        entry_id: submission.entry_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Webhook processing error:", error);

    return NextResponse.json(
      {
        error: "Failed to process webhook",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: "Franchise Application Webhook Endpoint",
    status: "active",
    instructions: "Configure this URL in Gravity Forms webhook settings",
  });
}
