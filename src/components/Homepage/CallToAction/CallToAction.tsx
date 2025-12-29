"use client";

import { usePathname, useSearchParams } from "next/navigation";
import styles from "./cta.module.css";
import { Button, ButtonIcon } from "@/components/UI";
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

function isModalLink(url: string): boolean {
  return url.startsWith("?") || url === "/?modal=claim-offer";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { headline, subheading } = cta?.headings || {};
  const { btn1Link, btn1Icon } = cta?.button1 || {};
  const { btn2Link, btn2Icon } = cta?.button2 || {};

  const icon1Element = btn1Icon?.node?.sourceUrl ? (
    <ButtonIcon icon={btn1Icon.node} />
  ) : undefined;

  const icon2Element = btn2Icon?.node?.sourceUrl ? (
    <ButtonIcon icon={btn2Icon.node} />
  ) : undefined;

  const getLinkUrl = (href: string): string => {
    const queryPart = href.startsWith("?") ? href.slice(1) : href.split("?")[1];
    if (!queryPart) return href;

    const params = new URLSearchParams(queryPart);
    const newParams = new URLSearchParams(searchParams.toString());
    params.forEach((value, key) => {
      newParams.set(key, value);
    });
    return newParams.toString()
      ? `${pathname}?${newParams.toString()}`
      : pathname;
  };

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
              {btn1Link?.url &&
                btn1Link?.title &&
                (isModalLink(btn1Link.url) ? (
                  <Button
                    as="Link"
                    href={getLinkUrl(btn1Link.url)}
                    scroll={false}
                    variant="inverse"
                    color="secondary"
                    icon={icon1Element}
                    iconPosition="left"
                  >
                    {btn1Link.title}
                  </Button>
                ) : (
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
                ))}
              {btn2Link?.url &&
                btn2Link?.title &&
                (isModalLink(btn2Link.url) ? (
                  <Button
                    as="Link"
                    href={getLinkUrl(btn2Link.url)}
                    scroll={false}
                    color="secondary"
                    outline
                    icon={icon2Element}
                    iconPosition="left"
                  >
                    {btn2Link.title}
                  </Button>
                ) : (
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
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
