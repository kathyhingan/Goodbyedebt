"use client";

/**
 * Extracts text from a PDF, reconstructing visual lines by grouping text items
 * on the same y-coordinate and ordering left-to-right. This keeps each label
 * next to its value (e.g. "Minimum Amount Due 850.00") so the parser can read
 * them together.
 *
 * pdfjs-dist is imported dynamically (browser-only) so it never runs during
 * server-side rendering. Options are chosen for robustness across devices:
 * no streaming/range requests (we already have the full bytes) and no eval
 * (CSP-safe). If the worker can't be set up, pdf.js falls back to the main
 * thread automatically.
 */
export async function extractPdfLines(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  // The worker is staged into /public by scripts/copy-pdf-worker.mjs and served
  // same-origin (no CDN — CSP-safe, offline-capable).
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjsLib.getDocument({
    data,
    isEvalSupported: false,
    disableStream: true,
    disableAutoFetch: true,
    useSystemFonts: true,
  }).promise;

  const lines: string[] = [];
  try {
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();

      const byRow = new Map<number, { x: number; s: string }[]>();
      for (const item of content.items) {
        if (!("str" in item) || !item.str) continue;
        const y = Math.round(item.transform[5]);
        const x = Math.round(item.transform[4]);
        if (!byRow.has(y)) byRow.set(y, []);
        byRow.get(y)!.push({ x, s: item.str });
      }

      for (const y of [...byRow.keys()].sort((a, b) => b - a)) {
        const line = byRow
          .get(y)!
          .sort((a, b) => a.x - b.x)
          .map((o) => o.s)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        if (line) lines.push(line);
      }
      page.cleanup();
    }
  } finally {
    // Always release the worker/document so a stuck doc can't wedge the next try.
    void doc.destroy();
  }

  return lines.join("\n");
}
