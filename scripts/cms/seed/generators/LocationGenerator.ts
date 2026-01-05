import { SeededRandom } from "../utils/seeded-random.js";
import type {
  GeneratedLocation,
  CityData,
  StreetComponents,
  HoursTemplates,
} from "../types.js";

// Description templates with placeholders (including {staff} for team members)
const DESCRIPTION_TEMPLATES = [
  "Serving the {streetName} area of {city}, our team—led by {staff}—offers expert chiropractic care, stretch therapy, and personalized mobility programs.",
  "Located in the heart of {city}, our {streetName} clinic features {staff}, providing comprehensive chiropractic services and therapeutic stretching tailored to your needs.",
  "Your neighborhood wellness destination on {streetName} in {city}. Meet our practitioners: {staff}—specializing in chiropractic adjustments and assisted stretching.",
  "Welcome to ChiroStretch {city}! Our {streetName} team includes {staff}, combining chiropractic expertise with innovative stretch therapy.",
  "Discover relief at our {streetName} location in {city}. Our licensed practitioners—{staff}—deliver personalized chiropractic care for lasting results.",
  "The {city} community trusts {staff} at our {streetName} clinic for professional chiropractic services and holistic wellness programs.",
  "Conveniently located on {streetName} in {city}, {staff} offer a full range of chiropractic treatments, assisted stretching, and rehabilitation services.",
  "At our {streetName} studio in {city}, {staff} blend traditional chiropractic care with modern stretch therapy to optimize your movement and well-being.",
];

/* eslint-disable no-restricted-syntax */
// Utility class for data generation - not UI code
export class LocationGenerator {
  private rng: SeededRandom;
  private cities: CityData[];
  private streetComponents: StreetComponents;
  private hoursTemplates: HoursTemplates;
  private cityLocationCounts: Map<string, number> = new Map();
  private idOffset: number;

  constructor(
    seed: string,
    cities: CityData[],
    streetComponents: StreetComponents,
    hoursTemplates: HoursTemplates,
    /** Offset for seed IDs to avoid conflicts with existing data */
    idOffset: number = 1000
  ) {
    this.rng = new SeededRandom(seed);
    this.cities = cities;
    this.streetComponents = streetComponents;
    this.hoursTemplates = hoursTemplates;
    this.idOffset = idOffset;
  }

  generate(count: number): GeneratedLocation[] {
    const locations: GeneratedLocation[] = [];
    const cityDistribution = this.calculateCityDistribution(count);

    let locationIndex = 0;
    for (const [cityIndex, locationCount] of cityDistribution) {
      const city = this.cities[cityIndex];

      for (let i = 0; i < locationCount; i++) {
        locations.push(this.generateLocation(city, locationIndex));
        locationIndex++;
      }
    }

    return locations;
  }

  private calculateCityDistribution(
    totalLocations: number
  ): Map<number, number> {
    const distribution = new Map<number, number>();
    const totalPopulation = this.cities.reduce(
      (sum, city) => sum + city.population,
      0
    );

    let assigned = 0;
    for (let i = 0; i < this.cities.length && assigned < totalLocations; i++) {
      const city = this.cities[i];
      const weight = city.population / totalPopulation;
      let count = Math.max(1, Math.round(weight * totalLocations));

      if (assigned + count > totalLocations) {
        count = totalLocations - assigned;
      }

      if (count > 0) {
        distribution.set(i, count);
        assigned += count;
      }
    }

    // Distribute remaining locations to top cities
    while (assigned < totalLocations) {
      for (let i = 0; i < this.cities.length && assigned < totalLocations; i++) {
        const current = distribution.get(i) || 0;
        distribution.set(i, current + 1);
        assigned++;
      }
    }

    return distribution;
  }

  private generateLocation(
    city: CityData,
    index: number
  ): GeneratedLocation {
    const seedId = `loc_${String(this.idOffset + index).padStart(5, "0")}`;
    const cityKey = `${city.city}-${city.stateCode}`;

    // Track location count per city for email uniqueness
    const cityCount = this.cityLocationCounts.get(cityKey) || 0;
    this.cityLocationCounts.set(cityKey, cityCount + 1);

    // Generate street address first so we can use the street name in location name
    const { address, streetName } = this.generateStreetAddress();

    // Use street name as location identifier (e.g., "ChiroStretch New York: Oak Street")
    const name = `ChiroStretch ${city.city}: ${streetName}`;

    const phone = this.generatePhone(city.areaCode);
    const email = this.generateEmail(city.city, cityCount);
    const coordinates = this.generateCoordinates(city.lat, city.lng);
    const hours = this.generateHours();
    const description = this.generateDescription(city.city, streetName);

    return {
      _seed_id: seedId,
      name,
      street_address: address,
      city: city.city,
      state: city.state,
      zip: this.generateZip(city.zip),
      phone,
      email,
      short_description: description,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      hours,
      featured_image_slug: "chirostretch-default",
    };
  }

  private generateStreetAddress(): { address: string; streetName: string } {
    const number = this.rng.int(100, 9999);
    const usePrefix = this.rng.chance(0.3);
    const prefix = usePrefix
      ? this.rng.pick(this.streetComponents.prefixes) + " "
      : "";
    const name = this.rng.pick(this.streetComponents.names);
    const suffix = this.rng.pick(this.streetComponents.suffixes);

    const streetName = `${prefix}${name} ${suffix}`.trim();
    const address = `${number} ${streetName}`;

    return { address, streetName };
  }

  private generateDescription(city: string, streetName: string): string {
    const template = this.rng.pick(DESCRIPTION_TEMPLATES);
    return template
      .replace(/{city}/g, city)
      .replace(/{streetName}/g, streetName);
    // Note: {staff} placeholder is filled in post-processing after staff generation
  }

  private generatePhone(areaCode: string): string {
    // Using 555 exchange for fictional numbers
    const lastFour = this.rng.int(1000, 9999);
    return `(${areaCode}) 555-${String(lastFour).padStart(4, "0")}`;
  }

  private generateEmail(city: string, locationIndex: number): string {
    const citySlug = city.toLowerCase().replace(/\s+/g, "-");
    const suffix = locationIndex > 0 ? `-${String(locationIndex + 1).padStart(3, "0")}` : "";
    return `support.${citySlug}${suffix}@chirostretch.site`;
  }

  private generateZip(baseZip: string): string {
    // Add some variation to the last 2 digits
    const base = baseZip.substring(0, 3);
    const variation = this.rng.int(0, 99);
    return `${base}${String(variation).padStart(2, "0")}`;
  }

  private generateCoordinates(
    baseLat: number,
    baseLng: number
  ): { lat: number; lng: number } {
    // Spread locations within ~10km of city center
    const latOffset = this.rng.float(-0.08, 0.08);
    const lngOffset = this.rng.float(-0.08, 0.08);

    return {
      lat: Number((baseLat + latOffset).toFixed(6)),
      lng: Number((baseLng + lngOffset).toFixed(6)),
    };
  }

  private generateHours(): Array<{ day: string; open: string; close: string }> {
    const templateKeys = Object.keys(this.hoursTemplates) as Array<
      keyof HoursTemplates
    >;
    const weights = [0.6, 0.25, 0.15]; // standard, extended, compact

    const roll = this.rng.random();
    let cumulative = 0;
    let selectedKey = templateKeys[0];

    for (let i = 0; i < templateKeys.length; i++) {
      cumulative += weights[i];
      if (roll < cumulative) {
        selectedKey = templateKeys[i];
        break;
      }
    }

    return [...this.hoursTemplates[selectedKey]];
  }
}
