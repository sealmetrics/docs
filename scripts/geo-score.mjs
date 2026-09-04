#!/usr/bin/env node
/**
 * GEO (Generative Engine Optimisation) citability score per doc page.
 *
 * A cheap, deterministic proxy for "can an LLM lift a self-contained answer
 * from this page and attribute it?". It is not a ranking model; it is the
 * regression guard for GEO-PLAN.md P1.4 so the answer-first work does not
 * silently decay. Scores 0-100 from seven signals:
 *
 *   definition   20  first body paragraph is >= 120 chars and reads like an
 *                    answer ("X is ...", "X needs ...", a number, or a verb in
 *                    the first 12 words) — not a teaser ("Learn how...").
 *   question-h2  15  at least one H2/H3 phrased as a question.
 *   summary      15  an "In short" / "Key takeaways" / "TL;DR" / "Summary" block.
 *   structure    10  at least one table or list.
 *   sources      15  >= 2 external links (non-sealmetrics https), i.e. claims
 *                    a reader can verify.
 *   description  10  frontmatter description between 110 and 165 chars.
 *   paragraphs   15  average prose paragraph under 90 words.
 *
 * Usage:
 *   node scripts/geo-score.mjs                 # all docs, prints a table
 *   node scripts/geo-score.mjs docs/faq/*.mdx  # selected files
 *   node scripts/geo-score.mjs --json out.json # also write the scores
 *   node scripts/geo-score.mjs --min 60        # exit 1 if any scored file is below
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
let jsonOut = null;
let min = null;
const files = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--json') jsonOut = args[++i];
  else if (args[i] === '--min') min = Number(args[++i]);
  else files.push(args[i]);
}

const walk = (dir, out) => {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (/\.mdx?$/.test(e.name)) out.push(full);
  }
  return out;
};

const targets = files.length
  ? files.map((f) => path.resolve(ROOT, f))
  : walk(path.join(ROOT, 'docs'), []);

const stripFences = (s) => s.replace(/```[\s\S]*?```/g, '');

function bodyOf(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  return {fm: m ? m[1] : '', body: m ? m[2] : raw};
}

function description(fm) {
  const m = fm.match(/^description:\s*(.+(?:\n[ \t]+\S.*)*)$/m);
  if (!m) return '';
  return m[1].replace(/\s+/g, ' ').trim().replace(/^["']|["']$/g, '');
}

function firstParagraph(body) {
  // Drop imports, JSX blocks, admonition fences, headings, comments, markers.
  const lines = stripFences(body)
    .replace(/<Head>[\s\S]*?<\/Head>/g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .split('\n');
  const para = [];
  let inJsx = 0;
  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      if (para.length) break;
      continue;
    }
    if (/^import\s/.test(t) || /^export\s/.test(t)) continue;
    if (/^#/.test(t) || /^:::/.test(t) || /^---$/.test(t)) {
      if (para.length) break;
      continue;
    }
    if (/^</.test(t)) {
      inJsx += (t.match(/</g) || []).length - (t.match(/<\//g) || []).length * 2;
      if (para.length) break;
      continue;
    }
    if (inJsx > 0) continue;
    if (/^[-*]\s/.test(t) || /^\|/.test(t) || /^\d+\.\s/.test(t)) {
      if (para.length) break;
      continue;
    }
    para.push(t);
  }
  return para.join(' ').replace(/[*_`]/g, '');
}

const TEASER = /^(learn|explore|discover|this (page|section|guide|document) (covers|explains|describes|walks)|welcome|find out|read on)/i;
const ANSWERISH = /\b(is|are|means|needs?|requires?|takes?|uses?|works?|captures?|records?|stores?|measures?|does|do|can|cannot|holds?|runs?|lets?|allows?|adds?|fires?|returns?|explains?)\b|\d/;

function score(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const {fm, body} = bodyOf(raw);
  const prose = stripFences(body);
  const desc = description(fm);
  const p1 = firstParagraph(body);
  const first12 = p1.split(/\s+/).slice(0, 12).join(' ');

  const s = {};
  s.definition = p1.length >= 120 && !TEASER.test(p1) && ANSWERISH.test(first12) ? 20 : 0;
  s.questionH2 = /^#{2,3}\s.*\?\s*(?:\{#[^}]+\}\s*)?$/m.test(prose) ? 15 : 0;
  s.summary = /^(:::\w+\s+(in short|key takeaways|tl;dr|summary|at a glance)|#{2,3}\s+(in short|key takeaways|tl;dr|summary|at a glance))/im.test(prose) ? 15 : 0;
  s.structure = /^\s*\|.*\|\s*$/m.test(prose) || /^\s*([-*]|\d+\.)\s+\S/m.test(prose) ? 10 : 0;
  const ext = (prose.match(/https?:\/\/[^\s)>\]"']+/g) || []).filter((u) => !/sealmetrics\.com/i.test(u));
  s.sources = new Set(ext).size >= 2 ? 15 : 0;
  s.description = desc.length >= 110 && desc.length <= 165 ? 10 : 0;
  const paras = prose
    .replace(/<[^>]+>/g, '')
    .split(/\n\s*\n/)
    .map((x) => x.trim())
    .filter((x) => x && !/^(#|[-*]\s|\||:::|\d+\.\s|import|export|\{)/.test(x));
  const avgWords = paras.length
    ? paras.reduce((a, p) => a + p.split(/\s+/).length, 0) / paras.length
    : 0;
  s.paragraphs = avgWords > 0 && avgWords < 90 ? 15 : 0;

  const total = Object.values(s).reduce((a, b) => a + b, 0);
  return {file: path.relative(ROOT, file), total, signals: s, firstParagraphChars: p1.length, descriptionChars: desc.length, avgParagraphWords: Math.round(avgWords)};
}

const results = targets
  .filter((f) => fs.existsSync(f))
  .map(score)
  .sort((a, b) => a.total - b.total);

const width = Math.max(...results.map((r) => r.file.length));
for (const r of results) {
  const miss = Object.entries(r.signals)
    .filter(([, v]) => v === 0)
    .map(([k]) => k)
    .join(',');
  console.log(`${String(r.total).padStart(3)}  ${r.file.padEnd(width)}  missing: ${miss || '-'}`);
}
const avg = results.length ? Math.round(results.reduce((a, r) => a + r.total, 0) / results.length) : 0;
console.log(`\n[geo-score] ${results.length} pages, average ${avg}/100`);

if (jsonOut) {
  fs.writeFileSync(path.resolve(ROOT, jsonOut), JSON.stringify({generated_at: new Date().toISOString(), average: avg, pages: results}, null, 2) + '\n');
  console.log(`[geo-score] wrote ${jsonOut}`);
}

if (min !== null) {
  const below = results.filter((r) => r.total < min);
  if (below.length) {
    console.error(`[geo-score] ${below.length} page(s) below ${min}`);
    process.exit(1);
  }
}
