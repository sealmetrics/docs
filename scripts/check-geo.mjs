#!/usr/bin/env node
/**
 * GEO hygiene check (GEO-PLAN.md P3.1). One script for the silent failure
 * modes that make a page uncitable or make the LLM mirrors lie:
 *
 * ERRORS (exit 1):
 *   fence       an odd number of ``` lines in a page. Markdown swallows
 *               everything after an unclosed fence, so the rendered page and
 *               its llms mirror both lose their tail with no warning.
 *   stale-raw   static/docs-raw/<x>.txt or a generated static/<route>.md whose
 *               source page no longer exists. The generator only writes, never
 *               purges, so deleted pages kept serving at dead URLs for weeks.
 *               `--fix` deletes them.
 *   dup-title   two pages sharing a frontmatter title (an LLM citing
 *               "Webhooks - Sealmetrics Docs" cannot tell which one).
 *
 * WARNINGS (printed, exit 0 unless --strict):
 *   description frontmatter description outside 110-165 characters.
 *   lead        first body paragraph under 120 characters (a teaser, not an
 *               answer — see scripts/geo-score.mjs for the full score).
 *   no-links    a page with no outbound internal link.
 *
 * Usage: node scripts/check-geo.mjs [--fix] [--strict] [--verbose]
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const BLOG = path.join(ROOT, 'blog');
const STATIC = path.join(ROOT, 'static');
const RAW = path.join(STATIC, 'docs-raw');
const MANIFEST = path.join(STATIC, 'knowledge-manifest.json');

const FIX = process.argv.includes('--fix');
const STRICT = process.argv.includes('--strict');

const errors = [];
const warnings = [];

const walk = (dir, pred, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, pred, out);
    else if (pred(e.name)) out.push(full);
  }
  return out;
};
const isPage = (n) => /\.mdx?$/.test(n);
const rel = (p) => path.relative(ROOT, p);

const pages = [...walk(DOCS, isPage), ...walk(BLOG, isPage)];

// ---------- per-page checks ----------

const splitFm = (raw) => {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  return m ? {fm: m[1], body: m[2]} : {fm: '', body: raw};
};
const fmValue = (fm, key) => {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+(?:\\n[ \\t]+\\S.*)*)$`, 'm'));
  return m ? m[1].replace(/\s+/g, ' ').trim().replace(/^["']|["']$/g, '') : '';
};

function leadParagraph(body) {
  const lines = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<Head>[\s\S]*?<\/Head>/g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .split('\n');
  const para = [];
  let depth = 0;
  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      if (para.length) break;
      continue;
    }
    if (/^(import|export)\s/.test(t)) continue;
    if (/^</.test(t)) {
      depth += (t.match(/<[A-Za-z]/g) || []).length - (t.match(/<\/|\/>/g) || []).length;
      if (para.length) break;
      continue;
    }
    if (depth > 0) continue;
    if (/^(#|:::|---$|[-*]\s|\d+\.\s|\||>)/.test(t)) {
      if (para.length) break;
      continue;
    }
    para.push(t);
  }
  return para.join(' ').replace(/[*_`]/g, '');
}

const titles = new Map();
for (const file of pages) {
  const raw = fs.readFileSync(file, 'utf8');
  const r = rel(file);

  const fences = raw.split('\n').filter((l) => /^\s*```/.test(l)).length;
  if (fences % 2 !== 0) errors.push(`fence       ${r}: ${fences} fence lines (odd) — a code block is never closed`);

  const {fm, body} = splitFm(raw);
  const title = fmValue(fm, 'title');
  if (title && r.startsWith('docs/')) {
    if (!titles.has(title)) titles.set(title, []);
    titles.get(title).push(r);
  }

  const desc = fmValue(fm, 'description');
  if (desc && (desc.length < 110 || desc.length > 165)) {
    warnings.push(`description ${r}: ${desc.length} chars (want 110-165)`);
  }

  if (r.startsWith('docs/')) {
    const lead = leadParagraph(body);
    if (lead.length < 120) warnings.push(`lead        ${r}: first paragraph is ${lead.length} chars`);
    const prose = body.replace(/```[\s\S]*?```/g, '');
    const internal = (prose.match(/\]\(\/[^)\s]*\)|to=["']\/[^"']+["']|href=["']\/[^"']+["']/g) || []).length;
    if (internal === 0) warnings.push(`no-links    ${r}: no outbound internal link`);
  }
}
for (const [title, files] of titles) {
  if (files.length > 1) errors.push(`dup-title   "${title}" in ${files.join(', ')}`);
}

// ---------- stale mirrors ----------

const sourceExists = (stem) => {
  // stem like "api/webhooks" (docs) — or a blog slug
  for (const ext of ['.md', '.mdx']) {
    if (fs.existsSync(path.join(DOCS, stem + ext))) return true;
  }
  const base = path.basename(stem);
  const inBlog = walk(BLOG, isPage).some((f) => {
    const n = path.basename(f).replace(/\.mdx?$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
    return n === base || n === base.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  });
  return inBlog;
};

const stale = [];
for (const f of walk(RAW, (n) => n.endsWith('.txt'))) {
  const stem = path.relative(RAW, f).replace(/\.txt$/, '').replace(/^blog\//, '');
  if (!sourceExists(stem)) stale.push(f);
}

if (fs.existsSync(MANIFEST)) {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const routes = new Set(manifest.routes.map((x) => x.route));
  for (const f of walk(STATIC, (n) => n.endsWith('.md'))) {
    if (f.startsWith(RAW)) continue;
    const head = fs.readFileSync(f, 'utf8').slice(0, 2000);
    if (!/^source_file:/m.test(head)) continue; // hand-written, not a mirror
    let route = '/' + path.relative(STATIC, f).replace(/\.md$/, '');
    if (route.endsWith('/index')) route = route.slice(0, -'/index'.length) || '/';
    if (!routes.has(route)) stale.push(f);
  }
}

for (const f of stale) {
  if (FIX) {
    fs.unlinkSync(f);
    console.log(`[check-geo] removed stale mirror ${rel(f)}`);
  } else {
    errors.push(`stale-raw   ${rel(f)}: source page no longer exists (run with --fix to delete)`);
  }
}

// ---------- report ----------

const VERBOSE = process.argv.includes('--verbose') || STRICT;
if (VERBOSE) {
  for (const w of warnings) console.log(`warning  ${w}`);
} else if (warnings.length) {
  const byKind = new Map();
  for (const w of warnings) {
    const kind = w.split(/\s+/)[0];
    byKind.set(kind, (byKind.get(kind) || 0) + 1);
  }
  console.log(
    `[check-geo] warnings: ${[...byKind].map(([k, n]) => `${k} ${n}`).join(', ')} (run with --verbose to list)`,
  );
}
for (const e of errors) console.error(`ERROR    ${e}`);
console.log(
  `[check-geo] ${pages.length} pages · ${errors.length} error(s) · ${warnings.length} warning(s)`,
);
if (errors.length || (STRICT && warnings.length)) process.exit(1);
