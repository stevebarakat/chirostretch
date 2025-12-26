#!/usr/bin/env npx ts-node

import * as fs from "fs";
import * as path from "path";
import { LocationGenerator } from "./generators/LocationGenerator.js";
import { StaffGenerator } from "./generators/StaffGenerator.js";
import { FranchiseeGenerator } from "./generators/FranchiseeGenerator.js";
import type {
  CityData,
  StreetComponents,
  NamesData,
  HoursTemplates,
  StaffConfigs,
} from "./types.js";

const DATA_DIR = path.join(__dirname, "../../data");
const SOURCES_DIR = path.join(DATA_DIR, "sources");
const OUTPUT_DIR = path.join(DATA_DIR, "generated");

function loadJson<T>(filename: string): T {
  const filepath = path.join(SOURCES_DIR, filename);
  return JSON.parse(fs.readFileSync(filepath, "utf-8"));
}

function formatStaffList(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  const allButLast = names.slice(0, -1).join(", ");
  return `${allButLast}, and ${names[names.length - 1]}`;
}

function parseArgs(): { count: number; seed: string; offset: number } {
  const args = process.argv.slice(2);
  let count = 100;
  let seed = "demo-seed-42";
  let offset = 1000;

  for (const arg of args) {
    if (arg.startsWith("--count=")) {
      count = parseInt(arg.split("=")[1], 10);
    } else if (arg.startsWith("--seed=")) {
      seed = arg.split("=")[1];
    } else if (arg.startsWith("--offset=")) {
      offset = parseInt(arg.split("=")[1], 10);
    }
  }

  return { count, seed, offset };
}

function main() {
  const { count, seed, offset } = parseArgs();

  console.log(`Generating ${count} locations with seed "${seed}" (offset: ${offset})`);

  // Load source data
  const cities = loadJson<CityData[]>("us-cities.json");
  const streetComponents = loadJson<StreetComponents>("street-components.json");
  const names = loadJson<NamesData>("names.json");
  const hoursTemplates = loadJson<HoursTemplates>("hours-templates.json");
  const staffConfigs = loadJson<StaffConfigs>("staff-configs.json");
  const bioTemplates = loadJson<string[]>("bio-templates.json");

  // Generate locations
  const locationGenerator = new LocationGenerator(
    seed,
    cities,
    streetComponents,
    hoursTemplates,
    offset
  );
  const locations = locationGenerator.generate(count);

  // Generate staff (3 per location)
  const staffGenerator = new StaffGenerator(
    seed + "-staff", // Different seed for staff variety
    names,
    staffConfigs,
    bioTemplates,
    offset
  );
  const staff = staffGenerator.generate(locations);

  // Generate franchisees (1 per location)
  const franchiseeGenerator = new FranchiseeGenerator(
    seed + "-franchisee",
    names,
    offset
  );
  const franchisees = franchiseeGenerator.generate(locations);

  // Post-process: Add staff names to location descriptions
  for (const location of locations) {
    const locationStaff = staff.filter(
      (s) => s._location_seed_id === location._seed_id
    );
    if (locationStaff.length > 0) {
      const staffNames = locationStaff.map((s) => s.name);
      const staffList = formatStaffList(staffNames);
      location.short_description = location.short_description.replace(
        /{staff}/g,
        staffList
      );
    }
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write output files
  const locationsPath = path.join(OUTPUT_DIR, "locations.json");
  const staffPath = path.join(OUTPUT_DIR, "staff.json");
  const franchiseesPath = path.join(OUTPUT_DIR, "franchisees.json");

  fs.writeFileSync(locationsPath, JSON.stringify(locations, null, 2));
  fs.writeFileSync(staffPath, JSON.stringify(staff, null, 2));
  fs.writeFileSync(franchiseesPath, JSON.stringify(franchisees, null, 2));

  console.log(`Generated ${locations.length} locations → ${locationsPath}`);
  console.log(`Generated ${staff.length} staff → ${staffPath}`);
  console.log(`Generated ${franchisees.length} franchisees → ${franchiseesPath}`);
  console.log("Done!");
}

main();
