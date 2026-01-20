# Scripts

System tooling for the ChiroStretch monorepo.

**Scripts are NOT runtime code.** They must not live in `src/` or `cms/`.

## cms/admin

One-off or destructive CMS operations.

Must never run automatically or in CI.

## cms/seed

Demo data generators for local development.
Safe for CI, preview, and local environments.

```bash
pnpm generate:demo
```

## search/algolia

Search indexing utilities.
May require credentials and manual invocation.
