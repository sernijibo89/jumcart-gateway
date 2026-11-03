import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Status Bar */}
      <div className="border-b border-neutral-800 bg-neutral-900/70 px-4 py-2.5 text-center text-xs text-neutral-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Jumcart Gateway Engine: Active Edge Ingestion & Autonomous Self-Healing
        </span>
      </div>

      {/* Navigation */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 border-b border-neutral-900">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-black text-base shadow-sm">
            J
          </div>
          <span className="font-bold tracking-tight text-lg text-white">
            Jumcart<span className="text-emerald-400">Flow</span>
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-neutral-400">
          <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a 
            href="#demo" 
            className="rounded-md bg-neutral-800 px-3.5 py-1.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            Gateway Test
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-14 text-center">
        <div className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-400 mb-6">
          High-Reliability Transaction Infrastructure
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          The Autonomous, Self-Healing <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Webhook & API Gateway
          </span>
        </h1>
        
        <p className="mx-auto max-w-2xl text-base sm:text-lg text-neutral-400 leading-relaxed mb-10">
          Stop losing orders, payments, and CRM records to silent 4xx/5xx failures. 
          Jumcart buffers inbound webhooks at the edge, diagnoses dropped payloads with AI, 
          and self-heals data formatting errors before transactions stall.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#demo"
            className="w-full sm:w-auto rounded-lg bg-emerald-500 px-7 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10"
          >
            Deploy Gateway Endpoint
          </a>
          <a
            href="#architecture"
            className="w-full sm:w-auto rounded-lg border border-neutral-800 bg-neutral-900 px-7 py-3 text-sm font-semibold text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            Explore Architecture
          </a>
        </div>
      </section>

      {/* Terminal / Live Flow */}
      <section id="architecture" className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/90 p-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
              <span className="h-3 w-3 rounded-full bg-emerald-500/80"></span>
              <span className="ml-2 font-mono text-neutral-500">jumcart-gateway-pipeline.log</span>
            </div>
            <span className="font-mono text-emerald-400 text-xs">STATUS: 200 DELIVERED (SELF-HEALED)</span>
          </div>
          <pre className="overflow-x-auto text-xs font-mono leading-relaxed text-neutral-300">
            <code>{`[12:04:12] INGEST: POST /api/p/checkout_live_992 (Source: Payment Gateway)
[12:04:12] QUEUE: Buffered raw payload into Upstash Redis (Latency: 12ms)
[12:04:13] DISPATCH: Sent to destination https://api.store.com/webhooks/orders
[12:04:13] ALERT: Target returned 422 Unprocessable Entity - Schema mismatch
[12:04:13] HEALING ENGINE: Analyzing error payload with Llama 3.3 Diagnostic Agent...
[12:04:14] PATCH GENERATED: Fixed field 'customer_phone' -> normalized to E.164 string
[12:04:14] RETRY: Re-dispatching patched payload via QStash delivery worker...
[12:04:15] SUCCESS: Target returned 200 OK. Transaction saved without human intervention.`}</code>
          </pre>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 font-bold text-sm">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Zero-Drop Edge Ingestion</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Every incoming webhook is immediately buffered into high-throughput Redis queues at edge speed. Traffic spikes or API downtime will never drop an order.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
            <div className="h-9 w-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 font-bold text-sm">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Autonomous AI Diagnostics</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              When target servers respond with 4xx or 5xx codes, our automated LLM engine classifies errors, extracts root causes, and generates payload patches automatically.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 font-bold text-sm">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Voice Escalation & Triage</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Systemic payment rail or auth dropouts trigger automated conversational voice briefings directly to on-call operators, eliminating manual log auditing.
            </p>
          </div>
        </div>
      </section>

      {/* Endpoint Test / CTA */}
      <section id="demo" className="mx-auto max-w-4xl px-6 py-16 text-center border-t border-neutral-900">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Test Your Gateway Ingestion
        </h2>
        <p className="text-sm text-neutral-400 mb-6 max-w-lg mx-auto">
          Send test webhook payloads directly to the resilient relay endpoint.
        </p>
        <div className="inline-flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-xs font-mono text-neutral-300">
          <span className="text-emerald-400">curl</span> -X POST https://jumcart-flow.vercel.app/api/p/gonze_live_test01
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-8 text-center text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} JumcartFlow. Autonomous infrastructure for resilient transactions.</p>
      </footer>
    </main>
  );
}
