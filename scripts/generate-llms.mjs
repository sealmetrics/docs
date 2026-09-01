#!/usr/bin/env node

/**
 * Generates static/llms.txt and static/llms-full.txt from docs/ and blog/
 * content plus curated templates in scripts/llms-templates/.
 *
 * Every published page is indexed — the full docs tree (including guides,
 * web-analytics-prompts and the changelog) and every blog post.
 *
 * Usage: node scripts/generate-llms.mjs
 * No external dependencies — uses only node:fs and node:path.
 */

import { existsSync, readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, relative, extname, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const DOCS_DIR = join(ROOT, 'docs');
const BLOG_DIR = join(ROOT, 'blog');
const STATIC_DIR = join(ROOT, 'static');
const DOCS_RAW_DIR = join(STATIC_DIR, 'docs-raw');
const MARKDOWN_DIR = STATIC_DIR;
const TEMPLATES_DIR = join(__dirname, 'llms-templates');
const BASE_URL = 'https://docs.sealmetrics.com';

const MAX_FULL_SIZE = 4096 * 1024; // 4MB target — fits docs + blog untruncated (currently ~2.3MB) with room to grow
const MAX_CODE_BLOCK_LINES = 30;
const MAX_DOC_CHARS_INITIAL = 3000; // Layer 3 starting threshold
const MIN_DOC_CHARS = 500; // never truncate below this

// Sentinel used as the `topDir` of blog posts so they get their own section
const BLOG_SECTION = '__blog__';

// Section order — follows sidebars.ts, then the docs that live outside the
// sidebar (guides, changelog, root index) and finally the blog.
// Every docs/ directory must appear here; anything missed falls into "Other",
// which the build treats as a warning.
const SIDEBAR_ORDER = [
  { label: 'Introduction', dirName: null, docId: 'intro' },
  { label: 'Getting Started', dirName: 'getting-started' },
  { label: 'LENS AI', dirName: 'lens' },
  { label: 'Web Analytics Prompts', dirName: 'web-analytics-prompts' },
  { label: 'Reports & Insights', dirName: 'reports' },
  { label: 'Implementation', dirName: 'implementation' },
  { label: 'Integrations', dirName: 'integrations' },
  { label: 'API Reference', dirName: 'api' },
  { label: 'Security & Privacy', dirName: 'security-privacy' },
  { label: 'Compliance', dirName: 'compliance' },
  { label: 'Use Cases', dirName: 'use-cases' },
  { label: 'GA4 Migration', dirName: 'ga4-migration' },
  { label: 'Guides', dirName: 'guides' },
  { label: 'Platform Settings', dirName: 'platform' },
  { label: 'Plans & Billing', dirName: 'billing' },
  { label: 'Troubleshooting', dirName: 'troubleshooting' },
  { label: 'FAQ', dirName: 'faq' },
  { label: 'Release Notes', dirName: null, docId: 'changelog' },
  { label: 'Documentation Home', dirName: null, docId: 'index' },
  { label: 'Blog', dirName: BLOG_SECTION },
];

// ─── Frontmatter parser ─────────────────────────────────────────────────────

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { data: {}, content };

  const raw = match[1];
  const data = {};

  let lastScalarKey = null;

  for (const line of raw.split('\n')) {
    // Array items belong to the key above; we don't collect them here
    if (/^\s+-\s/.test(line)) {
      lastScalarKey = null;
      continue;
    }

    // Indented continuation of a folded scalar (YAML wraps long descriptions)
    if (/^\s+\S/.test(line)) {
      if (lastScalarKey && typeof data[lastScalarKey] === 'string') {
        data[lastScalarKey] = `${data[lastScalarKey]} ${line.trim()}`.trim();
      }
      continue;
    }

    const kv = line.match(/^(\w[\w_-]*)\s*:\s*(.*)/);
    if (!kv) {
      lastScalarKey = null;
      continue;
    }

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
      lastScalarKey = null;
      continue;
    }

    // Number
    if (/^\d+$/.test(value)) {
      data[key] = parseInt(value, 10);
      lastScalarKey = null;
      continue;
    }

    data[key] = value;
    lastScalarKey = key;
  }

  const body = content.slice(match[0].length).trim();
  return { data, content: body };
}

// ─── Visibility ──────────────────────────────────────────────────────────────

/**
 * Docusaurus renders `unlisted: true` and `draft: true` pages with
 * <meta name="robots" content="noindex, nofollow">, and keeps them out of the
 * sitemap. Mirroring them would hand AI engines a page we deliberately keep
 * out of search — llms.txt would advertise what the HTML says not to index.
 *
 * parseFrontmatter does no type coercion, so `true` arrives as the string
 * "true"; accept both.
 */
function isHidden(frontmatter) {
  const hidden = (value) => value === true || value === 'true';
  return hidden(frontmatter.unlisted) || hidden(frontmatter.draft);
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

  // Step 6: Drop trailing slashes from internal links. The site runs with
  // trailingSlash: false, so /lens/ is a 404 while /lens is the real page.
  // Docusaurus normalises these when rendering, but the raw mirrors are read
  // directly by crawlers and LLMs, where the trailing slash is followed as-is.
  text = text.replace(/\]\((\/[A-Za-z0-9/_-]+)\/\)/g, ']($1)');

  // Step 7: Restore code blocks
  text = text.replace(/__CODE_BLOCK_(\d+)__/g, (_, idx) => codeBlocks[parseInt(idx)]);

  // Step 8: Clean up excessive blank lines (3+ → 2)
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

/**
 * Resolve the public route for a doc, mirroring Docusaurus' own rules:
 *  - a frontmatter `slug` starting with "/" is absolute from the docs root;
 *    any other slug is relative to the document's own directory;
 *  - a frontmatter `id` replaces the filename-derived last segment;
 *  - numeric ordering prefixes ("01-", "02_") are stripped from every segment.
 * Getting any of these wrong emits a canonical URL that 404s.
 */
function docPathToUrl(filePath, slug, id) {
  const stripOrderPrefix = (segment) => segment.replace(/^\d+[-_.]/, '');
  const rel = relative(DOCS_DIR, filePath);
  const dir = dirname(rel);
  const dirSegments = dir === '.' ? [] : dir.split('/').map(stripOrderPrefix);

  const build = (segments) => {
    const path = segments.filter(Boolean).join('/');
    return path ? `${BASE_URL}/${path}` : BASE_URL;
  };

  if (slug) {
    if (slug.startsWith('/')) return build([slug.slice(1)]);
    return build([...dirSegments, slug.replace(/^\.\//, '')]);
  }

  // `id` overrides the file's own segment but keeps its directory.
  if (id) return build([...dirSegments, id]);

  let name = stripOrderPrefix(basename(rel).replace(/\.(mdx?|md)$/, ''));
  // index files resolve to their parent directory
  if (name === 'index') return build(dirSegments);
  return build([...dirSegments, name]);
}

function discoverDocs() {
  const docs = [];

  for (const filePath of walkDir(DOCS_DIR)) {
    const raw = readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = parseFrontmatter(raw);
    if (isHidden(frontmatter)) continue;
    const rel = relative(DOCS_DIR, filePath);

    // Determine category directory
    const parts = rel.split('/');
    const topDir = parts.length > 1 ? parts[0] : null;

    docs.push({
      filePath,
      relativePath: rel,
      rawRelPath: rel.replace(/\.(mdx?|md)$/, '.txt'),
      topDir,
      url: docPathToUrl(filePath, frontmatter.slug, frontmatter.id),
      title: frontmatter.title || basename(filePath, extname(filePath)),
      description: frontmatter.description || '',
      sidebarPosition: typeof frontmatter.sidebar_position === 'number'
        ? frontmatter.sidebar_position : 999,
      rawContent: content,
      cleanContent: stripMdx(content),
    });
  }

  docs.push(...discoverBlogPosts());

  return docs;
}

// ─── Blog discovery ──────────────────────────────────────────────────────────

/**
 * Blog posts live outside the docs tree and are routed by their frontmatter
 * `slug` under /blog/. They carry a `date` rather than a `sidebar_position`,
 * so they're ordered newest-first.
 */
function discoverBlogPosts() {
  const posts = [];

  for (const filePath of walkDir(BLOG_DIR)) {
    const raw = readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = parseFrontmatter(raw);
    if (isHidden(frontmatter)) continue;
    const name = basename(filePath, extname(filePath));

    // Strip a leading YYYY-MM-DD- prefix when there's no explicit slug
    const slug = frontmatter.slug || name.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    const date = String(frontmatter.date || '').replace(/['"]/g, '');

    posts.push({
      filePath,
      relativePath: relative(BLOG_DIR, filePath),
      rawRelPath: join('blog', relative(BLOG_DIR, filePath)).replace(/\.(mdx?|md)$/, '.txt'),
      topDir: BLOG_SECTION,
      url: `${BASE_URL}/blog/${slug}`,
      title: frontmatter.title || name,
      description: frontmatter.description || '',
      // Newest first: sort key is the inverse of the date string
      sidebarPosition: date ? -Number(date.replace(/-/g, '')) : 0,
      rawContent: content,
      cleanContent: stripMdx(stripTruncateMarker(content)),
    });
  }

  return posts;
}

/** Docusaurus `<!--truncate-->` marks the excerpt boundary; it isn't content. */
function stripTruncateMarker(content) {
  return content.replace(/^\s*<!--\s*truncate\s*-->\s*$/gm, '');
}

// ─── Organize by sidebar ─────────────────────────────────────────────────────

function organizeBySidebar(docs) {
  const sections = [];

  for (const section of SIDEBAR_ORDER) {
    let sectionDocs;

    if (section.docId) {
      // Single doc at the docs root (intro, changelog, index)
      sectionDocs = docs.filter(d =>
        d.topDir === null && (
          d.relativePath === `${section.docId}.mdx` ||
          d.relativePath === `${section.docId}.md`
        )
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

// ─── Raw doc path helper ─────────────────────────────────────────────────────

function docRawUrl(doc) {
  return `${BASE_URL}/docs-raw/${doc.rawRelPath}`;
}

function docMarkdownUrl(doc) {
  const pathname = new URL(doc.url).pathname.replace(/\/$/, '');
  return `${BASE_URL}${pathname || '/index'}.md`;
}

// ─── Generate docs-raw/ individual text files ────────────────────────────────

function generateDocsRaw(docs) {
  let count = 0;
  for (const doc of docs) {
    const outPath = join(DOCS_RAW_DIR, doc.rawRelPath);

    mkdirSync(dirname(outPath), { recursive: true });

    const header = `# ${doc.title}\n\nURL: ${doc.url}\n\n`;
    writeFileSync(outPath, header + doc.cleanContent, 'utf-8');
    count++;
  }
  return count;
}

// ─── Generate public Markdown mirrors ───────────────────────────────────────

function markdownType(doc) {
  if (doc.topDir === BLOG_SECTION) return 'blog';
  if (doc.topDir === 'api') return 'api-reference';
  if (doc.topDir === 'implementation' || doc.topDir === 'integrations') return 'implementation';
  if (doc.topDir === 'security-privacy' || doc.topDir === 'compliance') return 'trust-and-legal';
  return 'documentation';
}

function markdownOwner(type) {
  return type === 'trust-and-legal' ? 'legal' : type === 'api-reference' || type === 'implementation' ? 'engineering' : type === 'blog' ? 'content' : 'docs';
}

function markdownPriority(type, doc) {
  if (type === 'api-reference' || type === 'implementation' || type === 'trust-and-legal' || doc.relativePath === 'intro.mdx' || doc.relativePath === 'index.mdx') return 'critical';
  return 'useful';
}

function sourceHash(doc, type) {
  return createHash('sha256')
    .update(JSON.stringify({
      route: new URL(doc.url).pathname,
      title: doc.title,
      description: doc.description,
      content_type: type,
      content: doc.cleanContent,
    }))
    .digest('hex');
}

function generateMarkdownMirrors(docs) {
  const manifestPath = join(STATIC_DIR, 'knowledge-manifest.json');
  let previousManifest = null;
  if (existsSync(manifestPath)) {
    try {
      previousManifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    } catch {
      previousManifest = null;
    }
  }
  const previousRoutes = new Map((previousManifest?.routes || []).map((entry) => [entry.route, entry]));
  const generatedAt = new Date().toISOString();
  const manifest = [];
  for (const doc of docs) {
    const pathname = new URL(doc.url).pathname.replace(/\/$/, '');
    const route = pathname || '/';
    const outputPath = join(MARKDOWN_DIR, `${route === '/' ? '/index' : route}.md`);
    mkdirSync(dirname(outputPath), { recursive: true });
    const type = markdownType(doc);
    const hash = sourceHash(doc, type);
    const previous = previousRoutes.get(route);
    const dateGenerated = previous?.source_hash === hash && previous.generated_at
      ? previous.generated_at
      : generatedAt;
    // The title is supplied by frontmatter and by the generated H1. Remove
    // the first authored H1 when a source document already has one so every
    // mirror has exactly one top-level heading.
    const escapedTitle = doc.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const body = doc.cleanContent
      .replace(/^# [^\n]*(?:\r?\n|$)/, '')
      .replace(new RegExp(`^# ${escapedTitle}\\s*$`, 'm'), '')
      .replace(/[ \t]+$/gm, '')
      .trim();
    const document = [
      '---',
      `title: ${JSON.stringify(doc.title)}`,
      `description: ${JSON.stringify(doc.description)}`,
      `canonical_url: ${JSON.stringify(doc.url)}`,
      'lang: "en"',
      `date_generated: ${JSON.stringify(dateGenerated)}`,
      `source_hash: ${JSON.stringify(hash)}`,
      `content_type: ${JSON.stringify(type)}`,
      `owner: ${JSON.stringify(markdownOwner(type))}`,
      `llm_priority: ${JSON.stringify(markdownPriority(type, doc))}`,
      `source_file: ${JSON.stringify(doc.relativePath)}`,
      'publisher: "Sealmetrics"',
      '---',
      '',
      `# ${doc.title}`,
      '',
      `Canonical page: ${doc.url}`,
      '',
      body,
      '',
    ].join('\n');
    writeFileSync(outputPath, document, 'utf-8');
    manifest.push({ route, canonical: doc.url, markdown: docMarkdownUrl(doc), title: doc.title, description: doc.description, content_type: type, owner: markdownOwner(type), llm_priority: markdownPriority(type, doc), source_file: doc.relativePath, source_hash: hash, generated_at: dateGenerated });
  }
  const allRoutesUnchanged = previousManifest
    && manifest.length === previousManifest.routes?.length
    && manifest.every((entry) => previousRoutes.get(entry.route)?.source_hash === entry.source_hash);
  const manifestGeneratedAt = allRoutesUnchanged && previousManifest.generated_at
    ? previousManifest.generated_at
    : generatedAt;
  writeFileSync(manifestPath, `${JSON.stringify({ generated_at: manifestGeneratedAt, routes: manifest }, null, 2)}\n`, 'utf-8');
  return manifest.length;
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
      parts.push(`- [${doc.title}](${docMarkdownUrl(doc)})${desc}`);
    }
    parts.push('');
  }

  // Curated examples and differentiators
  parts.push(loadTemplate('quick-examples.md'));
  parts.push(loadTemplate('differentiators.md'));

  // Pointer to the full-content variant so crawlers can discover it
  parts.push(
    '## Full Documentation\n\n' +
      `Complete page-by-page content in a single file: ${BASE_URL}/llms-full.txt\n` +
      'Each page above is available as a raw Markdown document at the linked `.md` URL.',
  );

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
  console.log('Generating docs-raw/, llms.txt and llms-full.txt...');
  console.log(`  Docs dir: ${DOCS_DIR}`);

  const docs = discoverDocs();
  const blogCount = docs.filter(d => d.topDir === BLOG_SECTION).length;
  console.log(`  Found ${docs.length} pages (${docs.length - blogCount} docs, ${blogCount} blog posts)`);

  const sections = organizeBySidebar(docs);
  console.log(`  Organized into ${sections.length} sections:`);
  for (const s of sections) {
    console.log(`    - ${s.label}: ${s.docs.length} docs`);
  }

  // Anything landing in "Other" means a new top-level directory was added
  // without a matching entry in SIDEBAR_ORDER — indexed, but ungrouped.
  const other = sections.find(s => s.label === 'Other');
  if (other) {
    console.warn(
      `  WARNING: ${other.docs.length} page(s) fell into "Other" — add their directory to SIDEBAR_ORDER:`,
    );
    for (const d of other.docs) console.warn(`    ${d.relativePath}`);
  }

  // Generate docs-raw/ individual text files
  const rawCount = generateDocsRaw(docs);
  console.log(`  docs-raw/: ${rawCount} text files generated`);

  const markdownCount = generateMarkdownMirrors(docs);
  console.log(`  Markdown mirrors: ${markdownCount} files generated`);

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
