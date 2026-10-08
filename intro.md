---
title: "Sealmetrics Docs: Consentless Analytics Platform"
description: "Documentation for Sealmetrics — consentless analytics that measures traffic without cookies and, by its own assessment, without consent banners, storing nothing that identifies anyone, designed for GDPR."
canonical_url: "https://docs.sealmetrics.com/intro"
lang: "en"
date_generated: "2026-10-08T17:47:47.862Z"
source_hash: "bf7c92b9a14567dd02a03aa5614ae77238db5ec1a8c1bbf57b5df7b704c8e1ef"
content_type: "documentation"
owner: "docs"
llm_priority: "critical"
source_file: "intro.mdx"
publisher: "Sealmetrics"
---

# Sealmetrics Docs: Consentless Analytics Platform

Canonical page: https://docs.sealmetrics.com/intro

This documentation covers everything you need to run **Sealmetrics**, the consentless web analytics platform that measures your traffic without cookies, persistent identifiers, or (by our self-assessment) consent banners. It spans getting started, tracker implementation, reports, the API reference, and legal compliance — so you can install tracking, measure conversions, and check how Sealmetrics fits GDPR.

## Explore the Docs

---

## What is Sealmetrics?

Sealmetrics is a **consentless web analytics platform** that measures your traffic without cookies, persistent identifiers, or (by our self-assessment) consent banners. Traditional analytics tools like Google Analytics do not record the visitors who reject or ignore the cookie banner, and how much that costs is specific to each site. In the [Incapto case](https://sealmetrics.com/case-studies/incapto/) — one Shopify store using Consent Mode, both tools on the same site and the same days (14 June–31 July 2026) — GA4 did not record 29% of real visits and 45% of pageviews, while Sealmetrics recorded 95.7% of the store's real online orders. That is one store, not a benchmark: measure your own gap side by side. Sealmetrics does not ask for consent for its own analytics, so that loss does not apply. That is our self-assessment, not a certification; in Germany it is an open question, because the DSK does not extend §25(2) TDDDG to audience measurement and the tracker reads device properties via JavaScript, which may count as "access" under §25(1) — see [Germany](/compliance/germany-ttdsg-self-assessment).

**How it works:** Sealmetrics records [a small set of non-identifying fields](/security-privacy/what-we-track) per hit and groups hits into sessions with an ephemeral identifier that is re-keyed every day and, once rotated, cannot be reconstructed — not even by Sealmetrics ([how it works](/security-privacy/how-consentless-works)). No IP addresses are retained, no cookies are set, nothing is stored on the visitor's device, and no persistent or stored fingerprint exists — nothing stored can link a device across days. During the day that identifier is pseudonymised data processed under legitimate interest (GDPR Art. 6(1)(f)), with the per-hit log purged after one day; reports are always aggregated. Sealmetrics has self-assessed against the audience-measurement criteria published by [CNIL](/compliance/cnil-self-assessment) ([sheet n°16](https://www.cnil.fr/en/sheet-ndeg16-use-analytics-your-websites-and-applications)) and [AEPD](https://www.aepd.es/guias/guia-cookies-analiticas-externas.pdf); no supervisory authority certifies analytics tools.

**Key capabilities:**
- **No consent-driven data loss** — visits are measured without a consent banner (self-assessed; Germany: open question)
- **Conversion and revenue tracking** — attribute sales to campaigns via UTM parameters
- **Funnel analysis** — visualize user progression through conversion steps
- **Real-time dashboards** — daily aggregates that update continuously
- **1.1 KB tracker script** — [measured](/guides/tracker-performance-report), gzipped
- **EU data residency** — all data processed and stored in European infrastructure

Sealmetrics is used by ecommerce brands, SaaS companies, and hospitality businesses across Europe that need accurate traffic data with less legal exposure than consent-based tools. See the [full comparison with GA4](/faq/ga4-vs-sealmetrics) or [Plausible](/blog/sealmetrics-vs-plausible).

---

*Ready to see what your consent banner is hiding? [Open your free account](https://my.sealmetrics.com/register) — your first 1M events are free — or [visit sealmetrics.com](https://sealmetrics.com) to learn more.*

**Note:**
- Sealmetrics measures traffic without cookies, persistent identifiers or (by our self-assessment; Germany: open question) consent banners, so banner rejection does not remove visits; consent-based tools miss the visitors who reject the banner, by an amount specific to each site — measure it side by side.
- Nothing is stored on the device and no data that identifies anyone is kept: the session identifier rotates daily and cannot be reconstructed afterwards, and reports are aggregated; the compliance pages are self-assessments — no supervisory authority certifies analytics tools.
- The tracker script is 1.1 KB and all analytics data is processed and stored in European infrastructure.
