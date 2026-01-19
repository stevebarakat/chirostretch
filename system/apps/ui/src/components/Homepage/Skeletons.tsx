import { Container, Skeleton } from "@/components/UI";
import styles from "./Skeletons.module.css";

export function IntroductionSkeleton() {
  return (
    <Container>
      <div className={styles.introGrid}>
        <div className={styles.introLeft}>
          <Skeleton height={40} width="60%" borderRadius="var(--radius-md)" />
          <Skeleton height={120} width="100%" borderRadius="var(--radius-md)" />
        </div>
        <div className={styles.introRight}>
          <Skeleton height={32} width="50%" borderRadius="var(--radius-md)" />
          <Skeleton height={160} width="100%" borderRadius="var(--radius-md)" />
        </div>
      </div>
    </Container>
  );
}

export function FeaturedProductsSkeleton() {
  return (
    <section className={styles.productsSection}>
      <Container>
        <div className={styles.sectionHeader}>
          <Skeleton height={48} width="300px" borderRadius="var(--radius-md)" />
          <Skeleton height={24} width="200px" borderRadius="var(--radius-md)" />
        </div>
        <div className={styles.productsGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.productCard}>
              <Skeleton
                height={200}
                width="100%"
                borderRadius="var(--radius-lg)"
              />
              <Skeleton
                height={24}
                width="80%"
                borderRadius="var(--radius-md)"
              />
              <Skeleton
                height={20}
                width="40%"
                borderRadius="var(--radius-md)"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function UpcomingEventsSkeleton() {
  return (
    <section className={styles.eventsSection}>
      <Container>
        <div className={styles.sectionHeader}>
          <Skeleton height={48} width="280px" borderRadius="var(--radius-md)" />
          <Skeleton height={24} width="180px" borderRadius="var(--radius-md)" />
        </div>
        <div className={styles.eventsGrid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.eventCard}>
              <Skeleton
                height={180}
                width="100%"
                borderRadius="var(--radius-lg)"
              />
              <Skeleton
                height={24}
                width="70%"
                borderRadius="var(--radius-md)"
              />
              <Skeleton
                height={16}
                width="50%"
                borderRadius="var(--radius-md)"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function LatestInsightsSkeleton() {
  return (
    <section className={styles.insightsSection}>
      <Container>
        <div className={styles.sectionHeader}>
          <Skeleton height={48} width="260px" borderRadius="var(--radius-md)" />
          <Skeleton height={24} width="160px" borderRadius="var(--radius-md)" />
        </div>
        <div className={styles.insightsGrid}>
          {[1, 2].map((i) => (
            <div key={i} className={styles.insightCard}>
              <Skeleton
                height={220}
                width="100%"
                borderRadius="var(--radius-lg)"
              />
              <div className={styles.insightContent}>
                <Skeleton
                  height={28}
                  width="90%"
                  borderRadius="var(--radius-md)"
                />
                <Skeleton
                  height={16}
                  width="60%"
                  borderRadius="var(--radius-md)"
                />
                <Skeleton
                  height={60}
                  width="100%"
                  borderRadius="var(--radius-md)"
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
