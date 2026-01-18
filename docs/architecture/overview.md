---
title: Architecture Overview
description: High-level structure of the ChiroStretch headless platform.
---

ChiroStretch is designed as a headless system that separates content management, application rendering, and side effects into clearly defined layers.

The architecture prioritizes long-term maintainability, predictable data flow, and the ability to scale across multiple locations without duplicating logic.

At a high level:

- **Frontend**: A Next.js application responsible for rendering, routing, and user interaction.
- **Backend**: WordPress, used strictly as a structured content and commerce engine.
- **Transport**: GraphQL is the primary interface between systems.
- **Side Effects**: Actions such as emails, coupons, and integrations are handled through webhooks rather than inline execution.

This separation allows each layer to evolve independently while preserving clear contracts between them.
