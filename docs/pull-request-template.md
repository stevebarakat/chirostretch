## Summary

<!-- Brief description of changes -->

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] Documentation
- [ ] Other: ___

---

## ACF / WPGraphQL Checklist

> Complete this section if your PR touches: `mu-plugins/`, ACF field groups, GraphQL queries, or Options Pages.
> Delete this section if not applicable.

### Field Naming

- [ ] Field names use `snake_case`
- [ ] Field names describe **content**, not presentation
- [ ] No page names, layout names, or component names in field names
- [ ] No UI terminology (`button`, `grid`, `column`, `animation`)

### Content vs UI

- [ ] Each field answers: *"Is this content, or is this UI?"*
- [ ] No fields control layout, styling, or behavior
- [ ] Presentation logic lives in Next.js, not ACF

### Repeaters & Flexible Content

- [ ] Repeaters only used for intrinsically plural concepts (`metrics`, `testimonials`)
- [ ] No repeaters for layout (`columns`, `rows`, `sections`)
- [ ] Flexible Content layouts map to content types, not components

### Options Pages

- [ ] Fields prefixed with domain/feature name
- [ ] One field = one global decision
- [ ] Code provides sensible defaults (not dependent on WP values existing)
- [ ] No per-page overrides

### GraphQL

- [ ] New fields exposed via WPGraphQL
- [ ] Field names match ACF field names (no transformations)
- [ ] Queries fetch only required fields (minimal payloads)

### CPT / Block Changes

- [ ] MU-plugin handles registration (slug, rewrite, GraphQL exposure)
- [ ] ACF handles editorial fields only
- [ ] Blocks are dynamic (no serialized HTML)
- [ ] Next.js has corresponding component mapped to block name

---

## Test Plan

<!-- How was this tested? -->

- [ ] Local dev tested
- [ ] Build passes (`pnpm build`)
- [ ] Tests pass (`pnpm test:run`)
