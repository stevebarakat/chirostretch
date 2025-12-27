export type EventCategory = {
  name: string;
  slug: string;
};

export type Event = {
  id?: string;
  databaseId?: number;
  slug?: string;
  title?: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  cost?: string | null;
  eventsCategories?: {
    nodes?: EventCategory[];
  } | null;
  venue?: {
    title?: string;
    address?: string;
    city?: string;
    state?: string;
    phone?: string;
  } | null;
  organizers?: {
    nodes?: {
      title?: string;
      phone?: string;
      email?: string;
    }[];
  } | null;
  featuredImage?: {
    node?: {
      id?: string;
      sourceUrl?: string;
      altText?: string;
      srcSet?: string;
      sizes?: string;
      mediaDetails?: {
        width?: number;
        height?: number;
      };
    };
  } | null;
};

