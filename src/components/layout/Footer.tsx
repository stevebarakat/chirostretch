import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter } from "lucide-react";
import styles from "./Footer.module.css";
import Container from "../ui/Container";

type FooterProps = {
  logo?: {
    altText?: string;
    sourceUrl?: string;
  };
};

export default function Footer({ logo }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.main}>
          <div className={styles.column}>
            <Link href="/" className={styles.logo}>
              {logo?.sourceUrl ? (
                <Image
                  src={logo.sourceUrl}
                  alt={logo.altText || "ChiroStretch"}
                  width={200}
                  height={50}
                  className={styles.logoImage}
                  style={{ width: "auto", height: "auto" }}
                />
              ) : (
                <>
                  <span className={styles.logoChiro}>Chiro</span>
                  <span className={styles.logoStretch}>Stretch</span>
                </>
              )}
            </Link>
            <p className={styles.description}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className={styles.social}>
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
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Latest Posts</h3>
            <ul className={styles.list}>
              <li>
                <Link href="/blog/how-chiropractic-mobility-training-supports-long-term-wellness" className={styles.listLink}>
                  How Chiropractic Mobility Training Supports Long-Term Wellness
                </Link>
              </li>
              <li>
                <Link href="/blog/movement-as-a-form-of-self-care" className={styles.listLink}>
                  Movement as a Form of Self-Care
                </Link>
              </li>
              <li>
                <Link href="/blog/what-makes-chiropractic-mobility-care-different" className={styles.listLink}>
                  What Makes Chiropractic Mobility Care Different?
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Upcoming Events</h3>
            <ul className={styles.list}>
              <li>
                <Link href="/events/global-mobility-reset-workshop" className={styles.listLink}>
                  Global Mobility Reset Workshop
                </Link>
              </li>
              <li>
                <Link href="/events/assisted-stretching-practitioner-certification-level-1" className={styles.listLink}>
                  Assisted Stretching Practitioner Certification - Level 1
                </Link>
              </li>
              <li>
                <Link href="/events/chiropractic-education-spinal-longevity-seminar" className={styles.listLink}>
                  Chiropractic Education: Spinal Longevity Seminar
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Get In Touch</h3>
            <address className={styles.contact}>
              <p>123 Main Street</p>
              <p>New York, NY 10001</p>
              <p>
                <a href="mailto:contact@mysite.com" className={styles.contactLink}>
                  contact@mysite.com
                </a>
              </p>
              <p>
                <a href="tel:+11234567890" className={styles.contactLink}>
                  123-456-7890
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>© 2023 All Rights Reserved.</p>
        </div>
      </Container>
    </footer>
  );
}

