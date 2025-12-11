/**
 * Email templates for Franchise Application notifications
 *
 * These templates are used by the webhook handler to send notifications
 * when a new franchise application is submitted.
 */

type FranchiseSubmission = {
  form_id: string;
  entry_id: string;
  date_created: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  contact_method?: string;
  country?: string;
  state?: string;
  city?: string;
  lead_source?: string;
  licensed_chiro?: string;
  license_number?: string;
  license_state?: string;
  license_years?: string;
  occupation?: string;
  business_experience?: string;
  business_experience_desc?: string;
  industry_experience?: string;
  liquid_capital?: string;
  net_worth?: string;
  invest_timeline?: string;
  seeking_financing?: string;
  desired_market?: string;
  alt_locations?: string;
  clinic_units?: string;
  ownership_style?: string;
  motivation?: string;
  strengths?: string;
  other_franchises?: string;
  additional_info?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  referrer?: string;
};

/**
 * Base email styles for consistent branding
 */
const emailStyles = {
  body: `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  `,
  header: `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    text-align: center;
    border-radius: 8px 8px 0 0;
  `,
  content: `
    background: white;
    padding: 30px;
    border: 1px solid #e0e0e0;
    border-top: none;
  `,
  section: `
    margin-bottom: 25px;
  `,
  sectionTitle: `
    font-size: 18px;
    font-weight: 600;
    color: #667eea;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 2px solid #f0f0f0;
  `,
  field: `
    margin-bottom: 10px;
  `,
  label: `
    font-weight: 600;
    color: #555;
    display: inline-block;
    min-width: 180px;
  `,
  value: `
    color: #333;
  `,
  footer: `
    background: #f8f9fa;
    padding: 20px;
    text-align: center;
    font-size: 12px;
    color: #666;
    border-radius: 0 0 8px 8px;
  `,
  button: `
    display: inline-block;
    padding: 12px 24px;
    background: #667eea;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    margin: 10px 0;
  `,
};

/**
 * Format a field value for display (handles empty values)
 */
function formatValue(value: string | undefined): string {
  return value && value.trim() ? value : "Not provided";
}

/**
 * Admin notification email - Comprehensive details about the application
 */
export function generateAdminNotificationEmail(
  submission: FranchiseSubmission
): {
  subject: string;
  html: string;
  text: string;
} {
  const applicantName = `${submission.first_name} ${submission.last_name}`;
  const subject = `🚀 New Franchise Application: ${applicantName}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="${emailStyles.body}">
        <div style="${emailStyles.header}">
          <h1 style="margin: 0; font-size: 28px;">New Franchise Application</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">
            Submitted on ${new Date(submission.date_created).toLocaleString()}
          </p>
        </div>

        <div style="${emailStyles.content}">
          <!-- Quick Summary -->
          <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
            <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #333;">Quick Summary</h2>
            <p style="margin: 5px 0;"><strong>Applicant:</strong> ${applicantName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${submission.email}">${submission.email}</a></p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${formatValue(submission.phone)}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> ${formatValue(submission.city)}, ${formatValue(submission.state)}</p>
            <p style="margin: 5px 0;"><strong>Entry ID:</strong> ${submission.entry_id}</p>
          </div>

          <!-- Contact Information -->
          <div style="${emailStyles.section}">
            <h3 style="${emailStyles.sectionTitle}">📋 Contact Information</h3>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Name:</span>
              <span style="${emailStyles.value}">${applicantName}</span>
            </div>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Email:</span>
              <span style="${emailStyles.value}">${formatValue(submission.email)}</span>
            </div>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Phone:</span>
              <span style="${emailStyles.value}">${formatValue(submission.phone)}</span>
            </div>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Preferred Contact:</span>
              <span style="${emailStyles.value}">${formatValue(submission.contact_method)}</span>
            </div>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Location:</span>
              <span style="${emailStyles.value}">${formatValue(submission.city)}, ${formatValue(submission.state)}, ${formatValue(submission.country)}</span>
            </div>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Lead Source:</span>
              <span style="${emailStyles.value}">${formatValue(submission.lead_source)}</span>
            </div>
          </div>

          <!-- Professional Background -->
          <div style="${emailStyles.section}">
            <h3 style="${emailStyles.sectionTitle}">👨‍⚕️ Professional Background</h3>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Licensed Chiropractor:</span>
              <span style="${emailStyles.value}">${formatValue(submission.licensed_chiro)}</span>
            </div>
            ${
              submission.licensed_chiro === "Yes"
                ? `
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">License Number:</span>
              <span style="${emailStyles.value}">${formatValue(submission.license_number)}</span>
            </div>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">License State:</span>
              <span style="${emailStyles.value}">${formatValue(submission.license_state)}</span>
            </div>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Years Licensed:</span>
              <span style="${emailStyles.value}">${formatValue(submission.license_years)}</span>
            </div>
            `
                : ""
            }
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Current Occupation:</span>
              <span style="${emailStyles.value}">${formatValue(submission.occupation)}</span>
            </div>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Business Experience:</span>
              <span style="${emailStyles.value}">${formatValue(submission.business_experience)}</span>
            </div>
            ${
              submission.business_experience_desc
                ? `
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Business Details:</span>
              <div style="margin-top: 8px; padding: 12px; background: #f8f9fa; border-radius: 4px;">
                ${submission.business_experience_desc}
              </div>
            </div>
            `
                : ""
            }
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Industry Experience:</span>
              <span style="${emailStyles.value}">${formatValue(submission.industry_experience)}</span>
            </div>
          </div>

          <!-- Financial Readiness -->
          <div style="${emailStyles.section}">
            <h3 style="${emailStyles.sectionTitle}">💰 Financial Readiness</h3>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Liquid Capital:</span>
              <span style="${emailStyles.value}">${formatValue(submission.liquid_capital)}</span>
            </div>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Net Worth:</span>
              <span style="${emailStyles.value}">${formatValue(submission.net_worth)}</span>
            </div>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Investment Timeline:</span>
              <span style="${emailStyles.value}">${formatValue(submission.invest_timeline)}</span>
            </div>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Seeking Financing:</span>
              <span style="${emailStyles.value}">${formatValue(submission.seeking_financing)}</span>
            </div>
          </div>

          <!-- Market & Opportunity -->
          <div style="${emailStyles.section}">
            <h3 style="${emailStyles.sectionTitle}">📍 Market & Opportunity</h3>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Desired Market:</span>
              <span style="${emailStyles.value}">${formatValue(submission.desired_market)}</span>
            </div>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Alternative Locations:</span>
              <span style="${emailStyles.value}">${formatValue(submission.alt_locations)}</span>
            </div>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Number of Clinics:</span>
              <span style="${emailStyles.value}">${formatValue(submission.clinic_units)}</span>
            </div>
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Ownership Style:</span>
              <span style="${emailStyles.value}">${formatValue(submission.ownership_style)}</span>
            </div>
          </div>

          <!-- Motivation & Fit -->
          <div style="${emailStyles.section}">
            <h3 style="${emailStyles.sectionTitle}">💭 Motivation & Fit</h3>
            ${
              submission.motivation
                ? `
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Motivation:</span>
              <div style="margin-top: 8px; padding: 12px; background: #f8f9fa; border-radius: 4px;">
                ${submission.motivation}
              </div>
            </div>
            `
                : ""
            }
            ${
              submission.strengths
                ? `
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Strengths:</span>
              <div style="margin-top: 8px; padding: 12px; background: #f8f9fa; border-radius: 4px;">
                ${submission.strengths}
              </div>
            </div>
            `
                : ""
            }
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Other Franchises:</span>
              <span style="${emailStyles.value}">${formatValue(submission.other_franchises)}</span>
            </div>
            ${
              submission.additional_info
                ? `
            <div style="${emailStyles.field}">
              <span style="${emailStyles.label}">Additional Info:</span>
              <div style="margin-top: 8px; padding: 12px; background: #f8f9fa; border-radius: 4px;">
                ${submission.additional_info}
              </div>
            </div>
            `
                : ""
            }
          </div>

          <!-- Tracking Information -->
          ${
            submission.utm_source ||
            submission.utm_campaign ||
            submission.utm_medium ||
            submission.referrer
              ? `
          <div style="${emailStyles.section}">
            <h3 style="${emailStyles.sectionTitle}">📊 Tracking Information</h3>
            ${submission.utm_source ? `<div style="${emailStyles.field}"><span style="${emailStyles.label}">UTM Source:</span><span style="${emailStyles.value}">${submission.utm_source}</span></div>` : ""}
            ${submission.utm_campaign ? `<div style="${emailStyles.field}"><span style="${emailStyles.label}">UTM Campaign:</span><span style="${emailStyles.value}">${submission.utm_campaign}</span></div>` : ""}
            ${submission.utm_medium ? `<div style="${emailStyles.field}"><span style="${emailStyles.label}">UTM Medium:</span><span style="${emailStyles.value}">${submission.utm_medium}</span></div>` : ""}
            ${submission.referrer ? `<div style="${emailStyles.field}"><span style="${emailStyles.label}">Referrer:</span><span style="${emailStyles.value}">${submission.referrer}</span></div>` : ""}
          </div>
          `
              : ""
          }

          <!-- Action Buttons -->
          <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 2px solid #f0f0f0;">
            <a href="${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-admin/admin.php?page=gf_entries&view=entry&id=16&lid=${submission.entry_id}"
               style="${emailStyles.button}">
              View Full Entry in WordPress
            </a>
          </div>
        </div>

        <div style="${emailStyles.footer}">
          <p style="margin: 0;">
            This notification was sent automatically by the Franchise Application system.
          </p>
          <p style="margin: 10px 0 0 0;">
            <strong>ChiroStretch Franchise</strong> | Entry ID: ${submission.entry_id}
          </p>
        </div>
      </body>
    </html>
  `;

  // Plain text version for email clients that don't support HTML
  const text = `
NEW FRANCHISE APPLICATION
=========================

Submitted: ${new Date(submission.date_created).toLocaleString()}
Entry ID: ${submission.entry_id}

CONTACT INFORMATION
-------------------
Name: ${applicantName}
Email: ${formatValue(submission.email)}
Phone: ${formatValue(submission.phone)}
Preferred Contact: ${formatValue(submission.contact_method)}
Location: ${formatValue(submission.city)}, ${formatValue(submission.state)}, ${formatValue(submission.country)}
Lead Source: ${formatValue(submission.lead_source)}

PROFESSIONAL BACKGROUND
-----------------------
Licensed Chiropractor: ${formatValue(submission.licensed_chiro)}
${submission.licensed_chiro === "Yes" ? `License Number: ${formatValue(submission.license_number)}\nLicense State: ${formatValue(submission.license_state)}\nYears Licensed: ${formatValue(submission.license_years)}` : ""}
Current Occupation: ${formatValue(submission.occupation)}
Business Experience: ${formatValue(submission.business_experience)}
${submission.business_experience_desc ? `Business Details: ${submission.business_experience_desc}` : ""}
Industry Experience: ${formatValue(submission.industry_experience)}

FINANCIAL READINESS
-------------------
Liquid Capital: ${formatValue(submission.liquid_capital)}
Net Worth: ${formatValue(submission.net_worth)}
Investment Timeline: ${formatValue(submission.invest_timeline)}
Seeking Financing: ${formatValue(submission.seeking_financing)}

MARKET & OPPORTUNITY
--------------------
Desired Market: ${formatValue(submission.desired_market)}
Alternative Locations: ${formatValue(submission.alt_locations)}
Number of Clinics: ${formatValue(submission.clinic_units)}
Ownership Style: ${formatValue(submission.ownership_style)}

MOTIVATION & FIT
----------------
${submission.motivation ? `Motivation: ${submission.motivation}\n` : ""}
${submission.strengths ? `Strengths: ${submission.strengths}\n` : ""}
Other Franchises: ${formatValue(submission.other_franchises)}
${submission.additional_info ? `Additional Info: ${submission.additional_info}` : ""}

View full entry: ${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-admin/admin.php?page=gf_entries&view=entry&id=16&lid=${submission.entry_id}
  `.trim();

  return { subject, html, text };
}

/**
 * Applicant confirmation email - Thank you message with next steps
 */
export function generateApplicantConfirmationEmail(
  submission: FranchiseSubmission
): {
  subject: string;
  html: string;
  text: string;
} {
  const firstName = submission.first_name || "there";
  const subject = "Thank You for Your Franchise Application - ChiroStretch";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="${emailStyles.body}">
        <div style="${emailStyles.header}">
          <h1 style="margin: 0; font-size: 28px;">Thank You for Your Interest!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">
            ChiroStretch Franchise Opportunity
          </p>
        </div>

        <div style="${emailStyles.content}">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Dear ${firstName},
          </p>

          <p style="font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
            Thank you for submitting your franchise application! We're excited that you're interested in joining the ChiroStretch family.
          </p>

          <p style="font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
            We have received your application and our franchise development team will review it carefully. Here's what happens next:
          </p>

          <!-- Next Steps -->
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 30px 0;">
            <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #333;">📋 Next Steps</h2>

            <div style="margin-bottom: 15px;">
              <div style="font-weight: 600; color: #667eea; margin-bottom: 5px;">1. Application Review (1-2 business days)</div>
              <div style="color: #666; font-size: 14px;">Our team will review your application and qualifications.</div>
            </div>

            <div style="margin-bottom: 15px;">
              <div style="font-weight: 600; color: #667eea; margin-bottom: 5px;">2. Initial Contact</div>
              <div style="color: #666; font-size: 14px;">A franchise development representative will reach out to you via ${formatValue(submission.contact_method).toLowerCase()}.</div>
            </div>

            <div style="margin-bottom: 15px;">
              <div style="font-weight: 600; color: #667eea; margin-bottom: 5px;">3. Discovery Call</div>
              <div style="color: #666; font-size: 14px;">We'll schedule a call to discuss the opportunity in detail and answer your questions.</div>
            </div>

            <div>
              <div style="font-weight: 600; color: #667eea; margin-bottom: 5px;">4. Next Steps</div>
              <div style="color: #666; font-size: 14px;">If there's a good fit, we'll guide you through the franchise disclosure and evaluation process.</div>
            </div>
          </div>

          <!-- Your Application Reference -->
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Your Application Reference Number:</strong> ${submission.entry_id}
            </p>
          </div>

          <!-- Questions Section -->
          <div style="margin: 30px 0;">
            <h3 style="font-size: 18px; margin-bottom: 15px;">Have Questions?</h3>
            <p style="font-size: 14px; color: #666; line-height: 1.8;">
              If you have any immediate questions or need to update your application, please don't hesitate to reach out to our franchise development team.
            </p>
          </div>

          <!-- Resources -->
          <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 2px solid #f0f0f0;">
            <h3 style="font-size: 18px; margin-bottom: 15px;">Learn More About ChiroStretch</h3>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
              While you wait, explore more about our franchise opportunity:
            </p>
            <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL}/franchise"
               style="${emailStyles.button}">
              View Franchise Information
            </a>
          </div>
        </div>

        <div style="${emailStyles.footer}">
          <p style="margin: 0 0 10px 0; font-weight: 600;">
            ChiroStretch Franchise Development
          </p>
          <p style="margin: 0 0 5px 0;">
            Email: franchise@chirostretch.com | Phone: (555) 123-4567
          </p>
          <p style="margin: 0;">
            Reference Number: ${submission.entry_id}
          </p>
        </div>
      </body>
    </html>
  `;

  // Plain text version
  const text = `
Dear ${firstName},

Thank you for submitting your franchise application! We're excited that you're interested in joining the ChiroStretch family.

We have received your application and our franchise development team will review it carefully.

NEXT STEPS
----------
1. Application Review (1-2 business days)
   Our team will review your application and qualifications.

2. Initial Contact
   A franchise development representative will reach out to you via ${formatValue(submission.contact_method).toLowerCase()}.

3. Discovery Call
   We'll schedule a call to discuss the opportunity in detail and answer your questions.

4. Next Steps
   If there's a good fit, we'll guide you through the franchise disclosure and evaluation process.

YOUR APPLICATION REFERENCE NUMBER: ${submission.entry_id}

HAVE QUESTIONS?
If you have any immediate questions or need to update your application, please don't hesitate to reach out to our franchise development team.

Learn more: ${process.env.NEXT_PUBLIC_FRONTEND_URL}/franchise

---
ChiroStretch Franchise Development
Email: franchise@chirostretch.com | Phone: (555) 123-4567
Reference Number: ${submission.entry_id}
  `.trim();

  return { subject, html, text };
}
