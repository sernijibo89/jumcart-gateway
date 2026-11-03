import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

const PROXIES: Record<string, { destination: string; provider: string; name: string }> = {
  gonze_live_839201: {
    name: "Payments",
    provider: "paystack",
    destination: "https://api.myapp.com/webhooks/payment",
  },
  gonze_live_702144: {
    name: "Billing transfers",
    provider: "monnify",
    destination: "https://billing.northwind.ng/hooks/monnify",
  },
  gonze_live_451907: {
    name: "Store orders",
    provider: "shopify",
    destination: "https://orders.kola-store.com/api/shopify/hooks",
  },
  gonze_live_118563: {
    name: "Subscriptions",
    provider: "stripe",
    destination: "https://api.myapp.com/webhooks/stripe",
  },
  gonze_live_990231: {
    name: "Deploy hooks",
    provider: "github",
    destination: "https://ci.myapp.com/hooks/github",
  },
};

export async function POST(
  req: NextRequest,
  { params }: { params: { proxy_id: string } }
) {
  const startTime = Date.now();
  const proxyId = params.proxy_id;
  const config = PROXIES[proxyId];

  if (!config) {
    return NextResponse.json(
      { error: "Endpoint not found or inactive." },
      { status: 404 }
    );
  }

  try {
    const rawBody = await req.json();

    const eventType =
      rawBody.event ||
      rawBody.type ||
      rawBody.eventType ||
      req.headers.get("x-shopify-topic") ||
      req.headers.get("x-github-event") ||
      "webhook.received";

    let usd = 0;
    if (rawBody.data?.amount) usd = rawBody.data.amount / 100 / 1550;
    else if (rawBody.data?.object?.amount) usd = rawBody.data.object.amount / 100;
    else if (rawBody.total_price) usd = parseFloat(rawBody.total_price) || 0;

    const headersObj: Record<string, string> = {};
    req.headers.forEach((val, key) => {
      headersObj[key] = val;
    });

    let forwardStatus = 200;
    let forwardRespBody: any = { received: true };

    try {
      const upstreamResp = await fetch(config.destination, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-jumcart-proxy-id": proxyId,
          "x-jumcart-forwarded-at": new Date().toISOString(),
        },
        body: JSON.stringify(rawBody),
      });
      forwardStatus = upstreamResp.status;
      try {
        forwardRespBody = await upstreamResp.json();
      } catch {
        forwardRespBody = { raw: await upstreamResp.text() };
      }
    } catch (e: any) {
      forwardStatus = 504;
      forwardRespBody = { error: "Upstream timeout / unreachable", message: e.message };
    }

    const latency = Date.now() - startTime;
    const isOk = forwardStatus >= 200 && forwardStatus < 300;
    const eventId = "evt_" + Math.random().toString(36).substring(2, 12);

    const eventRecord = {
      id: eventId,
      provider: config.provider,
      type: eventType,
      dest: config.destination,
      ep_name: config.name,
      ts: Date.now(),
      usd: usd,
      latency: latency,
      status: isOk ? "ok" : "failed",
      headers: headersObj,
      body: rawBody,
      resp: { code: forwardStatus, body: forwardRespBody },
      note: isOk ? "Delivered to destination." : "Upstream returned non-200. Queued in Supabase.",
    };

    // Save directly to Supabase table
    await supabase.from("webhook_events").insert(eventRecord);

    return NextResponse.json({
      success: true,
      event_id: eventId,
      forward_status: forwardStatus,
      latency_ms: latency,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Invalid payload or internal gateway error", details: err.message },
      { status: 400 }
    );
  }
}
