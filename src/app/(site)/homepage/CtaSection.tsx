import styles from "./CtaSection.module.css";

type CtaSectionProps = {
  headings?: {
    headline?: string;
    subheading?: string;
  };
  button1?: {
    button1Text?: string;
  };
  button2?: {
    button2Text?: string;
  };
};

export default function CtaSection({
  headings,
  button1,
  button2,
}: CtaSectionProps) {
  if (!headings?.headline) return null;

  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <div className={styles.headings}>
          {headings.headline && (
            <h2 className={styles.heading}>{headings.headline}</h2>
          )}
          {headings.subheading && (
            <p className={styles.subheading}>{headings.subheading}</p>
          )}
        </div>
        {(button1?.button1Text || button2?.button2Text) && (
          <div className={styles.buttons}>
            {button1?.button1Text && (
              <div className={styles.buttonText}>{button1.button1Text}</div>
            )}
            {button2?.button2Text && (
              <div className={styles.buttonText}>{button2.button2Text}</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
