import styles from "./cta.module.css";
import { Button } from "@/components/Button";
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
  cta: CallToAction;
  promo: {
    price: number;
    topLine: string;
    middleLine: string;
    bottomLine: string;
  };
}) => {
  const { button1, button2, headings } = cta;
  const { headline, subheading } = headings;
  const { button1Text, btn1Link } = button1;
  const { button2Text, btn2Link } = button2;
  const { uri: btn1Uri } = btn1Link.nodes[0];
  const { uri: btn2Uri } = btn2Link.nodes[0];

  return (
    <div className={styles.cta}>
      <div className="grid">
        <div id="left" className={styles.ctaLeftWrap}>
          <Promotion promo={promo} />
        </div>
        <div id="right" className={styles.ctaRightWrap}>
          <div>
            <span className={styles.ctaHeader}>{headline}</span>
            <span className={styles.ctaSubHeader}>{subheading}</span>
            <div className={styles.ctaForm}>
              <div className="flex">
                <div
                  style={{
                    marginRight: "0.25rem",
                  }}
                >
                  <Link passHref href={btn1Uri}>
                    <Button color="white" textColor="var(--accentColor)">
                      {button1Text}
                    </Button>
                  </Link>
                </div>
                <div
                  style={{
                    marginLeft: "0.25rem",
                  }}
                >
                  <Link passHref href={btn2Uri}>
                    <Button
                      color="var(--accentColor)"
                      borderColor="var(--grey05)"
                      textColor="white"
                    >
                      {button2Text}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
