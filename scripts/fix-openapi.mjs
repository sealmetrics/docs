#!/usr/bin/env node
/**
 * Corrective pass over the published OpenAPI document (static/openapi.json).
 *
 * The document is currently hand-maintained: it was exported from the FastAPI app
 * once and committed, with no command to refresh it. Until the API generates and
 * serves it, this script applies the corrections that can be verified from
 * outside the API. Re-run it after every re-export — it is idempotent.
 *
 *  1. servers[0].url            — was ".../api" while every path already starts
 *                                 "/api/v1", so servers+path produced "/api/api/v1".
 *  2. root `security`           — referenced "bearerAuth"/"apiKeyAuth", which are
 *                                 not defined; the real schemes are "HTTPBearer"
 *                                 and "APIKeyHeader" (redocly `security-defined`).
 *  3. phantom paths             — 16 paths that return 404 in production. Each one
 *                                 was probed live before being listed here.
 *  4. /api/v1/admin/*           — superadmin surface, removed from the PUBLIC spec.
 *  5. security: []              — declared explicitly on the genuinely public ops.
 *  6. error responses           — 401/403/404/429/500/503 declared against a shared
 *                                 ErrorResponse schema matching the live envelope
 *                                 (redocly `operation-4xx-response`).
 *  7. top-level `tags`          — descriptions + per-tag externalDocs, and one
 *                                 casing convention across all operations.
 *  8. info.contact / termsOfService.
 *
 * Idempotent: safe to re-run. Run `npm run fix:openapi`, then regenerate the YAML
 * twin with `npx @redocly/cli bundle static/openapi.json -o static/openapi.yaml`.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SPEC = path.join(ROOT, 'static/openapi.json');
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

const DOCS = 'https://docs.sealmetrics.com';

/** Paths verified to return 404 on https://my.sealmetrics.com (2026-07-31). */
const PHANTOM_PATHS = [
  '/api/v1/lens/custom-rules',
  '/api/v1/lens/custom-rules/parse',
  '/api/v1/lens/custom-rules/prompt',
  '/api/v1/lens/custom-rules/prompt/test',
  '/api/v1/lens/custom-rules/templates',
  '/api/v1/lens/custom-rules/templates/{template_id}',
  '/api/v1/lens/custom-rules/{rule_id}',
  '/api/v1/lens/custom-rules/{rule_id}/explain',
  '/api/v1/lens/custom-rules/{rule_id}/test',
  '/api/v1/lens/custom-rules/{rule_id}/toggle',
  '/api/v1/settings/llm',
  '/api/v1/settings/llm/providers',
  '/api/v1/settings/llm/test',
  '/api/v1/migration/preview',
  '/api/v1/migration/quick-preview',
  '/api/v1/admin/impersonate',
];

/** Operations that are genuinely unauthenticated. */
const PUBLIC_OPS = new Set([
  'get /livez',
  'get /readyz',
  'get /health',
  'get /t.js',
  'post /api/v1/auth/token',
  'post /api/v1/auth/refresh',
  'post /api/v1/auth/forgot-password',
  'post /api/v1/auth/reset-password',
  'post /api/v1/auth/register',
  'post /api/v1/2fa/verify-login',
  'post /api/v1/email/verify',
  'get /api/v1/shared-dashboards/public/{share_token}',
  'post /api/v1/shared-dashboards/public/{share_token}/access',
  'get /api/v1/exports/download/{download_token}',
  'get /api/v1/webhooks/event-types',
  'get /api/v1/invitations/{token}',
  'post /api/v1/invitations/accept',
]);

/** Paths the rate-limit middleware skips entirely (EXCLUDED_PATHS). */
const NO_RATE_LIMIT = new Set(['/health', '/livez', '/readyz', '/t.js']);

/** Old tag -> canonical tag. Keeps one casing convention across the document. */
const TAG_RENAME = {
  admin: 'Admin',
  aggregate: 'Aggregate Stats',
  'api-tokens': 'API Tokens',
  assistant: 'Assistant',
  audit: 'Audit',
  auth: 'Authentication',
  'blocklist-ips': 'Blocklist IPs',
  'bot-stats': 'Bot Stats',
  'channel-groups': 'Channel Groups',
  'email-verification': 'Email Verification',
  health: 'Health',
  invitations: 'Invitations',
  'ip-allowlist': 'IP Allowlist',
  maintenance: 'Maintenance',
  migration: 'Migration',
  organizations: 'Organizations',
  'passthrough-referrers': 'Passthrough Referrers',
  'referrer-mappings': 'Referrer Mappings',
  registration: 'Registration',
  'saved-pixels': 'Saved Pixels',
  segments: 'Segments',
  sites: 'Sites',
  stats: 'Stats',
  tracker: 'Tracker',
  'two-factor': 'Two-Factor Auth',
  users: 'Users',
};

/** description + docs page for each canonical tag. */
const TAG_META = {
  Stats: ['Analytics reports: traffic, conversions, attribution, audience and content.', '/api/stats'],
  'Aggregate Stats': ['Portfolio metrics rolled up across several sites in one call.', '/api/stats-aggregate'],
  Sites: ['Create and manage sites, authorized domains, UTM mappings and the tracking pixel.', '/api/sites'],
  Organizations: ['Organizations, members, roles and invitations.', '/api/organizations'],
  Authentication: ['Login, refresh, sessions, password reset and the current user.', '/api/authentication'],
  'API Tokens': ['Read-only personal API tokens with scopes, site restrictions and expiry.', '/api/api-tokens'],
  'Two-Factor Auth': ['TOTP second factor: enable, verify, disable and backup codes.', '/api/2fa'],
  'Email Verification': ['Post-registration email confirmation flow.', '/api/email-verification'],
  Registration: ['Account registration.', '/api/authentication'],
  Invitations: ['Accept and inspect organization invitations.', '/api/invitations'],
  Segments: ['Saved segments and the filter grammar used across stats endpoints.', '/api/segments'],
  Batch: ['Run up to 50 analytics queries in one request, with dependency ordering.', '/api/batch'],
  Exports: ['Asynchronous bulk export jobs, streaming exports and download tokens.', '/api/exports'],
  Webhooks: ['Webhook endpoints, event types, deliveries, replay and signature rotation.', '/api/webhooks'],
  Alerts: ['Alert rules, history and statistics.', '/api/alerts'],
  'Email Reports': ['Scheduled email reports.', '/api/email-reports'],
  'Shared Dashboards': ['Public share links and embeds for dashboards.', '/api/shared-dashboards'],
  'IP Allowlist': ['Restrict API access to a set of IP patterns.', '/api/ip-allowlist'],
  'Blocklist IPs': ['Exclude IPs from being tracked.', '/api/blocklist-ips'],
  'Channel Groups': ['Custom channel grouping rules with a drafts/test/publish flow.', '/api/channel-groups'],
  'Passthrough Referrers': ['Domains that preserve session attribution instead of creating a referral.', '/api/passthrough-referrers'],
  'Referrer Mappings': ['Map referrer domains to friendly source names.', '/api/referrer-mappings'],
  'Bot Stats': ['Bot and suspicious-session detection metrics.', '/api/bot-stats'],
  'BigQuery Integration': ['Stream your analytics data into Google BigQuery.', '/api/bigquery'],
  'Saved Pixels': ['Reusable conversion pixel definitions.', '/api/saved-pixels'],
  'LENS Insights': ['LENS AI insights.', '/lens/api/lens-endpoints'],
  'LENS Reports': ['LENS weekly and monthly reports.', '/lens/api/lens-endpoints'],
  Assistant: ['Seal AI assistant chat endpoints.', '/lens/api/lens-endpoints'],
  Audit: ['Account audit log.', '/api/audit'],
  Migration: ['Migration jobs from the legacy v1 platform.', '/api/migration-from-v1'],
  Users: ['The current user, preferences and per-user settings.', '/api/users'],
  Health: ['Liveness and readiness probes. Unauthenticated and never rate-limited.', '/api/for-agents'],
  Tracker: ['The tracking script served to browsers.', '/implementation/tracker/api-reference'],
  Maintenance: ['Internal maintenance jobs.', null],
  Admin: ['Superadmin-only operations.', null],
};

// ─── error responses ────────────────────────────────────────────────────────

const ERROR_SCHEMAS = {
  ErrorDetail: {
    type: 'object',
    description: 'Machine-readable error body. `code` is stable — branch on it, not on `message`.',
    properties: {
      code: {
        type: 'string',
        description: 'Stable error code. See https://docs.sealmetrics.com/api/errors',
        examples: ['unauthorized', 'rate_limit_exceeded', 'not_found'],
      },
      message: {type: 'string', description: 'Human-readable description. May change; do not parse.'},
      detail: {
        description: 'Optional structured context (field-level validation errors, quota info, …).',
      },
    },
    required: ['code', 'message'],
  },
  ErrorResponse: {
    type: 'object',
    description: 'Every non-2xx response from the API uses this envelope.',
    properties: {
      error: {$ref: '#/components/schemas/ErrorDetail'},
      request_id: {
        type: 'string',
        description: 'Correlation id, also returned in the `X-Request-ID` response header. Quote it in support requests.',
      },
    },
    required: ['error'],
  },
};

const errRef = () => ({$ref: '#/components/schemas/ErrorResponse'});

const errorResponse = (description, code, message, headers) => {
  const r = {
    description,
    content: {
      'application/json': {
        schema: errRef(),
        example: {error: {code, message}, request_id: '3f8b1c22-9d0e-4a71-9d2f-1c8a5b6e7f90'},
      },
    },
  };
  if (headers) r.headers = headers;
  return r;
};

const RETRY_AFTER_HEADER = {
  'Retry-After': {
    description: 'Seconds to wait before retrying.',
    schema: {type: 'integer'},
  },
};

const RATE_LIMIT_HEADERS = {
  ...RETRY_AFTER_HEADER,
  'X-RateLimit-Limit': {description: 'Requests allowed per minute.', schema: {type: 'integer'}},
  'X-RateLimit-Remaining': {description: 'Requests left in the current window.', schema: {type: 'integer'}},
  'X-RateLimit-Reset': {description: 'Unix timestamp when the window resets.', schema: {type: 'integer'}},
};

/**
 * Declared once in `components.responses` and `$ref`-ed from every operation —
 * inlining them would add ~1 MB of duplicated JSON to the document.
 */
const SHARED_RESPONSES = {
  Unauthorized: errorResponse('Missing or invalid authentication.', 'unauthorized', 'Authentication required'),
  Forbidden: errorResponse('Authenticated, but not allowed to access this resource.', 'forbidden', 'Insufficient permissions'),
  NotFound: errorResponse('The resource does not exist.', 'not_found', 'Resource not found'),
  TooManyRequests: errorResponse('Rate limit exceeded. Honour `Retry-After` before retrying.', 'rate_limit_exceeded', 'Too many requests. Please retry after 15 seconds.', RATE_LIMIT_HEADERS),
  InternalError: errorResponse('Unexpected server error. Safe to retry with backoff.', 'internal_error', 'An internal error occurred'),
  ServiceUnavailable: errorResponse('A dependency is temporarily unavailable. Honour `Retry-After`.', 'database_unavailable', 'Database temporarily unavailable. Please retry later.', RETRY_AFTER_HEADER),
};

const RESPONSE_NAME = {
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'NotFound',
  429: 'TooManyRequests',
  500: 'InternalError',
  503: 'ServiceUnavailable',
};

/**
 * 200-response examples, copied verbatim from the corresponding docs page so the
 * spec and the prose cannot disagree. Only endpoints whose response body is
 * documented are listed — nothing here is invented.
 */
const RESPONSE_EXAMPLES = {
  // docs/api/index.mdx
  'get /api/v1/stats/overview': {
    success: true,
    data: {
      date_range: {start_date: '2025-01-01', end_date: '2025-01-07', days: 7},
      traffic: {
        entrances: 12543,
        engaged_entrances: 7234,
        page_views: 28976,
        microconversions: 892,
        conversions: 156,
        revenue: '12450.00',
        bounce_rate: 42.3,
        pages_per_session: 2.31,
      },
      conversions: {
        conversions: 156,
        revenue: '12450.00',
        microconversions: 892,
        conversion_rate: 1.24,
        average_order_value: '79.81',
      },
    },
    meta: {},
    timestamp: '2025-01-08T00:00:00Z',
  },
  // docs/api/batch.mdx
  'post /api/v1/batch': {
    batch_id: 'b7c1f0e2-3d4a-4f5b-8c9d-0e1f2a3b4c5d',
    status: 'completed',
    results: {
      overview: {status: 'success', data: {}, timing_ms: 45},
      pages: {status: 'success', data: {}, timing_ms: 32},
      sources: {status: 'success', data: {}, timing_ms: 28},
    },
    meta: {total_queries: 3, successful: 3, failed: 0, skipped: 0, total_timing_ms: 105, parallel_execution: true},
  },
  'post /api/v1/batch/validate': {
    valid: true,
    query_count: 3,
    execution_order: ['overview', 'pages', 'sources'],
    parallel_groups: [['overview', 'pages'], ['sources']],
  },
};

// ─── run ────────────────────────────────────────────────────────────────────

const spec = JSON.parse(fs.readFileSync(SPEC, 'utf8'));
const log = [];

// 1. servers
spec.servers = [
  {url: 'https://my.sealmetrics.com', description: 'Production'},
];
log.push('servers -> https://my.sealmetrics.com (paths already carry the /api/v1 prefix)');

// 2. root security must reference schemes that exist
const schemes = Object.keys(spec.components.securitySchemes);
spec.security = schemes.map((s) => ({[s]: []}));
log.push(`root security -> ${schemes.join(', ')}`);

// 3 + 4. remove phantom and admin paths
let removed = 0;
for (const p of PHANTOM_PATHS) {
  if (spec.paths[p]) {
    delete spec.paths[p];
    removed += 1;
  }
}
log.push(`removed ${removed} phantom path(s) (verified 404 in production)`);

let adminRemoved = 0;
for (const p of Object.keys(spec.paths)) {
  if (p.startsWith('/api/v1/admin/') || p.startsWith('/api/v1/internal/')) {
    delete spec.paths[p];
    adminRemoved += 1;
  }
}
log.push(`removed ${adminRemoved} admin/internal path(s) from the public document`);

// 4b. Schema names containing a hyphen break code generators.
// FastAPI emits `Foo-Input` / `Foo-Output` when a model is used in both a
// request and a response with different shapes. openapi-python-client cannot
// resolve those references and silently DROPS the schema and everything that
// points at it. Rename to `FooInput` / `FooOutput` — pure renaming, no
// semantic change.
{
  const renames = {};
  for (const name of Object.keys(spec.components.schemas)) {
    if (name.includes('-')) {
      renames[name] = name.replace(/-(\w)/g, (_, c) => c.toUpperCase());
    }
  }

  if (Object.keys(renames).length) {
    for (const [from, to] of Object.entries(renames)) {
      spec.components.schemas[to] = spec.components.schemas[from];
      delete spec.components.schemas[from];
    }

    // Rewrite every $ref pointing at a renamed schema.
    const rewrite = (node) => {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) return node.forEach(rewrite);
      for (const [k, v] of Object.entries(node)) {
        if (k === '$ref' && typeof v === 'string') {
          const m = v.match(/^#\/components\/schemas\/(.+)$/);
          if (m && renames[m[1]]) node.$ref = `#/components/schemas/${renames[m[1]]}`;
        } else {
          rewrite(v);
        }
      }
    };
    rewrite(spec);

    log.push(`renamed ${Object.keys(renames).length} hyphenated schema(s) so codegen can resolve them`);
  }
}

// 5 + 6 + 7. per-operation pass
let publicMarked = 0;
let errorsAdded = 0;
let examplesAdded = 0;
const usedTags = new Set();

for (const [p, item] of Object.entries(spec.paths)) {
  for (const m of METHODS) {
    const op = item[m];
    if (!op) continue;

    // tags
    if (Array.isArray(op.tags)) {
      op.tags = op.tags.map((t) => TAG_RENAME[t] ?? t);
      op.tags.forEach((t) => usedTags.add(t));
    }

    // security
    const isPublic = PUBLIC_OPS.has(`${m} ${p}`);
    if (isPublic) {
      op.security = [];
      publicMarked += 1;
    } else if (!op.security) {
      op.security = schemes.map((s) => ({[s]: []}));
    }

    // error responses
    op.responses ??= {};
    const add = (code) => {
      if (!op.responses[code]) {
        op.responses[code] = {$ref: `#/components/responses/${RESPONSE_NAME[code]}`};
        errorsAdded += 1;
      }
    };
    if (!isPublic) {
      add('401');
      add('403');
    }
    if (p.includes('{')) add('404');
    if (!NO_RATE_LIMIT.has(p)) add('429');
    add('500');
    add('503');

    // 200 example, when the docs publish one
    const example = RESPONSE_EXAMPLES[`${m} ${p}`];
    const ok = op.responses['200'] ?? op.responses['201'];
    if (example && ok?.content?.['application/json']) {
      ok.content['application/json'].example = example;
      examplesAdded += 1;
    }
  }
}
log.push(`marked ${publicMarked} operation(s) as public (security: [])`);
log.push(`added ${errorsAdded} error response declaration(s)`);
log.push(`added ${examplesAdded} doc-sourced 200 response example(s)`);

// shared error schemas + reusable responses
Object.assign(spec.components.schemas, ERROR_SCHEMAS);
spec.components.responses = {...SHARED_RESPONSES, ...(spec.components.responses ?? {})};
log.push('added ErrorResponse / ErrorDetail schemas and 6 reusable error responses');

// prune schemas orphaned by the path removals above (transitive closure)
{
  const all = spec.components.schemas;
  const refsIn = (node, out = new Set()) => {
    if (!node || typeof node !== 'object') return out;
    if (Array.isArray(node)) {
      node.forEach((n) => refsIn(n, out));
      return out;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k === '$ref' && typeof v === 'string') {
        const m = v.match(/^#\/components\/schemas\/(.+)$/);
        if (m) out.add(m[1]);
      } else {
        refsIn(v, out);
      }
    }
    return out;
  };

  const reachable = refsIn({
    paths: spec.paths,
    webhooks: spec.webhooks,
    responses: spec.components.responses,
  });
  const queue = [...reachable];
  while (queue.length) {
    const name = queue.pop();
    for (const r of refsIn(all[name])) {
      if (!reachable.has(r)) {
        reachable.add(r);
        queue.push(r);
      }
    }
  }

  let pruned = 0;
  for (const name of Object.keys(all)) {
    if (!reachable.has(name)) {
      delete all[name];
      pruned += 1;
    }
  }
  log.push(`pruned ${pruned} orphaned schema(s)`);
}

// top-level tags, ordered: documented tags first (in TAG_META order), then the rest
const tagOrder = Object.keys(TAG_META).filter((t) => usedTags.has(t));
for (const t of [...usedTags].sort()) if (!tagOrder.includes(t)) tagOrder.push(t);
spec.tags = tagOrder.map((name) => {
  const [description, docPath] = TAG_META[name] ?? [undefined, null];
  const tag = {name};
  if (description) tag.description = description;
  if (docPath) tag.externalDocs = {description: 'Guide', url: `${DOCS}${docPath}`};
  return tag;
});
log.push(`added top-level tags array (${spec.tags.length} tags)`);

// 8. info
spec.info.contact = {name: 'Sealmetrics Support', email: 'support@sealmetrics.com', url: `${DOCS}/api`};
spec.info.termsOfService = 'https://sealmetrics.com/terms';
spec.externalDocs = {description: 'Sealmetrics API documentation', url: `${DOCS}/api`};
log.push('added info.contact, info.termsOfService, externalDocs');

// 9. brand casing. The upstream spec writes "SealMetrics"; the brand is
// "Sealmetrics". Normalising here rather than in the checked-in JSON means it
// survives the next spec re-sync. Only the standalone word is touched — a
// SealMetrics* identifier (SDK class, component, module) keeps its casing.
let brandFixes = 0;
const normalizeBrand = (value) => {
  if (typeof value === 'string') {
    return value.replace(/SealMetrics(?![A-Za-z0-9_(/])/g, () => {
      brandFixes += 1;
      return 'Sealmetrics';
    });
  }
  if (Array.isArray(value)) return value.map(normalizeBrand);
  if (value && typeof value === 'object') {
    for (const k of Object.keys(value)) value[k] = normalizeBrand(value[k]);
  }
  return value;
};
normalizeBrand(spec);
if (brandFixes) log.push(`normalized ${brandFixes} SealMetrics → Sealmetrics`);

fs.writeFileSync(SPEC, `${JSON.stringify(spec, null, 2)}\n`);

const ops = Object.values(spec.paths).reduce(
  (n, item) => n + METHODS.filter((m) => item[m]).length,
  0,
);
console.log(log.map((l) => `  · ${l}`).join('\n'));
console.log(`\n✔ static/openapi.json — ${Object.keys(spec.paths).length} paths, ${ops} operations`);
console.log('  Next: npx @redocly/cli bundle static/openapi.json -o static/openapi.yaml');
