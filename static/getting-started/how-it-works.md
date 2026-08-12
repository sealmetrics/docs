---
title: "How It Works"
description: "How Sealmetrics measures your traffic — one script tag, four non-identifying variables per hit, aggregate reports, and no consent banner."
canonical_url: "https://docs.sealmetrics.com/getting-started/how-it-works"
lang: "en"
date_generated: "2026-08-12T08:53:56.085Z"
source_hash: "edefcbc0fadafe6283b0ac95dfb89af4b09e8595e01de50e7c963d22f3fec6b5"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "getting-started/how-it-works.mdx"
publisher: "SealMetrics"
---

# How It Works

Canonical page: https://docs.sealmetrics.com/getting-started/how-it-works

Sealmetrics measures your website traffic without cookies, consent banners or personal data, on a simple principle: **measure everything, identify no one**. You add one script tag; every visit is recorded as a set of non-identifying signals; your reports show aggregate patterns.

## What gets recorded

Four variables per hit:

1. **Timestamp** — when the visit happened
2. **User Agent** — used for anonymous device classification (browser, OS, device type). The raw string is purged after 1 day; only the derived categories persist in aggregates
3. **Current URL** — which page was viewed
4. **Referral URL** — where the visitor came from

No IP addresses stored, no cookies, no localStorage, no persistent identifiers. Hits within one visit are grouped by a short-lived, in-memory session marker (roughly a two-hour inactivity window) that is never written to the device and cannot recognise a returning visitor.

Because no personal data is collected and nothing is stored on the visitor's device, there is no consent to ask for — which is also why cookie-based tools lose 15–60% of visitor data in EU markets — depending on sector, brand strength and traffic mix — while Sealmetrics does not. The full reasoning is in [What is Consentless Analytics?](/security-privacy/consentless-analytics), and the exact field list with retention is in [What We Track](/security-privacy/what-we-track).

## What you get in reports

Traffic and entrances, traffic sources and campaigns, conversions and revenue with last-click attribution at channel level, aggregate engagement (bounce rate, engagement rate, pages per session), country from browser timezone, and device/browser breakdowns. Hits appear within seconds — the **Last hit** timestamp on the Overview report lets you verify your install immediately.

What you do not get is anything that needs a persistent identifier: unique visitors, session duration, cross-session journeys or cohorts. See the [Metrics Reference](/reports/definitions) for how each metric is calculated.

## How the data flows

1. The tracker (1.3 KB gzipped, asynchronous) detects page views and the events you instrument.
2. Hits are sent to Sealmetrics infrastructure in **Dublin, Ireland**. IPs are used in memory only for anti-abuse checks and are never persisted in the analytics database.
3. Each hit is processed on its own and aggregated. Event-level rows are purged after 1 day; daily aggregates and conversions are kept 24 months.
4. Known bots, crawlers, scrapers and monitoring tools are filtered out so reports show real visitors — see [Bot Detection](/security-privacy/bot-detection).

## Getting started

Add one script tag to your `<head>`, then instrument conversions with `sealmetrics.conv()`. It works with any stack — WordPress, React, Vue, plain HTML — natively or through Google Tag Manager. A REST API and CSV export are available for pulling the data into your own systems.

## Related documentation

- [First Steps with Sealmetrics](/getting-started/quick-start) — go from signup to live data
- [Installation](/implementation/tracker/installation) — add the script tag
- [What is Consentless Analytics?](/security-privacy/consentless-analytics) — the model and its legal basis
- [What We Track vs What We Don't](/security-privacy/what-we-track) — every field, with retention
- [Overview Report](/reports/overview) — the aggregate insights this architecture produces
