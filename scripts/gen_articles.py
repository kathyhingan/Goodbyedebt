"""Generate src/lib/content/articles.ts from the ICM markdown articles.

Usage:
  python gen_articles.py <articles_md_dir> <out_articles.ts>

Pipeline per file: parse markdown -> GuideArticleData JSON -> emit TS module.
Supports the ICM article shape: H1 title, **Short answer:** TLDR, ## sections
(paragraphs, -, 1. lists, bold subheads), **Q?** FAQ pairs, and an optional
HTML comment block `<!-- compare-table ... -->` that becomes article.table
(a renderable comparison table for lender/plan comparison guides).

Metadata (description/kicker/ctaLead/ctaSub) comes from meta.json in the
articles dir, keyed by slug; slugs are assigned from the same file.
"""
import json, re, sys, pathlib


def parse_md(text: str) -> dict:
    lines = text.split("\n")
    title = ""
    tldr = ""
    sections: list[dict] = []
    faq: list[dict] = []
    table = None

    def strip_emphasis(s: str) -> str:
        """Markdown bold is styling, not copy: drop the markers, keep the text."""
        return s.replace("**", "").strip()

    # optional compare-table block: <!-- compare-table {json} -->
    m = re.search(r"<!--\s*compare-table\s*(\{.*?\})\s*-->", text, re.S)
    if m:
        try:
            table = json.loads(m.group(1))
        except json.JSONDecodeError:
            table = None

    i = 0
    cur: dict | None = None
    cur_list: list[str] | None = None
    cur_list_kind: str | None = None  # "bullets" | "numbered"
    in_faq = False

    def flush_list():
        nonlocal cur_list, cur_list_kind
        if cur and cur_list:
            if cur_list_kind == "numbered":
                cur["numbered"] = cur_list
            else:
                cur["bullets"] = cur_list
        cur_list, cur_list_kind = None, None

    def md_table(block: list[str]) -> dict | None:
        """Parse a markdown pipe table into {headers, rows}."""
        rows = [tr for tr in (split_row(l) for l in block) if tr is not None]
        if len(rows) < 2:
            return None
        return {"headers": rows[0], "rows": rows[2:]}  # rows[1] is the --- separator

    def split_row(line: str) -> list[str] | None:
        s = line.strip()
        if not (s.startswith("|") and s.endswith("|")):
            return None
        return [c.strip() for c in s[1:-1].split("|")]

    # pre-pass: pull markdown pipe tables out, leaving a sentinel line behind
    tables: list[dict] = []
    src_lines = text.split("\n")
    lines: list[str] = []
    k = 0
    while k < len(src_lines):
        cur_row = split_row(src_lines[k])
        nxt_row = split_row(src_lines[k + 1]) if k + 1 < len(src_lines) else None
        is_sep = nxt_row is not None and all(c and set(c) <= set("-: ") for c in nxt_row)
        if cur_row is not None and is_sep:
            block = [src_lines[k], src_lines[k + 1]]
            j = k + 2
            while j < len(src_lines) and split_row(src_lines[j]) is not None:
                block.append(src_lines[j])
                j += 1
            tbl = md_table([b.rstrip() for b in block])
            if tbl:
                tables.append(tbl)
                lines.append(f"<!--mdtable:{len(tables) - 1}-->")
            k = j
            continue
        lines.append(src_lines[k])
        k += 1

    for raw in lines:
        line = raw.rstrip()
        if line.startswith("# ") and not title:
            title = line[2:].strip()
            continue
        if line.strip("<!--->") == "" and line.startswith("<!--"):
            continue  # comment blocks handled above
        if line.startswith("## "):
            flush_list()
            heading = line[3:].strip()
            in_faq = heading.lower().startswith("frequently asked")
            if in_faq:
                cur = None
                continue
            cur = {"heading": heading, "paragraphs": [], "bullets": None, "numbered": None, "subheadings": None}
            sections.append(cur)
            continue
        # table sentinel left by the pre-pass
        mt = re.match(r"^<!--mdtable:(\d+)-->$", line.strip())
        if mt and cur is not None:
            flush_list()
            cur["table"] = tables[int(mt.group(1))]
            continue
        if line.strip() == "---":
            flush_list()
            cur = None
            in_faq = False
            continue
        if in_faq:
            qm = re.match(r"^\*\*(.+?\?)\*\*\s*$", line.strip())
            if qm:
                faq.append({"q": qm.group(1).strip(), "a": ""})
            elif faq and line.strip():
                faq[-1]["a"] = (faq[-1]["a"] + " " + line.strip()).strip()
            continue
        tm = re.match(r"^\*\*Short answer:?\*\*\s*(.*)$", line.strip())
        if tm:
            tldr = tm.group(1).strip()
            continue
        # subheading: **Bold text:** standalone line inside a section
        sm = re.match(r"^\*\*([^*]+?):?\*\*\s*$", line.strip())
        if sm and cur is not None:
            flush_list()
            if cur["subheadings"] is None:
                cur["subheadings"] = []
            cur["subheadings"].append({"text": sm.group(1).strip().rstrip(":") + ":", "paragraphs": []})
            continue
        # numbered list item: "1. ", "2. " ...
        nm = re.match(r"^\d+\.\s+(.*)$", line.strip())
        if nm:
            if cur_list_kind != "numbered":
                flush_list()
                cur_list, cur_list_kind = [], "numbered"
            cur_list.append(strip_emphasis(nm.group(1)))
            continue
        # bullet item: "- "
        bm = re.match(r"^[-*]\s+(.*)$", line.strip())
        if bm:
            if cur_list_kind != "bullets":
                flush_list()
                cur_list, cur_list_kind = [], "bullets"
            cur_list.append(strip_emphasis(bm.group(1)))
            continue
        if line.startswith("*") and line.endswith("*") and line.startswith("*Internal"):
            continue  # internal-link footer note
        if not line.strip():
            flush_list()
            continue
        # paragraph text
        if cur is not None:
            if cur["subheadings"]:
                cur["subheadings"][-1]["paragraphs"].append(strip_emphasis(line))
            else:
                cur["paragraphs"].append(strip_emphasis(line))
        elif not tldr and tldr == "":
            # text right after the TLDR line but before the first ## (part of TLDR paragraph flow)
            pass
    flush_list()
    return {"title": title, "tldr": tldr, "sections": sections, "faq": faq, "table": table}


def main() -> None:
    src_dir = pathlib.Path(sys.argv[1])
    out_path = pathlib.Path(sys.argv[2])
    meta = json.loads((src_dir / "meta.json").read_text(encoding="utf-8"))

    slugs = meta["order"]
    entries = []
    for slug in slugs:
        fname = meta["files"][slug]
        raw = (src_dir / fname).read_text(encoding="utf-8")
        data = parse_md(raw)
        m = meta["meta"][slug]
        entry = {
            "slug": slug,
            "title": data["title"] or m.get("titleFallback", slug),
            "description": m["description"],
            "kicker": m["kicker"],
            "tldr": data["tldr"],
            "sections": data["sections"],
            "faq": data["faq"],
            "ctaLead": m["ctaLead"],
            "ctaSub": m["ctaSub"],
        }
        if m.get("resource"):
            entry["resource"] = m["resource"]
        entries.append(entry)

    def esc(s: str) -> str:
        return json.dumps(s, ensure_ascii=False)

    out = []
    out.append("// AUTO-GENERATED from debt-app-seo-icm/03-content-strategy/output/articles/*.md.")
    out.append("// Regenerate: python scripts/gen_articles.py <articles_dir> src/lib/content/articles.ts")
    out.append("// Metadata (description, kicker, ctaLead, ctaSub) comes from meta.json in the articles dir.")
    out.append("")
    out.append("export interface GuideSection { heading: string; paragraphs: string[]; bullets?: string[] | null; numbered?: string[] | null; subheadings?: { text: string; paragraphs: string[] }[] | null; table?: { headers: string[]; rows: string[][] } | null; }")
    out.append("export interface GuideFaq { q: string; a: string; }")
    out.append("export interface GuideResource { label: string; blurb: string; href: string; cta: string; }")
    out.append("export interface GuideArticleData {")
    out.append("  slug: string; title: string; description: string; kicker: string; tldr: string;")
    out.append("  sections: GuideSection[]; faq: GuideFaq[]; ctaLead: string; ctaSub: string;")
    out.append("  resource?: GuideResource | null;")
    out.append("}")
    out.append("")
    out.append("export const ARTICLE_LIST: GuideArticleData[] = [")
    for e in entries:
        out.append("  " + json.dumps(e, ensure_ascii=False, indent=2).replace("\n", "\n  ") + ",")
    out.append("];")
    out.append("")
    out_path.write_text("\n".join(out), encoding="utf-8")
    print(f"wrote {out_path} with {len(entries)} articles")
    tables = [e["slug"] for e in entries
              if any(s.get("table") for s in e["sections"])]
    print("articles with compare tables:", tables if tables else "none")


if __name__ == "__main__":
    main()
