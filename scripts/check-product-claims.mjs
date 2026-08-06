#!/usr/bin/env node
/**
 * Product claims check: the docs must never assert a capability Sealmetrics
 * doesn't have (scripts/capability-ledger.json).
 *
 * This is the prose counterpart to the two reference checks:
 *
 *   check-api-contract.mjs  does the endpoint exist?   (openapi-snapshot.json)
 *   check-ui-claims.mjs     does the screen exist?     (ui-manifest.json)
 *   check-product-claims.mjs  are we claiming something we can't do?
 *
 * Both existing checks passed while published pages claimed SSO, user journeys,
 * exit pages and IP-based geolocation — none of which is a broken reference.
 * That is the gap this closes.
 *
 * Scope: docs/**.mdx|md and blog/**.mdx|md.
 *
 * The check fails only on an AFFIRMATIVE claim. Three things keep it quiet:
 *
 *   1. Negation. A line that denies the capability ("does not track exit
 *      pages", "❌ No", "⚠️ API only") is always fine — saying what we don't
 *      do is exactly what we want the docs doing.
 *   2. Comparison tables. In a table with a Sealmetrics column, only that
 *      column is read. Competitors are free to have features we lack.
 *   3. The ledger's allow[] list, where every entry carries a reason.
 *
 * Any affirmative claim -> ERROR with file:line, exit 1.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LEDGER = path.join(__dirname, 'capability-ledger.json');
const SCOPES = ['docs', 'blog'];

const ledger = JSON.parse(fs.readFileSync(LEDGER, 'utf8'));

const capabilities = ledger.unsupported.map((c) => ({
  ...c,
  regexes: c.patterns.map((p) => new RegExp(p, 'i')),
  allowFiles: new Set((c.allow || []).map((a) => a.file)),
}));

// ---------- collect files ----------

const files = [];
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/\.mdx?$/.test(e.name)) files.push(full);
  }
};
for (const s of SCOPES) walk(path.join(ROOT, s));

// ---------- line classification ----------

// Words and glyphs that turn a mention into a denial or a qualification.
const NEGATION =
  /\b(?:no|not|never|none|without|cannot|can't|won't|don't|doesn't|isn't|aren't|lacks?|lacking|absent|unsupported|unavailable|excluded?|omits?|omitted|limited|only|partial|instead of|rather than|deliberately|by design)\b|n't\b|❌|⚠️|~~/i;

// Glyphs and words that make a table cell a positive claim.
const AFFIRMATIVE_CELL = /✅|\byes\b|\bincluded\b|\bsupported\b|\bnative\b|\bavailable\b/i;

// Other people's products. A line that names one is describing them, not us —
// "Self-hosted Matomo", "PrestaShop is self-hosted", "GA4 does cross-device".
// Comparison tables are already handled by column, so this is for prose.
const COMPETITOR =
  /\b(?:matomo|plausible|fathom|google analytics|GA4|universal analytics|adobe analytics|mixpanel|amplitude|piwik|umami|simple analytics|clicky|statcounter|hotjar|clarity|optimizely|VWO|prestashop|magento|opencart|bigcommerce|woocommerce|shopify|drupal|joomla|wordpress)\b/i;

const SEALMETRICS_SUBJECT = /\b(?:sealmetrics|seal metrics)\b/i;

const isTableRow = (line) => /^\s*\|/.test(line);
const isTableDivider = (line) => /^\s*\|[\s:|-]+\|?\s*$/.test(line);

const cellsOf = (line) =>
  line
    .replace(/^\s*\|/, '')
    .replace(/\|\s*$/, '')
    .split('|')
    .map((c) => c.trim());

/**
 * Which slice of the line actually speaks for Sealmetrics.
 *
 * In a comparison table we only care about the Sealmetrics column; a row like
 * `| User journeys | ✅ Business plan | ❌ No |` is correct even though it
 * contains a ✅. Outside a table, or in a table with no Sealmetrics column,
 * the whole line is our claim.
 *
 * Returns null when the row has a Sealmetrics column that doesn't mention the
 * capability at all — nothing to judge.
 */
function claimText(line, headerCells, capabilityRe) {
  if (!isTableRow(line) || !headerCells) return line;

  const ourColumn = headerCells.findIndex((h) => /sealmetrics/i.test(h));
  if (ourColumn === -1) return line;

  const cells = cellsOf(line);
  if (cells.length !== headerCells.length) return line; // ragged row, judge whole

  const ours = cells[ourColumn];
  const rowLabel = cells[0]; // the feature being compared

  // The capability may be named in the row label and answered in our column,
  // or named inside our column itself. Either way, our cell is the verdict.
  //
  // Deliberately does NOT look at the other columns: a pricing row reading
  // `| Price | $23/mo | Free (self-hosted) | $9/mo |` names self-hosting in a
  // competitor's cell, and that says nothing about us.
  if (capabilityRe.test(rowLabel) || capabilityRe.test(ours)) return ours;
  return null;
}

/**
 * Is this text asserting the capability, as opposed to denying or qualifying it?
 *
 * Table cells are terse ("✅ Yes", "❌ No", "⚠️ API only") so they are judged on
 * glyphs. Prose is judged on the absence of negation.
 */
function isAffirmative(text, {inTable}) {
  if (NEGATION.test(text)) return false;
  // A cell must say yes, not merely be non-empty — "Session-only" and
  // "$9/mo" are answers to a different question.
  if (inTable) return AFFIRMATIVE_CELL.test(text);
  // A heading that asks whether we support something is not a claim; the
  // answer beneath it is what matters, and that answer is its own line.
  if (/^\s*#{1,6}\s/.test(text) && /\?\s*$/.test(text)) return false;
  return true;
}

// ---------- scan ----------

const violations = [];

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const lines = fs.readFileSync(file, 'utf8').split('\n');

  let headerCells = null; // header row of the table we're inside, if any
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code fences are examples, not claims.
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    // Track table structure: a divider row confirms the line above was a header.
    if (isTableDivider(line) && i > 0 && isTableRow(lines[i - 1])) {
      headerCells = cellsOf(lines[i - 1]);
      continue;
    }
    if (!isTableRow(line)) headerCells = null;
    if (isTableRow(line) && headerCells && cellsOf(line).join('') === headerCells.join('')) continue;

    for (const cap of capabilities) {
      if (cap.allowFiles.has(rel)) continue;

      const hit = cap.regexes.find((re) => re.test(line));
      if (!hit) continue;

      const inComparisonTable = isTableRow(line) && headerCells !== null;

      // Someone else's product, described in prose. Not our claim.
      // (Comparison tables are resolved by column instead, below.)
      if (!inComparisonTable && COMPETITOR.test(line) && !SEALMETRICS_SUBJECT.test(line)) {
        continue;
      }

      // Capabilities nobody has ever wrongly claimed for us, but which appear
      // constantly when describing the wider market. Require us to be the
      // explicit subject before treating the line as a claim.
      if (cap.requiresSubject && !inComparisonTable && !SEALMETRICS_SUBJECT.test(line)) {
        continue;
      }

      const text = claimText(line, headerCells, hit);
      if (text === null) continue;

      if (isAffirmative(text, {inTable: isTableRow(line) && headerCells !== null})) {
        violations.push({
          file: rel,
          line: i + 1,
          capability: cap.label,
          id: cap.id,
          why: cap.why,
          text: line.trim().slice(0, 160),
        });
      }
    }
  }
}

// ---------- report ----------

const checked = files.length;
const capCount = capabilities.length;

if (violations.length === 0) {
  console.log(
    `${checked} pages checked against ${capCount} unsupported capabilities · no false product claims`,
  );
  process.exit(0);
}

console.error(
  `\n${violations.length} product claim(s) the docs can't support:\n`,
);

const byCapability = new Map();
for (const v of violations) {
  if (!byCapability.has(v.id)) byCapability.set(v.id, []);
  byCapability.get(v.id).push(v);
}

for (const [, group] of byCapability) {
  console.error(`  ${group[0].capability}`);
  console.error(`    why not: ${group[0].why}`);
  for (const v of group) {
    console.error(`    ${v.file}:${v.line}`);
    console.error(`      ${v.text}`);
  }
  console.error('');
}

console.error(
  'Fix the claim, or — if the page legitimately mentions the capability without\n' +
    'claiming it (a competitor\'s feature, a regulator\'s permitted-measures list) —\n' +
    'add the file to that capability\'s allow[] in scripts/capability-ledger.json\n' +
    'with a reason.\n',
);

process.exit(1);
