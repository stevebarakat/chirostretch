import styles from "./cta.module.css";
import Button from "../ui/Button";
import Link from "next/link";
import { Promotion } from "../Promotion";

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
  button2: {
    btn2Link: {
      nodes: [
        {
          uri: string;
        }
      ];
    };
    button2Text: string;
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
  // if (!cta) return null;

  const { headline, subheading } = cta?.headings || {};
  const { button1Text, btn1Link } = cta?.button1 || {};
  const { button2Text, btn2Link } = cta?.button2 || {};
  const btn1Uri = (btn1Link?.nodes?.[0]?.uri as string) || "";
  const btn2Uri = (btn2Link?.nodes?.[0]?.uri as string) || "";

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
                <Button variant="primary">{button1Text}</Button>
              </Link>
              <Link href={btn2Uri}>
                <Button variant="outline">{button2Text}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
