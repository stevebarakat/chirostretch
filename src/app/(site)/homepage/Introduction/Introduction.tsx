"use client";
import { useRef } from "react";
import CountUp from "react-countup";
import { RawHtml } from "@/components/RawHtml";
import useOnScreen from "@/hooks/useOnScreen";
import styles from "./intro.module.css";
import { Container } from "@/components/UI/Container";

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
  const statsRef = useRef<HTMLDivElement | null>(null);
  const onScreen = useOnScreen(statsRef, "-100px");
  const { leftSide, rightSide } = intro;
  const bulletPoints = rightSide.bulletPoints;

  const statsList = intro.stats.map((stat, i) => {
    return (
      <div key={i} className={styles.stat}>
        <CountUp
          start={onScreen ? 0 : stat.stat.number}
          end={stat.stat.number}
          duration={4.5 - i * 0.25}
          useEasing={true}
          prefix={stat.stat.prefix ?? ""}
          suffix={stat.stat.suffix ?? ""}
        />
        <span>{stat.stat.description}</span>
      </div>
    );
  });

  return (
    <Container>
      <div className={styles.intro}>
        <div className={styles.introLeftWrap}>
          <div>
            <span className={styles.introHeader}>{leftSide.headline}</span>
            <span className={styles.introDescription}>
              <RawHtml>{leftSide.text}</RawHtml>
            </span>
          </div>
        </div>
        <div className={styles.introRightWrap}>
          <div>
            <span className={styles.introSubHeader}>{rightSide.headline}</span>
            <RawHtml className={styles.introList}>{bulletPoints}</RawHtml>
            <div ref={statsRef} id="stats" className={styles.stats}>
              {statsList}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
