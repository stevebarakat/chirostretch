import { NextRequest, NextResponse } from "next/server";

/**
 * Webhook endpoint for Gravity Forms New Patient Offer submissions
 *
 * This endpoint receives form submissions from Gravity Forms via webhook
 * Configure in WordPress: Forms > Settings > Webhooks
 *
 * Webhook URL: https://yoursite.com/api/gravity-forms/webhook/lead
 * Request Format: JSON
 */

type LeadSubmission = {
  form_id: string;
  entry_id: string;
  date_created: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  preferred_location?: string;
  lead_source?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  [key: string]: string | undefined;
};

type CouponResponse = {
  success: boolean;
  coupon_code: string;
  discount_amount: number;
  final_price: number;
  expires?: string;
  existing?: boolean;
};

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://chirostretch-copy.local";
const INTERNAL_SECRET = process.env.CHIROSTRETCH_INTERNAL_SECRET || "";

/**
 * Generate a unique coupon code for the lead
 */
async function generateCoupon(submission: LeadSubmission): Promise<CouponResponse | null> {
  if (!submission.email) {
    console.warn("⚠️ No email address provided, skipping coupon generation");
    return null;
  }

  try {
    const response = await fetch(`${WP_URL}/wp-json/chirostretch/v1/coupons/new-patient`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({
        email: submission.email,
        first_name: submission.first_name,
      }),
    });

    if (!response.ok) {
      console.error("❌ Failed to generate coupon:", await response.text());
      return null;
    }

    const data = await response.json();
    console.log("🎟️ Coupon generated:", {
      code: data.coupon_code,
      existing: data.existing,
    });

    return data as CouponResponse;
  } catch (error) {
    console.error("❌ Error generating coupon:", error);
    return null;
  }
}

/**
 * Send confirmation email to the lead with coupon code
 */
async function sendLeadConfirmation(submission: LeadSubmission, coupon: CouponResponse | null) {
  if (!submission.email) {
    console.warn("⚠️ No email address provided, skipping lead confirmation");
    return;
  }

  const firstName = submission.first_name || "there";
  const couponCode = coupon?.coupon_code || "NEWPATIENT29";
  const expiryText = coupon?.expires ? `Valid until ${coupon.expires}` : "Limited time offer";

  console.log("📧 Lead confirmation generated:", {
    to: submission.email,
    lead: `${submission.first_name} ${submission.last_name}`,
    entry_id: submission.entry_id,
    coupon_code: couponCode,
  });

  // TODO: Uncomment to enable email sending via Resend
  // const { Resend } = await import('resend');
  // const resend = new Resend(process.env.RESEND_API_KEY);
  //
  // await resend.emails.send({
  //   from: 'ChiroStretch <hello@chirostretch.com>',
  //   to: submission.email,
  //   subject: 'Your $29 New Patient Offer is Ready!',
  //   html: `
  //     <h1>Welcome to ChiroStretch, ${firstName}!</h1>
  //     <p>Thank you for claiming your New Patient Offer.</p>
  //
  //     <div style="background: #f0f9ff; border: 2px dashed #0ea5e9; padding: 24px; margin: 24px 0; text-align: center; border-radius: 8px;">
  //       <p style="margin: 0 0 8px; font-size: 14px; color: #666;">Your exclusive coupon code:</p>
  //       <p style="margin: 0; font-size: 32px; font-weight: bold; color: #0369a1; letter-spacing: 2px;">${couponCode}</p>
  //       <p style="margin: 8px 0 0; font-size: 14px; color: #666;">${expiryText}</p>
  //     </div>
  //
  //     <h2>Your $29 New Patient Special Includes:</h2>
  //     <ul>
  //       <li>✓ Comprehensive Consultation</li>
  //       <li>✓ Thorough Examination</li>
  //       <li>✓ Your First Adjustment</li>
  //     </ul>
  //     <p><em>Regular value: $99 — You save $70!</em></p>
  //
  //     <h2>Next Steps:</h2>
  //     <ol>
  //       <li>Check your email for a link to set up your password</li>
  //       <li><a href="https://chirostretch.com/book">Book your appointment online</a></li>
  //       <li>Enter coupon code <strong>${couponCode}</strong> at checkout</li>
  //     </ol>
  //
  //     <p>Questions? Reply to this email or call us at (XXX) XXX-XXXX</p>
  //   `,
  // });
}

/**
 * Send data to CRM (HubSpot, Salesforce, etc.)
 */
async function sendToCRM(submission: LeadSubmission) {
  console.log("📊 Sending lead to CRM:", submission.email);

  // Example: HubSpot contact creation
  if (process.env.HUBSPOT_API_KEY) {
    try {
      const hubspotResponse = await fetch(
        "https://api.hubapi.com/crm/v3/objects/contacts",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            properties: {
              email: submission.email,
              firstname: submission.first_name,
              lastname: submission.last_name,
              phone: submission.phone,
              city: submission.preferred_location,
              hs_lead_status: "NEW",
              lifecyclestage: "lead",
              leadsource: submission.lead_source || "New Patient Offer",
              // UTM tracking
              hs_analytics_source: submission.utm_source,
              hs_analytics_source_data_1: submission.utm_campaign,
              hs_analytics_source_data_2: submission.utm_medium,
            },
          }),
        }
      );

      if (!hubspotResponse.ok) {
        const errorData = await hubspotResponse.json();
        // Check if it's a duplicate - if so, update instead
        if (errorData.message?.includes("already exists")) {
          console.log("📊 Contact exists in HubSpot, updating...");
          // Could implement update logic here
        } else {
          console.error("❌ HubSpot API error:", errorData);
        }
      } else {
        console.log("✅ Lead synced to HubSpot");
      }
    } catch (error) {
      console.error("❌ HubSpot sync failed:", error);
    }
  } else {
    console.log("ℹ️ HubSpot API key not configured, skipping CRM sync");
  }
}

/**
 * Send admin notification about new lead
 */
async function sendAdminNotification(submission: LeadSubmission) {
  console.log("📧 Admin notification - New lead:", {
    name: `${submission.first_name} ${submission.last_name}`,
    email: submission.email,
    phone: submission.phone,
    location: submission.preferred_location,
    source: submission.lead_source,
    entry_id: submission.entry_id,
  });

  // TODO: Uncomment to enable email sending via Resend
  // const { Resend } = await import('resend');
  // const resend = new Resend(process.env.RESEND_API_KEY);
  //
  // await resend.emails.send({
  //   from: 'ChiroStretch <notifications@chirostretch.com>',
  //   to: process.env.ADMIN_EMAIL || 'leads@chirostretch.com',
  //   subject: `New Patient Lead: ${submission.first_name} ${submission.last_name}`,
  //   html: `
  //     <h2>New Patient Offer Claimed</h2>
  //     <ul>
  //       <li><strong>Name:</strong> ${submission.first_name} ${submission.last_name}</li>
  //       <li><strong>Email:</strong> ${submission.email}</li>
  //       <li><strong>Phone:</strong> ${submission.phone}</li>
  //       <li><strong>Preferred Location:</strong> ${submission.preferred_location}</li>
  //       <li><strong>Lead Source:</strong> ${submission.lead_source}</li>
  //     </ul>
  //     <p><a href="${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-admin/admin.php?page=gf_entries&view=entry&id=XX&lid=${submission.entry_id}">View Entry in WordPress</a></p>
  //   `,
  // });
}

/**
 * Log submission for metrics
 */
async function logSubmissionMetrics(submission: LeadSubmission) {
  console.log("📊 Lead submission logged:", {
    entry_id: submission.entry_id,
    form_id: submission.form_id,
    location: submission.preferred_location,
    source: submission.lead_source,
    utm: {
      source: submission.utm_source,
      campaign: submission.utm_campaign,
      medium: submission.utm_medium,
    },
  });
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submission: LeadSubmission = await request.json();

    // Validate required fields
    if (!submission.email || !submission.first_name) {
      return NextResponse.json(
        { error: "Missing required fields: email and first_name are required" },
        { status: 400 }
      );
    }

    // Log submission for debugging
    console.log("📝 New Patient Offer Submission:", {
      entry_id: submission.entry_id,
      lead: `${submission.first_name} ${submission.last_name}`,
      email: submission.email,
      location: submission.preferred_location,
      timestamp: submission.date_created,
    });

    // Generate unique coupon first
    const coupon = await generateCoupon(submission);

    // Process submission in parallel
    await Promise.allSettled([
      sendLeadConfirmation(submission, coupon),
      sendAdminNotification(submission),
      sendToCRM(submission),
      logSubmissionMetrics(submission),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "New patient offer submission received successfully",
        entry_id: submission.entry_id,
        coupon_code: coupon?.coupon_code,
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

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: "New Patient Offer Webhook Endpoint",
    status: "active",
    instructions: "Configure this URL in Gravity Forms webhook settings",
  });
}
