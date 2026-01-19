import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Confirmation } from "@/components/Confirmation";
import { Container } from "@/components/Primitives";
import { NewPatientContent } from "./NewPatientContent";

const VALID_TYPES = ["new-patient-special", "contact", "franchise"] as const;
type ThankYouType = (typeof VALID_TYPES)[number];

type PageProps = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{
    name?: string;
    email?: string;
    coupon?: string;
    expires?: string;
  }>;
};

const META: Record<ThankYouType, { title: string; description: string }> = {
  "new-patient-special": {
    title: "Thank You | New Patient Special",
    description: "Your new patient special coupon is ready.",
  },
  contact: {
    title: "Thank You | Contact",
    description: "Your message has been received.",
  },
  franchise: {
    title: "Thank You | Franchise Application",
    description: "Your franchise application has been received.",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;

  if (!VALID_TYPES.includes(type as ThankYouType)) {
    return { title: "Not Found" };
  }

  const meta = META[type as ThankYouType];
  return {
    title: meta.title,
    description: meta.description,
    robots: { index: false, follow: false },
  };
}

export default async function ThankYouPage({ params, searchParams }: PageProps) {
  const { type } = await params;

  if (!VALID_TYPES.includes(type as ThankYouType)) {
    notFound();
  }

  const query = await searchParams;
  const name = query.name || "there";

  if (type === "new-patient-special") {
    return (
      <Container>
        <NewPatientContent
          name={name}
          email={query.email || ""}
          couponCode={query.coupon}
          couponExpires={query.expires}
        />
      </Container>
    );
  }

  if (type === "franchise") {
    return (
      <Container>
        <Confirmation
          heading={`Thank You, ${name}!`}
          subtext="Your franchise application has been received"
        >
          <p style={{ marginBottom: "var(--spacing-lg)", color: "var(--color-text-secondary)" }}>
            Our franchise team will review your application and contact you within 3 business days
            to discuss next steps.
          </p>
          {query.email && (
            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-tertiary)" }}>
              We&apos;ll reach out to you at{" "}
              <strong style={{ color: "var(--color-text-primary)" }}>{query.email}</strong>
            </p>
          )}
        </Confirmation>
      </Container>
    );
  }

  // type === "contact"
  return (
    <Container>
      <Confirmation heading={`Thank You, ${name}!`} subtext="We've received your message">
        <p style={{ color: "var(--color-text-secondary)" }}>We&apos;ll be in touch soon.</p>
      </Confirmation>
    </Container>
  );
}
