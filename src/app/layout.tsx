import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
  themeColor: "#3f6b4c",
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
      <body>{children}</body>
    </html>
  );
}
