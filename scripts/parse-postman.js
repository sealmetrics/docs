#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(path.join(__dirname, 'postman-collection.network-response'), 'utf8');
const doc = JSON.parse(raw);

function stripHtml(s = '') {
  return String(s).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

const endpoints = [];

function walk(items, folder) {
  for (const it of items || []) {
    if (Array.isArray(it.item)) {
      const nextFolder = folder ? `${folder} / ${it.name}` : it.name;
      walk(it.item, nextFolder);
      continue;
    }
    const req = it.request || {};
    const url = req.url || {};
    let rawUrl = '';
    if (typeof url === 'string') rawUrl = url;
    else if (url.raw) rawUrl = url.raw;
    else if (Array.isArray(url.path)) rawUrl = '/' + url.path.join('/');

    const method = (req.method || 'GET').toUpperCase();
    const description = stripHtml(req.description || it.description || '');

    // Query params
    const query = Array.isArray(url.query) ? url.query.map(q => ({
      key: q.key, value: q.value, disabled: !!q.disabled, description: stripHtml(q.description || '')
    })) : [];

    // Headers
    const headers = Array.isArray(req.header) ? req.header.map(h => ({
      key: h.key, value: h.value, disabled: !!h.disabled
    })) : [];

    // Body
    let bodyMode = null, bodyPreview = null;
    if (req.body) {
      bodyMode = req.body.mode;
      if (req.body.mode === 'raw') bodyPreview = (req.body.raw || '').slice(0, 800);
      else if (req.body.mode === 'formdata') bodyPreview = (req.body.formdata || []).map(f => `${f.key}${f.disabled ? '[disabled]' : ''}=${(f.value || f.src || '')}`).join('\n');
      else if (req.body.mode === 'urlencoded') bodyPreview = (req.body.urlencoded || []).map(f => `${f.key}=${f.value}`).join('&');
    }

    // Path elements to guess resource
    const pathParts = Array.isArray(url.path) ? url.path : [];
    const cleanPath = '/' + pathParts.join('/');

    endpoints.push({
      folder,
      name: it.name,
      method,
      rawUrl,
      cleanPath,
      query,
      headers,
      bodyMode,
      bodyPreview,
      description
    });
  }
}

walk(doc.item || []);

const summary = {
  collectionName: doc.info && doc.info.name,
  collectionDescription: stripHtml(doc.info && doc.info.description),
  totalEndpoints: endpoints.length,
  endpoints,
};

const outPath = path.join(__dirname, 'postman-endpoints.json');
fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
console.log(`Wrote ${endpoints.length} endpoints to ${outPath}`);

// Also print a human-readable summary
console.log('\n=== Folders / Endpoints ===');
const byFolder = {};
for (const e of endpoints) {
  const key = e.folder || '(root)';
  (byFolder[key] = byFolder[key] || []).push(`${e.method} ${e.cleanPath}  — ${e.name}`);
}
for (const [k, v] of Object.entries(byFolder)) {
  console.log(`\n[${k}]`);
  for (const line of v) console.log('  ' + line);
}
