"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./cta.module.css";
import { Button } from "@/components/UI/Button";
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
    button1Text: string;
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
    btn1Text?: string;
    btn1Link?: {
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

function ButtonIcon({ icon }: { icon?: IconNode }) {
  if (!icon?.sourceUrl) return null;

  return (
    <span
      className={styles.buttonIcon}
      style={
        {
          "--icon-url": `url(${icon.sourceUrl})`,
        } as React.CSSProperties
      }
    >
      <Image
        src={icon.sourceUrl}
        alt={icon.altText || ""}
        width={icon.mediaDetails?.width || 20}
        height={icon.mediaDetails?.height || 20}
        className={styles.buttonIconImage}
      />
    </span>
  );
}

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
  const { button1Text, btn1Link, btn1Icon } = cta?.button1 || {};
  const {
    btn1Text: button2Text,
    btn1Link: btn2Link,
    btn2Icon,
  } = cta?.button2 || {};

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
              {button1Text && btn1Link?.url && (
                <Link href={btn1Link.url} target={btn1Link.target || undefined}>
                  <Button
                    variant="inverse"
                    color="secondary"
                    icon={icon1Element}
                    iconPosition="left"
                  >
                    {button1Text}
                  </Button>
                </Link>
              )}
              {button2Text && btn2Link?.url && (
                <Link href={btn2Link.url} target={btn2Link.target || undefined}>
                  <Button
                    color="secondary"
                    outline
                    icon={icon2Element}
                    iconPosition="left"
                  >
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
