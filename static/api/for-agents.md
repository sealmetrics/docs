---
title: "For AI Agents"
description: "Everything an AI agent or LLM tool needs to use the Sealmetrics API — OpenAPI spec, hosted MCP server, OAuth 2.1, batch queries, async export jobs, rate-limit headers and error codes, on one page."
canonical_url: "https://docs.sealmetrics.com/api/for-agents"
lang: "en"
date_generated: "2026-08-09T18:18:16.203Z"
source_hash: "2984f8610830dcc22a59e2fbce53cc8b880f800682d96a841c996ecc4c584973"
content_type: "api-reference"
owner: "engineering"
llm_priority: "critical"
source_file: "api/for-agents.mdx"
publisher: "SealMetrics"
---

# For AI Agents

Canonical page: https://docs.sealmetrics.com/api/for-agents

Everything an autonomous agent needs to read Sealmetrics analytics, in one place. If you are wiring an LLM to this API, start here.

## At a glance

| | |
|---|---|
| **Base URL** | `https://my.sealmetrics.com/api/v1` |
| **OpenAPI 3.1 spec** | [`/openapi.json`](https://docs.sealmetrics.com/openapi.json) · [`/openapi.yaml`](https://docs.sealmetrics.com/openapi.yaml) |
| **Hosted MCP server** | `https://mcp.sealmetrics.com/mcp` (Streamable HTTP) — [setup](/integrations/mcp-server) |
| **Auth** | API key (`X-API-Key`), JWT bearer, or [OAuth 2.1 + PKCE](/api/oauth) |
| **Headless account creation** | [`POST /provision`](/api/provision) |
| **Batch** | [Up to 50 queries per request with dependency ordering](/api/batch) |
| **Long-running work** | [Async export jobs + completion webhooks](/api/exports) |
| **Error format** | One envelope, stable `error.code` — [catalogue](/api/errors) |
| **Rate limits** | `X-RateLimit-*` on every response, `Retry-After` on 429 — [details](/api/rate-limits) |
| **Docs for LLMs** | [`/llms.txt`](https://docs.sealmetrics.com/llms.txt) · [`/llms-full.txt`](https://docs.sealmetrics.com/llms-full.txt) |

## The fastest path: use the MCP server

If your agent runtime speaks the [Model Context Protocol](https://modelcontextprotocol.io/), you do not need to write HTTP code at all. Point the client at the hosted server and the analytics surface arrives as tools:

```bash
claude mcp add --transport http sealmetrics https://mcp.sealmetrics.com/mcp
```

The server exposes read-only analytics tools covering traffic, conversions and microconversions (including raw event-level data), campaigns, landing pages, content groups, countries, devices, browsers, operating systems, channels, funnels, custom properties, segments, alerts, webhooks and bot detection — plus setup tools that can create a free account and verify the pixel from the chat.

Append `?discovery=progressive` to the URL to load tool definitions on demand instead of all at once, which keeps context usage low on clients with tight limits.

Full client-by-client setup (Claude, ChatGPT, Cursor, Codex, VS Code): **[MCP Server](/integrations/mcp-server)**. To create an account from the chat with no dashboard login: **[AI Agentic Package](/integrations/agentic-package)**.

## Using the REST API directly

### 1. Read the spec first

The complete machine-readable contract lives at **`https://docs.sealmetrics.com/openapi.json`** (OpenAPI 3.1, also available as YAML). Every operation carries an `operationId`, tags, parameter schemas, response schemas and the error responses described below. Generate a client from it rather than hand-rolling one:

```bash
curl -sO https://docs.sealmetrics.com/openapi.json
npx @redocly/cli lint openapi.json          # validate
npx @openapitools/openapi-generator-cli generate -i openapi.json -g python -o ./sm-client
```

**Note:**
Where a page in these docs and the OpenAPI spec disagree about a field's type, **the spec is correct**. In particular, monetary fields backed by decimals (`revenue`, `average_order_value` on the overview and aggregate reports) are serialized as **JSON strings** — `"12450.00"`, not `12450.00` — so no precision is lost in transit. Parse them with a decimal type. A few endpoints still return revenue as a JSON number; check the field's `type` in the spec before parsing.

### 2. Authenticate

Three options, in increasing order of setup cost:

| Method | Header | Use it when |
|---|---|---|
| **API key** | `X-API-Key: sm_…` | The agent runs on behalf of one account you control. Read-only, scoped, revocable — see [API Tokens](/api/api-tokens). |
| **JWT bearer** | `Authorization: Bearer …` | You already hold a dashboard session and need write access. See [Authentication](/api/authentication). |
| **OAuth 2.1** | `Authorization: Bearer …` | Your product connects to *other people's* Sealmetrics accounts. PKCE, dynamic client registration, refresh tokens. See [OAuth 2.1](/api/oauth). |

API keys are read-only by design (`stats:read`, `sites:read`, `accounts:read`). That is the right default for an analytics agent: it cannot mutate anything.

### 3. Ask for a lot in one request

Two features exist specifically so an agent does not have to fan out dozens of HTTP calls:

**[Batch](/api/batch)** — up to 50 analytics queries in one round trip, with `depends_on` to express ordering, `parallel_limit` to cap concurrency, and `POST /batch/validate` to dry-run the plan before spending the request:

```json
{
  "queries": [
    {"id": "overview", "endpoint": "/stats/overview", "params": {"account_id": "my-site", "period": "30d"}},
    {"id": "pages",    "endpoint": "/stats/pages",    "params": {"account_id": "my-site", "period": "30d", "page_size": 10}}
  ],
  "options": {"parallel_limit": 5, "include_timing": true}
}
```

Each query resolves its dates in its own account's timezone, so a multi-site batch does not need you to pre-resolve `30d` per site.

**[Multi-dimensional query](/api/stats-query)** — `POST /stats/query` takes dimensions, metrics, filters, granularity and comparison in one body, instead of stitching together several report endpoints.

### 4. Hand off long work instead of blocking

Bulk exports are a proper asynchronous job, not a long HTTP request:

1.  creates a job and returns immediately.
2. The job moves through `pending` → `estimating` → `generating` → `completed` (or `failed` / `expired`).
3. **You do not have to poll.** Subscribe a [webhook](/api/webhooks) to `export.completed` and `export.failed` and the API pushes the result to you.
4. Fetch the file with the download token, or `DELETE` the job to cancel it.

For small datasets, `POST /exports/stream` streams the rows back directly in one call.

Full lifecycle, filters and formats: **[Exports](/api/exports)**.

### 5. Page through results

List endpoints use `page` / `page_size` and return `total`, `has_next` and `has_prev`:

```json
{"data": [], "total": 156, "page": 1, "page_size": 50, "has_next": true, "has_prev": false}
```

Read `has_next` rather than computing it from `total`, and hold `page_size` constant across a run. See [Pagination, Sorting & Filters](/api/pagination-sorting).

**Caution:**
Analytics data keeps arriving while you page. If rows shift between requests you can see a row twice or miss one. For a complete, consistent snapshot of a large report, use an [export job](/api/exports) instead of paging.

### 6. Respect the rate limiter

Every response carries the current state — you never have to guess:

| Header | Meaning |
|---|---|
| `X-RateLimit-Limit` | Requests allowed per minute on this account's plan |
| `X-RateLimit-Remaining` | Requests left in the current window |
| `X-RateLimit-Reset` | Unix timestamp when the window resets |
| `Retry-After` | On `429` and `503`: seconds to wait |

All four are exposed via CORS, so a browser-side agent can read them too. There is no burst allowance and no soft-throttling phase: you are either under the limit or you get a `429`. Back off on `Retry-After` plus jitter. Limits per plan tier: [Rate Limits](/api/rate-limits).

### 7. Branch on `error.code`, never on the message

Every non-2xx response uses the same envelope:

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Too many requests. Please retry after 15 seconds."
  },
  "request_id": "ae817c5b-82df-430f-83e6-10c937e4e5e4"
}
```

`code` is stable and safe to switch on. `message` is for humans and may change. `request_id` also arrives in the `X-Request-ID` response header — log it, and quote it if you open a support ticket.

The full list, with which codes are retryable, is in the **[Error codes](/api/errors)** catalogue.

## Retry policy that works

| Status | Retry? | How |
|---|---|---|
| `429` | Yes | Wait `Retry-After` seconds + jitter |
| `503` | Yes | Wait `Retry-After` seconds (the API sends `30` on database unavailability) |
| `500`, `502`, `504` | Yes | Exponential backoff, cap the attempts |
| `408` timeouts | Yes | Backoff; consider narrowing the date range |
| `400`, `422` | No | Fix the request — the `detail` array names the offending field |
| `401`, `403` | No | Re-authenticate or widen the token's scopes |
| `404`, `409` | No | Resolve the conflict in your own logic |

**Caution:**
The API does not currently accept an `Idempotency-Key` header. Retrying a failed `POST` may create a duplicate resource (a second export job, a second segment). Until that lands, retry writes only when you can confirm the first attempt did not take effect — for exports, list the account's jobs before retrying.

## Health and readiness

Three unauthenticated probes, excluded from rate limiting:

 ·  ·

These live at the host root, not under `/api/v1` — for example `https://my.sealmetrics.com/livez`.

## What is not available

Stated plainly so you do not build around something that does not exist:

- **No SSE or WebSocket streaming.** Real-time updates come from [webhooks](/api/webhooks), not a persistent stream. Export downloads are chunked HTTP, which is not the same thing.
- **No idempotency keys** on writes (see the caution above).
- **No cursor pagination** — offset only.
- **No sandbox or demo dataset.** The closest thing is [`POST /provision`](/api/provision), which creates a real free-tier account headlessly.
- **No burst allowance** on the rate limiter.

## Related

- [API Overview](/api) — the full endpoint map
- [Quick Start](/api/quick-start) — first call in five minutes
- [Error codes](/api/errors)
- [OAuth 2.1](/api/oauth)
- [Provisioning](/api/provision)
- [MCP Server](/integrations/mcp-server) · [AI Agentic Package](/integrations/agentic-package)
- [Web analytics prompts](/web-analytics-prompts) — ready-made prompts for agents driving the MCP tools
