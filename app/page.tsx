'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fkmwcpzrpcrmisafpdfx.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

/* ---------- Native SVG Icons (No Lucide dependency) ---------- */
function Icon({ name, size = 16, className = '' }: { name: string; size?: number; className?: string }) {
  const s = size;
  const paths: Record<string, React.ReactNode> = {
    activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    sparkles: (
      <>
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
      </>
    ),
    rotateCcw: (
      <>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </>
    ),
    settings: (
      <>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    x: (
      <>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </>
    ),
    copy: (
      <>
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </>
    ),
    shuffle: (
      <>
        <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
        <path d="m18 2 4 4-4 4" />
        <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
        <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
        <path d="m18 14 4 4-4 4" />
      </>
    ),
    timer: (
      <>
        <line x1="10" x2="14" y1="2" y2="2" />
        <line x1="12" x2="15" y1="14" y2="11" />
        <circle cx="12" cy="14" r="8" />
      </>
    ),
    lock: (
      <>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    key: (
      <>
        <path d="m21 2-2 2m-1.5 1.5L16 7l4 4 1.5-1.5m-3-3L20 8" />
        <circle cx="7.5" cy="15.5" r="5.5" />
      </>
    )
  };

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] || paths.activity}
    </svg>
  );
}

/* ---------- helpers ---------- */
const rnd = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const hex = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('');
const fmtMs = (ms: number | null) => (ms == null ? '—' : ms >= 1000 ? (ms / 1000).toFixed(2) + ' s' : Math.round(ms) + ' ms');
const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const clock = (ts: number) => new Date(ts).toLocaleTimeString('en-GB', { hour12: false });
const ago = (ts: number, now: number) => {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  return s < 5 ? 'just now' : s < 60 ? s + 's ago' : s < 3600 ? Math.floor(s / 60) + 'm ago' : Math.floor(s / 3600) + 'h ago';
};
const host = (u: string) => u.replace(/^https?:\/\//, '');

const PROV: Record<string, { name: string; letter: string; color: string }> = {
  paystack: { name: 'Paystack', letter: 'P', color: '#4db8f0' },
  stripe: { name: 'Stripe', letter: 'S', color: '#a597ff' },
  monnify: { name: 'Monnify', letter: 'M', color: '#ff9366' },
  shopify: { name: 'Shopify', letter: 'H', color: '#a9cf72' },
  github: { name: 'GitHub', letter: 'G', color: '#c9d1d9' }
};

const DIAG: Record<string, any> = {
  schema: {
    title: 'Payload Schema Mismatch',
    icon: 'shuffle',
    conf: 97,
    scope: 'Paystack → api.myapp.com/webhooks/payment',
    diagnosis: (n: number) => `Your endpoint expects total_amount in naira instead of kobo. Paystack sends amount in kobo. Intercepted ${n} events.`,
    patch: ['rule paystack-amount-remap', '- data.amount (kobo)', '+ data.total_amount (naira = amount / 100)']
  },
  timeout: {
    title: 'Network Timeout',
    icon: 'timer',
    conf: 94,
    scope: 'Monnify → billing.northwind.ng/hooks/monnify',
    diagnosis: (n: number) => `Endpoint took longer than 10s. Backing off and retrying safely via idempotency keys.`,
    patch: ['rule extended-timeout-backoff', '- timeout 10s', '+ timeout 30s', '+ circuit break after 5 fails']
  },
  locked: {
    title: '503 Gateway Locked',
    icon: 'lock',
    conf: 91,
    scope: 'Shopify → orders.kola-store.com/api/shopify/hooks',
    diagnosis: (n: number) => `Destination in maintenance mode. Holding events in queue until health check returns 200.`,
    patch: ['rule hold-until-healthy', '+ on 503 hold in queue', '+ probe GET /health every 30s']
  },
  secret: {
    title: 'Signature Secret Rotated',
    icon: 'key',
    conf: 96,
    scope: 'Stripe → api.myapp.com/webhooks/stripe',
    diagnosis: (n: number) => `Signature secret changed. Re-signing forwarded requests with active secret.`,
    patch: ['rule resign-with-new-secret', '- stripe-signature old_secret', '+ stripe-signature active_secret']
  }
};

const EP_SEED = [
  { id: 'ep1', name: 'Payments', provider: 'paystack', dest: 'https://httpbin.org/post', proxy: 'gonze_live_839201', active: true, ev24h: 18402, rate: 99.91 },
  { id: 'ep2', name: 'Billing transfers', provider: 'monnify', dest: 'https://billing.northwind.ng/hooks/monnify', proxy: 'gonze_live_702144', active: true, ev24h: 6120, rate: 99.74 },
  { id: 'ep3', name: 'Store orders', provider: 'shopify', dest: 'https://orders.kola-store.com/api/shopify/hooks', proxy: 'gonze_live_451907', active: true, ev24h: 9377, rate: 99.62 },
  { id: 'ep4', name: 'Subscriptions', provider: 'stripe', dest: 'https://api.myapp.com/webhooks/stripe', proxy: 'gonze_live_118563', active: true, ev24h: 11890, rate: 99.88 },
  { id: 'ep5', name: 'Deploy hooks', provider: 'github', dest: 'https://ci.myapp.com/hooks/github', proxy: 'gonze_live_990231', active: true, ev24h: 2144, rate: 100 }
];

/* ---------- Sparkline Component ---------- */
function Spark({ data, color }: { data: number[]; color: string }) {
  const w = 116, h = 34, pd = 3;
  const min = Math.min(...data), max = Math.max(...data), r = max - min || 1;
  const pts = data.map((v, i) => [pd + (i * (w - 2 * pd)) / (data.length - 1), h - pd - ((v - min) / r) * (h - 2 * pd)]);
  const line = pts.map((q) => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ');
  const area = `M${pts[0][0]},${h} L${pts.map((q) => q.join(',')).join(' L')} L${pts[pts.length - 1][0]},${h} Z`;
  const last = pts[pts.length - 1];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0" aria-hidden="true">
      <line x1="0" x2={w} y1={h / 2} y2={h / 2} stroke="#1c232d" strokeDasharray="2 3" />
      <path d={area} fill={color} opacity="0.14" />
      <polyline points={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.6" fill={color} />
    </svg>
  );
}

export default function JumcartApp() {
  const [tab, setTab] = useState<'stream' | 'endpoints' | 'healing' | 'replay' | 'keys'>('stream');
  const [endpoints] = useState(EP_SEED);
  const [events, setEvents] = useState<any[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [toasts, setToasts] = useState<any[]>([]);

  const [metrics] = useState({
    total: 2418920,
    rev: 48210,
    lat: 24,
    rate: 99.98,
    hist: {
      total: Array.from({ length: 30 }, () => rnd(12, 28)),
      rate: Array.from({ length: 30 }, () => 99.97 + Math.random() * 0.015),
      rev: Array.from({ length: 30 }, (_, i) => 47900 + i * 11),
      lat: Array.from({ length: 30 }, () => 22 + Math.random() * 5)
    }
  });

  const toast = useCallback((msg: string, kind = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, kind }].slice(-3));
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);

  // Fetch initial events from Supabase + Subscribe Realtime
  useEffect(() => {
    async function initSupabase() {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(40);

      if (data && data.length) {
        const mapped = data.map((d) => ({
          id: d.id,
          type: d.event_type || 'webhook.received',
          provider: 'paystack',
          dest: 'https://httpbin.org/post',
          ts: new Date(d.created_at).getTime(),
          latency: rnd(18, 45),
          status: d.healed ? 'healed' : d.status === 'success' ? 'ok' : 'failed',
          headers: { 'content-type': 'application/json', host: 'gateway.jumcart.com' },
          body: d.payload || {},
          resp: { code: d.status_code || 200, body: d.response_body || {} }
        }));
        setEvents(mapped);
      }
    }
    initSupabase();

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'events' }, (payload) => {
        const d = payload.new;
        const newEv = {
          id: d.id,
          type: d.event_type || 'webhook.received',
          provider: 'paystack',
          dest: 'https://httpbin.org/post',
          ts: Date.now(),
          latency: rnd(18, 35),
          status: d.healed ? 'healed' : d.status === 'success' ? 'ok' : 'failed',
          headers: { 'content-type': 'application/json' },
          body: d.payload,
          resp: { code: d.status_code || 200, body: d.response_body || {} }
        };
        setEvents((prev) => [newEv, ...prev].slice(0, 80));
      })
      .subscribe();

    const ticker = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      supabase.removeChannel(channel);
      clearInterval(ticker);
    };
  }, []);

  const simulateLiveBreak = async () => {
    toast('Injecting schema-mismatched webhook into live gateway...', 'info');
    try {
      await fetch('/api/p/gonze_live_839201', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'charge.success',
          data: {
            id: `sim_${hex(8)}`,
            amount: '500000',
            currency: 'NGN'
          }
        })
      });
      toast('Event processed by live gateway.', 'ok');
    } catch (e: any) {
      toast('Failed to reach gateway: ' + e.message, 'bad');
    }
  };

  const openEv = events.find((e) => e.id === openId);
  const failedCount = events.filter((e) => e.status === 'failed').length;

  return (
    <div className="min-h-screen bg-[#090b0f] text-[#e8ecf1] font-sans antialiased text-[14px]">
      {/* Top Header */}
      <header className="border-b border-[#1c232d] bg-[#090b0f]">
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-[7px] bg-[#8ea3ff] grid place-items-center text-[#0a0d18] font-bold text-base">
                J
              </div>
              <span className="font-bold text-lg tracking-tight">Jumcart</span>
              <span className="font-mono text-[11px] text-[#8d98a7] border border-[#2a3340] rounded px-1.5 py-0.5">
                by P. Gonze
              </span>
              <span className="text-xs text-[#8d98a7] hidden md:inline font-mono">
                The Self-Healing Webhook Gateway & API Proxy
              </span>
            </div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#3ecf8e] bg-[#3ecf8e]/10 border border-[#3ecf8e]/25 rounded px-2.5 py-1">
              <span className="w-2 h-2 rounded-full bg-[#3ecf8e] animate-pulse" />
              Network: 99.99% Operational
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-2 overflow-x-auto no-scrollbar border-t border-[#1c232d]/40">
            {[
              { id: 'stream', label: 'Live Stream', icon: 'activity' },
              { id: 'endpoints', label: 'Endpoints & Proxies', icon: 'zap' },
              { id: 'healing', label: 'Self-Healing AI Logs', icon: 'sparkles', count: failedCount },
              { id: 'replay', label: 'Replay Engine', icon: 'rotateCcw' },
              { id: 'keys', label: 'Settings & API Keys', icon: 'settings' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`inline-flex items-center gap-2 py-3 px-3.5 border-b-2 text-[13.5px] font-medium transition-colors whitespace-nowrap ${
                  tab === t.id
                    ? 'border-[#8ea3ff] text-[#e8ecf1]'
                    : 'border-transparent text-[#8d98a7] hover:text-[#e8ecf1]'
                }`}
              >
                <Icon name={t.icon} size={15} />
                {t.label}
                {t.count ? (
                  <span className="font-mono text-[10.5px] bg-[#ff6370]/15 text-[#ff6370] rounded px-1.5 py-0.5">
                    {t.count}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1320px] mx-auto px-4 pt-5 space-y-4">
        {/* Metric Strip with Live Sparklines */}
        <section className="bg-[#0e1116] border border-[#1c232d] rounded-lg grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 overflow-hidden">
          <div className="p-3.5 border-b sm:border-b xl:border-b-0 xl:border-r border-[#1c232d] flex justify-between items-end">
            <div>
              <div className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[#5d6877]">Events Processed</div>
              <div className="text-2xl font-bold mt-1.5">{metrics.total.toLocaleString()}</div>
              <div className="font-mono text-[11.5px] text-[#8d98a7] mt-1">last 30 days</div>
            </div>
            <Spark data={metrics.hist.total} color="#8ea3ff" />
          </div>

          <div className="p-3.5 border-b sm:border-b xl:border-b-0 xl:border-r border-[#1c232d] flex justify-between items-end">
            <div>
              <div className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[#5d6877]">Success Rate</div>
              <div className="text-2xl font-bold mt-1.5 text-[#3ecf8e]">{metrics.rate.toFixed(2)}%</div>
              <div className="font-mono text-[11.5px] text-[#8d98a7] mt-1">{failedCount} open failures</div>
            </div>
            <Spark data={metrics.hist.rate} color="#3ecf8e" />
          </div>

          <div className="p-3.5 border-b sm:border-b-0 xl:border-r border-[#1c232d] flex justify-between items-end">
            <div>
              <div className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[#5d6877]">Revenue Saved</div>
              <div className="text-2xl font-bold mt-1.5 text-[#4cc9f0]">{money(metrics.rev)}</div>
              <div className="font-mono text-[11.5px] text-[#8d98a7] mt-1">recovered from dropped events</div>
            </div>
            <Spark data={metrics.hist.rev} color="#4cc9f0" />
          </div>

          <div className="p-3.5 flex justify-between items-end">
            <div>
              <div className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[#5d6877]">Avg Gateway Latency</div>
              <div className="text-2xl font-bold mt-1.5 text-[#f2a93b]">{metrics.lat.toFixed(0)} ms</div>
              <div className="font-mono text-[11.5px] text-[#8d98a7] mt-1">p50, edge regions</div>
            </div>
            <Spark data={metrics.hist.lat} color="#f2a93b" />
          </div>
        </section>

        {/* TAB 1: Live Stream */}
        {tab === 'stream' && (
          <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 border-b border-[#1c232d]">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-[15px]">Live Webhook Stream</h2>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-semibold bg-[#3ecf8e]/10 text-[#3ecf8e]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e] animate-pulse" />
                  Streaming
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={simulateLiveBreak}
                  className="inline-flex items-center gap-1.5 text-xs bg-[#141a22] border border-[#2a3340] hover:border-[#5d6877] px-3 py-1.5 rounded font-medium"
                >
                  <Icon name="zap" size={13} className="text-[#f2a93b]" /> Simulate Failure
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1c232d] bg-[#0e1116] font-mono text-[11px] text-[#5d6877] uppercase">
                    <th className="py-2.5 px-3.5">Status</th>
                    <th className="py-2.5 px-3.5">Event Type</th>
                    <th className="py-2.5 px-3.5">Source</th>
                    <th className="py-2.5 px-3.5">Destination URL</th>
                    <th className="py-2.5 px-3.5 text-right">Latency</th>
                    <th className="py-2.5 px-3.5">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c232d] font-mono">
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-[#5d6877] font-sans">
                        No events received yet. Webhooks sent to /api/p/[proxy_id] will stream here instantly.
                      </td>
                    </tr>
                  ) : (
                    events.map((e) => (
                      <tr
                        key={e.id}
                        onClick={() => setOpenId(e.id)}
                        className="hover:bg-white/[0.025] cursor-pointer transition-colors"
                      >
                        <td className="py-2.5 px-3.5">
                          {e.status === 'ok' ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-semibold text-[#3ecf8e] bg-[#3ecf8e]/10">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e]" /> 200 OK
                            </span>
                          ) : e.status === 'healed' ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-semibold text-[#4cc9f0] bg-[#4cc9f0]/10">
                              <Icon name="sparkles" size={12} /> Healed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-semibold text-[#ff6370] bg-[#ff6370]/10">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6370]" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 text-[#e8ecf1] font-semibold">{e.type}</td>
                        <td className="py-2.5 px-3.5 text-[#8d98a7]">
                          <span className="inline-flex items-center gap-1.5 font-sans">
                            <span
                              className="w-4 h-4 rounded text-[10px] font-bold grid place-items-center text-black"
                              style={{ background: PROV[e.provider]?.color || '#4db8f0' }}
                            >
                              {PROV[e.provider]?.letter || 'P'}
                            </span>
                            {PROV[e.provider]?.name || 'Paystack'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-[#8d98a7] max-w-[280px] truncate">{host(e.dest)}</td>
                        <td className="py-2.5 px-3.5 text-right text-[#e8ecf1]">{fmtMs(e.latency)}</td>
                        <td className="py-2.5 px-3.5 text-[#8d98a7] whitespace-nowrap">
                          {clock(e.ts)} <span className="text-[#5d6877]">· {ago(e.ts, now)}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Endpoints & Proxies */}
        {tab === 'endpoints' && (
          <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-4">
            <h2 className="font-bold text-base">Your Active Ingestion Proxies</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#1c232d] font-mono text-[11px] text-[#5d6877] uppercase">
                  <tr>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Inbound Drop-in Proxy URL</th>
                    <th className="py-2 px-3">Forward Destination</th>
                    <th className="py-2 px-3">Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c232d] font-mono">
                  {endpoints.map((ep) => (
                    <tr key={ep.id}>
                      <td className="py-3 px-3 font-semibold text-[#e8ecf1] font-sans">{ep.name}</td>
                      <td className="py-3 px-3 text-[#8ea3ff] select-all font-mono">
                        https://jumcart-gateway.vercel.app/api/p/{ep.proxy}
                      </td>
                      <td className="py-3 px-3 text-[#8d98a7]">{ep.dest}</td>
                      <td className="py-3 px-3">
                        <span className="text-[#3ecf8e] bg-[#3ecf8e]/10 px-2 py-0.5 rounded font-sans text-xs">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Self-Healing AI Logs */}
        {tab === 'healing' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold">Self-Healing Diagnostics</h2>
              <p className="text-xs text-[#8d98a7]">
                Jumcart reads failed payloads, resolves mismatches, and auto-patches schemas on the edge.
              </p>
            </div>
            <div className="grid gap-4">
              {['schema', 'timeout', 'locked', 'secret'].map((c) => {
                const d = DIAG[c];
                return (
                  <div key={c} className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#8ea3ff]/10 text-[#8ea3ff] grid place-items-center">
                          <Icon name={d.icon} size={15} />
                        </div>
                        <div>
                          <div className="font-bold text-sm">{d.title}</div>
                          <div className="text-xs font-mono text-[#5d6877]">{d.scope}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#3ecf8e] bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 px-2 py-0.5 rounded">
                        {d.conf}% confidence
                      </span>
                    </div>
                    <div className="p-3 bg-[#141a22] rounded border border-[#2a3340] text-xs text-[#e8ecf1]">
                      {d.diagnosis(failedCount || 3)}
                    </div>
                    <div className="bg-[#090b0f] p-2.5 rounded border border-[#1c232d] font-mono text-xs text-[#8d98a7] space-y-1">
                      {d.patch.map((line: string, idx: number) => (
                        <div key={idx} className={line.startsWith('+') ? 'text-[#3ecf8e]' : line.startsWith('-') ? 'text-[#ff6370]' : ''}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: Replay Engine */}
        {tab === 'replay' && (
          <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-4">
            <h2 className="font-bold text-base">Replay Engine Terminal</h2>
            <div className="bg-[#05070a] border border-[#1c232d] rounded p-4 font-mono text-xs space-y-1">
              <div className="text-[#8d98a7]">jumcart-cli 2.4.1 · replay engine ready. Select events and run replay.</div>
              <div className="text-[#8ea3ff]">$ jumcart replay --ready_</div>
            </div>
          </div>
        )}

        {/* TAB 5: Settings & API Keys */}
        {tab === 'keys' && (
          <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-4">
            <h2 className="font-bold text-base">API Keys & Ingestion Secrets</h2>
            <div className="text-xs text-[#8d98a7] space-y-2">
              <p>Project Supabase Ingestion: <code className="text-[#8ea3ff]">Connected</code></p>
              <p>Signing Secret: <code className="text-[#e8ecf1]">whsec_994a8f9021e84c9823</code></p>
            </div>
          </div>
        )}
      </main>

      {/* Slide-over Event Drawer */}
      {openEv && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpenId(null)} />
          <div className="relative w-full max-w-[640px] bg-[#0e1116] border-l border-[#2a3340] h-full overflow-y-auto p-6 space-y-5 z-10">
            <div className="flex items-center justify-between border-b border-[#1c232d] pb-4">
              <div>
                <span className="font-mono text-xs text-[#8d98a7]">{openEv.id}</span>
                <h3 className="text-lg font-bold font-mono text-[#e8ecf1]">{openEv.type}</h3>
              </div>
              <button onClick={() => setOpenId(null)} className="p-1 text-[#8d98a7] hover:text-[#e8ecf1] rounded">
                <Icon name="x" size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-[#5d6877]">Payload Body</div>
              <pre className="p-3 bg-[#090b0f] border border-[#1c232d] rounded text-xs font-mono overflow-x-auto text-[#8ea3ff]">
                {JSON.stringify(openEv.body, null, 2)}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-[#5d6877]">Downstream Response</div>
              <pre className="p-3 bg-[#090b0f] border border-[#1c232d] rounded text-xs font-mono overflow-x-auto text-[#3ecf8e]">
                {JSON.stringify(openEv.resp, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Alerts */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-[#141a22] border border-[#2a3340] shadow-2xl px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2"
          >
            <Icon name="info" size={14} className="text-[#8ea3ff]" />
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="max-w-[1320px] mx-auto px-4 py-8 border-t border-[#1c232d] mt-12 flex flex-wrap justify-between items-center text-xs text-[#5d6877]">
        <div>Jumcart is owned and operated by P. Gonze Consultancy.</div>
        <div className="font-mono">Autonomous edge pipeline active</div>
      </footer>
    </div>
  );
}
