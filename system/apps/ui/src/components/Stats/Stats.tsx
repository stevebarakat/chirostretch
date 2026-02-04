"use client";

import CountUp from "react-countup";
import styles from "./Stats.module.css";
import { Text } from "@/components/Primitives";

type Stat = {
  stat: {
    prefix: string;
    number: number;
    suffix: string;
    description: string;
  };
};

type StatsProps = {
  stats: Stat[] | undefined;
};

function Stats({ stats }: StatsProps) {
  return (
    <div id="stats" className={styles.stats}>
      {stats?.map((stat, i) => (
        <div key={i} className={styles.stat}>
          <CountUp
            className={styles.number}
            end={stat.stat.number}
            duration={2 + i * 0.4}
            separator=","
            prefix={stat.stat.prefix}
            suffix={stat.stat.suffix}
            enableScrollSpy
          />
          <Text as="span">{stat.stat.description}</Text>
        </div>
      ))}
    </div>
  );
}

export default Stats;
