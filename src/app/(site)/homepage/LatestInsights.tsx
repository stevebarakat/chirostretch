import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import styles from "./LatestInsights.module.css";

type LatestInsightsProps = {
  insightsHeading?: string;
  insightsSubheading?: string;
  insightsCtaText?: string;
  insightsCtaLink?: string;
};

export default function LatestInsights({
  insightsHeading,
  insightsSubheading,
  insightsCtaText,
  insightsCtaLink,
}: LatestInsightsProps) {
  if (!insightsHeading) return null;

  return (
    <section className={styles.section}>
      <Container>
        <SectionHeading
          heading={insightsHeading}
          subheading={insightsSubheading}
        />
        <div className={styles.grid}>
          {/* Blog post cards will be rendered here when posts data is available */}
        </div>
      {insightsCtaText && insightsCtaLink && (
          <div className={styles.cta}>
            <Button as="a" href={insightsCtaLink} variant="primary">
              {insightsCtaText}
            </Button>
          </div>
      )}
      </Container>
    </section>
  );
}

