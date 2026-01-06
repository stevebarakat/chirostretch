import Image from "next/image";
import { Container } from "@/components/UI";
import { StarRating } from "@/components/UI";
import type { TestimonialNode } from "@/lib/graphql/queries/testimonials";
import styles from "./Testimonials.module.css";

type Testimonial = {
  name: string;
  rating: number;
  text: string;
  imageUrl: string;
  imageAlt: string;
};

const defaultTestimonials: Testimonial[] = [
  {
    name: "Kathy M.",
    rating: 5,
    text: "My pain has been greatly reduced and I feel so much healthier. I have been coming here for the past few months to work on some neck and back pain. The therapists are extremely knowledgeable.",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
    imageAlt: "Kathy M.",
  },
  {
    name: "Rob S.",
    rating: 5,
    text: "Committing to a couple sessions a week is the best thing I have done for myself this year. If you suffer from stiffness, do something about it. The stretch therapy is a game changer.",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    imageAlt: "Rob S.",
  },
];

type TestimonialsProps = {
  testimonials?: TestimonialNode[];
};

export function Testimonials({ testimonials = [] }: TestimonialsProps) {
  const hasWPTestimonials = testimonials.length > 0;

  return (
    <section className={styles.section}>
      <Container>
        <h2 className={styles.heading}>Stories of Recovery</h2>
        <p className={styles.subheading}>
          Hear from our patients about their journey to better health and
          wellness.
        </p>
        <div className={styles.grid}>
          {hasWPTestimonials
            ? testimonials.map((testimonial) => (
                <article key={testimonial.databaseId} className={styles.card}>
                  <div className={styles.cardHeader}>
                    {testimonial.featuredImage?.node?.sourceUrl && (
                      <div className={styles.avatar}>
                        <Image
                          src={testimonial.featuredImage.node.sourceUrl}
                          alt={testimonial.featuredImage.node.altText || testimonial.title || ""}
                          width={60}
                          height={60}
                          className={styles.avatarImage}
                        />
                      </div>
                    )}
                    <div className={styles.cardInfo}>
                      <h3 className={styles.name}>{testimonial.title}</h3>
                      <StarRating
                        rating={testimonial.rating || 5}
                        color="gold"
                        className={styles.rating}
                      />
                    </div>
                  </div>
                  <p className={styles.text}>{testimonial.reviewText}</p>
                </article>
              ))
            : defaultTestimonials.map((testimonial, index) => (
                <article key={index} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.avatar}>
                      <Image
                        src={testimonial.imageUrl}
                        alt={testimonial.imageAlt}
                        width={60}
                        height={60}
                        className={styles.avatarImage}
                      />
                    </div>
                    <div className={styles.cardInfo}>
                      <h3 className={styles.name}>{testimonial.name}</h3>
                      <StarRating
                        rating={testimonial.rating}
                        color="gold"
                        className={styles.rating}
                      />
                    </div>
                  </div>
                  <p className={styles.text}>{testimonial.text}</p>
                </article>
              ))}
        </div>
      </Container>
    </section>
  );
}
