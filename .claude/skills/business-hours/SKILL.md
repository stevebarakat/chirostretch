---
name: business-hours
description: Use when working with location business hours. Covers ACF field design, seed scripts, React rendering, and the required compact display format.
---

## Scope

These rules apply to **location business hours**, not corporate hours.

Follow these rules when:
- Designing ACF fields for hours
- Generating WP-CLI seed scripts
- Writing React components that display hours
- Rendering hours in the UI

---

## Canonical Storage Model (Required)

Business hours must be stored as **normalized weekly intervals**, not formatted strings.

Each entry represents one day.

Required fields per day:
- `day` (enum: monday → sunday)
- `opens_at` (24h time, e.g. `09:00`)
- `closes_at` (24h time, e.g. `18:00`)
- `is_closed` (boolean)

**Do NOT store:**
- "Mon–Fri"
- "9–6"
- "Closed"
- Any preformatted display text

Hours are data, not copy.

---

## Rendering Model (Required)

Implement a compact hours renderer that outputs exactly this format:

```
Mon–Fri: 9am–6pm
Sat: 10am–2pm
Sun: Closed
```

### Formatting Rules (Strict)

- Group consecutive days with identical hours using an en dash (–)
- Use lowercase `am` / `pm`
- Remove `:00` when minutes are zero (`9am`, not `9:00am`)
- Use an en dash (–) between times: `9am–6pm`
- Use `Closed` (capital C) for closed days
- One line per grouped range

No other output formats are allowed.

---

## Example Input → Output

**Input (normalized data):**
- Mon–Fri: 09:00–18:00
- Sat: 10:00–14:00
- Sun: closed

**Output (required):**

```
Mon–Fri: 9am–6pm
Sat: 10am–2pm
Sun: Closed
```

---

## Accessibility Requirement

Even though the visual format is compact:
- Use semantic markup (`<time>`, `<dl>`, or equivalent)
- Ensure screen readers can read each day clearly
- Do NOT rely on visual punctuation alone

Accessibility is handled in React, not in the CMS.

---

## Explicit Non-Goals (Do NOT Implement)

- No verbose hour listings
- No prose ("Open from 9 to 6")
- No CMS-controlled formatting
- No editor-authored hour strings
- No holiday logic (future enhancement only)

If holiday or exception logic is required later, the storage model may be explicitly revised.

---

## Enforcement Rule

If Claude encounters formatted hour strings in the CMS, it must:
1. Flag this as a schema violation
2. Recommend normalization
3. Refuse to build display logic on top of unstructured data

---

## Summary (Mental Model)

- Store hours as data
- Render hours compactly
- Format is fixed
- UI decides presentation, CMS does not
