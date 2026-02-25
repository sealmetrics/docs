#!/usr/bin/env node

/**
 * Generates static/llms.txt and static/llms-full.txt from docs/ content
 * and curated templates in scripts/llms-templates/.
 *
 * Usage: node scripts/generate-llms.mjs
 * No external dependencies — uses only node:fs and node:path.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const DOCS_DIR = join(ROOT, 'docs');
const STATIC_DIR = join(ROOT, 'static');
const TEMPLATES_DIR = join(__dirname, 'llms-templates');
const BASE_URL = 'https://docs.sealmetrics.com';

const MAX_FULL_SIZE = 200 * 1024; // 200KB target
const MAX_CODE_BLOCK_LINES = 30;
const MAX_DOC_CHARS_INITIAL = 3000; // Layer 3 starting threshold
const MIN_DOC_CHARS = 500; // never truncate below this

// Sidebar order — matches sidebars.ts exactly
const SIDEBAR_ORDER = [
  { label: 'Introduction', dirName: null, docId: 'intro' },
  { label: 'Getting Started', dirName: 'getting-started' },
  { label: 'LENS AI', dirName: 'lens' },
  { label: 'Reports & Insights', dirName: 'reports' },
  { label: 'Implementation', dirName: 'implementation' },
  { label: 'Integrations', dirName: 'integrations' },
  { label: 'API Reference', dirName: 'api' },
  { label: 'Security & Privacy', dirName: 'security-privacy' },
  { label: 'Compliance', dirName: 'compliance' },
  { label: 'Use Cases', dirName: 'use-cases' },
  { label: 'GA4 Migration', dirName: 'ga4-migration' },
  { label: 'Platform Settings', dirName: 'platform' },
  { label: 'Plans & Billing', dirName: 'billing' },
  { label: 'Troubleshooting', dirName: 'troubleshooting' },
  { label: 'FAQ', dirName: 'faq' },
];

// ─── Frontmatter parser ─────────────────────────────────────────────────────

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { data: {}, content };

  const raw = match[1];
  const data = {};

  for (const line of raw.split('\n')) {
    // Skip continuation lines (arrays, multiline values)
    if (/^\s+-\s/.test(line) || /^\s+\S/.test(line)) continue;

    const kv = line.match(/^(\w[\w_-]*)\s*:\s*(.*)/);
    if (!kv) continue;

    let [, key, value] = kv;
    value = value.trim();

    // Strip quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Inline array: [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      continue;
    }

    // Number
    if (/^\d+$/.test(value)) {
      data[key] = parseInt(value, 10);
      continue;
    }

    data[key] = value;
  }

  const body = content.slice(match[0].length).trim();
  return { data, content: body };
}

// ─── MDX/JSX stripper ────────────────────────────────────────────────────────

function stripMdx(content) {
  // Step 1: Protect code fences by replacing them with placeholders
  const codeBlocks = [];
  let text = content.replace(/^(```[^\n]*\n[\s\S]*?^```)/gm, (match) => {
    const idx = codeBlocks.length;
    codeBlocks.push(match);
    return `__CODE_BLOCK_${idx}__`;
  });

  // Step 2: Remove import/export statements
  text = text.replace(/^\s*import\s+.*$/gm, '');
  text = text.replace(/^\s*export\s+.*$/gm, '');

  // Step 3: Remove JSX blocks — match top-level HTML tags with their content
  // Repeatedly remove innermost tags first to handle nesting
  let prev;
  do {
    prev = text;
    // Remove self-closing tags: <Component ... />
    text = text.replace(/<[A-Za-z][A-Za-z0-9]*\b[^>]*\/>/g, '');
    // Remove <svg>...</svg> blocks (including multiline)
    text = text.replace(/<svg[\s\S]*?<\/svg>/gi, '');
    // Remove matched tag pairs (innermost first) — div, span, p, h1-h6, etc.
    text = text.replace(/<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>[\s\S]*?<\/\1>/g, (match, tag) => {
      // Keep markdown-like text content from <p>, <li> etc. if it's simple
      return '';
    });
  } while (text !== prev);

  // Step 4: Remove remaining JSX artifacts
  // Lines that are just JSX fragments: opening/closing tags, style objects, event handlers
  text = text.replace(/^\s*<\/?[A-Za-z][^>]*>\s*$/gm, '');
  text = text.replace(/^\s*style\s*=\s*\{\{[\s\S]*?\}\}\s*$/gm, '');
  text = text.replace(/^\s*on[A-Z]\w*=\{[^}]*\}\s*$/gm, '');
  text = text.replace(/^\s*\{\/\*.*?\*\/\}\s*$/gm, ''); // JSX comments
  text = text.replace(/^\s*[a-zA-Z]+\s*:\s*'[^']*',?\s*$/gm, ''); // CSS-in-JS properties
  text = text.replace(/^\s*\}\}\s*$/gm, ''); // closing }}
  text = text.replace(/^\s*>\s*$/gm, ''); // lone > on a line
  text = text.replace(/^\s*\)\s*$/gm, ''); // lone ) on a line

  // Step 5: Convert admonitions to plain text
  text = text.replace(/^:::([\w]+)(?:\s+.*)?$/gm, (_, type) => {
    return `**${type.charAt(0).toUpperCase() + type.slice(1)}:**`;
  });
  text = text.replace(/^:::\s*$/gm, '');

  // Step 6: Restore code blocks
  text = text.replace(/__CODE_BLOCK_(\d+)__/g, (_, idx) => codeBlocks[parseInt(idx)]);

  // Step 7: Clean up excessive blank lines (3+ → 2)
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

// ─── Truncate code blocks ────────────────────────────────────────────────────

function truncateCodeBlocks(content, url) {
  const lines = content.split('\n');
  const result = [];
  let inCode = false;
  let codeLines = 0;
  let truncated = false;

  for (const line of lines) {
    if (/^```/.test(line) && !inCode) {
      inCode = true;
      codeLines = 0;
      truncated = false;
      result.push(line);
      continue;
    }
    if (/^```/.test(line) && inCode) {
      inCode = false;
      if (truncated) {
        result.push(`// ... see full example at ${url}`);
      }
      result.push(line);
      continue;
    }

    if (inCode) {
      codeLines++;
      if (codeLines <= MAX_CODE_BLOCK_LINES) {
        result.push(line);
      } else if (!truncated) {
        truncated = true;
      }
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

// ─── Doc discovery ───────────────────────────────────────────────────────────

function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...walkDir(full));
    } else if (['.md', '.mdx'].includes(extname(entry))) {
      files.push(full);
    }
  }
  return files;
}

function docPathToUrl(filePath) {
  let rel = relative(DOCS_DIR, filePath);
  // Remove extension
  rel = rel.replace(/\.(mdx?|md)$/, '');
  // index files → parent directory
  if (rel.endsWith('/index') || rel === 'index') {
    rel = rel.replace(/\/?index$/, '');
  }
  if (!rel) return BASE_URL;
  return `${BASE_URL}/${rel}`;
}

function discoverDocs() {
  const files = walkDir(DOCS_DIR);
  const docs = [];

  for (const filePath of files) {
    const raw = readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = parseFrontmatter(raw);
    const rel = relative(DOCS_DIR, filePath);

    // Determine category directory
    const parts = rel.split('/');
    const topDir = parts.length > 1 ? parts[0] : null;

    docs.push({
      filePath,
      relativePath: rel,
      topDir,
      url: docPathToUrl(filePath),
      title: frontmatter.title || basename(filePath, extname(filePath)),
      description: frontmatter.description || '',
      sidebarPosition: typeof frontmatter.sidebar_position === 'number'
        ? frontmatter.sidebar_position : 999,
      rawContent: content,
      cleanContent: stripMdx(content),
    });
  }

  return docs;
}

// ─── Organize by sidebar ─────────────────────────────────────────────────────

function organizeBySidebar(docs) {
  const sections = [];

  for (const section of SIDEBAR_ORDER) {
    let sectionDocs;

    if (section.docId) {
      // Single doc (like intro)
      sectionDocs = docs.filter(d =>
        d.relativePath === `${section.docId}.mdx` ||
        d.relativePath === `${section.docId}.md`
      );
    } else {
      sectionDocs = docs.filter(d => d.topDir === section.dirName);
    }

    // Sort by sidebar_position
    sectionDocs.sort((a, b) => a.sidebarPosition - b.sidebarPosition);

    if (sectionDocs.length > 0) {
      sections.push({
        label: section.label,
        docs: sectionDocs,
      });
    }
  }

  // Catch any docs not in a known section (e.g. root changelog)
  const allCategorized = new Set(sections.flatMap(s => s.docs.map(d => d.filePath)));
  const uncategorized = docs.filter(d => !allCategorized.has(d.filePath));
  if (uncategorized.length > 0) {
    sections.push({
      label: 'Other',
      docs: uncategorized.sort((a, b) => a.sidebarPosition - b.sidebarPosition),
    });
  }

  return sections;
}

// ─── Load templates ──────────────────────────────────────────────────────────

function loadTemplate(name) {
  return readFileSync(join(TEMPLATES_DIR, name), 'utf-8').trim();
}

// ─── Generate llms.txt ───────────────────────────────────────────────────────

function generateLlmsTxt(sections) {
  const parts = [];

  // Curated header + instructions
  parts.push(loadTemplate('header.md'));
  parts.push(loadTemplate('instructions.md'));

  // Auto-generated documentation index
  parts.push('## Documentation\n');
  parts.push(`Base URL: ${BASE_URL}\n`);

  for (const section of sections) {
    parts.push(`### ${section.label}`);
    for (const doc of section.docs) {
      const desc = doc.description ? `: ${doc.description}` : '';
      parts.push(`- [${doc.title}](${doc.url})${desc}`);
    }
    parts.push('');
  }

  // Curated examples and differentiators
  parts.push(loadTemplate('quick-examples.md'));
  parts.push(loadTemplate('differentiators.md'));
  parts.push(loadTemplate('footer.md'));

  return parts.join('\n\n');
}

// ─── Generate llms-full.txt ──────────────────────────────────────────────────

function generateLlmsFullTxt(sections) {
  const parts = [];

  // Header
  parts.push(loadTemplate('header.md'));
  parts.push(loadTemplate('instructions.md'));

  // Full content for every doc
  for (const section of sections) {
    parts.push(`---\n\n# ${section.label}\n`);

    for (const doc of section.docs) {
      let content = truncateCodeBlocks(doc.cleanContent, doc.url);
      parts.push(`## ${doc.title}\n`);
      parts.push(`URL: ${doc.url}\n`);
      parts.push(content);
      parts.push('');
    }
  }

  // Footer
  parts.push(loadTemplate('differentiators.md'));
  parts.push(loadTemplate('footer.md'));

  let fullText = parts.join('\n\n');

  // Layer 3: If still over limit, calculate per-doc budget proportionally
  const currentSize = Buffer.byteLength(fullText, 'utf-8');
  if (currentSize > MAX_FULL_SIZE) {
    // Calculate overhead (templates + section headers + doc headers/URLs)
    const allDocs = sections.flatMap(s => s.docs);
    const totalContentChars = allDocs.reduce((sum, d) =>
      sum + truncateCodeBlocks(d.cleanContent, d.url).length, 0);
    const overhead = currentSize - totalContentChars;
    const contentBudget = MAX_FULL_SIZE * 0.95 - overhead; // 5% margin for truncation markers
    const ratio = Math.max(0.1, contentBudget / totalContentChars);

    console.log(`  Full text is ${(currentSize / 1024).toFixed(0)}KB (>${(MAX_FULL_SIZE / 1024).toFixed(0)}KB), applying proportional truncation (ratio: ${ratio.toFixed(2)})...`);

    const truncatedParts = [];
    truncatedParts.push(loadTemplate('header.md'));
    truncatedParts.push(loadTemplate('instructions.md'));

    for (const section of sections) {
      truncatedParts.push(`---\n\n# ${section.label}\n`);

      for (const doc of section.docs) {
        let content = truncateCodeBlocks(doc.cleanContent, doc.url);
        const limit = Math.max(MIN_DOC_CHARS, Math.round(content.length * ratio));
        if (content.length > limit) {
          // Try to truncate at a paragraph boundary
          let cutPoint = content.lastIndexOf('\n\n', limit);
          if (cutPoint < MIN_DOC_CHARS) cutPoint = limit;
          content = content.slice(0, cutPoint) + `\n\n... [Read full document at ${doc.url}]`;
        }
        truncatedParts.push(`## ${doc.title}\n`);
        truncatedParts.push(`URL: ${doc.url}\n`);
        truncatedParts.push(content);
        truncatedParts.push('');
      }
    }

    truncatedParts.push(loadTemplate('differentiators.md'));
    truncatedParts.push(loadTemplate('footer.md'));
    fullText = truncatedParts.join('\n\n');
    console.log(`  After truncation: ${(Buffer.byteLength(fullText, 'utf-8') / 1024).toFixed(1)}KB`);
  }

  return fullText;
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  console.log('Generating llms.txt and llms-full.txt...');
  console.log(`  Docs dir: ${DOCS_DIR}`);

  const docs = discoverDocs();
  console.log(`  Found ${docs.length} documents`);

  const sections = organizeBySidebar(docs);
  console.log(`  Organized into ${sections.length} sections:`);
  for (const s of sections) {
    console.log(`    - ${s.label}: ${s.docs.length} docs`);
  }

  // Generate llms.txt
  const llmsTxt = generateLlmsTxt(sections);
  writeFileSync(join(STATIC_DIR, 'llms.txt'), llmsTxt, 'utf-8');
  const llmsSize = Buffer.byteLength(llmsTxt, 'utf-8');
  console.log(`  llms.txt: ${(llmsSize / 1024).toFixed(1)}KB`);

  // Generate llms-full.txt
  const llmsFullTxt = generateLlmsFullTxt(sections);
  writeFileSync(join(STATIC_DIR, 'llms-full.txt'), llmsFullTxt, 'utf-8');
  const fullSize = Buffer.byteLength(llmsFullTxt, 'utf-8');
  console.log(`  llms-full.txt: ${(fullSize / 1024).toFixed(1)}KB`);

  console.log('Done!');
}

main();
