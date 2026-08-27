---
title: "Error codes"
description: "Every error code the Sealmetrics API can return, with its HTTP status, what it means, and whether the request is safe to retry."
canonical_url: "https://docs.sealmetrics.com/api/errors"
lang: "en"
date_generated: "2026-08-09T18:18:16.203Z"
source_hash: "44320d3506a7ed1ab404854ebb60d5f6cc84eaaf3c8c96be38c4c3937ade7fcb"
content_type: "api-reference"
owner: "engineering"
llm_priority: "critical"
source_file: "api/errors.mdx"
publisher: "Sealmetrics"
---

# Error codes

Canonical page: https://docs.sealmetrics.com/api/errors

Every non-2xx response from the Sealmetrics API uses the same envelope. Branch on `error.code`, which is stable — never on `error.message`, which is written for humans and may change.

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Too many requests. Please retry after 15 seconds."
  },
  "request_id": "ae817c5b-82df-430f-83e6-10c937e4e5e4"
}
```

| Field | Description |
|---|---|
| `error.code` | Stable machine-readable identifier. Switch on this. |
| `error.message` | Human-readable description. Do not parse it. |
| `error.detail` | Optional. Structured context — field-level validation errors, quota information, and similar. |
| `request_id` | Correlation id, also returned in the `X-Request-ID` response header. Log it, and quote it in support requests. |

**Note:**
The `/oauth/*` endpoints use the RFC 6749 shape (`{"error": "...", "error_description": "..."}`) instead of this envelope, because the OAuth spec requires it. See [OAuth 2.1](/api/oauth#error-format).

## Catalogue

### Client errors

| Code | HTTP | Meaning | Retry? |
|---|---|---|---|
| `bad_request` | 400 | Malformed request or an invalid parameter combination. | No |
| `invalid_domain` | 400 | The domain is not a valid hostname. | No |
| `invalid_timezone` | 400 | Not a recognised IANA timezone. | No |
| `unauthorized` | 401 | Missing, malformed or unrecognised credentials. | No — re-authenticate |
| `invalid_credentials` | 401 | Email or password rejected at login. | No |
| `token_expired` | 401 | The JWT or token has passed its expiry. | No — refresh first |
| `token_invalid` | 401 | Signature or format rejected. | No |
| `forbidden` | 403 | Authenticated, but not permitted. Usually a missing scope or another organization's resource. | No |
| `email_not_verified` | 403 | The account exists but the email has not been confirmed. | No |
| `two_factor_required` | 403 | Login needs the TOTP step. See [2FA](/api/2fa). | No |
| `not_found` | 404 | The resource does not exist, or is not visible to these credentials. | No |
| `account_not_found` | 404 | Unknown `account_id`. See [the FAQ on `account_id` vs `site_id`](/api/faq). | No |
| `user_not_found` | 404 | Unknown user. | No |
| `method_not_allowed` | 405 | Wrong HTTP verb for this path. | No |
| `conflict` | 409 | The request conflicts with current state. | No |
| `duplicate_entry` | 409 | A resource with that identifier already exists. | No |
| `payload_too_large` | 413 | Request body exceeds the size limit. | No — split the request |
| `validation_error` | 422 | Schema validation failed. `error.detail` is an array of `{field, message, type}`. | No |
| `rate_limit_exceeded` | 429 | Over the rate limit. Honour `Retry-After`. | **Yes** |
| `quota_exceeded` | 429 | A plan quota is exhausted (not the per-minute rate limit). | No — upgrade or wait for the period |

### Server errors

| Code | HTTP | Meaning | Retry? |
|---|---|---|---|
| `internal_error` | 500 | Unhandled server error. | **Yes**, with backoff |
| `database_error` | 500 | A query failed. | **Yes**, with backoff |
| `bad_gateway` | 502 | Upstream dependency returned an invalid response. | **Yes**, with backoff |
| `database_unavailable` | 503 | A database is temporarily unreachable. Sent with `Retry-After: 30`. | **Yes** |
| `service_unavailable` | 503 | A dependency or a feature switch is unavailable. | Depends — read the message |
| `gateway_timeout` | 504 | Upstream dependency timed out. | **Yes**, with backoff — consider narrowing the date range |

### Endpoint-specific codes

Some endpoints add their own codes on top of the list above:

| Code | HTTP | Where | Meaning |
|---|---|---|---|
| `provision_unavailable` | 409 | [`POST /provision`](/api/provision) | The account could not be created. Deliberately ambiguous — it does not reveal whether the email is already registered. |
| `invalid_input` | 400 | [`POST /provision`](/api/provision) | A provisioning field failed validation. |
| `rule_is_live` | 409 | [Channel groups](/api/channel-groups) | A draft-only mutation (`only_if_inactive=true`) was attempted on a rule that has gone live. |
| `dependency_failed` | — | [Batch](/api/batch) | Per-query status: a query was skipped because a `depends_on` query failed. |
| `csrf_failed` | 403 | Cookie-authenticated requests | The double-submit CSRF token is missing or does not match. Does not apply to `X-API-Key` or bearer-token requests. |

## Validation errors in detail

A `422` carries the offending fields:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Request validation failed",
    "detail": [
      {"field": "query.period", "message": "Input should be a valid string", "type": "string_type"}
    ]
  },
  "request_id": "…"
}
```

`field` is the dotted path to the parameter, so you can map it straight back to your request.

## Retry policy

| Status | Retry? | How |
|---|---|---|
| `429` | Yes | Wait `Retry-After` seconds + jitter |
| `503` | Yes | Wait `Retry-After` seconds |
| `500`, `502`, `504` | Yes | Exponential backoff, capped attempts |
| `4xx` (others) | No | Fix the request first |

**Caution:**
The API does not currently accept an `Idempotency-Key` header, so retrying a failed `POST` can create a duplicate resource. Only retry a write once you have confirmed the first attempt did not take effect. See [For AI Agents](/api/for-agents#retry-policy-that-works).

```python
import random, time
import requests

RETRYABLE = {429, 500, 502, 503, 504}

def get_with_retry(url, headers, max_attempts=5):
    for attempt in range(max_attempts):
        r = requests.get(url, headers=headers, timeout=30)
        if r.status_code not in RETRYABLE:
            return r
        # Retry-After is authoritative when present (429 and 503 always send it)
        wait = float(r.headers.get("Retry-After", 2 ** attempt))
        time.sleep(wait + random.uniform(0, 1))
    r.raise_for_status()
    return r
```

## Related

- [For AI Agents](/api/for-agents) — the full agent integration guide
- [Rate Limits](/api/rate-limits) — limits per plan and the `X-RateLimit-*` headers
- [Authentication](/api/authentication) · [OAuth 2.1](/api/oauth)
- [API FAQ](/api/faq)
