# Authentication

ChiroStretch uses WordPress as the authentication provider. Next.js does not handle login/logout flows directly.

## Overview

```
User → Next.js (login link) → WordPress (login form) → WordPress (session)
                                                              ↓
                                                       JWT Token
                                                              ↓
                                                       Next.js (API calls)
```

**Key principle:** WordPress owns authentication. Next.js links to WordPress for login and uses JWT tokens for authenticated API calls.

## Authentication Methods

### 1. WordPress Sessions (Primary)

Standard WordPress cookie-based authentication for:
- wp-admin access
- My Account (WooCommerce)
- Operational dashboards

Users log in at `/wp-login.php` or the WordPress login page.

### 2. JWT Tokens (API Calls)

WPGraphQL JWT Authentication provides tokens for:
- Authenticated GraphQL queries
- Server-to-server communication

## JWT Flow

### Token Generation

```graphql
mutation LoginUser($username: String!, $password: String!) {
  login(input: { username: $username, password: $password }) {
    authToken
    refreshToken
    user {
      id
      email
      firstName
      lastName
    }
  }
}
```

### Using Tokens

Include the token in the Authorization header:

```typescript
const response = await fetch(GRAPHQL_ENDPOINT, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  },
  body: JSON.stringify({ query, variables }),
});
```

### Token Refresh

JWT tokens have a short expiration (default: 5 minutes). Use the refresh token to get a new auth token:

```graphql
mutation RefreshToken($refreshToken: String!) {
  refreshJwtAuthToken(input: { jwtRefreshToken: $refreshToken }) {
    authToken
  }
}
```

**Refresh tokens** are longer-lived and stored securely.

## WordPress Configuration

### JWT Secret Key

Add to `wp-config.php`:

```php
define('GRAPHQL_JWT_AUTH_SECRET_KEY', 'your-strong-secret-key');
```

Generate a strong secret:
```bash
openssl rand -base64 64
```

**Warning:** Changing this secret invalidates all existing tokens.

### Token Expiration

Default expiration can be modified via filter:

```php
add_filter('graphql_jwt_auth_expire', function($expiration) {
    return 300; // 5 minutes in seconds
});
```

## Password Reset Flow

ChiroStretch implements a headless password reset flow via custom REST API endpoints.

### Flow Overview

```
1. User clicks "Forgot Password" → Next.js /forgot-password page
2. User enters email → Next.js API → WordPress REST API
3. WordPress generates reset key → Returns key to Next.js
4. Next.js sends email via Resend with reset link
5. User clicks link → Next.js /set-password page
6. User enters new password → Next.js API → WordPress REST API
7. WordPress validates key and updates password
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/wp-json/chirostretch/v1/auth/request-reset` | POST | Generate reset key |
| `/wp-json/chirostretch/v1/auth/validate-reset-key` | POST | Validate reset key |
| `/wp-json/chirostretch/v1/auth/reset-password` | POST | Reset password |

### Request Reset

```typescript
const response = await fetch(`${WP_URL}/wp-json/chirostretch/v1/auth/request-reset`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' }),
});

// Response (success - user exists)
{
  "success": true,
  "user": {
    "key": "reset-key-here",
    "login": "username",
    "email": "user@example.com",
    "firstName": "John"
  }
}

// Response (success - user not found, prevents enumeration)
{
  "success": true,
  "user": null
}
```

### Reset Password

```typescript
const response = await fetch(`${WP_URL}/wp-json/chirostretch/v1/auth/reset-password`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    key: 'reset-key-here',
    login: 'username',
    password: 'new-secure-password'
  }),
});
```

## Internal Server-to-Server Authentication

For secure communication between Next.js API routes and WordPress:

### Secret Header

```typescript
const response = await fetch(`${WP_URL}/wp-json/chirostretch/v1/some-endpoint`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Internal-Secret': process.env.CHIROSTRETCH_INTERNAL_SECRET,
  },
  body: JSON.stringify(data),
});
```

### WordPress Verification

```php
function verify_internal_request(WP_REST_Request $request) {
    $secret = $request->get_header('X-Internal-Secret');
    $expected = defined('CHIROSTRETCH_INTERNAL_SECRET')
        ? CHIROSTRETCH_INTERNAL_SECRET
        : getenv('CHIROSTRETCH_INTERNAL_SECRET');

    return $secret === $expected;
}
```

**Configuration:**
- Next.js: `CHIROSTRETCH_INTERNAL_SECRET` in `.env.local`
- WordPress: `CHIROSTRETCH_INTERNAL_SECRET` constant in `wp-config.php`

## Login/Logout URLs

### Login

Next.js links to WordPress login:

```tsx
const loginUrl = `${WP_URL}/wp-login.php?redirect_to=${encodeURIComponent(redirectUrl)}`;
```

The `headless-password-reset.php` mu-plugin filters login URLs to redirect back to Next.js for non-admin contexts.

### Logout

```tsx
const logoutUrl = `${WP_URL}/wp-login.php?action=logout`;
```

Users are logged out of WordPress and redirected.

## Protected Routes

### Client-Side Protection

Check for authentication state and redirect:

```tsx
// Example: redirect to login if not authenticated
useEffect(() => {
  if (!isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated]);
```

### Server-Side Protection

For API routes, verify the JWT token:

```typescript
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validate token with WordPress
  // ...
}
```

## Common Auth Failures

### "Invalid JWT token"

**Causes:**
- Token expired
- Wrong secret key in WordPress
- Token from different environment

**Fix:** Refresh token or re-authenticate.

### "User not found"

**Causes:**
- User deleted from WordPress
- Email/username changed

**Fix:** Verify user exists in WordPress.

### CORS errors on auth requests

**Causes:**
- Missing CORS headers
- Wrong origin configuration

**Fix:** Verify WordPress CORS configuration in mu-plugins.

### "Invalid reset key"

**Causes:**
- Key expired (WordPress default: 24 hours)
- Key already used
- Wrong login/username

**Fix:** Request a new password reset.

## Security Considerations

1. **Never store JWT tokens in localStorage** — vulnerable to XSS
2. **Use httpOnly cookies** for sensitive tokens when possible
3. **Short token expiration** — reduces window for stolen tokens
4. **Rotate secrets** if compromised
5. **HTTPS only** — never transmit tokens over HTTP
6. **Validate all inputs** — prevent injection attacks

## Related Documentation

- [agents/identity-charter.md](../agents/identity-charter.md) — User vs lead distinction
- [agents/tasks/checkout-flow.md](../agents/tasks/checkout-flow.md) — Auto account creation
- [debugging.md](debugging.md) — Troubleshooting auth issues
