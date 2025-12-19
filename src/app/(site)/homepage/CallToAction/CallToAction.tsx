"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./cta.module.css";
import { Button } from "@/components/UI/Button";
import { Promotion } from "@/components/Promotion";

type CallToAction = {
  button1: {
    button1Text: string;
    btn1Link: {
      nodes: [
        {
          uri: string;
        }
      ];
    };
  };
  headings: {
    headline: string;
    subheading: string;
  };
};

const CallToAction = ({
  cta,
  promo,
}: {
  cta: CallToAction | null;
  promo: {
    price: number;
    topLine: string;
    middleLine: string;
    bottomLine: string;
  };
}) => {
  const pathname = usePathname();
  const { headline, subheading } = cta?.headings || {};
  const { button1Text, btn1Link } = cta?.button1 || {};
  const rawUri = (btn1Link?.nodes?.[0]?.uri as string) || "";

  // Handle query-only URLs (e.g., "?modal=claim-offer")
  // WordPress may strip these, so we also check for specific modal triggers
  let btn1Uri = rawUri;
  if (!rawUri || rawUri === "/") {
    // Default to claim-offer modal if no valid URL
    btn1Uri = `${pathname}?modal=claim-offer`;
  } else if (rawUri.startsWith("?")) {
    // Query-only URL - prepend current pathname
    btn1Uri = `${pathname}${rawUri}`;
  }

  return (
    <div className={styles.cta}>
      <div className={styles.grid}>
        <div className={styles.ctaLeftWrap}>
          <div className={styles.ctaLeftContent}>
            <Promotion promo={promo} />
          </div>
        </div>
        <div className={styles.ctaRightWrap}>
          <div className={styles.ctaRightContent}>
            <span className={styles.ctaHeader}>{headline}</span>
            <span className={styles.ctaSubHeader}>{subheading}</span>
          </div>
          <div className={styles.ctaForm}>
            <div className={styles.buttonGroup}>
              <Link href={btn1Uri}>
                <Button variant="inverse" color="secondary">
                  {button1Text}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
