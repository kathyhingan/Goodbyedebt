import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { InstallPrompt } from "@/components/InstallPrompt";
import { StatementReminder } from "@/components/StatementReminder";
import { ServiceWorkerManager } from "@/components/ServiceWorkerManager";
import { CurrencyProvider } from "@/lib/currency/currency";
import { DebtsProvider } from "@/lib/data/useDebts";

// Type system per the GoodbyeDebt design spec:
// Space Grotesk for display/headings, IBM Plex Sans for body, IBM Plex Mono
// for figures (money and percentages only).
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.almostdebtfree.com"),
  title: "GoodbyeDebt — Debt Payoff Optimizer",
  description:
    "Sequence and optimize payoff across all your debts. See exactly where every extra dollar should go to be debt-free faster.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GoodbyeDebt",
  },
};

export const viewport: Viewport = {
  themeColor: "#4338ca",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable}`}>
        <CurrencyProvider>
          <DebtsProvider>
            <Nav />
            <StatementReminder />
            {children}
            <InstallPrompt />
            <ServiceWorkerManager />
          </DebtsProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
