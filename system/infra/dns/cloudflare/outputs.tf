output "zone_id" {
  description = "Cloudflare zone ID"
  value       = data.cloudflare_zone.this.id
}

output "apex_hostname" {
  description = "Apex record hostname"
  value       = cloudflare_record.apex.hostname
}

output "www_hostname" {
  description = "WWW record hostname"
  value       = cloudflare_record.www.hostname
}

output "cms_hostname" {
  description = "CMS record hostname"
  value       = cloudflare_record.cms.hostname
}
