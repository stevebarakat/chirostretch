"use client";

import styles from "./cta.module.css";
import { Button, ButtonIcon } from "@/components/UI/Button";
import { Promotion } from "@/components/Promotion";

type IconNode = {
  sourceUrl?: string;
  altText?: string;
  mediaDetails?: {
    width?: number;
    height?: number;
  };
};

type CallToActionType = {
  button1: {
    btn1Link?: {
      url?: string;
      title?: string;
      target?: string;
    };
    btn1Icon?: {
      node?: IconNode;
    };
  };
  button2?: {
    btn2Link?: {
      url?: string;
      title?: string;
      target?: string;
    };
    btn2Icon?: {
      node?: IconNode;
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
  const { btn1Link, btn1Icon } = cta?.button1 || {};
  const { btn2Link, btn2Icon } = cta?.button2 || {};

  const icon1Element = btn1Icon?.node?.sourceUrl ? (
    <ButtonIcon icon={btn1Icon.node} />
  ) : undefined;

  const icon2Element = btn2Icon?.node?.sourceUrl ? (
    <ButtonIcon icon={btn2Icon.node} />
  ) : undefined;

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
              {btn1Link?.url && btn1Link?.title && (
                <Button
                  as="a"
                  href={btn1Link.url}
                  target={btn1Link.target || undefined}
                  variant="inverse"
                  color="secondary"
                  icon={icon1Element}
                  iconPosition="left"
                >
                  {btn1Link.title}
                </Button>
              )}
              {btn2Link?.url && btn2Link?.title && (
                <Button
                  as="a"
                  href={btn2Link.url}
                  target={btn2Link.target || undefined}
                  color="secondary"
                  outline
                  icon={icon2Element}
                  iconPosition="left"
                >
                  {btn2Link.title}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
