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
