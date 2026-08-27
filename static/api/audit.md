---
title: "Audit Logs"
description: "Query the audit trail of mutating actions across your organization, filterable by action type, resource, author, and date range"
canonical_url: "https://docs.sealmetrics.com/api/audit"
lang: "en"
date_generated: "2026-08-09T18:18:16.203Z"
source_hash: "ed70993d7aae58f65f1c951bc16e5876594ac0488872cb7546ab12890f807655"
content_type: "api-reference"
owner: "engineering"
llm_priority: "critical"
source_file: "api/audit.mdx"
publisher: "Sealmetrics"
---

# Audit Logs

Canonical page: https://docs.sealmetrics.com/api/audit

Query the audit trail of mutating actions across your organization. Superadmins see every entry; regular users see only entries authored by members of organizations they belong to.

**Base path:** `/audit`

Required scope: `read`.

---

## List Audit Logs

```http
GET /audit/logs
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `action` | string | - | Filter by action type (e.g. `segment.create`, `user.deactivate`) |
| `resource_type` | string | - | Filter by resource type (e.g. `segment`, `user`, `site`) |
| `user_id` | integer | - | Filter by author |
| `from_date` | datetime | - | Lower bound (ISO 8601) |
| `to_date` | datetime | - | Upper bound (ISO 8601) |
| `page` | integer | `1` | Page number |
| `page_size` | integer | `50` | Items per page (1-100) |

**Response:**

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 12041,
        "user_id": 7,
        "user_email": "alice@acme.com",
        "user_name": "Alice",
        "action": "segment.create",
        "resource_type": "segment",
        "resource_id": "seg_abc123",
        "account_id": "acme",
        "details": {
          "segment_name": "paid-spain",
          "filter_count": 2
        },
        "ip_address": "203.0.113.42",
        "created_at": "2025-01-08T14:23:00Z"
      }
    ],
    "total": 1248,
    "page": 1,
    "page_size": 50,
    "total_pages": 25
  }
}
```

`details` is a free-form object whose shape depends on the action type — treat it as opaque JSON when consuming.
