import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import Container from "../ui/Container";
import Menu from "./Menu";
import type { MenuItem } from "@app/_lib/wp/queries/layout-query";

type FooterProps = {
  logo?: {
    altText?: string;
    sourceUrl?: string;
  };
  menuItems?: MenuItem[];
  contactInfo?: string;
  officeHours?: string;
  socialMedia?: Array<{
    name: string;
    url: string;
    icon?: {
      node: {
        altText: string;
        sourceUrl: string;
        mediaDetails: {
          width: number;
          height: number;
        };
      };
    };
  }>;
};

export default function Footer({
  logo,
  menuItems,
  contactInfo,
  officeHours,
  socialMedia,
}: FooterProps) {
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
                  quality={75}
                />
              ) : (
                <>
                  <span className={styles.logoChiro}>Chiro</span>
                  <span className={styles.logoStretch}>Stretch</span>
                </>
              )}
            </Link>
            {contactInfo && (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: contactInfo }}
              />
            )}
            {socialMedia && socialMedia.length > 0 && (
              <div className={styles.social}>
                {socialMedia.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={item.name}
                  >
                    {item.icon?.node?.sourceUrl ? (
                      <Image
                        src={item.icon.node.sourceUrl}
                        alt={item.icon.node.altText || item.name}
                        width={item.icon.node.mediaDetails.width}
                        height={item.icon.node.mediaDetails.height}
                        className={styles.socialIcon}
                      />
                    ) : (
                      <span>{item.name}</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          {menuItems && menuItems.length > 0 && (
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Navigation</h3>
              <ul className={styles.menuList}>
                {menuItems.map((item) => (
                  <Menu key={item.id} item={item} variant="footer" />
                ))}
              </ul>
            </div>
          )}

          {officeHours && (
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Office Hours</h3>
              <div
                className={styles.officeHours}
                dangerouslySetInnerHTML={{ __html: officeHours }}
              />
            </div>
          )}

          {contactInfo && (
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Get In Touch</h3>
              <address
                className={styles.contact}
                dangerouslySetInnerHTML={{ __html: contactInfo }}
              />
            </div>
          )}
        </div>

        <div className={styles.copyright}>
          <p>© {new Date().getFullYear()} All Rights Reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
