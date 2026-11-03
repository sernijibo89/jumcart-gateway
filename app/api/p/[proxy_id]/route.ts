import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fkmwcpzrpcrmisafpdfx.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(
  req: NextRequest,
  { params }: { params: { proxy_id: string } }
) {
  const { proxy_id } = params;

  try {
    const payload = await req.json();

    // 1. Look up destination dynamically from Supabase
    const { data: endpoint, error: endpointErr } = await supabase
      .from('endpoints')
      .select('*')
      .eq('proxy_id', proxy_id)
      .eq('active', true)
      .single();

    if (endpointErr || !endpoint) {
      return NextResponse.json(
        { error: 'Endpoint not found or inactive in database' },
        { status: 404 }
      );
    }

    // 2. Forward payload to downstream destination
    let targetResponse: Response;
    let targetStatus = 500;
    let targetData: any = null;

    try {
      targetResponse = await fetch(endpoint.destination_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      targetStatus = targetResponse.status;
      try {
        targetData = await targetResponse.json();
      } catch {
        targetData = { message: await targetResponse.text() };
      }
    } catch (networkErr: any) {
      targetStatus = 502;
      targetData = { error: networkErr.message || 'Downstream host unreachable' };
    }

    // 3. Trigger Self-Healing if downstream rejected the request (4xx or 5xx)
    if (targetStatus >= 400) {
      const host = req.headers.get('host') || 'localhost:3000';
      const protocol = host.includes('localhost') ? 'http' : 'https';

      const healRes = await fetch(`${protocol}://${host}/api/heal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalPayload: payload,
          downstreamError: targetData,
          destinationUrl: endpoint.destination_url,
        }),
      });

      const healData = await healRes.json();

      if (healData.healed && healData.patchedPayload) {
        // Retry downstream with healed payload
        const retryRes = await fetch(endpoint.destination_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(healData.patchedPayload),
        });

        const retryData = await retryRes.json().catch(() => ({}));

        await supabase.from('events').insert({
          proxy_id,
          event_type: payload.event || 'webhook.received',
          status: retryRes.ok ? 'healed' : 'failed',
          status_code: retryRes.status,
          payload: healData.patchedPayload,
          response_body: retryData,
          healed: true,
          diagnosis: healData.diagnosis,
        });

        return NextResponse.json({
          status: 'healed',
          statusCode: retryRes.status,
          diagnosis: healData.diagnosis,
          data: retryData,
        });
      }

      await supabase.from('events').insert({
        proxy_id,
        event_type: payload.event || 'webhook.received',
        status: 'failed',
        status_code: targetStatus,
        payload,
        response_body: targetData,
        healed: false,
      });

      return NextResponse.json({ status: 'failed', targetData }, { status: targetStatus });
    }

    // 4. Log successful delivery
    await supabase.from('events').insert({
      proxy_id,
      event_type: payload.event || 'webhook.received',
      status: 'success',
      status_code: targetStatus,
      payload,
      response_body: targetData,
      healed: false,
    });

    return NextResponse.json({ status: 'success', data: targetData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
