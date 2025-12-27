/* eslint-disable no-restricted-syntax */
// Utility class for data generation - not UI code
import { SeededRandom } from "../utils/seeded-random.js";
import type {
  GeneratedLocation,
  GeneratedStaff,
  GeneratedEvent,
  EventTemplate,
  EventCategory,
} from "../types.js";

export class EventGenerator {
  private rng: SeededRandom;
  private templates: EventTemplate[];
  private idOffset: number;
  private baseDate: Date;

  constructor(
    seed: string,
    templates: EventTemplate[],
    idOffset: number = 1000
  ) {
    this.rng = new SeededRandom(seed);
    this.templates = templates;
    this.idOffset = idOffset;
    // Base date is "today" for consistent generation
    this.baseDate = new Date();
    this.baseDate.setHours(0, 0, 0, 0);
  }

  generate(
    locations: GeneratedLocation[],
    staff: GeneratedStaff[]
  ): GeneratedEvent[] {
    const events: GeneratedEvent[] = [];

    for (let i = 0; i < locations.length; i++) {
      const location = locations[i];
      const locationStaff = staff.filter(
        (s) => s._location_seed_id === location._seed_id
      );

      // Pick a random event template for this location
      const template = this.rng.pick(this.templates);

      events.push(
        this.generateEvent(location, locationStaff, template, i)
      );
    }

    return events;
  }

  private generateEvent(
    location: GeneratedLocation,
    locationStaff: GeneratedStaff[],
    template: EventTemplate,
    index: number
  ): GeneratedEvent {
    const seedId = `event_${String(this.idOffset + index).padStart(5, "0")}`;

    // Pick a staff member to feature
    const staffMember = this.rng.pick(locationStaff);

    // Generate date 1-6 months in the future
    const daysFromNow = this.rng.int(14, 180);
    const startDate = new Date(this.baseDate);
    startDate.setDate(startDate.getDate() + daysFromNow);

    // Pick a time slot weighted toward evenings/weekends
    const timeSlot = this.pickTimeSlot(startDate);
    startDate.setHours(timeSlot.hour, 0, 0, 0);

    // Calculate end date based on duration
    const endDate = new Date(startDate);
    const durationMinutes = template.duration_hours * 60;
    endDate.setMinutes(endDate.getMinutes() + durationMinutes);

    // Build the location name (just city + street for readability)
    const streetName = location.street_address.split(" ").slice(1).join(" ");
    const locationName = `${location.city} ${streetName}`;

    // Fill in the description template
    const content = template.description
      .replace(/{location}/g, locationName)
      .replace(/{staff}/g, staffMember.name)
      .replace(/{city}/g, location.city);

    // Generate unique slug with date
    const dateStr = this.formatDateForSlug(startDate);
    const locationSlug = this.slugify(location.city);
    const slug = `${template.slug}-${locationSlug}-${dateStr}`;

    // Title with location
    const title = `${template.title} at ChiroStretch ${location.city}`;

    // Featured image slug matches template slug with "event-" prefix
    const featuredImageSlug = `event-${template.slug}`;

    return {
      _seed_id: seedId,
      _location_seed_id: location._seed_id,
      title,
      slug,
      content,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      cost: template.cost,
      category: template.category as EventCategory,
      featured_image_slug: featuredImageSlug,
      venue_name: `ChiroStretch ${location.city}`,
      venue_address: location.street_address,
      venue_city: location.city,
      venue_state: location.state,
      venue_zip: location.zip,
    };
  }

  private pickTimeSlot(date: Date): { hour: number } {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Weekend times: more daytime options
    const weekendSlots = [
      { hour: 9, weight: 20 },
      { hour: 10, weight: 25 },
      { hour: 11, weight: 20 },
      { hour: 14, weight: 20 },
      { hour: 15, weight: 15 },
    ];

    // Weekday times: evening weighted
    const weekdaySlots = [
      { hour: 12, weight: 10 },
      { hour: 17, weight: 25 },
      { hour: 18, weight: 30 },
      { hour: 19, weight: 25 },
      { hour: 20, weight: 10 },
    ];

    const slots = isWeekend ? weekendSlots : weekdaySlots;
    return this.rng.weightedPick(slots);
  }

  private formatDateForSlug(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}
