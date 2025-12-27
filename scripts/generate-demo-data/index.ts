#!/usr/bin/env npx ts-node

import * as fs from "fs";
import * as path from "path";
import { LocationGenerator } from "./generators/LocationGenerator.js";
import { StaffGenerator } from "./generators/StaffGenerator.js";
import { FranchiseeGenerator } from "./generators/FranchiseeGenerator.js";
import { TestimonialGenerator } from "./generators/TestimonialGenerator.js";
import { EventGenerator } from "./generators/EventGenerator.js";
import type {
  CityData,
  StreetComponents,
  NamesData,
  HoursTemplates,
  StaffConfigs,
  EventTemplate,
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

type ParsedArgs = {
  count: number;
  seed: string;
  offset: number;
  append: boolean;
  reset: boolean;
};

function getNextOffsetFromExisting(): { offset: number; batchNum: number } {
  const locationsPath = path.join(OUTPUT_DIR, "locations.json");

  if (!fs.existsSync(locationsPath)) {
    return { offset: 1000, batchNum: 1 };
  }

  try {
    const existing = JSON.parse(fs.readFileSync(locationsPath, "utf-8"));
    if (!Array.isArray(existing) || existing.length === 0) {
      return { offset: 1000, batchNum: 1 };
    }

    // Find highest seed ID number
    let maxId = 0;
    for (const loc of existing) {
      const match = loc._seed_id?.match(/loc_(\d+)/);
      if (match) {
        maxId = Math.max(maxId, parseInt(match[1], 10));
      }
    }

    // Next offset starts after highest ID, rounded up to next 1000
    const nextOffset = Math.ceil((maxId + 1) / 1000) * 1000;
    const batchNum = Math.floor(nextOffset / 1000);

    return { offset: nextOffset, batchNum };
  } catch {
    return { offset: 1000, batchNum: 1 };
  }
}

function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2);
  let count = 100;
  let seed = "demo-seed-42";
  let offset = 1000;
  let append = false;
  let reset = false;

  for (const arg of args) {
    if (arg.startsWith("--count=")) {
      count = parseInt(arg.split("=")[1], 10);
    } else if (arg.startsWith("--seed=")) {
      seed = arg.split("=")[1];
    } else if (arg.startsWith("--offset=")) {
      offset = parseInt(arg.split("=")[1], 10);
    } else if (arg === "--append") {
      append = true;
    } else if (arg === "--reset") {
      reset = true;
    }
  }

  // In append mode, auto-calculate offset and seed
  if (append) {
    const { offset: nextOffset, batchNum } = getNextOffsetFromExisting();
    offset = nextOffset;
    seed = `demo-seed-batch-${batchNum}`;
  }

  return { count, seed, offset, append, reset };
}

function loadExistingData<T>(filename: string): T[] {
  const filepath = path.join(OUTPUT_DIR, filename);
  if (!fs.existsSync(filepath)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(filepath, "utf-8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function main() {
  const { count, seed, offset, append, reset } = parseArgs();

  // Handle reset
  if (reset) {
    const files = ["locations.json", "staff.json", "franchisees.json", "testimonials.json", "events.json"];
    for (const file of files) {
      const filepath = path.join(OUTPUT_DIR, file);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }
    console.log("Reset: Cleared all generated data");
    if (count === 0) return;
  }

  const mode = append ? "Appending" : "Generating";
  console.log(`${mode} ${count} locations with seed "${seed}" (offset: ${offset})`);

  // Load source data
  const cities = loadJson<CityData[]>("us-cities.json");
  const streetComponents = loadJson<StreetComponents>("street-components.json");
  const names = loadJson<NamesData>("names.json");
  const hoursTemplates = loadJson<HoursTemplates>("hours-templates.json");
  const staffConfigs = loadJson<StaffConfigs>("staff-configs.json");
  const bioTemplates = loadJson<string[]>("bio-templates.json");
  const testimonialTemplates = loadJson<string[]>("testimonial-templates.json");
  const eventTemplates = loadJson<EventTemplate[]>("event-templates.json");

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

  // Generate testimonials (2 per location)
  const testimonialGenerator = new TestimonialGenerator(
    seed + "-testimonial",
    names,
    testimonialTemplates,
    staffConfigs,
    offset
  );
  const testimonials = testimonialGenerator.generate(locations, staff);

  // Generate events (1 per location)
  const eventGenerator = new EventGenerator(
    seed + "-event",
    eventTemplates,
    offset
  );
  const events = eventGenerator.generate(locations, staff);

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
  const testimonialsPath = path.join(OUTPUT_DIR, "testimonials.json");
  const eventsPath = path.join(OUTPUT_DIR, "events.json");

  // In append mode, merge with existing data
  let finalLocations = locations;
  let finalStaff = staff;
  let finalFranchisees = franchisees;
  let finalTestimonials = testimonials;
  let finalEvents = events;

  if (append) {
    const existingLocations = loadExistingData<typeof locations[0]>("locations.json");
    const existingStaff = loadExistingData<typeof staff[0]>("staff.json");
    const existingFranchisees = loadExistingData<typeof franchisees[0]>("franchisees.json");
    const existingTestimonials = loadExistingData<typeof testimonials[0]>("testimonials.json");
    const existingEvents = loadExistingData<typeof events[0]>("events.json");

    finalLocations = [...existingLocations, ...locations];
    finalStaff = [...existingStaff, ...staff];
    finalFranchisees = [...existingFranchisees, ...franchisees];
    finalTestimonials = [...existingTestimonials, ...testimonials];
    finalEvents = [...existingEvents, ...events];

    console.log(`Existing: ${existingLocations.length} locations, ${existingStaff.length} staff, ${existingFranchisees.length} franchisees, ${existingTestimonials.length} testimonials, ${existingEvents.length} events`);
  }

  fs.writeFileSync(locationsPath, JSON.stringify(finalLocations, null, 2));
  fs.writeFileSync(staffPath, JSON.stringify(finalStaff, null, 2));
  fs.writeFileSync(franchiseesPath, JSON.stringify(finalFranchisees, null, 2));
  fs.writeFileSync(testimonialsPath, JSON.stringify(finalTestimonials, null, 2));
  fs.writeFileSync(eventsPath, JSON.stringify(finalEvents, null, 2));

  const verb = append ? "Total" : "Generated";
  console.log(`${verb}: ${finalLocations.length} locations → ${locationsPath}`);
  console.log(`${verb}: ${finalStaff.length} staff → ${staffPath}`);
  console.log(`${verb}: ${finalFranchisees.length} franchisees → ${franchiseesPath}`);
  console.log(`${verb}: ${finalTestimonials.length} testimonials → ${testimonialsPath}`);
  console.log(`${verb}: ${finalEvents.length} events → ${eventsPath}`);
  console.log("Done!");
}

main();
