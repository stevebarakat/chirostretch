"use client";
import { useRef } from "react";
import CountUp from "react-countup";
import { RawHtml } from "@/components/RawHtml";
import useOnScreen from "@/hooks/useOnScreen";
import "./intro.css";
import { Container } from "../Container";

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
      <div key={i} className="stat">
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
      <div className="intro">
        <div className="introLeftWrap">
          <div>
            <span className="introHeader">{leftSide.headline}</span>
            <span className="introDescription">
              <RawHtml>{leftSide.text}</RawHtml>
            </span>
          </div>
        </div>
        <div className="introRightWrap">
          <div>
            <span className="introSubHeader">{rightSide.headline}</span>
            <RawHtml className="introList">{bulletPoints}</RawHtml>
            <div ref={statsRef} id="stats" className="stats">
              {statsList}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
