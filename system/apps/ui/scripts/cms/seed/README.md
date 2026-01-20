# Seed Generator

Deterministic data generator for creating realistic development/test data. Located at `scripts/cms/seed/`.

## Architecture

```
scripts/cms/seed/
├── index.ts                 # CLI entry point and orchestration
├── types.ts                 # TypeScript type definitions
├── utils/
│   └── seeded-random.ts     # Deterministic random number generator
└── generators/
    ├── LocationGenerator.ts
    ├── StaffGenerator.ts
    ├── FranchiseeGenerator.ts
    ├── TestimonialGenerator.ts
    └── EventGenerator.ts
```

## Generator Classes

Each generator follows the same pattern:

1. Accepts a seed string in the constructor
2. Creates a `SeededRandom` instance for deterministic randomness
3. Exposes a `generate()` method that produces an array of records

### LocationGenerator

**Input:** Cities, street components, hours templates
**Output:** `GeneratedLocation[]`

- Distributes locations across cities weighted by population
- Generates unique street addresses, phone numbers, coordinates
- Assigns business hours from templates (60% standard, 25% extended, 15% compact)
- Creates description templates with `{staff}` placeholder

### StaffGenerator

**Input:** Locations, names, staff configs, bio templates
**Output:** `GeneratedStaff[]`

- Creates 3 staff per location
- Each location gets one of two staff type combinations:
  - Chiropractor + Physical Therapist + Massage Therapist
  - Chiropractor + Physical Therapist + Athletic Therapist
- Gender matches stock photo assignments (chiropractor/athletic = male, PT/massage = female)
- Generates bios from templates with placeholder substitution

### FranchiseeGenerator

**Input:** Locations, names
**Output:** `GeneratedFranchisee[]`

- Creates 1 franchisee per location
- Generates name and email based on location ID

### TestimonialGenerator

**Input:** Locations, staff, names, templates, staff configs
**Output:** `GeneratedTestimonial[]`

- Creates 2 testimonials per location
- References a random staff member from that location
- Ratings are weighted: 70% 5-star, 25% 4-star, 5% 3-star

### EventGenerator

**Input:** Locations, staff, event templates
**Output:** `GeneratedEvent[]`

- Creates 1 event per location
- Schedules events 14-180 days from generation date
- Limits to 3 events per calendar day
- Time slots weighted toward evenings (weekdays) and mornings (weekends)

## Type Definitions

Key types from `types.ts`:

```typescript
// Output types (what generators produce)
type GeneratedLocation = {
  _seed_id: string;           // "loc_01000"
  name: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  short_description: string;
  latitude: number;
  longitude: number;
  hours: Array<{ day: string; open: string; close: string }>;
  featured_image_slug: string;
};

type StaffType = "chiropractor" | "physical_therapist" | "massage_therapist" | "athletic_therapist";

type GeneratedStaff = {
  _seed_id: string;           // "staff_01000"
  _location_seed_id: string;  // Links to location
  name: string;
  email: string;
  password: string;
  staff_type: StaffType;
  job_title: string;
  credentials: string;
  specialties: string[];
  bio: string;
  services_offered: string[];
  headshot_slug: string;
  is_public: boolean;
  accepting_patients: boolean;
};

type GeneratedFranchisee = {
  _seed_id: string;
  _location_seed_id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  password: string;
};

type GeneratedTestimonial = {
  _seed_id: string;
  _location_seed_id: string;
  customer_name: string;
  rating: number;
  review_text: string;
};

type GeneratedEvent = {
  _seed_id: string;
  _location_seed_id: string;
  title: string;
  slug: string;
  content: string;
  start_date: string;         // ISO timestamp
  end_date: string;
  cost: string;
  category: EventCategory;
  featured_image_slug: string;
  venue_name: string;
  venue_address: string;
  venue_city: string;
  venue_state: string;
  venue_zip: string;
};
```

## Deterministic Seeding

The `SeededRandom` class wraps `seedrandom` to provide reproducible random values:

```typescript
const rng = new SeededRandom("my-seed");

rng.random();           // Float 0-1
rng.int(1, 10);         // Integer in range (inclusive)
rng.float(0, 100);      // Float in range
rng.pick(array);        // Random element
rng.pickN(array, 3);    // N unique random elements
rng.chance(0.5);        // Boolean with probability
rng.shuffle(array);     // Shuffled copy
rng.weightedPick(items); // Weighted selection (items need .weight)
```

Each generator uses a derived seed to ensure variety:
- Locations: base seed
- Staff: `${seed}-staff`
- Franchisees: `${seed}-franchisee`
- Testimonials: `${seed}-testimonial`
- Events: `${seed}-event`

## ID Offsets

All generators accept an `idOffset` parameter to avoid ID collisions when appending data:

```typescript
// First batch: loc_01000, loc_01001, ...
const gen1 = new LocationGenerator(seed, ..., 1000);

// Second batch: loc_02000, loc_02001, ...
const gen2 = new LocationGenerator(seed, ..., 2000);
```

The CLI's `--append` flag calculates the next offset automatically by finding the highest existing ID and rounding up to the next thousand.

## Extending the System

### Adding a New Generator

1. Create `generators/MyGenerator.ts`:

```typescript
import { SeededRandom } from "../utils/seeded-random.js";
import type { GeneratedLocation } from "../types.js";

export class MyGenerator {
  private rng: SeededRandom;
  private idOffset: number;

  constructor(seed: string, idOffset: number = 1000) {
    this.rng = new SeededRandom(seed);
    this.idOffset = idOffset;
  }

  generate(locations: GeneratedLocation[]): MyType[] {
    return locations.map((loc, i) => ({
      _seed_id: `my_${String(this.idOffset + i).padStart(5, "0")}`,
      _location_seed_id: loc._seed_id,
      // ... other fields
    }));
  }
}
```

2. Add types to `types.ts`

3. Import and use in `index.ts`:
   - Instantiate the generator
   - Call `generate()` after locations exist
   - Handle append mode with `loadExistingData()`
   - Write output file

### Adding New Source Data

1. Create the JSON file in `data/sources/`
2. Add a type definition in `types.ts`
3. Load it in `index.ts` with `loadJson<YourType>("filename.json")`
4. Pass it to the relevant generator

### Modifying Template Placeholders

Templates use `{placeholder}` syntax. Available placeholders vary by template type:

**Location descriptions:**
- `{city}`, `{streetName}`, `{staff}`

**Staff bios:**
- `{name}`, `{specialty}`, `{years}`, `{role}`, `{focus}`
- `{pronoun_subject}`, `{pronoun_object}`, `{pronoun_possessive}`

**Testimonials:**
- `{city}`, `{staff}`, `{service}`
- `{pronoun_subject}`, `{pronoun_object}`, `{pronoun_possessive}`

**Events:**
- `{location}`, `{staff}`, `{city}`
