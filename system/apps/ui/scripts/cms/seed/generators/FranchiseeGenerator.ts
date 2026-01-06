/* eslint-disable no-restricted-syntax */
// Utility class for data generation - not UI code
import { SeededRandom } from "../utils/seeded-random.js";
import type { GeneratedLocation, GeneratedFranchisee, NamesData } from "../types.js";

export class FranchiseeGenerator {
  private rng: SeededRandom;
  private names: NamesData;
  private idOffset: number;

  constructor(
    seed: string,
    names: NamesData,
    /** Offset for seed IDs to avoid conflicts with existing data */
    idOffset: number = 1000
  ) {
    this.rng = new SeededRandom(seed);
    this.names = names;
    this.idOffset = idOffset;
  }

  generate(locations: GeneratedLocation[]): GeneratedFranchisee[] {
    return locations.map((location, index) =>
      this.generateFranchisee(location, index)
    );
  }

  private generateFranchisee(
    location: GeneratedLocation,
    index: number
  ): GeneratedFranchisee {
    const seedId = `franchisee_${String(this.idOffset + index).padStart(5, "0")}`;

    const gender = this.rng.chance(0.5) ? "male" : "female";
    const firstName = this.rng.pick(this.names.firstNames[gender]);
    const lastName = this.rng.pick(this.names.lastNames);
    const displayName = `${firstName} ${lastName}`;

    // Generate unique email based on location seed to ensure consistency
    const emailSlug = location._seed_id.replace("loc_", "");
    const email = `franchisee-${emailSlug}@chirostretch.site`;

    return {
      _seed_id: seedId,
      _location_seed_id: location._seed_id,
      email,
      first_name: firstName,
      last_name: lastName,
      display_name: displayName,
      password: "password",
    };
  }
}
