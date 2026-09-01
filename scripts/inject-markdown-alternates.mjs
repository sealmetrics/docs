#!/usr/bin/env node
/**
 * Advertise each page's Markdown twin from the page itself.
 *
 * llms.txt lists every twin, but an agent that lands on an HTML page from a
 * search result never reads llms.txt. sealmetrics.com solves this with a
 * per-page <link rel="alternate" type="text/markdown">; this does the same for
 * the docs.
 *
 * Docusaurus has no per-route head hook at build time (injectHtmlTags is
 * global), so this runs as a `postbuild` step over the emitted HTML, driven by
 * static/knowledge-manifest.json — the same manifest that lists the twins.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BUILD_DIR = join(ROOT, 'build');
const MANIFEST = join(ROOT, 'static', 'knowledge-manifest.json');

if (!existsSync(BUILD_DIR)) {
  console.error(`[markdown-alternates] no build directory at ${BUILD_DIR} — run after 'docusaurus build'.`);
  process.exit(1);
}
if (!existsSync(MANIFEST)) {
  console.error(`[markdown-alternates] missing ${MANIFEST} — run 'npm run generate:llms' first.`);
  process.exit(1);
}

const { routes } = JSON.parse(readFileSync(MANIFEST, 'utf-8'));

/**
 * trailingSlash:false emits `<route>.html`, but keep the directory form as a
 * fallback so a config change doesn't silently turn this into a no-op.
 */
function htmlCandidates(route) {
  if (route === '/') return [join(BUILD_DIR, 'index.html')];
  const rel = route.replace(/^\//, '');
  return [join(BUILD_DIR, `${rel}.html`), join(BUILD_DIR, rel, 'index.html')];
}

let injected = 0;
let alreadyPresent = 0;
const missing = [];

for (const { route, markdown } of routes) {
  const file = htmlCandidates(route).find(existsSync);
  if (!file) {
    missing.push(route);
    continue;
  }

  const html = readFileSync(file, 'utf-8');
  if (html.includes('type="text/markdown"')) {
    alreadyPresent += 1;
    continue;
  }

  const tag = `<link rel="alternate" type="text/markdown" href="${markdown}">`;
  const updated = html.replace('</head>', `${tag}</head>`);
  if (updated === html) {
    missing.push(`${route} (no </head>)`);
    continue;
  }

  writeFileSync(file, updated, 'utf-8');
  injected += 1;
}

console.log(`[markdown-alternates] ${injected} injected, ${alreadyPresent} already present, ${missing.length} without a built page`);

if (missing.length) {
  for (const route of missing.slice(0, 20)) console.warn(`  - ${route}`);
  if (missing.length > 20) console.warn(`  … and ${missing.length - 20} more`);
}

// A manifest that matches nothing means the build layout moved and every page
// silently lost its twin link. That is the failure this step exists to prevent.
if (injected + alreadyPresent === 0) {
  console.error('[markdown-alternates] no pages matched the manifest — build layout changed?');
  process.exit(1);
}
