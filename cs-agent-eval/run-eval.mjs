#!/usr/bin/env node
/**
 * cs-agent evaluation harness.
 *
 * Runs a set of golden question→expected-source cases (cases.jsonl) against the
 * Sealmetrics cs-agent and scores retrieval + answer quality. The goal is a
 * regression gate: run it before and after any change to the docs corpus, the
 * ingest pipeline, or the agent itself, and watch the score.
 *
 * Modes:
 *   node run-eval.mjs --check      Validate the golden set only (no agent call).
 *                                  Confirms every expected_source slug exists in
 *                                  docs/. Runnable today, no backend needed.
 *   node run-eval.mjs              Run all cases against the agent and score.
 *                                  Requires CS_AGENT_URL (see queryAgent below).
 *   node run-eval.mjs --category api        Filter to one category.
 *   node run-eval.mjs --lang es             Filter to one language.
 *   node run-eval.mjs --json report.json    Also write a JSON report.
 *
 * Env:
 *   CS_AGENT_URL       HTTP endpoint of the cs-agent query API (required to run).
 *   CS_AGENT_API_KEY   Optional bearer token, sent as Authorization if set.
 *   PASS_SOURCE_RECALL Min fraction of expected sources retrieved (default 0.5).
 *   PASS_FACT_COVERAGE Min fraction of fact groups present (default 0.6).
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..');
const DOCS = join(REPO, 'docs');
const BASE_URL = 'https://docs.sealmetrics.com';

const PASS_SOURCE_RECALL = Number(process.env.PASS_SOURCE_RECALL ?? 0.5);
const PASS_FACT_COVERAGE = Number(process.env.PASS_FACT_COVERAGE ?? 0.6);

// ─────────────────────────────────────────────────────────────────────────────
// AGENT ADAPTER — the one place you wire in the real cs-agent.
//
// Must return { answer: string, sources: string[] }. `sources` is whatever the
// agent cites (URLs, slugs, or file paths); scoring matches expected slugs as a
// substring against both `sources` and `answer`, so partial shapes still work.
//
// The default assumes a JSON POST { question } → { answer, sources }. Adjust the
// request body and response parsing to match your deployment.
// ─────────────────────────────────────────────────────────────────────────────
async function queryAgent(question) {
  const url = process.env.CS_AGENT_URL;
  if (!url) {
    throw new Error(
      'CS_AGENT_URL is not set. Point it at the cs-agent query endpoint, or run ' +
        '`node run-eval.mjs --check` to validate the golden set without the agent.',
    );
  }
  const headers = { 'content-type': 'application/json' };
  if (process.env.CS_AGENT_API_KEY) {
    headers.authorization = `Bearer ${process.env.CS_AGENT_API_KEY}`;
  }
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error(`agent HTTP ${res.status}`);
  const data = await res.json();
  // Tolerate a few common response shapes.
  const answer = data.answer ?? data.response ?? data.text ?? '';
  const sources =
    data.sources ?? data.citations ?? data.documents ?? data.context ?? [];
  return {
    answer: String(answer),
    sources: (Array.isArray(sources) ? sources : [sources])
      .map((s) => (typeof s === 'string' ? s : s?.url ?? s?.source ?? s?.id ?? ''))
      .filter(Boolean),
  };
}

// ─── Build the set of real doc slugs (mirrors Docusaurus routeBasePath '/') ───
function docSlugs() {
  const slugs = new Set();
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) { walk(p); continue; }
      if (!/\.(mdx?|md)$/.test(name)) continue;
      const raw = readFileSync(p, 'utf8');
      const fm = raw.match(/^---\n([\s\S]*?)\n---/);
      const slugLine = fm && fm[1].match(/^slug:\s*(.+)$/m);
      let slug;
      if (slugLine) {
        slug = slugLine[1].trim().replace(/^["']|["']$/g, '');
      } else {
        slug = '/' + relative(DOCS, p).replace(/\.(mdx?|md)$/, '').replace(/\/index$/, '');
      }
      if (!slug.startsWith('/')) slug = '/' + slug;
      slugs.add(slug.replace(/\/$/, ''));
    }
  };
  walk(DOCS);
  return slugs;
}

function loadCases() {
  const raw = readFileSync(join(__dirname, 'cases.jsonl'), 'utf8');
  return raw
    .split('\n')
    .filter((l) => l.trim())
    .map((l, i) => {
      try { return JSON.parse(l); }
      catch (e) { throw new Error(`cases.jsonl line ${i + 1}: ${e.message}`); }
    });
}

// ─── --check: validate the golden set against real slugs, no agent needed ─────
function checkCases(cases) {
  const slugs = docSlugs();
  let bad = 0;
  for (const c of cases) {
    const missing = (c.expected_sources || []).filter((s) => !slugs.has(s.replace(/\/$/, '')));
    if (missing.length) {
      bad++;
      console.log(`✗ ${c.id}: unknown expected_source(s): ${missing.join(', ')}`);
    }
  }
  console.log(
    bad === 0
      ? `✓ all ${cases.length} cases reference valid doc slugs`
      : `\n${bad} case(s) reference slugs that don't exist in docs/`,
  );
  return bad === 0 ? 0 : 1;
}

// ─── Scoring ──────────────────────────────────────────────────────────────────
function scoreCase(c, result) {
  const hay = (result.answer + ' ' + result.sources.join(' ')).toLowerCase();
  const expected = c.expected_sources || [];
  const srcHits = expected.filter(
    (s) => hay.includes(s.toLowerCase()) || hay.includes((BASE_URL + s).toLowerCase()),
  );
  const sourceRecall = expected.length ? srcHits.length / expected.length : 1;

  const groups = c.must_include || [];
  const groupHits = groups.filter((g) =>
    (Array.isArray(g) ? g : [g]).some((syn) => hay.includes(String(syn).toLowerCase())),
  );
  const factCoverage = groups.length ? groupHits.length / groups.length : 1;

  const pass = sourceRecall >= PASS_SOURCE_RECALL && factCoverage >= PASS_FACT_COVERAGE;
  return { sourceRecall, factCoverage, pass, srcHits: srcHits.length, srcTotal: expected.length };
}

function pct(x) { return (x * 100).toFixed(0) + '%'; }

async function runCases(cases) {
  const results = [];
  for (const c of cases) {
    let r, err = null;
    try { r = await queryAgent(c.question); }
    catch (e) { err = e.message; r = { answer: '', sources: [] }; }
    const s = scoreCase(c, r);
    results.push({ ...c, ...s, err });
    const mark = err ? '⚠' : s.pass ? '✓' : '✗';
    console.log(
      `${mark} [${c.category}/${c.lang}] ${c.id}` +
        (err ? `  ERROR: ${err}` : `  src ${s.srcHits}/${s.srcTotal}  facts ${pct(s.factCoverage)}`),
    );
  }

  const passed = results.filter((r) => r.pass).length;
  const byCat = {};
  for (const r of results) {
    (byCat[r.category] ??= { pass: 0, total: 0 }).total++;
    if (r.pass) byCat[r.category].pass++;
  }
  console.log('\n── Scorecard ──');
  for (const [cat, v] of Object.entries(byCat).sort()) {
    console.log(`  ${cat.padEnd(16)} ${v.pass}/${v.total}  ${pct(v.pass / v.total)}`);
  }
  console.log(`  ${'OVERALL'.padEnd(16)} ${passed}/${results.length}  ${pct(passed / results.length)}`);

  const jsonIdx = process.argv.indexOf('--json');
  if (jsonIdx !== -1 && process.argv[jsonIdx + 1]) {
    writeFileSync(process.argv[jsonIdx + 1], JSON.stringify({ passed, total: results.length, byCat, results }, null, 2));
    console.log(`\nreport → ${process.argv[jsonIdx + 1]}`);
  }
  return passed === results.length ? 0 : 1;
}

// ─── main ─────────────────────────────────────────────────────────────────────
let cases = loadCases();
const catIdx = process.argv.indexOf('--category');
if (catIdx !== -1) cases = cases.filter((c) => c.category === process.argv[catIdx + 1]);
const langIdx = process.argv.indexOf('--lang');
if (langIdx !== -1) cases = cases.filter((c) => c.lang === process.argv[langIdx + 1]);

if (!cases.length) { console.error('no cases match the filter'); process.exit(1); }

const exit = process.argv.includes('--check')
  ? checkCases(cases)
  : await runCases(cases);
process.exit(exit);
