'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fkmwcpzrpcrmisafpdfx.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface EventRecord {
  id: string;
  proxy_id: string;
  event_type: string;
  status: string;
  status_code: number;
  payload: any;
  healed: boolean;
  diagnosis?: string;
  created_at: string;
}

export default function JumcartGatewayDashboard() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'stream' | 'diagnostics' | 'endpoints'>('stream');
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    // 1. Initial load of latest events
    async function fetchInitialEvents() {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(25);
      if (data) setEvents(data);
    }
    fetchInitialEvents();

    // 2. Real-time Supabase WebSocket listener
    const channel = supabase
      .channel('realtime_events_channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'events' },
        (payload) => {
          setEvents((prev) => [payload.new as EventRecord, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const simulateFailure = async () => {
    setIsSimulating(true);
    try {
      await fetch('/api/p/gonze_live_839201', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'charge.failed_format',
          data: {
            id: `sim_${Date.now()}`,
            amount: '75000', // string format to trigger schema repair
            currency: 'NGN',
          },
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <h1 className="text-2xl font-bold tracking-tight">Jumcart Flow</h1>
              <span className="text-xs uppercase bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded border border-emerald-500/20">
                Autonomous Gateway
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Zero-drop ingestion buffer & self-healing webhook proxy
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={simulateFailure}
              disabled={isSimulating}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {isSimulating ? 'Simulating...' : 'Simulate Broken Webhook'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('stream')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
              activeTab === 'stream'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Stream ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
              activeTab === 'diagnostics'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Self-Healing Diagnostics
          </button>
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
              activeTab === 'endpoints'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Configured Endpoints
          </button>
        </div>

        {/* Tab 1: Live Stream */}
        {activeTab === 'stream' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Event Type</th>
                    <th className="py-3 px-4">Proxy ID</th>
                    <th className="py-3 px-4">Payload Summary</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 font-sans">
                        No events received yet. Send a test webhook or trigger simulation.
                      </td>
                    </tr>
                  ) : (
                    events.map((evt) => (
                      <tr key={evt.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4">
                          {evt.status === 'healed' ? (
                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-sans font-semibold">
                              HEALED (200)
                            </span>
                          ) : evt.status === 'success' ? (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-sans font-semibold">
                              OK ({evt.status_code || 200})
                            </span>
                          ) : (
                            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-sans font-semibold">
                              FAIL ({evt.status_code || 500})
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-200">{evt.event_type}</td>
                        <td className="py-3 px-4 text-slate-400">{evt.proxy_id}</td>
                        <td className="py-3 px-4 text-slate-300 truncate max-w-xs">
                          {JSON.stringify(evt.payload)}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {new Date(evt.created_at).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Self-Healing Diagnostics */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-4">
            {events.filter((e) => e.healed).length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
                No self-healing events triggered yet. Click "Simulate Broken Webhook" to test.
              </div>
            ) : (
              events
                .filter((e) => e.healed)
                .map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-slate-900 border border-amber-500/30 rounded-xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded font-bold border border-amber-500/20">
                        Schema Auto-Repaired
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(evt.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 font-medium">
                      <span className="text-slate-400 font-semibold">Diagnosis: </span>
                      {evt.diagnosis || 'Schema mismatch resolved and redelivered.'}
                    </p>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
                      {JSON.stringify(evt.payload, null, 2)}
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* Tab 3: Configured Endpoints */}
        {activeTab === 'endpoints' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-200">Active Proxy Targets</h2>
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-200">gonze_live_839201</span>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
              </div>
              <p className="text-xs text-slate-400">
                Inbound Proxy URL:{' '}
                <code className="text-indigo-400">
                  /api/p/gonze_live_839201
                </code>
              </p>
              <p className="text-xs text-slate-500">
                Destination: <code className="text-slate-400">https://httpbin.org/post</code>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
