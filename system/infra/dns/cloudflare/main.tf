terraform {
  required_version = ">= 1.5, < 2.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

data "cloudflare_zone" "this" {
  name = var.zone_name
}

# Apex -> Vercel (proxied through Cloudflare)
resource "cloudflare_record" "apex" {
  zone_id = data.cloudflare_zone.this.id
  name = var.zone_name
  content = var.apex_ipv4
  type    = "A"
  proxied = false
  ttl     = 600
}

# www -> Vercel (proxied through Cloudflare)
resource "cloudflare_record" "www" {
  zone_id = data.cloudflare_zone.this.id
  name    = "www"
  content = var.www_cname_target
  type    = "CNAME"
  proxied = false
  ttl     = 600
}

# cms -> Cloudways (DNS-only, not proxied)
# Keep direct to origin for WordPress / WPGraphQL.
resource "cloudflare_record" "cms" {
  zone_id = data.cloudflare_zone.this.id
  name    = "cms"
  content = var.cms_ipv4
  type    = "A"
  proxied = false
  ttl     = 1
}
