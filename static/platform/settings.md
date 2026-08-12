---
title: "Settings Overview"
description: "Configure your Sealmetrics account, tracking, integrations, and preferences."
canonical_url: "https://docs.sealmetrics.com/platform/settings"
lang: "en"
date_generated: "2026-08-12T08:53:56.085Z"
source_hash: "64251751d41d1de73eb385e28a8a0a793d3530235a724c8cc3e3241cde79dd04"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "platform/settings/index.mdx"
publisher: "SealMetrics"
---

# Settings Overview

Canonical page: https://docs.sealmetrics.com/platform/settings

The Settings area lets you configure every aspect of your Sealmetrics account. Settings live in the left sidebar, organized into three collapsible groups:

- **My Account** -- your personal settings: Profile, Security, API Keys, LLM Providers, and Connected Apps.
- **Organization** (owners and admins only) -- Settings, Members, Billing, Sites, Pixels, and Audit Logs.
- **Site Config** (per selected site) -- Settings, Integrations, and Properties.

## Settings Categories

### Account Settings

Configure your account and organization.

| Setting | Description |
|---------|-------------|
| [General](/platform/settings/account/general) | Account name, timezone, default date range |
| [Users & Teams](/platform/settings/account/users) | Manage team members and permissions |
| [Security](/platform/settings/account/security) | Two-factor authentication (2FA), backup codes, active sessions |
| [Connected Apps](/platform/settings/account/connected-apps) | AI assistants authorized via OAuth (remote MCP server) |
| [API Keys](/api/api-tokens) | Personal API tokens for programmatic access |

### Tracking Settings

Configure how data is collected.

| Setting | Description |
|---------|-------------|
| [Pixel Builder](/platform/settings/tracking/pixel-builder) | Generate and customize your tracking code |
| [Content Grouping](/platform/settings/tracking/content-grouping) | Group pages into content categories |
| [Custom Dimensions](/platform/settings/tracking/custom-dimensions) | Define custom data fields |

### Integrations

Connect external services.

| Setting | Description |
|---------|-------------|
| [BigQuery](/platform/settings/integrations/bigquery) | Export data to Google BigQuery |
| [Webhooks](/platform/settings/integrations/webhooks) | Send data to external endpoints |

### Advanced

Power user settings.

| Setting | Description |
|---------|-------------|
| [Audit Log](/platform/settings/advanced/audit-log) | View account activity history |
| [LLM Providers](/platform/settings/llm) | Choose the AI provider for the Lens chat (Seal AI Private or BYOK) |
| [Seal AI Usage](/platform/settings/seal-ai-usage) | Monthly token consumption, pack balance, and extra token packs |

## Quick Access

## Settings by Role

Access to settings depends on your organization role and site-level role:

| Role | Can Access |
|------|------------|
| **Owner** | All settings, including billing and organization management |
| **Admin** | Tracking, integrations, member management (no billing) |
| **Member (Editor)** | Site-specific settings for assigned sites only |
| **Member (Viewer)** | View settings only, cannot modify |

## Common Tasks

### Set Up Tracking

1. Go to **Settings → Sites → [your site]** (`/settings/sites/{siteId}`)
2. Open the **Pixel Code** tab, which holds the base tracking snippet for that site
3. Copy the generated code
4. Install on your website

To build a **conversion or microconversion** pixel rather than the base snippet, use the Pixel Builder — a separate, organization-level screen at **Organization → Pixels** (`/settings/pixels`), which also shows pixel status across your sites.

[Pixel Builder guide →](/platform/settings/tracking/pixel-builder)

### Add Team Members

1. In the sidebar, expand **Organization** and click **Members**
2. Click **Invite Member**
3. Enter email and select role
4. Click **Send Invitation** -- the user receives an invitation email

[User management guide →](/platform/settings/account/users)

### Connect BigQuery

1. In the sidebar, expand **Site Config** and click **Integrations**
2. Create a GCP service account
3. Upload credentials
4. Configure sync options

[BigQuery setup guide →](/platform/settings/integrations/bigquery)

### View Activity History

1. In the sidebar, expand **Organization** and click **Audit Logs**
2. Browse or search activity
3. Filter by user, action, or date

[Audit log guide →](/platform/settings/advanced/audit-log)
