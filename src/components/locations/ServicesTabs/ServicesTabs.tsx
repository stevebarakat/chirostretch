import { fetchGraphQL } from "@/lib/graphql/client";
import {
  SERVICES_SETTINGS_QUERY,
  type ServicesSettingsResponse,
  type Service,
} from "@/lib/graphql/queries";
import { ServicesTabsClient } from "./ServicesTabsClient";

const fallbackServices: Service[] = [
  {
    tabLabel: "Chiropractic",
    tabIcon: "🦴",
    title: "Precision Spinal Adjustments",
    description:
      "Our licensed chiropractors use controlled, gentle force to realign joints, improving mobility and relieving pain. We focus on the spine to optimize nervous system function and body mechanics.",
    bulletPoints: [
      "Relief from back, neck, and joint pain",
      "Improved nervous system function",
      "Non-invasive & drug-free",
    ],
    infoBox:
      "Adjustments help improve nerve function, which boosts the body's immune response and overall wellness.",
    image: null,
  },
  {
    tabLabel: "Stretch Therapy",
    tabIcon: "🧘",
    title: "Assisted Stretch Therapy",
    description:
      "Don't just stretch—get stretched. Our therapists use PNF (Proprioceptive Neuromuscular Facilitation) techniques to safely push your muscles further than you can on your own.",
    bulletPoints: [
      "Increase flexibility & range of motion",
      "Reduce muscle stiffness & tension",
      "Enhance athletic performance",
    ],
    infoBox:
      "Regular stretching combined with chiropractic care extends the positive effects of your treatment.",
    image: null,
  },
  {
    tabLabel: "Massage",
    tabIcon: "💆",
    title: "Therapeutic Massage",
    description:
      "Our massage therapists work to reduce muscle tension, improve circulation, and complement your chiropractic treatment plan with targeted soft tissue work.",
    bulletPoints: [
      "Reduce muscle tension & pain",
      "Improve blood circulation",
      "Accelerate recovery from injuries",
    ],
    infoBox:
      "Massage therapy before adjustments can help relax tight muscles, making chiropractic care more effective.",
    image: null,
  },
];

export async function ServicesTabs() {
  let services: Service[] = fallbackServices;

  try {
    const data = await fetchGraphQL<ServicesSettingsResponse>(
      SERVICES_SETTINGS_QUERY
    );
    if (data.chiroServicesSettings?.services?.length) {
      services = data.chiroServicesSettings.services;
    }
  } catch (error) {
    console.error("Failed to fetch services settings:", error);
  }

  return <ServicesTabsClient services={services} />;
}
