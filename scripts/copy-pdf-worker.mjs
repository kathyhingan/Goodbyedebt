// Copies the pdf.js worker into /public so the browser can load it at a stable
// URL (avoids bundling the .mjs worker through webpack). Runs on install/build,
// including on Vercel, so the file version always matches the installed pdfjs-dist.
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";

const src = "node_modules/pdfjs-dist/build/pdf.worker.min.mjs";
const dest = "public/pdf.worker.min.mjs";

if (!existsSync(src)) {
  console.warn(`[copy-pdf-worker] source not found (${src}); skipping.`);
  process.exit(0);
}

mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log(`[copy-pdf-worker] ${src} → ${dest}`);
