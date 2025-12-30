import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY not configured");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = "ChiroStretch <noreply@mail.chirostretch.site>";
export const EMAIL_REPLY_TO = "admin@chirostretch.site";
