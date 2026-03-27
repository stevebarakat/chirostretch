# Cloudflare DNS — chirostretch.site

Manages DNS records for `chirostretch.site` via Terraform and the Cloudflare provider.

DNS lives in the monorepo so changes are versioned, reviewable, and tied to the same codebase as the applications they route to.

## Prerequisite

- The Cloudflare zone `chirostretch.site` must already exist in your Cloudflare account.

## Managed records

| Record | Type  | Target                   | Proxied |
| ------ | ----- | ------------------------ | ------- |
| `@`    | A     | 76.76.21.21 (Vercel)     | Yes     |
| `www`  | CNAME | Vercel DNS target        | Yes     |
| `cms`  | A     | 68.183.54.30 (Cloudways) | No      |

The `cms` subdomain is **DNS-only** (not proxied). It serves headless WordPress / WPGraphQL — keeping it direct to origin avoids issues with caching, cookies, webhooks, and API behavior that can occur when proxied.

## Setup

### 1. Authentication

Create a Cloudflare API token at https://dash.cloudflare.com/profile/api-tokens with these permissions:

- **Zone → DNS → Edit**
- **Zone → Zone → Read**

Scope it to the `chirostretch.site` zone.

### 2. Configuration

```sh
cp terraform.tfvars.example terraform.tfvars
```

Fill in `cloudflare_api_token`. The other variables have sensible defaults.

### 3. Deploy

If DNS records already exist in Cloudflare, you must import them into Terraform state before applying. See "Import existing records" below.

```sh
terraform init
terraform plan    # review before applying
terraform apply
```

## Verification

Check resolution:

```sh
dig +short chirostretch.site
dig +short www.chirostretch.site
dig +short cms.chirostretch.site
```

Ensure `cms` resolves directly to the Cloudways IP and is not proxied.

## Import existing records

If these DNS records were created manually in Cloudflare, import them into Terraform state before running `apply`.

### 1. Get zone ID

```sh
curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=chirostretch.site" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json"
```

### 2. List DNS records

```sh
curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CF_TOKEN"
```

Find the `id` for each record (`@`, `www`, `cms`).

### 3. Import into Terraform

```sh
terraform import cloudflare_record.apex <RECORD_ID>
terraform import cloudflare_record.www <RECORD_ID>
terraform import cloudflare_record.cms <RECORD_ID>
```

After import, run `terraform plan` to verify Terraform matches the existing state.

## Warnings

- Do **not** manually edit these records in the Cloudflare dashboard — Terraform will detect drift and may revert your changes on the next apply.
- State is local. Do not delete `terraform.tfstate` or you will lose Terraform's knowledge of existing resources.
- `terraform.tfvars` and state files are gitignored. Never commit secrets.
- Terraform is the source of truth for managed records. Manual changes in Cloudflare will cause drift.
- If records are changed outside Terraform, re-run `terraform plan` to detect differences.
