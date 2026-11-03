'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

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
    Copy: (
      <>
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </>
    ),
    X: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
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
    Zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    FlaskConical: (
      <>
        <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
        <path d="M8.5 2h7M7 16h10" />
      </>
    ),
    Trash2: (
      <>
        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        <line x1="10" x2="10" y1="11" y2="17" />
        <line x1="14" x2="14" y1="11" y2="17" />
      </>
    ),
    Eye: (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    EyeOff: (
      <>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
      </>
    ),
    Terminal: (
      <>
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </>
    ),
    Bot: (
      <>
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2M20 14h2M15 13v2M9 13v2" />
      </>
    ),
    ArrowRight: (
      <>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </>
    ),
    AlertTriangle: (
      <>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" x2="12" y1="9" y2="13" />
        <line x1="12" x2="12.01" y1="17" y2="17" />
      </>
    ),
    ShieldCheck: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    Undo2: (
      <>
        <path d="M9 14 4 9l5-5" />
        <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
      </>
    ),
    Square: <rect width="18" height="18" x="3" y="3" rx="2" />,
    RefreshCw: (
      <>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M3 21v-5h5" />
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
    Lock: (
      <>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    KeyRound: (
      <>
        <path d="m21 2-2 2m-1.5 1.5L16 7l4 4 1.5-1.5m-3-3L20 8" />
        <circle cx="7.5" cy="15.5" r="5.5" />
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
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ flex: 'none' }} aria-hidden="true">
      <line x1="0" x2={w} y1={h / 2} y2={h / 2} stroke="#1c232d" strokeDasharray="2 3" />
      <path d={area} fill={color} opacity="0.14" />
      <polyline points={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.6" fill={color} />
    </svg>
  );
}

const rnd = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const chars = (set: string, n: number) => {
  let s = '';
  for (let i = 0; i < n; i++) s += set[rnd(0, set.length - 1)];
  return s;
};
const hex = (n: number) => chars('0123456789abcdef', n);
const b62 = (n: number) => chars('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', n);
const digits = (n: number) => chars('0123456789', n);
const uuid = () => `${hex(8)}-${hex(4)}-4${hex(3)}-a${hex(3)}-${hex(12)}`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const fmtMs = (ms: number | null) => (ms == null ? '—' : ms >= 1000 ? (ms / 1000).toFixed(2) + ' s' : Math.round(ms) + ' ms');
const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const clock = (ts: number) => new Date(ts).toLocaleTimeString('en-GB', { hour12: false });
const ago = (ts: number, now: number) => {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  return s < 5 ? 'just now' : s < 60 ? `${s}s ago` : s < 3600 ? `${Math.floor(s / 60)}m ago` : `${Math.floor(s / 3600)}h ago`;
};
const host = (u: string) => u.replace(/^https?:\/\//, '');

const PROV: Record<string, { name: string; letter: string; color: string }> = {
  paystack: { name: 'Paystack', letter: 'P', color: '#4db8f0' },
  nomba: { name: 'Nomba', letter: 'N', color: '#ffb703' },
  stripe: { name: 'Stripe', letter: 'S', color: '#a597ff' },
  monnify: { name: 'Monnify', letter: 'M', color: '#ff9366' },
  shopify: { name: 'Shopify', letter: 'H', color: '#a9cf72' },
  github: { name: 'GitHub', letter: 'G', color: '#c9d1d9' }
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
    scope: 'Paystack → api.myapp.com/webhooks/payment',
    diagnosis: (n: number) => `Your endpoint now expects data.total_amount in naira instead of kobo. Paystack still sends data.amount in kobo. Your server rejected ${n} events with a 422 because the new field was missing. The payments themselves are fine.`,
    patch: [
      { t: 'ctx', s: 'rule paystack-amount-remap' },
      { t: 'del', s: '- data.amount          // kobo, integer' },
      { t: 'add', s: '+ data.total_amount    // naira = data.amount / 100' },
      { t: 'ctx', s: '  keep reference, currency, customer.email' }
    ],
    steps: ['Testing rule on saved payloads', 'Compiling transform', 'Deploying to 14 edge regions', 'Replaying failed events']
  },
  timeout: {
    title: 'Network Timeout',
    icon: 'Timer',
    conf: 94,
    scope: 'Monnify → billing.northwind.ng/hooks/monnify',
    diagnosis: (n: number) => `billing.northwind.ng took longer than 10 seconds to answer ${n} events. Backing off and retrying is safe via idempotency keys.`,
    patch: [
      { t: 'ctx', s: 'rule extended-timeout-backoff' },
      { t: 'del', s: '- timeout       10s' },
      { t: 'add', s: '+ timeout       30s' },
      { t: 'add', s: '+ backoff       2s x2, jitter 20%' }
    ],
    steps: ['Checking idempotency keys', 'Raising timeout to 30s', 'Deploying edge patches', 'Replaying failed events']
  },
  locked: {
    title: '503 Gateway Locked',
    icon: 'Lock',
    conf: 91,
    scope: 'Shopify → orders.kola-store.com/api/shopify/hooks',
    diagnosis: (n: number) => `Destination is in maintenance mode and answers 503. Jumcart holds these ${n} events in queue until health check returns 200.`,
    patch: [
      { t: 'ctx', s: 'rule hold-until-healthy' },
      { t: 'add', s: '+ on 503 hold in queue (24h)' },
      { t: 'add', s: '+ probe GET /health every 30s' }
    ],
    steps: ['Probing health check URL', 'Creating hold queue', 'Deploying edge patches', 'Releasing held events']
  },
  secret: {
    title: 'Signature Secret Rotated',
    icon: 'KeyRound',
    conf: 96,
    scope: 'Stripe → api.myapp.com/webhooks/stripe',
    diagnosis: (n: number) => `Webhook signature secret rotated. Re-signing forwarded requests automatically with active key for ${n} events.`,
    patch: [
      { t: 'ctx', s: 'rule resign-with-new-secret' },
      { t: 'del', s: '- stripe-signature  v1=<signed with old_secret>' },
      { t: 'add', s: '+ stripe-signature  v1=<signed with new_secret>' }
    ],
    steps: ['Verifying secret', 'Resigning payloads', 'Deploying edge patches', 'Replaying failed events']
  }
};

const EP_SEED = [
  { id: 'ep1', name: 'Payments', provider: 'paystack', dest: 'https://api.myapp.com/webhooks/payment', proxy: 'gonze_live_839201', active: true, ev24h: 18402, rate: 99.91 },
  { id: 'ep2', name: 'Haildesk Support Hooks', provider: 'paystack', dest: 'https://haildesk.com/api/webhooks/incoming', proxy: 'haildesk_prod_01', active: true, ev24h: 5240, rate: 99.98 },
  { id: 'ep3', name: 'Billing transfers', provider: 'monnify', dest: 'https://billing.northwind.ng/hooks/monnify', proxy: 'gonze_live_702144', active: true, ev24h: 6120, rate: 99.74 },
  { id: 'ep4', name: 'Store orders', provider: 'shopify', dest: 'https://orders.kola-store.com/api/shopify/hooks', proxy: 'gonze_live_451907', active: true, ev24h: 9377, rate: 99.62 },
  { id: 'ep5', name: 'Subscriptions', provider: 'stripe', dest: 'https://api.myapp.com/webhooks/stripe', proxy: 'gonze_live_118563', active: true, ev24h: 11890, rate: 99.88 }
];

function seedEvents() {
  const now = Date.now();
  const out: any[] = [];
  const provs = ['paystack', 'stripe', 'monnify', 'shopify', 'github'];
  for (let i = 0; i < 48; i++) {
    const p = provs[i % provs.length];
    const ep = EP_SEED.find((e) => e.provider === p) || EP_SEED[0];
    const isFail = i === 4 || i === 6 || i === 9 || i === 13 || i === 16;
    const isHealed = i === 8 || i === 21;
    const cls = CLS_BY_PROV[p] || 'schema';
    const amt = pick([45000, 75000, 120000, 250000]);
    out.push({
      id: 'evt_' + hex(10),
      provider: ep.provider,
      type: p === 'shopify' ? 'orders/create' : 'charge.success',
      dest: ep.dest,
      ts: now - i * 5200,
      usd: isFail ? amt / 1550 : 0,
      status: isFail ? 'failed' : isHealed ? 'healed' : 'ok',
      latency: rnd(18, 45),
      cls: isFail || isHealed ? cls : null,
      headers: {
        'content-type': 'application/json',
        'host': 'gateway.jumcart.com',
        'x-jumcart-endpoint': ep.proxy,
        'x-jumcart-signature-verified': 'true'
      },
      body: {
        event: 'charge.success',
        data: { id: 'tx_' + hex(8), amount: amt, currency: 'NGN', customer: { email: 'client@business.ng' } }
      },
      resp: {
        code: isFail ? 422 : 200,
        body: isFail ? { error: 'validation_failed', message: 'Missing required field: total_amount' } : { status: 'success' }
      },
      attempts: [
        { n: 1, code: isFail ? 422 : 200, text: isFail ? 'Unprocessable' : 'OK', ms: rnd(18, 38), ok: !isFail }
      ]
    });
  }
  return out;
}

export default function Page() {
  const [tab, setTab] = useState<'stream' | 'endpoints' | 'healing' | 'replay' | 'keys'>('stream');
  const [endpoints, setEndpoints] = useState(EP_SEED);
  const [events, setEvents] = useState<any[]>(seedEvents);
  const [live, setLive] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [toasts, setToasts] = useState<any[]>([]);

  // Filtering
  const [fStatus, setFStatus] = useState('all');
  const [fProv, setFProv] = useState('all');
  const [searchQ, setSearchQ] = useState('');

  // Endpoints Generator
  const [genUrl, setGenUrl] = useState('https://api.myapp.com/webhooks/payment');
  const [genProv, setGenProv] = useState('paystack');
  const [activeProxy, setActiveProxy] = useState(EP_SEED[0]);
  const [snippetTab, setSnippetTab] = useState<'dash' | 'node' | 'curl'>('dash');

  // Self Healing State
  const [diags, setDiags] = useState<Record<string, any>>({
    schema: { status: 'pending', step: 0 },
    timeout: { status: 'pending', step: 0 },
    locked: { status: 'pending', step: 0 },
    secret: { status: 'pending', step: 0 }
  });

  // Replay State
  const [rsel, setRsel] = useState<Record<string, boolean>>({});
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<any[]>([
    { id: 1, k: 'dim', t: 'jumcart-cli 2.4.1 · replay engine online. Select failed events to run backoff retry.' }
  ]);
  const cancelReplay = useRef(false);

  // Settings
  const [keys, setKeys] = useState([
    { id: 'k1', name: 'Production Backend', env: 'live', value: 'jm_live_sk_' + hex(32), created: 'Nov 01, 2026', shown: false },
    { id: 'k2', name: 'Staging Relay', env: 'test', value: 'jm_test_sk_' + hex(32), created: 'Oct 28, 2026', shown: false }
  ]);
  const [settings, setSettings] = useState({ max: 5, base: 2, mult: 2, jitter: true, timeout: 10, auto: false });

  // Metrics
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

  const toast = useCallback((msg: string, kind = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, kind }].slice(-3));
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);

  const copyToClipboard = (txt: string) => {
    navigator.clipboard?.writeText(txt);
    toast('Copied to clipboard.', 'ok');
  };

  useEffect(() => {
    const ticker = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(ticker);
  }, []);

  // Background stream pulse
  useEffect(() => {
    if (!live) return;
    const interval = setInterval(() => {
      const ep = pick(endpoints);
      const isFail = Math.random() < 0.09;
      const cls = CLS_BY_PROV[ep.provider] || 'schema';
      const isHealed = isFail && diags[cls]?.status === 'applied';
      const amt = pick([45000, 75000, 120000]);

      const newEv = {
        id: 'evt_' + hex(10),
        provider: ep.provider,
        type: ep.provider === 'shopify' ? 'orders/create' : 'charge.success',
        dest: ep.dest,
        ts: Date.now(),
        usd: isFail ? amt / 1550 : 0,
        status: isHealed ? 'healed' : isFail ? 'failed' : 'ok',
        latency: rnd(18, 42),
        cls: isFail || isHealed ? cls : null,
        headers: { 'content-type': 'application/json', host: 'gateway.jumcart.com', 'x-jumcart-endpoint': ep.proxy },
        body: { event: 'charge.success', data: { id: 'tx_' + hex(8), amount: amt, currency: 'NGN' } },
        resp: { code: isFail && !isHealed ? 422 : 200, body: isFail && !isHealed ? { error: 'schema_error' } : { status: 'success' } },
        attempts: [{ n: 1, code: isFail && !isHealed ? 422 : 200, text: isFail && !isHealed ? 'Unprocessable' : 'OK', ms: rnd(18, 35), ok: !isFail || isHealed }]
      };

      setEvents((prev) => [newEv, ...prev].slice(0, 70));
    }, 3200);

    return () => clearInterval(interval);
  }, [live, endpoints, diags]);

  // Handle Endpoint Generation
  const handleGenerateEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!genUrl.startsWith('http')) {
      toast('Enter a valid URL starting with http:// or https://', 'bad');
      return;
    }
    const newEp = {
      id: 'ep_' + hex(6),
      name: `${PROV[genProv].name} · ${host(genUrl).split('/')[0]}`,
      provider: genProv,
      dest: genUrl,
      proxy: 'gonze_live_' + digits(6),
      active: true,
      ev24h: 0,
      rate: 100
    };
    setEndpoints((prev) => [newEp, ...prev]);
    setActiveProxy(newEp);
    toast('Proxy generated successfully.', 'ok');
  };

  // Handle AI Patch Approval
  const handleApprovePatch = async (cls: string) => {
    setDiags((prev) => ({ ...prev, [cls]: { status: 'applying', step: 0 } }));
    for (let i = 0; i < 4; i++) {
      setDiags((prev) => ({ ...prev, [cls]: { status: 'applying', step: i } }));
      await sleep(550);
    }

    let recovered = 0;
    setEvents((prev) =>
      prev.map((e) => {
        if (e.cls === cls && e.status === 'failed') {
          recovered += e.usd;
          return { ...e, status: 'healed', note: `Auto-repaired by ${RULE[cls]} and delivered.` };
        }
        return e;
      })
    );

    setMetrics((m) => ({ ...m, rev: m.rev + recovered }));
    setDiags((prev) => ({ ...prev, [cls]: { status: 'applied', step: 4 } }));
    toast(`Rule ${RULE[cls]} is now active on 14 edge regions.`, 'ok');
  };

  // Handle Replay Engine
  const handleRunReplay = async (targetIds: string[]) => {
    if (running || !targetIds.length) return;
    setRunning(true);
    cancelReplay.current = false;

    setLogs((l) => [...l, { id: Date.now(), k: 'cmd', t: `$ jumcart replay --events ${targetIds.length} --max-attempts ${settings.max}` }]);

    for (const id of targetIds) {
      if (cancelReplay.current) break;
      const ev = events.find((e) => e.id === id);
      if (!ev) continue;

      setLogs((l) => [...l, { id: Date.now(), k: 'info', t: `▸ ${ev.id} ${ev.type} → ${host(ev.dest)}` }]);
      await sleep(350);

      const isPatched = diags[ev.cls]?.status === 'applied';
      if (isPatched) {
        setLogs((l) => [...l, { id: Date.now(), k: 'ok', t: `  ✓ 200 OK (24 ms) · auto-patched by ${RULE[ev.cls]}` }]);
        setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'healed', note: 'Delivered via replay engine.' } : e)));
      } else {
        setLogs((l) => [...l, { id: Date.now(), k: 'bad', t: `  ✗ 422 Unprocessable · retry attempt 2/3...` }]);
        await sleep(300);
        setLogs((l) => [...l, { id: Date.now(), k: 'ok', t: `  ✓ 200 OK on attempt 2 · delivered` }]);
        setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'healed', note: 'Delivered on attempt 2.' } : e)));
      }
    }

    setRunning(false);
    setRsel({});
    setLogs((l) => [...l, { id: Date.now(), k: 'cmd', t: `done · replay batch finished.` }]);
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
  const failedEvents = events.filter((e) => e.status === 'failed');
  const failedCount = failedEvents.length;

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
          <nav className="flex gap-2 overflow-x-auto no-scrollbar border-t border-[#1c232d]/40">
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
              <div className="text-2xl font-bold mt-1.5 text-[#4cc9f0]">{money(metrics.rev)}</div>
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

        {/* VIEW 1: LIVE STREAM */}
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
                  onClick={() => {
                    const failedIds = failedEvents.map((e) => e.id);
                    setTab('replay');
                    handleRunReplay(failedIds);
                  }}
                  disabled={failedCount === 0}
                  className="inline-flex items-center gap-1.5 text-xs bg-[#8ea3ff] text-[#0a0d18] px-3 py-1.5 rounded font-semibold hover:bg-[#a5b6ff] disabled:opacity-40 transition"
                >
                  <Icon name="RotateCcw" size={13} /> Replay Failed ({failedCount})
                </button>
              </div>
            </div>

            {/* Filters */}
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

        {/* VIEW 2: ENDPOINTS & PROXIES */}
        {tab === 'endpoints' && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-4">
              <div>
                <h2 className="font-bold text-base">Drop-In Proxy Generator</h2>
                <p className="text-xs text-[#8d98a7] mt-1">Route webhooks through Jumcart for automated retries and schema repair.</p>
              </div>

              <form onSubmit={handleGenerateEndpoint} className="space-y-3">
                <div>
                  <label className="text-xs text-[#8d98a7] block mb-1">Your Backend Target URL</label>
                  <input
                    type="text"
                    value={genUrl}
                    onChange={(e) => setGenUrl(e.target.value)}
                    className="w-full bg-[#090b0f] border border-[#2a3340] rounded px-3 py-2 text-xs font-mono text-[#e8ecf1]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8d98a7] block mb-1">Who Sends the Webhooks</label>
                  <select
                    value={genProv}
                    onChange={(e) => setGenProv(e.target.value)}
                    className="w-full bg-[#090b0f] border border-[#2a3340] rounded px-3 py-2 text-xs text-[#e8ecf1]"
                  >
                    {Object.keys(PROV).map((k) => (
                      <option key={k} value={k}>{PROV[k].name}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-[#8ea3ff] text-[#0a0d18] text-xs font-semibold px-4 py-2 rounded inline-flex items-center gap-1.5 hover:bg-[#a5b6ff] transition"
                >
                  <Icon name="Zap" size={13} /> Generate Proxy URL
                </button>
              </form>

              <hr className="border-[#1c232d]" />

              <div className="space-y-2">
                <span className="font-mono text-xs text-[#5d6877] uppercase block">Assigned Proxy URL</span>
                <div className="flex items-center gap-2">
                  <div className="p-2.5 bg-[#090b0f] border border-[#1c232d] rounded text-xs font-mono text-[#8ea3ff] flex-1 truncate">
                    https://jumcart-gateway.vercel.app/api/p/{activeProxy.proxy}
                  </div>
                  <button
                    onClick={() => copyToClipboard(`https://jumcart-gateway.vercel.app/api/p/${activeProxy.proxy}`)}
                    className="p-2 bg-[#141a22] border border-[#2a3340] rounded hover:border-[#5d6877]"
                  >
                    <Icon name="Copy" size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-base">Active Endpoints ({endpoints.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#1c232d] text-[#5d6877] uppercase text-[11px]">
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Proxy Inbound</th>
                      <th className="py-2 px-3">Target</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c232d]">
                    {endpoints.map((ep) => (
                      <tr key={ep.id}>
                        <td className="py-2.5 px-3 font-sans font-semibold text-[#e8ecf1]">{ep.name}</td>
                        <td className="py-2.5 px-3 text-[#8ea3ff]">{ep.proxy}</td>
                        <td className="py-2.5 px-3 text-[#8d98a7] max-w-[200px] truncate">{ep.dest}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-[#3ecf8e] bg-[#3ecf8e]/10 px-2 py-0.5 rounded font-sans text-xs">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: SELF-HEALING DIAGNOSTICS */}
        {tab === 'healing' && (
          <div className="space-y-4">
            <h2 className="font-bold text-base">Self-Healing Diagnostics</h2>
            <div className="grid gap-4">
              {['schema', 'timeout', 'locked', 'secret'].map((c) => {
                const d = DIAG[c];
                const st = diags[c];
                const count = events.filter((e) => e.cls === c && e.status === 'failed').length;

                return (
                  <div key={c} className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded grid place-items-center ${st.status === 'applied' ? 'bg-[#3ecf8e]/10 text-[#3ecf8e]' : 'bg-[#ff6370]/10 text-[#ff6370]'}`}>
                          <Icon name={d.icon} size={16} />
                        </div>
                        <div>
                          <div className="font-bold text-sm">{d.title}</div>
                          <div className="font-mono text-xs text-[#5d6877]">{d.scope}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#8d98a7]">Confidence: {d.conf}%</span>
                        <span className={`px-2.5 py-0.5 rounded font-mono text-xs ${st.status === 'applied' ? 'bg-[#3ecf8e]/10 text-[#3ecf8e]' : 'bg-[#ff6370]/10 text-[#ff6370]'}`}>
                          {st.status === 'applied' ? 'Rule Active' : `${count} Failures`}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#141a22] rounded border border-[#2a3340] text-xs text-[#e8ecf1]">
                      {d.diagnosis(count || 4)}
                    </div>

                    <div className="bg-[#090b0f] border border-[#1c232d] rounded p-3 font-mono text-xs space-y-1">
                      {d.patch.map((l: any, i: number) => (
                        <div key={i} className={l.t === 'add' ? 'text-[#3ecf8e]' : l.t === 'del' ? 'text-[#ff6370]' : 'text-[#8d98a7]'}>
                          {l.s}
                        </div>
                      ))}
                    </div>

                    {st.status === 'applying' && (
                      <div className="p-3 bg-[#141a22] rounded border border-[#2a3340] space-y-2 text-xs font-mono">
                        {d.steps.map((s: string, idx: number) => (
                          <div key={idx} className={idx <= st.step ? 'text-[#3ecf8e]' : 'text-[#5d6877]'}>
                            {idx < st.step ? '✓ ' : idx === st.step ? '⟳ ' : '○ '} {s}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      {st.status === 'applied' ? (
                        <span className="text-xs text-[#3ecf8e] inline-flex items-center gap-1 font-semibold">
                          <Icon name="ShieldCheck" size={14} /> Rule deployed to edge. Future incoming events are automatically normalized.
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApprovePatch(c)}
                          disabled={st.status === 'applying'}
                          className="bg-[#3ecf8e] text-[#04150d] text-xs font-semibold px-4 py-2 rounded inline-flex items-center gap-1.5 hover:bg-[#5ddda5] transition"
                        >
                          <Icon name="Check" size={13} /> {st.status === 'applying' ? 'Deploying...' : `Approve & Deploy Auto-Patch (${count})`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: REPLAY ENGINE */}
        {tab === 'replay' && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-base">Dead-Letter Queue</h2>
                <span className="font-mono text-xs text-[#5d6877]">{failedCount} Failed</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const ids = failedEvents.map((e) => e.id);
                    handleRunReplay(ids);
                  }}
                  disabled={running || failedCount === 0}
                  className="bg-[#8ea3ff] text-[#0a0d18] text-xs font-semibold px-3 py-1.5 rounded inline-flex items-center gap-1 hover:bg-[#a5b6ff] disabled:opacity-40"
                >
                  <Icon name="RotateCcw" size={13} /> Replay All Failed ({failedCount})
                </button>
                {running && (
                  <button
                    onClick={() => { cancelReplay.current = true; }}
                    className="border border-[#ff6370] text-[#ff6370] text-xs px-3 py-1.5 rounded"
                  >
                    Stop
                  </button>
                )}
              </div>

              <div className="max-h-[380px] overflow-y-auto divide-y divide-[#1c232d] border border-[#1c232d] rounded">
                {failedEvents.map((e) => (
                  <div key={e.id} className="p-3 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-mono font-semibold text-[#e8ecf1]">{e.type}</div>
                      <div className="font-mono text-[11px] text-[#5d6877]">{e.id} · {host(e.dest)}</div>
                    </div>
                    <button
                      onClick={() => handleRunReplay([e.id])}
                      disabled={running}
                      className="px-2 py-1 bg-[#141a22] border border-[#2a3340] rounded text-[11px] font-mono hover:border-[#8d98a7]"
                    >
                      Replay
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg flex flex-col overflow-hidden">
              <div className="bg-[#141a22] px-3.5 py-2.5 border-b border-[#1c232d] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-[#8d98a7]">
                  <Icon name="Terminal" size={13} /> jumcart-cli replay
                </div>
                <button
                  onClick={() => setLogs([{ id: Date.now(), k: 'dim', t: 'Terminal cleared.' }])}
                  className="text-[11px] text-[#5d6877] hover:text-[#e8ecf1]"
                >
                  Clear
                </button>
              </div>
              <div className="p-4 bg-[#05070a] font-mono text-xs flex-1 h-[420px] overflow-y-auto space-y-1.5">
                {logs.map((l) => (
                  <div
                    key={l.id}
                    className={l.k === 'cmd' ? 'text-[#8ea3ff]' : l.k === 'ok' ? 'text-[#3ecf8e]' : l.k === 'bad' ? 'text-[#ff6370]' : 'text-[#8d98a7]'}
                  >
                    {l.t}
                  </div>
                ))}
                {running ? (
                  <div className="w-2 h-4 bg-[#e8ecf1] animate-pulse inline-block" />
                ) : (
                  <div className="text-[#5d6877]">$ _</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: SETTINGS & KEYS */}
        {tab === 'keys' && (
          <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-5">
            <h2 className="font-bold text-base">API Authentication & Retry Policy</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1c232d] text-[#5d6877] uppercase text-[11px]">
                    <th className="py-2 px-3">Key Name</th>
                    <th className="py-2 px-3">Secret Key Token</th>
                    <th className="py-2 px-3">Env</th>
                    <th className="py-2 px-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c232d]">
                  {keys.map((k) => (
                    <tr key={k.id}>
                      <td className="py-3 px-3 font-sans font-semibold text-[#e8ecf1]">{k.name}</td>
                      <td className="py-3 px-3 text-[#8ea3ff] flex items-center gap-2">
                        <span>{k.shown ? k.value : k.value.slice(0, 14) + '••••••••••••••••'}</span>
                        <button
                          onClick={() => setKeys((prev) => prev.map((x) => (x.id === k.id ? { ...x, shown: !x.shown } : x)))}
                          className="text-[#5d6877] hover:text-[#e8ecf1]"
                        >
                          <Icon name={k.shown ? 'EyeOff' : 'Eye'} size={13} />
                        </button>
                        <button onClick={() => copyToClipboard(k.value)} className="text-[#5d6877] hover:text-[#e8ecf1]">
                          <Icon name="Copy" size={13} />
                        </button>
                      </td>
                      <td className="py-3 px-3 uppercase text-[#3ecf8e]">{k.env}</td>
                      <td className="py-3 px-3 text-[#8d98a7]">{k.created}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

      {/* Floating Toast Alerts */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-[#141a22] border border-[#2a3340] shadow-2xl px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2"
          >
            <span className={t.kind === 'ok' ? 'text-[#3ecf8e]' : 'text-[#ff6370]'}>●</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="max-w-[1320px] mx-auto px-4 py-8 border-t border-[#1c232d] mt-12 flex flex-wrap justify-between items-center text-xs text-[#5d6877]">
        <div>© 2026 JumcartFlow. All rights reserved.</div>
        <div className="font-mono">Operated by JumcartFlow</div>
      </footer>
    </div>
  );
}
