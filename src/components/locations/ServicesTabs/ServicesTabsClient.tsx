"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Image from "next/image";
import { Check } from "lucide-react";
import styles from "./ServicesTabs.module.css";
import type { Service } from "@/lib/graphql/queries";

type ServicesTabsClientProps = {
  services: Service[];
};

export function ServicesTabsClient({ services }: ServicesTabsClientProps) {
  if (services.length === 0) {
    return null;
  }

  const defaultValue = services[0]?.tabLabel
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <Tabs.Root className={styles.root} defaultValue={defaultValue}>
      <Tabs.List className={styles.tabList} aria-label="Our Core Therapies">
        {services.map((service) => {
          const id = service.tabLabel.toLowerCase().replace(/\s+/g, "-");
          return (
            <Tabs.Trigger key={id} className={styles.trigger} value={id}>
              <span className={styles.triggerIcon}>{service.tabIcon}</span>
              {service.tabLabel}
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>

      {services.map((service) => {
        const id = service.tabLabel.toLowerCase().replace(/\s+/g, "-");
        return (
          <Tabs.Content key={id} className={styles.content} value={id}>
            <div className={styles.contentGrid}>
              <div className={styles.contentText}>
                <h3 className={styles.contentTitle}>{service.title}</h3>
                <p className={styles.contentDescription}>
                  {service.description}
                </p>

                <ul className={styles.benefitsList}>
                  {service.bulletPoints.map((bullet, index) => (
                    <li key={index} className={styles.benefitItem}>
                      <Check className={styles.checkIcon} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {service.infoBox && (
                  <div className={styles.tip}>
                    <p>{service.infoBox}</p>
                  </div>
                )}
              </div>

              <div className={styles.contentImage}>
                {service.image ? (
                  <Image
                    src={service.image.sourceUrl}
                    alt={service.image.altText || service.title}
                    width={service.image.mediaDetails?.width || 500}
                    height={service.image.mediaDetails?.height || 400}
                    className={styles.image}
                  />
                ) : (
                  <Image
                    src={`https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=480&fit=crop`}
                    alt={service.title}
                    width={500}
                    height={400}
                    className={styles.image}
                  />
                )}
              </div>
            </div>
          </Tabs.Content>
        );
      })}
    </Tabs.Root>
  );
}
