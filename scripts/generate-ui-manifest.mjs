#!/usr/bin/env node
/**
 * Generates scripts/ui-manifest.json from the dashboard source code:
 *   - routes:           App Router pages (src/app/** /page.tsx -> URL)
 *   - sidebar:          nav items from components/layout/sidebar.tsx
 *   - siteSettingsTabs: mounted TabsTrigger tabs in Site Settings
 *                       (app/(dashboard)/settings/sites/[siteId]/page.tsx)
 *
 * The manifest is committed and consumed by scripts/check-ui-claims.mjs (CI
 * runs the checker only — no dashboard checkout needed there).
 *
 * Refresh (from a machine with the dashboard repo checked out):
 *
 *   node scripts/generate-ui-manifest.mjs [/path/to/dashboard/src]
 *
 * Default dashboard src path: the sealmetrics2 worktree below.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DASHBOARD_SRC =
  '/Users/rafa/code/sealmetrics2/.claude/worktrees/vibrant-sammet-be5e3c/dashboard/src';
const dashboardSrc = path.resolve(process.argv[2] || DEFAULT_DASHBOARD_SRC);
const OUT = path.join(__dirname, 'ui-manifest.json');

if (!fs.existsSync(path.join(dashboardSrc, 'app'))) {
  console.error(`✖ dashboard src not found at ${dashboardSrc} (expected an app/ directory)`);
  console.error('  usage: node scripts/generate-ui-manifest.mjs [/path/to/dashboard/src]');
  process.exit(1);
}

// ---------- (a) App Router routes ----------
const pageFiles = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name === 'page.tsx') pageFiles.push(full);
  }
};
walk(path.join(dashboardSrc, 'app'));

const routes = pageFiles
  .map((f) => {
    const rel = path.relative(path.join(dashboardSrc, 'app'), path.dirname(f));
    const url =
      '/' +
      rel
        .split(path.sep)
        .filter((seg) => seg && !/^\(.*\)$/.test(seg)) // drop route groups (auth)/(dashboard)
        .map((seg) => seg.replace(/^\[(?:\.\.\.)?(.+)\]$/, '{$1}')) // [siteId] -> {siteId}
        .join('/');
    return url === '/' ? '/' : url.replace(/\/+$/, '');
  })
  .sort();

// ---------- (b) sidebar items ----------
const sidebarSource = fs.readFileSync(
  path.join(dashboardSrc, 'components/layout/sidebar.tsx'),
  'utf8',
);

// Section -> how the component resolves the final pathname (see sidebar.tsx).
const SECTIONS = [
  {decl: 'mainNavItems', section: 'analytics', prefix: '/sites/{siteId}'},
  {decl: 'myAccountItems', section: 'my-account', prefix: '/settings'},
  {decl: 'organizationItems', section: 'organization', prefix: '/settings'},
  {decl: 'siteConfigItems', section: 'site-config', prefix: '/settings'},
];

const normalizeHref = (href) =>
  href.replace(/\$\{orgSlug\}/g, '{slug}').replace(/\$\{siteId\}/g, '{siteId}').replace(/\$\{[^}]+\}/g, '{param}');

const sidebar = [];
{
  const lines = sidebarSource.split('\n');
  let current = null;
  for (const raw of lines) {
    const line = raw.trim();
    const decl = SECTIONS.find((s) => new RegExp(`\\b${s.decl}\\b.*=`).test(line));
    if (decl) current = decl;
    if (!current || line.startsWith('//')) continue;
    const m = line.match(/\{\s*label:\s*'([^']+)'\s*,\s*href:\s*(?:'([^']*)'|`([^`]*)`)/);
    if (!m) continue;
    const label = m[1];
    const href = normalizeHref(m[2] ?? m[3] ?? '');
    const absolute = /absolute:\s*true/.test(line);
    const resolvedPath = absolute ? href : `${current.prefix}${href}` || '/';
    sidebar.push({section: current.section, label, href, path: resolvedPath || '/settings'});
  }
}

// ---------- (c) Site Settings tabs ----------
const settingsPage = fs.readFileSync(
  path.join(dashboardSrc, 'app/(dashboard)/settings/sites/[siteId]/page.tsx'),
  'utf8',
);
const withoutJsxComments = settingsPage.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
const siteSettingsTabs = [];
for (const m of withoutJsxComments.matchAll(
  /<TabsTrigger\s+value="([^"]+)"[^>]*>([\s\S]*?)<\/TabsTrigger>/g,
)) {
  const label = m[2]
    .replace(/<[^>]*\/?>/g, ' ') // strip icon / nested JSX tags
    .replace(/\{[^}]*\}/g, ' ') // strip JSX expressions
    .replace(/\s+/g, ' ')
    .trim();
  siteSettingsTabs.push({value: m[1], label});
}

// ---------- write ----------
const manifest = {
  generated_with: 'scripts/generate-ui-manifest.mjs',
  generated_from: `dashboard src: ${dashboardSrc}`,
  routes,
  sidebar,
  siteSettingsTabs,
};
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 1) + '\n');
console.log(
  `✔ wrote ${path.relative(process.cwd(), OUT)} — ${routes.length} routes, ${sidebar.length} sidebar items, ${siteSettingsTabs.length} site-settings tabs`,
);
