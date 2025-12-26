# Synthetic Franchise Data Generator

You are acting as a senior systems engineer and data-modeling expert.

Your task is to help design a deterministic, programmatic fake data generator for a WordPress headless franchise demo site.

This is not an import of real data. The data does not exist. We are intentionally creating synthetic (fake but realistic) data at scale for demo purposes.

## Core Requirements

- The system must be able to generate thousands of franchise locations
- Data must be plausible, consistent, and repeatable
- The output must be deterministic (seeded randomness)
- The generator must not rely on LLM creativity for the bulk data
- The generator must be suitable for WP-CLI-based ingestion

This is a procedural data generation problem, not an agent orchestration problem.

## Data Model Constraints

Assume the following WordPress structure:

**Custom Post Type: `location`**
- Name
- Address (street, city, state, zip)
- Latitude / longitude
- Phone number
- Hours of operation (structured, not free text)
- Location tier (e.g. flagship, standard, express)
- Relationships to staff

**Custom Post Type: `staff`** (preferred over users)
- First name / last name
- Role (e.g. chiropractor, mobility specialist, assistant)
- Short bio
- Assigned location(s)

**Storage:**
- Fields are stored via ACF
- Relationships use post relationships, not serialized blobs
- Media can be placeholders (no need to generate real images)

## Generation Strategy

Design a system that:

1. **Uses seeded pseudo-random generation**
   - Same seed → same dataset every run
   - Different seeds → different demo universes

2. **Uses constraint-based generation, not free-form text**
   - City-aware addresses
   - Realistic hours templates
   - Staff role distribution based on location tier
   - Bio templates with token substitution

3. **Outputs structured JSON suitable for bulk ingestion**

4. **Is scalable to 10,000+ locations without relying on HTTP requests or LLM calls**

## What to Produce

1. A high-level architecture of the generator
2. Suggested schemas for locations and staff (JSON shape)
3. A generation flow (step-by-step)
4. Recommendations for:
   - Seeding strategy
   - Reproducibility
   - Performance considerations
5. Optional: How this could later be augmented with AI after data exists

## Explicit Non-Goals

- Do NOT suggest MCP as the primary mechanism
- Do NOT suggest generating thousands of records via AI prompts
- Do NOT rely on REST calls for bulk creation
- Do NOT hand-wave realism ("just make it sound real")

This system should feel more like a game world generator than a content-writing tool.

Be precise. Be deterministic. Optimize for scale and repeatability.
