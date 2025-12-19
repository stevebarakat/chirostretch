import { Star } from "lucide-react";
import styles from "./StarRating.module.css";

type StarRatingProps = {
  rating: number;
  maxRating?: number;
  showNumber?: boolean;
  reviewCount?: number;
  className?: string;
};

export function StarRating({
  rating,
  maxRating = 5,
  showNumber = false,
  reviewCount,
  className,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <div className={styles.stars} role="img" aria-label={`Rating: ${rating} out of ${maxRating} stars`}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={styles.star} aria-hidden="true" />
        ))}
        {hasHalfStar && (
          <div className={styles.halfStarContainer} aria-hidden="true">
            <div className={styles.starHalf}>
              <Star className={styles.star} />
            </div>
            <Star className={`${styles.star} ${styles.empty}`} />
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={`${styles.star} ${styles.empty}`} aria-hidden="true" />
        ))}
      </div>
      {showNumber && (
        <span className={styles.ratingText}>{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className={styles.reviewCount}>({reviewCount})</span>
      )}
    </div>
  );
}

