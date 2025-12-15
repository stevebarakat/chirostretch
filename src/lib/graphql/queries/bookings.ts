// Bookable Products Query - fetches all bookable services
export const BOOKABLE_PRODUCTS_QUERY = `
  query BookableProducts {
    products(where: { type: BOOKING }, first: 100) {
      nodes {
        id
        databaseId
        name
        slug
        shortDescription
        ... on BookingProduct {
          price
          regularPrice
          bookingDuration
          bookingDurationUnit
          bookingMinDuration
          bookingMaxDuration
        }
      }
    }
  }
`;

// Single Bookable Product Query
export const BOOKABLE_PRODUCT_QUERY = `
  query BookableProduct($id: ID!) {
    product(id: $id, idType: DATABASE_ID) {
      id
      databaseId
      name
      slug
      shortDescription
      ... on BookingProduct {
        price
        regularPrice
        bookingDuration
        bookingDurationUnit
        bookingMinDuration
        bookingMaxDuration
      }
    }
  }
`;

// Types
export type BookableProduct = {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  shortDescription?: string;
  price?: string;
  regularPrice?: string;
  bookingDuration?: number;
  bookingDurationUnit?: "minute" | "hour" | "day";
  bookingMinDuration?: number;
  bookingMaxDuration?: number;
};

export type BookableProductsResponse = {
  products: {
    nodes: BookableProduct[];
  };
};

export type BookableProductResponse = {
  product: BookableProduct | null;
};

// Available date in a date range
export type AvailableDate = {
  date: string; // YYYY-MM-DD
  available: boolean;
};

// Time slot for a specific date
export type TimeSlot = {
  start: string; // ISO datetime or HH:mm
  end: string;
  available: boolean;
};

// Booking state stored in URL
export type BookingURLState = {
  serviceId?: string;
  date?: string; // YYYY-MM-DD
  time?: string; // HH:mm
};
