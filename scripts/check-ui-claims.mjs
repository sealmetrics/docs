#!/usr/bin/env node
/**
 * UI claims check: docs must not reference dashboard routes or Site Settings
 * tabs that don't exist in the real dashboard (scripts/ui-manifest.json).
 *
 * Checks over docs/** /*.mdx:
 *   (a) every dashboard route cited with prefix /sites/... /settings/...
 *       /account/... /organizations/... must exist in the manifest's routes
 *       (dynamic segments match: docs may use {site_id}, {slug}, YOUR_SITE_ID,
 *       test-account, ... where the route has {siteId}/{slug}/{id})
 *   (b) every "**X** tab" / "tab **X**" claim whose line mentions Site
 *       Settings must be one of the manifest's siteSettingsTabs labels
 *
 * Any violation -> ERROR with file:line, exit 1.
 *
 * Refresh the manifest (needs the dashboard repo checked out locally):
 *
 *   node scripts/generate-ui-manifest.mjs [/path/to/dashboard/src]
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'ui-manifest.json'), 'utf8'));

// Excluded from the route check (each entry justified):
// - docs/api/**, docs/lens/api/**: document REST endpoints whose paths share
//   the /sites, /organizations, /account prefixes with dashboard routes
//   (e.g. GET /sites/{site_id}/domains). Endpoint reality is enforced by
//   scripts/check-api-contract.mjs instead.
const EXCLUDE_DIRS = ['docs/api', 'docs/lens/api'];
// Per-file excludes for the route check (none currently needed).
const EXCLUDE_FILES = new Set([]);

// ---------- collect files ----------
const files = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/\.mdx?$/.test(e.name)) files.push(full);
  }
};
walk(path.join(ROOT, 'docs'));

const isExcluded = (rel) =>
  EXCLUDE_FILES.has(rel) || EXCLUDE_DIRS.some((d) => rel === d || rel.startsWith(d + '/'));

// ---------- route matching ----------
const isPlaceholder = (seg) =>
  /^\{.*\}$/.test(seg) || // {site_id}, {slug}
  /^\$\{.*\}$/.test(seg) || // ${site.id} (code samples)
  /^\[.*\]$/.test(seg) || // [siteId]
  /^(YOUR|MY|TEST)[_-]/i.test(seg) || // YOUR_SITE_ID
  /^<.*>$/.test(seg); // <site-id>

const routeSegs = manifest.routes.map((r) => (r === '/' ? [''] : r.split('/').slice(1)));
const routeExists = (docPath) => {
  const segs = docPath === '/' ? [''] : docPath.split('/').slice(1);
  return routeSegs.some(
    (route) =>
      route.length === segs.length &&
      route.every(
        (rseg, i) => /^\{.*\}$/.test(rseg) || rseg === segs[i] || isPlaceholder(segs[i]),
      ),
  );
};

const PATH_RE = /(^|[^\w/.$@[-])(\/(?:sites|settings|account|organizations)(?:\/[A-Za-z0-9_{}$.[\]<>-]+)*)/g;
// Full dashboard URLs are unambiguous (the host says it's the dashboard), so
// they are checked everywhere — including docs/api and code fences.
const DASHBOARD_URL_RE = /(?:my|app)\.sealmetrics\.(?:com|net)(\/(?:sites|settings|account|organizations)(?:\/[A-Za-z0-9_{}$.[\]<>-]+)*)/g;
const METHOD_BEFORE_RE = /(GET|POST|PUT|PATCH|DELETE)\s*$/;

const errors = [];
let routesChecked = 0;
let tabsChecked = 0;

for (const f of files) {
  const rel = path.relative(ROOT, f);
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  const skipRoutes = isExcluded(rel);
  let inFence = false;
  lines.forEach((line, i) => {
    const loc = `${rel}:${i + 1}`;
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      return;
    }

    // ---- (a) dashboard routes (prose + inline code; code fences are API/JS
    //      samples where these prefixes are REST paths, not dashboard URLs)
    if (!skipRoutes && !inFence) {
      for (const m of line.matchAll(PATH_RE)) {
        const docPath = m[2].replace(/[.,]+$/, '').replace(/\/+$/, '');
        const start = m.index + m[1].length;
        const before = line.slice(0, start);
        const after = line.slice(start + m[2].length);
        if (METHOD_BEFORE_RE.test(before)) continue; // REST endpoint, not a UI route
        if (after.startsWith('/*') || after.startsWith('*')) continue; // glob examples (/account/*)
        routesChecked += 1;
        if (process.env.DEBUG_UI_CLAIMS) console.log(`  · route ${docPath}  (${loc})`);
        if (!routeExists(docPath)) {
          errors.push(`${loc}: dashboard route "${docPath}" not found in ui-manifest.json routes`);
        }
      }
    }

    // ---- (a2) full dashboard URLs (my.sealmetrics.com/...)
    for (const m of line.matchAll(DASHBOARD_URL_RE)) {
      const docPath = m[1].replace(/[#?].*$/, '').replace(/[.,]+$/, '').replace(/\/+$/, '');
      routesChecked += 1;
      if (process.env.DEBUG_UI_CLAIMS) console.log(`  · url   ${docPath}  (${loc})`);
      if (!routeExists(docPath)) {
        errors.push(`${loc}: dashboard route "${docPath}" not found in ui-manifest.json routes`);
      }
    }

    // ---- (b) Site Settings tab claims
    if (/site settings|site's settings|site’s settings|settings\/sites/i.test(line)) {
      const tabLabels = new Set(manifest.siteSettingsTabs.map((t) => t.label.toLowerCase()));
      const claims = [
        ...line.matchAll(/\*\*([^*]+)\*\*\s+tab\b/gi),
        ...line.matchAll(/\btab\s+\*\*([^*]+)\*\*/gi),
      ];
      for (const c of claims) {
        // "**Site settings → Channels** tab" -> take the last arrow segment
        const label = c[1].split(/→|->/).pop().trim();
        tabsChecked += 1;
        if (!tabLabels.has(label.toLowerCase())) {
          errors.push(
            `${loc}: Site Settings tab "${label}" not found (tabs: ${manifest.siteSettingsTabs.map((t) => t.label).join(', ')})`,
          );
        }
      }
    }
  });
}

if (errors.length) {
  console.error(`\n✖ ${errors.length} UI claim(s) do not match the dashboard:\n`);
  for (const e of errors.sort()) console.error(`  ${e}`);
  console.error('\nFix the docs or refresh scripts/ui-manifest.json (see header).');
}
console.log(
  `\n${routesChecked} route mention(s) and ${tabsChecked} Site Settings tab claim(s) checked against ${manifest.routes.length} routes / ${manifest.siteSettingsTabs.length} tabs`,
);
process.exit(errors.length ? 1 : 0);
