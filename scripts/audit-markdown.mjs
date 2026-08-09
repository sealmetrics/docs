#!/usr/bin/env node
/** Validates Docusaurus Markdown mirrors against the generated manifest. */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const staticDir = path.join(root, 'static');
const manifest = JSON.parse(readFileSync(path.join(staticDir, 'knowledge-manifest.json'), 'utf8'));
const failures = [];
const seen = new Set();

for (const entry of manifest.routes) {
  if (seen.has(entry.route)) failures.push(`duplicate route: ${entry.route}`);
  seen.add(entry.route);
  const file = path.join(staticDir, entry.route === '/' ? 'index.md' : `${entry.route}.md`);
  if (!existsSync(file)) {
    failures.push(`${entry.route}: missing ${path.relative(staticDir, file)}`);
    continue;
  }
  const content = readFileSync(file, 'utf8');
  if (!content.startsWith('---\n')) failures.push(`${entry.route}: missing frontmatter`);
  const withoutCode = content.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  if ((withoutCode.match(/^# /gm) || []).length !== 1) failures.push(`${entry.route}: expected exactly one H1 outside code fences`);
  if (/<script\b|<style\b|\]\(\s*javascript:/i.test(withoutCode)) failures.push(`${entry.route}: unsafe script/style residue outside code fences`);
  if (!content.includes(`canonical_url: ${JSON.stringify(entry.canonical)}`)) failures.push(`${entry.route}: canonical mismatch`);
  if (!entry.owner || !entry.llm_priority) failures.push(`${entry.route}: missing ownership or priority metadata`);
}

console.log(`[audit-markdown] manifest routes: ${manifest.routes.length}`);
if (failures.length) {
  console.error(`[audit-markdown] ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log('[audit-markdown] 0 failures — documentation Markdown mirrors are complete.');
