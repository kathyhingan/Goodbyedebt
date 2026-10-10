import type { Metadata } from "next";
import Link from "next/link";
import { PLANS, FOUNDING_COACH_CAP, type PlanId } from "@/lib/billing/plans";
import { ForCoachesCta } from "@/components/ForCoachesCta";
import { CheckoutSuccess } from "@/components/CheckoutSuccess";

export const metadata: Metadata = {
  title: "GoodbyeDebt for Coaches: run every client's payoff plan in one place",
  description:
    "The debt-payoff engine your coaching practice needs: every client's plan, progress, and payments in one console. Founding lifetime access for the first 25 practices.",
};

/**
 * The coach-facing sales page. Separate from the consumer landing page (/):
 * different buyer (a professional running a coaching business), different
 * value story (leverage and client outcomes, not personal debt freedom), and
 * a different pricing model (subscription + founding lifetime, vs. free).
 *
 * Design mirrors the consumer landing's dark/gold system so the two pages
 * read as one product, but every section is written for the coach.
 */
export default function ForCoachesPage() {
  return (
    <div className="fc-page">
      <style dangerouslySetInnerHTML={{ __html: fcCss }} />

      <header className="fc-nav">
        <div className="fc-nav-inner">
          <div className="fc-logo"><span className="fc-dot" />GOODBYE DEBT <span className="fc-for">for Coaches</span></div>
          <nav className="fc-links">
            <a href="#features">What you get</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="fc-actions">
            <Link href="/login" className="fc-login">Login</Link>
            <a href="#pricing" className="fc-cta">Get started &rarr;</a>
          </div>
        </div>
      </header>

      <section className="fc-hero">
        <div className="fc-wrap">
          <div className="fc-eyebrow"><span className="fc-pulse" />For finance coaching practices</div>
          <h1>
            Every client's payoff plan, progress, and payments.{" "}
            <span className="fc-accent">One console.</span>
          </h1>
          <p className="fc-sub">
            Your clients use Goodbye Debt to get out of debt. You see all of them in one place:
            who's on track, who's stuck, who needs a call this week. Stop stitching
            together spreadsheets for every session.
          </p>
          <div className="fc-ctas">
            <a href="#pricing" className="fc-btn-primary">See pricing &rarr;</a>
            <Link href="/login?mode=signup" className="fc-btn-ghost">Try it as a client would</Link>
          </div>
          <p className="fc-note">
            Founding lifetime access for the first {FOUNDING_COACH_CAP} practices. Set up takes minutes; you
            can explore the whole console before you pay.
          </p>
        </div>
      </section>

      <section className="fc-features" id="features">
        <div className="fc-wrap">
          <h2>Built for the way coaching actually works</h2>
          <div className="fc-grid">
            <div className="fc-card">
              <div className="fc-card-head">Every client in one roster</div>
              <p>
                Each client's email, total balance, debt count, and payoff progress, on one
                screen. No more per-client spreadsheets or asking them to screen-share.
              </p>
            </div>
            <div className="fc-card">
              <div className="fc-card-head">Their real payoff plans, not summaries</div>
              <p>
                Drill into any client to see exactly what they see: the avalanche order, the
                debt-free date, the interest each strategy saves. You coach from the same numbers
                they're looking at.
              </p>
            </div>
            <div className="fc-card">
              <div className="fc-card-head">Payment history you can verify</div>
              <p>
                See what each client actually paid and when, not what they remember paying. The
                on-time record is right there when accountability is the conversation.
              </p>
            </div>
            <div className="fc-card">
              <div className="fc-card-head">Their wins, your retention</div>
              <p>
                Milestones (first debt cleared, 25/50/75% paid) surface automatically, so you
                celebrate at the right moment and clients stay between sessions.
              </p>
            </div>
            <div className="fc-card">
              <div className="fc-card-head">Your clients, your relationship</div>
              <p>
                Your practice name is on the console your clients experience. We run the software;
                the client relationship stays entirely yours, always.
              </p>
            </div>
            <div className="fc-card">
              <div className="fc-card-head">The roadmap is included</div>
              <p>
                Education, earning opportunities, and skill development phases are already
                planned. Every new phase lands in your console as we build it, at no extra cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="fc-pricing" id="pricing">
        <div className="fc-wrap">
          <h2>Simple pricing, one relationship</h2>
          <p className="fc-pricing-sub">
            Flat fees, unlimited clients, no per-client charges, no commissions on what you earn.
            Founding lifetime access for the first {FOUNDING_COACH_CAP} practices, then subscription.
          </p>
          <ForCoachesCta plans={PLANS.map((p) => p.id as PlanId)} />
          <CheckoutSuccess />
          <div className="fc-tiers">
            {PLANS.map((p) => (
              <div className={`fc-tier ${p.highlight ? "fc-tier-hi" : ""}`} key={p.id}>
                {p.highlight && <div className="fc-tier-badge">Founding: {FOUNDING_COACH_CAP} spots</div>}
                <div className="fc-tier-name">{p.name}</div>
                <div className="fc-tier-price">
                  ${p.amount}
                  <span className="fc-tier-per">{p.interval === "month" ? "/mo" : p.interval === "year" ? "/yr" : " once"}</span>
                </div>
                <div className="fc-tier-tagline">{p.tagline}</div>
                <p className="fc-tier-blurb">{p.blurb}</p>
                <button
                  type="button"
                  className={`fc-tier-btn ${p.highlight ? "" : "fc-tier-btn-ghost"}`}
                  data-plan={p.id}
                >
                  {p.highlight ? "Claim a founding seat" : "Start now"}
                </button>
              </div>
            ))}
          </div>
          <p className="fc-note">
            Paying and practice approval are separate: after checkout, your practice goes into
            review and the platform team approves it (usually within a day or two) before client
            access unlocks. Every plan starts with the full console so you can set up while you wait.
          </p>
        </div>
      </section>

      <section className="fc-faq" id="faq">
        <div className="fc-wrap">
          <h2>Questions coaches ask</h2>
          {[
            {
              q: "Do my clients pay extra?",
              a: "No. Your clients use Goodbye Debt free, exactly as they would without a coach. Your subscription covers your console and your whole roster; nothing is ever charged to them.",
            },
            {
              q: "Can I see my clients' full financial details?",
              a: "You see what the coach console shows: each client's balances, debts, payoff plans, payment history, and progress. That is what the coach view needs and nothing more. Your clients always own their accounts.",
            },
            {
              q: "What does \"lifetime\" actually mean?",
              a: "The lifetime of the product, not of the buyer. The first 25 practices keep access for as long as Goodbye Debt exists, including every future phase, for one payment. If the product ever shuts down, that is the end of it, and we would tell you plainly before that happened.",
            },
            {
              q: "What happens after the 25 founding seats are gone?",
              a: "The founding offer closes and does not reopen. New practices join on the monthly or annual plan. The cap is real: when the seats are claimed, the one-time option disappears.",
            },
            {
              q: "Is there a contract or per-client fee?",
              a: "No contracts, no per-client charges, no commission on your revenue. Monthly cancels anytime; annual bills once a year; lifetime is one payment and done.",
            },
            {
              q: "What if I coach clients in the Philippines?",
              a: "That is the primary audience. Amounts display in your client's currency (Philippine peso included), and the payoff engine handles the debt types common there.",
            },
          ].map((item) => (
            <details className="fc-faq-item" key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="fc-final">
        <div className="fc-wrap">
          <h2>Stop juggling spreadsheets. Coach from one console.</h2>
          <div className="fc-ctas">
            <a href="#pricing" className="fc-btn-primary">See pricing &rarr;</a>
          </div>
        </div>
      </section>

      <footer className="fc-footer">
        <div className="fc-wrap">
          <div className="fc-logo" style={{ justifyContent: "center" }}><span className="fc-dot" />GOODBYE DEBT</div>
          <p>
            <Link href="/">For individuals</Link> · <Link href="/guides">Guides</Link> ·{" "}
            <Link href="/login">Login</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

const fcCss = `
.fc-page{--bg:#0e1710;--panel:#141f16;--panel2:#1a291d;--line:#243523;--gold:#c9a24d;--green:#3a9e5f;--green-bright:#6fd68f;--red:#b5622f;--ink:#1a1408;--text:#f1ecdc;--muted:#8b9a83;
background-color:var(--bg);color:var(--text);font-family:var(--fontui,system-ui,sans-serif);min-height:100vh;}
.fc-page .fc-wrap{max-width:1120px;margin:0 auto;padding:0 24px;}
.fc-page .fc-nav{position:sticky;top:0;z-index:50;background:rgba(10,18,12,0.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--line);}
.fc-page .fc-nav-inner{max-width:1120px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;}
.fc-page .fc-logo{display:flex;align-items:center;gap:8px;font-weight:800;letter-spacing:0.06em;font-size:14px;white-space:nowrap;}
.fc-page .fc-logo .fc-for{color:var(--gold);font-weight:700;}
.fc-page .fc-dot{width:10px;height:10px;border-radius:50%;background:var(--green-bright);display:inline-block;}
.fc-page .fc-links{display:flex;gap:28px;font-size:14px;font-weight:600;}
.fc-page .fc-links a{color:var(--muted);text-decoration:none;}
.fc-page .fc-links a:hover{color:var(--text);}
.fc-page .fc-actions{display:flex;align-items:center;gap:18px;}
.fc-page .fc-login{font-size:14px;font-weight:700;color:var(--text);text-decoration:none;}
.fc-page .fc-cta{background:var(--green);color:#fff;font-weight:800;font-size:13px;padding:9px 16px;border-radius:8px;text-decoration:none;}
@media(max-width:760px){.fc-page .fc-links{display:none;}}
.fc-page .fc-hero{padding:96px 0 72px;background-image:linear-gradient(180deg,rgba(201,162,77,0.06),transparent);}
.fc-page .fc-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold);}
.fc-page .fc-pulse{width:7px;height:7px;border-radius:50%;background:var(--gold);display:inline-block;animation:fcPulse 2s infinite;}
@keyframes fcPulse{0%,100%{opacity:1}50%{opacity:0.35}}
.fc-page .fc-hero h1{font-size:clamp(36px,5.5vw,64px);line-height:1.08;letter-spacing:-0.02em;margin:18px 0 0;max-width:860px;font-weight:800;}
.fc-page .fc-hero h1 .fc-accent{color:var(--gold);}
.fc-page .fc-sub{margin:22px 0 0;font-size:18px;line-height:1.6;color:var(--muted);max-width:720px;}
.fc-page .fc-ctas{display:flex;gap:14px;margin-top:32px;flex-wrap:wrap;}
.fc-page .fc-btn-primary{background:var(--green);color:#fff;font-weight:800;font-size:15px;padding:14px 26px;border-radius:10px;text-decoration:none;display:inline-block;}
.fc-page .fc-btn-ghost{border:1px solid var(--line);color:var(--text);font-weight:700;font-size:15px;padding:14px 26px;border-radius:10px;text-decoration:none;display:inline-block;}
.fc-page .fc-note{margin:18px 0 0;font-size:13px;color:var(--muted);}
.fc-page .fc-features{padding:72px 0;}
.fc-page .fc-features h2,.fc-page .fc-pricing h2,.fc-page .fc-faq h2{font-size:clamp(26px,3.4vw,38px);margin:0;font-weight:800;letter-spacing:-0.01em;}
.fc-page .fc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:36px;}
@media(max-width:900px){.fc-page .fc-grid{grid-template-columns:1fr;}}
.fc-page .fc-card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:24px;min-width:0;}
.fc-page .fc-card-head{font-weight:800;font-size:16px;color:var(--green-bright);}
.fc-page .fc-card p{margin:10px 0 0;font-size:14px;line-height:1.6;color:var(--muted);}
.fc-page .fc-pricing{padding:72px 0;background:var(--panel);}
.fc-page .fc-pricing-sub{margin:14px 0 0;font-size:15px;line-height:1.6;color:var(--muted);max-width:680px;}
.fc-page .fc-tiers{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:36px;}
@media(max-width:900px){.fc-page .fc-tiers{grid-template-columns:1fr;}}
.fc-page .fc-tier{background:var(--bg);border:1px solid var(--line);border-radius:16px;padding:28px;position:relative;min-width:0;}
.fc-page .fc-tier-hi{border-color:var(--gold);}
.fc-page .fc-tier-badge{position:absolute;top:-12px;left:24px;background:var(--gold);color:var(--ink);font-size:11px;font-weight:800;padding:4px 10px;border-radius:99px;letter-spacing:0.04em;}
.fc-page .fc-tier-name{font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);}
.fc-page .fc-tier-price{font-size:44px;font-weight:800;margin-top:10px;letter-spacing:-0.02em;font-family:var(--font-fig,ui-monospace,monospace);}
.fc-page .fc-tier-per{font-size:14px;color:var(--muted);font-weight:600;font-family:var(--fontui,system-ui,sans-serif);}
.fc-page .fc-tier-tagline{margin-top:6px;font-size:14px;font-weight:700;color:var(--green-bright);}
.fc-page .fc-tier-blurb{margin:12px 0 0;font-size:13.5px;line-height:1.6;color:var(--muted);min-height:84px;}
.fc-page .fc-tier-btn{width:100%;margin-top:18px;background:var(--green);color:#fff;font-weight:800;font-size:14px;padding:13px 18px;border-radius:10px;border:none;cursor:pointer;cursor:pointer;}
.fc-page .fc-tier-btn:hover{transform:scale(1.02);}
.fc-page .fc-tier-btn-ghost{background:transparent;border:1px solid var(--line);color:var(--text);}
.fc-page .fc-faq{padding:72px 0;}
.fc-page .fc-faq-item{border-bottom:1px solid var(--line);padding:18px 0;}
.fc-page .fc-faq-item summary{cursor:pointer;font-weight:700;font-size:16px;list-style:none;display:flex;justify-content:space-between;align-items:center;}
.fc-page .fc-faq-item summary::-webkit-details-marker{display:none;}
.fc-page .fc-faq-item summary::after{content:"+";font-size:22px;color:var(--gold);}
.fc-page .fc-faq-item[open] summary::after{content:"-";}
.fc-page .fc-faq-item p{margin-top:14px;color:var(--muted);font-size:14.5px;line-height:1.6;max-width:720px;}
.fc-page .fc-final{text-align:center;padding:96px 0;background-image:linear-gradient(0deg,rgba(58,158,95,0.08),transparent);}
.fc-page .fc-final h2{font-size:clamp(30px,4.6vw,52px);margin:0 auto;max-width:760px;font-weight:800;letter-spacing:-0.02em;}
.fc-page .fc-final .fc-ctas{justify-content:center;}
.fc-page .fc-footer{border-top:1px solid var(--line);padding:40px 0;text-align:center;color:var(--muted);font-size:13px;}
.fc-page .fc-footer .fc-logo{justify-content:center;margin-bottom:10px;}
.fc-page .fc-footer a{color:var(--muted);}
.fc-page .fc-footer a:hover{color:var(--text);}
`;
