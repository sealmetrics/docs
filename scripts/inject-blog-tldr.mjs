#!/usr/bin/env node
/**
 * Inserts a TL;DR blockquote (idempotent, marker-based) at the top of every
 * blog post body, sourced from the post's frontmatter `description`. Heavily
 * favored by AI summarizers (Perplexity, ChatGPT web, Google AI Overviews)
 * for passage-level citation.
 *
 * Insertion point preference:
 *   1. Right after `<!-- truncate -->` if present.
 *   2. Otherwise, right after the frontmatter (top of body).
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.resolve(__dirname, '..', 'blog');
const SKIP = new Set(['authors.yml', 'tags.yml']);

const START = '<!-- AUTO-TLDR:START -->';
const END = '<!-- AUTO-TLDR:END -->';

const splitFrontmatter = (raw) => {
  const m = raw.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
  if (!m) return null;
  return {fm: m[1], body: m[2]};
};

const getDescription = (fm) => {
  const quoted =
    fm.match(/^description:\s*"([^"]+)"/m) ||
    fm.match(/^description:\s*'([^']+)'/m);
  if (quoted) return quoted[1].replace(/\s+/g, ' ').trim();
  // Unquoted value, possibly YAML line-folded across indented continuation lines.
  const m = fm.match(/^description:\s*(.+(?:\n[ \t]+\S.*)*)$/m);
  if (!m) return null;
  return m[1].replace(/\s+/g, ' ').trim().replace(/^["']|["']$/g, '');
};

const renderBlock = (text) =>
  `${START}\n> **TL;DR** — ${text}\n${END}`;

const stripExisting = (body) => {
  // Also consume the block's surrounding blank lines so repeated runs
  // don't accumulate whitespace (idempotent).
  const re = new RegExp(
    `\\n*${escape(START)}[\\s\\S]*?${escape(END)}\\n*`,
    'g',
  );
  return body.replace(re, '\n');
};

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const insertBlock = (body, block) => {
  const cleaned = stripExisting(body);
  // Prefer inserting right after the post-truncate marker.
  if (cleaned.includes('<!-- truncate -->')) {
    return cleaned.replace(
      /(<!--\s*truncate\s*-->)\n*/,
      (_m, marker) => `${marker}\n\n${block}\n\n`,
    );
  }
  // Otherwise top of body: keep any leading MDX imports, drop blank lines,
  // then place the block. Left-trimming `rest` keeps this idempotent.
  const m = cleaned.match(/^(\s*(?:import[^\n]*\n)+)?([\s\S]*)$/);
  const imports = (m[1] || '').replace(/^\s+/, '').replace(/\n*$/, '');
  const rest = m[2].replace(/^\s+/, '');
  const prefix = imports ? `${imports}\n\n` : '';
  return `${prefix}\n${block}\n\n${rest}`;
};

let touched = 0;
for (const file of fs.readdirSync(BLOG_DIR)) {
  if (SKIP.has(file)) continue;
  if (!/\.(md|mdx)$/.test(file)) continue;
  const fp = path.join(BLOG_DIR, file);
  const raw = fs.readFileSync(fp, 'utf8');
  const split = splitFrontmatter(raw);
  if (!split) {
    console.log(`SKIP ${file} (no frontmatter)`);
    continue;
  }
  const desc = getDescription(split.fm);
  if (!desc) {
    console.log(`SKIP ${file} (no description)`);
    continue;
  }
  const newBody = insertBlock(split.body, renderBlock(desc));
  fs.writeFileSync(fp, split.fm + newBody);
  console.log(`OK   ${file}`);
  touched++;
}
console.log(`\nDone. ${touched} posts updated.`);
