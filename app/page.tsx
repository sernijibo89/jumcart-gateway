"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

/* --- UTILS --- */
const rnd = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const chars = (set: string, n: number) => {
  let s = "";
  for (let i = 0; i < n; i++) s += set[rnd(0, set.length - 1)];
  return s;
};
const hex = (n: number) => chars("0123456789abcdef", n);
const b62 = (n: number) => chars("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", n);
const digits = (n: number) => chars("0123456789", n);
const uuid = () => `${hex(8)}-${hex(4)}-4${hex(3)}-a${hex(3)}-${hex(12)}`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const fmtMs = (ms: number | null) => (ms == null ? "—" : ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`);
const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const clock = (ts: number) => new Date(ts).toLocaleTimeString("en-GB", { hour12: false });
const ago = (ts: number, now: number) => {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  return s < 5 ? "just now" : s < 60 ? `${s}s ago` : s < 3600 ? `${Math.floor(s / 60)}m ago` : `${Math.floor(s / 3600)}h ago`;
};
const host = (u: string) => u.replace(/^https?:\/\//, "");
const iso = (ts: number) => new Date(ts).toISOString();

const PEOPLE = [
  ["Amara", "Okafor"], ["Tunde", "Bello"], ["Chidi", "Eze"], ["Fatima", "Yusuf"],
  ["Kelechi", "Nwosu"], ["Ngozi", "Adeyemi"], ["Sam", "Walker"], ["Priya", "Nair"],
  ["Lena", "Fischer"], ["Omar", "Haddad"], ["Grace", "Mensah"], ["Daniel", "Cho"]
];
const person = () => {
  const p = pick(PEOPLE);
  return {
    first: p[0],
    last: p[1],
    name: `${p[0]} ${p[1]}`,
    email: `${p[0]}.${p[1]}`.toLowerCase() + "@" + pick(["gmail.com", "fastmail.com", "northwind.ng", "acme.io"]),
    code: "CUS_" + b62(11).toLowerCase()
  };
};
const ip = () => `${rnd(34, 197)}.${rnd(1, 254)}.${rnd(1, 254)}.${rnd(1, 254)}`;

const copyText = async (t: string) => {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(t);
      return true;
    } catch {
      // fallback
    }
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = t;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;opacity:0;top:0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const hl = (o: any, raw?: boolean) => {
  const s = raw ? JSON.stringify(o) : JSON.stringify(o, null, 2);
  return esc(s).replace(/("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g, (_m, s1, c, b, n) => {
    if (s1) return c ? `<span class="text-[#8ea3ff]">${s1}</span>${c}` : `<span class="text-[#7fdcb4]">${s1}</span>`;
    if (b) return `<span class="text-[#e58ad0]">${b}</span>`;
    return `<span class="text-[#f2b66c]">${n}</span>`;
  });
};

/* --- ICONS --- */
const Icon = ({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) => {
  const s = { width: size, height: size };
  switch (name) {
    case "Activity":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
    case "Webhook":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/><path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06l3.19 5.86c.6.96 1.83 1.34 2.8.84A4 4 0 0 1 22 16.98"/></svg>;
    case "Sparkles":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
    case "RotateCcw":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>;
    case "Settings":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "Check":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>;
    case "Copy":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>;
    case "Pause":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>;
    case "Play":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="6 3 20 12 6 21 6 3"/></svg>;
    case "Zap":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case "Search":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
    case "FlaskConical":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>;
    case "Trash2":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>;
    case "Eye":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "EyeOff":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>;
    case "Plus":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
    case "Terminal":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>;
    case "CheckCircle2":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>;
    case "AlertTriangle":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>;
    case "Info":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
    case "X":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
    case "ArrowRight":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
    case "ShieldCheck":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>;
    case "Bot":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>;
    case "RefreshCw":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>;
    case "Square":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2"/></svg>;
    case "Undo2":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>;
    case "Circle":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/></svg>;
    case "Shuffle":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></svg>;
    case "Timer":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>;
    case "Lock":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    case "KeyRound":
      return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>;
    default:
      return null;
  }
};

/* --- DOMAIN CONSTANTS --- */
const PROV: Record<string, { name: string; letter: string; color: string }> = {
  paystack: { name: "Paystack", letter: "P", color: "#4db8f0" },
  stripe: { name: "Stripe", letter: "S", color: "#a597ff" },
  monnify: { name: "Monnify", letter: "M", color: "#ff9366" },
  shopify: { name: "Shopify", letter: "H", color: "#a9cf72" },
  github: { name: "GitHub", letter: "G", color: "#c9d1d9" }
};
const CLS_BY_PROV: Record<string, string> = { paystack: "schema", monnify: "timeout", shopify: "locked", stripe: "secret" };
const RULE: Record<string, string> = {
  schema: "paystack-amount-remap",
  timeout: "extended-timeout-backoff",
  locked: "hold-until-healthy",
  secret: "resign-with-new-secret"
};
const FAIL: Record<string, { code: number; text: string; ms: [number, number]; resp: () => any }> = {
  schema: { code: 422, text: "Unprocessable Entity", ms: [38, 64], resp: () => ({ error: "validation_failed", message: "Missing required field: data.total_amount", fields: [{ path: "data.total_amount", rule: "required" }], request_id: "req_" + hex(8) }) },
  timeout: { code: 504, text: "Gateway Timeout", ms: [10000, 10000], resp: () => ({ error: "upstream_timeout", message: "No response from destination within 10000 ms", gateway: "jumcart-edge-lhr1" }) },
  locked: { code: 503, text: "Service Unavailable", ms: [22, 45], resp: () => ({ error: "service_unavailable", message: "Store is in maintenance mode. The orders API is locked until 02:00 UTC.", retry_after: 1800 }) },
  secret: { code: 401, text: "Unauthorized", ms: [18, 40], resp: () => ({ error: "invalid_signature", message: "No signatures found matching the expected signature for payload" }) }
};
const ATT: Record<string, number> = { schema: 3, timeout: 5, locked: 5, secret: 3 };
const ACK: Record<string, any> = { paystack: { received: true }, stripe: { received: true }, monnify: { status: "ok" }, shopify: { ok: true }, github: { ok: true, queued: "build-" + rnd(1000, 9999) } };

const DIAG: Record<string, any> = {
  schema: {
    title: "Payload Schema Mismatch", icon: "Shuffle", conf: 97, scope: "Paystack → api.myapp.com/webhooks/payment",
    diagnosis: (n: number) => `Your endpoint now expects the payment amount in a field called data.total_amount, and it wants naira instead of kobo. Paystack still sends data.amount in kobo. Your server rejected ${n} events with a 422 because the new field was missing. The payments themselves are fine.`,
    patch: [{ t: "ctx", s: "rule paystack-amount-remap" }, { t: "ctx", s: '  match  source == "paystack" and event == "charge.success"' }, { t: "del", s: "- data.amount          // kobo, integer" }, { t: "add", s: "+ data.total_amount    // naira = data.amount / 100" }, { t: "ctx", s: "  keep   data.reference, data.currency, data.customer.email" }],
    steps: ["Testing the rule on 20 saved payloads", "Compiling the transform", "Deploying to 14 edge regions", "Replaying failed events"]
  },
  timeout: {
    title: "Network Timeout", icon: "Timer", conf: 94, scope: "Monnify → billing.northwind.ng/hooks/monnify",
    diagnosis: (n: number) => `billing.northwind.ng took longer than 10 seconds to answer ${n} events. Every Monnify event in the same few minutes was slow, which points to a busy server and not to a bad payload. Waiting longer and retrying is safe because Jumcart sends the same idempotency key on every attempt.`,
    patch: [{ t: "ctx", s: "rule extended-timeout-backoff" }, { t: "del", s: "- timeout       10s" }, { t: "add", s: "+ timeout       30s" }, { t: "del", s: "- max_attempts  5" }, { t: "add", s: "+ max_attempts  7" }, { t: "add", s: "+ backoff       2s x2, jitter 20%" }, { t: "add", s: "+ circuit_break open after 5 failures in 60s" }],
    steps: ["Checking idempotency keys on all events", "Raising timeout to 30 seconds", "Deploying to 14 edge regions", "Replaying failed events"]
  },
  locked: {
    title: "503 Gateway Locked", icon: "Lock", conf: 91, scope: "Shopify → orders.kola-store.com/api/shopify/hooks",
    diagnosis: (n: number) => `Your store is in maintenance mode and answers every request with a 503 until 02:00 UTC. Retrying every few seconds will not help. Jumcart should hold these ${n} events in a queue, check your health URL every 30 seconds, and release them in order once it answers 200.`,
    patch: [{ t: "ctx", s: "rule hold-until-healthy" }, { t: "add", s: "+ on 503      hold events in queue (max 24h)" }, { t: "add", s: "+ probe       GET /health every 30s" }, { t: "add", s: "+ on 200      release in original order, 20 events/s" }, { t: "ctx", s: "  keep        idempotency key and headers" }],
    steps: ["Finding your health URL", "Creating the hold queue", "Deploying to 14 edge regions", "Releasing held events in order"]
  },
  secret: {
    title: "Signature Secret Rotated", icon: "KeyRound", conf: 96, scope: "Stripe → api.myapp.com/webhooks/stripe",
    diagnosis: (n: number) => `Your server checks the Stripe signature with a secret that changed on Oct 28. The old secret (whsec_…a91c) no longer matches, so ${n} valid events were refused with a 401. The payloads are untouched. Jumcart can sign the forwarded request again with your new secret.`,
    patch: [{ t: "ctx", s: "rule resign-with-new-secret" }, { t: "del", s: "- stripe-signature  t=…,v1=<signed with whsec_…a91c>" }, { t: "add", s: "+ stripe-signature  t=now,v1=<signed with whsec_…f27d>" }, { t: "ctx", s: "  tolerance  300s" }, { t: "add", s: "+ retire old secret after 24h" }],
    steps: ["Verifying the new secret with a test request", "Re-signing the payloads", "Deploying to 14 edge regions", "Replaying failed events"]
  }
};

const TPL: Record<string, (ts: number, ft?: string) => any> = {
  paystack: (ts, ft) => {
    const type = ft || pick(["charge.success", "charge.success", "charge.success", "transfer.success", "subscription.create"]);
    const amt = pick([9900000, 18000000, 45000000, 75000000, 125000000]), c = person();
    let data;
    if (type === "charge.success") {
      data = { id: rnd(4000000000, 4900000000), domain: "live", status: "success", reference: "PSK_" + hex(10), amount: amt, message: null, gateway_response: "Successful", paid_at: iso(ts), created_at: iso(ts - 4000), channel: "card", currency: "NGN", ip_address: ip(), metadata: { order_id: "ORD-" + digits(5), plan: pick(["starter", "growth", "scale"]) }, authorization: { authorization_code: "AUTH_" + hex(9), bin: "408408", last4: "4081", exp_month: "12", exp_year: "2030", card_type: "visa", bank: "TEST BANK", brand: "visa" }, customer: { id: rnd(60000000, 99000000), first_name: c.first, last_name: c.last, email: c.email, customer_code: c.code } };
    } else if (type === "transfer.success") {
      data = { id: rnd(500000000, 900000000), domain: "live", amount: amt, currency: "NGN", reference: "TRF_" + hex(10), source: "balance", reason: "Vendor payout", status: "success", transfer_code: "TRF_" + hex(10), transferred_at: iso(ts), recipient: { name: c.name, type: "nuban", currency: "NGN" } };
    } else {
      data = { id: rnd(100000, 999999), domain: "live", status: "active", subscription_code: "SUB_" + hex(10), amount: amt, cron_expression: "0 0 30 * *", next_payment_date: iso(ts + 2592000000), plan: { name: "Growth monthly", interval: "monthly", currency: "NGN" }, customer: { email: c.email, customer_code: c.code } };
    }
    return { type, usd: type === "charge.success" ? amt / 100 / 1550 : 0, body: { event: type, data }, headers: { "content-type": "application/json", "user-agent": "Paystack-Webhook/1.0", "x-paystack-signature": hex(128) } };
  },
  stripe: (ts, ft) => {
    const type = ft || pick(["payment_intent.succeeded", "payment_intent.succeeded", "invoice.paid", "charge.refunded", "customer.subscription.updated"]);
    const amt = pick([4900, 9900, 19900, 49900, 120000]), c = person();
    let o;
    if (type === "payment_intent.succeeded") {
      o = { id: "pi_" + b62(24), object: "payment_intent", amount: amt, amount_received: amt, currency: "usd", status: "succeeded", customer: "cus_" + b62(14), receipt_email: c.email, payment_method_types: ["card"], latest_charge: "ch_" + b62(24), metadata: { workspace: pick(["acme-labs", "northwind", "kite-co"]), seats: String(rnd(1, 25)) } };
    } else if (type === "invoice.paid") {
      o = { id: "in_" + b62(24), object: "invoice", amount_paid: amt, currency: "usd", status: "paid", customer_email: c.email, hosted_invoice_url: "https://invoice.stripe.com/i/acct_1Nq/live_" + b62(20), lines: { data: [{ description: "Scale plan", quantity: 1 }] } };
    } else if (type === "charge.refunded") {
      o = { id: "ch_" + b62(24), object: "charge", amount: amt, amount_refunded: amt, currency: "usd", refunded: true, receipt_email: c.email };
    } else {
      o = { id: "sub_" + b62(24), object: "subscription", status: "active", cancel_at_period_end: false, items: { data: [{ price: { id: "price_" + b62(20), unit_amount: amt, currency: "usd", recurring: { interval: "month" } } }] } };
    }
    const u = Math.floor(ts / 1000);
    return { type, usd: (type === "payment_intent.succeeded" || type === "invoice.paid") ? amt / 100 : 0, body: { id: "evt_" + b62(24), object: "event", api_version: "2024-06-20", created: u, type, livemode: true, data: { object: o }, request: { id: "req_" + b62(14), idempotency_key: uuid() } }, headers: { "content-type": "application/json; charset=utf-8", "user-agent": "Stripe/1.0 (+https://stripe.com/docs/webhooks)", "stripe-signature": "t=" + u + ",v1=" + hex(64) } };
  },
  monnify: (ts, ft) => {
    const type = ft || pick(["SUCCESSFUL_TRANSACTION", "SUCCESSFUL_TRANSACTION", "SUCCESSFUL_DISBURSEMENT", "SUCCESSFUL_REFUND"]);
    const amt = pick([25000, 48500, 120000, 310000, 750000]), c = person();
    const d = new Date(ts);
    const paid = ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear() + " " + clock(ts) + " PM";
    const ed = type === "SUCCESSFUL_TRANSACTION" ? { product: { reference: "inv-" + digits(6), type: "RESERVED_ACCOUNT" }, transactionReference: "MNFY|20|" + digits(14) + "|" + digits(6), paymentReference: "MNFY|" + digits(12), paidOn: paid, paymentDescription: "Invoice settlement", amountPaid: amt, totalPayable: amt, settlementAmount: (amt * 0.985).toFixed(2), paymentMethod: "ACCOUNT_TRANSFER", currency: "NGN", paymentStatus: "PAID", destinationAccountInformation: { bankCode: "035", bankName: "Wema bank", accountNumber: "6000" + digits(6) }, customer: { email: c.email, name: c.name } } : { reference: "DSB-" + digits(8), amount: amt, currency: "NGN", status: "SUCCESS", destinationAccountName: c.name, destinationBankCode: "058", narration: "Vendor payout", completedOn: paid };
    return { type, usd: type === "SUCCESSFUL_TRANSACTION" ? amt / 1550 : 0, body: { eventType: type, eventData: ed }, headers: { "content-type": "application/json", "user-agent": "Monnify/1.0", "monnify-signature": hex(128) } };
  },
  shopify: (ts, ft) => {
    const type = ft || pick(["orders/create", "orders/create", "orders/paid", "refunds/create", "customers/update"]);
    const c = person(), price = pick([24.5, 48, 84.5, 129, 219.99]), oid = rnd(5000000000000, 5999999999999);
    const body = type.indexOf("orders") === 0 ? { id: oid, admin_graphql_api_id: "gid://shopify/Order/" + oid, name: "#" + rnd(1040, 9999), email: c.email, created_at: iso(ts), total_price: price.toFixed(2), currency: "USD", financial_status: type === "orders/paid" ? "paid" : "pending", line_items: [{ id: rnd(1e13, 9e13), title: pick(["Linen shirt", "Ankara tote", "Cold brew kit", "Desk lamp"]), quantity: rnd(1, 3), price: (price / 2).toFixed(2), sku: "SKU-" + digits(4) }], shipping_address: { city: pick(["Lagos", "Abuja", "London", "Toronto"]), country_code: pick(["NG", "GB", "CA"]) } } : type === "refunds/create" ? { id: rnd(1e12, 9e12), order_id: oid, created_at: iso(ts), note: "Customer changed size", refund_line_items: [{ quantity: 1, subtotal: price.toFixed(2) }] } : { id: rnd(1e12, 9e12), email: c.email, first_name: c.first, last_name: c.last, accepts_marketing: false, updated_at: iso(ts), state: "enabled" };
    return { type, usd: type.indexOf("orders") === 0 ? price : 0, body, headers: { "content-type": "application/json", "user-agent": "Shopify-Captain-Hook", "x-shopify-topic": type, "x-shopify-shop-domain": "kola-store.myshopify.com", "x-shopify-api-version": "2024-10", "x-shopify-webhook-id": uuid(), "x-shopify-hmac-sha256": b62(43) + "=" } };
  },
  github: (ts) => {
    const type = pick(["push", "push", "pull_request", "workflow_run", "release"]), sha = hex(40);
    const repo = { id: rnd(700000000, 799999999), full_name: "pgonze/jumcart-api", private: true, default_branch: "main" };
    const body = type === "push" ? { ref: "refs/heads/" + pick(["main", "main", "fix/retry-budget"]), before: hex(40), after: sha, repository: repo, pusher: { name: "sjibo" }, head_commit: { id: sha, message: pick(["fix: retry budget for gateway timeouts", "feat: replay endpoint accepts idempotency key", "chore: bump edge runtime"]), timestamp: iso(ts), author: { name: "Sani Jibo", username: "sjibo" } } } : type === "pull_request" ? { action: "closed", number: rnd(40, 190), pull_request: { title: "Add hold-until-healthy queue", state: "closed", merged: true, merge_commit_sha: sha, user: { login: "sjibo" }, base: { ref: "main" } }, repository: repo } : type === "workflow_run" ? { action: "completed", workflow_run: { id: rnd(1e10, 9e10), name: "deploy-edge", conclusion: "success", head_sha: sha, run_attempt: 1 }, repository: repo } : { action: "published", release: { tag_name: "v2." + rnd(1, 9) + "." + rnd(0, 9), draft: false, prerelease: false }, repository: repo };
    return { type, usd: 0, body, headers: { "content-type": "application/json", "user-agent": "GitHub-Hookshot/" + hex(7), "x-github-event": type, "x-github-delivery": uuid(), "x-hub-signature-256": "sha256=" + hex(64) } };
  }
};

const FORCE_TYPE: Record<string, string> = { schema: "charge.success", secret: "payment_intent.succeeded", locked: "orders/create", timeout: "SUCCESSFUL_TRANSACTION" };

function A(n: number, code: number, text: string, ms: number | null, wait: number, at: number, ok: boolean, kind: string = "auto", note: string = "") {
  return { n, code, text, ms, wait, at, ok, kind, note };
}

function failChain(cls: string, count: number) {
  const f = FAIL[cls], out = [];
  let at = 0;
  for (let i = 1; i <= count; i++) {
    const wait = i === 1 ? 0 : Math.round(2000 * Math.pow(2, i - 2) * (0.9 + Math.random() * 0.2));
    const ms = rnd(f.ms[0], f.ms[1]);
    at += wait;
    out.push(A(i, f.code, f.text, ms, wait, at, false));
    at += ms;
  }
  return out;
}
const lastEnd = (att: any[]) => {
  const l = att[att.length - 1];
  return l ? l.at + (l.ms || 0) : 0;
};

function makeEvent(ep: any, o: any = {}) {
  const ts = o.ts || Date.now(), status = o.status || "ok", cls = o.cls || null;
  const t = TPL[ep.provider](ts, cls ? FORCE_TYPE[cls] : undefined);
  const headers = Object.assign({}, t.headers, { host: "gateway.jumcart.com", "x-forwarded-for": ip(), "x-jumcart-endpoint": ep.proxy, "x-jumcart-signature-verified": "true" });
  const ev: any = { id: "evt_" + hex(10), provider: ep.provider, type: t.type, dest: ep.dest, epName: ep.name, ts, usd: t.usd, headers, body: t.body, cls: null, status, fresh: !!o.fresh, note: "", patched: false, replay: false };
  const okMs = rnd(14, 38), ack = ACK[ep.provider];

  if (status === "ok") {
    ev.latency = okMs;
    ev.attempts = [A(1, 200, "OK", okMs, 0, 0, true)];
    ev.resp = { code: 200, body: ack };
    ev.note = "Delivered on the first attempt.";
  } else if (status === "failed") {
    const f = FAIL[cls];
    ev.cls = cls;
    ev.attempts = failChain(cls, ATT[cls]);
    ev.latency = ev.attempts[ev.attempts.length - 1].ms;
    ev.resp = { code: f.code, body: f.resp() };
    ev.note = "Retries used up. Moved to the dead-letter queue.";
  } else if (status === "retrying") {
    const ch = failChain("timeout", 2);
    ev.attempts = ch.concat([{ n: 3, pending: true, wait: 8000, at: lastEnd(ch) + 8000, ms: null, code: 0, text: "", ok: false, kind: "auto", note: "" }]);
    ev.latency = null;
    ev.resp = { code: 504, body: FAIL.timeout.resp() };
    ev.resolveAt = Date.now() + (o.resolveIn || rnd(6000, 10000));
    ev.note = "Waiting 8.0 s before attempt 3.";
  } else if (status === "healed") {
    if (o.patched) {
      ev.cls = cls;
      ev.patched = true;
      const a1 = failChain(cls, 1);
      ev.attempts = a1.concat([A(2, 200, "OK", okMs, 0, lastEnd(a1) + 60, true, "patch", "Patched by " + RULE[cls])]);
      ev.latency = okMs;
      ev.resp = { code: 200, body: ack };
      ev.note = "Fixed by rule " + RULE[cls] + " and delivered.";
    } else {
      const ch2 = failChain("timeout", 2);
      ev.attempts = ch2.concat([A(3, 200, "OK", okMs, 8000, lastEnd(ch2) + 8000, true)]);
      ev.latency = okMs;
      ev.resp = { code: 200, body: ack };
      ev.note = "Recovered on attempt 3. No action needed.";
    }
  }
  return ev;
}

const EP_SEED = [
  { id: "ep1", name: "Payments", provider: "paystack", dest: "https://api.myapp.com/webhooks/payment", proxy: "gonze_live_839201", active: true, ev24h: 18402, rate: 99.91 },
  { id: "ep2", name: "Billing transfers", provider: "monnify", dest: "https://billing.northwind.ng/hooks/monnify", proxy: "gonze_live_702144", active: true, ev24h: 6120, rate: 99.74 },
  { id: "ep3", name: "Store orders", provider: "shopify", dest: "https://orders.kola-store.com/api/shopify/hooks", proxy: "gonze_live_451907", active: true, ev24h: 9377, rate: 99.62 },
  { id: "ep4", name: "Subscriptions", provider: "stripe", dest: "https://api.myapp.com/webhooks/stripe", proxy: "gonze_live_118563", active: true, ev24h: 11890, rate: 99.88 },
  { id: "ep5", name: "Deploy hooks", provider: "github", dest: "https://ci.myapp.com/hooks/github", proxy: "gonze_live_990231", active: true, ev24h: 2144, rate: 100 }
];

function seedEvents(eps: any[]) {
  const now = Date.now(), byProv = (p: string) => eps.find((e) => e.provider === p);
  const plan: Record<number, any> = {
    2: { s: "retrying", r: 7000 }, 4: { s: "failed", c: "schema" }, 6: { s: "failed", c: "locked" },
    8: { s: "healed" }, 9: { s: "failed", c: "schema" }, 12: { s: "retrying", r: 12000 },
    13: { s: "failed", c: "timeout" }, 16: { s: "failed", c: "secret" }, 19: { s: "failed", c: "locked" },
    21: { s: "healed" }, 24: { s: "failed", c: "schema" }, 27: { s: "failed", c: "secret" },
    30: { s: "healed" }, 33: { s: "failed", c: "schema" }, 37: { s: "failed", c: "timeout" },
    41: { s: "failed", c: "locked" }, 44: { s: "healed" }
  };
  const out = [], provs = ["paystack", "stripe", "monnify", "shopify", "github", "paystack", "stripe", "paystack", "shopify", "monnify"];
  for (let i = 0; i < 52; i++) {
    const pl = plan[i], ts = now - (i * 5200 + rnd(300, 2200));
    let prov = provs[i % provs.length];
    if (pl && pl.c) {
      prov = Object.keys(CLS_BY_PROV).find((k) => CLS_BY_PROV[k] === pl.c) || prov;
    }
    const ep = byProv(prov);
    if (ep) {
      out.push(makeEvent(ep, { ts, status: pl ? pl.s : "ok", cls: pl?.c || null, resolveIn: pl?.r }));
    }
  }
  return out;
}

const KEYS_SEED = [
  { id: "k1", name: "Production server", env: "live", value: "jm_live_sk_" + hex(32), created: "Sep 14, 2026", used: "2 min ago", shown: false, fresh: false },
  { id: "k2", name: "Staging", env: "test", value: "jm_test_sk_" + hex(32), created: "Sep 14, 2026", used: "3 hours ago", shown: false, fresh: false },
  { id: "k3", name: "CI replay job", env: "live", value: "jm_live_sk_" + hex(32), created: "Oct 02, 2026", used: "yesterday", shown: false, fresh: false }
];
const maskKey = (v: string) => v.slice(0, v.lastIndexOf("_") + 5) + "•".repeat(20) + v.slice(-4);

/* --- COMPONENTS --- */
function CopyBtn({ text, small, ghost, icon, label, children }: any) {
  const [done, setDone] = useState<string | boolean>(false);
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded border border-[#2a3340] font-medium transition-colors ${
        small ? "h-7 px-2.5 text-xs" : "h-8 px-3 text-xs"
      } ${ghost ? "bg-transparent text-[#8d98a7] hover:bg-[#141a22] hover:text-[#e8ecf1]" : "bg-[#141a22] text-[#e8ecf1] hover:bg-[#19202a]"} ${
        icon ? "w-7 px-0" : ""
      }`}
      aria-label={label || "Copy"}
      onClick={(e) => {
        e.stopPropagation();
        copyText(text).then((ok) => {
          setDone(ok ? "ok" : "fail");
          setTimeout(() => setDone(false), 1600);
        });
      }}
    >
      <Icon name={done === "ok" ? "Check" : "Copy"} size={small ? 12 : 14} />
      {icon ? "" : done === "ok" ? "Copied" : done === "fail" ? "Failed" : children || "Copy"}
    </button>
  );
}

function StatusPill({ e }: { e: any }) {
  const a = e.attempts.length - (e.status === "retrying" ? 1 : 0);
  if (e.status === "ok") return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-medium text-[#3ecf8e] bg-[#3ecf8e]/10 border border-[#3ecf8e]/20"><span className="w-1.5 h-1.5 rounded-full bg-current"></span>200 OK</span>;
  if (e.status === "failed") return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-medium text-[#ff6370] bg-[#ff6370]/10 border border-[#ff6370]/20"><span className="w-1.5 h-1.5 rounded-full bg-current"></span>{e.resp.code} Failed</span>;
  if (e.status === "retrying") return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-medium text-[#f2a93b] bg-[#f2a93b]/10 border border-[#f2a93b]/20"><span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>Retrying {a}/{ATT.timeout}</span>;
  return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-medium text-[#4cc9f0] bg-[#4cc9f0]/10 border border-[#4cc9f0]/20"><Icon name="Sparkles" size={11} />Healed</span>;
}

function ProvTag({ p }: { p: string }) {
  const d = PROV[p];
  if (!d) return null;
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-[#e8ecf1]">
      <span className="w-5 h-5 rounded grid place-items-center font-mono font-bold text-[10px] text-[#0a0d12]" style={{ background: d.color }}>{d.letter}</span>
      {d.name}
    </span>
  );
}

function Spark({ data, color }: { data: number[]; color: string }) {
  const w = 116, h = 34, pd = 3, min = Math.min(...data), max = Math.max(...data), r = (max - min) || 1;
  const pts = data.map((v, i) => [pd + i * (w - 2 * pd) / (data.length - 1), h - pd - (v - min) / r * (h - 2 * pd)]);
  const line = pts.map((q) => q[0].toFixed(1) + "," + q[1].toFixed(1)).join(" ");
  const area = `M${pts[0][0]},${h} L${line.split(" ").join(" L")} L${pts[pts.length - 1][0]},${h} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="flex-none">
      <line x1="0" x2={w} y1={h / 2} y2={h / 2} stroke="#1c232d" strokeDasharray="2 3" />
      <path d={area} fill={color} opacity="0.14" />
      <polyline points={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.6" fill={color} />
    </svg>
  );
}

function Metric({ label, value, sub, data, color }: any) {
  return (
    <div className="p-4 flex justify-between gap-2.5 items-end min-w-0">
      <div className="min-w-0">
        <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5d6877]">{label}</div>
        <div className="text-2xl font-bold tracking-tight text-[#e8ecf1] mt-1.5">{value}</div>
        <div className="text-xs font-mono text-[#8d98a7] mt-1 truncate">{sub}</div>
      </div>
      <Spark data={data} color={color} />
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-md bg-[#8ea3ff] grid place-items-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0d18" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 4v10a4.5 4.5 0 0 1-9 0" /><path d="M4 4h14" />
        </svg>
      </div>
      <span className="font-bold text-lg tracking-tight text-[#e8ecf1]">Jumcart</span>
      <span className="font-mono text-[11px] text-[#8d98a7] border border-[#2a3340] rounded px-1.5 py-0.5 whitespace-nowrap">by P. Gonze</span>
    </div>
  );
}

/* --- EVENT DETAIL DRAWER --- */
function Drawer({ e, onClose, onReplay, onDiagnosis }: any) {
  const [raw, setRaw] = useState(false);
  const f = e.cls ? DIAG[e.cls] : null;
  const curl = `curl -X POST '${e.dest}' \\\n` + Object.keys(e.headers).filter((k) => !k.startsWith("x-jumcart") && k !== "host" && k !== "x-forwarded-for").map((k) => `  -H '${k}: ${e.headers[k]}'`).join(" \\\n") + ` \\\n  -d '${JSON.stringify(e.body)}'`;
  let patchedBody = null;
  if (e.patched && e.cls === "schema") {
    const c = JSON.parse(JSON.stringify(e.body));
    c.data.total_amount = c.data.amount / 100;
    delete c.data.amount;
    patchedBody = c;
  }
  const backoffs = e.attempts.length - 1;
  const live = e.status === "retrying";

  return (
    <div>
      <div className="fixed inset-0 bg-[#030508]/60 z-40 backdrop-blur-sm" onClick={onClose}></div>
      <aside className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-[#0e1116] border-l border-[#2a3340] z-50 flex flex-col shadow-2xl">
        <div className="p-4 border-b border-[#1c232d] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <StatusPill e={e} />
            <span className="font-mono text-xs text-[#8d98a7] truncate">{e.id}</span>
          </div>
          <button className="h-7 w-7 rounded grid place-items-center text-[#8d98a7] hover:text-[#e8ecf1] hover:bg-[#141a22]" onClick={onClose}><Icon name="X" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <div>
            <div className="font-mono text-xl font-bold tracking-tight text-[#e8ecf1]">{e.type}</div>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#8d98a7]">
              <ProvTag p={e.provider} /><Icon name="ArrowRight" size={13} /><span className="font-mono text-[#e8ecf1]">{host(e.dest)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {e.status === "failed" && (
              <button className="inline-flex items-center gap-2 h-8 px-3.5 rounded bg-[#8ea3ff] text-[#0a0d18] text-xs font-semibold hover:bg-[#a5b6ff]" onClick={() => onReplay(e.id)}><Icon name="RotateCcw" />Replay event</button>
            )}
            {f && (
              <button className="inline-flex items-center gap-2 h-8 px-3 rounded border border-[#2a3340] bg-[#141a22] text-[#e8ecf1] text-xs font-semibold hover:bg-[#19202a]" onClick={() => onDiagnosis(e.cls)}><Icon name="Sparkles" />Open AI diagnosis</button>
            )}
            <CopyBtn text={curl}>Copy as cURL</CopyBtn>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-[#1c232d] border border-[#1c232d] rounded-lg overflow-hidden">
            {[["Received", clock(e.ts)], ["Latency", fmtMs(e.latency)], ["Attempts", String(live ? e.attempts.length - 1 : e.attempts.length)], ["Endpoint", e.epName], ["Signature", "verified"], ["Value", e.usd ? money(e.usd) : "—"]].map((x) => (
              <div key={x[0]} className="bg-[#0e1116] p-3">
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5d6877]">{x[0]}</div>
                <div className={`font-mono text-xs mt-1 truncate ${x[1] === "verified" ? "text-[#3ecf8e]" : "text-[#e8ecf1]"}`}>{x[1]}</div>
              </div>
            ))}
          </div>

          {e.status === "failed" && f && (
            <div className="border border-[#ff6370]/30 bg-[#ff6370]/10 rounded-lg p-3.5 text-xs">
              <div className="flex items-center gap-2 font-semibold text-[#ff6370]"><Icon name="AlertTriangle" size={14} />{f.title}</div>
              <div className="text-[#8d98a7] mt-1">{e.note} Jumcart has a suggested fix ready.</div>
            </div>
          )}

          {e.status === "healed" && (
            <div className="border border-[#4cc9f0]/30 bg-[#4cc9f0]/10 rounded-lg p-3.5 text-xs">
              <div className="flex items-center gap-2 font-semibold text-[#4cc9f0]"><Icon name="Sparkles" size={14} />Healed</div>
              <div className="text-[#8d98a7] mt-1">{e.note}</div>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5d6877]">Request headers ({Object.keys(e.headers).length})</div>
            <div className="grid grid-cols-2 gap-px bg-[#1c232d] border border-[#1c232d] rounded-lg overflow-hidden font-mono text-[11px]">
              {Object.keys(e.headers).map((k) => (
                <React.Fragment key={k}>
                  <div className="p-2 bg-[#141a22] text-[#8d98a7] truncate">{k}</div>
                  <div className="p-2 bg-[#0e1116] text-[#e8ecf1] truncate">{e.headers[k]}</div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5d6877]">Raw Request Body</div>
              <div className="flex items-center gap-2">
                <div className="inline-flex border border-[#2a3340] rounded overflow-hidden text-xs">
                  <button className={`px-2 py-0.5 ${!raw ? "bg-[#141a22] text-white" : "text-[#8d98a7]"}`} onClick={() => setRaw(false)}>Pretty</button>
                  <button className={`px-2 py-0.5 ${raw ? "bg-[#141a22] text-white" : "text-[#8d98a7]"}`} onClick={() => setRaw(true)}>Raw</button>
                </div>
                <CopyBtn small text={JSON.stringify(e.body, null, 2)} />
              </div>
            </div>
            <pre className="font-mono text-xs bg-[#090b0f] border border-[#1c232d] p-3 rounded-lg overflow-auto max-h-60" dangerouslySetInnerHTML={{ __html: hl(e.body, raw) }}></pre>
          </div>

          {e.patched && (
            <div className="space-y-2">
              <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#4cc9f0]">After Auto-Patch ({RULE[e.cls]})</div>
              <pre className="font-mono text-xs bg-[#090b0f] border border-[#1c232d] p-3 rounded-lg overflow-auto max-h-60" dangerouslySetInnerHTML={{ __html: hl(patchedBody || e.body) }}></pre>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5d6877]">Destination Response ({e.resp.code})</div>
            <pre className="font-mono text-xs bg-[#090b0f] border border-[#1c232d] p-3 rounded-lg overflow-auto" dangerouslySetInnerHTML={{ __html: hl(e.resp.body) }}></pre>
          </div>

          <div className="space-y-3">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5d6877]">Retry Timeline ({backoffs} Backoffs)</div>
            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-1.5 before:bottom-1.5 before:w-px before:bg-[#2a3340]">
              {e.attempts.map((a: any, i: number) => {
                const isOk = a.ok;
                return (
                  <div key={i} className="relative text-xs">
                    <span className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ${a.pending ? "bg-[#f2a93b]" : isOk ? "bg-[#3ecf8e]" : "bg-[#ff6370]"}`}></span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#e8ecf1]">Attempt {a.n}</span>
                      {a.pending ? (
                        <span className="font-mono text-[#f2a93b]">waiting</span>
                      ) : (
                        <span className={`font-mono ${isOk ? "text-[#3ecf8e]" : "text-[#ff6370]"}`}>{a.code} {a.text} ({fmtMs(a.ms)})</span>
                      )}
                    </div>
                    <div className="font-mono text-[11px] text-[#5d6877] mt-0.5">at +{(a.at / 1000).toFixed(1)}s {a.note && `· ${a.note}`}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* --- STREAM VIEW --- */
function StreamView({ events, now, live, setLive, onOpen, onSimFail, onReplayAll }: any) {
  const [fStatus, setFStatus] = useState("all");
  const [fProv, setFProv] = useState("all");
  const [q, setQ] = useState("");

  const counts: Record<string, number> = { all: events.length, ok: 0, failed: 0, retrying: 0, healed: 0 };
  events.forEach((x: any) => counts[x.status]++);

  const list = events.filter((x: any) => {
    if (fStatus !== "all" && x.status !== fStatus) return false;
    if (fProv !== "all" && x.provider !== fProv) return false;
    if (q) {
      const s = q.toLowerCase();
      if ((x.type + x.id + x.dest + x.provider).toLowerCase().indexOf(s) < 0) return false;
    }
    return true;
  });

  return (
    <div className="border border-[#1c232d] bg-[#0e1116] rounded-lg">
      <div className="p-4 border-b border-[#1c232d] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-sm text-[#e8ecf1]">Live Webhook Stream</h2>
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono ${live ? "text-[#3ecf8e] bg-[#3ecf8e]/10 border border-[#3ecf8e]/20" : "text-[#8d98a7] bg-[#141a22]"}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-current ${live ? "animate-pulse" : ""}`}></span>
            {live ? "Streaming" : "Paused"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 h-7 px-3 rounded border border-[#2a3340] bg-[#141a22] text-xs font-medium text-[#e8ecf1] hover:bg-[#19202a]" onClick={() => setLive(!live)}><Icon name={live ? "Pause" : "Play"} size={12} />{live ? "Pause" : "Resume"}</button>
          <button className="inline-flex items-center gap-1.5 h-7 px-3 rounded border border-[#2a3340] bg-[#141a22] text-xs font-medium text-[#e8ecf1] hover:bg-[#19202a]" onClick={onSimFail}><Icon name="Zap" size={12} />Simulate failure</button>
          <button className="inline-flex items-center gap-1.5 h-7 px-3 rounded bg-[#8ea3ff] text-[#0a0d18] text-xs font-semibold hover:bg-[#a5b6ff] disabled:opacity-40" disabled={counts.failed === 0} onClick={onReplayAll}><Icon name="RotateCcw" size={12} />Replay failed ({counts.failed})</button>
        </div>
      </div>

      <div className="p-3 border-b border-[#1c232d] flex flex-wrap items-center gap-2.5">
        <div className="inline-flex border border-[#2a3340] rounded bg-[#090b0f] overflow-hidden">
          {[["all", "All"], ["ok", "200 OK"], ["failed", "Failed"], ["retrying", "Retrying"], ["healed", "Healed"]].map((s) => (
            <button key={s[0]} className={`px-2.5 py-1 text-xs font-medium transition-colors ${fStatus === s[0] ? "bg-[#141a22] text-white" : "text-[#8d98a7] hover:text-white"}`} onClick={() => setFStatus(s[0])}>
              {s[1]} <span className="font-mono text-[10px] text-[#5d6877]">{counts[s[0]]}</span>
            </button>
          ))}
        </div>
        <select className="h-7 px-2 bg-[#090b0f] border border-[#2a3340] rounded text-xs text-[#e8ecf1]" value={fProv} onChange={(e) => setFProv(e.target.value)}>
          <option value="all">All sources</option>
          {Object.keys(PROV).map((k) => <option key={k} value={k}>{PROV[k].name}</option>)}
        </select>
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-2.5 top-1.5 text-[#5d6877]"><Icon name="Search" size={13} /></span>
          <input className="w-full h-7 pl-8 pr-2.5 bg-[#090b0f] border border-[#2a3340] rounded text-xs font-mono text-[#e8ecf1] placeholder-[#5d6877]" placeholder="Search event, id or URL" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <span className="ml-auto font-mono text-xs text-[#5d6877]">{list.length} of {events.length}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#1c232d] text-[#5d6877] font-mono uppercase text-[10px] bg-[#090b0f]">
              <th className="p-3">Status</th>
              <th className="p-3">Event type</th>
              <th className="p-3">Source</th>
              <th className="p-3">Destination URL</th>
              <th className="p-3 text-right">Latency</th>
              <th className="p-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {list.slice(0, 60).map((x: any) => (
              <tr key={x.id} className="border-b border-[#1c232d] hover:bg-white/[0.02] cursor-pointer transition-colors" onClick={() => onOpen(x.id)}>
                <td className="p-3"><StatusPill e={x} /></td>
                <td className="p-3 font-mono font-medium text-[#e8ecf1]">{x.type}</td>
                <td className="p-3"><ProvTag p={x.provider} /></td>
                <td className="p-3 font-mono text-[#8d98a7] max-w-xs truncate">{host(x.dest)}</td>
                <td className={`p-3 font-mono text-right ${x.latency >= 1000 ? "text-[#f2a93b]" : "text-[#e8ecf1]"}`}>{fmtMs(x.latency)}</td>
                <td className="p-3 font-mono text-[#8d98a7] whitespace-nowrap">{clock(x.ts)} <span className="text-[#5d6877]">· {ago(x.ts, now)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <div className="p-8 text-center text-xs text-[#8d98a7]">No events match these filters.</div>}
      </div>
    </div>
  );
}

/* --- ENDPOINTS VIEW --- */
function EndpointsView({ endpoints, setEndpoints, toast, onTest }: any) {
  const [url, setUrl] = useState("https://api.myapp.com/webhooks/payment");
  const [prov, setProv] = useState("paystack");
  const [res, setRes] = useState(endpoints[0]);
  const [err, setErr] = useState<string | null>(null);
  const [ct, setCt] = useState("dash");
  const [del, setDel] = useState<string | null>(null);

  const proxyUrl = (id: string) => `https://gateway.jumcart.com/p/${id}`;
  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    const u = url.trim();
    if (!u.startsWith("http://") && !u.startsWith("https://")) {
      setErr("Enter a full URL starting with https://");
      return;
    }
    setErr(null);
    const exist = endpoints.find((x: any) => x.dest === u && x.provider === prov);
    if (exist) {
      setRes(exist);
      toast("URL already proxied. Displaying below.", "info");
      return;
    }
    const ep = {
      id: "ep" + Date.now(),
      name: `${PROV[prov].name} · ${new URL(u).hostname.replace(/^(api|www)\./, "")}`,
      provider: prov,
      dest: u,
      proxy: "gonze_live_" + digits(6),
      active: true,
      ev24h: 0,
      rate: 100
    };
    setEndpoints((l: any[]) => [ep, ...l]);
    setRes(ep);
    toast("Drop-in proxy created. Start routing traffic.", "ok");
  };

  const pu = proxyUrl(res.proxy);
  const code: Record<string, string[]> = {
    dash: [`- Webhook URL  ${res.dest}`, `+ Webhook URL  ${pu}`],
    node: [`- const WEBHOOK_URL = "${res.dest}";`, `+ const WEBHOOK_URL = "${pu}";`],
    curl: [`curl -X POST "${pu}" \\`, `  -H "Content-Type: application/json" -d '{"event":"ping"}'`]
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 border border-[#1c232d] bg-[#0e1116] rounded-lg">
          <div className="p-4 border-b border-[#1c232d] flex items-center justify-between">
            <h2 className="font-bold text-sm text-[#e8ecf1]">Drop-in Proxy Generator</h2>
            <span className="font-mono text-[10px] text-[#5d6877] uppercase tracking-wider">2 min setup</span>
          </div>
          <form className="p-4 space-y-3" onSubmit={generate}>
            <div className="space-y-1">
              <label className="text-xs text-[#8d98a7]">Your backend target URL</label>
              <input className="w-full h-8 px-2.5 bg-[#090b0f] border border-[#2a3340] rounded text-xs font-mono text-[#e8ecf1]" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[#8d98a7]">Webhook Provider</label>
              <select className="w-full h-8 px-2 bg-[#090b0f] border border-[#2a3340] rounded text-xs text-[#e8ecf1]" value={prov} onChange={(e) => setProv(e.target.value)}>
                {Object.keys(PROV).map((k) => <option key={k} value={k}>{PROV[k].name}</option>)}
              </select>
            </div>
            {err && <div className="text-xs text-[#ff6370]">{err}</div>}
            <button className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded bg-[#8ea3ff] text-[#0a0d18] text-xs font-semibold hover:bg-[#a5b6ff]"><Icon name="Zap" size={13} />Generate proxy URL</button>
          </form>
          <div className="p-4 border-t border-[#1c232d] space-y-2">
            <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5d6877]">Your drop-in proxy URL</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-2 bg-[#090b0f] border border-[#1c232d] rounded font-mono text-xs text-[#8ea3ff] truncate">{pu}</div>
              <CopyBtn text={pu} />
            </div>
            <div className="text-xs text-[#8d98a7]">Forwards directly to <span className="font-mono text-[#e8ecf1]">{host(res.dest)}</span> with zero drops.</div>
            <div className="pt-1">
              <button className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded border border-[#2a3340] bg-[#141a22] text-xs font-medium text-[#e8ecf1] hover:bg-[#19202a]" onClick={() => onTest(res)}><Icon name="FlaskConical" size={12} />Send test event</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 border border-[#1c232d] bg-[#0e1116] rounded-lg">
          <div className="p-4 border-b border-[#1c232d] flex items-center justify-between">
            <h2 className="font-bold text-sm text-[#e8ecf1]">Switch in Two Lines</h2>
            <div className="inline-flex border border-[#2a3340] rounded bg-[#090b0f] overflow-hidden text-xs">
              {[["dash", "Dashboard"], ["node", "Node.js"], ["curl", "cURL"]].map((t) => (
                <button key={t[0]} className={`px-2.5 py-1 ${ct === t[0] ? "bg-[#141a22] text-white" : "text-[#8d98a7]"}`} onClick={() => setCt(t[0])}>{t[1]}</button>
              ))}
            </div>
          </div>
          <div className="p-4 space-y-3">
            <pre className="font-mono text-xs bg-[#090b0f] border border-[#1c232d] p-3 rounded-lg leading-relaxed">
              {code[ct].map((l, i) => (
                <div key={i} className={l.startsWith("-") ? "text-[#ff6370] bg-[#ff6370]/10" : l.startsWith("+") ? "text-[#3ecf8e] bg-[#3ecf8e]/10" : "text-[#8d98a7]"}>{l}</div>
              ))}
            </pre>
            <div className="flex items-center justify-between text-xs text-[#8d98a7]">
              <span>Zero SDKs or infrastructure rewrites needed.</span>
              <CopyBtn small text={code[ct].join("\n")} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              {[["Retries", "Exponential backoff with jitter"], ["Replay", "One-click safe recovery"], ["Self-healing", "Autonomous AI error resolution"]].map((x) => (
                <div key={x[0]} className="p-2.5 border border-[#1c232d] rounded bg-[#141a22]">
                  <div className="font-semibold text-xs text-[#e8ecf1]">{x[0]}</div>
                  <div className="text-[11px] text-[#8d98a7] mt-1">{x[1]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border border-[#1c232d] bg-[#0e1116] rounded-lg">
        <div className="p-4 border-b border-[#1c232d] flex items-center justify-between">
          <h2 className="font-bold text-sm text-[#e8ecf1]">Registered Endpoints</h2>
          <span className="font-mono text-xs text-[#5d6877]">{endpoints.filter((e: any) => e.active).length} active of {endpoints.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1c232d] text-[#5d6877] font-mono uppercase text-[10px] bg-[#090b0f]">
                <th className="p-3">Name</th>
                <th className="p-3">Proxy URL</th>
                <th className="p-3">Destination</th>
                <th className="p-3 text-right">24h volume</th>
                <th className="p-3 text-right">Success</th>
                <th className="p-3">Active</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((ep: any) => (
                <tr key={ep.id} className="border-b border-[#1c232d]">
                  <td className="p-3 font-semibold text-[#e8ecf1]">{ep.name}</td>
                  <td className="p-3 font-mono text-[#8ea3ff]">{proxyUrl(ep.proxy)}</td>
                  <td className="p-3 font-mono text-[#8d98a7] truncate max-w-xs">{host(ep.dest)}</td>
                  <td className="p-3 font-mono text-right">{ep.ev24h.toLocaleString("en-US")}</td>
                  <td className="p-3 font-mono text-right text-[#3ecf8e]">{ep.rate.toFixed(2)}%</td>
                  <td className="p-3">
                    <button className={`w-8 h-4 rounded-full transition-colors relative ${ep.active ? "bg-[#8ea3ff]" : "bg-[#2a3340]"}`} onClick={() => setEndpoints((l: any[]) => l.map((x) => x.id === ep.id ? { ...x, active: !x.active } : x))}>
                      <span className={`block w-3 h-3 rounded-full bg-black transition-transform absolute top-0.5 ${ep.active ? "right-0.5" : "left-0.5"}`}></span>
                    </button>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <button className="h-6 px-2 border border-[#2a3340] rounded text-xs hover:bg-[#141a22]" onClick={() => onTest(ep)}>Test</button>
                    {del === ep.id ? (
                      <button className="h-6 px-2 bg-[#ff6370] text-black font-semibold rounded text-xs" onClick={() => { setEndpoints((l: any[]) => l.filter((x) => x.id !== ep.id)); setDel(null); }}>Confirm</button>
                    ) : (
                      <button className="h-6 px-2 text-[#ff6370] hover:bg-[#ff6370]/10 rounded text-xs" onClick={() => setDel(ep.id)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* --- HEALING VIEW --- */
function HealingView({ events, diags, setDiag, onApprove, onOpen, setTab }: any) {
  const stats = (c: string) => {
    const open = events.filter((e: any) => e.cls === c && e.status === "failed");
    const fixed = events.filter((e: any) => e.cls === c && e.patched);
    return { open, fixed, usd: open.reduce((a: number, e: any) => a + e.usd, 0), saved: fixed.reduce((a: number, e: any) => a + e.usd, 0) };
  };

  const order = ["schema", "locked", "secret", "timeout"];
  let totalOpen = 0, totalUsd = 0;
  order.forEach((c) => {
    const s = stats(c);
    totalOpen += s.open.length;
    totalUsd += s.usd;
  });

  const logLines: any[] = [];
  events.filter((e: any) => e.cls).slice(0, 9).forEach((e: any) => {
    logLines.push({ ts: e.ts, k: e.patched ? "heal" : "bad", t: `${e.patched ? "patched " : "classified "}${e.id} as ${DIAG[e.cls].title} (${DIAG[e.cls].conf}%)` });
  });
  order.forEach((c) => {
    if (diags[c].appliedAt) {
      logLines.push({ ts: diags[c].appliedAt, k: "ok", t: `rule ${RULE[c]} is active across 14 edge regions` });
    }
  });
  logLines.sort((a, b) => b.ts - a.ts);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-lg text-[#e8ecf1]">Self-Healing AI Diagnostics</h2>
          <div className="text-xs text-[#8d98a7]">Autonomous payload interception, root-cause deduction, and schema patch deployment.</div>
        </div>
        <div className="flex gap-4 font-mono text-xs">
          <span><span className="text-[#5d6877]">Open failures </span><span className={totalOpen ? "text-[#ff6370]" : "text-[#3ecf8e]"}>{totalOpen}</span></span>
          <span><span className="text-[#5d6877]">At risk </span><span className="text-[#f2a93b]">{money(totalUsd)}</span></span>
          <span><span className="text-[#5d6877]">Diagnostic engine </span>heal-2.1</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-8 space-y-4">
          {order.map((c) => {
            const d = DIAG[c], st = diags[c], s = stats(c);
            const n = s.open.length + s.fixed.length;
            if (st.status === "dismissed") {
              return (
                <div key={c} className="p-4 border border-[#1c232d] bg-[#0e1116] rounded-lg flex items-center justify-between">
                  <span className="text-xs text-[#8d98a7]">{d.title} dismissed</span>
                  <button className="h-7 px-2.5 rounded border border-[#2a3340] text-xs hover:bg-[#141a22]" onClick={() => setDiag(c, { status: "pending" })}>Reopen</button>
                </div>
              );
            }
            return (
              <section key={c} className="border border-[#1c232d] bg-[#0e1116] rounded-lg overflow-hidden" id={`diag-${c}`}>
                <div className="p-4 border-b border-[#1c232d] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg grid place-items-center ${st.status === "applied" ? "bg-[#3ecf8e]/10 text-[#3ecf8e]" : "bg-[#ff6370]/10 text-[#ff6370]"}`}>
                      <Icon name={d.icon} size={16} />
                    </span>
                    <div>
                      <div className="font-bold text-sm text-[#e8ecf1]">{d.title}</div>
                      <div className="font-mono text-xs text-[#5d6877]">{d.scope}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#8d98a7]">{d.conf}% confidence</span>
                    {st.status === "applied" ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono text-[#3ecf8e] bg-[#3ecf8e]/10 border border-[#3ecf8e]/20"><Icon name="ShieldCheck" size={12} />Active</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono text-[#ff6370] bg-[#ff6370]/10 border border-[#ff6370]/20">{s.open.length} failed</span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <div className="p-3.5 border border-[#1c232d] bg-[#141a22] rounded-lg">
                    <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5d6877] flex items-center gap-2"><Icon name="Bot" size={13} />Diagnostic Deductions</div>
                    <p className="text-xs text-[#e8ecf1] leading-relaxed mt-2">{d.diagnosis(n || 0)}</p>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5d6877] mb-2">Automated Transformation Patch</div>
                    <pre className="font-mono text-xs bg-[#090b0f] border border-[#1c232d] p-3 rounded-lg leading-relaxed">
                      {d.patch.map((l: any, i: number) => (
                        <div key={i} className={l.t === "del" ? "text-[#ff6370]" : l.t === "add" ? "text-[#3ecf8e]" : "text-[#8d98a7]"}>{l.s}</div>
                      ))}
                    </pre>
                  </div>

                  {st.status === "applying" && (
                    <div className="p-3 border border-[#1c232d] bg-[#141a22] rounded-lg space-y-1.5">
                      {d.steps.map((x: string, i: number) => {
                        const done = i < st.step, cur = i === st.step;
                        return (
                          <div key={i} className={`flex items-center gap-2 text-xs font-mono ${done ? "text-[#3ecf8e]" : cur ? "text-[#e8ecf1]" : "text-[#5d6877]"}`}>
                            <Icon name={done ? "Check" : cur ? "RefreshCw" : "Circle"} size={12} className={cur ? "animate-spin" : ""} />
                            {x}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {st.status === "applied" && (
                    <div className="p-3 border border-[#3ecf8e]/30 bg-[#3ecf8e]/10 rounded-lg text-xs">
                      <div className="font-semibold text-[#3ecf8e] flex items-center gap-2"><Icon name="ShieldCheck" size={14} />Rule live on edge. {st.healed || 0} events self-healed and forwarded.</div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {st.status === "applied" ? (
                      <>
                        <button className="h-8 px-3 rounded border border-[#2a3340] bg-[#141a22] text-xs font-medium text-[#e8ecf1] hover:bg-[#19202a]" onClick={() => setDiag(c, { status: "pending", appliedAt: null })}>Roll back</button>
                        <button className="h-8 px-3 text-xs text-[#8d98a7] hover:text-[#e8ecf1]" onClick={() => setTab("stream")}>View stream</button>
                      </>
                    ) : (
                      <>
                        <button className="h-8 px-3.5 rounded bg-[#3ecf8e] text-black text-xs font-bold hover:bg-[#5ddda5] disabled:opacity-40" disabled={st.status === "applying" || s.open.length === 0} onClick={() => onApprove(c)}>Approve & Replay ({s.open.length})</button>
                        <button className="h-8 px-3 text-xs text-[#8d98a7] hover:text-[#e8ecf1]" disabled={st.status === "applying"} onClick={() => setDiag(c, { status: "dismissed" })}>Dismiss</button>
                      </>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <div className="xl:col-span-4 border border-[#1c232d] bg-[#0e1116] rounded-lg p-4 space-y-3 h-fit">
          <div className="flex items-center justify-between border-b border-[#1c232d] pb-3">
            <h2 className="font-bold text-sm text-[#e8ecf1]">Analysis Audit Trail</h2>
            <span className="text-xs font-mono text-[#3ecf8e] flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>live</span>
          </div>
          <div className="font-mono text-xs space-y-2">
            {logLines.map((l, i) => (
              <div key={i} className="flex gap-2 text-[11px] border-b border-[#1c232d]/40 pb-1.5">
                <span className="text-[#5d6877]">{clock(l.ts)}</span>
                <span className={l.k === "bad" ? "text-[#ff6370]" : l.k === "heal" ? "text-[#4cc9f0]" : "text-[#3ecf8e]"}>●</span>
                <span className="text-[#8d98a7] flex-1 truncate">{l.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- REPLAY VIEW --- */
function ReplayView({ events, settings, logs, running, sel, setSel, onRun, onStop, onClear, onOpen, setTab }: any) {
  const failed = events.filter((e: any) => e.status === "failed");
  const picked = failed.filter((e: any) => sel[e.id]);
  const allOn = failed.length > 0 && picked.length === failed.length;
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [logs]);

  const sched = [];
  for (let i = 1; i < settings.max; i++) {
    sched.push((settings.base * Math.pow(settings.mult, i - 1)).toFixed(0) + "s");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-5 border border-[#1c232d] bg-[#0e1116] rounded-lg">
        <div className="p-4 border-b border-[#1c232d] flex items-center justify-between">
          <h2 className="font-bold text-sm text-[#e8ecf1]">One-Click Batch Replay</h2>
          <span className="font-mono text-xs text-[#5d6877]">{failed.length} failed</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <button className="h-8 px-3.5 rounded bg-[#8ea3ff] text-[#0a0d18] text-xs font-semibold hover:bg-[#a5b6ff] disabled:opacity-40" disabled={running || failed.length === 0} onClick={() => onRun(failed.map((e: any) => e.id))}>Replay all ({failed.length})</button>
            <button className="h-8 px-3 rounded border border-[#2a3340] bg-[#141a22] text-xs font-semibold text-[#e8ecf1] hover:bg-[#19202a] disabled:opacity-40" disabled={running || picked.length === 0} onClick={() => onRun(picked.map((e: any) => e.id))}>Replay selected ({picked.length})</button>
            {running && <button className="h-8 px-3 rounded border border-[#ff6370]/30 text-[#ff6370] text-xs font-semibold hover:bg-[#ff6370]/10" onClick={onStop}>Stop</button>}
          </div>
          <div className="p-3 border border-[#1c232d] bg-[#141a22] rounded-lg text-xs space-y-1">
            <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5d6877]">Backoff Schedule</div>
            <div className="font-mono text-[#e8ecf1]">{sched.join(" → ")} (fast simulation)</div>
          </div>
        </div>

        <div className="border-t border-[#1c232d] p-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-[#8d98a7]">
            <input type="checkbox" checked={allOn} disabled={failed.length === 0} onChange={(e) => {
              const m: Record<string, boolean> = {};
              if (e.target.checked) failed.forEach((x: any) => { m[x.id] = true; });
              setSel(m);
            }} /> Select all
          </label>
        </div>

        <div className="max-h-80 overflow-y-auto border-t border-[#1c232d]">
          {failed.map((e: any) => (
            <div key={e.id} className="p-3 border-b border-[#1c232d] flex items-center gap-3 text-xs">
              <input type="checkbox" checked={!!sel[e.id]} onChange={(ev) => {
                const m = { ...sel };
                if (ev.target.checked) m[e.id] = true;
                else delete m[e.id];
                setSel(m);
              }} />
              <div className="flex-1 min-w-0">
                <div className="font-mono font-semibold text-[#e8ecf1] truncate">{e.type}</div>
                <div className="font-mono text-[11px] text-[#5d6877] truncate">{PROV[e.provider].name} → {host(e.dest)}</div>
              </div>
              <button className="h-6 px-2 text-[#8d98a7] hover:text-[#e8ecf1]" onClick={() => onOpen(e.id)}>Inspect</button>
            </div>
          ))}
          {failed.length === 0 && <div className="p-8 text-center text-xs text-[#8d98a7]">No failed events currently queued.</div>}
        </div>
      </div>

      <div className="lg:col-span-7 border border-[#1c232d] bg-[#05070a] rounded-lg overflow-hidden flex flex-col h-full min-h-[440px]">
        <div className="p-3 bg-[#0e1116] border-b border-[#1c232d] flex items-center justify-between text-xs text-[#8d98a7]">
          <div className="flex items-center gap-2 font-mono"><Icon name="Terminal" size={13} />jumcart replay cli</div>
          <button className="text-[11px] hover:text-[#e8ecf1]" onClick={onClear}>Clear</button>
        </div>
        <div className="p-4 font-mono text-xs space-y-1.5 flex-1 overflow-y-auto" ref={termRef}>
          {logs.map((l: any) => (
            <div key={l.id} className={l.k === "cmd" ? "text-[#8ea3ff]" : l.k === "ok" ? "text-[#3ecf8e]" : l.k === "bad" ? "text-[#ff6370]" : l.k === "wait" ? "text-[#f2a93b]" : "text-[#8d98a7]"}>
              {l.t}
            </div>
          ))}
          {running ? <span className="inline-block w-2 h-3.5 bg-white animate-pulse"></span> : <div><span className="text-[#8ea3ff]">$ </span><span className="inline-block w-2 h-3.5 bg-white animate-pulse"></span></div>}
        </div>
      </div>
    </div>
  );
}

/* --- SETTINGS VIEW --- */
function SettingsView({ settings, setSettings, keys, setKeys, secret, onRotate, toast }: any) {
  const [nm, setNm] = useState("Ingest worker");
  const [env, setEnv] = useState("live");
  const [rev, setRev] = useState<string | null>(null);

  const addKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nm.trim()) return;
    setKeys((l: any[]) => [{ id: "k" + Date.now(), name: nm.trim(), env, value: `jm_${env}_sk_${hex(32)}`, created: "Oct 30, 2026", used: "never", shown: true, fresh: true }, ...l]);
    toast("API Key generated successfully.", "ok");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="lg:col-span-2 border border-[#1c232d] bg-[#0e1116] rounded-lg">
        <div className="p-4 border-b border-[#1c232d] flex items-center justify-between">
          <h2 className="font-bold text-sm text-[#e8ecf1]">API Authentication Keys</h2>
          <span className="font-mono text-xs text-[#5d6877]">{keys.length} keys</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1c232d] text-[#5d6877] font-mono uppercase text-[10px] bg-[#090b0f]">
                <th className="p-3">Name</th>
                <th className="p-3">Key</th>
                <th className="p-3">Created</th>
                <th className="p-3">Last used</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k: any) => (
                <tr key={k.id} className="border-b border-[#1c232d]">
                  <td className="p-3 font-semibold text-[#e8ecf1]">{k.name}</td>
                  <td className="p-3 font-mono text-xs">{k.shown ? k.value : maskKey(k.value)}</td>
                  <td className="p-3 font-mono text-[#8d98a7]">{k.created}</td>
                  <td className="p-3 font-mono text-[#8d98a7]">{k.used}</td>
                  <td className="p-3 text-right space-x-1">
                    <button className="h-6 px-2 hover:bg-[#141a22] rounded" onClick={() => setKeys((l: any[]) => l.map((x) => x.id === k.id ? { ...x, shown: !x.shown } : x))}>
                      <Icon name={k.shown ? "EyeOff" : "Eye"} size={13} />
                    </button>
                    <CopyBtn small text={k.value} />
                    {rev === k.id ? (
                      <button className="h-6 px-2 bg-[#ff6370] text-black font-semibold rounded text-xs" onClick={() => { setKeys((l: any[]) => l.filter((x) => x.id !== k.id)); setRev(null); }}>Revoke</button>
                    ) : (
                      <button className="h-6 px-2 text-[#ff6370] hover:bg-[#ff6370]/10 rounded" onClick={() => setRev(k.id)}>Revoke</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form className="p-4 border-t border-[#1c232d] flex flex-wrap items-end gap-3" onSubmit={addKey}>
          <div className="space-y-1 flex-1 min-w-[200px]">
            <label className="text-xs text-[#8d98a7]">New Key Description</label>
            <input className="w-full h-8 px-2.5 bg-[#090b0f] border border-[#2a3340] rounded text-xs text-[#e8ecf1]" value={nm} onChange={(e) => setNm(e.target.value)} />
          </div>
          <div className="space-y-1 w-32">
            <label className="text-xs text-[#8d98a7]">Environment</label>
            <select className="w-full h-8 px-2 bg-[#090b0f] border border-[#2a3340] rounded text-xs text-[#e8ecf1]" value={env} onChange={(e) => setEnv(e.target.value)}>
              <option value="live">Live</option>
              <option value="test">Test</option>
            </select>
          </div>
          <button className="h-8 px-3.5 bg-[#8ea3ff] text-black text-xs font-semibold rounded hover:bg-[#a5b6ff]"><Icon name="Plus" size={13} />Create key</button>
        </form>
      </div>

      <div className="border border-[#1c232d] bg-[#0e1116] rounded-lg p-4 space-y-4">
        <h2 className="font-bold text-sm text-[#e8ecf1] border-b border-[#1c232d] pb-3">Gateway Secret Rotation</h2>
        <div className="text-xs text-[#8d98a7]">Verify that requests delivered by Jumcart originate from our edge proxies using HMAC verification.</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 p-2 bg-[#090b0f] border border-[#1c232d] rounded font-mono text-xs text-[#8ea3ff] truncate">{secret}</div>
          <CopyBtn text={secret} />
        </div>
        <button className="h-8 px-3 rounded border border-[#2a3340] bg-[#141a22] text-xs font-semibold text-[#e8ecf1] hover:bg-[#19202a]" onClick={onRotate}><Icon name="RefreshCw" size={13} />Rotate signing secret</button>
      </div>

      <div className="border border-[#1c232d] bg-[#0e1116] rounded-lg p-4 space-y-4">
        <h2 className="font-bold text-sm text-[#e8ecf1] border-b border-[#1c232d] pb-3">Automated Self-Healing Rules</h2>
        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between">
            <span>Auto-apply rules above 95% confidence</span>
            <input type="checkbox" checked={settings.auto} onChange={(e) => setSettings({ ...settings, auto: e.target.checked })} />
          </label>
          <label className="flex items-center justify-between">
            <span>Slack channel incident routing</span>
            <input type="checkbox" checked={settings.slack} onChange={(e) => setSettings({ ...settings, slack: e.target.checked })} />
          </label>
          <label className="flex items-center justify-between">
            <span>Payload sanitization & card masking</span>
            <input type="checkbox" checked={settings.mask} onChange={(e) => setSettings({ ...settings, mask: e.target.checked })} />
          </label>
        </div>
      </div>
    </div>
  );
}

/* --- MAIN PAGE APP --- */
export default function Home() {
  const [tab, setTab] = useState("stream");
  const [endpoints, setEndpoints] = useState(EP_SEED);
  const [events, setEvents] = useState(() => seedEvents(EP_SEED));
  const [live, setLive] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [diags, setDiags] = useState<Record<string, any>>({
    schema: { status: "pending", step: 0 },
    timeout: { status: "pending", step: 0 },
    locked: { status: "pending", step: 0 },
    secret: { status: "pending", step: 0 }
  });
  const [now, setNow] = useState(Date.now());
  const [settings, setSettings] = useState({ max: 5, base: 2, mult: 2, jitter: true, timeout: 10, auto: false, slack: true, email: true, mask: true, retention: "30" });
  const [keys, setKeys] = useState(KEYS_SEED);
  const [secret, setSecret] = useState("whsec_" + hex(40));
  const [toasts, setToasts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([{ id: 1, k: "dim", t: "jumcart-cli 2.4.1 · replay engine online. Choose failed transactions to initiate recovery." }]);
  const [running, setRunning] = useState(false);
  const [rsel, setRsel] = useState<Record<string, boolean>>({});

  const [m, setM] = useState({
    total: 2418920,
    rev: 48210,
    lat: 24,
    rate: 99.98,
    hist: {
      total: Array.from({ length: 30 }, () => rnd(9, 24)),
      rate: Array.from({ length: 30 }, () => 99.97 + Math.random() * 0.012),
      rev: Array.from({ length: 30 }, (_, i) => 47900 + i * 10.7),
      lat: Array.from({ length: 30 }, () => 22 + Math.random() * 5)
    }
  });

  const R = useRef<any>({});
  R.current = { events, diags, settings, endpoints, running };
  const revAdd = useRef(0), cancel = useRef(false), logId = useRef(2), runningRef = useRef(false), toastId = useRef(1);

  const toast = useCallback((msg: string, kind: string = "info") => {
    const id = toastId.current++;
    setToasts((l) => [...l, { id, msg, kind }].slice(-3));
    setTimeout(() => setToasts((l) => l.filter((x) => x.id !== id)), 3600);
  }, []);

  const updateEvent = (id: string, patch: any) => setEvents((l) => l.map((e) => e.id === id ? { ...e, ...patch } : e));
  const setDiag = (c: string, patch: any) => setDiags((o) => ({ ...o, [c]: { ...o[c], ...patch } }));
  const pushLog = (k: string, t: string) => {
    const id = logId.current++;
    setLogs((l) => [...l.slice(-300), { id, k, t }]);
    return id;
  };

  const addLive = useCallback((force: any = {}) => {
    const eps = R.current.endpoints.filter((e: any) => e.active);
    const ep = force.ep || (eps.length ? pick(eps) : null);
    if (!ep) return;
    let status = force.status || "ok", cls = null, patched = false;
    const r = Math.random();
    if (!force.status) {
      if (r < 0.07 && CLS_BY_PROV[ep.provider]) status = "failed";
      else if (r < 0.12) status = "retrying";
    }
    if (status === "failed") {
      cls = CLS_BY_PROV[ep.provider];
      if (!cls) status = "ok";
      else if (R.current.diags[cls].status === "applied") {
        status = "healed";
        patched = true;
      }
    }
    const ev = makeEvent(ep, { status, cls, patched, fresh: true });
    if (status === "healed") revAdd.current += ev.usd;
    setEvents((l) => [ev, ...l].slice(0, 90));
    setEndpoints((l: any[]) => l.map((x) => x.id === ep.id ? { ...x, ev24h: x.ev24h + 1 } : x));
    return ev;
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const n = Date.now();
      setNow(n);
      setM((p) => {
        const add = rnd(9, 24);
        const lat = +(p.lat * 0.85 + rnd(16, 32) * 0.15).toFixed(1);
        const total = p.total + add;
        const rev = p.rev + revAdd.current;
        revAdd.current = 0;
        const open = R.current.events.filter((e: any) => e.status === "failed").length;
        const rate = Math.min(99.99, 99.999 - open * 0.002);
        const push = (a: number[], v: number) => [...a.slice(1), v];
        return {
          total, rev, lat, rate,
          hist: { total: push(p.hist.total, add), rate: push(p.hist.rate, rate), rev: push(p.hist.rev, rev), lat: push(p.hist.lat, lat) }
        };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => addLive(), 2600);
    return () => clearInterval(t);
  }, [live, addLive]);

  const approve = async (c: string) => {
    const d = R.current.diags[c];
    if (d.status !== "pending") return;
    setDiag(c, { status: "applying", step: 0 });
    for (let i = 0; i < DIAG[c].steps.length - 1; i++) {
      setDiag(c, { step: i });
      await sleep(620);
    }
    setDiag(c, { step: DIAG[c].steps.length - 1 });
    await sleep(500);

    const open = R.current.events.filter((e: any) => e.cls === c && e.status === "failed");
    pushLog("cmd", `$ jumcart rules apply ${RULE[c]} --replay ${open.length}`);
    let saved = 0;
    for (let j = 0; j < open.length; j++) {
      const e = open[j];
      await sleep(170);
      const okMs = rnd(18, 50);
      updateEvent(e.id, {
        status: "healed",
        patched: true,
        latency: okMs,
        resp: { code: 200, body: ACK[e.provider] },
        note: `Fixed by rule ${RULE[c]} and delivered.`,
        attempts: [...e.attempts, A(e.attempts.length + 1, 200, "OK", okMs, 0, lastEnd(e.attempts) + 60, true, "patch", `Patched by ${RULE[c]}`)]
      });
      revAdd.current += e.usd;
      saved += e.usd;
      pushLog("ok", `  ✓ ${e.id} patched and delivered`);
    }
    setDiag(c, { status: "applied", step: 4, healed: open.length, saved, appliedAt: Date.now() });
    toast(`${DIAG[c].title}: ${open.length} events successfully healed.`, "ok");
  };

  const runReplay = async (ids: string[]) => {
    if (runningRef.current) return;
    if (!ids.length) return;
    runningRef.current = true;
    setRunning(true);
    cancel.current = false;
    const S = R.current.settings;

    pushLog("cmd", `$ jumcart replay --events ${ids.length} --max-attempts ${S.max}`);
    for (let q = 0; q < ids.length; q++) {
      if (cancel.current) break;
      const ev = R.current.events.find((e: any) => e.id === ids[q]);
      if (!ev) continue;
      const cls = ev.cls;
      const patched = cls && R.current.diags[cls].status === "applied";
      pushLog("dim", `▸ ${ev.id} ${PROV[ev.provider].name} ${ev.type}`);
      await sleep(300);

      if (patched) {
        updateEvent(ev.id, {
          status: "healed",
          patched: true,
          latency: 28,
          resp: { code: 200, body: ACK[ev.provider] },
          attempts: [...ev.attempts, A(ev.attempts.length + 1, 200, "OK", 28, 0, lastEnd(ev.attempts) + 60, true, "patch", `Patched by ${RULE[cls]}`)]
        });
        revAdd.current += ev.usd;
        pushLog("ok", `  ✓ ${ev.id} replayed and delivered`);
      } else {
        updateEvent(ev.id, {
          status: "failed",
          note: "Replay failed. Upstream rejected schema."
        });
        pushLog("bad", `  ✗ ${ev.id} destination returned 4xx/5xx`);
      }
    }
    runningRef.current = false;
    setRunning(false);
  };

  const openEv = openId ? events.find((e: any) => e.id === openId) : null;
  const failedN = events.filter((e: any) => e.status === "failed").length;

  return (
    <div className="min-h-screen bg-[#090b0f] text-[#e8ecf1] font-sans antialiased selection:bg-[#8ea3ff] selection:text-black">
      <header className="border-b border-[#1c232d] bg-[#090b0f] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 py-3.5">
            <div className="flex items-center gap-4">
              <Logo />
              <span className="font-mono text-xs text-[#8d98a7] hidden md:inline border-l border-[#1c232d] pl-4">The Self-Healing Webhook Gateway & API Proxy</span>
            </div>
            <span className="inline-flex items-center gap-2 font-mono text-xs text-[#3ecf8e] bg-[#3ecf8e]/10 border border-[#3ecf8e]/25 px-2.5 py-1 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              Network: 99.99% Operational
            </span>
          </div>

          <nav className="flex gap-1 overflow-x-auto border-t border-[#1c232d]/40">
            {[
              ["stream", "Live Stream", "Activity"],
              ["endpoints", "Endpoints & Proxies", "Webhook"],
              ["healing", "Self-Healing AI Logs", "Sparkles"],
              ["replay", "Replay Engine", "RotateCcw"],
              ["keys", "Settings & API Keys", "Settings"]
            ].map((t) => (
              <button
                key={t[0]}
                className={`inline-flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                  tab === t[0] ? "border-[#8ea3ff] text-[#e8ecf1]" : "border-transparent text-[#8d98a7] hover:text-[#e8ecf1]"
                }`}
                onClick={() => setTab(t[0])}
              >
                <Icon name={t[2]} size={14} />
                {t[1]}
                {t[0] === "healing" && failedN > 0 && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#ff6370]/10 text-[#ff6370]">{failedN}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 border border-[#1c232d] bg-[#0e1116] rounded-lg overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-[#1c232d]">
          <Metric label="Events processed" value={Math.round(m.total).toLocaleString()} sub="last 30 days" data={m.hist.total} color="#8ea3ff" />
          <Metric label="Success rate" value={`${m.rate.toFixed(2)}%`} sub={`${failedN} open failures`} data={m.hist.rate} color="#3ecf8e" />
          <Metric label="Revenue saved" value={money(m.rev)} sub="recovered from dropped payloads" data={m.hist.rev} color="#4cc9f0" />
          <Metric label="Avg gateway latency" value={`${m.lat.toFixed(0)} ms`} sub="p50 edge routing" data={m.hist.lat} color="#f2a93b" />
        </section>

        <div>
          {tab === "stream" && <StreamView events={events} now={now} live={live} setLive={setLive} onOpen={setOpenId} onSimFail={() => addLive({ status: "failed" })} onReplayAll={() => { setTab("replay"); runReplay(events.filter((x: any) => x.status === "failed").map((x: any) => x.id)); }} />}
          {tab === "endpoints" && <EndpointsView endpoints={endpoints} setEndpoints={setEndpoints} toast={toast} onTest={(ep: any) => { addLive({ ep, status: "ok" }); toast(`Test event dispatched via ${ep.name}`, "ok"); }} />}
          {tab === "healing" && <HealingView events={events} diags={diags} setDiag={setDiag} onApprove={approve} onOpen={setOpenId} setTab={setTab} />}
          {tab === "replay" && <ReplayView events={events} settings={settings} logs={logs} running={running} sel={rsel} setSel={setRsel} onRun={runReplay} onStop={() => { cancel.current = true; }} onClear={() => setLogs([{ id: 1, k: "dim", t: "Log cleared." }])} onOpen={setOpenId} setTab={setTab} />}
          {tab === "keys" && <SettingsView settings={settings} setSettings={setSettings} keys={keys} setKeys={setKeys} secret={secret} onRotate={() => { setSecret("whsec_" + hex(40)); toast("New gateway signing secret rotated.", "ok"); }} toast={toast} />}
        </div>
      </main>

      <footer className="border-t border-[#1c232d] mt-12 py-6 text-xs text-[#5d6877]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <span>Jumcart is owned and operated by P. Gonze Consultancy.</span>
          <span className="font-mono">Autonomous edge transaction gateway</span>
        </div>
      </footer>

      {openEv && <Drawer e={openEv} onClose={() => setOpenId(null)} onReplay={(id: string) => { setOpenId(null); setTab("replay"); runReplay([id]); }} onDiagnosis={(c: string) => { setOpenId(null); setTab("healing"); }} />}

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none w-full max-w-sm px-4">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto bg-[#1a212b] border border-[#2a3340] rounded-lg p-3 text-xs flex items-center gap-2.5 shadow-2xl w-full">
            <Icon name={t.kind === "ok" ? "CheckCircle2" : t.kind === "bad" ? "AlertTriangle" : "Info"} size={15} className={t.kind === "ok" ? "text-[#3ecf8e]" : t.kind === "bad" ? "text-[#ff6370]" : "text-[#8ea3ff]"} />
            <span className="text-[#e8ecf1]">{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
