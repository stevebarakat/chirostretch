import { NextResponse } from "next/server";
import { render } from "@react-email/components";
import { resend, EMAIL_FROM, EMAIL_REPLY_TO } from "@/lib/email/resend";
import { PasswordResetEmail } from "@/emails/PasswordReset";

const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "https://localhost:3000";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

    if (!WP_URL) {
      console.error("NEXT_PUBLIC_WORDPRESS_URL not configured");
      return NextResponse.json({ success: true });
    }

    // Get reset key from WordPress
    const response = await fetch(
      `${WP_URL.replace(/\/$/, "")}/wp-json/chirostretch/v1/auth/request-reset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      console.error("WordPress request-reset failed:", await response.text());
      // Return success anyway to prevent email enumeration
      return NextResponse.json({ success: true });
    }

    const data = await response.json();

    // If user exists, send email via Resend
    if (data.user) {
      const { key, login, firstName } = data.user;

      // Build reset URL
      const resetUrl = `${FRONTEND_URL}/set-password?key=${encodeURIComponent(key)}&login=${encodeURIComponent(login)}`;

      // Render React Email template
      const emailHtml = await render(
        PasswordResetEmail({
          firstName: firstName || undefined,
          resetUrl,
        })
      );

      // Send via Resend
      const { error } = await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        replyTo: EMAIL_REPLY_TO,
        subject: "Reset your ChiroStretch password",
        html: emailHtml,
      });

      if (error) {
        console.error("Resend email error:", error);
        // Still return success to prevent enumeration
      }
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    // Still return success to prevent email enumeration
    return NextResponse.json({ success: true });
  }
}
