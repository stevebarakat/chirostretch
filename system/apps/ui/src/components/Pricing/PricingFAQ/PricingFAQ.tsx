import { ChevronDown } from "lucide-react";
import styles from "./PricingFAQ.module.css";

const FAQ_ITEMS = [
  {
    question: "Does insurance cover stretch therapy?",
    answer:
      "Most insurance plans cover chiropractic adjustments as medically necessary treatment. Stretch therapy is often covered if it's billed as manual therapy or corrective exercise under a physical rehab plan. We recommend checking with your provider first.",
  },
  {
    question: "Can I share my package with a spouse?",
    answer:
      "Yes! Our 10 and 20 session packages are shareable between immediate family members. Just let our reception team know who you'd like to authorize on your account.",
  },
  {
    question: "What if I need to cancel my appointment?",
    answer:
      "We require 24-hour notice for all cancellations. Appointments cancelled within the 24-hour window may be subject to a 50% service fee or one session deduction from your package.",
  },
];

export function PricingFAQ() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>
          Frequently Asked <span className={styles.accent}>Questions</span>
        </h2>
        <div className={styles.faqList}>
          {FAQ_ITEMS.map(({ question, answer }) => (
            <details key={question} className={styles.details}>
              <summary>
                {question}
                <ChevronDown className={styles.chevron} size={24} aria-hidden />
              </summary>
              <div className={styles.answer}>{answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
