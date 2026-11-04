import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fkmwcpzrpcrmisafpdfx.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy'
);

export async function POST(req: NextRequest) {
  try {
    const { event_ids } = await req.json();

    if (!Array.isArray(event_ids) || event_ids.length === 0) {
      return NextResponse.json({ error: 'No event_ids provided' }, { status: 400 });
    }

    const { data: records, error } = await supabase
      .from('events')
      .select('*')
      .in('id', event_ids);

    if (error || !records) {
      return NextResponse.json({ error: 'Failed to fetch events from database' }, { status: 500 });
    }

    const replayResults = [];

    for (const ev of records) {
      const destUrl = ev.destination_url || 'https://httpbin.org/post';
      try {
        const res = await fetch(destUrl, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-jumcart-replayed': 'true',
            'x-jumcart-original-event-id': String(ev.id)
          },
          body: JSON.stringify(ev.payload || {}),
          signal: AbortSignal.timeout(10000)
        });

        const ok = res.status >= 200 && res.status < 300;

        await supabase
          .from('events')
          .update({
            status_code: res.status,
            healed: ok
          })
          .eq('id', ev.id);

        replayResults.push({
          id: ev.id,
          status: res.status,
          success: ok
        });
      } catch (err: any) {
        replayResults.push({
          id: ev.id,
          status: 504,
          error: err.message,
          success: false
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: replayResults.length,
      results: replayResults
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
