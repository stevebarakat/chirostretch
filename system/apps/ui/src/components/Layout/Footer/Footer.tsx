import Link from "next/link";
import styles from "./Footer.module.css";
import { Container, Button, Text } from "@/components/Primitives";
import { Logo } from "@/components/Logo";
import {
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  Store,
  MapPin,
  Accessibility,
} from "lucide-react";

type FooterProps = {
  logo?: {
    altText?: string;
    sourceUrl?: string;
    mediaDetails?: {
      width?: number;
      height?: number;
    };
  };
  tagline?: string;
};

export default function Footer({ logo, tagline }: FooterProps) {
  const defaultTagline =
    "Chiropractic mobility and assisted stretching for modern movement and recovery.";

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.main}>
          <div className={styles.brandColumn}>
            <div className={styles.logoWrapper}>
              <Logo logo={logo} />
            </div>
            <Text className={styles.tagline}>{tagline || defaultTagline}</Text>
            <div className={styles.social}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className={styles.navColumn}>
            <Text as="h3" className={styles.columnTitle}>
              EXPLORE
            </Text>
            <nav className={styles.navList}>
              <Link href="/articles" className={styles.navLink}>
                Articles
              </Link>
              <Link href="/events" className={styles.navLink}>
                Events
              </Link>
              <Link href="/locations" className={styles.navLink}>
                Locations
              </Link>
              <Link href="/pricing" className={styles.navLink}>
                Pricing
              </Link>
              <Link href="/shop" className={styles.navLink}>
                Shop
              </Link>
              <Link href="/franchise" className={styles.navLink}>
                Franchise
              </Link>
              <Link href="/contact" className={styles.navLink}>
                Contact
              </Link>
            </nav>
          </div>

          <div className={styles.corporateColumn}>
            <Text as="h3" className={styles.columnTitle}>
              CORPORATE
            </Text>
            <div className={styles.corporateItem}>
              <div className={styles.corporateLabel}>
                <Mail size={20} className={styles.corporateIcon} />
                <Text as="span">INQUIRIES:</Text>
              </div>
              <a
                href="mailto:info@chirostretch.site"
                className={styles.corporateLink}
              >
                info@chirostretch.site
              </a>
            </div>
            <div className={styles.corporateItem}>
              <div className={styles.corporateLabel}>
                <Store size={20} className={styles.corporateIcon} />
                <Text as="span">PARTNERSHIP:</Text>
              </div>
              <Link href="/franchise" className={styles.corporateLink}>
                Franchise Opportunities
              </Link>
            </div>
          </div>

          <div className={styles.ctaColumn}>
            <div className={styles.ctaBox}>
              <Text as="h3" className={styles.ctaTitle}>
                Find a Clinic
              </Text>
              <Text className={styles.ctaDescription}>
                Locate a ChiroStretch studio near you and start your recovery
                journey.
              </Text>
              <Button
                as="a"
                href="/locations"
                fullWidth
                color="primary"
                variant="inverse"
                icon={<MapPin size={20} />}
                iconPosition="left"
                className={styles.ctaButton}
              >
                Find a Location
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <Text className={styles.copyright}>
            © {new Date().getFullYear()} ChiroStretch. All rights reserved.
          </Text>
          <div className={styles.legal}>
            <Link href="/privacy-policy" className={styles.legalLink}>
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className={styles.legalLink}>
              Terms of Use
            </Link>
            <Link href="/accessibility" className={styles.legalLink}>
              <Accessibility size={16} className={styles.accessibilityIcon} />
              Accessibility
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
