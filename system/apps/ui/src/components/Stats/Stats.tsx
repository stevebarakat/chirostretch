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
          <span>
            {stat.stat.prefix}
            {stat.stat.number.toLocaleString()}
            {stat.stat.suffix}
          </span>
          <span>{stat.stat.description}</span>
        </div>
      ))}
    </div>
  );
}

export default Stats;
