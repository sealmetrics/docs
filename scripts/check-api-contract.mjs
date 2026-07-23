#!/usr/bin/env node
/**
 * API contract check: every endpoint documented under docs/api/ and
 * docs/lens/api/ must exist in the real API surface (scripts/openapi-snapshot.json).
 *
 * - Documented-but-nonexistent endpoint       -> ERROR (exit 1)
 * - curl example using an unknown query param -> ERROR (exit 1)
 * - Existing-but-undocumented endpoint        -> warning summary (exit 0)
 *
 * Snapshot format: paths -> { METHOD: [query_param_names] }.
 *
 * Refreshing the snapshot (from the sealmetrics2 repo, image built):
 *
 *   docker run --rm --entrypoint python -e ENVIRONMENT=development \
 *     -v "$SEALMETRICS2_REPO/api/src:/app/src:ro" sealmetrics2-api-1 -c "
 *   from sealmetrics_api.main import create_app
 *   import json
 *   spec = create_app().openapi()
 *   METHODS = ('get','post','put','patch','delete')
 *   paths = {}
 *   for p, ops in sorted(spec['paths'].items()):
 *       path_q = [x['name'] for x in ops.get('parameters', []) if x.get('in') == 'query']
 *       ms = {m.upper(): sorted(set(path_q + [x['name'] for x in op.get('parameters', []) if x.get('in') == 'query']))
 *             for m, op in sorted(ops.items()) if m.lower() in METHODS}
 *       if ms: paths[p] = ms
 *   print(json.dumps({'generated_from': 'sealmetrics_api ' + spec.get('info',{}).get('version','') + ' (main)', 'paths': paths}, indent=1))
 *   " > scripts/openapi-snapshot.json
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SNAPSHOT = path.join(__dirname, 'openapi-snapshot.json');
const SCOPES = ['docs/api', 'docs/lens/api'];
const METHODS = 'GET|POST|PUT|PATCH|DELETE';

// ---------- load spec ----------
const spec = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'));
const normalizePath = (p) =>
  p
    .replace(/^https?:\/\/[^/]+/, '')
    .replace(/^\/api\/v1/, '')
    .replace(/\{[^}]*\}/g, '{}')
    .replace(/\/+$/, '')
    .toLowerCase() || '/';

// spec.paths: { "/api/v1/...": { "GET": ["query","param","names"], ... } }
const specSet = new Set();
const specEntries = []; // {normPath, re, methods: {METHOD: Set(queryParams)}}
for (const [p, methodMap] of Object.entries(spec.paths)) {
  const normPath = normalizePath(p);
  const methods = {};
  for (const [m, qparams] of Object.entries(methodMap)) {
    specSet.add(`${m} ${normPath}`);
    methods[m] = new Set(qparams);
  }
  specEntries.push({
    normPath,
    re: new RegExp(
      '^' + normPath.replace(/[.*+?^$()[\]\\]/g, '\\$&').replace(/\{\}/g, '[^/]+') + '$',
    ),
    methods,
  });
}

// ---------- collect documented endpoints ----------
const files = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/\.mdx?$/.test(e.name)) files.push(full);
  }
};
SCOPES.forEach((s) => walk(path.join(ROOT, s)));
// migration-from-v1 documents the OLD v1 API on purpose (mapping table)
const EXCLUDED = new Set(['docs/api/migration-from-v1.mdx']);

const unescape = (s) => s.replace(/&#123;/g, '{').replace(/&#125;/g, '}');
// Endpoint mentions: headings, fenced http blocks, inline code, table cells.
const RE = new RegExp(
  `(?:^|[\`|\\s])(${METHODS})\\s+((?:https?://[^\\s\`|]+)?/[A-Za-z0-9_\\-{}/.&#;]*)`,
  'gm',
);

const documented = new Map(); // key -> [file:line]
for (const f of files) {
  if (EXCLUDED.has(path.relative(ROOT, f))) continue;
  const text = unescape(fs.readFileSync(f, 'utf8'));
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    for (const m of line.matchAll(RE)) {
      let p = m[2].replace(/[`|).,]+$/, '');
      // skip non-API paths (assets, site routes used in prose)
      if (/^\/(img|static|blog|docs)\b/.test(p)) continue;
      const key = `${m[1].toUpperCase()} ${normalizePath(p)}`;
      if (!documented.has(key)) documented.set(key, []);
      documented.get(key).push(`${path.relative(ROOT, f)}:${i + 1}`);
    }
  });
}

// ---------- compare ----------
// A documented endpoint matches if it equals a spec key exactly, or if a spec
// template matches it with {} standing for one concrete path segment (docs
// examples often use real values, e.g. /segments/organic-search/duplicate).
const matchesSpec = (key) => {
  if (specSet.has(key)) return true;
  const sp = key.indexOf(' ');
  const method = key.slice(0, sp);
  const p = key.slice(sp + 1);
  return specEntries.some((e) => e.methods[method] && e.re.test(p));
};

const missing = [];
for (const [key, locs] of documented) {
  if (!matchesSpec(key)) missing.push({key, locs});
}

// ---------- curl examples: validate query parameter names ----------
// Extracts `curl ... "https://<host>/api/v1/...?a=1&b=2"` lines and checks every
// query param name against the spec for that endpoint (template {} segments
// match concrete values, e.g. /webhooks/abc123/rotate-secret).
const CURL_URL_RE = /(?:^|\s)curl\s[^\n]*?(https?:\/\/[^\s"'`\\]+)/;
const CURL_METHOD_RE = /(?:-X|--request)\s+(GET|POST|PUT|PATCH|DELETE)/;

const findSpecEntry = (normPath) =>
  specEntries.find((e) => e.normPath === normPath) || specEntries.find((e) => e.re.test(normPath));

const paramErrors = [];
let curlChecked = 0;
for (const f of files) {
  if (EXCLUDED.has(path.relative(ROOT, f))) continue;
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (!/(^|\s)curl\s/.test(line)) return;
    const urlMatch = line.match(CURL_URL_RE);
    if (!urlMatch) return;
    const url = urlMatch[1];
    // only SealMetrics API URLs; skip everything without a query string
    if (!/sealmetrics\.[a-z]+\/api\//.test(url) || !url.includes('?')) return;
    curlChecked += 1;
    const loc = `${path.relative(ROOT, f)}:${i + 1}`;
    const [rawPath, rawQuery] = url.split(/\?(.*)/s);
    const normPath = normalizePath(rawPath);
    const entry = findSpecEntry(normPath);
    if (!entry) {
      paramErrors.push({loc, msg: `curl references unknown endpoint ${normPath}`});
      return;
    }
    const methodMatch = line.match(CURL_METHOD_RE);
    const method = methodMatch ? methodMatch[1] : 'GET';
    // explicit -X METHOD must exist for the endpoint; implied GET falls back to
    // the union of all methods (a bodyless `curl "url?..."` may continue with
    // -d on following lines, making it a POST).
    let allowed;
    if (entry.methods[method]) {
      allowed = entry.methods[method];
    } else if (methodMatch) {
      paramErrors.push({loc, msg: `curl uses ${method} but endpoint ${entry.normPath} only supports ${Object.keys(entry.methods).join(', ')}`});
      return;
    } else {
      allowed = new Set(Object.values(entry.methods).flatMap((s) => [...s]));
    }
    const query = rawQuery.split('#')[0].replace(/["'`\\].*$/, '');
    for (const pair of query.split('&')) {
      if (!pair) continue;
      const name = decodeURIComponent(pair.split('=')[0].trim());
      if (!name || name.startsWith('$')) continue; // shell interpolation
      if (!allowed.has(name)) {
        paramErrors.push({
          loc,
          msg: `unknown query param "${name}" for ${method} ${entry.normPath} (valid: ${[...allowed].sort().join(', ') || 'none'})`,
        });
      }
    }
  });
}
const documentedPaths = new Set([...documented.keys()]);
const undocumented = [...specSet].filter((k) => !documentedPaths.has(k)).sort();

if (missing.length) {
  console.error(`\n✖ ${missing.length} documented endpoint(s) do NOT exist in the API:\n`);
  for (const {key, locs} of missing.sort((a, b) => a.key.localeCompare(b.key))) {
    console.error(`  ${key}`);
    for (const l of locs.slice(0, 3)) console.error(`      ${l}`);
  }
  console.error('\nFix the docs or refresh scripts/openapi-snapshot.json (see header).');
}

if (paramErrors.length) {
  console.error(`\n✖ ${paramErrors.length} curl example issue(s) (query params vs API spec):\n`);
  for (const {loc, msg} of paramErrors) console.error(`  ${loc}\n      ${msg}`);
  console.error('\nFix the docs or refresh scripts/openapi-snapshot.json (see header).');
}

console.log(`\n${documented.size} endpoints documented · ${specSet.size} in API spec · ${curlChecked} curl example(s) query-param checked`);
console.log(`${undocumented.length} API endpoints not documented under docs/api (informational):`);
for (const k of undocumented.slice(0, 15)) console.log(`  - ${k}`);
if (undocumented.length > 15) console.log(`  … and ${undocumented.length - 15} more`);

process.exit(missing.length || paramErrors.length ? 1 : 0);
