# Access & Identity Charter

## Purpose

This charter defines who may exist as an identity, when identities are created, and how access is granted within the system.

Identity, authentication, and access are privileged states.
They must be granted deliberately, minimally, and only when justified.

---

## Core Principle (Non-Negotiable)

**Identity is earned, not assumed.**
**Authentication begins only when intent becomes real.**

---

## Identity Categories (Explicit & Mutually Exclusive)

The system recognizes three identity states:

1. Leads
2. Applicants
3. Users

These states must never be conflated.

---

## 1. Leads

### Definition

A Lead is a person who has expressed interest but has not committed, authenticated, or been approved.

Examples:
- "New Patient Special" coupon claims
- Marketing inquiries
- Contact forms

### Rules

- Leads must NOT have WordPress user accounts
- Leads must NOT authenticate
- Leads must NOT appear in WooCommerce Customers
- Leads must NOT access /my-account, /dashboard, or wp-admin

### Storage Model

- Gravity Forms entries (primary)
- Optional lead custom post type
- Optional CRM records

**Leads are data records, not identities.**

---

## 2. Applicants

### Definition

An Applicant is a person undergoing a review or approval process (e.g. franchise applicants).

Applicants demonstrate high intent, but are not yet trusted operators.

### Rules

- Applicants must NOT have WordPress user accounts
- Applicants must NOT authenticate
- Applicants must NOT be assigned roles or capabilities
- Applicants must NOT access /my-account, /dashboard, or wp-admin

**Authentication implies trust. Applicants are not yet trusted.**

### Storage Model

- Gravity Forms entries
- Domain records (e.g. `franchise_app` custom post type)

### Applicant Lifecycle

```
Application Submitted
→ Status: Pending
→ Internal Review
→ Decision
```

**If Approved:**
- Create a WordPress user at approval time
- Assign appropriate role (e.g. franchisee)
- Send approval email with account setup flow
- Grant access

**If Rejected:**
- No user is ever created
- Application is archived
- Communication occurs via email only

### Applicant Visibility & Editing

**Default Behavior:**
- Applicants do not view or edit applications after submission
- Status updates are communicated via email

**Optional (Advanced, Controlled):**
- Token-based, unauthenticated status page
- Secure, expiring access link
- Read-only by default
- No editing of core application data
- Must not imply or create a user account

---

## Tokenized Applicant Status Flow

### Purpose

The tokenized status flow allows franchise applicants to view application status without creating a user account or authenticating.

This is an optional, read-only convenience feature, not an identity system.

### Core Rule (Non-Negotiable)

**Applicants must not authenticate.**
Tokenized access must never create or imply a user account.

No login. No password. No session. No roles.

### High-Level Flow

```
Franchise Application Submitted
→ System generates secure token
→ Token stored with application record
→ Email sent with status link
→ Applicant accesses status page via token
→ Token expires or is invalidated on decision
```

### Token Generation

- Generate a cryptographically secure random token
- Token must be:
  - Unpredictable
  - Single-purpose
  - Expirable

Recommended properties:
- Length: ≥ 32 bytes (base64 or hex)
- Stored hashed (preferred) or tied to exactly one application

### Storage

Token is stored on the application record, not on a user.

Acceptable locations:
- Application CPT meta (e.g. `franchise_application`)
- Gravity Forms entry meta

Each token must be tied to:
- Application ID
- Email address (for validation)
- Expiration timestamp
- Status (active / expired / invalidated)

### Email Delivery

Email contains a link like:

```
https://cms.chirostretch.site/application-status?token=abc123
```

Rules:
- Email delivery handled by WordPress / Gravity Forms
- Token must never be logged or exposed elsewhere
- Token is the only credential

### Status Page Behavior

The status page:
- Is rendered by WordPress
- Does not require authentication
- Validates token before showing anything

**If token is valid:**
- Show:
  - Application status (Pending / Under Review / Approved / Rejected)
  - Submission date
  - Next-steps message
- Content is read-only

**If token is invalid or expired:**
- Show generic error message

### Editing Rules

**Default:**
- No editing allowed after submission

**Optional (advanced, tightly controlled):**
- Allow limited updates only (e.g. contact info, missing uploads)
- Never allow edits to:
  - Financial data
  - Scored fields
  - Core application answers
- All edits must be audited

**Editing must not create a user account.**

### Token Invalidation

Token must be invalidated when:
- Application is approved
- Application is rejected
- Token expires
- Token is manually revoked

After invalidation:
- Link no longer works
- Applicant must rely on email communication

### Prohibited Patterns

The following are explicitly forbidden:
- Creating a "pending applicant" user
- Allowing login "just to check status"
- Using JWTs or sessions
- Reusing WooCommerce customer auth
- Turning the status page into a dashboard

Any of these violate the Access & Identity Charter.

### Security Posture

This flow is:
- Not authentication
- Not authorization
- Comparable to:
  - Password reset links
  - Email verification links
  - Document signing links

Single-purpose, temporary access only.

### Guiding Principle

**Status visibility ≠ system access.**
**Tokens grant sight, not authority.**

---

*This tokenized status flow is optional.*
*If it is not implemented, email-only status communication is still correct.*
*If implemented, it must strictly follow the constraints above.*

---

## 3. Users

### Definition

A User is an authenticated, trusted actor with ongoing system access.

Examples:
- Franchisees (approved)
- Staff
- Administrators
- Customers (after account creation or purchase)

### Rules

- Users must have WordPress user accounts
- Users must authenticate via WordPress/WooCommerce
- Users may be assigned roles and capabilities
- Users may access /my-account, /dashboard, and admin tools as permitted

**User creation is event-driven, never speculative.**

---

## Identity Creation Rules

- Do NOT create users preemptively
- Do NOT create "pending" or "applicant" users
- Do NOT use authentication as a status-checking mechanism
- Do NOT reuse WooCommerce customers for applicants

A user account is created only when:
- An applicant is approved
- A customer explicitly creates an account
- A staff or franchisee operator is onboarded
- A purchase or booking requires ongoing access

---

## Promotion Rules

```
Lead → (conversion event) → User
Applicant → (explicit approval) → User
```

Promotion must be:
- Explicit
- Auditable
- One-way

**There is no automatic or implied promotion.**

---

## Authentication Implications

Authentication implies:
- Trust
- Support obligations
- Security responsibility
- Permission scope

**If authentication is not strictly required, do not create an identity.**

---

## Prohibited Patterns

The following patterns violate this charter and must be rejected:

- Creating user accounts for leads
- Creating user accounts at application submission
- Allowing applicants to log in "just to check status"
- Maintaining parallel or shadow identity systems
- Granting access before approval

---

## Final Guiding Statement

**Leads** express interest.
**Applicants** request consideration.
**Users** are trusted operators.

Each state has different rights, responsibilities, and system obligations.
