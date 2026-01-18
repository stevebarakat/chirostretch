---
title: Data Model Overview
description: How content and commerce data are structured in ChiroStretch.
---

ChiroStretch uses WordPress as a structured data store rather than a page-centric CMS.

Content is modeled explicitly using custom post types, taxonomies, and custom fields. This allows the frontend application to consume data based on intent rather than presentation.

At a high level:

- **Custom Post Types** represent primary domain concepts such as Locations, Staff, Services, and Events.
- **Taxonomies** are used for classification and filtering, not hierarchy.
- **Custom Fields (ACF)** store structured attributes and relationships.
- **WooCommerce** is used for commerce-related data where transactional guarantees are required.

This data model is designed to support a headless frontend, predictable GraphQL queries, and reuse across multiple locations without duplicating content.
