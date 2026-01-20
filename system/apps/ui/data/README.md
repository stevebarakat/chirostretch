# Data Directory

This directory contains seed data for local development and testing. The data is deterministic—running the generator with the same seed produces identical output.

## Directory Structure

```
data/
├── sources/           # Input templates and reference data (committed)
│   ├── us-cities.json
│   ├── street-components.json
│   ├── names.json
│   ├── hours-templates.json
│   ├── staff-configs.json
│   ├── bio-templates.json
│   ├── testimonial-templates.json
│   └── event-templates.json
│
└── generated/         # Output from seed generator (gitignored)
    ├── locations.json
    ├── staff.json
    ├── franchisees.json
    ├── testimonials.json
    └── events.json
```

### Sources

Static reference data used by the generator:

| File | Purpose |
|------|---------|
| `us-cities.json` | City data with population, coordinates, area codes |
| `street-components.json` | Prefixes, names, suffixes for generating addresses |
| `names.json` | First names (male/female) and last names |
| `hours-templates.json` | Standard, extended, and compact business hours |
| `staff-configs.json` | Credentials, job titles, specialties per staff type |
| `bio-templates.json` | Template strings for staff biographies |
| `testimonial-templates.json` | Template strings for customer reviews |
| `event-templates.json` | Event types with titles, categories, descriptions |

### Generated

Output files created by the seed generator. These are gitignored and should be regenerated locally.

## Running the Seed Generator

```bash
pnpm generate:demo
```

This generates 100 locations by default with all related data.

## CLI Arguments

| Argument | Default | Description |
|----------|---------|-------------|
| `--count=N` | 100 | Number of locations to generate |
| `--seed=STRING` | "demo-seed-42" | Seed string for deterministic output |
| `--offset=N` | 1000 | Starting ID offset (e.g., `loc_01000`) |
| `--append` | false | Add to existing data instead of replacing |
| `--reset` | false | Delete all generated files before generating |

### Examples

```bash
# Generate 50 locations
pnpm generate:demo --count=50

# Generate with a custom seed (reproducible)
pnpm generate:demo --seed=my-custom-seed

# Add 25 more locations to existing data
pnpm generate:demo --count=25 --append

# Start fresh with 200 locations
pnpm generate:demo --reset --count=200

# Just clear all generated data
pnpm generate:demo --reset --count=0
```

## Data Relationships

Locations are the root entity. All other data references locations via `_location_seed_id`.

```
Location (1)
├── Staff (3 per location)
├── Franchisee (1 per location)
├── Testimonials (2 per location)
└── Event (1 per location)
```

Each record has a `_seed_id` field (e.g., `loc_01000`, `staff_01000`) that serves as a stable identifier across regenerations with the same seed.

## Typical Workflows

### Initial Setup

Generate a baseline dataset for development:

```bash
pnpm generate:demo --count=100
```

### Incremental Growth

Need more data without losing existing records:

```bash
pnpm generate:demo --count=50 --append
```

The `--append` flag automatically:
- Calculates the next ID offset based on existing data
- Uses a batch-numbered seed (`demo-seed-batch-2`, etc.)
- Merges new records with existing ones

### Fresh Start

Clear everything and regenerate:

```bash
pnpm generate:demo --reset --count=100
```

### Reproducible Datasets

Use explicit seeds for reproducible test data:

```bash
pnpm generate:demo --seed=integration-test --count=10
```

Running this command always produces the exact same 10 locations with the same staff, testimonials, and events.

## Notes

- Phone numbers use the 555 exchange (fictional)
- Emails use the `@chirostretch.site` domain
- Staff passwords are all `"password"` (seed data only)
- City distribution is weighted by population
- Event dates are scheduled 14-180 days from generation date
