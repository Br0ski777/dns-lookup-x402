# DNS Lookup API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://dns-lookup.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Lookup DNS records (A, AAAA, MX, TXT, CNAME, NS, SOA, SRV) via Cloudflare DNS-over-HTTPS. Fast and reliable. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "dns-lookup": {
      "url": "https://dns-lookup.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl -X POST "https://dns-lookup.api.klymax402.com/api/lookup" \
  -H "Content-Type: application/json" \
  -d '{"domain":"..."}'
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `network_lookup_dns` | POST | `/api/lookup` | $0.005 | Lookup DNS records for a domain |

### `network_lookup_dns`

Use this when you need to look up DNS records for a domain. Returns all matching records in JSON via Cloudflare DNS-over-HTTPS.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `domain` | string | yes | Domain name to lookup (e.g. example.com) |
| `type` | string | no | DNS record type: A, AAAA, MX, TXT, CNAME, NS, SOA, SRV (default: A) |

Example response:

```json
{"domain":"example.com","type":"A","records":[{"name":"example.com","type":"A","data":"93.184.216.34","ttl":3600}],"queryTime":12,"resolver":"cloudflare"}
```

**When to use**: verifying DNS configuration, checking MX records before email setup, auditing TXT records for SPF/DKIM/DMARC, and debugging domain resolution issues.

**Not for**: SSL certificate check (use `security_check_ssl`), WHOIS domain info (use `domain_lookup_intelligence`), HTTP header analysis (use `network_analyze_headers`).

## Example agent prompts

- "Look up DNS records for a domain"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)
- Also reachable via [ATXP](https://atxp.ai) (OAuth-wrapped x402, RFC 9728 protected-resource metadata)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
