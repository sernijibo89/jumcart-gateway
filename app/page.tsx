'use client';

import React, { useState, useEffect } from 'react';

/* ---------- Native SVG Icons ---------- */
function Icon({ name, size = 16, className = '' }: { name: string; size?: number; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    Activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    Webhook: (
      <>
        <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
        <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06l3.19 5.86" />
        <circle cx="12" cy="12" r="2" />
      </>
    ),
    Sparkles: (
      <>
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
        <path d="M5 3v4M19 17v4M3 5h4M17 19h4" />
      </>
    ),
    RotateCcw: (
      <>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </>
    ),
    Settings: (
      <>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    Check: <polyline points="20 6 9 17 4 12" />,
    X: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    Shuffle: (
      <>
        <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
        <path d="m18 2 4 4-4 4M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
        <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
        <path d="m18 14 4 4-4 4" />
      </>
    ),
    Timer: (
      <>
        <line x1="10" y1="2" x2="14" y2="2" />
        <line x1="12" y1="14" x2="15" y2="11" />
        <circle cx="12" cy="14" r="8" />
      </>
    ),
    Lock: (
      <>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    Key: (
      <>
        <path d="m21 2-2 2m-1.5 1.5L16 7l4 4 1.5-1.5m-3-3L20 8" />
        <circle cx="7.5" cy="15.5" r="5.5" />
      </>
    ),
    Terminal: (
      <>
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </>
    )
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      style={{ flex: 'none' }}
    >
      {paths[name] || paths.Activity}
    </svg>
  );
}

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

const PROV: Record<string, { name: string; letter: string; color: string }> = {
  paystack: { name: 'Paystack', letter: 'P', color: '#4db8f0' },
  nomba: { name: 'Nomba', letter: 'N', color: '#ffb703' },
  stripe: { name: 'Stripe', letter: 'S', color: '#a597ff' },
  monnify: { name: 'Monnify', letter: 'M', color: '#ff9366' },
  shopify: { name: 'Shopify', letter: 'H', color: '#a9cf72' }
};

const DIAG: Record<string, any> = {
  schema: {
    title: 'Payload Schema Mismatch',
    icon: 'Shuffle',
    conf: 97,
    scope: 'Paystack → api.myapp.com/webhooks/payment',
    diagnosis: 'Your endpoint now expects data.total_amount in naira instead of kobo. Intercepted 4 mismatches.',
    patch: ['rule paystack-amount-remap', '- data.amount          // kobo', '+ data.total_amount    // naira = data.amount / 100']
  },
  timeout: {
    title: 'Network Timeout',
    icon: 'Timer',
    conf: 94,
    scope: 'Monnify → billing.northwind.ng/hooks/monnify',
    diagnosis: 'billing.northwind.ng took longer than 10s. Safe to retry with idempotency keys.',
    patch: ['rule extended-timeout-backoff', '- timeout 10s', '+ timeout 30s']
  },
  locked: {
    title: '503 Gateway Locked',
    icon: 'Lock',
    conf: 91,
    scope: 'Shopify → orders.kola-store.com/api/shopify/hooks',
    diagnosis: 'Destination in maintenance mode. Holding events until health check returns 200.',
    patch: ['rule hold-until-healthy', '+ on 503 hold in queue', '+ probe GET /health every 30s']
  },
  secret: {
    title: 'Signature Secret Rotated',
    icon: 'Key',
    conf: 96,
    scope: 'Stripe → api.myapp.com/webhooks/stripe',
    diagnosis: 'Webhook signature rotated. Re-signing forwarded requests automatically.',
    patch: ['rule resign-with-new-secret', '- stripe-signature old_secret', '+ stripe-signature new_secret']
  }
};

const EP_SEED = [
  { id: 'ep1', name: 'Payments', provider: 'paystack', dest: 'https://api.myapp.com/webhooks/payment', proxy: 'gonze_live_839201' },
  { id: 'ep2', name: 'Haildesk Support Hooks', provider: 'paystack', dest: 'https://haildesk.com/api/webhooks/incoming', proxy: 'haildesk_prod_01' },
  { id: 'ep3', name: 'Nomba Ingestion', provider: 'nomba', dest: 'https://httpbin.org/post', proxy: 'gonze_live_612984' },
  { id: 'ep4', name: 'Store orders', provider: 'shopify', dest: 'https://orders.kola-store.com/api/shopify/hooks', proxy: 'gonze_live_451907' },
  { id: 'ep5', name: 'Subscriptions', provider: 'stripe', dest: 'https://api.myapp.com/webhooks/stripe', proxy: 'gonze_live_118563' }
];

export default function Page() {
  const [tab, setTab] = useState<'stream' | 'endpoints' | 'healing' | 'replay' | 'keys'>('stream');
  const [openId, setOpenId] = useState<string | null>(null);
  const [diags, setDiags] = useState<Record<string, any>>({
    schema: { status: 'pending' },
    timeout: { status: 'pending' },
    locked: { status: 'pending' },
    secret: { status: 'pending' }
  });

  const [events, setEvents] = useState([
    { id: 'evt_8f12a9bc', provider: 'paystack', type: 'charge.success', dest: 'api.myapp.com/webhooks/payment', status: 'failed', latency: 42, ts: '16:24:12', cls: 'schema', body: { event: 'charge.success', data: { amount: '750000', currency: 'NGN' } } },
    { id: 'evt_7dc7c2a8', provider: 'monnify', type: 'SUCCESSFUL_TRANSACTION', dest: 'billing.northwind.ng/hooks/monnify', status: 'failed', latency: 10000, ts: '16:23:34', cls: 'timeout', body: { eventType: 'SUCCESSFUL_TRANSACTION', amount: 25000 } },
    { id: 'evt_912384af', provider: 'paystack', type: 'charge.success', dest: 'haildesk.com/api/webhooks/incoming', status: 'ok', latency: 24, ts: '16:22:10', cls: null, body: { event: 'charge.success', status: 'success' } },
    { id: 'evt_65c11d8a', provider: 'shopify', type: 'orders/create', dest: 'orders.kola-store.com/api/shopify/hooks', status: 'failed', latency: 35, ts: '16:15:48', cls: 'locked', body: { id: 591249, total_price: '84.50' } },
    { id: 'evt_362ffd83', provider: 'stripe', type: 'payment_intent.succeeded', dest: 'api.myapp.com/webhooks/stripe', status: 'healed', latency: 28, ts: '16:15:16', cls: 'secret', body: { id: 'pi_99214', status: 'succeeded' } }
  ]);

  const [metrics, setMetrics] = useState({
    total: 2418920,
    rev: 48210,
    lat: 24,
    rate: 99.98,
    histTotal: [14, 18, 22, 19, 24, 28, 21, 25, 29, 24, 26, 30, 22, 27],
    histRate: [99.97, 99.98, 99.99, 99.97, 99.98, 99.99, 99.98],
    histRev: [47900, 48000, 48100, 48150, 48210],
    histLat: [24, 22, 25, 23, 24, 26, 22]
  });

  const handleApprove = (c: string) => {
    setDiags((prev) => ({ ...prev, [c]: { status: 'applied' } }));
    setEvents((prev) =>
      prev.map((e) => (e.cls === c ? { ...e, status: 'healed' } : e))
    );
    setMetrics((prev) => ({ ...prev, rev: prev.rev + 450 }));
  };

  const openEv = events.find((e) => e.id === openId);
  const failedCount = events.filter((e) => e.status === 'failed').length;

  return (
    <div className="min-h-screen bg-[#090b0f] text-[#e8ecf1] font-sans antialiased text-[14px]">
      {/* Header */}
      <header className="border-b border-[#1c232d] bg-[#090b0f]">
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-[7px] bg-[#8ea3ff] grid place-items-center text-[#0a0d18] font-bold text-base">
                J
              </div>
              <span className="font-bold text-lg tracking-tight">JumcartFlow</span>
              <span className="font-mono text-[11px] text-[#8d98a7] border border-[#2a3340] rounded px-1.5 py-0.5">
                Autonomous Gateway
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
          <nav className="flex gap-2 overflow-x-auto border-t border-[#1c232d]/40">
            {[
              { id: 'stream', label: 'Live Stream', icon: 'Activity' },
              { id: 'endpoints', label: 'Endpoints & Proxies', icon: 'Webhook' },
              { id: 'healing', label: 'Self-Healing AI Logs', icon: 'Sparkles', count: failedCount },
              { id: 'replay', label: 'Replay Engine', icon: 'RotateCcw' },
              { id: 'keys', label: 'Settings & API Keys', icon: 'Settings' }
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

      {/* Main Content */}
      <main className="max-w-[1320px] mx-auto px-4 pt-5 space-y-4">
        {/* Metric Strip */}
        <section className="bg-[#0e1116] border border-[#1c232d] rounded-lg grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 overflow-hidden">
          <div className="p-3.5 border-b sm:border-b xl:border-b-0 xl:border-r border-[#1c232d] flex justify-between items-end">
            <div>
              <div className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[#5d6877]">Events Processed</div>
              <div className="text-2xl font-bold mt-1.5">{metrics.total.toLocaleString()}</div>
              <div className="font-mono text-[11.5px] text-[#8d98a7] mt-1">last 30 days</div>
            </div>
            <Spark data={metrics.histTotal} color="#8ea3ff" />
          </div>

          <div className="p-3.5 border-b sm:border-b xl:border-b-0 xl:border-r border-[#1c232d] flex justify-between items-end">
            <div>
              <div className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[#5d6877]">Success Rate</div>
              <div className="text-2xl font-bold mt-1.5 text-[#3ecf8e]">{metrics.rate.toFixed(2)}%</div>
              <div className="font-mono text-[11.5px] text-[#8d98a7] mt-1">{failedCount} open failures</div>
            </div>
            <Spark data={metrics.histRate} color="#3ecf8e" />
          </div>

          <div className="p-3.5 border-b sm:border-b-0 xl:border-r border-[#1c232d] flex justify-between items-end">
            <div>
              <div className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[#5d6877]">Revenue Saved</div>
              <div className="text-2xl font-bold mt-1.5 text-[#4cc9f0]">${metrics.rev.toLocaleString()}</div>
              <div className="font-mono text-[11.5px] text-[#8d98a7] mt-1">recovered from dropped events</div>
            </div>
            <Spark data={metrics.histRev} color="#4cc9f0" />
          </div>

          <div className="p-3.5 flex justify-between items-end">
            <div>
              <div className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[#5d6877]">Avg Gateway Latency</div>
              <div className="text-2xl font-bold mt-1.5 text-[#f2a93b]">{metrics.lat} ms</div>
              <div className="font-mono text-[11.5px] text-[#8d98a7] mt-1">p50, edge regions</div>
            </div>
            <Spark data={metrics.histLat} color="#f2a93b" />
          </div>
        </section>

        {/* TAB 1: Live Stream */}
        {tab === 'stream' && (
          <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg overflow-hidden">
            <div className="p-3.5 border-b border-[#1c232d] flex justify-between items-center">
              <h2 className="font-bold text-[15px]">Live Webhook Stream</h2>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-semibold bg-[#3ecf8e]/10 text-[#3ecf8e]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e] animate-pulse" />
                Streaming
              </span>
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
                  {events.map((e) => (
                    <tr
                      key={e.id}
                      onClick={() => setOpenId(e.id)}
                      className="hover:bg-white/[0.025] cursor-pointer transition"
                    >
                      <td className="py-2.5 px-3.5">
                        {e.status === 'ok' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-semibold text-[#3ecf8e] bg-[#3ecf8e]/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e]" /> 200 OK
                          </span>
                        ) : e.status === 'healed' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-semibold text-[#4cc9f0] bg-[#4cc9f0]/10">
                            <Icon name="Sparkles" size={12} /> Healed
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
                      <td className="py-2.5 px-3.5 text-[#8d98a7] max-w-[280px] truncate">{e.dest}</td>
                      <td className="py-2.5 px-3.5 text-right text-[#e8ecf1]">{e.latency} ms</td>
                      <td className="py-2.5 px-3.5 text-[#8d98a7] whitespace-nowrap">{e.ts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Endpoints */}
        {tab === 'endpoints' && (
          <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-4">
            <h2 className="font-bold text-base">Active Proxy Endpoints ({EP_SEED.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1c232d] text-[#5d6877] uppercase text-[11px]">
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Proxy Inbound Route</th>
                    <th className="py-2 px-3">Forward Destination</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c232d]">
                  {EP_SEED.map((ep) => (
                    <tr key={ep.id}>
                      <td className="py-3 px-3 font-sans font-semibold text-[#e8ecf1]">{ep.name}</td>
                      <td className="py-3 px-3 text-[#8ea3ff]">https://jumcart-gateway.vercel.app/api/p/{ep.proxy}</td>
                      <td className="py-3 px-3 text-[#8d98a7] max-w-[220px] truncate">{ep.dest}</td>
                      <td className="py-3 px-3"><span className="text-[#3ecf8e] bg-[#3ecf8e]/10 px-2 py-0.5 rounded font-sans text-xs">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Self-Healing */}
        {tab === 'healing' && (
          <div className="space-y-4">
            <h2 className="font-bold text-base">Self-Healing Diagnostics</h2>
            <div className="grid gap-4">
              {['schema', 'timeout', 'locked', 'secret'].map((c) => {
                const d = DIAG[c];
                const st = diags[c];
                return (
                  <div key={c} className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#8ea3ff]/10 text-[#8ea3ff] grid place-items-center">
                          <Icon name={d.icon} size={16} />
                        </div>
                        <div>
                          <div className="font-bold text-sm">{d.title}</div>
                          <div className="font-mono text-xs text-[#5d6877]">{d.scope}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#3ecf8e] bg-[#3ecf8e]/10 px-2 py-0.5 rounded">
                        {d.conf}% confidence
                      </span>
                    </div>
                    <div className="p-3 bg-[#141a22] rounded border border-[#2a3340] text-xs text-[#e8ecf1]">
                      {d.diagnosis}
                    </div>
                    <div className="bg-[#090b0f] border border-[#1c232d] rounded p-3 font-mono text-xs space-y-1">
                      {d.patch.map((line: string, i: number) => (
                        <div key={i} className={line.startsWith('+') ? 'text-[#3ecf8e]' : line.startsWith('-') ? 'text-[#ff6370]' : 'text-[#8d98a7]'}>
                          {line}
                        </div>
                      ))}
                    </div>
                    <div>
                      {st.status === 'applied' ? (
                        <span className="text-[#3ecf8e] text-xs font-semibold inline-flex items-center gap-1.5">
                          <Icon name="Check" size={13} /> Rule deployed to edge. Failures auto-repaired.
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApprove(c)}
                          className="bg-[#3ecf8e] text-[#04150d] text-xs font-semibold px-4 py-2 rounded inline-flex items-center gap-1.5 hover:bg-[#5ddda5]"
                        >
                          <Icon name="Check" size={13} /> Approve & Deploy Auto-Patch
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: Replay */}
        {tab === 'replay' && (
          <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-4">
            <h2 className="font-bold text-base">Replay Engine Terminal</h2>
            <div className="bg-[#05070a] border border-[#1c232d] rounded p-4 font-mono text-xs space-y-1.5">
              <div className="text-[#8d98a7]">jumcart-cli 2.4.1 · edge replay engine ready.</div>
              <div className="text-[#3ecf8e]">✓ Haildesk proxy endpoint verified and connected.</div>
              <div className="text-[#8ea3ff]">$ jumcart replay --ready_</div>
            </div>
          </div>
        )}

        {/* TAB 5: Keys */}
        {tab === 'keys' && (
          <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-4 font-mono text-xs">
            <h2 className="font-bold text-base font-sans">API Keys & Ingestion Secrets</h2>
            <div>Active Signing Secret: <span className="text-[#8ea3ff]">whsec_live_994a8f9021e84c9823ae77</span></div>
            <div>PostgreSQL Storage: <span className="text-[#3ecf8e]">Supabase Edge Realtime Attached</span></div>
          </div>
        )}
      </main>

      {/* Slide-over Event Drawer */}
      {openEv && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpenId(null)} />
          <div className="relative w-full max-w-[620px] bg-[#0e1116] border-l border-[#2a3340] h-full overflow-y-auto p-6 space-y-5 z-10">
            <div className="flex items-center justify-between border-b border-[#1c232d] pb-4">
              <div>
                <span className="font-mono text-xs text-[#8d98a7]">{openEv.id}</span>
                <h3 className="text-lg font-bold font-mono text-[#e8ecf1]">{openEv.type}</h3>
              </div>
              <button onClick={() => setOpenId(null)} className="p-1 text-[#8d98a7] hover:text-[#e8ecf1]">
                <Icon name="X" size={18} />
              </button>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-[#5d6877]">Payload Body</div>
              <pre className="p-3 bg-[#090b0f] border border-[#1c232d] rounded text-xs font-mono overflow-x-auto text-[#8ea3ff]">
                {JSON.stringify(openEv.body, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-[1320px] mx-auto px-4 py-8 border-t border-[#1c232d] mt-12 flex flex-wrap justify-between items-center text-xs text-[#5d6877]">
        <div>© 2026 JumcartFlow. All rights reserved.</div>
        <div className="font-mono">Operated by JumcartFlow</div>
      </footer>
    </div>
  );
}
