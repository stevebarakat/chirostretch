import { SeededRandom } from "../utils/seeded-random.js";
import type {
  GeneratedLocation,
  GeneratedStaff,
  GeneratedTestimonial,
  NamesData,
  StaffConfigs,
} from "../types.js";

const TESTIMONIALS_PER_LOCATION = 2;

/* eslint-disable no-restricted-syntax */
// Utility class for data generation - not UI code
export class TestimonialGenerator {
  private rng: SeededRandom;
  private names: NamesData;
  private templates: string[];
  private staffConfigs: StaffConfigs;
  private idOffset: number;

  constructor(
    seed: string,
    names: NamesData,
    templates: string[],
    staffConfigs: StaffConfigs,
    idOffset: number = 1000
  ) {
    this.rng = new SeededRandom(seed);
    this.names = names;
    this.templates = templates;
    this.staffConfigs = staffConfigs;
    this.idOffset = idOffset;
  }

  generate(
    locations: GeneratedLocation[],
    staff: GeneratedStaff[]
  ): GeneratedTestimonial[] {
    const testimonials: GeneratedTestimonial[] = [];
    let testimonialIndex = 0;

    for (const location of locations) {
      const locationStaff = staff.filter(
        (s) => s._location_seed_id === location._seed_id
      );

      for (let i = 0; i < TESTIMONIALS_PER_LOCATION; i++) {
        testimonials.push(
          this.generateTestimonial(location, locationStaff, testimonialIndex)
        );
        testimonialIndex++;
      }
    }

    return testimonials;
  }

  private generateTestimonial(
    location: GeneratedLocation,
    locationStaff: GeneratedStaff[],
    index: number
  ): GeneratedTestimonial {
    const seedId = `testimonial_${String(this.idOffset + index).padStart(5, "0")}`;

    const gender = this.rng.pick(["male", "female"] as const);
    const firstName = this.rng.pick(this.names.firstNames[gender]);
    const lastName = this.rng.pick(this.names.lastNames);
    const customerName = `${firstName} ${lastName.charAt(0)}.`;

    const ratingOptions = [
      { value: 5, weight: 70 },
      { value: 4, weight: 25 },
      { value: 3, weight: 5 },
    ];
    const rating = this.rng.weightedPick(ratingOptions).value;

    const staffMember = this.rng.pick(locationStaff);
    const service = this.staffConfigs[staffMember.staff_type].service;

    const staffGender = this.getStaffGender(staffMember.staff_type);
    const pronouns = {
      male: { subject: "he", object: "him", possessive: "his" },
      female: { subject: "she", object: "her", possessive: "her" },
    };

    const template = this.rng.pick(this.templates);
    const reviewText = template
      .replace(/{city}/g, location.city)
      .replace(/{staff}/g, staffMember.name)
      .replace(/{service}/g, service.toLowerCase())
      .replace(/{pronoun_subject}/g, pronouns[staffGender].subject)
      .replace(/{pronoun_object}/g, pronouns[staffGender].object)
      .replace(/{pronoun_possessive}/g, pronouns[staffGender].possessive);

    return {
      _seed_id: seedId,
      _location_seed_id: location._seed_id,
      customer_name: customerName,
      rating,
      review_text: reviewText,
    };
  }

  private getStaffGender(
    staffType: GeneratedStaff["staff_type"]
  ): "male" | "female" {
    const genderByType: Record<GeneratedStaff["staff_type"], "male" | "female"> =
      {
        chiropractor: "male",
        athletic_therapist: "male",
        physical_therapist: "female",
        massage_therapist: "female",
      };
    return genderByType[staffType];
  }
}
