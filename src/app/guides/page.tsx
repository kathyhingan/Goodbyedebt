import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLE_LIST as articles } from "@/lib/content/articles";

export const metadata: Metadata = {
  title: "Debt Payoff Guides for Filipino Debts | Goodbye Debt",
  description:
    "Practical debt payoff guides built around real Philippine lenders and real rates: snowball vs avalanche, consolidation, credit card statements, app loans, and which debt to pay first.",
  alternates: { canonical: "./" },
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
.gd-guides{
  --bg:#0e1710;--panel:#141f16;--panel2:#1a291d;--red:#b5622f;--red-dim:#4a3220;
  --green:#3a9e5f;--green-bright:#6fd68f;--gold:#c9a24d;--paper:#f1e8d2;--ink:#141005;
  --text:#f1ecdc;--muted:#8b9a83;--line:#243523;
  background-color:var(--bg); color:var(--text); min-height:100vh;
  font-family:'Inter',sans-serif; -webkit-font-smoothing:antialiased; overflow-x:hidden;
}
.gd-guides *{box-sizing:border-box;}
.gd-guides .display{font-family:'Anton',sans-serif; text-transform:uppercase; letter-spacing:0.5px; line-height:1.05;}
.gd-guides a{color:inherit; text-decoration:none;}
.gd-guides .wrap{max-width:1180px; margin:0 auto; padding:0 28px;}
.gd-guides header.nav{position:sticky; top:0; z-index:50; background:rgba(10,10,9,0.9); backdrop-filter:blur(10px); border-bottom:1px solid var(--line);}
.gd-guides .nav-banner{background-color:var(--gold); color:var(--ink); text-align:center; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:600; letter-spacing:0.2px; padding:8px 12px;}
.gd-guides .nav-banner strong{font-weight:800;}
.gd-guides .nav-inner{display:flex; align-items:center; justify-content:space-between; padding:16px 28px; max-width:1180px; margin:0 auto;}
.gd-guides .logo{display:flex; align-items:center; gap:10px; font-family:'Anton',sans-serif; font-size:19px; letter-spacing:0.5px;}
.gd-guides .logo .dot{width:10px; height:10px; background:var(--green-bright); border-radius:50%; box-shadow:0 0 12px var(--green-bright);}
.gd-guides .nav-links{display:flex; gap:32px; font-size:14px; font-weight:600; color:var(--muted);}
.gd-guides .nav-links a:hover, .gd-guides .nav-links a.current{color:var(--text);}
.gd-guides .nav-links a.current{border-bottom:2px solid var(--green-bright); padding-bottom:2px;}
.gd-guides .nav-actions{display:flex; align-items:center; gap:20px;}
.gd-guides .nav-login{font-size:14px; font-weight:700; color:var(--text);}
.gd-guides .nav-login:hover{color:var(--green-bright);}
.gd-guides .nav-cta{background:var(--green); color:#fff; font-weight:800; font-size:13px; padding:11px 20px; border-radius:100px; letter-spacing:0.3px; transition:transform .15s ease;}
.gd-guides .nav-cta:hover{transform:scale(1.04);}
@media(max-width:760px){.gd-guides .nav-links{display:none;}}
.gd-guides .guides-hero{padding:80px 0 56px; position:relative; background-color:var(--bg); background-image:radial-gradient(ellipse 900px 500px at 15% -10%, rgba(58,158,95,0.20), transparent 60%),radial-gradient(ellipse 700px 500px at 100% 0%, rgba(201,162,77,0.12), transparent 60%);}
.gd-guides .eyebrow{display:inline-flex; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--gold); border:1px solid var(--red-dim); background:rgba(201,162,77,0.09); padding:7px 14px; border-radius:100px; margin-bottom:26px;}
.gd-guides .eyebrow .pulse{width:7px; height:7px; border-radius:50%; background:var(--green-bright); box-shadow:0 0 8px var(--green-bright); animation:gdpulse 1.6s infinite;}
@keyframes gdpulse{0%,100%{opacity:1;} 50%{opacity:.25;}}
.gd-guides .guides-hero h1{font-size:clamp(36px,5.4vw,72px); max-width:920px; margin:0;}
.gd-guides .guides-hero h1 .accent{color:var(--gold);}
.gd-guides .hero-sub{margin-top:24px; font-size:19px; line-height:1.5; color:#cfc9ba; max-width:640px; font-weight:500;}
.gd-guides .hero-ctas{display:flex; align-items:center; gap:18px; margin-top:36px; flex-wrap:wrap;}
.gd-guides .btn-primary{background:var(--green); color:#fff; font-weight:800; font-size:16px; padding:18px 30px; border-radius:10px; display:inline-flex; align-items:center; gap:10px; box-shadow:0 10px 30px -8px rgba(58,158,95,0.55); border:none; cursor:pointer; transition:transform .15s ease;}
.gd-guides .btn-primary:hover{transform:translateY(-2px);}
.gd-guides .hero-note{font-size:13px; color:var(--muted); font-weight:600;}
.gd-guides .section{padding:80px 0; background-color:var(--bg);}
.gd-guides .section-dark2{background-color:var(--panel);}
.gd-guides .kicker{font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:700; color:var(--gold); letter-spacing:2px; text-transform:uppercase; margin-bottom:16px;}
.gd-guides h2.display{font-size:clamp(26px,3.4vw,38px); max-width:860px; margin:0;}
.gd-guides .guide-grid{margin-top:48px; display:grid; grid-template-columns:repeat(3,1fr); gap:20px;}
@media(max-width:1000px){.gd-guides .guide-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:640px){.gd-guides .guide-grid{grid-template-columns:1fr;}}
.gd-guides .guide-card{background:var(--panel2); border:1px solid var(--line); border-radius:14px; padding:26px 22px; display:flex; flex-direction:column; transition:border-color .15s ease, transform .15s ease; height:100%;}
.gd-guides .guide-card:hover{border-color:var(--green); transform:translateY(-3px);}
.gd-guides .guide-kicker{display:inline-block; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; color:var(--gold); border:1px solid var(--line); border-radius:100px; padding:4px 10px; margin-bottom:14px; align-self:flex-start;}
.gd-guides .guide-card:hover .guide-kicker{border-color:var(--green); color:var(--green-bright);}
.gd-guides .guide-title{font-size:17px; font-weight:800; line-height:1.35; margin-bottom:10px;}
.gd-guides .guide-blurb{font-size:14px; color:var(--muted); line-height:1.6; flex:1;}
.gd-guides .guide-read{color:var(--green-bright); font-weight:700; font-size:13px; margin-top:16px;}
.gd-guides .why-different{border:2px solid var(--gold); background:linear-gradient(135deg, rgba(201,162,77,0.10), transparent); border-radius:16px; padding:36px 32px;}
.gd-guides .why-different h4{font-family:'Anton',sans-serif; font-size:20px; margin:0 0 10px; letter-spacing:0.3px;}
.gd-guides .why-different p{font-size:14.5px; color:#cfc9ba; line-height:1.65; margin:0;}
.gd-guides footer{border-top:1px solid var(--line); padding:40px 0; text-align:center; color:var(--muted); font-size:13px; background-color:var(--bg); margin-top:80px;}
.gd-guides footer .logo{justify-content:center; margin-bottom:10px;}
/* Article page */
.gd-guides .article-wrap{max-width:760px; margin:0 auto; padding:56px 28px 40px;}
.gd-guides .article-kicker{display:inline-flex; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--gold); border:1px solid var(--red-dim); background:rgba(201,162,77,0.09); padding:7px 14px; border-radius:100px; margin-bottom:26px;}
.gd-guides .article-wrap h1{font-family:'Anton',sans-serif; text-transform:uppercase; letter-spacing:0.5px; line-height:1.05; font-size:clamp(30px,4.4vw,48px); margin:0; color:var(--text);}
.gd-guides .tldr{margin-top:28px; border:2px solid var(--gold); background:linear-gradient(135deg, rgba(201,162,77,0.10), transparent); border-radius:14px; padding:22px 24px; font-size:15.5px; line-height:1.65; color:#e5e0d3;}
.gd-guides .tldr strong{font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:var(--gold); display:block; margin-bottom:8px;}
.gd-guides .article-body{margin-top:16px;}
.gd-guides .article-body h2{font-family:'Anton',sans-serif; text-transform:uppercase; letter-spacing:0.5px; font-size:clamp(20px,2.6vw,26px); line-height:1.25; color:var(--green-bright); margin:44px 0 14px;}
.gd-guides .article-body p{line-height:1.7; margin:0 0 16px; font-size:15.5px; color:#d8d3c5;}
.gd-guides .article-body ul, .gd-guides .article-body ol{margin:0 0 16px; padding-left:22px;}
.gd-guides .article-body li{line-height:1.7; margin-bottom:10px; font-size:15.5px; color:#d8d3c5;}
.gd-guides .article-body li::marker{color:var(--gold);}
.gd-guides .article-body strong{color:var(--text);}
.gd-guides .faq-block{margin-top:56px; border-top:1px solid var(--line); padding-top:40px;}
.gd-guides .faq-block h2{font-family:'Anton',sans-serif; text-transform:uppercase; letter-spacing:0.5px; font-size:clamp(20px,2.6vw,26px); color:var(--green-bright); margin:0 0 8px;}
.gd-guides .faq-item{border-bottom:1px solid var(--line); padding:20px 0;}
.gd-guides .faq-item h3{font-size:16px; font-weight:800; margin:0 0 10px; color:var(--text);}
.gd-guides .faq-item p{margin:0; color:var(--muted); font-size:15px; line-height:1.65;}
.gd-guides .article-cta{margin-top:56px; border:2px solid var(--gold); background:linear-gradient(135deg, rgba(201,162,77,0.10), transparent); border-radius:16px; padding:36px 32px;}
.gd-guides .article-cta .lead{font-family:'Anton',sans-serif; text-transform:uppercase; letter-spacing:0.5px; font-size:clamp(19px,2.4vw,24px); color:var(--text); margin:0 0 10px;}
.gd-guides .article-cta .sub{font-size:14.5px; color:#cfc9ba; line-height:1.6; margin:0 0 22px;}
.gd-guides .back-link{display:inline-block; margin-top:32px; font-size:14px; font-weight:700; color:var(--muted);}
.gd-guides .back-link:hover{color:var(--green-bright);}
`;

const navHtml = `
<header class="nav">
  <div class="nav-banner">Free forever for the first 100 users. <strong>98 Founding Debt Slayers seats left.</strong></div>
  <div class="nav-inner">
    <a href="/" class="logo"><span class="dot"></span>GOODBYE DEBT</a>
    <nav class="nav-links">
      <a href="/guides" class="current">Guides</a>
      <a href="/roadmap">Roadmap</a>
      <a href="/#community">Community</a>
      <a href="/#faq">FAQ</a>
    </nav>
    <div class="nav-actions">
      <a href="/login" class="nav-login">Login</a>
      <a href="/login?mode=signup" class="nav-cta">Start Free &rarr;</a>
    </div>
  </div>
</header>
`;

const footerHtml = `
<footer>
  <div class="wrap">
    <div class="logo"><span class="dot"></span>GOODBYE DEBT</div>
    <div>&copy; 2026 Goodbye Debt. All rights reserved.</div>
    <div style="margin-top:8px;">Developed and designed by <a href="https://malayapublishing.com" style="color:var(--gold); font-weight:700;">Malaya Publishing</a></div>
  </div>
</footer>
`;

const groupMeta: {
  group: string;
  dark: boolean;
  order: string[];
}[] = [
  {
    group: "Start here",
    dark: false,
    order: ["which-debt-to-pay-off-first", "how-to-become-debt-free"],
  },
  {
    group: "Borrowing costs, compared",
    dark: true,
    order: [
      "tala-vs-gcredit",
      "full-lender-comparison",
      "billease-interest-rate",
      "cashalo-application",
      "pag-ibig-home-loan-requirements",
      "multiple-loan-app-installments",
    ],
  },
  {
    group: "Credit cards and consolidation",
    dark: false,
    order: [
      "credit-card-statement",
      "personal-loan-for-credit-card",
      "debt-consolidation",
    ],
  },
  {
    group: "When debt gets scary",
    dark: true,
    order: ["jail-for-unpaid-debt", "bankruptcy-philippines"],
  },
  {
    group: "Savings and daily habits",
    dark: false,
    order: ["ipon-challenge"],
  },
];

export default function GuidesIndex() {
  const bySlug = new Map(articles.map((a) => [a.slug, a]));

  return (
    <div className="gd-guides">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: navHtml }} />

      <section className="guides-hero">
        <div className="wrap">
          <div className="eyebrow">
            <span className="pulse"></span>The Guides
          </div>
          <h1 className="display">
            Every debt question, answered with <span className="accent">real numbers</span>. Not
            guesses.
          </h1>
          <p className="hero-sub">
            14 guides built on real Philippine lender rates: snowball vs avalanche, every major
            lender converted to the same unit, what the law actually says about unpaid debt, and
            the card mechanics nobody explains plainly.
          </p>
          <div className="hero-ctas">
            <Link href="/login?mode=signup" className="btn-primary">
              Start Free. See Your Plan &rarr;
            </Link>
            <span className="hero-note">
              Every guide pairs with the app's actual engine. Free, no card required.
            </span>
          </div>
        </div>
      </section>

      {groupMeta.map((g) => (
        <section className={g.dark ? "section section-dark2" : "section"} key={g.group}>
          <div className="wrap">
            <div className="kicker">{g.group}</div>
            <div className="guide-grid" style={{ marginTop: 32 }}>
              {g.order.map((slug) => {
                const a = bySlug.get(slug);
                if (!a) return null;
                return (
                  <Link href={`/guides/${a.slug}`} key={a.slug} className="guide-card">
                    <span className="guide-kicker">{a.kicker}</span>
                    <div className="guide-title">{a.title}</div>
                    <div className="guide-blurb">{a.description}</div>
                    <span className="guide-read">Read the guide &rarr;</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="wrap">
          <div className="why-different">
            <div className="kicker">Why These Guides Are Different</div>
            <h4>See the math before you decide anything.</h4>
            <p>
              Most debt content explains the theory and leaves you to do the math on debts spread
              across five apps. These guides were written around the opposite premise: the
              explanation and your actual numbers belong on the same page. Every guide above
              connects to the payoff planner, which ranks every balance you owe in avalanche order
              and shows your projected debt-free date, free, with no bank linking and nothing to
              pay first.
            </p>
          </div>
        </div>
      </section>

      <div dangerouslySetInnerHTML={{ __html: footerHtml }} />
    </div>
  );
}
