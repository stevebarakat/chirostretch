// Bookable Products Query - fetches all bookable services
export const BOOKING_PRODUCTS_QUERY = `
  query BookingProducts {
    bookingProducts {
      databaseId
      name
      slug
      price
      shortDescription
      bookingDuration
      bookingDurationUnit
      bookingCost
    }
  }
`;

// Pricing page query - fetches booking products with additional fields for pricing cards
export const PRICING_BOOKING_PRODUCTS_QUERY = `
  query PricingBookingProducts {
    bookingProducts(first: 20) {
      databaseId
      name
      slug
      price
      regularPrice
      shortDescription
      featured
      bookingDuration
      bookingDurationUnit
      bookingCost
    }
  }
`;

// Single Bookable Product Query
export const BOOKING_PRODUCT_QUERY = `
  query BookingProduct($id: Int!) {
    bookingProduct(id: $id) {
      databaseId
      name
      slug
      price
      shortDescription
      bookingDuration
      bookingDurationUnit
      bookingCost
    }
  }
`;

// Booking Availability Query
export const BOOKING_AVAILABILITY_QUERY = `
  query BookingAvailability($productId: Int!, $startDate: String!, $endDate: String!) {
    bookingAvailability(productId: $productId, startDate: $startDate, endDate: $endDate) {
      productId
      productName
      duration
      durationUnit
      dates {
        date
        available
        slots {
          time
          available
        }
      }
    }
  }
`;

// Types
export type BookingProduct = {
  databaseId: number;
  name: string;
  slug: string;
  price: string;
  shortDescription?: string;
  bookingDuration: number;
  bookingDurationUnit: "minute" | "hour" | "day" | "month";
  bookingCost: number;
};

export type PricingBookingProduct = BookingProduct & {
  regularPrice?: string;
  featured?: boolean;
};

export type BookingProductsResponse = {
  bookingProducts: BookingProduct[];
};

export type PricingBookingProductsResponse = {
  bookingProducts: PricingBookingProduct[];
};

export type BookingProductResponse = {
  bookingProduct: BookingProduct | null;
};

export type BookingSlot = {
  time: string;
  available: boolean;
};

export type BookingDateAvailability = {
  date: string;
  available: boolean;
  slots: BookingSlot[];
};

export type BookingAvailability = {
  productId: number;
  productName: string;
  duration: number;
  durationUnit: string;
  dates: BookingDateAvailability[];
};

export type BookingAvailabilityResponse = {
  bookingAvailability: BookingAvailability;
};

// Booking state stored in URL
export type BookingURLState = {
  serviceId?: string;
  date?: string; // YYYY-MM-DD
  time?: string; // HH:mm
};
