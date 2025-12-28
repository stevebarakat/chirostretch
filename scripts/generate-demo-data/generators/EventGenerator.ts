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

  private eventsPerDay: Map<string, number> = new Map();
  private maxEventsPerDay = 3;

  generate(
    locations: GeneratedLocation[],
    staff: GeneratedStaff[]
  ): GeneratedEvent[] {
    const events: GeneratedEvent[] = [];
    this.eventsPerDay.clear();

    for (let i = 0; i < locations.length; i++) {
      const location = locations[i];
      const locationStaff = staff.filter(
        (s) => s._location_seed_id === location._seed_id
      );

      // Pick a random event template for this location
      const template = this.rng.pick(this.templates);

      events.push(this.generateEvent(location, locationStaff, template, i));
    }

    return events;
  }

  private getDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  private findAvailableDate(): Date {
    const maxAttempts = 50;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const daysFromNow = this.rng.int(14, 180);
      const date = new Date(this.baseDate);
      date.setDate(date.getDate() + daysFromNow);

      const dateKey = this.getDateKey(date);
      const eventsOnDay = this.eventsPerDay.get(dateKey) || 0;

      if (eventsOnDay < this.maxEventsPerDay) {
        this.eventsPerDay.set(dateKey, eventsOnDay + 1);
        return date;
      }
    }

    // Fallback: extend the date range if we can't find an available slot
    const daysFromNow = this.rng.int(181, 270);
    const date = new Date(this.baseDate);
    date.setDate(date.getDate() + daysFromNow);
    const dateKey = this.getDateKey(date);
    this.eventsPerDay.set(dateKey, (this.eventsPerDay.get(dateKey) || 0) + 1);
    return date;
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

    // Find a date with less than 3 events already scheduled
    const startDate = this.findAvailableDate();

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
