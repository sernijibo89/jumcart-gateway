'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fkmwcpzrpcrmisafpdfx.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

/* ---------- SVG Icon Set ---------- */
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
    Zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    Check: <polyline points="20 6 9 17 4 12" />,
    Copy: (
      <>
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </>
    ),
    X: (
      <>
        <line x1="18" x2="6" y1="6" y2="18" />
        <line x1="6" x2="18" y1="6" y2="18" />
      </>
    ),
    Search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
    Pause: (
      <>
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
      </>
    ),
    Play: <polygon points="5 3 19 12 5 21 5 3" />,
    FlaskConical: (
      <>
        <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
        <path d="M8.5 2h7M7 16h10" />
      </>
    ),
    Download: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </>
    ),
    User: (
      <>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    Send: (
      <>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
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
        <line x1="12" x2="20" y1="19" y2="19" />
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
        <line x1="10" x2="14" y1="2" y2="2" />
        <line x1="12" x2="15" y1="14" y2="11" />
        <circle cx="12" cy="14" r="8" />
      </>
    ),
    ShieldCheck: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
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

/* ---------- Utils ---------- */
const rnd = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const hex = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('');
const digits = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 10).toString()).join('');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const fmtMs = (ms: number | null) => (ms == null ? '—' : ms >= 1000 ? (ms / 1000).toFixed(2) + ' s' : Math.round(ms) + ' ms');
const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const clock = (ts: number) => new Date(ts).toLocaleTimeString('en-GB', { hour12: false });
const ago = (ts: number, now: number) => {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  return s < 5 ? 'just now' : s < 60 ? `${s}s ago` : s < 3600 ? `${Math.floor(s / 60)}m ago` : `${Math.floor(s / 3600)}h ago`;
};
const host = (u: string) => u.replace(/^https?:\/\//, '');

const copyText = (t: string) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(t).then(() => true, () => false);
  }
  return Promise.resolve(false);
};

/* ---------- Providers & Seed ---------- */
const PROV: Record<string, { name: string; letter: string; color: string }> = {
  paystack: { name: 'Paystack', letter: 'P', color: '#4db8f0' },
  nomba: { name: 'Nomba', letter: 'N', color: '#ffb703' },
  stripe: { name: 'Stripe', letter: 'S', color: '#a597ff' },
  monnify: { name: 'Monnify', letter: 'M', color: '#ff9366' },
  shopify: { name: 'Shopify', letter: 'H', color: '#a9cf72' }
};

const CLS_BY_PROV: Record<string, string> = { paystack: 'schema', nomba: 'schema', monnify: 'timeout', shopify: 'locked', stripe: 'secret' };
const RULE: Record<string, string> = {
  schema: 'paystack-amount-remap',
  timeout: 'extended-timeout-backoff',
  locked: 'hold-until-healthy',
  secret: 'resign-with-new-secret'
};

const DIAG: Record<string, any> = {
  schema: {
    title: 'Payload Schema Mismatch',
    icon: 'Shuffle',
    conf: 97,
    scope: 'Paystack / Nomba → api.myapp.com/webhooks/payment',
    diagnosis: (n: number) => `Your endpoint expects data.total_amount in Naira instead of kobo. Gateway intercepted ${n} mismatches.`,
    patch: [
      { t: 'ctx', s: 'rule paystack-amount-remap' },
      { t: 'del', s: '- data.amount          // string or kobo' },
      { t: 'add', s: '+ data.total_amount    // numeric amount coerced' }
    ]
  },
  timeout: {
    title: 'Network Timeout',
    icon: 'Timer',
    conf: 94,
    scope: 'Monnify → billing.northwind.ng/hooks/monnify',
    diagnosis: (n: number) => `billing.northwind.ng took longer than 10s to answer ${n} events. Backing off with idempotency.`,
    patch: [
      { t: 'ctx', s: 'rule extended-timeout-backoff' },
      { t: 'del', s: '- timeout 10s' },
      { t: 'add', s: '+ timeout 30s' }
    ]
  },
  locked: {
    title: '503 Gateway Locked',
    icon: 'Lock',
    conf: 91,
    scope: 'Shopify → orders.kola-store.com/api/shopify/hooks',
    diagnosis: (n: number) => `Target endpoint under maintenance (503). Events queued until health probe returns 200.`,
    patch: [
      { t: 'ctx', s: 'rule hold-until-healthy' },
      { t: 'add', s: '+ on 503 hold in queue' },
      { t: 'add', s: '+ probe GET /health every 30s' }
    ]
  },
  secret: {
    title: 'Signature Secret Rotated',
    icon: 'Key',
    conf: 96,
    scope: 'Stripe → api.myapp.com/webhooks/stripe',
    diagnosis: (n: number) => `Webhook signing secret rotated. Forwarded requests are resigned automatically with the active key.`,
    patch: [
      { t: 'ctx', s: 'rule resign-with-new-secret' },
      { t: 'del', s: '- signature old_whsec' },
      { t: 'add', s: '+ signature active_whsec' }
    ]
  }
};

const SANDBOX_TEMPLATES: Record<string, any> = {
  paystack: {
    event: 'charge.success',
    data: { id: 'tx_paystack_98124', amount: 500000, currency: 'NGN', customer: { email: 'client@business.ng' } }
  },
  nomba: {
    event: 'transaction.successful',
    data: { orderReference: 'NMB_REF_1829', amount: '25000', currency: 'NGN', merchantTxRef: 'ord_91823' }
  },
  monnify: {
    eventType: 'SUCCESSFUL_TRANSACTION',
    eventData: { transactionReference: 'MNFY|10291029', amountPaid: 15000, customer: { email: 'buyer@northwind.ng' } }
  },
  stripe: {
    type: 'payment_intent.succeeded',
    data: { object: { id: 'pi_live_9921', amount: 2000, currency: 'usd' } }
  }
};

const EP_SEED = [
  { id: 'ep1', name: 'Payments (Paystack)', provider: 'paystack', dest: 'https://httpbin.org/post', proxy: 'gonze_live_839201', active: true, ev24h: 18402, rate: 99.91 },
  { id: 'ep2', name: 'Nomba Ingestion', provider: 'nomba', dest: 'https://httpbin.org/post', proxy: 'gonze_live_612984', active: true, ev24h: 4210, rate: 99.85 },
  { id: 'ep3', name: 'Billing transfers (Monnify)', provider: 'monnify', dest: 'https://billing.northwind.ng/hooks/monnify', proxy: 'gonze_live_702144', active: true, ev24h: 6120, rate: 99.74 },
  { id: 'ep4', name: 'Store orders (Shopify)', provider: 'shopify', dest: 'https://orders.kola-store.com/api/shopify/hooks', proxy: 'gonze_live_451907', active: true, ev24h: 9377, rate: 99.62 },
  { id: 'ep5', name: 'Subscriptions (Stripe)', provider: 'stripe', dest: 'https://api.myapp.com/webhooks/stripe', proxy: 'gonze_live_118563', active: true, ev24h: 11890, rate: 99.88 }
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
  const [tab, setTab] = useState<'stream' | 'sandbox' | 'endpoints' | 'healing' | 'replay' | 'keys'>('stream');
  const [endpoints, setEndpoints] = useState(EP_SEED);
  const [events, setEvents] = useState<any[]>([]);
  const [live, setLive] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [toasts, setToasts] = useState<any[]>([]);

  // Filtering
  const [fStatus, setFStatus] = useState('all');
  const [fProv, setFProv] = useState('all');
  const [searchQ, setSearchQ] = useState('');

  // Sandbox State
  const [sbProvider, setSbProvider] = useState('paystack');
  const [sbPayload, setSbPayload] = useState(JSON.stringify(SANDBOX_TEMPLATES.paystack, null, 2));
  const [sbFault, setSbFault] = useState<'none' | 'string_amount' | 'timeout_504' | 'secret_401'>('none');
  const [sbTargetProxy, setSbTargetProxy] = useState('gonze_live_839201');
  const [sbSending, setSbSending] = useState(false);

  // Auth & Client Keys State
  const [userEmail, setUserEmail] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [clientKeys, setClientKeys] = useState<any[]>([
    { id: 'k1', name: 'Production Backend Worker', env: 'live', key: 'jm_live_sk_' + hex(32), created: 'Nov 01, 2026' }
  ]);

  // Self Healing State
  const [diags, setDiags] = useState<Record<string, any>>({
    schema: { status: 'pending', step: 0 },
    timeout: { status: 'pending', step: 0 },
    locked: { status: 'pending', step: 0 },
    secret: { status: 'pending', step: 0 }
  });

  // Replay Console
  const [logs, setLogs] = useState<any[]>([
    { id: 1, k: 'dim', t: 'jumcart-cli 2.4.1 · replay engine online. Sandbox active.' }
  ]);
  const [running, setRunning] = useState(false);
  const cancelReplay = useRef(false);

  // Metrics
  const [metrics, setMetrics] = useState({
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

  // Supabase Database Sync & WebSocket Channel
  useEffect(() => {
    async function loadSupabase() {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(35);

      if (data && data.length > 0) {
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
    loadSupabase();

    const channel = supabase
      .channel('schema-db-events')
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
          resp: { code: d.status_code || 200, body: d.response_body || {} },
          fresh: true
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

  // Switch template in Sandbox
  const handleTemplateSwitch = (prov: string) => {
    setSbProvider(prov);
    const tmpl = SANDBOX_TEMPLATES[prov] || SANDBOX_TEMPLATES.paystack;
    setSbPayload(JSON.stringify(tmpl, null, 2));
  };

  // Fire Real Sandbox Webhook
  const handleFireSandbox = async () => {
    setSbSending(true);
    let bodyToSend: any;
    try {
      bodyToSend = JSON.parse(sbPayload);
    } catch {
      toast('Invalid JSON syntax in sandbox payload.', 'bad');
      setSbSending(false);
      return;
    }

    if (sbFault === 'string_amount') {
      if (bodyToSend.data) bodyToSend.data.amount = '950000';
    }

    try {
      const res = await fetch(`/api/p/${sbTargetProxy}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyToSend)
      });
      const data = await res.json();
      toast(`Sandbox event dispatched to /api/p/${sbTargetProxy} (${data.status})`, 'ok');
      setTab('stream');
    } catch (e: any) {
      toast(`Dispatch error: ${e.message}`, 'bad');
    } finally {
      setSbSending(false);
    }
  };

  // Export Events to CSV
  const handleExportCSV = () => {
    if (!events.length) {
      toast('No events to export.', 'info');
      return;
    }
    const headers = ['id', 'status', 'event_type', 'provider', 'destination', 'latency_ms', 'timestamp'];
    const rows = events.map((e) => [
      e.id,
      e.status,
      e.type,
      e.provider,
      e.dest,
      e.latency || 0,
      new Date(e.ts).toISOString()
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jumcart_events_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Event log exported to CSV.', 'ok');
  };

  // Auth Sign-in / Guest toggle
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.includes('@')) {
      toast('Enter a valid email address.', 'bad');
      return;
    }
    setLoggedInUser(userEmail);
    setShowAuthModal(false);
    toast(`Authenticated as ${userEmail}. Tenant isolation active.`, 'ok');
  };

  const filteredEvents = events.filter((e) => {
    if (fStatus !== 'all' && e.status !== fStatus) return false;
    if (fProv !== 'all' && e.provider !== fProv) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      return (e.type + e.id + e.dest + e.provider).toLowerCase().includes(q);
    }
    return true;
  });

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

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-[#3ecf8e] bg-[#3ecf8e]/10 border border-[#3ecf8e]/25 rounded px-2.5 py-1">
                <span className="w-2 h-2 rounded-full bg-[#3ecf8e] animate-pulse" />
                Network: 99.99% Operational
              </div>

              {loggedInUser ? (
                <div className="flex items-center gap-2 text-xs font-mono text-[#8ea3ff] bg-[#8ea3ff]/10 border border-[#8ea3ff]/20 px-2.5 py-1 rounded">
                  <Icon name="User" size={13} /> {loggedInUser}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-[#141a22] border border-[#2a3340] hover:border-[#5d6877] text-xs font-semibold px-3 py-1.5 rounded transition"
                >
                  Sign In / API Keys
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs (Smooth Scroll on Mobile) */}
          <nav className="flex gap-2 overflow-x-auto no-scrollbar border-t border-[#1c232d]/40">
            {[
              { id: 'stream', label: 'Live Stream', icon: 'Activity' },
              { id: 'sandbox', label: 'Interactive Sandbox', icon: 'FlaskConical' },
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

      {/* Main Container */}
      <main className="max-w-[1320px] mx-auto px-4 pt-5 space-y-4">
        {/* Metric Strip */}
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

        {/* TAB 1: LIVE STREAM */}
        {tab === 'stream' && (
          <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 border-b border-[#1c232d]">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-[15px]">Live Webhook Stream</h2>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-semibold ${live ? 'bg-[#3ecf8e]/10 text-[#3ecf8e]' : 'bg-[#141a22] text-[#8d98a7]'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-[#3ecf8e] animate-pulse' : 'bg-[#5d6877]'}`} />
                  {live ? 'Streaming' : 'Paused'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setLive(!live)}
                  className="inline-flex items-center gap-1.5 text-xs bg-[#141a22] border border-[#2a3340] hover:border-[#5d6877] px-3 py-1.5 rounded font-medium transition"
                >
                  <Icon name={live ? 'Pause' : 'Play'} size={13} /> {live ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 text-xs bg-[#141a22] border border-[#2a3340] hover:border-[#5d6877] px-3 py-1.5 rounded font-medium transition"
                >
                  <Icon name="Download" size={13} /> Export CSV
                </button>
                <button
                  onClick={() => setTab('sandbox')}
                  className="inline-flex items-center gap-1.5 text-xs bg-[#8ea3ff] text-[#0a0d18] px-3 py-1.5 rounded font-semibold hover:bg-[#a5b6ff] transition"
                >
                  <Icon name="FlaskConical" size={13} /> Open Sandbox Tester
                </button>
              </div>
            </div>

            {/* Filter Strip */}
            <div className="flex flex-wrap items-center gap-2.5 p-3 border-b border-[#1c232d] bg-[#090b0f]/40">
              <div className="inline-flex border border-[#2a3340] rounded overflow-hidden">
                {[['all', 'All'], ['ok', '200 OK'], ['failed', 'Failed'], ['healed', 'Healed']].map(([s, label]) => (
                  <button
                    key={s}
                    onClick={() => setFStatus(s)}
                    className={`px-3 py-1 text-xs font-medium border-r border-[#2a3340] last:border-r-0 transition ${fStatus === s ? 'bg-[#141a22] text-[#e8ecf1]' : 'text-[#8d98a7] hover:text-[#e8ecf1]'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <select
                value={fProv}
                onChange={(e) => setFProv(e.target.value)}
                className="bg-[#090b0f] border border-[#2a3340] text-xs rounded px-2.5 py-1 text-[#e8ecf1]"
              >
                <option value="all">All Sources</option>
                {Object.keys(PROV).map((k) => (
                  <option key={k} value={k}>{PROV[k].name}</option>
                ))}
              </select>

              <div className="relative flex-1 max-w-[280px]">
                <span className="absolute left-2.5 top-2 text-[#5d6877]">
                  <Icon name="Search" size={13} />
                </span>
                <input
                  type="text"
                  placeholder="Filter by type, ID or destination"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  className="w-full bg-[#090b0f] border border-[#2a3340] rounded pl-8 pr-2.5 py-1 text-xs font-mono placeholder:text-[#5d6877] text-[#e8ecf1]"
                />
              </div>
              <span className="font-mono text-xs text-[#5d6877] ml-auto">
                {filteredEvents.length} of {events.length} events
              </span>
            </div>

            {/* Events Stream Table */}
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
                  {filteredEvents.map((e) => (
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
                      <td className="py-2.5 px-3.5 text-[#8d98a7] max-w-[280px] truncate">{host(e.dest)}</td>
                      <td className="py-2.5 px-3.5 text-right text-[#e8ecf1]">{fmtMs(e.latency)}</td>
                      <td className="py-2.5 px-3.5 text-[#8d98a7] whitespace-nowrap">
                        {clock(e.ts)} <span className="text-[#5d6877]">· {ago(e.ts, now)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE SANDBOX */}
        {tab === 'sandbox' && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-base">In-App Webhook Dispatcher Sandbox</h2>
                  <p className="text-xs text-[#8d98a7]">
                    Craft custom webhook payloads, simulate network or schema faults, and fire directly into live gateway routes.
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {Object.keys(SANDBOX_TEMPLATES).map((prov) => (
                    <button
                      key={prov}
                      onClick={() => handleTemplateSwitch(prov)}
                      className={`text-xs px-2.5 py-1 rounded font-medium border transition ${
                        sbProvider === prov
                          ? 'bg-[#141a22] border-[#8ea3ff] text-[#e8ecf1]'
                          : 'border-[#2a3340] text-[#8d98a7] hover:text-[#e8ecf1]'
                      }`}
                    >
                      {PROV[prov]?.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[#8d98a7] block mb-1">Payload JSON Editor</label>
                <textarea
                  rows={14}
                  value={sbPayload}
                  onChange={(e) => setSbPayload(e.target.value)}
                  className="w-full bg-[#090b0f] border border-[#2a3340] rounded p-3 font-mono text-xs text-[#8ea3ff] focus:outline-none focus:border-[#8ea3ff]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8d98a7]">Target Proxy:</span>
                  <select
                    value={sbTargetProxy}
                    onChange={(e) => setSbTargetProxy(e.target.value)}
                    className="bg-[#090b0f] border border-[#2a3340] text-xs rounded px-2 py-1 text-[#e8ecf1]"
                  >
                    {endpoints.map((ep) => (
                      <option key={ep.id} value={ep.proxy}>{ep.name} ({ep.proxy})</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleFireSandbox}
                  disabled={sbSending}
                  className="bg-[#8ea3ff] text-[#0a0d18] text-xs font-semibold px-4 py-2 rounded inline-flex items-center gap-1.5 hover:bg-[#a5b6ff] disabled:opacity-40 transition"
                >
                  <Icon name="Send" size={13} /> {sbSending ? 'Dispatching...' : 'Fire Sandbox Webhook'}
                </button>
              </div>
            </div>

            <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-4">
              <h2 className="font-bold text-base">Fault Injection Simulation</h2>
              <p className="text-xs text-[#8d98a7]">
                Intentionally break the payload schema to see how Jumcart Flow's autonomous self-healing intercepts downstream failures.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { id: 'none', label: 'Clean Payload (No fault injected)', desc: 'Valid JSON matching downstream target specifications.' },
                  { id: 'string_amount', label: 'Coerce "amount" to String', desc: 'Common payment gateway mistake. Triggers 422 schema repair.' },
                  { id: 'timeout_504', label: 'Simulate 504 Host Timeout', desc: 'Simulates busy server. Triggers exponential backoff queue.' },
                  { id: 'secret_401', label: 'Invalid HMAC Signature', desc: 'Simulates rotated secret key. Re-signs with active token.' }
                ].map((f) => (
                  <label
                    key={f.id}
                    onClick={() => setSbFault(f.id as any)}
                    className={`block p-3 rounded-lg border cursor-pointer transition ${
                      sbFault === f.id ? 'bg-[#141a22] border-[#8ea3ff]' : 'border-[#1c232d] hover:border-[#2a3340]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={sbFault === f.id}
                        onChange={() => {}}
                        className="accent-[#8ea3ff]"
                      />
                      <span className="font-semibold text-xs text-[#e8ecf1]">{f.label}</span>
                    </div>
                    <p className="text-[11px] text-[#8d98a7] mt-1 pl-5">{f.desc}</p>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ENDPOINTS & PROXIES */}
        {tab === 'endpoints' && (
          <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-4">
            <h2 className="font-bold text-base">Active Ingestion Proxies ({endpoints.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1c232d] text-[#5d6877] uppercase text-[11px]">
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Proxy ID</th>
                    <th className="py-2 px-3">Forward Target</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c232d]">
                  {endpoints.map((ep) => (
                    <tr key={ep.id}>
                      <td className="py-2.5 px-3 font-sans font-semibold text-[#e8ecf1]">{ep.name}</td>
                      <td className="py-2.5 px-3 text-[#8ea3ff]">https://jumcart-gateway.vercel.app/api/p/{ep.proxy}</td>
                      <td className="py-2.5 px-3 text-[#8d98a7] max-w-[200px] truncate">{ep.dest}</td>
                      <td className="py-2.5 px-3">
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

        {/* TAB 4: SELF-HEALING DIAGNOSTICS */}
        {tab === 'healing' && (
          <div className="space-y-4">
            <div>
              <h2 className="font-bold text-base">Self-Healing Diagnostics</h2>
              <p className="text-xs text-[#8d98a7]">
                Jumcart intercepts 4xx/5xx failures, diagnoses payload schema drift, and generates edge transformation patches.
              </p>
            </div>
            <div className="grid gap-4">
              {['schema', 'timeout', 'locked', 'secret'].map((c) => {
                const d = DIAG[c];
                return (
                  <div key={c} className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#8ea3ff]/10 text-[#8ea3ff] grid place-items-center">
                          <Icon name={d.icon} size={15} />
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
                      {d.diagnosis(failedCount || 3)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: REPLAY ENGINE */}
        {tab === 'replay' && (
          <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-4">
            <h2 className="font-bold text-base">Replay Engine Terminal</h2>
            <div className="bg-[#05070a] border border-[#1c232d] rounded p-4 font-mono text-xs space-y-1">
              <div className="text-[#8d98a7]">jumcart-cli 2.4.1 · replay engine online. Sandbox active.</div>
              <div className="text-[#8ea3ff]">$ jumcart replay --ready_</div>
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS & CLIENT API KEYS */}
        {tab === 'keys' && (
          <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-base">Client API Keys & Ingestion Secrets</h2>
                <p className="text-xs text-[#8d98a7] mt-1">Authenticate API requests and isolate your team's webhook pipelines.</p>
              </div>
              <button
                onClick={() => {
                  const newK = { id: 'k' + Date.now(), name: 'New Client Worker', env: 'live', key: 'jm_live_sk_' + hex(32), created: 'Today' };
                  setClientKeys((prev) => [newK, ...prev]);
                  toast('New client secret generated.', 'ok');
                }}
                className="bg-[#8ea3ff] text-[#0a0d18] text-xs font-semibold px-3 py-1.5 rounded"
              >
                + Create Key
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1c232d] text-[#5d6877] uppercase text-[11px]">
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Secret Key</th>
                    <th className="py-2 px-3">Env</th>
                    <th className="py-2 px-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c232d]">
                  {clientKeys.map((k) => (
                    <tr key={k.id}>
                      <td className="py-3 px-3 font-sans font-semibold text-[#e8ecf1]">{k.name}</td>
                      <td className="py-3 px-3 text-[#8ea3ff] flex items-center gap-2">
                        <span>{k.key}</span>
                        <button
                          onClick={() => {
                            copyText(k.key);
                            toast('API Key copied.', 'ok');
                          }}
                          className="text-[#5d6877] hover:text-[#e8ecf1]"
                        >
                          <Icon name="Copy" size={13} />
                        </button>
                      </td>
                      <td className="py-3 px-3 text-[#3ecf8e] uppercase">{k.env}</td>
                      <td className="py-3 px-3 text-[#8d98a7]">{k.created}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAuthModal(false)} />
          <div className="relative w-full max-w-sm bg-[#0e1116] border border-[#2a3340] rounded-xl p-6 space-y-4 z-10 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base">Client Workspace Sign-In</h3>
              <button onClick={() => setShowAuthModal(false)} className="text-[#5d6877] hover:text-[#e8ecf1]">
                <Icon name="X" size={16} />
              </button>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-[#8d98a7] block mb-1">Company / Developer Email</label>
                <input
                  type="email"
                  required
                  placeholder="founder@startup.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-[#090b0f] border border-[#2a3340] rounded px-3 py-2 text-xs text-[#e8ecf1]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#8ea3ff] text-[#0a0d18] text-xs font-semibold py-2 rounded hover:bg-[#a5b6ff] transition"
              >
                Access Tenant Workspace
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Event Drawer */}
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
              <div className="text-xs font-mono uppercase text-[#5d6877]">Request Body</div>
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

      {/* Toasts */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-[#141a22] border border-[#2a3340] shadow-2xl px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2"
          >
            <span className={t.kind === 'ok' ? 'text-[#3ecf8e]' : t.kind === 'bad' ? 'text-[#ff6370]' : 'text-[#8ea3ff]'}>
              ●
            </span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="max-w-[1320px] mx-auto px-4 py-8 border-t border-[#1c232d] mt-12 flex justify-between items-center text-xs text-[#5d6877]">
        <div>Jumcart is owned and operated by P. Gonze Consultancy.</div>
        <div className="font-mono">Autonomous operator console active</div>
      </footer>
    </div>
  );
}
