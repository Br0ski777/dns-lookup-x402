import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "dns-lookup",
  slug: "dns-lookup",
  description: "Lookup DNS records (A, AAAA, MX, TXT, CNAME, NS, SOA, SRV) via Cloudflare DNS-over-HTTPS. Fast and reliable.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/lookup",
      price: "$0.002",
      description: "Lookup DNS records for a domain",
      toolName: "network_lookup_dns",
      toolDescription: `Use this when you need to look up DNS records for a domain. Returns all matching records in JSON via Cloudflare DNS-over-HTTPS.

Returns: 1. records array with type, name, data, TTL 2. Supports A, AAAA, MX, TXT, CNAME, NS, SOA, SRV 3. queryTime in ms 4. resolver info (Cloudflare 1.1.1.1).

Example output: {"domain":"example.com","type":"A","records":[{"name":"example.com","type":"A","data":"93.184.216.34","ttl":3600}],"queryTime":12,"resolver":"cloudflare"}

Use this FOR verifying DNS configuration, checking MX records before email setup, auditing TXT records for SPF/DKIM/DMARC, and debugging domain resolution issues.

Do NOT use for SSL certificate check -- use security_check_ssl instead. Do NOT use for WHOIS domain info -- use domain_lookup_intelligence instead. Do NOT use for HTTP header analysis -- use network_analyze_headers instead.`,
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
