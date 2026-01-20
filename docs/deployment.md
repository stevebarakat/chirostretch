# Deployment

How ChiroStretch ships to production.

## Environments

| Environment | Next.js | WordPress | Purpose |
|-------------|---------|-----------|---------|
| Local | localhost:3000 | chirostretch-copy.local | Development |
| Staging | staging.chirostretch.com | cms-staging.chirostretch.com | Pre-production testing |
| Production | chirostretch.com | cms.chirostretch.com | Live site |

## Domain Mapping

### Production Domains

| Service | Domain | Provider |
|---------|--------|----------|
| Next.js UI | chirostretch.com | Vercel |
| WordPress CMS | cms.chirostretch.com | WPEngine |
| GraphQL | cms.chirostretch.com/graphql | WPEngine |

### Local Domains

| Service | URL |
|---------|-----|
| Next.js UI | https://localhost:3000 |
| WordPress CMS | https://chirostretch-copy.local |
| GraphQL | https://chirostretch-copy.local/graphql |

## Next.js Deployment (Vercel)

### Automatic Deployments

Push to specific branches to trigger deployments:

| Branch | Deployment |
|--------|------------|
| `main` | Production |
| `staging` | Staging |
| Feature branches | Preview |

### Manual Deployment

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

Configure in Vercel dashboard: Project Settings > Environment Variables

**Required for all environments:**

| Variable | Type | Scope |
|----------|------|-------|
| `NEXT_PUBLIC_FRONTEND_URL` | Plain | Production, Preview |
| `NEXT_PUBLIC_BACKEND_URL` | Plain | Production, Preview |
| `NEXT_PUBLIC_WPGRAPHQL_ENDPOINT` | Plain | Production, Preview |
| `WC_CONSUMER_KEY` | Sensitive | Production, Preview |
| `WC_CONSUMER_SECRET` | Sensitive | Production, Preview |
| `NEXT_PUBLIC_ALGOLIA_APP_ID` | Plain | Production, Preview |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` | Plain | Production, Preview |
| `ALGOLIA_ADMIN_API_KEY` | Sensitive | Production, Preview |
| `WP_WEBHOOK_SECRET` | Sensitive | Production, Preview |
| `REVALIDATE_SECRET` | Sensitive | Production, Preview |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Plain | Production, Preview |

**Do NOT set in production:**
- `NODE_TLS_REJECT_UNAUTHORIZED` — only for local development

### Build Settings

Vercel auto-detects Next.js. Verify settings:

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Build Command | `pnpm build` |
| Output Directory | `.next` |
| Install Command | `pnpm install` |
| Node.js Version | 20.x |

## WordPress Deployment (WPEngine)

### MU-Plugins Sync

The `mu-plugins` directory is managed in this repository and must be synced to WPEngine.

**Method 1: Git Push (Recommended)**

WPEngine supports Git deployments:

```bash
# Add WPEngine as remote (one-time setup)
git remote add wpengine git@git.wpengine.com:production/chirostretch.git

# Push mu-plugins changes
git subtree push --prefix system/apps/cms/wp-content/mu-plugins wpengine main
```

**Method 2: SFTP**

For manual deployments or hotfixes:

1. Connect via SFTP to WPEngine
2. Navigate to `/wp-content/mu-plugins/`
3. Upload changed files

### Database Migrations

When schema changes are required:

1. Test migration on staging first
2. Back up production database
3. Run migration queries via phpMyAdmin or WP-CLI
4. Verify data integrity

### WP-CLI Commands

Common commands for WPEngine (via SSH):

```bash
# Clear cache
wp cache flush

# Update database
wp db query "YOUR_SQL_HERE"

# Export database
wp db export backup.sql

# Rewrite rules
wp rewrite flush
```

## Secrets Management

### Per-Environment Secrets

Each environment must have unique secrets. Never share secrets between environments.

**Generate new secrets:**
```bash
openssl rand -base64 32
```

### Required Secrets

| Secret | Locations | Notes |
|--------|-----------|-------|
| `WC_CONSUMER_KEY` | Vercel, local | Different per environment |
| `WC_CONSUMER_SECRET` | Vercel, local | Different per environment |
| `WP_WEBHOOK_SECRET` | Vercel, wp-config.php | Must match |
| `REVALIDATE_SECRET` | Vercel, wp-config.php | Must match |
| `ALGOLIA_ADMIN_API_KEY` | Vercel | Same across environments |
| `GRAPHQL_JWT_AUTH_SECRET_KEY` | wp-config.php | Different per environment |
| `CHIROSTRETCH_INTERNAL_SECRET` | Vercel, wp-config.php | Must match |

### Rotating Secrets

1. Generate new secret
2. Update WordPress `wp-config.php`
3. Update Vercel environment variables
4. Trigger redeploy
5. Verify functionality
6. Delete old secret references

## Deployment Checklist

### Before Deployment

- [ ] All tests pass locally
- [ ] Code reviewed and approved
- [ ] Environment variables verified
- [ ] Database migrations prepared (if any)
- [ ] No console errors in browser
- [ ] Search indices up to date

### Next.js Deployment

- [ ] Push to appropriate branch
- [ ] Verify Vercel build succeeds
- [ ] Check deployment preview URL
- [ ] Verify environment variables are set
- [ ] Test critical paths (checkout, search, auth)
- [ ] Promote to production (if staging)

### WordPress Deployment

- [ ] Back up database
- [ ] Sync mu-plugins to WPEngine
- [ ] Verify plugins are activated
- [ ] Clear cache (WPEngine + Cloudflare if applicable)
- [ ] Test GraphQL endpoint
- [ ] Verify webhook endpoints respond

### Post-Deployment

- [ ] Monitor error logs (Vercel, WPEngine)
- [ ] Test checkout flow end-to-end
- [ ] Verify search results are current
- [ ] Check page load performance
- [ ] Verify SSL certificates

## Rollback Procedures

### Next.js (Vercel)

1. Go to Vercel dashboard
2. Select deployment to rollback to
3. Click "Promote to Production"

Or via CLI:
```bash
vercel rollback [deployment-url]
```

### WordPress (WPEngine)

1. Go to WPEngine dashboard
2. Select environment
3. Use "Backup points" to restore
4. Or manually restore mu-plugins via Git/SFTP

### Database Rollback

1. Access WPEngine dashboard
2. Go to Backup points
3. Restore database to specific point
4. Verify data integrity

## Monitoring

### Vercel

- Deployment logs
- Runtime logs
- Analytics (if enabled)

### WPEngine

- Error logs (`/wp-content/debug.log`)
- Access logs
- Performance metrics

### Algolia

- Search analytics
- Index monitoring
- API usage

## CI/CD Pipeline

### GitHub Actions (if configured)

Location: `.github/workflows/`

**Typical workflow:**
1. Push to branch
2. Run linting and tests
3. Build application
4. Deploy to appropriate environment

### Running Tests in CI

```yaml
# Example GitHub Actions step
- name: Run tests
  run: |
    pnpm install
    pnpm lint
    pnpm test:run
```

## Troubleshooting Deployments

### Build Failures

**Check:**
- Node.js version matches (20.x)
- All dependencies installed
- Environment variables set
- No TypeScript errors

### Runtime Errors

**Check:**
- Environment variables correct
- WordPress is accessible
- GraphQL endpoint responds
- Secrets match between systems

### Webhook Failures

**Check:**
- `WP_WEBHOOK_SECRET` matches
- `REVALIDATE_SECRET` matches
- Next.js API routes are accessible
- No CORS issues

See [debugging.md](debugging.md) for detailed troubleshooting.
