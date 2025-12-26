export const ALL_TESTIMONIALS_QUERY = `
  query AllTestimonials($first: Int = 100) {
    testimonials(first: $first) {
      nodes {
        id
        databaseId
        title
        rating
        reviewText
        locationId
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export type TestimonialNode = {
  id?: string;
  databaseId?: number;
  title?: string;
  rating?: number;
  reviewText?: string;
  locationId?: number | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  };
};

export type AllTestimonialsResponse = {
  testimonials?: {
    nodes?: TestimonialNode[];
  };
};

