#!/usr/bin/env node
/**
 * API contract check: every endpoint documented under docs/api/ and
 * docs/lens/api/ must exist in the real API surface (scripts/openapi-snapshot.json).
 *
 * - Documented-but-nonexistent endpoint  -> ERROR (exit 1)
 * - Existing-but-undocumented endpoint   -> warning summary (exit 0)
 *
 * Refreshing the snapshot (from the sealmetrics2 repo, with the local stack up):
 *
 *   docker exec sealmetrics-api-1 python -c "
 *   from sealmetrics_api.main import create_app
 *   import json
 *   spec = create_app().openapi()
 *   slim = {p: sorted(m.upper() for m in ops if m.lower() in ('get','post','put','patch','delete'))
 *           for p, ops in sorted(spec['paths'].items())}
 *   print(json.dumps({'generated_from': 'sealmetrics_api ' + spec.get('info',{}).get('version',''), 'paths': slim}, indent=1))
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

const specSet = new Set();
for (const [p, methods] of Object.entries(spec.paths)) {
  for (const m of methods) specSet.add(`${m} ${normalizePath(p)}`);
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
const specPatterns = [...specSet].map((k) => ({
  key: k,
  re: new RegExp('^' + k.replace(/[.*+?^$()[\]\\]/g, '\\$&').replace(/\{\}/g, '[^/]+') + '$'),
}));
const matchesSpec = (key) => specSet.has(key) || specPatterns.some((p) => p.re.test(key));

const missing = [];
for (const [key, locs] of documented) {
  if (!matchesSpec(key)) missing.push({key, locs});
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

console.log(`\n${documented.size} endpoints documented · ${specSet.size} in API spec`);
console.log(`${undocumented.length} API endpoints not documented under docs/api (informational):`);
for (const k of undocumented.slice(0, 15)) console.log(`  - ${k}`);
if (undocumented.length > 15) console.log(`  … and ${undocumented.length - 15} more`);

process.exit(missing.length ? 1 : 0);
