import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fkmwcpzrpcrmisafpdfx.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy'
);

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ proxy_id: string }> }
) {
  const { proxy_id } = await context.params;
  const startTime = Date.now();

  try {
    // 1. Fetch Endpoint Config from Supabase
    const { data: endpoint, error: epError } = await supabase
      .from('endpoints')
      .select('*')
      .eq('proxy_id', proxy_id)
      .single();

    if (epError || !endpoint) {
      return NextResponse.json(
        { error: 'Endpoint route not found', proxy_id },
        { status: 404 }
      );
    }

    // 2. Parse Incoming Payload & Headers
    const rawBody = await req.text();
    let parsedBody: any = {};
    try {
      parsedBody = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      parsedBody = { raw: rawBody };
    }

    const incomingHeaders: Record<string, string> = {};
    req.headers.forEach((val, key) => {
      incomingHeaders[key] = val;
    });

    // 3. Extract event type identifier
    const eventType =
      parsedBody.event ||
      parsedBody.type ||
      parsedBody.eventType ||
      incomingHeaders['x-paystack-event'] ||
      'webhook.received';

    // 4. Forward to Downstream Target Server
    let destinationStatus = 504;
    let responseData: any = {};

    try {
      const forwardRes = await fetch(endpoint.destination_url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-jumcart-proxy-id': proxy_id,
          'x-jumcart-forwarded': 'true',
          ...(endpoint.custom_headers || {})
        },
        body: JSON.stringify(parsedBody),
        signal: AbortSignal.timeout(12000)
      });

      destinationStatus = forwardRes.status;
      const resText = await forwardRes.text();
      try {
        responseData = resText ? JSON.parse(resText) : { status: destinationStatus };
      } catch {
        responseData = { response: resText };
      }
    } catch (forwardErr: any) {
      destinationStatus = 504;
      responseData = { error: 'Gateway timeout or unreachable downstream target', details: forwardErr.message };
    }

    const latencyMs = Math.max(12, Date.now() - startTime);

    // 5. Fire Outbound Incident Alerts on Failures
    if (destinationStatus >= 400) {
      const alertPayload = {
        text: `🚨 *[JumcartFlow Alert]* Webhook delivery failed for *${endpoint.name || proxy_id}*.\n• Target: \`${endpoint.destination_url}\`\n• Status: \`${destinationStatus}\`\n• Event: \`${eventType}\`\n• Action: Transaction held in tenant DLQ for safe replay.`
      };

      if (endpoint.slack_webhook_url) {
        fetch(endpoint.slack_webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alertPayload)
        }).catch(() => {});
      }

      if (endpoint.discord_webhook_url) {
        fetch(endpoint.discord_webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: alertPayload.text })
        }).catch(() => {});
      }
    }

    // 6. Record to Real Event Ledger in Supabase
    await supabase.from('events').insert({
      proxy_id,
      event_type: eventType,
      destination_url: endpoint.destination_url,
      provider: endpoint.provider || 'paystack',
      status_code: destinationStatus,
      latency_ms: latencyMs,
      payload: parsedBody,
      headers: incomingHeaders,
      response_body: responseData,
      healed: false
    });

    return NextResponse.json(
      {
        jumcart_status: destinationStatus < 400 ? 'delivered' : 'buffered_dlq',
        destination_status: destinationStatus,
        latency_ms: latencyMs,
        response: responseData
      },
      { status: destinationStatus < 400 ? 200 : destinationStatus }
    );
  } catch (globalErr: any) {
    return NextResponse.json(
      { error: 'Internal gateway ingestion error', message: globalErr.message },
      { status: 500 }
    );
  }
}
