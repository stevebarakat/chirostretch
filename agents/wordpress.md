# WordPress Integration

## Custom Post Types

**MU-plugin:** Registers CPTs, defines slugs, rewrite rules, GraphQL exposure

**ACF:** Defines editorial fields only

**Rule:** If deleting ACF fields breaks production logic, the fields belong in PHP.

## ACF Field Rules

- Field names are API contracts
- Use `snake_case`
- Describe content, not layout
- No component or section names

**Good:** `headline`, `cta_label`, `metrics`

**Bad:** `hero_title`, `left_column_image`, `section_3_text`

If a field exists only to manage layout, it is a smell.

## Options Pages

Options pages store **global defaults only**.

- Brand-level values
- Shared CTAs
- Global toggles

Do NOT store page-specific content in options.

## Blocks (Headless Only)

All blocks must be **dynamic blocks**.

```
Editor → ACF → GraphQL → Next.js → React
```

Never:

```
Editor → HTML → parse → hope
```

Blocks are **data schemas**, not templates.

## Block Rendering Model

| Category | Source | Renderer |
|----------|--------|----------|
| Structured UI | attributes | React component |
| Prose | innerHTML | parseHtml |
| Unknown | innerHTML | dangerouslySetInnerHTML (fallback) |

**Rules:**
- Never parse HTML for layout
- Never trust block HTML for behavior
- If control is needed, create a real block

## Paragraph vs Stretchy

**Paragraph** = language (body copy, articles, inline semantics)

**Stretchy** = design (heroes, section headers, UI labels)

If it's part of the UI, it must be structured data.

## Block-First vs Schema-First

### Schema-First Pages
- Location pages, repeated operational layouts
- No page-level blocks
- Fixed structure, data only

### Block-First Pages
- Marketing, campaigns, contact/forms
- Approved blocks only
- Section-level composition

## ACF Instructions

Rules must live in **field instructions**.

Format: `Good: A • B • C | Bad: X • Y • Z`

No HTML. No editable guides. No message fields for documentation.

## Preview

- Route: `/api/preview`
- Supports drafts and revisions
