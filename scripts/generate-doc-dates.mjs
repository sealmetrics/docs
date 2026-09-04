#!/usr/bin/env node
/**
 * Fecha de publicación de cada doc, sacada del primer commit que lo añadió.
 *
 * Docusaurus solo expone `lastUpdatedAt`. Sin `datePublished`, el TechArticle
 * dice cuándo se tocó la página pero no desde cuándo existe — y usar la de
 * modificación como si fuera de publicación sería declarar algo falso en un
 * site que se lee en revisiones de proveedor.
 *
 * El resultado se COMMITEA (src/data/doc-dates.json) en vez de calcularse en
 * cada build, porque `actions/checkout` clona con profundidad 1: en CI no hay
 * historia de la que sacar el primer commit. El script solo AÑADE entradas
 * que falten y nunca borra las existentes, así que:
 *   - en CI (sin historia) es un no-op y el mapa versionado manda;
 *   - en local con historia completa, rellena lo nuevo;
 *   - si un fichero se renombra, conserva su fecha original, que es la
 *     verdad editorial aunque git haya perdido el rastro.
 *
 * Uso: node scripts/generate-doc-dates.mjs
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_DIR = join(ROOT, 'docs');
const OUT = join(ROOT, 'src', 'data', 'doc-dates.json');

function hasGitHistory() {
  try {
    const shallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
      cwd: ROOT,
      encoding: 'utf-8',
    }).trim();
    return shallow === 'false';
  } catch {
    return false;
  }
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.mdx?$/.test(entry)) out.push(p);
  }
  return out;
}

function firstCommitDate(file) {
  try {
    const iso = execFileSync(
      'git',
      ['log', '--diff-filter=A', '--follow', '--format=%aI', '-1', '--', relative(ROOT, file)],
      { cwd: ROOT, encoding: 'utf-8' },
    ).trim();
    return iso ? new Date(iso).toISOString() : null;
  } catch {
    return null;
  }
}

const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf-8')) : {};

if (!hasGitHistory()) {
  console.log(
    `[doc-dates] clon sin historia (shallow): se conserva el mapa versionado (${Object.keys(existing).length} entradas).`,
  );
  process.exit(0);
}

const dates = { ...existing };
let added = 0;
for (const file of walk(DOCS_DIR)) {
  const key = relative(DOCS_DIR, file).replace(/\.mdx?$/, '');
  if (dates[key]) continue;
  const iso = firstCommitDate(file);
  if (iso) {
    dates[key] = iso;
    added += 1;
  }
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(dates, Object.keys(dates).sort(), 2)}\n`, 'utf-8');
console.log(`[doc-dates] ${Object.keys(dates).length} fechas (${added} nuevas) → src/data/doc-dates.json`);
