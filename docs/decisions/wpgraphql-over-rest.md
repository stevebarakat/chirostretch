---
title: WPGraphQL over REST
description: Why WPGraphQL is used as the primary data interface instead of the WordPress REST API.
---

ChiroStretch uses WPGraphQL as the primary interface between the frontend application and WordPress.

The WordPress REST API was considered, but it encourages endpoint sprawl, over-fetching, and implicit coupling between client and server. As the data model grows, REST-based integrations tend to become harder to reason about and validate.

WPGraphQL was selected because it:

- Provides a strongly typed schema that documents the data model
- Allows precise data selection per request
- Makes frontend data requirements explicit
- Scales better as content types and relationships increase

Using GraphQL establishes a clear contract between systems and reduces the need for custom endpoints or ad-hoc transformations. This improves long-term maintainability and developer confidence.
