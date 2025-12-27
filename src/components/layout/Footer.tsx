import Image from "next/image";
import styles from "./Footer.module.css";
import { Container } from "@/components/UI/Container";
import Menu from "./Menu";
import type { MenuItem } from "@/lib/graphql/queries";
import { Logo } from "../Logo";

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
            <Logo logo={logo} />
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
