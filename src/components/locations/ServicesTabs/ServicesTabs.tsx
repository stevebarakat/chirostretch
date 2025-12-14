"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Image from "next/image";
import { Check } from "lucide-react";
import styles from "./ServicesTabs.module.css";

type ServiceData = {
  id: string;
  icon: string;
  label: string;
  title: string;
  description: string;
  benefits: string[];
  tip?: string;
  image: string;
};

const services: ServiceData[] = [
  {
    id: "chiropractic",
    icon: "🦴",
    label: "Chiropractic",
    title: "Precision Spinal Adjustments",
    description:
      "Our licensed chiropractors use controlled, gentle force to realign joints, improving mobility and relieving pain. We focus on the spine to optimize nervous system function and body mechanics.",
    benefits: [
      "Relief from back, neck, and joint pain",
      "Improved nervous system function",
      "Non-invasive & drug-free",
    ],
    tip: "Adjustments help improve nerve function, which boosts the body's immune response and overall wellness.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=480&fit=crop",
  },
  {
    id: "stretch",
    icon: "🧘",
    label: "Stretch Therapy",
    title: "Assisted Stretch Therapy",
    description:
      "Don't just stretch—get stretched. Our therapists use PNF (Proprioceptive Neuromuscular Facilitation) techniques to safely push your muscles further than you can on your own.",
    benefits: [
      "Increase flexibility & range of motion",
      "Reduce muscle stiffness & tension",
      "Enhance athletic performance",
    ],
    tip: "Regular stretching combined with chiropractic care extends the positive effects of your treatment.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=480&fit=crop",
  },
  {
    id: "massage",
    icon: "💆",
    label: "Massage",
    title: "Therapeutic Massage",
    description:
      "Our massage therapists work to reduce muscle tension, improve circulation, and complement your chiropractic treatment plan with targeted soft tissue work.",
    benefits: [
      "Reduce muscle tension & pain",
      "Improve blood circulation",
      "Accelerate recovery from injuries",
    ],
    tip: "Massage therapy before adjustments can help relax tight muscles, making chiropractic care more effective.",
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&h=480&fit=crop",
  },
];

export function ServicesTabs() {
  return (
    <Tabs.Root className={styles.root} defaultValue="chiropractic">
      <Tabs.List className={styles.tabList} aria-label="Our Core Therapies">
        {services.map((service) => (
          <Tabs.Trigger
            key={service.id}
            className={styles.trigger}
            value={service.id}
          >
            <span className={styles.triggerIcon}>{service.icon}</span>
            {service.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {services.map((service) => (
        <Tabs.Content
          key={service.id}
          className={styles.content}
          value={service.id}
        >
          <div className={styles.contentGrid}>
            <div className={styles.contentText}>
              <h3 className={styles.contentTitle}>{service.title}</h3>
              <p className={styles.contentDescription}>{service.description}</p>

              <ul className={styles.benefitsList}>
                {service.benefits.map((benefit, index) => (
                  <li key={index} className={styles.benefitItem}>
                    <Check className={styles.checkIcon} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {service.tip && (
                <div className={styles.tip}>
                  <p>{service.tip}</p>
                </div>
              )}
            </div>

            <div className={styles.contentImage}>
              <Image
                src={service.image}
                alt={service.title}
                width={500}
                height={400}
                className={styles.image}
              />
            </div>
          </div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
