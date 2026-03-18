import type { ICON_MAP } from "./SingleSessionCard";

type IconKey = keyof typeof ICON_MAP;

type PricingMeta = {
  icon?: IconKey;
  badge?: string;
  order?: number;
};

export const PRICING_META: Record<string, PricingMeta> = {
  "chiropractic-adjustment": { icon: "medical_services", order: 1 },
  "massage-60-min": { icon: "self_improvement", badge: "Most Popular", order: 2 },
  "chiro-stretch-combo": { icon: "dynamic_form", order: 3 },
  "injury-rehab": { icon: "rehab", order: 4 },
  "stretch-therapy": { icon: "accessibility_new", order: 5 },
  "massage-30-min": { icon: "wash", order: 6 },
};

export const INITIAL_CONSULTATION_SLUG = "initial-consultation";
