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
- Applicant is approved (explicit decision)
- Customer makes a purchase (explicit transaction) ← **Auto-created**
- Customer explicitly creates account
- Staff/franchisee is onboarded
- Booking requires ongoing access

**Customer Auto-Creation Pattern:**
- Trigger: `woocommerce_payment_complete` hook (after successful payment)
- Check: If user with billing email exists, link order to existing user
- Create: If new email, create WordPress user with `customer` role
- Notify: Send welcome email with password reset link
- Implementation: `woocommerce-auto-customer-accounts.php` mu-plugin

This follows the core principle: **Identity is earned, not assumed.**
A purchase is an explicit, real event that earns identity.

## Promotion Rules

```
Lead → (conversion event) → User
Applicant → (explicit approval) → User
Customer (Guest) → (purchase) → User
```

Promotion must be explicit, auditable, and one-way.

## Customer Account Auto-Creation (Purchase Event)

Customers are automatically promoted from guest to user upon first purchase.

**Event:** `woocommerce_payment_complete` (payment succeeds)

**Process:**
1. Check if order has `customer_id` → if yes, skip
2. Check if user with `billing_email` exists → if yes, link order
3. If new email:
   - Create WordPress user (`customer` role)
   - Generate username from `firstname.lastname` pattern
   - Create secure random password (24 chars)
   - Link order to new user
   - Send welcome email with password reset link

**Password Reset Flow:**
- WordPress generates secure reset key (24-hour expiry)
- Email contains link: `https://frontend.com/account/set-password?key=X&login=Y`
- Next.js validates key via WordPress REST API
- User sets password → WordPress updates user
- User can now log in to My Account

**Why This Works:**
- Purchase = explicit event (not speculative)
- No account required for checkout (frictionless)
- Automatic onboarding (better UX)
- Follows "identity is earned" principle

**Files:**
- `woocommerce-auto-customer-accounts.php` — Account creation logic
- `headless-password-reset.php` — WordPress REST endpoints
- `/account/set-password/page.tsx` — Next.js password reset UI
- `/api/auth/validate-reset-key/route.ts` — Key validation proxy
- `/api/auth/reset-password/route.ts` — Password reset proxy

See [agents/tasks/checkout-flow.md](tasks/checkout-flow.md#6-password-reset-flow-hybrid) for implementation details.

## Prohibited Patterns

- Creating user accounts for leads
- Creating user accounts at application submission
- Allowing applicants to log in "just to check status"
- Maintaining parallel or shadow identity systems
- Granting access before approval
