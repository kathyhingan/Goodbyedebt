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
  if (!article) return { title: "Guide not found | GoodbyeDebt" };
  return {
    title: `${article.title} | GoodbyeDebt`,
    description: article.description,
    alternates: { canonical: `./` },
  };
}

export default function GuideArticle({ params }: { params: Params }) {
  const { slug } = params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) {
    return (
      <main className="container">
        <div className="brand">
          <h1>
            Goodbye<span>Debt</span>
          </h1>
        </div>
        <section className="card">
          <p>That guide does not exist (or moved).</p>
          <p>
            <Link href="/guides">Browse all guides →</Link>
          </p>
        </section>
      </main>
    );
  }
  return (
    <main className="container">
      <div className="brand">
        <h1>
          Goodbye<span>Debt</span>
        </h1>
      </div>
      <p className="tagline">{article.kicker}</p>
      <article className="guide-article">
        <h1 className="guide-h1">{article.title}</h1>
        <div className="guide-tldr">
          <strong>Short answer:</strong> {article.tldr}
        </div>
        {article.sections.map((s) => (
          <section key={s.heading} className="guide-section">
            <h2 className="guide-h2">{s.heading}</h2>
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
            {s.subheadings
              ? s.subheadings.map((sh) => (
                  <div key={sh.text}>
                    <h3 className="guide-h3">{sh.text}</h3>
                    {sh.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                ))
              : null}
          </section>
        ))}
        <section className="guide-section">
          <h2 className="guide-h2">Frequently asked questions</h2>
          {article.faq.map((f) => (
            <div key={f.q} className="guide-faq-item">
              <h3 className="guide-h3">{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </section>
        <section className="card guide-cta">
          <div className="guide-cta-lead">{article.ctaLead}</div>
          <div className="guide-cta-sub">{article.ctaSub}</div>
          <div style={{ marginTop: 12 }}>
            <Link href="/" className="btn-primary">
              Open the payoff planner
            </Link>
          </div>
        </section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqJsonLd(article) }}
        />
      </article>
    </main>
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
