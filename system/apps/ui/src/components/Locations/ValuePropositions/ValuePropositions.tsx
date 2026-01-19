import { wpQuery } from "@/lib/cms/graphql";
import {
  VALUE_PROPOSITIONS_SETTINGS_QUERY,
  type ValuePropositionsSettingsResponse,
  type ValueProposition,
} from "@/lib/graphql/queries";
import { proxyCmsUrl } from "@/utils/image-helpers";
import { Text } from "@/components/Primitives";
import styles from "./ValuePropositions.module.css";

const fallbackTitle = "The ChiroStretch Advantage";
const fallbackDescription = "";

const fallbackPropositions: ValueProposition[] = [
  {
    icon: null,
    iconBackgroundColor: "hsl(200 70% 52%)",
    title: "Pain Management",
    description:
      "Effective relief for sciatica, lower back pain, neck tension, and headaches without medication.",
  },
  {
    icon: null,
    iconBackgroundColor: "hsl(142 71% 45%)",
    title: "Enhanced Mobility",
    description:
      "Regain your range of motion. Perfect for athletes, seniors, and anyone wanting to move freely.",
  },
  {
    icon: null,
    iconBackgroundColor: "hsl(38 92% 50%)",
    title: "Posture Correction",
    description:
      "Correct misalignments caused by office work or poor habits to prevent long-term damage.",
  },
  {
    icon: null,
    iconBackgroundColor: "hsl(270 60% 55%)",
    title: "Holistic Wellness",
    description:
      "Better sleep, reduced stress, and improved nervous system health for a better quality of life.",
  },
];

export async function ValuePropositions() {
  let title = fallbackTitle;
  let description = fallbackDescription;
  let propositions: ValueProposition[] = fallbackPropositions;

  try {
    const data = await wpQuery<ValuePropositionsSettingsResponse>(
      VALUE_PROPOSITIONS_SETTINGS_QUERY
    );
    if (data.chiroFeatureSettings?.keyPoints?.length) {
      propositions = data.chiroFeatureSettings.keyPoints;
    }
    if (data.chiroFeatureSettings?.title) {
      title = data.chiroFeatureSettings.title;
    }
    if (data.chiroFeatureSettings?.description) {
      description = data.chiroFeatureSettings.description;
    }
  } catch (error) {
    console.error("Failed to fetch value propositions settings:", error);
  }

  if (propositions.length === 0) {
    return null;
  }

  return (
    <div className={styles.root}>
      <Text as="h2" className={styles.title}>{title}</Text>
      {description && <Text className={styles.description}>{description}</Text>}
      <div className={styles.grid}>
        {propositions.map((prop, index) => (
          <div key={index} className={styles.card}>
            <div
              className={styles.iconWrapper}
              style={
                {
                  "--icon-color": prop.iconBackgroundColor || "hsl(210 100% 50%)",
                  "--icon-url": prop.icon ? `url(${proxyCmsUrl(prop.icon.sourceUrl)})` : undefined,
                } as React.CSSProperties
              }
            >
              {prop.icon ? (
                <span
                  className={styles.icon}
                  role="img"
                  aria-label={prop.icon.altText || prop.title}
                />
              ) : (
                <span className={styles.iconFallback}>●</span>
              )}
            </div>
            <Text as="h3" className={styles.cardTitle}>{prop.title}</Text>
            <Text className={styles.cardDescription}>{prop.description}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}
