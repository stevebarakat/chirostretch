# WordPress Integration

## Media

- Use WordPress `sourceUrl` directly—never normalize URLs
- Pass to `<Image>` without transformation
- Next.js handles WebP/AVIF conversion

## WooCommerce

- Backend data source only
- All rendering via Next.js
- Fetch via WPGraphQL for WooCommerce
- Never use PHP templates or theme hooks

## Custom Post Types

CPTs: `events`, `registrations`, `locations`, `staff`

**Separation of concerns:**

- **MU-plugin** = CPT registration (schema: slug, rewrite rules, GraphQL exposure)
- **ACF** = fields (editorial structure: content, images, toggles)

**The rule:** If deleting an ACF field group would break production logic, fields belong in PHP.

**Editorial CPTs (MU-plugin + ACF):**

- `locations`, `events`, `staff` — content evolves, fields iterate

**System CPTs (full MU-plugin, fields in PHP):**

- `registrations` — programmatic, tied to form logic
- Any sync artifacts, logs, or computed records

## ACF Field Naming

Field names are part of the **API contract**, not internal CMS details.

**Rules:**

- Use `snake_case`
- Describe **content**, not presentation
- Use nouns, not verbs
- No page names, layout names, or component names

**Good:** `headline`, `subheadline`, `cta_label`, `cta_url`, `metrics`

**Bad:** `hero_title`, `button_text`, `left_column_image`, `section_3_description`

**Repeaters** — only when the concept is intrinsically plural:

- Good: `metrics`, `benefits`, `testimonials`, `faq_items`
- Bad: `buttons`, `columns`, `rows`, `sections`

If a repeater exists to build layout, it's a smell.

**Enforcement rule:** Any new ACF field must answer: *"Is this content, or is this UI?"*
If the answer is UI, it belongs in Next.js.

## Custom Blocks

Blocks follow the same separation, with stricter stakes.

**Separation of concerns:**

- **MU-plugin** = block registration + `render_callback`
- **ACF** = block fields (editor-facing configuration)
- **Next.js** = React component mapped to block name

**The rule:** If misconfiguration breaks runtime behavior, fields belong in code. If it only affects presentation, use ACF.

**Critical headless requirement:** Blocks must be dynamic blocks.

```
Editor → ACF fields → GraphQL → Next.js → React component
```

Never:

```
Editor → serialized HTML → parse → pray
```

- Never query `innerHTML` — always query structured ACF data via GraphQL
- Blocks are data schemas, not templates

## Block Rendering Rules

The BlockRenderer follows a strict separation:

| Category | Blocks | Data Source | Renderer |
|----------|--------|-------------|----------|
| **Structured** | `core/image`, `core/columns`, `b-chart/chart`, `gravityforms/form` | `block.attributes` (JSON) | React component |
| **Rich text** | `core/paragraph`, `core/heading` | `block.innerHTML` | `parseHtml()` → React |
| **Fallback** | Unknown blocks | `block.innerHTML` | `dangerouslySetInnerHTML` |

**The rules:**

- Prose blocks (paragraph, heading) render from HTML via `parseHtml`
- UI blocks render from structured attributes
- Block HTML is never trusted as layout or behavior
- `dangerouslySetInnerHTML` is a fallback, not a pattern
- `parseHtml` converts links only — it is not an interpreter or mini-renderer

**If you need more control, the answer is: "That needs a real block."**

### Paragraph vs Stretchy (the key distinction)

| | Paragraph Block | Stretchy Block |
|---|---|---|
| **Purpose** | Prose / content | Controlled typography |
| **Storage** | HTML | Structured attributes |
| **Question it answers** | "What is being said?" | "How should this look?" |
| **Rendering** | HTML → parseHtml → React | JSON → React |
| **Ownership** | Author | Design system |

**Use Paragraph** for body copy, blog prose, inline links/emphasis — when semantics are purely textual.

**Use Stretchy** for hero titles, section headers, callouts, UI labels — when typography conveys meaning and consistency matters more than flexibility.

The test: *"Can I point at this and say it's part of the UI, not just words?"* → Stretchy.

**Paragraph blocks are for language. Stretchy blocks are for design.**

**Red flags (architectural regressions):**

- Parsing HTML from Columns or Groups
- Rendering `block.innerHTML` for known UI blocks
- Letting chart/form blocks output WordPress markup
- Adding styling logic to `parseHtml`

## Options Pages

Same pattern, one nuance.

**Separation of concerns:**

- **MU-plugin** = options page registration (slug, menu position, GraphQL exposure)
- **ACF** = fields on the options page

**The rule:** If code breaks when an option is missing or misconfigured, define it in PHP with sensible defaults.

## Preview

- Route: `/api/preview`
- Supports drafts and revisions
