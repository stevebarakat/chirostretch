# Infrastructure

This directory contains infrastructure-as-code for the ChiroStretch system.

It is responsible for external system configuration (e.g. DNS, hosting), not application runtime logic.

## Structure

- **dns/** — DNS record management (Cloudflare)
- **hosting/** — _(future)_ compute and platform configuration
- **ci/** — _(future)_ CI/CD pipeline definitions

## Guidelines

- Infrastructure is managed via code, not manual changes in provider dashboards
- Changes should be applied through the appropriate tooling (e.g. Terraform)
- Keep configs explicit and minimal; avoid premature abstraction

See subdirectory READMEs for operational details.
