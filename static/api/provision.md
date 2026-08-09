---
title: "Provisioning (headless signup)"
description: "Create a free-tier Sealmetrics account from code with POST /provision — no card, no dashboard login, no browser. Built for AI agents and installers."
canonical_url: "https://docs.sealmetrics.com/api/provision"
lang: "en"
date_generated: "2026-08-09T18:18:16.203Z"
source_hash: "055f365d1678477050d8423de80dc30cfa6308a502ce36ffc779db92846231b8"
content_type: "api-reference"
owner: "engineering"
llm_priority: "critical"
source_file: "api/provision.mdx"
publisher: "SealMetrics"
---

# Provisioning (headless signup)

Canonical page: https://docs.sealmetrics.com/api/provision

`POST /provision` creates a **free-tier Sealmetrics account without a browser** — no card, no dashboard login, no OAuth round trip. It exists so an AI agent or an installer can go from "this site has no analytics" to "the tracker is live" inside a single conversation.

This is the endpoint behind the [`sealmetrics` CLI](https://www.npmjs.com/package/sealmetrics) and the `provision_site` tool in the [AI Agentic Package](/integrations/agentic-package).

**Info:**
If you just want an agent to set up analytics for you, install the [Agentic Package](/integrations/agentic-package) or run the CLI — both wrap this endpoint and handle the provision key for you. Call the endpoint yourself only if you are building your own installer or integration.

## Endpoint

Public and unauthenticated in the usual sense — there is no API key or session — but **gated by a publishable provision key** sent in the `X-Provision-Key` header. The key identifies the distribution channel (npm CLI, desktop extension, a partner integration) for attribution and rate limiting. It is publishable, not secret: it grants nothing except the ability to create free-tier accounts, under a rate limit.

The official CLI and MCP packages ship with a key embedded. If you are building your own integration and need your own key, email [support@sealmetrics.com](mailto:support@sealmetrics.com).

## Request

```bash
curl -X POST https://my.sealmetrics.com/api/v1/provision \
  -H "Content-Type: application/json" \
  -H "X-Provision-Key: <publishable-provision-key>" \
  -d '{
    "site_name": "My Shop",
    "domain": "myshop.com",
    "email": "me@example.com",
    "name": "Rafa",
    "accept_terms": true,
    "install_source": "my-installer",
    "timezone": "Europe/Madrid"
  }'
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `site_name` | string | Yes | 1–255 characters. |
| `email` | string | Yes | Valid email. Receives the claim link and the API key. |
| `accept_terms` | boolean | Yes | Must be `true`. The agent passes this on the human's behalf, so make sure the human has actually seen the [terms](https://sealmetrics.com/terms). |
| `domain` | string | No | Up to 255 characters. |
| `name` | string | No | The person's name, up to 255 characters. |
| `install_source` | string | No | Up to 64 characters. Free-form attribution label for your integration. |
| `timezone` | string | No | IANA timezone, up to 64 characters. Determines how `today`, `30d` and friends resolve for this site. |

## Response

```json
{
  "success": true,
  "data": {
    "success": true,
    "account_id": "…",
    "snippet": "<script …></script>",
    "api_key": "sm_…",
    "dashboard_url": "https://my.sealmetrics.com/…",
    "claim_url": "https://my.sealmetrics.com/…",
    "free_quota": { "events_total": 1000000 },
    "next_steps": [
      "Paste the snippet just before the closing </head> tag on every page.",
      "Deploy your site so the tracker can start capturing pageviews.",
      "Check your email to set a password and open your dashboard.",
      "Read your analytics with the api_key via the Sealmetrics MCP server."
    ]
  }
}
```

| Field | Description |
|---|---|
| `account_id` | Pass this as `account_id` to every [stats endpoint](/api/stats). |
| `snippet` | The tracking script, ready to paste before `</head>`. |
| `api_key` | Read-only API key for this account. Also emailed to the user. |
| `claim_url` | Magic link for the human to set a password and take ownership. |
| `free_quota.events_total` | Free-tier event allowance — a **lifetime cumulative** cap, not a monthly one. |

**Caution:**
Both grant access to the new account. Never echo them into a chat transcript, a log, or a shared terminal — the official tools deliberately send them by email instead of printing them. If you build your own integration, do the same.

## Free tier

A provisioned account starts on the free tier with **1,000,000 events total** — cumulative over the life of the organization, not reset monthly. Rate limits follow the free-tier row in [Rate Limits](/api/rate-limits).

## Errors

| Status | `error.code` | `error.message` / meaning |
|---|---|---|
| `400` | `bad_request` | `accept_terms` was not `true`. |
| `400` | `invalid_input` | A field failed validation — see `error.message`. |
| `401` | `unauthorized` | Message is `provision_key_required` (header missing) or `invalid_provision_key` (unknown or deactivated key). |
| `409` | `provision_unavailable` | The account could not be created with those details. **Deliberately ambiguous**: it does not confirm whether the email is already registered. If a matching account exists, its owner is notified by email. Tell the user to log in and add a site from the dashboard. |
| `429` | `rate_limit_exceeded` | Rate-limited per IP *and* per provision key. Honour `Retry-After`. |
| `503` | `service_unavailable` | Message is `provisioning_disabled` — headless provisioning is switched off globally. Not retryable on a short timescale. |

Do not treat `409 provision_unavailable` as "email taken" in your UI copy. The API will not tell you that, on purpose.

## After provisioning

1. Place the `snippet` before `</head>` and deploy.
2. Confirm the pixel is live — via `GET /sites/{id}/pixel/status` ([Sites](/api/sites)), or the `verify_setup` MCP tool.
3. Start reading data with the `api_key`: `GET /stats/overview?account_id=<account_id>&period=7d`.
4. Point the user at `claim_url` so they can set a password.

## Related

- [For AI Agents](/api/for-agents) — the rest of the agent surface
- [AI Agentic Package](/integrations/agentic-package) — the packaged version of this flow
- [MCP Server](/integrations/mcp-server)
- [Quick Start](/api/quick-start)
- [Rate Limits](/api/rate-limits)
