# Access & Identity Charter

## Core Principle

**Identity is earned, not assumed.**
**Authentication begins only when intent becomes real.**

## Identity Categories (Mutually Exclusive)

### Leads

A Lead is a person who has expressed interest but has not committed.

**Examples:** Coupon claims, marketing inquiries, contact forms

**Rules:**
- Must NOT have WordPress user accounts
- Must NOT authenticate
- Must NOT appear in WooCommerce Customers
- Must NOT access /my-account, /dashboard, or wp-admin

**Storage:** Gravity Forms entries, optional CPT, optional CRM

**Leads are data records, not identities.**

### Users

A User is an authenticated, trusted actor with ongoing system access.

**Examples:** Staff, Administrators, Customers

**Rules:**
- Must have WordPress user accounts
- Must authenticate via WordPress/WooCommerce
- May be assigned roles and capabilities

**User creation is event-driven, never speculative.**

## Identity Creation Rules

- Do NOT create users preemptively
- Do NOT use authentication as a status-checking mechanism

User account created only when:
- Customer makes a purchase (explicit transaction) ← **Auto-created**
- Customer explicitly creates account
- Staff is onboarded
- Booking requires ongoing access

**Customer Auto-Creation Pattern:**
- Trigger: `woocommerce_payment_complete` hook (after successful payment)
- Check: If user with billing email exists, link order to existing user
- Create: If new email, create WordPress user with `customer` role
- Notify: Send welcome email with password reset link
- Implementation: `woocommerce-auto-customer-accounts.php` mu-plugin

## Promotion Rules

```
Lead → (conversion event) → User
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

**Files:**
- `woocommerce-auto-customer-accounts.php` — Account creation logic
- `headless-password-reset.php` — WordPress REST endpoints
- `/account/set-password/page.tsx` — Next.js password reset UI
- `/api/auth/validate-reset-key/route.ts` — Key validation proxy
- `/api/auth/reset-password/route.ts` — Password reset proxy

See [agents/tasks/checkout-flow.md](tasks/checkout-flow.md#6-password-reset-flow-hybrid) for implementation details.

## Prohibited Patterns

- Creating user accounts for leads
- Maintaining parallel or shadow identity systems
- Granting access before explicit event (purchase, staff onboarding)
