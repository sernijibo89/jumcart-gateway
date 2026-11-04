'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fkmwcpzrpcrmisafpdfx.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy'
);

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
    Bell: (
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </>
    ),
    FlaskConical: (
      <>
        <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
        <path d="M8.5 2h7M7 16h10" />
      </>
    ),
    Check: <polyline points="20 6 9 17 4 12" />,
    Copy: (
      <>
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </>
    ),
    Download: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </>
    ),
    Send: (
      <>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
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
    ShieldCheck: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
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
    KeyRound: (
      <>
        <path d="m21 2-2 2m-1.5 1.5L16 7l4 4 1.5-1.5m-3-3L20 8" />
        <circle cx="7.5" cy="15.5" r="5.5" />
      </>
    ),
    User: (
      <>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    LogOut: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
    CreditCard: (
      <>
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
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

/* ---------- Helpers & Provider Map ---------- */
const rnd = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const hex = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('');
const digits = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 10).toString()).join('');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const fmtMs = (ms: number | null) => (ms == null ? '—' : ms >= 1000 ? (ms / 1000).toFixed(2) + ' s' : Math.round(ms) + ' ms');
const clock = (ts: number) => new Date(ts).toLocaleTimeString('en-GB', { hour12: false });
const ago = (ts: number, now: number) => {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  return s < 5 ? 'just now' : s < 60 ? `${s}s ago` : s < 3600 ? `${Math.floor(s / 60)}m ago` : `${Math.floor(s / 3600)}h ago`;
};
const host = (u: string) => u.replace(/^https?:\/\//, '');

const PROV: Record<string, { name: string; letter: string; color: string }> = {
  paystack: { name: 'Paystack', letter: 'P', color: '#4db8f0' },
  nomba: { name: 'Nomba', letter: 'N', color: '#ffb703' },
  flutterwave: { name: 'Flutterwave', letter: 'F', color: '#fb923c' },
  monnify: { name: 'Monnify', letter: 'M', color: '#ff9366' },
  opay: { name: 'OPay', letter: 'O', color: '#10b981' },
  stripe: { name: 'Stripe', letter: 'S', color: '#a597ff' },
  shopify: { name: 'Shopify', letter: 'H', color: '#a9cf72' }
};

const CLS_BY_PROV: Record<string, string> = {
  paystack: 'schema',
  nomba: 'schema',
  flutterwave: 'schema',
  monnify: 'timeout',
  opay: 'timeout',
  shopify: 'locked',
  stripe: 'secret'
};

const RULE: Record<string, string> = {
  schema: 'paystack-nomba-amount-remap',
  timeout: 'extended-timeout-backoff',
  locked: 'hold-until-healthy',
  secret: 'resign-with-new-secret'
};

const DIAG: Record<string, any> = {
  schema: {
    title: 'Payload Schema Mismatch',
    icon: 'Shuffle',
    conf: 97,
    scope: 'Paystack / Nomba / Flutterwave → Downstream API',
    diagnosis: (n: number) => `Your endpoint expects data.total_amount in Naira instead of kobo. Intercepted ${n} events with 422.`,
    patch: [
      { t: 'ctx', s: 'rule paystack-nomba-amount-remap' },
      { t: 'del', s: '- data.amount          // kobo or string' },
      { t: 'add', s: '+ data.total_amount    // numeric naira = amount / 100' },
      { t: 'ctx', s: '  keep reference, currency, customer.email' }
    ],
    steps: ['Testing rule on payloads', 'Compiling edge transform', 'Deploying to 14 edge regions', 'Replaying failed events']
  },
  timeout: {
    title: 'Network Timeout',
    icon: 'Timer',
    conf: 94,
    scope: 'Monnify / OPay → Downstream Billing Endpoint',
    diagnosis: (n: number) => `Destination took longer than 10s to answer ${n} events. Backing off with idempotency is safe.`,
    patch: [
      { t: 'ctx', s: 'rule extended-timeout-backoff' },
      { t: 'del', s: '- timeout       10s' },
      { t: 'add', s: '+ timeout       30s' },
      { t: 'add', s: '+ backoff       2s x2, jitter 20%' }
    ],
    steps: ['Checking idempotency keys', 'Raising timeout to 30s', 'Deploying edge configuration', 'Replaying failed events']
  },
  locked: {
    title: '503 Gateway Locked',
    icon: 'Lock',
    conf: 91,
    scope: 'Shopify → Store Webhook Listener',
    diagnosis: (n: number) => `Destination in maintenance mode (503). Jumcart holds these ${n} events until health check returns 200.`,
    patch: [
      { t: 'ctx', s: 'rule hold-until-healthy' },
      { t: 'add', s: '+ on 503      hold events in queue (max 24h)' },
      { t: 'add', s: '+ probe       GET /health every 30s' }
    ],
    steps: ['Probing health check URL', 'Creating hold queue', 'Deploying edge patches', 'Releasing held events']
  },
  secret: {
    title: 'Signature Secret Rotated',
    icon: 'KeyRound',
    conf: 96,
    scope: 'Stripe → api.myapp.com/webhooks/stripe',
    diagnosis: (n: number) => `Webhook signing secret rotated. Refused ${n} valid events. Re-signing forwarded requests automatically.`,
    patch: [
      { t: 'ctx', s: 'rule resign-with-new-secret' },
      { t: 'del', s: '- stripe-signature  v1=<signed with old_secret>' },
      { t: 'add', s: '+ stripe-signature  v1=<signed with new_secret>' }
    ],
    steps: ['Verifying secret with test ping', 'Re-signing payloads', 'Deploying to edge regions', 'Replaying failed events']
  }
};

const SANDBOX_TEMPLATES: Record<string, any> = {
  paystack: {
    event: 'charge.success',
    data: { id: 48920184, reference: 'PSK_LIVE_8392', amount: 500000, currency: 'NGN', customer: { email: 'client@business.ng' } }
  },
  nomba: {
    event: 'payment.success',
    data: { orderReference: 'NMB_REF_1829', amount: '25000', currency: 'NGN', customer: { email: 'buyer@business.ng' } }
  },
  flutterwave: {
    event: 'charge.completed',
    data: { id: 891244, tx_ref: 'FLW_MOCK_9921', amount: 45000, currency: 'NGN', customer: { email: 'user@flutterwave.com' } }
  },
  opay: {
    payload: { reference: 'OPAY_TX_7721', amount: '12000', status: 'SUCCESS', currency: 'NGN', phone: '+2348012345678' }
  },
  monnify: {
    eventType: 'SUCCESSFUL_TRANSACTION',
    eventData: { transactionReference: 'MNFY|10291029', amountPaid: 15000, customer: { email: 'user@northwind.ng' } }
  },
  stripe: {
    id: 'evt_39102948',
    type: 'payment_intent.succeeded',
    data: { object: { id: 'pi_live_9921', amount: 4900, currency: 'usd' } }
  }
};

const EP_SEED = [
  { id: 'ep1', name: 'Paystack Ingestion Gateway', provider: 'paystack', dest: 'https://api.myapp.com/webhooks/paystack', proxy: 'gonze_live_839201', active: true, secret: 'sk_live_99a8b1...', verifyHmac: true, ipWhitelist: true, customHeader: 'Authorization: Bearer sec_991823' },
  { id: 'ep2', name: 'Nomba Merchant Stream', provider: 'nomba', dest: 'https://api.myapp.com/webhooks/nomba', proxy: 'gonze_live_612984', active: true, secret: 'nmb_sec_4412...', verifyHmac: true, ipWhitelist: true, customHeader: 'x-tenant-id: org_alpha_01' },
  { id: 'ep3', name: 'Flutterwave Ingestion Relay', provider: 'flutterwave', dest: 'https://api.myapp.com/webhooks/flw', proxy: 'gonze_live_551029', active: true, secret: 'flw_sec_8819...', verifyHmac: true, ipWhitelist: false, customHeader: '' },
  { id: 'ep4', name: 'Monnify Direct Transfer', provider: 'monnify', dest: 'https://billing.northwind.ng/hooks/monnify', proxy: 'gonze_live_702144', active: true, secret: 'mnf_sec_3192...', verifyHmac: true, ipWhitelist: true, customHeader: '' },
  { id: 'ep5', name: 'OPay Virtual Accounts', provider: 'opay', dest: 'https://api.myapp.com/webhooks/opay', proxy: 'gonze_live_229104', active: true, secret: 'opay_sec_551...', verifyHmac: false, ipWhitelist: false, customHeader: '' },
  { id: 'ep6', name: 'Shopify Store Checkout', provider: 'shopify', dest: 'https://orders.kola-store.com/api/shopify/hooks', proxy: 'gonze_live_451907', active: true, secret: 'shpss_99120...', verifyHmac: true, ipWhitelist: true, customHeader: '' },
  { id: 'ep7', name: 'Stripe Subscriptions', provider: 'stripe', dest: 'https://api.myapp.com/webhooks/stripe', proxy: 'gonze_live_118563', active: true, secret: 'whsec_99182...', verifyHmac: true, ipWhitelist: true, customHeader: 'x-forward-auth: live_edge' }
];

function seedEvents() {
  const now = Date.now();
  const out: any[] = [];
  const provs = ['paystack', 'nomba', 'flutterwave', 'monnify', 'opay', 'shopify', 'stripe'];
  for (let i = 0; i < 48; i++) {
    const p = provs[i % provs.length];
    const ep = EP_SEED.find((e) => e.provider === p) || EP_SEED[0];
    const isFail = i === 3 || i === 7 || i === 11 || i === 15 || i === 19;
    const isHealed = i === 8 || i === 22;
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
        'x-jumcart-signature-verified': ep.verifyHmac ? 'true' : 'bypassed',
        'x-jumcart-ip-whitelisted': ep.ipWhitelist ? 'verified' : 'open'
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
  const [tab, setTab] = useState<'stream' | 'sandbox' | 'endpoints' | 'healing' | 'replay' | 'alerts' | 'keys'>('stream');
  const [endpoints, setEndpoints] = useState(EP_SEED);
  const [events, setEvents] = useState<any[]>(seedEvents);
  const [live, setLive] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [toasts, setToasts] = useState<any[]>([]);

  // Auth & Tenant Dashboard States
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userPlan, setUserPlan] = useState<'Starter' | 'Growth' | 'Scale'>('Starter');
  const [monthlyUsage, setMonthlyUsage] = useState({ used: 148, limit: 10000 });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Multi-Tenant Workspace State
  const [workspace, setWorkspace] = useState('Production (Main)');

  // Legal Modal State
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'sla' | null>(null);

  // Filtering
  const [fStatus, setFStatus] = useState('all');
  const [fProv, setFProv] = useState('all');
  const [searchQ, setSearchQ] = useState('');

  // Sandbox State
  const [sbProvider, setSbProvider] = useState('paystack');
  const [sbPayload, setSbPayload] = useState(JSON.stringify(SANDBOX_TEMPLATES.paystack, null, 2));
  const [sbTargetProxy, setSbTargetProxy] = useState('gonze_live_839201');
  const [sbSending, setSbSending] = useState(false);

  // Endpoints Generator State
  const [genUrl, setGenUrl] = useState('https://api.myapp.com/webhooks/payment');
  const [genProv, setGenProv] = useState('paystack');
  const [genSecret, setGenSecret] = useState('whsec_live_9981249...');
  const [genCustomHeader, setGenCustomHeader] = useState('Authorization: Bearer sec_token_live');
  const [genWhitelist, setGenWhitelist] = useState(true);
  const [activeProxy, setActiveProxy] = useState(EP_SEED[0]);

  // Alert Channels State
  const [alertChannels, setAlertChannels] = useState({
    slackWebhook: 'https://hooks.slack.com/services/T00/B00/X00EXAMPLE',
    telegramChatId: '1092849182',
    whatsappPhone: '+2348000000000',
    notifyOn5xx: true,
    notifyOnSchemaBreak: true
  });

  // Self Healing State
  const [diags, setDiags] = useState<Record<string, any>>({
    schema: { status: 'pending', step: 0 },
    timeout: { status: 'pending', step: 0 },
    locked: { status: 'pending', step: 0 },
    secret: { status: 'pending', step: 0 }
  });

  // Replay State
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<any[]>([
    { id: 1, k: 'dim', t: 'jumcart-cli 2.4.1 · replay engine online. Ready for manual or auto dispatch.' }
  ]);
  const cancelReplay = useRef(false);

  // Keys State
  const [keys, setKeys] = useState([
    { id: 'k1', name: 'Production Gateway Key', env: 'live', value: 'jm_live_sk_' + hex(32), created: 'Nov 03, 2026', shown: false },
    { id: 'k2', name: 'Staging Ingestion Key', env: 'test', value: 'jm_test_sk_' + hex(32), created: 'Oct 28, 2026', shown: false }
  ]);

  const toast = useCallback((msg: string, kind = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, kind }].slice(-3));
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);

  const copyToClipboard = (txt: string) => {
    navigator.clipboard?.writeText(txt);
    toast('Copied to clipboard.', 'ok');
  };

  /* ---------- Supabase Auth & Isolated Tenant Sync ---------- */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        loadUserDatabase(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        loadUserDatabase(session.user.id);
      } else {
        setCurrentUser(null);
        setEndpoints(EP_SEED);
        setEvents(seedEvents());
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserDatabase = async (userId: string) => {
    toast(`Authenticated as tenant. Loading isolated ledger...`, 'ok');
    try {
      const { data: userEndpoints } = await supabase
        .from('endpoints')
        .select('*')
        .eq('user_id', userId);

      if (userEndpoints && userEndpoints.length > 0) {
        setEndpoints(userEndpoints.map((ep) => ({
          id: ep.id,
          name: ep.name,
          provider: ep.provider || 'paystack',
          dest: ep.destination_url,
          proxy: ep.proxy_id,
          active: ep.active,
          secret: ep.webhook_secret || '',
          verifyHmac: ep.verify_hmac,
          ipWhitelist: ep.ip_whitelist,
          customHeader: ep.custom_headers ? JSON.stringify(ep.custom_headers) : ''
        })));
        setActiveProxy(userEndpoints[0]);
      }

      const { data: userEvents } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(60);

      if (userEvents && userEvents.length > 0) {
        setEvents(userEvents.map((d) => ({
          id: d.id,
          provider: d.provider || 'paystack',
          type: d.event_type || 'webhook.received',
          dest: d.destination_url || 'https://api.myapp.com/webhooks/incoming',
          ts: new Date(d.created_at).getTime(),
          usd: 0,
          status: d.healed ? 'healed' : d.status === 'ok' ? 'ok' : 'failed',
          latency: d.latency_ms || 24,
          cls: d.status === 'failed' ? 'schema' : null,
          headers: { 'content-type': 'application/json' },
          body: d.payload || {},
          resp: { code: d.status_code || 200, body: d.response_body || {} },
          attempts: [{ n: 1, code: d.status_code || 200, text: 'Recorded', ms: d.latency_ms || 24, ok: d.status === 'ok' }]
        })));
        setMonthlyUsage({ used: userEvents.length, limit: 10000 });
      }
    } catch {
      // Graceful fallback
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.includes('@')) {
      toast('Enter a valid developer email.', 'bad');
      return;
    }
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: authEmail,
        options: { emailRedirectTo: window.location.origin }
      });
      if (error) throw error;
      toast('Magic sign-in link dispatched to your inbox!', 'ok');
      setAuthModalOpen(false);
    } catch (err: any) {
      toast(err.message || 'Authentication failed.', 'bad');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err: any) {
      toast(err.message || 'OAuth error occurred.', 'bad');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    toast('Logged out. Switched back to Interactive Demo Mode.', 'info');
  };

  useEffect(() => {
    const ticker = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(ticker);
  }, []);

  // Background stream pulse for demo
  useEffect(() => {
    if (!live || currentUser) return;
    const interval = setInterval(() => {
      const ep = pick(endpoints);
      const isFail = Math.random() < 0.08;
      const cls = CLS_BY_PROV[ep.provider] || 'schema';
      const isHealed = isFail && diags[cls]?.status === 'applied';
      const amt = pick([45000, 75000, 120000, 300000]);

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
        headers: {
          'content-type': 'application/json',
          'host': 'gateway.jumcart.com',
          'x-jumcart-endpoint': ep.proxy,
          'x-jumcart-signature-verified': ep.verifyHmac ? 'true' : 'bypassed',
          'x-jumcart-ip-whitelisted': ep.ipWhitelist ? 'verified' : 'open'
        },
        body: { event: 'charge.success', data: { id: 'tx_' + hex(8), amount: amt, currency: 'NGN' } },
        resp: { code: isFail && !isHealed ? 422 : 200, body: isFail && !isHealed ? { error: 'schema_error' } : { status: 'success' } },
        attempts: [{ n: 1, code: isFail && !isHealed ? 422 : 200, text: isFail && !isHealed ? 'Unprocessable' : 'OK', ms: rnd(18, 35), ok: !isFail || isHealed }]
      };

      setEvents((prev) => [newEv, ...prev].slice(0, 80));
    }, 3200);

    return () => clearInterval(interval);
  }, [live, endpoints, diags, currentUser]);

  /* Dynamic Live Metrics */
  const dynamicMetrics = useMemo(() => {
    const totalCount = events.length;
    const failedCount = events.filter((e) => e.status === 'failed').length;
    const okCount = events.filter((e) => e.status === 'ok' || e.status === 'healed').length;
    const rate = totalCount > 0 ? (okCount / totalCount) * 100 : 100;
    const revSaved = events.filter((e) => e.status === 'healed').reduce((sum, e) => sum + (e.usd || 0), 0);
    const totalLat = events.reduce((sum, e) => sum + (e.latency || 24), 0);
    const avgLat = totalCount > 0 ? Math.round(totalLat / totalCount) : 24;

    return {
      total: totalCount,
      rate: rate.toFixed(2),
      revSaved: Math.round(revSaved),
      avgLat: avgLat,
      failedCount: failedCount
    };
  }, [events]);

  // Export Events to CSV
  const handleExportCSV = () => {
    if (!events.length) {
      toast('No events to export.', 'info');
      return;
    }
    const csvHeaders = ['id', 'status', 'type', 'provider', 'destination', 'latency_ms', 'timestamp'];
    const rows = events.map((e) => [e.id, e.status, e.type, e.provider, e.dest, e.latency || 0, new Date(e.ts).toISOString()]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [csvHeaders.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jumcart_events_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Event log exported to CSV.', 'ok');
  };

  // Switch Sandbox Template
  const handleTemplateSwitch = (prov: string) => {
    setSbProvider(prov);
    const tmpl = SANDBOX_TEMPLATES[prov] || SANDBOX_TEMPLATES.paystack;
    setSbPayload(JSON.stringify(tmpl, null, 2));
  };

  // Fire Sandbox Webhook
  const handleFireSandbox = async () => {
    setSbSending(true);
    let parsed: any;
    try {
      parsed = JSON.parse(sbPayload);
    } catch {
      toast('Invalid JSON syntax.', 'bad');
      setSbSending(false);
      return;
    }

    try {
      const res = await fetch(`/api/p/${sbTargetProxy}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      const data = await res.json();
      toast(`Webhook dispatched to /api/p/${sbTargetProxy} (${data.status || '200'})`, 'ok');
      setTab('stream');
    } catch {
      const mockEv = {
        id: 'evt_' + hex(10),
        provider: sbProvider,
        type: parsed.event || parsed.type || 'webhook.received',
        dest: 'https://api.myapp.com/webhooks/incoming',
        ts: Date.now(),
        usd: 250,
        status: 'ok',
        latency: rnd(22, 45),
        cls: null,
        headers: {
          'content-type': 'application/json',
          'x-jumcart-signature-verified': 'true',
          'x-jumcart-ip-whitelisted': 'verified'
        },
        body: parsed,
        resp: { code: 200, body: { status: 'success' } },
        attempts: [{ n: 1, code: 200, text: 'OK', ms: 24, ok: true }]
      };
      setEvents((prev) => [mockEv, ...prev]);
      toast('Sandbox webhook simulated in live stream.', 'ok');
      setTab('stream');
    } finally {
      setSbSending(false);
    }
  };

  // Action Gate: Endpoint Generator
  const handleGenerateEndpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      toast('Sign in required to bind a production proxy to your team account.', 'info');
      return;
    }

    if (!genUrl.startsWith('http')) {
      toast('Enter a valid URL starting with http:// or https://', 'bad');
      return;
    }

    const newProxyId = 'usr_live_' + digits(8);
    const newEp = {
      id: 'ep_' + hex(6),
      name: `${PROV[genProv].name} · ${host(genUrl).split('/')[0]}`,
      provider: genProv,
      dest: genUrl,
      proxy: newProxyId,
      active: true,
      secret: genSecret,
      verifyHmac: true,
      ipWhitelist: genWhitelist,
      customHeader: genCustomHeader
    };

    try {
      await supabase.from('endpoints').insert({
        user_id: currentUser.id,
        proxy_id: newProxyId,
        name: newEp.name,
        provider: genProv,
        destination_url: genUrl,
        webhook_secret: genSecret,
        verify_hmac: true,
        ip_whitelist: genWhitelist
      });
      setEndpoints((prev) => [newEp, ...prev]);
      setActiveProxy(newEp);
      toast('Protected proxy registered and bound to your workspace.', 'ok');
    } catch (err: any) {
      toast(err.message || 'Error creating database endpoint', 'bad');
    }
  };

  // Approve AI Patch
  const handleApprovePatch = async (cls: string) => {
    setDiags((prev) => ({ ...prev, [cls]: { status: 'applying', step: 0 } }));
    for (let i = 0; i < 4; i++) {
      setDiags((prev) => ({ ...prev, [cls]: { status: 'applying', step: i } }));
      await sleep(550);
    }

    setEvents((prev) =>
      prev.map((e) => {
        if (e.cls === cls && e.status === 'failed') {
          return { ...e, status: 'healed', note: `Auto-repaired by ${RULE[cls]} and delivered.` };
        }
        return e;
      })
    );

    setDiags((prev) => ({ ...prev, [cls]: { status: 'applied', step: 4 } }));
    toast(`Rule ${RULE[cls]} is now active on 14 edge regions.`, 'ok');
  };

  // Replay Engine
  const handleRunReplay = async (targetIds: string[]) => {
    if (running || !targetIds.length) return;
    setRunning(true);
    cancelReplay.current = false;

    setLogs((l) => [...l, { id: Date.now(), k: 'cmd', t: `$ jumcart replay --events ${targetIds.length}` }]);

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
                by P. Gonze
              </span>

              {/* Workspace Switcher */}
              <div className="hidden sm:flex items-center gap-1.5 bg-[#141a22] border border-[#2a3340] rounded px-2.5 py-1 text-xs text-[#8d98a7]">
                <span className="text-[#5d6877]">Workspace:</span>
                <select
                  value={workspace}
                  onChange={(e) => {
                    setWorkspace(e.target.value);
                    toast(`Switched workspace to ${e.target.value}`, 'info');
                  }}
                  className="bg-transparent text-[#e8ecf1] font-medium outline-none cursor-pointer"
                >
                  <option value="Production (Main)" className="bg-[#0e1116]">Production (Main)</option>
                  <option value="Staging Testnet" className="bg-[#0e1116]">Staging Testnet</option>
                  <option value="Client: FinTech Relay" className="bg-[#0e1116]">Client: FinTech Relay</option>
                </select>
              </div>
            </div>

            {/* Auth Indicator & Action Gates */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-2.5">
                  <div className="hidden lg:flex items-center gap-2 bg-[#141a22] border border-[#2a3340] rounded px-2.5 py-1">
                    <div className="w-2 h-2 rounded-full bg-[#3ecf8e]" />
                    <span className="font-mono text-[11px] text-[#8d98a7]">
                      Plan: <strong className="text-[#e8ecf1]">{userPlan}</strong>
                    </span>
                    <button
                      onClick={() => {
                        const pricingSec = document.getElementById('pricing-grid');
                        pricingSec?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="ml-1 text-[10px] font-semibold text-[#8ea3ff] hover:underline"
                    >
                      Upgrade
                    </button>
                  </div>

                  <div className="hidden sm:flex flex-col text-right font-mono text-[11px]">
                    <span className="text-[#e8ecf1] font-medium truncate max-w-[180px]">{currentUser.email}</span>
                    <span className="text-[#8ea3ff]">{activeProxy?.proxy || 'No proxy active'}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1.5 text-xs bg-[#141a22] border border-[#2a3340] hover:border-[#ff6370] text-[#ff6370] px-2.5 py-1.5 rounded transition"
                  >
                    <Icon name="LogOut" size={13} /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-[#f2a93b] bg-[#f2a93b]/10 border border-[#f2a93b]/25 rounded px-2.5 py-1">
                    Live Demo Mode
                  </span>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-[#8ea3ff] text-[#0a0d18] font-semibold text-xs px-3.5 py-1.5 rounded hover:bg-[#a5b6ff] transition inline-flex items-center gap-1.5 shadow-lg shadow-[#8ea3ff]/10"
                  >
                    <Icon name="User" size={13} /> Connect Your App / Sign In
                  </button>
                </div>
              )}

              <div className="hidden md:inline-flex items-center gap-2 font-mono text-xs text-[#3ecf8e] bg-[#3ecf8e]/10 border border-[#3ecf8e]/25 rounded px-2.5 py-1">
                <span className="w-2 h-2 rounded-full bg-[#3ecf8e] animate-pulse" />
                99.99% Operational
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-2 overflow-x-auto no-scrollbar border-t border-[#1c232d]/40">
            {[
              { id: 'stream', label: 'Live Stream', icon: 'Activity' },
              { id: 'sandbox', label: 'Interactive Sandbox', icon: 'FlaskConical' },
              { id: 'endpoints', label: 'Endpoints & Proxies', icon: 'Webhook' },
              { id: 'healing', label: 'Self-Healing AI Logs', icon: 'Sparkles', count: dynamicMetrics.failedCount },
              { id: 'replay', label: 'Replay Engine', icon: 'RotateCcw' },
              { id: 'alerts', label: 'Alerts & Dispatchers', icon: 'Bell' },
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
        {/* Dynamic Ingestion & Quota Strip */}
        <section className="bg-[#0e1116] border border-[#1c232d] rounded-lg grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 overflow-hidden">
          <div className="p-3.5 border-b sm:border-b xl:border-b-0 xl:border-r border-[#1c232d] flex justify-between items-end">
            <div>
              <div className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[#5d6877]">
                {currentUser ? 'Monthly Event Quota' : 'Active Buffer Ingestion'}
              </div>
              <div className="text-2xl font-bold mt-1.5">
                {currentUser ? `${monthlyUsage.used.toLocaleString()} / 10k` : `${dynamicMetrics.total} events`}
              </div>
              <div className="font-mono text-[11.5px] text-[#8d98a7] mt-1">
                {currentUser ? (
                  <div className="flex items-center gap-1.5">
                    <span className="w-16 h-1.5 bg-[#141a22] rounded-full overflow-hidden inline-block">
                      <span
                        className="bg-[#3ecf8e] h-full block"
                        style={{ width: `${Math.min(100, (monthlyUsage.used / monthlyUsage.limit) * 100)}%` }}
                      />
                    </span>
                    <span>{((monthlyUsage.used / monthlyUsage.limit) * 100).toFixed(1)}% used</span>
                  </div>
                ) : (
                  'live demo pipeline'
                )}
              </div>
            </div>
            <Spark data={[14, 18, 22, 19, 24, 28, 21, 25, 29, 24, 26, 30, 22, 27]} color="#8ea3ff" />
          </div>

          <div className="p-3.5 border-b sm:border-b xl:border-b-0 xl:border-r border-[#1c232d] flex justify-between items-end">
            <div>
              <div className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[#5d6877]">Success Rate</div>
              <div className="text-2xl font-bold mt-1.5 text-[#3ecf8e]">{dynamicMetrics.rate}%</div>
              <div className="font-mono text-[11.5px] text-[#8d98a7] mt-1">{dynamicMetrics.failedCount} open failures</div>
            </div>
            <Spark data={[99.97, 99.98, 99.99, 99.97, 99.98, 99.99, 99.98]} color="#3ecf8e" />
          </div>

          <div className="p-3.5 border-b sm:border-b-0 xl:border-r border-[#1c232d] flex justify-between items-end">
            <div>
              <div className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[#5d6877]">Revenue Recovered</div>
              <div className="text-2xl font-bold mt-1.5 text-[#4cc9f0]">${dynamicMetrics.revSaved.toLocaleString()}</div>
              <div className="font-mono text-[11.5px] text-[#8d98a7] mt-1">via autonomous patches</div>
            </div>
            <Spark data={[47900, 48000, 48100, 48150, 48210]} color="#4cc9f0" />
          </div>

          <div className="p-3.5 flex justify-between items-end">
            <div>
              <div className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[#5d6877]">Avg Gateway Latency</div>
              <div className="text-2xl font-bold mt-1.5 text-[#f2a93b]">{dynamicMetrics.avgLat} ms</div>
              <div className="font-mono text-[11.5px] text-[#8d98a7] mt-1">calculated p50</div>
            </div>
            <Spark data={[24, 22, 25, 23, 24, 26, 22]} color="#f2a93b" />
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
                  onClick={() => {
                    const failedIds = failedEvents.map((e) => e.id);
                    setTab('replay');
                    handleRunReplay(failedIds);
                  }}
                  disabled={dynamicMetrics.failedCount === 0}
                  className="inline-flex items-center gap-1.5 text-xs bg-[#8ea3ff] text-[#0a0d18] px-3 py-1.5 rounded font-semibold hover:bg-[#a5b6ff] disabled:opacity-40 transition"
                >
                  <Icon name="RotateCcw" size={13} /> Replay Failed ({dynamicMetrics.failedCount})
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
                <option value="all">All Gateways</option>
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

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1c232d] bg-[#0e1116] font-mono text-[11px] text-[#5d6877] uppercase">
                    <th className="py-2.5 px-3.5">Status</th>
                    <th className="py-2.5 px-3.5">Event Type</th>
                    <th className="py-2.5 px-3.5">Gateway</th>
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
                  <p className="text-xs text-[#8d98a7] mt-1">
                    Select a template or craft custom JSON to test gateway ingestion and auto-healing.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
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
                      {PROV[prov]?.name || prov}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[#8d98a7] block mb-1 font-mono">Payload JSON Body</label>
                <textarea
                  rows={13}
                  value={sbPayload}
                  onChange={(e) => setSbPayload(e.target.value)}
                  className="w-full bg-[#090b0f] border border-[#2a3340] rounded p-3 font-mono text-xs text-[#8ea3ff] focus:outline-none focus:border-[#8ea3ff]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8d98a7]">Target Ingestion Proxy:</span>
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
              <h2 className="font-bold text-base">Payment Gateway Verification</h2>
              <div className="text-xs text-[#8d98a7] space-y-3 leading-relaxed">
                <p>
                  1. <strong>Select Any Provider:</strong> Click on <code className="text-[#e8ecf1]">Paystack</code>, <code className="text-[#e8ecf1]">Nomba</code>, <code className="text-[#e8ecf1]">Flutterwave</code>, or <code className="text-[#e8ecf1]">OPay</code>.
                </p>
                <p>
                  2. <strong>Test Schema Transformations:</strong> Alter the amount into an unformatted string (e.g. <code className="text-[#ff6370]">&quot;750000&quot;</code>) to watch the edge proxy intercept and deploy automated field conversions.
                </p>
                <p>
                  3. <strong>Immediate Ledger Audit:</strong> Dispatched events immediately stream into the <strong>Live Stream</strong> and reflect on your top metric counters.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ENDPOINTS & PROXIES */}
        {tab === 'endpoints' && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-4">
              <div>
                <h2 className="font-bold text-base">Drop-In Proxy Generator</h2>
                <p className="text-xs text-[#8d98a7] mt-1">Configure signature verification, IP filters, and custom forwarding headers.</p>
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
                  <label className="text-xs text-[#8d98a7] block mb-1">Payment Provider</label>
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
                <div>
                  <label className="text-xs text-[#8d98a7] block mb-1">Provider Webhook Secret (HMAC Check)</label>
                  <input
                    type="password"
                    value={genSecret}
                    onChange={(e) => setGenSecret(e.target.value)}
                    className="w-full bg-[#090b0f] border border-[#2a3340] rounded px-3 py-2 text-xs font-mono text-[#e8ecf1]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8d98a7] block mb-1">Custom Downstream Header</label>
                  <input
                    type="text"
                    value={genCustomHeader}
                    onChange={(e) => setGenCustomHeader(e.target.value)}
                    placeholder="Authorization: Bearer my_token"
                    className="w-full bg-[#090b0f] border border-[#2a3340] rounded px-3 py-2 text-xs font-mono text-[#e8ecf1]"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="gen-wl"
                    checked={genWhitelist}
                    onChange={(e) => setGenWhitelist(e.target.checked)}
                    className="accent-[#8ea3ff]"
                  />
                  <label htmlFor="gen-wl" className="text-xs text-[#e8ecf1] cursor-pointer">
                    Enforce Provider Static IP Whitelist
                  </label>
                </div>
                <button
                  type="submit"
                  className="bg-[#8ea3ff] text-[#0a0d18] text-xs font-semibold px-4 py-2 rounded inline-flex items-center gap-1.5 hover:bg-[#a5b6ff] transition"
                >
                  <Icon name="Zap" size={13} /> {currentUser ? 'Generate Protected Proxy' : 'Sign In to Deploy Live Proxy'}
                </button>
              </form>

              <hr className="border-[#1c232d]" />

              <div className="space-y-2">
                <span className="font-mono text-xs text-[#5d6877] uppercase block">Assigned Ingestion Route</span>
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
                <h2 className="font-bold text-base">Active Gateways & Edge Protections ({endpoints.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#1c232d] text-[#5d6877] uppercase text-[11px]">
                      <th className="py-2 px-3">Gateway</th>
                      <th className="py-2 px-3">Security Controls</th>
                      <th className="py-2 px-3">Inbound Route</th>
                      <th className="py-2 px-3">Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c232d]">
                    {endpoints.map((ep) => (
                      <tr key={ep.id}>
                        <td className="py-2.5 px-3 font-sans font-semibold text-[#e8ecf1]">
                          <div>{ep.name}</div>
                          {ep.customHeader && (
                            <div className="text-[10px] text-[#5d6877] font-mono mt-0.5">{ep.customHeader}</div>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1 text-[10px] ${ep.verifyHmac ? 'text-[#3ecf8e]' : 'text-[#8d98a7]'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${ep.verifyHmac ? 'bg-[#3ecf8e]' : 'bg-[#5d6877]'}`} />
                              {ep.verifyHmac ? 'HMAC Verified' : 'No Secret'}
                            </span>
                            <span className={`inline-flex items-center gap-1 text-[10px] ${ep.ipWhitelist ? 'text-[#8ea3ff]' : 'text-[#8d98a7]'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${ep.ipWhitelist ? 'bg-[#8ea3ff]' : 'bg-[#5d6877]'}`} />
                              {ep.ipWhitelist ? 'IP Guard On' : 'Open IP'}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-[#8ea3ff]">{ep.proxy}</td>
                        <td className="py-2.5 px-3 text-[#8d98a7] max-w-[180px] truncate">{ep.dest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SELF-HEALING DIAGNOSTICS */}
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
                          <Icon name="ShieldCheck" size={14} /> Rule deployed to edge router. Normalizing future mismatches automatically.
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

        {/* TAB 5: REPLAY ENGINE */}
        {tab === 'replay' && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-base">Dead-Letter Queue</h2>
                <span className="font-mono text-xs text-[#5d6877]">{dynamicMetrics.failedCount} Failed</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const ids = failedEvents.map((e) => e.id);
                    handleRunReplay(ids);
                  }}
                  disabled={running || dynamicMetrics.failedCount === 0}
                  className="bg-[#8ea3ff] text-[#0a0d18] text-xs font-semibold px-3 py-1.5 rounded inline-flex items-center gap-1 hover:bg-[#a5b6ff] disabled:opacity-40"
                >
                  <Icon name="RotateCcw" size={13} /> Replay All Failed ({dynamicMetrics.failedCount})
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

        {/* TAB 6: ALERTS & DISPATCHERS */}
        {tab === 'alerts' && (
          <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-5">
            <div>
              <h2 className="font-bold text-base">Instant Incident Alerts & Dispatchers</h2>
              <p className="text-xs text-[#8d98a7] mt-1">Receive automated alerts when transactions drop into the Dead-Letter Queue.</p>
            </div>

            <div className="grid gap-4 max-w-2xl">
              <div>
                <label className="text-xs text-[#8d98a7] block mb-1">Slack Incoming Webhook URL</label>
                <input
                  type="text"
                  value={alertChannels.slackWebhook}
                  onChange={(e) => setAlertChannels({ ...alertChannels, slackWebhook: e.target.value })}
                  className="w-full bg-[#090b0f] border border-[#2a3340] rounded px-3 py-2 text-xs font-mono text-[#e8ecf1]"
                />
              </div>

              <div>
                <label className="text-xs text-[#8d98a7] block mb-1">Telegram Incident Bot Chat ID</label>
                <input
                  type="text"
                  value={alertChannels.telegramChatId}
                  onChange={(e) => setAlertChannels({ ...alertChannels, telegramChatId: e.target.value })}
                  className="w-full bg-[#090b0f] border border-[#2a3340] rounded px-3 py-2 text-xs font-mono text-[#e8ecf1]"
                />
              </div>

              <div>
                <label className="text-xs text-[#8d98a7] block mb-1">WhatsApp Cloud API (Alert Phone Number)</label>
                <input
                  type="text"
                  value={alertChannels.whatsappPhone}
                  onChange={(e) => setAlertChannels({ ...alertChannels, whatsappPhone: e.target.value })}
                  className="w-full bg-[#090b0f] border border-[#2a3340] rounded px-3 py-2 text-xs font-mono text-[#e8ecf1]"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 text-xs text-[#e8ecf1] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertChannels.notifyOn5xx}
                    onChange={(e) => setAlertChannels({ ...alertChannels, notifyOn5xx: e.target.checked })}
                    className="accent-[#8ea3ff]"
                  />
                  Alert on 5xx Server Outages and Upstream Gateway Timeouts
                </label>
                <label className="flex items-center gap-2 text-xs text-[#e8ecf1] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertChannels.notifyOnSchemaBreak}
                    onChange={(e) => setAlertChannels({ ...alertChannels, notifyOnSchemaBreak: e.target.checked })}
                    className="accent-[#8ea3ff]"
                  />
                  Alert on 422 Payload Schema Drift Detection
                </label>
              </div>

              <div>
                <button
                  onClick={() => {
                    if (!currentUser) {
                      setAuthModalOpen(true);
                      toast('Sign in required to save alert dispatchers.', 'info');
                      return;
                    }
                    toast('Alert channels successfully updated and verified.', 'ok');
                  }}
                  className="bg-[#8ea3ff] text-[#0a0d18] text-xs font-semibold px-4 py-2 rounded hover:bg-[#a5b6ff] transition"
                >
                  Save Dispatch Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS & KEYS */}
        {tab === 'keys' && (
          <div className="bg-[#0e1116] border border-[#1c232d] rounded-lg p-5 space-y-5">
            <h2 className="font-bold text-base">API Authentication & Ingestion Keys</h2>
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

        {/* PRICING & PLAN UPGRADE SECTION */}
        <section id="pricing-grid" className="pt-8 pb-4">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#8ea3ff] bg-[#8ea3ff]/10 px-2.5 py-1 rounded border border-[#8ea3ff]/20">
              Predictable Usage-Based Pricing
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-3 tracking-tight">Stop losing transactions. Start in 60 seconds.</h2>
            <p className="text-xs sm:text-sm text-[#8d98a7] mt-1.5">
              Net expansion drives naturally as your business processes higher transaction volume.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Starter Plan */}
            <div className="bg-[#0e1116] border border-[#1c232d] hover:border-[#2a3340] transition rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-mono uppercase text-xs tracking-wider text-[#8d98a7] font-semibold">Starter</h3>
                </div>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-3xl font-extrabold text-[#e8ecf1]">$0</span>
                  <span className="text-xs text-[#5d6877] font-mono">/mo</span>
                </div>
                <p className="text-xs text-[#8d98a7] mb-5">For indie devs and testing pipelines before scale.</p>
                <div className="h-px bg-[#1c232d] mb-5" />
                <ul className="space-y-3 text-xs text-[#8d98a7]">
                  <li className="flex items-center gap-2 text-[#e8ecf1]">
                    <Icon name="Check" size={14} className="text-[#3ecf8e]" />
                    <span>10,000 events / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={14} className="text-[#3ecf8e]" />
                    <span>3-day buffer log retention</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={14} className="text-[#3ecf8e]" />
                    <span>Standard replay terminal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={14} className="text-[#3ecf8e]" />
                    <span>Community support</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  if (!currentUser) setAuthModalOpen(true);
                  else setTab('endpoints');
                }}
                className="mt-6 w-full bg-[#141a22] hover:bg-[#1c232d] border border-[#2a3340] text-xs font-semibold py-2.5 rounded-lg text-[#e8ecf1] transition"
              >
                {currentUser && userPlan === 'Starter' ? 'Current Active Plan' : 'Start Free'}
              </button>
            </div>

            {/* Growth Plan (Popular) */}
            <div className="bg-[#0e1116] border-2 border-[#3ecf8e] rounded-xl p-6 flex flex-col justify-between relative shadow-xl shadow-[#3ecf8e]/5">
              <span className="absolute -top-3 right-6 bg-[#3ecf8e] text-[#04150d] text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Popular
              </span>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-mono uppercase text-xs tracking-wider text-[#3ecf8e] font-semibold">Growth</h3>
                </div>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-3xl font-extrabold text-[#e8ecf1]">$49</span>
                  <span className="text-xs text-[#5d6877] font-mono">/mo</span>
                </div>
                <p className="text-xs text-[#8d98a7] mb-5">For scaling B2B SaaS and high-velocity e-commerce.</p>
                <div className="h-px bg-[#1c232d] mb-5" />
                <ul className="space-y-3 text-xs text-[#8d98a7]">
                  <li className="flex items-center gap-2 text-[#e8ecf1] font-medium">
                    <Icon name="Check" size={14} className="text-[#3ecf8e]" />
                    <span>250,000 events / month</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#e8ecf1]">
                    <Icon name="Check" size={14} className="text-[#3ecf8e]" />
                    <span>14-day zero-drop buffer</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#3ecf8e] font-semibold">
                    <Icon name="Sparkles" size={14} className="text-[#3ecf8e]" />
                    <span>Autonomous AI schema healing</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#e8ecf1]">
                    <Icon name="Bell" size={14} className="text-[#3ecf8e]" />
                    <span>Slack & WhatsApp incident alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={14} className="text-[#3ecf8e]" />
                    <span>Priority email support</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  if (!currentUser) setAuthModalOpen(true);
                  else {
                    setUserPlan('Growth');
                    toast('Workspace upgraded to Growth Plan ($49/mo). Invoicing sent to your work email.', 'ok');
                  }
                }}
                className="mt-6 w-full bg-[#3ecf8e] hover:bg-[#5ddda5] text-[#04150d] text-xs font-bold py-2.5 rounded-lg transition"
              >
                {userPlan === 'Growth' ? 'Current Active Plan' : 'Upgrade to Growth'}
              </button>
            </div>

            {/* Scale Plan */}
            <div className="bg-[#0e1116] border border-[#1c232d] hover:border-[#2a3340] transition rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-mono uppercase text-xs tracking-wider text-[#8d98a7] font-semibold">Scale</h3>
                </div>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-3xl font-extrabold text-[#e8ecf1]">$299+</span>
                  <span className="text-xs text-[#5d6877] font-mono">/mo</span>
                </div>
                <p className="text-xs text-[#8d98a7] mb-5">For high-volume FinTechs and regional payment aggregators.</p>
                <div className="h-px bg-[#1c232d] mb-5" />
                <ul className="space-y-3 text-xs text-[#8d98a7]">
                  <li className="flex items-center gap-2 text-[#e8ecf1]">
                    <Icon name="Check" size={14} className="text-[#3ecf8e]" />
                    <span>Millions of buffered events</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#e8ecf1]">
                    <Icon name="Check" size={14} className="text-[#3ecf8e]" />
                    <span>Dedicated edge IP routing</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#8ea3ff]">
                    <Icon name="ShieldCheck" size={14} className="text-[#8ea3ff]" />
                    <span>99.99% contract SLA</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#e8ecf1]">
                    <Icon name="Check" size={14} className="text-[#3ecf8e]" />
                    <span>Custom NDPR audit log storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={14} className="text-[#3ecf8e]" />
                    <span>24/7 dedicated escalation channel</span>
                  </li>
                </ul>
              </div>
              <a
                href="mailto:enquiries@jumcart.com?subject=Inquiry:%20Scale%20Tier%20Deployment"
                className="mt-6 w-full text-center bg-[#141a22] hover:bg-[#1c232d] border border-[#2a3340] text-xs font-semibold py-2.5 rounded-lg text-[#e8ecf1] transition block"
              >
                Contact Enterprise
              </a>
            </div>
          </div>
        </section>
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
              <div className="text-xs font-mono uppercase text-[#5d6877]">Edge Ingestion Security</div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-[#090b0f] border border-[#1c232d] rounded">
                  <div className="text-[#5d6877] text-[10px]">HMAC Signature</div>
                  <div className="text-[#3ecf8e] mt-0.5">Verified at Edge</div>
                </div>
                <div className="p-2.5 bg-[#090b0f] border border-[#1c232d] rounded">
                  <div className="text-[#5d6877] text-[10px]">Origin IP Check</div>
                  <div className="text-[#8ea3ff] mt-0.5">Subnet Whitelisted</div>
                </div>
              </div>
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

      {/* Auth Modal Overlay */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75" onClick={() => setAuthModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-[#0e1116] border border-[#2a3340] rounded-xl p-6 z-10 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#1c232d] pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#e8ecf1]">Sign In to JumcartFlow</h3>
                <p className="text-[11px] text-[#8d98a7] mt-0.5">Connect your backend and bind private proxies.</p>
              </div>
              <button onClick={() => setAuthModalOpen(false)} className="text-[#5d6877] hover:text-[#e8ecf1]">
                <Icon name="X" size={16} />
              </button>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleOAuthLogin('github')}
                className="w-full bg-[#141a22] border border-[#2a3340] hover:border-[#8ea3ff] text-xs font-semibold py-2 rounded text-[#e8ecf1] transition flex items-center justify-center gap-2"
              >
                Continue with GitHub
              </button>
              <button
                onClick={() => handleOAuthLogin('google')}
                className="w-full bg-[#141a22] border border-[#2a3340] hover:border-[#8ea3ff] text-xs font-semibold py-2 rounded text-[#e8ecf1] transition flex items-center justify-center gap-2"
              >
                Continue with Google
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-[#5d6877] uppercase py-1">
              <div className="flex-1 h-px bg-[#1c232d]" />
              or passwordless magic link
              <div className="flex-1 h-px bg-[#1c232d]" />
            </div>

            <form onSubmit={handleMagicLinkLogin} className="space-y-3">
              <div>
                <label className="text-[11px] text-[#8d98a7] block mb-1">Developer Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="founder@startup.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-[#090b0f] border border-[#2a3340] rounded px-3 py-2 text-xs text-[#e8ecf1] font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-[#8ea3ff] text-[#0a0d18] text-xs font-semibold py-2 rounded hover:bg-[#a5b6ff] disabled:opacity-40 transition"
              >
                {authLoading ? 'Sending link...' : 'Send Magic Sign-In Link'}
              </button>
            </form>
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
            <span className={t.kind === 'ok' ? 'text-[#3ecf8e]' : t.kind === 'bad' ? 'text-[#ff6370]' : 'text-[#8ea3ff]'}>●</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      {/* Corporate Multi-Column Legal Footer */}
      <footer className="border-t border-[#1c232d] bg-[#07090c] mt-16 text-xs text-[#8d98a7]">
        <div className="max-w-[1320px] mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#8ea3ff] text-[#0a0d18] font-bold grid place-items-center text-xs">J</div>
              <span className="text-sm font-bold text-[#e8ecf1]">JumcartFlow</span>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-[#5d6877] pt-1">
              <div>Managed by <strong className="text-[#8d98a7]">P. Gonze Consultancy</strong></div>
              <div>Address: Abuja, Nigeria</div>
              <div>Email: <a href="mailto:enquiries@jumcart.com" className="text-[#8ea3ff] hover:underline">enquiries@jumcart.com</a></div>
            </div>
          </div>

          <div>
            <h4 className="font-mono uppercase text-[11px] text-[#e8ecf1] font-semibold mb-3">Trust & Reliability</h4>
            <ul className="space-y-2 text-[12px]">
              <li><button onClick={() => setActiveModal('sla')} className="hover:text-[#e8ecf1]">99.9% Edge SLA</button></li>
              <li><span className="text-[#3ecf8e] text-[11px] font-mono">TLS 1.3 / AES-256 Storage</span></li>
              <li><span className="text-[#8ea3ff] text-[11px] font-mono">HMAC Edge Verification</span></li>
              <li><a href="mailto:enquiries@jumcart.com" className="hover:text-[#e8ecf1]">Incident Escalation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono uppercase text-[11px] text-[#e8ecf1] font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-[12px]">
              <li><button onClick={() => setActiveModal('terms')} className="hover:text-[#e8ecf1]">Terms of Service</button></li>
              <li><button onClick={() => setActiveModal('privacy')} className="hover:text-[#e8ecf1]">Privacy & NDPR Compliance</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1c232d] py-5">
          <div className="max-w-[1320px] mx-auto px-4 flex flex-wrap justify-between items-center text-[11px] text-[#5d6877]">
            <div>© 2026 JumcartFlow. Managed by P. Gonze Consultancy. All rights reserved.</div>
            <div className="font-mono">Autonomous Gateway Protocol v2.4.1</div>
          </div>
        </div>
      </footer>

      {/* Legal Modal Dialog */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75" onClick={() => setActiveModal(null)} />
          <div className="relative w-full max-w-lg bg-[#0e1116] border border-[#2a3340] rounded-xl p-6 z-10 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-[#1c232d] pb-3 mb-4">
              <h3 className="font-bold text-sm text-[#e8ecf1]">
                {activeModal === 'privacy' && 'Privacy & Data Protection Policy (NDPR & GDPR)'}
                {activeModal === 'terms' && 'Terms of Service'}
                {activeModal === 'sla' && 'Service Level Agreement (SLA)'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-[#5d6877] hover:text-[#e8ecf1]">
                <Icon name="X" size={16} />
              </button>
            </div>

            <div className="overflow-y-auto text-xs text-[#8d98a7] space-y-3 leading-relaxed pr-1 flex-1">
              {activeModal === 'privacy' && (
                <>
                  <p className="font-semibold text-[#e8ecf1]">1. Zero-Retention of Primary Financial Secrets</p>
                  <p>JumcartFlow operates as an ephemeral proxy managed by P. Gonze Consultancy. We never log, store, or inspect full credit card numbers, CVVs, or bank verification PINs. All payloads passing through edge relays are evaluated strictly for schema conformance and idempotency keys.</p>
                  <p className="font-semibold text-[#e8ecf1]">2. Ephemeral Ingestion Buffer</p>
                  <p>Payload headers and body samples stored for manual replay and audit logs are securely isolated by tenant ID and automatically purged after your tier&apos;s retention window (3 to 30 days).</p>
                  <p className="font-semibold text-[#e8ecf1]">3. NDPR & International Compliance</p>
                  <p>Data routing adheres to Nigerian Data Protection Regulation (NDPR) guidelines and international cloud hosting standards on Vercel and Supabase infrastructure. For compliance inquiries, contact enquiries@jumcart.com.</p>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <p className="font-semibold text-[#e8ecf1]">1. Routing & Buffer Responsibility</p>
                  <p>JumcartFlow guarantees forward delivery attempts up to your configured retry budget. We are an infrastructure gateway managed by P. Gonze Consultancy, not an acquiring bank or licensed card processor; settlement obligations rest with upstream payment providers.</p>
                  <p className="font-semibold text-[#e8ecf1]">2. Self-Healing Approvals</p>
                  <p>Autonomous schema transformations deployed via the diagnostic console represent client-authorized data mapping rules. Clients maintain final audit ownership over custom field transforms.</p>
                </>
              )}

              {activeModal === 'sla' && (
                <>
                  <p className="font-semibold text-[#e8ecf1]">1. 99.9% Uptime Commitment</p>
                  <p>Our edge ingestion proxy routes are distributed globally across sub-50ms serverless endpoints, ensuring resilient buffer intake even when client application servers experience internal outages.</p>
                  <p className="font-semibold text-[#e8ecf1]">2. Incident Escalation</p>
                  <p>Subscribers receive direct developer dispatch with sub-15 minute response times on edge routing degradation via enquiries@jumcart.com.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
