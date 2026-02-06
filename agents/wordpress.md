<!-- Scope: WordPress blocks, ACF fields, CPTs, and mu-plugin patterns. Do not merge content from other agent docs. -->
# WordPress Block (Headless)

## Task: Build a New Block

- Create a dynamic block using ACF PHP registration.
- Define block fields in `acf-json/`.
- Expose block data via GraphQL.
- Render block in Next.js React components.

## Block Guidelines

- Use snake_case for field names.
- Fields represent content, not layout.
- Blocks are data schemas, not templates.
- No hardcoded HTML parsing in React; use structured data.

## Rendering Model

| Category      | Source     | Renderer                           |
| ------------- | ---------- | ---------------------------------- |
| Structured UI | attributes | React component                    |
| Prose         | innerHTML  | parseHtml                          |
| Unknown       | innerHTML  | dangerouslySetInnerHTML (fallback) |

## Example Workflow

1. Register block in PHP MU-plugin.
2. Define fields in ACF JSON.
3. Commit JSON to git.
4. Query block data via GraphQL.
5. Render block in Next.js.

## Preview Support

- Use `/api/preview` route.
- Supports drafts and revisions.

## MU-Plugin Pattern

- Place block registration in mu-plugin.
- Follow naming conventions.
- Document in `mu-plugins/README.md`.

# WordPress Integration

For comprehensive WordPress Admin structure, ACF naming conventions, and route mapping, see
`docs/wordpress-admin-structure.md`.

---

## Custom Post Types

**MU-plugin**

- Registers CPTs
- Defines slugs and rewrite rules
- Controls GraphQL exposure

**ACF**

- Defines editorial fields only

**Rule**

> If deleting ACF fields breaks production logic, the fields belong in PHP.

---

## ACF Field Rules

- Field names are **API contracts**
- Use `snake_case`
- Describe **content**, not layout
- No component or section names

**Good**

- `headline`
- `cta_label`
- `metrics`

**Bad**

- `hero_title`
- `left_column_image`
- `section_3_text`

If a field exists only to manage layout, it is a smell.

### Naming Scope

- **Post meta / options fields:** no component or layout names
- **Block attributes:** component-style naming is acceptable (block = namespace)

---

## Options Pages

Options pages store **global defaults only**.

Allowed:

- Brand-level values
- Shared CTAs
- Global toggles

Not allowed:

- Page-specific content
- Per-location overrides

---

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

---

## Block Rendering Model

| Category      | Source     | Renderer        |
| ------------- | ---------- | --------------- |
| Structured UI | attributes | React component |
| Prose         | innerHTML  | parseHtml       |
| Unknown       | innerHTML  | Disallowed      |

**Rules**

- Never parse HTML for layout
- Never trust block HTML for behavior
- If control is needed, create a real block

---

## Paragraph vs Stretchy

**Paragraph**

- Language
- Articles
- Inline semantics

**Stretchy**

- Heroes
- Section headers
- UI labels

If it’s part of the UI, it must be structured data.

---

## Block‑First vs Schema‑First

### Schema‑First Pages

- Location pages
- Repeated operational layouts
- Fixed structure
- No page-level blocks

### Block‑First Pages

- Marketing pages
- Campaigns
- Contact / forms
- Section-level composition only

---

## ACF Instructions

Rules live in **field instructions**.

Format:

```
Good: A • B • C | Bad: X • Y • Z
```

- No HTML
- No message fields as documentation
- No editable guides

---

## ACF JSON (Source of Truth)

- `acf-json/` is the canonical source of truth
- JSON files must be committed
- Database is runtime cache only

**Workflow**

- Local: edit in wp-admin
- Commit resulting JSON
- Production edits without JSON commits are not allowed

---

## Field Ownership: PHP vs ACF

Use this decision tree to determine ownership.

### Decision Tree

1. Does removing this field break production behavior?
   - Yes → PHP
   - No → continue

2. Is it edited by non-developers?
   - Yes → ACF
   - No → continue

3. Is it system / derived state?
   - Yes → PHP
   - No → continue

4. Is it API contract‑critical?
   - Yes → Prefer PHP
   - No → continue

5. Is it layout masquerading as content?
   - Yes → Not ACF
   - No → ACF

### ASCII Flowchart

```
[ New Field ]
      |
      v
Breaks prod?
   |      |
  Yes     No
   |       |
  PHP   Editable?
           |
        +--+--+
        |     |
       Yes    No
        |      |
       ACF   System?
                |
             +--+--+
             |     |
            Yes    No
             |      |
            PHP   API‑critical?
                        |
                     +--+--+
                     |     |
                    Yes    No
                     |      |
              Prefer PHP   Layout?
                                  |
                               +--+--+
                               |     |
                              Yes    No
                               |      |
                         Not ACF     ACF
```

### Rule of Thumb

- **ACF = intent**
- **PHP = invariants**

---

## Preview

- Route: `/api/preview`
- Supports drafts and revisions

---

## MU‑Plugin Patterns

Must‑use plugins:

- Load before all others
- Cannot be disabled
- Own system behavior

**Use MU‑plugins for**

- Core functionality
- WooCommerce behavior
- REST / GraphQL extensions
- Headless redirects
- Auth flows
- Algolia sync
- Session & cookie logic

**Naming**

- kebab-case
- domain‑grouped (`woocommerce-*`, `headless-*`)

**Documentation**

- Maintain `mu-plugins/README.md`
- Document hook priorities
- Note env requirements

**Key Files**

- `woocommerce-auto-customer-accounts.php`
- `woocommerce-headless-checkout-redirect.php`
- `headless-password-reset.php`
- `admin-cleanup.php`

See `agents/woocommerce.md` for WooCommerce‑specific patterns.
