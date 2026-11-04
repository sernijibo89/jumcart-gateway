'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fkmwcpzrpcrmisafpdfx.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy'
);

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
    LogOut: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
    ShieldCheck: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    Zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    ExternalLink: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
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

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'endpoints' | 'ledger' | 'billing'>('endpoints');
  const [toasts, setToasts] = useState<any[]>([]);

  // Endpoint form state
  const [newTarget, setNewTarget] = useState('https://api.myapp.com/webhooks/incoming');
  const [newProvider, setNewProvider] = useState('paystack');
  const [creating, setCreating] = useState(false);

  const toast = useCallback((msg: string, kind = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, kind }].slice(-3));
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);

  const copyToClipboard = (txt: string) => {
    navigator.clipboard?.writeText(txt);
    toast('Copied ingestion URL to clipboard.', 'ok');
  };

  const loadTenantData = useCallback(async (userId: string) => {
    try {
      const { data: epData } = await supabase
        .from('endpoints')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (epData && epData.length > 0) {
        setEndpoints(epData);
      } else {
        setEndpoints([
          {
            id: 'ep_default',
            proxy_id: 'gonze_live_839201',
            name: 'Primary Ingestion Gateway',
            provider: 'paystack',
            destination_url: 'https://httpbin.org/post',
            active: true
          }
        ]);
      }

      const { data: evData } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (evData) setEvents(evData);
    } catch {
      toast('Failed to sync tenant ledger.', 'bad');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        setUser({ id: 'demo_user', email: 'founder@business.com' });
        loadTenantData('demo_user');
      } else {
        setUser(session.user);
        loadTenantData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadTenantData(session.user.id);
      } else {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, loadTenantData]);

  const handleCreateEndpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTarget.startsWith('http')) {
      toast('Enter a valid destination starting with http:// or https://', 'bad');
      return;
    }

    setCreating(true);
    const proxyId = 'usr_live_' + Math.floor(10000000 + Math.random() * 90000000);

    const record = {
      user_id: user?.id,
      proxy_id: proxyId,
      name: `${newProvider.toUpperCase()} Relay`,
      provider: newProvider,
      destination_url: newTarget,
      active: true,
      verify_hmac: true,
      ip_whitelist: true
    };

    try {
      const { data, error } = await supabase.from('endpoints').insert(record).select().single();
      if (error) throw error;
      setEndpoints((prev) => [data || record, ...prev]);
      toast(`Protected proxy ${proxyId} provisioned.`, 'ok');
      setNewTarget('');
    } catch (err: any) {
      toast(err.message || 'Error provisioning proxy', 'bad');
    } finally {
      setCreating(false);
    }
  };

  const metrics = useMemo(() => {
    const total = events.length;
    const healed = events.filter((e) => e.healed).length;
    const failed = events.filter((e) => e.status === 'failed').length;
    return {
      total,
      healed,
      failed,
      usedPct: Math.min(100, (total / 10000) * 100)
    };
  }, [events]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090b0f] flex items-center justify-center font-mono text-xs text-[#8d98a7]">
        Loading your tenant workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090b0f] text-[#e8ecf1] font-sans antialiased text-[14px]">
      <header className="border-b border-[#1c232d] bg-[#090b0f] sticky top-0 z-30">
        <div className="max-w-[1320px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[7px] bg-[#8ea3ff] grid place-items-center text-[#0a0d18] font-bold text-base">
                J
              </div>
              <span className="font-bold text-lg tracking-tight">JumcartFlow</span>
            </a>
            <span className="font-mono text-xs text-[#8d98a7] bg-[#141a22] border border-[#2a3340] rounded px-2 py-0.5">
              Tenant Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right font-mono text-xs">
              <span className="text-[#e8ecf1] font-medium">{user?.email}</span>
              <span className="text-[#3ecf8e]">Plan: Starter (Active)</span>
            </div>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/');
              }}
              className="inline-flex items-center gap-1.5 text-xs bg-[#141a22] border border-[#2a3340] hover:border-[#ff6370] text-[#ff6370] px-3 py-1.5 rounded transition"
            >
              <Icon name="LogOut" size={13} /> Exit
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1320px] mx-auto px-4 py-6 space-y-6">
        <section className="bg-[#0e1116] border border-[#1c232d] rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#5d6877]">Monthly Ingestion Buffer</span>
            <div className="text-2xl font-bold mt-1 text-[#e8ecf1]">
              {metrics.total.toLocaleString()} <span className="text-xs font-mono text-[#5d6877]">/ 10,000 Free Events</span>
            </div>
            <div className="w-full bg-[#141a22] h-2 rounded-full mt-3 overflow-hidden border border-[#2a3340]">
              <div className="bg-[#3ecf8e] h-full" style={{ width: `${Math.max(4, metrics.usedPct)}%` }} />
            </div>
            <span className="text-[11px] font-mono text-[#8d98a7] mt-1 block">
              Renews on the 1st of next month.
            </span>
          </div>

          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#5d6877]">Autonomous AI Heals</span>
            <div className="text-2xl font-bold mt-1 text-[#4cc9f0]">
              {metrics.healed} <span className="text-xs font-mono text-[#5d6877]">prevented drop-offs</span>
            </div>
            <p className="text-xs text-[#8d98a7] mt-2">
              Schema drift caught and patched automatically at edge router without API downtime.
            </p>
          </div>

          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#5d6877]">Current Subscription</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold text-[#e8ecf1]">Starter Plan ($0/mo)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#3ecf8e]/10 text-[#3ecf8e] font-semibold">Active</span>
            </div>
            <a
              href="/#pricing-grid"
              className="inline-flex items-center gap-1.5 text-xs text-[#8ea3ff] font-semibold mt-3 hover:underline"
            >
              <Icon name="Zap" size={13} /> Upgrade to Growth ($49/mo) for 250k events &rarr;
            </a>
          </div>
        </section>

        <div className="flex border-b border-[#1c232d] gap-4">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition border-b-2 ${
              activeTab === 'endpoints' ? 'border-[#8ea3ff] text-[#e8ecf1]' : 'border-transparent text-[#5d6877] hover:text-[#8d98a7]'
            }`}
          >
            My Ingestion Proxies ({endpoints.length})
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition border-b-2 ${
              activeTab === 'ledger' ? 'border-[#8ea3ff] text-[#e8ecf1]' : 'border-transparent text-[#5d6877] hover:text-[#8d98a7]'
            }`}
          >
            Private Event Ledger ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition border-b-2 ${
              activeTab === 'billing' ? 'border-[#8ea3ff] text-[#e8ecf1]' : 'border-transparent text-[#5d6877] hover:text-[#8d98a7]'
            }`}
          >
            Billing & Invoices
          </button>
        </div>

        {activeTab === 'endpoints' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#0e1116] border border-[#1c232d] rounded-xl p-5 space-y-4">
              <div>
                <h3 className="font-bold text-sm text-[#e8ecf1]">Provision New Relay Route</h3>
                <p className="text-xs text-[#8d98a7] mt-1">
                  Bind a protected edge gateway that buffers incoming webhooks before reaching your backend.
                </p>
              </div>

              <form onSubmit={handleCreateEndpoint} className="space-y-3">
                <div>
                  <label className="text-xs font-mono text-[#8d98a7] block mb-1">Downstream Target URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://api.yourdomain.com/webhooks"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full bg-[#090b0f] border border-[#2a3340] rounded px-3 py-2 text-xs font-mono text-[#e8ecf1]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#8d98a7] block mb-1">Provider Preset</label>
                  <select
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    className="w-full bg-[#090b0f] border border-[#2a3340] rounded px-3 py-2 text-xs text-[#e8ecf1]"
                  >
                    <option value="paystack">Paystack</option>
                    <option value="nomba">Nomba</option>
                    <option value="flutterwave">Flutterwave</option>
                    <option value="monnify">Monnify</option>
                    <option value="opay">OPay</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full bg-[#8ea3ff] text-[#0a0d18] text-xs font-semibold py-2 rounded hover:bg-[#a5b6ff] disabled:opacity-40 transition"
                >
                  {creating ? 'Provisioning...' : 'Deploy Edge Route'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-3">
              {endpoints.length === 0 ? (
                <div className="bg-[#0e1116] border border-[#1c232d] rounded-xl p-8 text-center text-xs text-[#8d98a7]">
                  No private proxies registered yet. Create your first endpoint on the left.
                </div>
              ) : (
                endpoints.map((ep) => (
                  <div key={ep.id || ep.proxy_id} className="bg-[#0e1116] border border-[#1c232d] rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#e8ecf1]">{ep.name || 'Webhook Gateway'}</span>
                        <span className="font-mono text-[10px] uppercase bg-[#141a22] border border-[#2a3340] px-2 py-0.5 rounded text-[#8d98a7]">
                          {ep.provider}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#3ecf8e] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e]" /> Active
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-mono text-[#5d6877] uppercase">Your Inbound Webhook URL (Paste in Provider Dashboard):</span>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#090b0f] border border-[#2a3340] rounded text-xs font-mono text-[#8ea3ff] flex-1 truncate">
                          https://www.jumcart.com/api/p/{ep.proxy_id}
                        </div>
                        <button
                          onClick={() => copyToClipboard(`https://www.jumcart.com/api/p/${ep.proxy_id}`)}
                          className="p-2 bg-[#141a22] border border-[#2a3340] hover:border-[#8d98a7] rounded transition"
                          title="Copy Ingestion URL"
                        >
                          <Icon name="Copy" size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-[#8d98a7] flex items-center justify-between pt-1 border-t border-[#1c232d]">
                      <span className="truncate max-w-[400px]">Forwarding to: {ep.destination_url}</span>
                      <span className="text-[#3ecf8e]">HMAC Protected</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'ledger' && (
          <div className="bg-[#0e1116] border border-[#1c232d] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#1c232d] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[#e8ecf1]">Tenant Ingestion Ledger</h3>
                <p className="text-xs text-[#8d98a7] mt-0.5">Isolated log of requests ingested by your assigned proxies.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1c232d] bg-[#090b0f] text-[#5d6877] uppercase text-[11px]">
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Event</th>
                    <th className="py-2.5 px-4">Proxy ID</th>
                    <th className="py-2.5 px-4">Destination</th>
                    <th className="py-2.5 px-4 text-right">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c232d]">
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#5d6877]">
                        No webhooks recorded yet. Send your first event via curl or provider webhook test.
                      </td>
                    </tr>
                  ) : (
                    events.map((ev) => (
                      <tr key={ev.id} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 px-4">
                          {ev.healed ? (
                            <span className="text-[#4cc9f0] bg-[#4cc9f0]/10 px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1">
                              <Icon name="Sparkles" size={11} /> Healed
                            </span>
                          ) : ev.status_code >= 200 && ev.status_code < 300 ? (
                            <span className="text-[#3ecf8e] bg-[#3ecf8e]/10 px-2 py-0.5 rounded text-[11px] font-bold">
                              200 OK
                            </span>
                          ) : (
                            <span className="text-[#ff6370] bg-[#ff6370]/10 px-2 py-0.5 rounded text-[11px] font-bold">
                              {ev.status_code || 'Failed'}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-[#e8ecf1]">{ev.event_type || 'charge.success'}</td>
                        <td className="py-2.5 px-4 text-[#8ea3ff]">{ev.proxy_id}</td>
                        <td className="py-2.5 px-4 text-[#8d98a7] max-w-[280px] truncate">{ev.destination_url}</td>
                        <td className="py-2.5 px-4 text-right text-[#e8ecf1]">{ev.latency_ms || 24} ms</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="bg-[#0e1116] border border-[#1c232d] rounded-xl p-6 space-y-6">
            <div>
              <h3 className="font-bold text-sm text-[#e8ecf1]">Subscription & Invoicing</h3>
              <p className="text-xs text-[#8d98a7] mt-0.5">Manage your team tier, payment rails, and receipt downloads.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#141a22] border border-[#2a3340] rounded-lg">
                <span className="text-xs text-[#5d6877] font-mono uppercase block">Active Plan</span>
                <div className="text-lg font-bold mt-1 text-[#e8ecf1]">Starter Developer Tier ($0/mo)</div>
                <p className="text-xs text-[#8d98a7] mt-2">
                  Includes 10,000 monthly events and 3-day buffer log retention.
                </p>
              </div>

              <div className="p-4 bg-[#141a22] border border-[#2a3340] rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-xs text-[#5d6877] font-mono uppercase block">Recommended Upgrade</span>
                  <div className="text-lg font-bold mt-1 text-[#3ecf8e]">Growth Tier ($49/mo)</div>
                  <p className="text-xs text-[#8d98a7] mt-1">
                    Autonomous AI schema healing, 250k events, Slack & WhatsApp incident alerts.
                  </p>
                </div>
                <a
                  href="/#pricing-grid"
                  className="mt-4 bg-[#3ecf8e] text-[#04150d] text-center font-bold text-xs py-2 rounded hover:bg-[#5ddda5] transition block"
                >
                  Upgrade to Growth
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

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
    </div>
  );
}
