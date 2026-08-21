import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Roadmap — GoodbyeDebt" };

interface Phase {
  num: string;
  title: string;
  status: string;
  live?: boolean;
  blurb: string;
  unlock: string | null; // backers needed to reach the next phase
}

const PHASES: Phase[] = [
  {
    num: "01",
    title: "MVP — Kill Your Debt",
    status: "Live now",
    live: true,
    blurb:
      "Debt tracking, the avalanche / snowball / hybrid payoff engine, CSV & PDF statement import, the Debt Slayers community, and your profile & journey timeline.",
    unlock: "100 members unlocks Phase 2",
  },
  {
    num: "02",
    title: "Education",
    status: "Next up",
    blurb:
      "Bite-sized money education built into the app — so you don't just get out of debt, you learn how to stay out.",
    unlock: "1,000 members unlocks Phase 3",
  },
  {
    num: "03",
    title: "Earning Opportunities",
    status: "Planned",
    blurb:
      "Ways to bring in extra income and throw more at your balances, matched to your situation.",
    unlock: "10,000 members unlocks Phase 4",
  },
  {
    num: "04",
    title: "Skill Development",
    status: "Planned",
    blurb:
      "Level up the skills that grow your income for the long run — building on the earning opportunities from Phase 3.",
    unlock: null,
  },
];

export default function RoadmapPage() {
  return (
    <main className="container">
      <h1 style={{ color: "var(--moss)" }}>Roadmap</h1>
      <p className="tagline">
        GoodbyeDebt grows with its community. Each phase unlocks when we hit the next membership
        milestone — the more <strong>Debt Slayers</strong> we bring in, the faster we all get the
        next set of tools.
      </p>

      <section className="card" style={{ background: "var(--money-soft)" }}>
        <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>How the phases unlock</h2>
        <div className="stat-grid">
          <div className="stat"><div className="label">Phase 1 → 2</div><div className="value">100</div><div className="label">members</div></div>
          <div className="stat"><div className="label">Phase 2 → 3</div><div className="value">1,000</div><div className="label">members</div></div>
          <div className="stat"><div className="label">Phase 3 → 4</div><div className="value">10,000</div><div className="label">members</div></div>
          <div className="stat"><div className="label">Where we are</div><div className="value" style={{ fontSize: "1rem" }}>Phase 1</div><div className="label">MVP, live</div></div>
        </div>
        <p className="note" style={{ marginTop: 10 }}>
          Help us hit the next milestone — invite a friend and grow the community on the{" "}
          <Link href="/community">Community</Link> tab.
        </p>
      </section>

      {PHASES.map((p) => (
        <section className="card" key={p.num}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--moss)" }}>{p.num}</span>
            <h2 style={{ margin: 0, fontSize: "1.1rem" }}>{p.title}</h2>
            <span
              className="pill"
              style={p.live ? { background: "var(--money)", color: "#fff" } : undefined}
            >
              {p.status}
            </span>
          </div>
          <p className="note" style={{ marginTop: 10, fontSize: "0.95rem", color: "var(--ink)" }}>{p.blurb}</p>
          {p.unlock && (
            <p className="note" style={{ marginTop: 8, color: "var(--moss)", fontWeight: 700 }}>
              🔓 {p.unlock}
            </p>
          )}
        </section>
      ))}
    </main>
  );
}
