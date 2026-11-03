import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jumcart Flow | Autonomous Self-Healing Webhook Gateway",
  description:
    "Buffer high-throughput webhooks at the edge, diagnose 4xx/5xx payload failures with AI, and auto-dispatch schema patches before transactions stall.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased min-h-screen bg-neutral-950 text-neutral-100 font-sans">
        {children}
      </body>
    </html>
  );
}
