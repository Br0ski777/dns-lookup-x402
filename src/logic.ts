import type { Hono } from "hono";


// ATXP: requirePayment only fires inside an ATXP context (set by atxpHono middleware).
// For raw x402 requests, the existing @x402/hono middleware handles the gate.
// If neither protocol is active (ATXP_CONNECTION unset), tryRequirePayment is a no-op.
async function tryRequirePayment(price: number): Promise<void> {
  if (!process.env.ATXP_CONNECTION) return;
  try {
    const { requirePayment } = await import("@atxp/server");
    const BigNumber = (await import("bignumber.js")).default;
    await requirePayment({ price: BigNumber(price) });
  } catch (e: any) {
    if (e?.code === -30402) throw e;
  }
}

const VALID_TYPES = ["A", "AAAA", "MX", "TXT", "CNAME", "NS", "SOA", "SRV"];

export function registerRoutes(app: Hono) {
  app.post("/api/lookup", async (c) => {
    await tryRequirePayment(0.002);
    const body = await c.req.json().catch(() => null);
    if (!body?.domain) {
      return c.json({ error: "Missing required field: domain" }, 400);
    }

    const domain: string = body.domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
    const type: string = (body.type || "A").toUpperCase();

    if (!VALID_TYPES.includes(type)) {
      return c.json({ error: `Invalid record type. Supported: ${VALID_TYPES.join(", ")}` }, 400);
    }

    try {
      const result = await queryDns(domain, type);
      return c.json(result);
    } catch (e: any) {
      return c.json({ error: `DNS lookup failed: ${e.message}` }, 400);
    }
  });
}

async function queryDns(domain: string, type: string) {
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/dns-json",
    },
  });

  if (!response.ok) {
    throw new Error(`Cloudflare DNS returned HTTP ${response.status}`);
  }

  const data: any = await response.json();

  const records = (data.Answer || []).map((record: any) => ({
    name: record.name,
    type: typeNumberToString(record.type),
    ttl: record.TTL,
    data: record.data,
  }));

  return {
    domain,
    queryType: type,
    status: data.Status === 0 ? "NOERROR" : `ERROR_${data.Status}`,
    records,
    recordCount: records.length,
    authority: (data.Authority || []).map((a: any) => ({
      name: a.name,
      type: typeNumberToString(a.type),
      ttl: a.TTL,
      data: a.data,
    })),
    resolver: "cloudflare-dns.com (1.1.1.1)",
    truncated: data.TC || false,
    recursionAvailable: data.RA || false,
  };
}

function typeNumberToString(num: number): string {
  const map: Record<number, string> = {
    1: "A", 2: "NS", 5: "CNAME", 6: "SOA", 15: "MX",
    16: "TXT", 28: "AAAA", 33: "SRV",
  };
  return map[num] || `TYPE${num}`;
}
