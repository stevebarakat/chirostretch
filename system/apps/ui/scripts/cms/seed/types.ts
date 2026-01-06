export type GeneratedLocation = {
  _seed_id: string;
  name: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  short_description: string;
  latitude: number;
  longitude: number;
  hours: Array<{ day: string; open: string; close: string }>;
  featured_image_slug: string;
};

export type StaffType =
  | "chiropractor"
  | "physical_therapist"
  | "massage_therapist"
  | "athletic_therapist";

export type GeneratedStaff = {
  _seed_id: string;
  _location_seed_id: string;
  name: string;
  email: string;
  password: string;
  staff_type: StaffType;
  job_title: string;
  credentials: string;
  specialties: string[];
  bio: string;
  services_offered: string[];
  headshot_slug: string; // Matches media library slug (e.g., "chiropractor", "physical-therapist")
  is_public: boolean;
  accepting_patients: boolean;
};

export type CityData = {
  city: string;
  state: string;
  stateCode: string;
  population: number;
  lat: number;
  lng: number;
  areaCode: string;
  zip: string;
};

export type StreetComponents = {
  prefixes: string[];
  names: string[];
  suffixes: string[];
};

export type NamesData = {
  firstNames: {
    male: string[];
    female: string[];
  };
  lastNames: string[];
};

export type HoursTemplate = Array<{ day: string; open: string; close: string }>;

export type HoursTemplates = {
  standard: HoursTemplate;
  extended: HoursTemplate;
  compact: HoursTemplate;
};

export type StaffConfig = {
  credentials: string[];
  jobTitles: string[];
  service: string;
  specialties: string[];
  prefix: string;
};

export type StaffConfigs = Record<StaffType, StaffConfig>;

export type GeneratedFranchisee = {
  _seed_id: string;
  _location_seed_id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  password: string;
};

export type GeneratedTestimonial = {
  _seed_id: string;
  _location_seed_id: string;
  customer_name: string;
  rating: number;
  review_text: string;
};

export type EventCategory =
  | "athletic-recovery"
  | "back-pain-relief"
  | "certification-workshop"
  | "chiropractic-education"
  | "community-event"
  | "corporate-wellness"
  | "flexibility-clinic"
  | "mobility-workshop"
  | "posture-alignment"
  | "spine-health"
  | "stretch-training"
  | "webinar";

export type EventTemplate = {
  slug: string;
  title: string;
  category: EventCategory;
  duration_hours: number;
  cost: string;
  description: string;
};

export type GeneratedEvent = {
  _seed_id: string;
  _location_seed_id: string;
  title: string;
  slug: string;
  content: string;
  start_date: string;
  end_date: string;
  cost: string;
  category: EventCategory;
  featured_image_slug: string;
  venue_name: string;
  venue_address: string;
  venue_city: string;
  venue_state: string;
  venue_zip: string;
};
