import { SeededRandom } from "../utils/seeded-random.js";
import type {
  GeneratedLocation,
  GeneratedStaff,
  StaffType,
  NamesData,
  StaffConfigs,
} from "../types.js";

const STAFF_TYPES_PER_LOCATION: StaffType[][] = [
  ["chiropractor", "physical_therapist", "massage_therapist"],
  ["chiropractor", "physical_therapist", "athletic_therapist"],
];

export class StaffGenerator {
  private rng: SeededRandom;
  private names: NamesData;
  private staffConfigs: StaffConfigs;
  private bioTemplates: string[];
  private idOffset: number;

  constructor(
    seed: string,
    names: NamesData,
    staffConfigs: StaffConfigs,
    bioTemplates: string[],
    /** Offset for seed IDs to avoid conflicts with existing data */
    idOffset: number = 1000
  ) {
    this.rng = new SeededRandom(seed);
    this.names = names;
    this.staffConfigs = staffConfigs;
    this.bioTemplates = bioTemplates;
    this.idOffset = idOffset;
  }

  generate(locations: GeneratedLocation[]): GeneratedStaff[] {
    const staff: GeneratedStaff[] = [];
    let staffIndex = 0;

    for (const location of locations) {
      // Pick which staff type combination for this location
      const staffTypes = this.rng.pick(STAFF_TYPES_PER_LOCATION);

      for (const staffType of staffTypes) {
        staff.push(this.generateStaff(location, staffType, staffIndex));
        staffIndex++;
      }
    }

    return staff;
  }

  private generateStaff(
    location: GeneratedLocation,
    staffType: StaffType,
    index: number
  ): GeneratedStaff {
    const seedId = `staff_${String(this.idOffset + index).padStart(5, "0")}`;
    const config = this.staffConfigs[staffType];

    // Gender matches the stock photos in media library
    const genderByType: Record<StaffType, "male" | "female"> = {
      chiropractor: "male",
      athletic_therapist: "male",
      physical_therapist: "female",
      massage_therapist: "female",
    };
    const gender = genderByType[staffType];
    const firstName = this.rng.pick(this.names.firstNames[gender]);
    const lastName = this.rng.pick(this.names.lastNames);
    const prefix = config.prefix;
    const fullName = prefix
      ? `${prefix} ${firstName} ${lastName}`
      : `${firstName} ${lastName}`;

    const credentials = this.rng.pick(config.credentials);
    const jobTitle = this.rng.pick(config.jobTitles);
    const specialties = this.rng.pickN(config.specialties, this.rng.int(2, 3));
    const yearsExperience = this.rng.int(3, 25);
    const bio = this.generateBio(
      fullName,
      staffType,
      config.service,
      specialties,
      yearsExperience,
      gender
    );

    // Map staff type to image slug in media library
    const headshotSlugs: Record<StaffType, string> = {
      chiropractor: "chiropractor",
      physical_therapist: "physical-therapist",
      massage_therapist: "massage-therapist",
      athletic_therapist: "sports-medicine",
    };

    // Generate unique email based on seed ID
    const emailSlug = seedId.replace("staff_", "");
    const email = `staff-${emailSlug}@chirostretch.site`;

    return {
      _seed_id: seedId,
      _location_seed_id: location._seed_id,
      name: fullName,
      email,
      password: "password",
      staff_type: staffType,
      job_title: jobTitle,
      credentials,
      specialties,
      bio,
      services_offered: [config.service],
      headshot_slug: headshotSlugs[staffType], // Matches media library slug
      is_public: true,
      accepting_patients: this.rng.chance(0.9), // 90% accepting
    };
  }

  private generateBio(
    name: string,
    staffType: StaffType,
    service: string,
    specialties: string[],
    years: number,
    gender: "male" | "female"
  ): string {
    const template = this.rng.pick(this.bioTemplates);

    const pronouns = {
      male: { subject: "He", object: "him", possessive: "His" },
      female: { subject: "She", object: "her", possessive: "Her" },
    };

    const roleNames: Record<StaffType, string> = {
      chiropractor: "chiropractor",
      physical_therapist: "physical therapist",
      massage_therapist: "massage therapist",
      athletic_therapist: "athletic therapist",
    };

    const specialtyLabels: Record<string, string> = {
      sports_injuries: "sports injuries",
      back_pain: "back pain",
      neck_pain: "neck pain",
      headaches: "headache relief",
      posture_correction: "posture correction",
      wellness: "wellness care",
      pediatric: "pediatric care",
      prenatal: "prenatal care",
      flexibility: "flexibility training",
      rehab: "rehabilitation",
      mobility: "mobility improvement",
      balance: "balance training",
      strength: "strength building",
      deep_tissue: "deep tissue massage",
      swedish: "Swedish massage",
      trigger_point: "trigger point therapy",
      myofascial: "myofascial release",
      sports_massage: "sports massage",
      relaxation: "relaxation therapy",
      performance: "performance optimization",
      injury_prevention: "injury prevention",
    };

    const focusAreas = specialties
      .map((s) => specialtyLabels[s] || s.replace(/_/g, " "))
      .slice(0, 2)
      .join(" and ");

    return template
      .replace(/{name}/g, name)
      .replace(/{specialty}/g, service.toLowerCase())
      .replace(/{years}/g, String(years))
      .replace(/{role}/g, roleNames[staffType])
      .replace(/{focus}/g, focusAreas)
      .replace(/{pronoun_subject}/g, pronouns[gender].subject)
      .replace(/{pronoun_object}/g, pronouns[gender].object)
      .replace(/{pronoun_possessive}/g, pronouns[gender].possessive);
  }
}
