import { RichText } from "@/components/RichText";
import styles from "./intro.module.css";
import { Container } from "@/components/Primitives";

type IntroductionProps = {
  intro: {
    leftSide: {
      headline: string;
      text: string;
    };
    rightSide: {
      headline: string;
      bulletPoints: string;
    };
    stats: {
      stat: {
        prefix: string;
        number: number;
        suffix: string;
        description: string;
      };
    }[];
  };
};

export default function Introduction({ intro }: IntroductionProps) {
  const { leftSide, rightSide } = intro;
  const bulletPoints = rightSide.bulletPoints;

  return (
    <Container>
      <div className={styles.intro}>
        <div className={styles.introLeftWrap}>
          <div>
            <span className={styles.introHeader}>{leftSide.headline}</span>
            <RichText content={leftSide.text} as="span" className={styles.introDescription} />
          </div>
        </div>
        <div className={styles.introRightWrap}>
          <div>
            <span className={styles.introSubHeader}>{rightSide.headline}</span>
            <RichText content={bulletPoints} className={styles.introList} />
            <div id="stats" className={styles.stats}>
              {intro.stats.map((stat, i) => (
                <div key={i} className={styles.stat}>
                  <span>
                    {stat.stat.prefix}
                    {stat.stat.number.toLocaleString()}
                    {stat.stat.suffix}
                  </span>
                  <span>{stat.stat.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
