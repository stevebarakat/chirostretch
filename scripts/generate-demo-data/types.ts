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
