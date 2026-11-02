import type { Metadata } from "next";
import Link from "next/link";
import ProfitFirstCalculator from "@/components/tools/ProfitFirstCalculator";

/**
 * Tools: member-only calculators. Input in, recommendation out.
 *
 * Product rule (Kathy): tools are calculators, transactions are the ledger.
 * They never meet. A calculator advises what should happen, the ledger records
 * what did happen, and nothing on this page reads or writes a transaction.
 *
 * Gating: /tools is not in the middleware's public list, so a signed-out
 * visitor is redirected to /login with ?redirect=/tools. Members reach it from
 * the Tools tab in the nav.
 */

export const metadata: Metadata = {
  title: "Tools: Profit First split calculator | Goodbye Debt",
  description:
    "Split any income 10 / 5 / 30 / 55, or set your own percentages. A calculator that gives a recommendation and saves nothing.",
  robots: { index: false, follow: false },
};

export default function ToolsPage() {
  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <div className="brand">
        <h1>Tools</h1>
      </div>
      <p className="tagline">
        Calculators that give you a recommendation. They never touch your ledger.
      </p>

      <ProfitFirstCalculator />

      <section className="card">
        <div className="heading-sm" style={{ marginBottom: 8 }}>
          Why this is not part of Transactions
        </div>
        <p className="note" style={{ marginTop: 0 }}>
          Transactions are the ledger. They record what actually happened, and they stay under your
          control: you enter them, you approve them. A calculator advises what should happen. Mixing
          the two would mean the app deciding whether you followed a split, and it cannot know that.
          Math is one thing. Whether a person actually moved the money is a judgment only they can
          make.
        </p>
        <p className="note">
          The same shape as the debt payoff calculator: your numbers in, the honest answer out,
          nothing saved and nothing feeding other data.
        </p>
        <p className="note" style={{ marginBottom: 0 }}>
          <Link href="/transactions">Go to Transactions</Link> if you want to record what you paid.
          Your entries are yours: this page never reads them and never suggests anything against
          them.
        </p>
      </section>
    </main>
  );
}
