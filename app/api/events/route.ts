import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("webhook_events")
      .select("*")
      .order("ts", { ascending: false })
      .limit(60);

    if (error) {
      return NextResponse.json({ events: [], error: error.message }, { status: 500 });
    }

    // Format fields to match frontend event model
    const events = (data || []).map((row) => ({
      ...row,
      epName: row.ep_name,
      attempts: [
        {
          n: 1,
          code: row.resp?.code || (row.status === "ok" ? 200 : 500),
          text: row.status === "ok" ? "OK" : "Error",
          ms: row.latency,
          wait: 0,
          at: 0,
          ok: row.status === "ok",
          kind: "auto",
          note: row.note,
        },
      ],
    }));

    return NextResponse.json({ events });
  } catch (err: any) {
    return NextResponse.json({ events: [], error: err.message }, { status: 500 });
  }
}
