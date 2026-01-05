# Access & Identity Charter

## Core Principle

**Identity is earned, not assumed.**
**Authentication begins only when intent becomes real.**

## Identity Categories (Mutually Exclusive)

### 1. Leads

A Lead is a person who has expressed interest but has not committed.

**Examples:** Coupon claims, marketing inquiries, contact forms

**Rules:**
- Must NOT have WordPress user accounts
- Must NOT authenticate
- Must NOT appear in WooCommerce Customers
- Must NOT access /my-account, /dashboard, or wp-admin

**Storage:** Gravity Forms entries, optional CPT, optional CRM

**Leads are data records, not identities.**

### 2. Applicants

An Applicant is a person undergoing a review process (e.g. franchise applicants).

**Rules:**
- Must NOT have WordPress user accounts
- Must NOT authenticate
- Must NOT be assigned roles or capabilities

**Authentication implies trust. Applicants are not yet trusted.**

**Storage:** Gravity Forms entries, domain CPTs (e.g. `franchise_application`)

**Lifecycle:**
- Application Submitted → Pending → Review → Decision
- If Approved: Create user, assign role, send setup email
- If Rejected: No user created, archive application

### 3. Users

A User is an authenticated, trusted actor with ongoing system access.

**Examples:** Franchisees (approved), Staff, Administrators, Customers

**Rules:**
- Must have WordPress user accounts
- Must authenticate via WordPress/WooCommerce
- May be assigned roles and capabilities

**User creation is event-driven, never speculative.**

## Tokenized Applicant Status (Optional)

Allows applicants to view status without creating a user account.

**Core rule:** Applicants must not authenticate. No login. No password. No session.

**Flow:**
1. Application submitted → generate secure token
2. Token stored with application record
3. Email sent with status link
4. Applicant accesses read-only status page via token
5. Token invalidated on decision

**Token requirements:**
- Cryptographically secure (≥32 bytes)
- Single-purpose, expirable
- Stored hashed, tied to exactly one application

**Status page shows:** Status, submission date, next-steps message (read-only)

**Prohibited:** Creating "pending applicant" users, allowing login for status, using JWTs or sessions

## Identity Creation Rules

- Do NOT create users preemptively
- Do NOT create "pending" or "applicant" users
- Do NOT use authentication as a status-checking mechanism

User account created only when:
- Applicant is approved
- Customer explicitly creates account
- Staff/franchisee is onboarded
- Purchase/booking requires ongoing access

## Promotion Rules

```
Lead → (conversion event) → User
Applicant → (explicit approval) → User
```

Promotion must be explicit, auditable, and one-way.

## Prohibited Patterns

- Creating user accounts for leads
- Creating user accounts at application submission
- Allowing applicants to log in "just to check status"
- Maintaining parallel or shadow identity systems
- Granting access before approval
