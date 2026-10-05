import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLE_LIST as articles } from "@/lib/content/articles";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "Guide not found | Goodbye Debt" };
  return {
    title: `${article.title} | Goodbye Debt`,
    description: article.description,
    alternates: { canonical: `./` },
  };
}

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
.gd-guides .article-wrap{max-width:760px; margin:0 auto; padding:56px 28px 40px;}
.gd-guides .article-kicker{display:inline-flex; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--gold); border:1px solid var(--red-dim); background:rgba(201,162,77,0.09); padding:7px 14px; border-radius:100px; margin-bottom:26px;}
.gd-guides .article-wrap h1{font-family:'Anton',sans-serif; text-transform:uppercase; letter-spacing:0.5px; line-height:1.05; font-size:clamp(30px,4.4vw,48px); margin:0; color:var(--text);}
.gd-guides .tldr{margin-top:28px; border:2px solid var(--gold); background:linear-gradient(135deg, rgba(201,162,77,0.10), transparent); border-radius:14px; padding:22px 24px; font-size:15.5px; line-height:1.65; color:#e5e0d3;}
.gd-guides .tldr strong{font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:var(--gold); display:block; margin-bottom:8px;}
.gd-guides .resource-card{margin-top:20px; background:var(--panel2); border:1px solid var(--line); border-left:4px solid var(--green-bright); border-radius:14px; padding:20px 22px;}
.gd-guides .resource-label{display:inline-block; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; color:var(--gold); border:1px solid var(--line); border-radius:100px; padding:4px 10px; margin-bottom:12px;}
.gd-guides .resource-blurb{margin:0 0 16px; font-size:14.5px; line-height:1.6; color:#d8d3c5;}
.gd-guides .resource-card .btn-primary{font-size:14px; padding:14px 22px;}
.gd-guides .article-body{margin-top:16px;}
.gd-guides .article-body h2{font-family:'Anton',sans-serif; text-transform:uppercase; letter-spacing:0.5px; font-size:clamp(20px,2.6vw,26px); line-height:1.25; color:var(--green-bright); margin:44px 0 14px;}
.gd-guides .article-body h3{font-family:'Anton',sans-serif; text-transform:uppercase; letter-spacing:0.5px; font-size:clamp(17px,2.2vw,21px); color:var(--text); margin:28px 0 10px;}
.gd-guides .article-body p{line-height:1.7; margin:0 0 16px; font-size:15.5px; color:#d8d3c5;}
.gd-guides .article-body ul, .gd-guides .article-body ol{margin:0 0 16px; padding-left:22px;}
.gd-guides .article-body li{line-height:1.7; margin-bottom:10px; font-size:15.5px; color:#d8d3c5;}
.gd-guides .article-body li::marker{color:var(--gold);}
.gd-guides .article-body strong{color:var(--text);}
.gd-guides .table-scroll{margin:20px 0 24px; overflow-x:auto; -webkit-overflow-scrolling:touch; border:1px solid var(--line); border-radius:12px;}
.gd-guides .table-scroll table{width:100%; border-collapse:collapse; font-size:13px; min-width:460px;}
.gd-guides .table-scroll th{font-family:'JetBrains Mono',monospace; font-size:10.5px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; color:var(--gold); text-align:left; padding:10px 12px; background:var(--panel2); border-bottom:1px solid var(--line);}
.gd-guides .table-scroll td{text-align:left; padding:10px 12px; border-bottom:1px solid var(--line); color:#d8d3c5; line-height:1.5; vertical-align:top;}
.gd-guides .table-scroll tr:last-child td{border-bottom:none;}
.gd-guides .table-scroll tr:nth-child(even) td{background:rgba(20,31,22,0.5);}
.gd-guides .table-scroll td:first-child{color:var(--text); font-weight:700;}
.gd-guides .faq-block{margin-top:56px; border-top:1px solid var(--line); padding-top:40px;}
.gd-guides .faq-block h2{font-family:'Anton',sans-serif; text-transform:uppercase; letter-spacing:0.5px; font-size:clamp(20px,2.6vw,26px); color:var(--green-bright); margin:0 0 8px;}
.gd-guides .faq-item{border-bottom:1px solid var(--line); padding:20px 0;}
.gd-guides .faq-item h3{font-size:16px; font-weight:800; margin:0 0 10px; color:var(--text);}
.gd-guides .faq-item p{margin:0; color:var(--muted); font-size:15px; line-height:1.65;}
.gd-guides .article-cta{margin-top:56px; border:2px solid var(--gold); background:linear-gradient(135deg, rgba(201,162,77,0.10), transparent); border-radius:16px; padding:36px 32px;}
.gd-guides .article-cta .lead{font-family:'Anton',sans-serif; text-transform:uppercase; letter-spacing:0.5px; font-size:clamp(19px,2.4vw,24px); color:var(--text); margin:0 0 10px;}
.gd-guides .article-cta .sub{font-size:14.5px; color:#cfc9ba; line-height:1.6; margin:0 0 22px;}
.gd-guides .btn-primary{background:var(--green); color:#fff; font-weight:800; font-size:16px; padding:18px 30px; border-radius:10px; display:inline-flex; align-items:center; gap:10px; box-shadow:0 10px 30px -8px rgba(58,158,95,0.55); border:none; cursor:pointer; transition:transform .15s ease;}
.gd-guides .btn-primary:hover{transform:translateY(-2px);}
.gd-guides .back-link{display:inline-block; margin-top:32px; font-size:14px; font-weight:700; color:var(--muted);}
.gd-guides .back-link:hover{color:var(--green-bright);}
.gd-guides footer{border-top:1px solid var(--line); padding:40px 0; text-align:center; color:var(--muted); font-size:13px; background-color:var(--bg); margin-top:80px;}
.gd-guides .footer-logo{display:flex; align-items:center; justify-content:center; gap:10px; font-family:'Anton',sans-serif; font-size:19px; letter-spacing:0.5px; margin-bottom:10px;}
.gd-guides .footer-logo .dot{width:10px; height:10px; background:var(--green-bright); border-radius:50%; box-shadow:0 0 12px var(--green-bright);}
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
    <div class="footer-logo"><span class="dot"></span>GOODBYE DEBT</div>
    <div>&copy; 2026 Goodbye Debt. All rights reserved.</div>
    <div style="margin-top:8px;">Developed and designed by <a href="https://malayapublishing.com" style="color:var(--gold); font-weight:700;">Malaya Publishing</a></div>
  </div>
</footer>
`;

export default function GuideArticle({ params }: { params: Params }) {
  const { slug } = params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) {
    return (
      <div className="gd-guides">
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div dangerouslySetInnerHTML={{ __html: navHtml }} />
        <div className="article-wrap">
          <h1>Guide not found</h1>
          <p style={{ marginTop: 16, color: "#8b9a83", fontSize: 15 }}>
            That guide does not exist (or moved).
          </p>
          <p style={{ marginTop: 12 }}>
            <Link href="/guides" className="back-link" style={{ marginTop: 0 }}>
              Browse all guides &rarr;
            </Link>
          </p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: footerHtml }} />
      </div>
    );
  }
  return (
    <div className="gd-guides">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: navHtml }} />
      <div className="article-wrap">
        <span className="article-kicker">{article.kicker}</span>
        <h1>{article.title}</h1>
        <div className="tldr">
          <strong>Short answer</strong>
          {article.tldr}
        </div>
        {article.resource ? (
          <div className="resource-card">
            <span className="resource-label">{article.resource.label}</span>
            <p className="resource-blurb">{article.resource.blurb}</p>
            <a href={article.resource.href} className="btn-primary" download>
              {article.resource.cta}
            </a>
          </div>
        ) : null}
        <div className="article-body">
          {article.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {s.bullets ? (
                <ul>
                  {s.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              ) : null}
              {s.numbered ? (
                <ol>
                  {s.numbered.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ol>
              ) : null}
              {s.table ? (
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        {s.table.headers.map((h, i) => (
                          <th key={i}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              {s.subheadings
                ? s.subheadings.map((sh) => (
                    <div key={sh.text}>
                      <h3>{sh.text}</h3>
                      {sh.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  ))
                : null}
            </section>
          ))}
        </div>
        <div className="faq-block">
          <h2>Frequently asked questions</h2>
          {article.faq.map((f) => (
            <div key={f.q} className="faq-item">
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
        <div className="article-cta">
          <div className="lead">{article.ctaLead}</div>
          <div className="sub">{article.ctaSub}</div>
          <Link href="/login?mode=signup" className="btn-primary">
            Start Free. See Your Plan &rarr;
          </Link>
        </div>
        <Link href="/guides" className="back-link">
          &larr; Browse all guides
        </Link>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqJsonLd(article) }}
        />
      </div>
      <div dangerouslySetInnerHTML={{ __html: footerHtml }} />
    </div>
  );
}

function faqJsonLd(article: (typeof articles)[number]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });
}
