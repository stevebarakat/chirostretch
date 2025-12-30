import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type PasswordResetEmailProps = {
  firstName?: string;
  resetUrl: string;
};

export function PasswordResetEmail({
  firstName,
  resetUrl,
}: PasswordResetEmailProps) {
  const previewText = "Reset your ChiroStretch password";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>ChiroStretch</Heading>
          </Section>

          <Section style={content}>
            <Heading style={heading}>Reset Your Password</Heading>

            <Text style={paragraph}>
              Hi{firstName ? ` ${firstName}` : ""},
            </Text>

            <Text style={paragraph}>
              We received a request to reset your password. Click the button
              below to choose a new password:
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={resetUrl}>
                Reset Password
              </Button>
            </Section>

            <Text style={paragraph}>
              This link will expire in <strong>24 hours</strong>.
            </Text>

            <Text style={paragraph}>
              If you didn&apos;t request a password reset, you can safely ignore
              this email. Your password will remain unchanged.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              If the button doesn&apos;t work, copy and paste this link into
              your browser:
            </Text>
            <Link href={resetUrl} style={footerLink}>
              {resetUrl}
            </Link>
          </Section>

          <Section style={footerBrand}>
            <Text style={footerBrandText}>
              © {new Date().getFullYear()} ChiroStretch. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 48px",
  backgroundColor: "#1a365d",
  textAlign: "center" as const,
};

const logo = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0",
  letterSpacing: "-0.5px",
};

const content = {
  padding: "32px 48px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#1a365d",
  marginBottom: "24px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#4a5568",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#2b6cb0",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "0",
};

const footer = {
  padding: "24px 48px",
};

const footerText = {
  fontSize: "12px",
  color: "#718096",
  marginBottom: "8px",
};

const footerLink = {
  fontSize: "12px",
  color: "#2b6cb0",
  wordBreak: "break-all" as const,
};

const footerBrand = {
  padding: "0 48px 24px",
  textAlign: "center" as const,
};

const footerBrandText = {
  fontSize: "12px",
  color: "#a0aec0",
  margin: "0",
};

export default PasswordResetEmail;
