import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "dns-lookup",
  slug: "dns-lookup",
  description: "Lookup DNS records (A, AAAA, MX, TXT, CNAME, NS) via Cloudflare DNS-over-HTTPS.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/lookup",
      price: "$0.002",
      description: "Lookup DNS records for a domain",
      toolName: "network_lookup_dns",
      toolDescription: "Use this when you need to look up DNS records for a domain. Supports A, AAAA, MX, TXT, CNAME, NS, SOA, and SRV record types. Uses Cloudflare DNS-over-HTTPS (1.1.1.1) for fast, reliable resolution. Returns all matching records with TTL and record data. Do NOT use for SSL certificate check — use security_check_ssl instead. Do NOT use for WHOIS domain info — use domain_lookup_intelligence instead.",
      inputSchema: {
        type: "object",
        properties: {
          domain: { type: "string", description: "Domain name to lookup (e.g. example.com)" },
          type: { type: "string", description: "DNS record type: A, AAAA, MX, TXT, CNAME, NS, SOA, SRV (default: A)" },
        },
        required: ["domain"],
      },
    },
  ],
};
