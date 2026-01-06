import Link from "next/link";
import styles from "./Footer.module.css";
import { Container } from "@/components/UI";
import { Logo } from "../Logo";
import { Button } from "@/components/UI";
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
            <p className={styles.tagline}>{tagline || defaultTagline}</p>
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
            <h3 className={styles.columnTitle}>EXPLORE</h3>
            <nav className={styles.navList}>
              <Link href="/about" className={styles.navLink}>
                About
              </Link>
              <Link href="/locations" className={styles.navLink}>
                Locations
              </Link>
              <Link href="/services" className={styles.navLink}>
                Services
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
            <h3 className={styles.columnTitle}>CORPORATE</h3>
            <div className={styles.corporateItem}>
              <div className={styles.corporateLabel}>
                <Mail size={20} className={styles.corporateIcon} />
                <span>INQUIRIES:</span>
              </div>
              <a href="mailto:info@chirostretch.site" className={styles.corporateLink}>
                info@chirostretch.site
              </a>
            </div>
            <div className={styles.corporateItem}>
              <div className={styles.corporateLabel}>
                <Store size={20} className={styles.corporateIcon} />
                <span>PARTNERSHIP:</span>
              </div>
              <Link href="/franchise" className={styles.corporateLink}>
                Franchise Opportunities
              </Link>
            </div>
          </div>

          <div className={styles.ctaColumn}>
            <div className={styles.ctaBox}>
              <h3 className={styles.ctaTitle}>Find a Clinic</h3>
              <p className={styles.ctaDescription}>
                Locate a ChiroStretch studio near you and start your recovery
                journey.
              </p>
              <Button
                as="a"
                href="/locations"
                color="secondary"
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
          <p className={styles.copyright}>
            © {new Date().getFullYear()} ChiroStretch. All rights reserved.
          </p>
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
