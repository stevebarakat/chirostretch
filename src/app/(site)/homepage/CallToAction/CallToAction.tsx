"use client";

import Link from "next/link";
import styles from "./cta.module.css";
import { Button } from "@/components/UI/Button";
import { Promotion } from "@/components/Promotion";

type CallToActionType = {
  button1: {
    button1Text: string;
    btn1Link?: {
      url?: string;
      title?: string;
      target?: string;
    };
  };
  button2?: {
    btn1Text?: string;
    btn1Link?: {
      url?: string;
      title?: string;
      target?: string;
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
  cta: CallToActionType | null;
  promo: {
    price: number;
    topLine: string;
    middleLine: string;
    bottomLine: string;
  };
}) => {
  const { headline, subheading } = cta?.headings || {};
  const { button1Text, btn1Link } = cta?.button1 || {};
  const { btn1Text: button2Text, btn1Link: btn2Link } = cta?.button2 || {};

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
              {button1Text && btn1Link?.url && (
                <Link href={btn1Link.url} target={btn1Link.target || undefined}>
                  <Button variant="inverse" color="secondary">
                    {button1Text}
                  </Button>
                </Link>
              )}
              {button2Text && btn2Link?.url && (
                <Link href={btn2Link.url} target={btn2Link.target || undefined}>
                  <Button variant="inverse" color="glass" outline>
                    {button2Text}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
