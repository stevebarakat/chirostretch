variable "cloudflare_api_token" {
  description = "Cloudflare API token with DNS edit permissions for the zone"
  type        = string
  sensitive   = true
}

variable "zone_name" {
  description = "Domain name of the Cloudflare zone"
  type        = string
  default     = "chirostretch.site"
}

variable "apex_ipv4" {
  description = "IPv4 address for the apex/root domain (Vercel)"
  type        = string
}

variable "www_cname_target" {
  description = "CNAME target for www subdomain (Vercel)"
  type        = string
}

variable "cms_ipv4" {
  description = "IPv4 address for the cms subdomain (Cloudways)"
  type        = string
}
