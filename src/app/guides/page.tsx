import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Debt Payoff Guides for Filipino Debts | GoodbyeDebt",
  description:
    "Practical debt payoff guides built around real Philippine lenders and real rates: snowball vs avalanche, consolidation, credit card statements, app loans, and which debt to pay first.",
  alternates: { canonical: "./" },
};

export default function GuidesIndex() {
  const groups: {
    group: string;
    intro: string;
    items: { href: string; title: string; blurb: string; kicker: string }[];
  }[] = [
    {
      group: "Start here",
      intro:
        "The two pieces that answer the question everything else builds on: which debt to attack first, and how long it will actually take.",
      items: [
        {
          href: "/guides/which-debt-to-pay-off-first",
          title: "Which Debt Should You Pay Off First?",
          kicker: "Snowball vs avalanche",
          blurb:
            "The method only works once you can see every debt side by side. Avalanche vs snowball, explained with real Philippine lender rates.",
        },
        {
          href: "/guides/how-to-become-debt-free",
          title: "How to Become Debt-Free: A Realistic Timeline",
          kicker: "18 to 36 months",
          blurb:
            "What actually moves your debt-free date, month by month, and why the extra peso matters more than the method.",
        },
      ],
    },
    {
      group: "Borrowing costs, compared",
      intro:
        "Every major Philippine lender converted to the same unit, so the comparisons are honest.",
      items: [
        {
          href: "/guides/tala-vs-gcredit",
          title: "Tala vs GCash GCredit: Which Costs More?",
          kicker: "11 to 12 percent vs 4.15 percent",
          blurb:
            "GCredit's published rate against Tala's own disclosed effective monthly rate, with a worked 10,000-peso example.",
        },
        {
          href: "/guides/full-lender-comparison",
          title: "Tala vs Home Credit vs BillEase vs Cashalo",
          kicker: "All four, same unit",
          blurb:
            "The full conversion: flat monthly rates, daily fees, and add-on charges, ranked cheapest to most expensive.",
        },
        {
          href: "/guides/billease-interest-rate",
          title: "BillEase Loan: Rate and Requirements",
          kicker: "3.49 percent a month",
          blurb:
            "What BillEase costs, the zero percent catch, and where it sits against cards, app loans, and government loans.",
        },
        {
          href: "/guides/cashalo-application",
          title: "Cashalo Loan Application: Step by Step",
          kicker: "Requirements plus real cost",
          blurb:
            "Documents, timeline, and why the headline daily rate understates the real cost of a CashaLoan.",
        },
        {
          href: "/guides/pag-ibig-home-loan-requirements",
          title: "Pag-IBIG Home Loan Requirements",
          kicker: "The full checklist",
          blurb:
            "Who qualifies, how much you can actually borrow, the full document list, and where a Pag-IBIG loan belongs in your payoff priority.",
        },
        {
          href: "/guides/multiple-loan-app-installments",
          title: "Juggling Multiple Loan App Installments",
          kicker: "Which hurts most",
          blurb:
            "Convert every installment plan to the same unit, rank them, and find the balance actually draining the most money.",
        },
      ],
    },
    {
      group: "Credit cards and consolidation",
      intro: "The card-specific mechanics: statements, minimums, and when a new loan actually helps.",
      items: [
        {
          href: "/guides/credit-card-statement",
          title: "How to Read Your Credit Card Statement",
          kicker: "The 3 percent question",
          blurb:
            "The BSP rate cap, the minimum payment trap in real numbers, and the added charges that push costs past 3 percent a month.",
        },
        {
          href: "/guides/personal-loan-for-credit-card",
          title: "Should You Pay a Card With a Personal Loan?",
          kicker: "Three conditions",
          blurb:
            "The rate math is nearly a wash between the two good options; the decision turns on which behavior risk you can manage.",
        },
        {
          href: "/guides/debt-consolidation",
          title: "Is Debt Consolidation Worth It?",
          kicker: "What it actually costs",
          blurb:
            "When a 14 to 18 percent consolidation loan helps, when it quietly hurts, and what avalanche order gets you without a new loan.",
        },
      ],
    },
    {
      group: "When debt gets scary",
      intro:
        "The fear pieces, written calmly: what the law actually says, and what to do before anything drastic.",
      items: [
        {
          href: "/guides/jail-for-unpaid-debt",
          title: "Can You Go to Jail for Unpaid Debt?",
          kicker: "No, and here is the law",
          blurb:
            "The constitutional ban, the three real criminal exceptions (BP 22, estafa, RA 8484), and what collectors cannot legally do.",
        },
        {
          href: "/guides/bankruptcy-philippines",
          title: "Do You Need to File Bankruptcy?",
          kicker: "Probably not",
          blurb:
            "FRIA's 500,000-peso threshold, the two real tracks, and why most consumer debt has a faster, quieter path.",
        },
      ],
    },
    {
      group: "Savings and daily habits",
      intro: "For the money you are not sending to debt yet.",
      items: [
        {
          href: "/guides/ipon-challenge",
          title: "Ipon Challenge: Which One Actually Works",
          kicker: "Plus the debt question",
          blurb:
            "Every savings variant compared honestly, where each one fails, and why challenge money belongs in the payoff plan.",
        },
      ],
    },
  ];

  return (
    <main className="container">
      <div className="brand">
        <h1>
          Goodbye<span>Debt</span>
        </h1>
      </div>
      <p className="tagline">
        Guides. Every debt. Every lender. Real numbers, not guesses.
      </p>

      <section className="card guide-hero">
        <div className="payoff-hero">
          <div className="payoff-lead">14 guides, built on real Philippine rates</div>
          <div className="payoff-sub">
            Snowball vs avalanche, lender comparisons converted to the same unit, the law on unpaid
            debt, and the card mechanics nobody explains plainly.
          </div>
        </div>
        <p className="note" style={{ marginTop: 14 }}>
          Every guide pairs the explanation with the app's actual engine: add your real debts
          and see your own payoff order, free, no card required.
        </p>
        <div style={{ marginTop: 12 }}>
          <Link href="/" className="btn-primary">
            Open the payoff planner
          </Link>
        </div>
      </section>

      {groups.map((g) => (
        <section className="card" key={g.group}>
          <h2 className="guide-group-title">{g.group}</h2>
          <p className="guide-group-intro">{g.intro}</p>
          <div className="guide-grid">
            {g.items.map((item) => (
              <Link href={item.href} key={item.href} className="guide-card">
                <div className="guide-kicker">{item.kicker}</div>
                <div className="guide-title">{item.title}</div>
                <div className="guide-blurb">{item.blurb}</div>
                <div className="guide-read">Read the guide →</div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="card">
        <h2 className="guide-group-title">Why these guides are different</h2>
        <p>
          Most debt content explains the theory and leaves you to do the math on debts spread across
          five apps. These guides were written around the opposite premise: the explanation and your
          actual numbers belong on the same page. Every guide above connects to the payoff planner,
          which ranks every balance you owe in avalanche order and shows your projected debt-free
          date, free, with no bank linking and nothing to pay first.
        </p>
      </section>
    </main>
  );
}
