import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goodbye Debt: See Your Payoff Plan Free",
  description:
    "Goodbye Debt tells you exactly which debt to attack first, how much to pay where each cycle, and the date you'll be free. No bank linking required.",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
.gd-landing{
  --bg:#0e1710;--panel:#141f16;--panel2:#1a291d;--red:#b5622f;--red-dim:#4a3220;
  --green:#3a9e5f;--green-bright:#6fd68f;--gold:#c9a24d;--paper:#f1e8d2;--ink:#141005;
  --text:#f1ecdc;--muted:#8b9a83;--line:#243523;
  background-color:var(--bg); color:var(--text);
  font-family:'Inter',sans-serif; -webkit-font-smoothing:antialiased; overflow-x:hidden;
}
.gd-landing *{box-sizing:border-box; margin:0; padding:0;}
.gd-landing .display{font-family:'Anton',sans-serif; text-transform:uppercase; letter-spacing:0.5px; line-height:0.92;}
.gd-landing .mono{font-family:'JetBrains Mono',monospace;}
.gd-landing a{color:inherit; text-decoration:none;}
.gd-landing img{max-width:100%; display:block;}
.gd-landing .wrap{max-width:1180px; margin:0 auto; padding:0 28px;}
.gd-landing .stamped{display:inline-block; border:3px solid currentColor; border-radius:6px; padding:4px 12px; transform:rotate(-4deg);}
.gd-landing header.nav{position:sticky; top:0; z-index:50; background:rgba(10,10,9,0.9); backdrop-filter:blur(10px); border-bottom:1px solid var(--line);}
.gd-landing .nav-banner{background-color:var(--gold); color:var(--ink); text-align:center; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:600; letter-spacing:0.2px; padding:8px 12px;}
.gd-landing .nav-banner strong{font-weight:800;}
.gd-landing .nav-inner{display:flex; align-items:center; justify-content:space-between; padding:16px 28px; max-width:1180px; margin:0 auto;}
.gd-landing .logo{display:flex; align-items:center; gap:10px; font-family:'Anton',sans-serif; font-size:19px; letter-spacing:0.5px;}
.gd-landing .logo .dot{width:10px; height:10px; background:var(--green-bright); border-radius:50%; box-shadow:0 0 12px var(--green-bright);}
.gd-landing .nav-links{display:flex; gap:32px; font-size:14px; font-weight:600; color:var(--muted);}
.gd-landing .nav-links a:hover{color:var(--text);}
.gd-landing .nav-actions{display:flex; align-items:center; gap:20px;}
.gd-landing .nav-login{font-size:14px; font-weight:700; color:var(--text);}
.gd-landing .nav-login:hover{color:var(--green-bright);}
.gd-landing .nav-cta{background:var(--green); color:#fff; font-weight:800; font-size:13px; padding:11px 20px; border-radius:100px; letter-spacing:0.3px; transition:transform .15s ease;}
.gd-landing .nav-cta:hover{transform:scale(1.04);}
@media(max-width:760px){.gd-landing .nav-links{display:none;}}
.gd-landing .hero{padding:96px 0 64px; position:relative; background-color:var(--bg); background-image:radial-gradient(ellipse 900px 500px at 15% -10%, rgba(58,158,95,0.20), transparent 60%),radial-gradient(ellipse 700px 500px at 100% 0%, rgba(201,162,77,0.12), transparent 60%);}
.gd-landing .eyebrow{display:inline-flex; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--gold); border:1px solid var(--red-dim); background:rgba(201,162,77,0.09); padding:7px 14px; border-radius:100px; margin-bottom:26px;}
.gd-landing .eyebrow .pulse{width:7px; height:7px; border-radius:50%; background:var(--green-bright); box-shadow:0 0 8px var(--green-bright); animation:gdpulse 1.6s infinite;}
@keyframes gdpulse{0%,100%{opacity:1;} 50%{opacity:.25;}}
.gd-landing .hero h1{font-size:clamp(40px, 6.4vw, 84px); max-width:920px;}
.gd-landing .hero h1 .accent{color:var(--gold);}
.gd-landing .hero-sub{margin-top:26px; font-size:20px; line-height:1.5; color:#cfc9ba; max-width:620px; font-weight:500;}
.gd-landing .hero-ctas{display:flex; align-items:center; gap:18px; margin-top:38px; flex-wrap:wrap;}
.gd-landing .btn-primary{background:var(--green); color:#fff; font-weight:800; font-size:16px; padding:18px 30px; border-radius:10px; display:inline-flex; align-items:center; gap:10px; box-shadow:0 10px 30px -8px rgba(58,158,95,0.55); border:none; cursor:pointer; transition:transform .15s ease;}
.gd-landing .btn-primary:hover{transform:translateY(-2px);}
.gd-landing .hero-note{font-size:13px; color:var(--muted); font-weight:600;}
.gd-landing .trust-bar{margin-top:64px; padding-top:32px; border-top:1px solid var(--line); display:grid; grid-template-columns:repeat(4,1fr); gap:24px;}
.gd-landing .trust-stat .num{font-family:'Anton',sans-serif; font-size:clamp(24px,3vw,34px); color:var(--green-bright);}
.gd-landing .trust-stat .label{font-size:12.5px; color:var(--muted); font-weight:600; margin-top:4px; text-transform:uppercase; letter-spacing:0.4px;}
@media(max-width:760px){.gd-landing .trust-bar{grid-template-columns:repeat(2,1fr);}}
.gd-landing .section{padding:100px 0; background-color:var(--bg);}
.gd-landing .section-dark2{background-color:var(--panel);}
.gd-landing .kicker{font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:700; color:var(--gold); letter-spacing:2px; text-transform:uppercase; margin-bottom:16px;}
.gd-landing h2.display{font-size:clamp(30px,4.2vw,52px); max-width:760px;}
.gd-landing .lede{font-size:18px; color:#cfc9ba; max-width:640px; margin-top:18px; line-height:1.6;}
.gd-landing .pain-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:1px; margin-top:56px; background:var(--line); border:1px solid var(--line); border-radius:14px; overflow:hidden;}
.gd-landing .pain-card{background:var(--bg); padding:32px 28px;}
.gd-landing .pain-card .x{color:var(--red); font-family:'Anton',sans-serif; font-size:22px; margin-bottom:14px; display:block;}
.gd-landing .pain-card h3{font-size:18px; font-weight:800; margin-bottom:10px;}
.gd-landing .pain-card p{font-size:14.5px; color:var(--muted); line-height:1.55;}
@media(max-width:820px){.gd-landing .pain-grid{grid-template-columns:1fr;}}
.gd-landing .offer-wrap{margin-top:60px; display:grid; grid-template-columns:1.1fr 0.9fr; gap:48px; align-items:start;}
@media(max-width:900px){.gd-landing .offer-wrap{grid-template-columns:1fr;}}
.gd-landing .invoice{background:var(--paper); color:var(--ink); border-radius:6px; padding:36px 34px; position:relative; overflow:hidden; box-shadow:0 30px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.05); transform:rotate(-1deg);}
.gd-landing .invoice::before{content:""; position:absolute; inset:0; background-image: repeating-linear-gradient(transparent, transparent 34px, rgba(0,0,0,0.045) 35px); pointer-events:none;}
.gd-landing .invoice-head{display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px dashed #0a0a0955; padding-bottom:16px; margin-bottom:8px;}
.gd-landing .invoice-head .brand{font-family:'Anton',sans-serif; font-size:20px;}
.gd-landing .invoice-head .tag{font-family:'JetBrains Mono',monospace; font-size:11px; color:#665f4f; margin-top:4px;}
.gd-landing .invoice-head .stampmark{font-family:'Anton',sans-serif; font-size:13px; color:#8a6a1f; border:2.5px solid #8a6a1f; padding:5px 10px; border-radius:5px; transform:rotate(8deg); white-space:nowrap;}
.gd-landing .line-item{display:flex; justify-content:space-between; align-items:flex-start; gap:16px; padding:16px 0; border-bottom:1px solid #0a09091a; position:relative; z-index:1;}
.gd-landing .line-item .li-left h4{font-size:15.5px; font-weight:800; margin-bottom:4px;}
.gd-landing .line-item .li-left p{font-size:13px; color:#5a5548; line-height:1.5; max-width:340px;}
.gd-landing .line-item .li-val{font-family:'JetBrains Mono',monospace; font-weight:700; font-size:15px; white-space:nowrap; color:#3a362c;}
.gd-landing .invoice-total{display:flex; justify-content:space-between; align-items:center; margin-top:18px; padding-top:18px; border-top:2px dashed #0a0a0955;}
.gd-landing .invoice-total .label{font-size:13px; font-weight:700; color:#5a5548; text-transform:uppercase; letter-spacing:1px;}
.gd-landing .invoice-total .val{font-family:'JetBrains Mono',monospace; font-size:22px; font-weight:700; color:#3a362c;}
.gd-landing .today-row{display:flex; justify-content:space-between; align-items:center; margin-top:14px; background:#0a0a0910; padding:16px 18px; border-radius:8px;}
.gd-landing .today-row .label{font-size:14px; font-weight:800;}
.gd-landing .today-row .val{font-family:'JetBrains Mono',monospace; font-size:28px; font-weight:700; color:#1f6b3f;}
.gd-landing .paid-stamp{position:absolute; right:26px; bottom:26px; z-index:2; font-family:'Anton',sans-serif; color:#1f6b3f; border:5px solid #1f6b3f; border-radius:10px; padding:8px 20px; font-size:26px; transform:rotate(-14deg); opacity:0.85; mix-blend-mode:multiply;}
.gd-landing .offer-side h3.display{font-size:clamp(26px,3.4vw,36px); margin-bottom:18px;}
.gd-landing .offer-side p{color:#cfc9ba; font-size:16px; line-height:1.65; margin-bottom:16px;}
.gd-landing .offer-side .btn-primary{margin-top:10px;}
.gd-landing .guarantee{margin-top:40px; border:2px solid var(--gold); background:linear-gradient(135deg, rgba(201,162,77,0.10), transparent); border-radius:16px; padding:36px 32px; display:flex; gap:24px; align-items:flex-start;}
.gd-landing .guarantee .seal{flex:0 0 auto; width:86px; height:86px; border-radius:50%; border:3px solid var(--gold); display:flex; align-items:center; justify-content:center; text-align:center; font-family:'Anton',sans-serif; font-size:11px; color:var(--gold); line-height:1.15; padding:6px; transform:rotate(-8deg);}
.gd-landing .guarantee h4{font-family:'Anton',sans-serif; font-size:20px; margin-bottom:8px; letter-spacing:0.3px;}
.gd-landing .guarantee p{font-size:14.5px; color:#cfc9ba; line-height:1.6;}
.gd-landing .leaderboard{margin-top:52px; display:flex; flex-direction:column; gap:16px;}
.gd-landing .lb-caption{font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted); letter-spacing:1px; margin-bottom:4px;}
.gd-landing .lb-card{background:var(--paper); color:var(--ink); border-radius:14px; padding:24px 26px; display:flex; align-items:center; gap:20px; box-shadow:0 20px 40px -20px rgba(0,0,0,0.5);}
.gd-landing .lb-rank{font-family:'Anton',sans-serif; font-size:22px; color:#8a8373; flex:0 0 auto; width:38px;}
.gd-landing .lb-avatar{width:52px; height:52px; border-radius:50%; background:#3a9e5f; color:#fff; display:flex; align-items:center; justify-content:center; font-family:'Anton',sans-serif; font-size:18px; flex:0 0 auto;}
.gd-landing .lb-body{flex:1; min-width:0;}
.gd-landing .lb-name-row{display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:9px;}
.gd-landing .lb-name{font-weight:800; font-size:15px;}
.gd-landing .lb-country{font-weight:600; color:#6b6559; font-size:13px;}
.gd-landing .lb-bar-wrap{height:7px; background:#0a09091a; border-radius:100px; overflow:hidden; margin-bottom:7px;}
.gd-landing .lb-bar{height:100%; background:#2f9e5b; border-radius:100px;}
.gd-landing .lb-pct{font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:700; color:#1f6b3f; margin-bottom:6px;}
.gd-landing .lb-bio{font-size:13.5px; color:#5a5548; line-height:1.5;}
.gd-landing .lb-cta{flex:0 0 auto; background:#3a9e5f; color:#fff; font-weight:800; font-size:13px; padding:12px 18px; border-radius:8px; white-space:nowrap; text-align:center;}
@media(max-width:680px){.gd-landing .lb-card{flex-wrap:wrap;}.gd-landing .lb-cta{width:100%; order:3;}}
.gd-landing .phase-grid{margin-top:56px; display:grid; grid-template-columns:repeat(4,1fr); gap:20px;}
@media(max-width:900px){.gd-landing .phase-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:560px){.gd-landing .phase-grid{grid-template-columns:1fr;}}
.gd-landing .phase-card{background:var(--panel2); border:1px solid var(--line); border-radius:14px; padding:26px 22px;}
.gd-landing .phase-num{font-family:'Anton',sans-serif; font-size:38px; color:var(--gold); opacity:0.5; line-height:1;}
.gd-landing .phase-status{display:inline-block; margin:12px 0 10px; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; color:var(--muted); border:1px solid var(--line); border-radius:100px; padding:4px 10px;}
.gd-landing .phase-status.live{color:var(--ink); background:var(--green-bright); border-color:var(--green-bright);}
.gd-landing .phase-card h3{font-size:18px; font-weight:800; margin-bottom:8px;}
.gd-landing .phase-card p{font-size:14px; color:var(--muted); line-height:1.55;}
.gd-landing .process-grid{margin-top:56px; display:grid; grid-template-columns:repeat(3,1fr); gap:32px;}
@media(max-width:820px){.gd-landing .process-grid{grid-template-columns:1fr;}}
.gd-landing .process-card .num{font-family:'Anton',sans-serif; font-size:52px; color:var(--gold); opacity:0.45; line-height:1;}
.gd-landing .process-card h3{font-size:19px; font-weight:800; margin:14px 0 8px;}
.gd-landing .process-card p{font-size:14.5px; color:var(--muted); line-height:1.6;}
.gd-landing .bigstat{text-align:center; padding:120px 0; background-color:var(--bg); background-image:radial-gradient(ellipse 900px 400px at 50% 0%, rgba(111,214,143,0.12), transparent);}
.gd-landing .bigstat .num{font-family:'Anton',sans-serif; font-size:clamp(64px,12vw,150px); color:var(--green-bright); text-shadow:0 0 60px rgba(111,214,143,0.30);}
.gd-landing .bigstat p{font-size:18px; color:#cfc9ba; max-width:520px; margin:14px auto 0;}
.gd-landing .testi-grid{margin-top:56px; display:grid; grid-template-columns:repeat(3,1fr); gap:24px;}
@media(max-width:900px){.gd-landing .testi-grid{grid-template-columns:1fr;}}
.gd-landing .testi-card{background:var(--panel2); border:1px solid var(--line); border-radius:14px; padding:28px;}
.gd-landing .testi-card .stars{color:var(--gold); font-size:14px; margin-bottom:14px; letter-spacing:2px;}
.gd-landing .testi-card p{font-size:15px; line-height:1.6; color:#e5e0d3; margin-bottom:18px;}
.gd-landing .testi-who{display:flex; align-items:center; gap:12px;}
.gd-landing .testi-avatar{width:38px; height:38px; border-radius:50%; background:var(--red-dim); color:var(--red); display:flex; align-items:center; justify-content:center; font-weight:800; font-family:'Anton',sans-serif;}
.gd-landing .testi-name{font-size:13.5px; font-weight:700;}
.gd-landing .testi-meta{font-size:12px; color:var(--muted);}
.gd-landing .faq{margin-top:48px; max-width:820px;}
.gd-landing .faq-item{border-bottom:1px solid var(--line); padding:22px 0;}
.gd-landing .faq-item summary{cursor:pointer; list-style:none; display:flex; justify-content:space-between; align-items:center; font-weight:700; font-size:16.5px;}
.gd-landing .faq-item summary::-webkit-details-marker{display:none;}
.gd-landing .faq-item summary::after{content:"+"; font-family:'Anton',sans-serif; font-size:22px; color:var(--red);}
.gd-landing .faq-item[open] summary::after{content:"-";}
.gd-landing .faq-item p{margin-top:14px; color:var(--muted); font-size:15px; line-height:1.6;}
.gd-landing .faq-list{margin-top:14px; padding-left:20px;}
.gd-landing .faq-list li{color:var(--muted); font-size:15px; line-height:1.6; margin-bottom:10px;}
.gd-landing .faq-list li:last-child{margin-bottom:0;}
.gd-landing .faq-list li strong{color:var(--text); font-weight:700;}
.gd-landing .final-cta{text-align:center; padding:120px 0 100px; background-color:var(--bg); background-image:linear-gradient(180deg, transparent, rgba(58,158,95,0.10));}
.gd-landing .final-cta h2{font-size:clamp(34px,5.5vw,64px); max-width:820px; margin:0 auto;}
.gd-landing .final-cta .lede{margin:22px auto 0;}
.gd-landing .final-cta .hero-ctas{justify-content:center; margin-top:36px;}
.gd-landing footer{border-top:1px solid var(--line); padding:40px 0; text-align:center; color:var(--muted); font-size:13px; background-color:var(--bg);}
.gd-landing footer .logo{justify-content:center; margin-bottom:10px;}
`;

const body = `
<header class="nav">
  <div class="nav-banner">Free forever for the first 100 users. <strong>98 Founding Debt Slayers seats left.</strong></div>
  <div class="nav-inner">
    <div class="logo"><span class="dot"></span>GOODBYE DEBT</div>
    <nav class="nav-links">
      <a href="#offer">The Offer</a>
      <a href="#roadmap">Roadmap</a>
      <a href="#community">Community</a>
      <a href="#guarantee">Guarantee</a>
      <a href="#proof">Proof</a>
      <a href="#faq">FAQ</a>
    </nav>
    <div class="nav-actions">
      <a href="/login" class="nav-login">Login</a>
      <a href="/login?mode=signup" class="nav-cta">Start Free &rarr;</a>
    </div>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <div class="eyebrow"><span class="pulse"></span>The Grand Slam Debt Offer</div>
    <h1 class="display">See the fastest way to kill every debt you have. In <span class="accent">under 10 minutes</span>. Before you pay us anything.</h1>
    <p class="hero-sub">Goodbye Debt is not a budgeting app. It does one thing: tells you exactly which debt to attack first, exactly how much to pay where each cycle, and exactly what date you'll be free. No bank linking required. No guessing. Just the math, laid out.</p>
    <div class="hero-ctas">
      <a href="/login?mode=signup" class="btn-primary">Start Free. See Your Plan &rarr;</a>
      <span class="hero-note">Works right in your browser. No app store, no download.</span>
    </div>
    <div class="trust-bar">
      <div class="trust-stat"><div class="num">10 min</div><div class="label">To see your full payoff plan</div></div>
      <div class="trust-stat"><div class="num">256-bit</div><div class="label">Bank-level encryption</div></div>
      <div class="trust-stat"><div class="num">No bank link</div><div class="label">Manual entry or CSV, your data stays yours</div></div>
      <div class="trust-stat"><div class="num">First 100</div><div class="label">Unlimited debts, free forever</div></div>
    </div>
  </div>
</section>

<section class="section section-dark2">
  <div class="wrap">
    <div class="kicker">The Truth Nobody's Telling You</div>
    <h2 class="display">Minimum payments aren't a plan. They're a leash.</h2>
    <p class="lede">Your bank makes more money the longer you stay in debt. So they built an app to make you "aware" of it, never to end it. Being bad with money isn't the problem. Being sold soft, toothless tools is.</p>
    <div class="pain-grid">
      <div class="pain-card"><span class="x">&#10005;</span><h3>Budgeting apps just watch you drown</h3><p>Pretty charts. Color-coded categories. Zero instructions on which debt to kill first or how fast you could actually be free.</p></div>
      <div class="pain-card"><span class="x">&#10005;</span><h3>Minimum payments are a trap by design</h3><p>Pay the minimum on a typical card balance and you can hand the bank thousands in interest before you're done, years from now.</p></div>
      <div class="pain-card"><span class="x">&#10005;</span><h3>Most apps want your bank login first</h3><p>Goodbye Debt doesn't. Add debts manually or bulk-upload a CSV. No Plaid, no linking your accounts to a third party to get a plan.</p></div>
    </div>
  </div>
</section>

<section class="section" id="offer">
  <div class="wrap">
    <div class="kicker">The Grand Slam Offer</div>
    <h2 class="display">Here's every reason to start today, and none to wait.</h2>
    <p class="lede">No hype features. Just the exact engine that tells you where every dollar should go, free to start.</p>
    <div class="offer-wrap">
      <div class="invoice">
        <div class="invoice-head"><div><div class="brand">GOODBYE DEBT</div><div class="tag">START FREE &middot; WHAT'S INCLUDED</div></div><div class="stampmark">FOR YOU</div></div>
        <div class="line-item"><div class="li-left"><h4>The Prioritization Engine</h4><p>Ranks your debts by what's actually costing you the most and tells you exactly where extra dollars go first. No black box, it shows you why.</p></div><div class="li-val">Free</div></div>
        <div class="line-item"><div class="li-left"><h4>Manual Entry or CSV Upload</h4><p>Add debts by hand or bulk-import a spreadsheet. No bank login required, ever.</p></div><div class="li-val">Free</div></div>
        <div class="line-item"><div class="li-left"><h4>Due Date &amp; Billing Tracking</h4><p>Every due date and statement date in one place, with reminders before anything's late.</p></div><div class="li-val">Free</div></div>
        <div class="line-item"><div class="li-left"><h4>Your Debt-Free Date</h4><p>See the real date you'll be debt-free, and exactly how much interest you'll pay getting there.</p></div><div class="li-val">Free</div></div>
        <div class="line-item"><div class="li-left"><h4>Payment Guidance Each Cycle</h4><p>Told plainly what to pay where, every cycle. One tap to mark it done.</p></div><div class="li-val">Free</div></div>
        <div class="invoice-total"><div class="label">Debts tracked on the free plan</div><div class="val">Up to 2</div></div>
        <div class="today-row"><div class="label">Your price today</div><div class="val">$0</div></div>
        <div class="paid-stamp">START FREE</div>
      </div>
      <div class="offer-side">
        <h3 class="display">More debts, more control, when you're ready.</h3>
        <p>The free plan runs the full engine on your two biggest debts, with the Avalanche method built in. When you're carrying more than that, upgrading unlocks unlimited debts, every strategy (Avalanche, Snowball, or a custom hybrid), bulk CSV import, a what-if simulator, and full export.</p>
        <p>The first 100 people to join get unlimited debt tracking free forever, no upgrade ever needed. After that, standard pricing applies.</p>
        <a href="/login?mode=signup" class="btn-primary">Start Free. See Your Plan &rarr;</a>
      </div>
    </div>
  </div>
</section>

<section class="section section-dark2" id="guarantee">
  <div class="wrap">
    <div class="kicker">The Certainty Guarantee</div>
    <h2 class="display">See the math before you decide anything.</h2>
    <div class="guarantee">
      <div class="seal">SEE IT<br>FIRST<br>THEN<br>DECIDE</div>
      <div><h4>The See-The-Math-First Guarantee</h4><p>Add your debts and Goodbye Debt shows you your full optimized plan, your exact debt-free date, and the real interest you'll save, all before you're asked to pay anything. If the numbers don't convince you it's worth using, close the tab. No card required to find out.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="kicker">How It Actually Works</div>
    <h2 class="display">Three steps. Twenty minutes. Zero spreadsheets.</h2>
    <div class="process-grid">
      <div class="process-card"><div class="num">01</div><h3>Add your debts</h3><p>Type them in by hand or upload a CSV. No bank login, no linking your accounts to anyone.</p></div>
      <div class="process-card"><div class="num">02</div><h3>Get your payoff order</h3><p>Goodbye Debt ranks every balance by what it's actually costing you and shows you exactly why.</p></div>
      <div class="process-card"><div class="num">03</div><h3>Follow the plan each cycle</h3><p>Pay what it tells you, tap it done, watch your debt-free date pull closer every month.</p></div>
    </div>
  </div>
</section>

<section class="section" id="roadmap">
  <div class="wrap">
    <div class="kicker">The Roadmap</div>
    <h2 class="display">This is just Phase 1. Here's where Goodbye Debt is going.</h2>
    <p class="lede">You're joining at the ground floor. Every new member pushes us toward the next phase — more tools, more ways to get ahead of your debt for good.</p>
    <div class="phase-grid">
      <div class="phase-card">
        <div class="phase-num">01</div>
        <span class="phase-status live">Live now</span>
        <h3>MVP &mdash; Kill Your Debt</h3>
        <p>Debt tracking, the avalanche / snowball / hybrid payoff engine, CSV &amp; PDF statement import, the Debt Slayers community, and your profile &amp; journey timeline.</p>
      </div>
      <div class="phase-card">
        <div class="phase-num">02</div>
        <span class="phase-status">Next up</span>
        <h3>Education</h3>
        <p>Bite-sized money education built right into the app &mdash; so you don't just get out of debt, you learn how to stay out.</p>
      </div>
      <div class="phase-card">
        <div class="phase-num">03</div>
        <span class="phase-status">Planned</span>
        <h3>Earning Opportunities</h3>
        <p>Ways to bring in extra income and throw more at your balances, matched to your situation.</p>
      </div>
      <div class="phase-card">
        <div class="phase-num">04</div>
        <span class="phase-status">Planned</span>
        <h3>Skill Development</h3>
        <p>Level up the skills that grow your income for the long run &mdash; building on the earning opportunities from Phase 3.</p>
      </div>
    </div>
    <p class="lede" style="margin-top:32px;">Each phase unlocks as the community grows. <a href="/login?mode=signup" style="color:var(--green-bright); font-weight:700;">Join free</a> and help us get there faster.</p>
  </div>
</section>

<section class="section section-dark2" id="community">
  <div class="wrap">
    <div class="kicker">You Don't Have To Do This Alone</div>
    <h2 class="display">It takes a village to get out of debt. We're building one.</h2>
    <p class="lede">Debt Slayers is the community built into Goodbye Debt. People paying down debt at the same time, cheering each other on, and sometimes helping each other directly. Nobody here has to be embarrassed about a number. Everybody's working on one.</p>
    <div class="testi-grid">
      <div class="testi-card"><div class="stars">&#9670; THE LEADERBOARD</div><p>Ranked by percent paid off, never by dollar amount. Someone paying off &#8369;20,000 stands shoulder to shoulder with someone paying off $50,000. Progress is progress, wherever you started.</p></div>
      <div class="testi-card"><div class="stars">&#9670; YOUR STORY</div><p>A profile with your journey and your milestones. A pseudonym is the default, your real name is never required. Nothing is visible to anyone until you choose to turn it on.</p></div>
      <div class="testi-card"><div class="stars">&#9670; HELP EACH OTHER</div><p>Members can add their own personal payment links so others can choose to help directly if they want to. It's person to person, always optional, and never processed or held by us.</p></div>
    </div>
    <div class="leaderboard">
      <div class="lb-caption">EXAMPLE LEADERBOARD, ILLUSTRATIVE ONLY</div>
      <div class="lb-card"><div class="lb-rank">#1</div><div class="lb-avatar">K</div><div class="lb-body"><div class="lb-name-row"><span class="lb-name">Kathy_debtslayqueen</span><span>&#127477;&#127469;</span><span class="lb-country">Philippines</span></div><div class="lb-bar-wrap"><div class="lb-bar" style="width:64%;"></div></div><div class="lb-pct">64% paid off</div><div class="lb-bio">Working towards debt-free so I can spend all my time with my kids.</div></div><span class="lb-cta">Help me be debt free</span></div>
      <div class="lb-card"><div class="lb-rank">#2</div><div class="lb-avatar">M</div><div class="lb-body"><div class="lb-name-row"><span class="lb-name">DebtSlayer_4821</span><span>&#127482;&#127480;</span><span class="lb-country">United States</span></div><div class="lb-bar-wrap"><div class="lb-bar" style="width:51%;"></div></div><div class="lb-pct">51% paid off</div><div class="lb-bio">Two cards, one plan, no more minimum payments.</div></div><span class="lb-cta">Help me be debt free</span></div>
      <div class="lb-card"><div class="lb-rank">#3</div><div class="lb-avatar">D</div><div class="lb-body"><div class="lb-name-row"><span class="lb-name">DebtSlayer_1190</span><span>&#127468;&#127463;</span><span class="lb-country">United Kingdom</span></div><div class="lb-bar-wrap"><div class="lb-bar" style="width:29%;"></div></div><div class="lb-pct">29% paid off</div><div class="lb-bio">Started three months ago. First card is almost gone.</div></div><span class="lb-cta">Help me be debt free</span></div>
    </div>
  </div>
</section>

<section class="bigstat" id="proof">
  <div class="wrap">
    <div class="num">$6,610</div>
    <p>The average American's credit card balance right now, per TransUnion and the Federal Reserve. At roughly 21.5% APR, paying the minimum can cost more in interest than the debt itself. That's the math Goodbye Debt exists to break. <span style="display:block; margin-top:10px; font-size:12px; color:var(--muted); font-family:'JetBrains Mono',monospace;">Source: TransUnion / Federal Reserve, Q2 2026.</span></p>
  </div>
</section>

<section class="section section-dark2">
  <div class="wrap">
    <div class="kicker">Why Trust A Brand New App?</div>
    <h2 class="display">Fair question. Here's the honest answer.</h2>
    <p class="lede">We don't have 10,000 reviews yet. We're not going to fake them. What we have is a plan you can see before you commit to anything, real Federal Reserve interest-rate math behind it, and a founder who'll answer your email personally for the first people who try it.</p>
    <div class="testi-grid">
      <div class="testi-card"><div class="stars">&#9670; THE GUARANTEE</div><p>You see your full plan, debt-free date, and interest saved before you're ever asked to pay. Nothing to cancel, nothing to refund, because nothing's charged until you decide it's worth it.</p></div>
      <div class="testi-card"><div class="stars">&#9670; THE FOUNDER</div><p>Kathy built Goodbye Debt after watching her own debt pile up the way it does for most parents: a couple of kids, a pandemic, and life happening faster than a budget spreadsheet could keep up with. She built the tool she wished she'd had. Early users get her directly, not a support ticket queue.</p></div>
      <div class="testi-card"><div class="stars">&#9670; FOUNDING 100</div><p>The first 100 people to join get unlimited debt tracking, free forever. No upgrade, no expiration. You're not user forty thousand. You're one of the first ten.</p></div>
    </div>
  </div>
</section>

<section class="section" id="faq">
  <div class="wrap">
    <div class="kicker">Before You Ask</div>
    <h2 class="display">Every objection, answered in advance.</h2>
    <div class="faq">
      <details class="faq-item" open><summary>Is this really free?</summary><p>Yes, to start. The free plan runs the full prioritization engine on up to two debts, no card required. Carrying more than two debts, or want every strategy and CSV import, is when a paid tier applies, except for our first 100 founding members, who get unlimited debt tracking free forever.</p></details>
      <details class="faq-item"><summary>How is this different from every other budgeting app?</summary><p>Most apps show you where your money went. Goodbye Debt tells you exactly where it should go next, ranked by what's actually costing you the most, with a real date attached to being done.</p></details>
      <details class="faq-item"><summary>Do you link to my bank account?</summary><p>No, by design. You add debts manually or upload a CSV. That means no third-party account linking, no ongoing sync permissions, and your balances update only when you say so.</p></details>
      <details class="faq-item"><summary>Is my data safe?</summary><ul class="faq-list"><li><strong>Your statements never leave your device.</strong> PDFs and photos are read right in your browser. We only save the figures you confirm, never the file.</li><li><strong>We never store your card number, name, or address.</strong> Only the last 4 digits of a card are kept, as a nickname.</li><li><strong>Only you can see your data.</strong> Every account is isolated at the database level, so no one else can access your debts or payments. Sign-in requires your own email and password.</li><li><strong>Always encrypted.</strong> Your data is encrypted in transit and at rest.</li><li><strong>You control what's public.</strong> Your Community profile is private by default. If you opt in, only your display name, country, story, and percentage paid off appear, never your actual amounts. Turn it off anytime.</li></ul></details>
    </div>
  </div>
</section>

<section class="final-cta" id="cta">
  <div class="wrap">
    <div class="kicker" style="text-align:center;">Every Day You Wait Has A Price Tag</div>
    <h2 class="display">Start Goodbye Debt. Watch the number go down instead of up.</h2>
    <p class="lede" style="text-align:center;">Ten minutes from now, you could have an actual deadline for your debt instead of a vague hope it'll sort itself out someday.</p>
    <div class="hero-ctas">
      <a href="/login?mode=signup" class="btn-primary">Start Free. See Your Plan &rarr;</a>
    </div>
  </div>
</section>

<footer>
  <div class="wrap">
    <div class="logo"><span class="dot"></span>GOODBYE DEBT</div>
    <div>&copy; 2026 Goodbye Debt. All rights reserved.</div>
    <div style="margin-top:8px;">Developed and designed by <a href="https://malayapublishing.com" style="color:var(--gold); font-weight:700;">Malaya Publishing</a></div>
  </div>
</footer>
`;

export default function LandingPage() {
  return (
    <div className="gd-landing">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}
