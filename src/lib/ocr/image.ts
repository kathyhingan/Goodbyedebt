"use client";

/**
 * OCR a statement photo/screenshot into line-reconstructed text, so it can feed
 * the same parseStatement()/extractTransactions() pipeline as PDFs.
 *
 * Runs entirely in the browser via tesseract.js (WASM) — the image is never
 * uploaded anywhere; only the OCR engine assets are fetched. Imported
 * dynamically so it never runs during server-side rendering.
 */
export async function extractImageLines(file: File): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  try {
    const { data } = await worker.recognize(file);
    // Prefer line-level output (keeps each label next to its value); fall back
    // to the flat text if the build doesn't surface lines.
    const anyData = data as unknown as { lines?: { text: string }[]; text: string };
    const lines =
      Array.isArray(anyData.lines) && anyData.lines.length > 0
        ? anyData.lines.map((l) => l.text)
        : String(anyData.text).split("\n");
    return lines.map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n");
  } finally {
    await worker.terminate();
  }
}
