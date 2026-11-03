import { NextRequest, NextResponse } from "next/server";

// Registered proxy destinations (can later be loaded from Supabase or Redis)
const PROXIES: Record<string, { destination: string; provider: string; name: string }> = {
  gonze_live_839201: {
    name: "Payments",
    provider: "paystack",
    destination: "https://api.myapp.com/webhooks/payment",
  },
  gonze_live_451907: {
    name: "Store orders",
    provider: "shopify",
    destination: "https://orders.kola-store.com/api/shopify/hooks",
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
    
    // Copy incoming headers except host-specific ones
    const forwardHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "x-jumcart-proxy-id": proxyId,
      "x-jumcart-forwarded-at": new Date().toISOString(),
    };

    // Forward the webhook to the actual destination
    const targetResponse = await fetch(config.destination, {
      method: "POST",
      headers: forwardHeaders,
      body: JSON.stringify(rawBody),
    });

    const latency = Date.now() - startTime;
    const responseBody = await targetResponse.text();

    return NextResponse.json({
      status: targetResponse.status,
      ok: targetResponse.ok,
      latency_ms: latency,
      destination: config.destination,
      provider: config.provider,
      upstream_status: targetResponse.status,
      response_preview: responseBody.slice(0, 200),
    });
  } catch (err: any) {
    const latency = Date.now() - startTime;
    return NextResponse.json(
      {
        error: "Upstream dispatch failed",
        message: err.message,
        latency_ms: latency,
        destination: config.destination,
      },
      { status: 502 }
    );
  }
}
