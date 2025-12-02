"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { IoIosStar } from "react-icons/io";
import styles from "../Sidebar/sidebar.module.css";
import { Button } from "../Button";

function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Hardcoded testimonials data
const testimonials = [
  {
    id: "1",
    reviewer: {
      displayName: "Sarah Johnson",
      profilePhotoUrl:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
    },
    starRating: 5,
    comment:
      "Dr. Smith and his team provided exceptional care after my car accident. The physical therapy sessions were thorough and the chiropractic adjustments really helped with my neck pain. Highly recommend!",
  },
  {
    id: "2",
    reviewer: {
      displayName: "Michael Rodriguez",
      profilePhotoUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    },
    starRating: 5,
    comment:
      "The staff is incredibly professional and caring. They helped me recover from my workplace injury much faster than I expected. The facility is clean and modern.",
  },
  {
    id: "3",
    reviewer: {
      displayName: "Jennifer Davis",
      profilePhotoUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    },
    starRating: 5,
    comment:
      "I've been dealing with chronic back pain for years. After just a few sessions here, I'm feeling better than I have in a long time. The personalized treatment plan made all the difference.",
  },
];

export default function Reviews() {
  const [key, setKey] = useState(0); // Start with first testimonial to avoid hydration mismatch

  // Set random testimonial after component mounts to avoid hydration mismatch
  useEffect(() => {
    setKey(generateRandomNumber(0, testimonials.length - 1));
  }, []);

  const currentTestimonial = testimonials[key];

  const stars = Array.from(
    { length: currentTestimonial.starRating },
    (_, i) => <IoIosStar key={i} />
  );

  // Limit comment to 148 characters
  const truncatedComment =
    currentTestimonial.comment.length > 148
      ? currentTestimonial.comment.slice(0, 148) + "..."
      : currentTestimonial.comment;

  return (
    <div className={styles.testimonial}>
      <div className={styles.testimonialImg}>
        <Image
          src={currentTestimonial.reviewer.profilePhotoUrl}
          alt={currentTestimonial.reviewer.displayName}
          width={200}
          height={200}
        />
      </div>
      <figcaption className={styles.testimonialAuthor}>
        {currentTestimonial.reviewer.displayName}
      </figcaption>
      <div className={styles.testimonialStars}>{stars}</div>
      <div>
        <blockquote>
          <span className={styles.testimonial}>{truncatedComment}</span>
        </blockquote>
      </div>
      <Button
        style={{ cursor: "pointer" }}
        textColor="white"
        color="transparent"
        borderColor="white"
        className={styles.reviewBtn}
        onClick={() => setKey(generateRandomNumber(0, testimonials.length - 1))}
      >
        read another review
      </Button>
    </div>
  );
}
