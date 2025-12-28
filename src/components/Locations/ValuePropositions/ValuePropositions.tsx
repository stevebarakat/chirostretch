import { fetchGraphQL } from "@/lib/graphql/client";
import {
  VALUE_PROPOSITIONS_SETTINGS_QUERY,
  type ValuePropositionsSettingsResponse,
  type ValueProposition,
} from "@/lib/graphql/queries";
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
    const data = await fetchGraphQL<ValuePropositionsSettingsResponse>(
      VALUE_PROPOSITIONS_SETTINGS_QUERY
    );
    if (data.chiroValuePropositionsSettings?.valuePropositions?.length) {
      propositions = data.chiroValuePropositionsSettings.valuePropositions;
    }
    if (data.chiroValuePropositionsSettings?.title) {
      title = data.chiroValuePropositionsSettings.title;
    }
    if (data.chiroValuePropositionsSettings?.description) {
      description = data.chiroValuePropositionsSettings.description;
    }
  } catch (error) {
    console.error("Failed to fetch value propositions settings:", error);
  }

  if (propositions.length === 0) {
    return null;
  }

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.grid}>
        {propositions.map((prop, index) => (
          <div key={index} className={styles.card}>
            <div
              className={styles.iconWrapper}
              style={
                {
                  "--icon-color": prop.iconBackgroundColor || "hsl(210 100% 50%)",
                  "--icon-url": prop.icon ? `url(${prop.icon.sourceUrl})` : undefined,
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
            <h3 className={styles.cardTitle}>{prop.title}</h3>
            <p className={styles.cardDescription}>{prop.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
