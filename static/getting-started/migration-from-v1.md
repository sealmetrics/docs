---
title: "Migrate Your Historical Data from v1"
description: "Import historical conversions, microconversions and pageviews from Sealmetrics v1 to v2 with the Migration Wizard — connect, pick a date range, and let the nocturnal worker do the rest."
canonical_url: "https://docs.sealmetrics.com/getting-started/migration-from-v1"
lang: "en"
date_generated: "2026-09-01T17:24:22.778Z"
source_hash: "0a73e64c9dfaa3b93009b4db641c1456bb8209f4b010dacccb44ae85c8b50a4c"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "getting-started/migration-from-v1.mdx"
publisher: "Sealmetrics"
---

# Migrate Your Historical Data from v1

Canonical page: https://docs.sealmetrics.com/getting-started/migration-from-v1

If you're upgrading from Sealmetrics v1, the Migration Wizard imports your historical data into your v2 site. Migrations run **in the background overnight**, so you can schedule the import today and check the results tomorrow morning.

## What gets migrated

| Data type | Migrated | Where it lands in v2 |
|-----------|----------|----------------------|
| **Conversions** | Yes | Your Conversions report |
| **Microconversions** | Yes | Your Microconversions report |
| **Pageviews** (pre-aggregated) | Yes | Your Pages report (URL → name, totals → page views, entrances) |
| Terms / OS / Device dimensions | Yes | Rolled into your Sources & Devices reports |

All available data types are always migrated together — you don't need to (and can't) pick a subset. Properties on conversions and microconversions are preserved.

## What the migrated period won't have

Three things are missing from the imported range, and none of them can be backfilled later. They are limits of what v1 recorded, not of the importer — so plan your year-on-year comparisons around them rather than filing them as bugs.

| Missing | What you'll see | Why |
|---------|-----------------|-----|
| **Channel grouping** | Migrated traffic reports as **Unassigned** in the Channels report | v1 didn't store the channel classification, and Sealmetrics classifies at ingest time — there is nothing to reclassify after the fact |
| **Hourly breakdown** | Migrated days resolve to daily totals only | v1 stored these rows pre-aggregated by day |
| **Engagement / bounce rate** | `engaged_entrances` is always **0**, so migrated days read as 100% bounce | v1 didn't record this signal |

**Warning:**
A year-on-year or period-over-period comparison that spans the migration date will look like a collapse in engaged traffic and a spike in Unassigned channels. That's the seam, not a change in your traffic. When you need a like-for-like read, compare periods that sit entirely on one side of it.

## How the wizard works

The Migration Wizard has **three steps**:

1. **Connect** — authenticate against your v1 account.
2. **Select Dates** — confirm the auto-calculated date range (or customize it).
3. **Status** — track the migration once it's been scheduled.

You don't have to babysit the wizard. Once you complete step 2, the job is queued and the wizard closes the loop by moving you into step 3. You can close the tab; the job runs on its own overnight.

## Step 1 — Connect to v1

1. Go to **Settings → Migration**.
2. Click **Start New Migration**.
3. Enter your Sealmetrics v1 credentials:
   - **Email** — the address you use to log into Sealmetrics v1.
   - **Password** — the v1 password.
   - **v1 Account ID** — the MongoDB account identifier from your v1 setup.
4. Submit the form. The wizard validates the credentials against v1 and advances to the next step. If the credentials are wrong or v1 is unreachable, you'll see the error and stay on step 1.

Your credentials are **encrypted at rest** (Fernet / AES) and are used only to open a short-lived tunnel to v1 during the migration. Sealmetrics never stores them in the clear.

## Step 2 — Select the date range

When step 2 opens, the wizard connects to v1 in the background and calculates a **suggested date range** for you:

- **Start** = your oldest data in v1.
- **End** = the day before your first v2 pageview (to avoid double-counting the overlap).

By default the wizard uses that suggested range. You almost never need to change it — it's the exact range that fills the gap between v1 and v2 with no duplicates.

### Customizing the range

If you want to import a shorter window (e.g. only the last 6 months), tick **"I want to customize the date range"** and pick the dates yourself.

Rules:

- **Maximum window: 2 years (730 days).** The wizard will refuse a longer range.
- **End date can't be in the future.**
- If your v1 data extends beyond 2 years back, the "available" range shown will be capped at 2 years.

**Warning:**
If you extend the end date past what the wizard suggests, you'll overlap with data that v2 already captured. The wizard shows a red warning: *"Under your responsibility. Existing v2 data for this range will be replaced."* Only do this if you know what you're doing.

### Important: match your timezones

Make sure your **v1 timezone matches your v2 site's timezone**. Data is bucketed by local day in both platforms, so a mismatch will shift every metric across day boundaries and make the join at the seam look wrong. The wizard shows a reminder before you submit.

Click **Schedule Migration** to queue the job.

## Step 3 — Status

Once queued, the wizard shows the job's status. Migrations do **not** run immediately: they are processed during the **nightly window between 01:00 and 07:00 CET**. Depending on when you scheduled it, the job may sit in `pending` for a few minutes to several hours before the worker picks it up.

Status values you may see:

| Status | Meaning |
|--------|---------|
| `pending` | Waiting for the next processing window. |
| `running` | The worker is currently importing your data. |
| `completed` | Done — data is available in your reports. |
| `failed` | Something went wrong; the worker will **auto-retry the next night**. |

You can close the tab safely — the worker runs server-side and doesn't need your browser open. Come back to **Settings → Migration** anytime to check progress.

### Cancelling

You can **cancel a job that's still `pending` or has `failed`**. Once a job is `running`, cancellation is not possible — the worker completes the current run to avoid leaving your data half-imported.

### Retries

Failed jobs are automatically retried the next night. There's no "Start New Migration" button for a failed job — the retry is automatic. If a job keeps failing, contact support with the job ID.

## Constraints and edge cases

- **One completed migration per site.** After a migration reaches `completed`, you can't queue another one for the same site — contact support if you need to re-migrate (rare; usually only after a data-model change).
- **Nocturnal processing only.** The worker is idle during the day; jobs scheduled at 3pm won't start until 01:00 CET the next morning. This is deliberate — batch imports at night avoid competing with live ingestion resources.
- **Idempotent inserts.** When the worker imports a date range, it first deletes any existing v2 rows in that range, then inserts the v1 data. Re-running (in the rare cases support enables it) does not create duplicates.
- **Sub-batched inserts.** The worker paginates through MongoDB and writes ClickHouse in batches of 200 rows, with pauses between batches, so your live analytics stay responsive during the import.

## After the migration

Once the job reaches `completed`, imported data is available immediately in your v2 reports — no further action needed. In particular:

- The **Conversions** and **Microconversions** reports show the merged history.
- The **Pages** report includes v1 URLs with their page views and entrances.
- Channel grouping is **not** applied to imported rows — they report as **Unassigned**. Sealmetrics classifies traffic into channels at ingest time and v1 didn't store that classification, so there is nothing to carry over and nothing to recompute afterwards. Custom channel rules you create later affect new traffic only, never the migrated range. See [What the migrated period won't have](#what-the-migrated-period-wont-have).

## Troubleshooting

**"No data found in v1 for this account."** The credentials worked but the v1 account has no historical data. Nothing to migrate — you can start with a clean v2 setup.

**"A completed migration already exists for this account."** This account has already been migrated. If you genuinely need to re-run it, contact support.

**Job stuck in `pending` past the next 01:00 CET window.** Check `Settings → Migration` — a longer queue at your migration cohort can delay the start. If a job is still `pending` more than 24 h after being scheduled, ping support with the job ID.

**Job in `failed` state.** Failed jobs auto-retry the next night. Check back the morning after; if it fails twice in a row, contact support with the job ID and the error message from the status card.

## Related documentation

- [First Steps with Sealmetrics](/getting-started/quick-start) — set up your v2 account before importing.
- [Migration from v1 (tracker)](/implementation/tracker/migration-from-v1) — update your tracking pixel from v1 to v2.
- [Migration from v1 (API)](/api/migration-from-v1) — migrating API integrations from the legacy Postman collection to the current REST API.
- [Installation](/implementation/tracker/installation) — install the current tracking script.
- [How to Measure Conversions](/getting-started/measure-conversions) — configure conversions in v2.
- [Conversions Report](/reports/conversions) — verify imported conversions in your reports.
