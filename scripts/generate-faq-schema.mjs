#!/usr/bin/env node
/**
 * Parses each docs/faq/*.mdx (excluding index.mdx) and injects an
 * `<Head>` block with FAQPage JSON-LD between markers. Idempotent —
 * run again whenever Q/A content changes.
 *
 * Q/A extraction rules:
 *   - Each `## <text>` heading is treated as a Question.
 *   - Body is everything until the next `## ` heading or a `---` separator.
 *   - Empty answers are skipped.
 *   - Markdown is stripped to plain text for the JSON-LD `text` field.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FAQ_DIR = path.resolve(__dirname, '..', 'docs', 'faq');
const SKIP = new Set(['index.mdx', 'glossary.mdx']);

const START = '{/* AUTO-FAQ-SCHEMA:START */}';
const END = '{/* AUTO-FAQ-SCHEMA:END */}';

const stripMarkdown = (s) =>
  s
    .replace(/```[\s\S]*?```/g, '')          // fenced code
    .replace(/`([^`]+)`/g, '$1')              // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')     // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // links
    .replace(/^\s*[-*]\s+/gm, '')             // list bullets
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // bold/italic
    .replace(/^\s*>\s?/gm, '')                // blockquotes
    .replace(/\s+/g, ' ')
    .trim();

const parseFaq = (content) => {
  const lines = content.split('\n');
  const items = [];
  let q = null;
  let buf = [];
  const flush = () => {
    if (q !== null) {
      const a = stripMarkdown(buf.join('\n'));
      if (a) items.push({q: q.trim(), a});
    }
    q = null;
    buf = [];
  };
  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      flush();
      q = line.replace(/^##\s+/, '');
    } else if (/^---\s*$/.test(line)) {
      flush();
    } else if (q !== null) {
      buf.push(line);
    }
  }
  flush();
  return items;
};

const buildSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((it) => ({
    '@type': 'Question',
    name: it.q,
    acceptedAnswer: {'@type': 'Answer', text: it.a},
  })),
});

const splitFrontmatter = (raw) => {
  const m = raw.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
  if (!m) return {fm: '', body: raw};
  return {fm: m[1], body: m[2]};
};

const ensureHeadImport = (body) =>
  /from ['"]@docusaurus\/Head['"]/.test(body)
    ? body
    : `\nimport Head from '@docusaurus/Head';\n${body}`;

const replaceBlock = (body, block) => {
  if (body.includes(START) && body.includes(END)) {
    return body.replace(
      new RegExp(`${escape(START)}[\\s\\S]*?${escape(END)}`),
      block,
    );
  }
  return ensureHeadImport(body).replace(
    /^(\s*import[^\n]*\n)*/,
    (imports) => `${imports}\n${block}\n`,
  );
};

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const renderBlock = (schema) =>
  `${START}\n<Head>\n  <script type="application/ld+json">\n    {${JSON.stringify(JSON.stringify(schema))}}\n  </script>\n</Head>\n${END}`;

let total = 0;
for (const file of fs.readdirSync(FAQ_DIR)) {
  if (!file.endsWith('.mdx') || SKIP.has(file)) continue;
  const fp = path.join(FAQ_DIR, file);
  const raw = fs.readFileSync(fp, 'utf8');
  const {fm, body} = splitFrontmatter(raw);
  const items = parseFaq(body);
  if (items.length === 0) {
    console.log(`SKIP ${file} (no Q/A)`);
    continue;
  }
  const schema = buildSchema(items);
  const block = renderBlock(schema);
  const newBody = replaceBlock(body, block);
  fs.writeFileSync(fp, fm + newBody);
  console.log(`OK   ${file}: ${items.length} Q/A → FAQPage schema`);
  total += items.length;
}
console.log(`\nDone. ${total} questions across ${fs.readdirSync(FAQ_DIR).filter((f) => f.endsWith('.mdx') && !SKIP.has(f)).length} pages.`);
