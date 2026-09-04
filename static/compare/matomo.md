---
title: "Sealmetrics vs Matomo: self-hosted open source vs managed consentless cloud"
description: "Matomo is GPL-licensed and self-hostable, but its cookieless mode hashes the visitor's IP. Sealmetrics never uses the IP and stores everything in Dublin."
canonical_url: "https://docs.sealmetrics.com/compare/matomo"
lang: "en"
date_generated: "2026-09-04T11:01:07.053Z"
source_hash: "9385f3d0aa50b6ecba1965336c2bc5a0539e517823651bc3328232f9fd11068c"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "compare/matomo.mdx"
publisher: "Sealmetrics"
---

# Sealmetrics vs Matomo: self-hosted open source vs managed consentless cloud

Canonical page: https://docs.sealmetrics.com/compare/matomo

Sealmetrics and Matomo are both European-hosted alternatives to Google Analytics that can run without cookies. The main difference is architecture: Matomo is GPL-licensed software you can self-host, whose cookieless mode still builds a daily identifier from the visitor's IP address; Sealmetrics is a managed cloud service that never derives any identifier from the IP and stores data only in Dublin.

## Side-by-side

Matomo facts checked 2026-09-04 on matomo.org; each row links to the page it was read on.

| Criterion | Sealmetrics | Matomo |
|---|---|---|
| Company / HQ | Sealmetrics, EU company | InnoCraft Limited, Wellington, New Zealand ([source](https://matomo.org/privacy-policy/)) |
| Hosting model | Managed cloud only | Matomo Cloud or self-hosted On-Premise ([source](https://matomo.org/pricing/)) |
| Licence | Proprietary | GNU GPL v3 or later ([source](https://matomo.org/free-software/)) |
| Identifier between pageviews | In-memory session marker, ~2 h, not derived from IP ([details](/security-privacy/what-we-track)) | Cookie by default; without cookies a `config_id` hashed from OS, browser, plugins, IP address and language, valid for one session and at most 24 h ([source](https://matomo.org/faq/general/how-is-the-visitor-config_id-processed/)) |
| Visitor IP address | Never stored; country from browser timezone ([details](/security-privacy/country-detection)) | Processed; "considered personal data, unless you have enabled the IP anonymisation to at least 2 bytes" ([source](https://matomo.org/faq/general/faq_18254/)) |
| Data residency | Dublin, Ireland only ([details](/security-privacy/data-location)) | Cloud: Frankfurt, Germany; On-Premise: your choice ([source](https://matomo.org/pricing/)) |
| Vendor's position on consent | No banner needed for measurement | "No need for cookie consent screens" once anonymisation techniques are configured ([source](https://matomo.org/gdpr-analytics/)); consent-free operation depends on a checklist of settings ([source](https://matomo.org/faq/new-to-piwik/how-do-i-use-matomo-analytics-without-consent-or-cookie-banner/)) |
| Accuracy without cookies | Designed for it — no unique-visitor metric to degrade | Unique and returning visitors "will be inaccurate" when cookies are disabled ([source](https://matomo.org/faq/general/faq_156/)) |
| Script size (gzipped) | 1.1 KB ([measured](/guides/tracker-performance-report)) | Not published; Sealmetrics measured ~46 KB on the vendor demo instance, 27 Aug 2026 — varies with installed plugins ([method](/guides/tracker-performance-report)) |
| Free tier | 14-day free trial; no self-service free plan ([billing](/billing)) | On-Premise free; Cloud has a free trial, paid plans from about €29/month — see [pricing](https://matomo.org/pricing/) |

## How each one measures visitors

Matomo's default is a first-party visitor cookie, which gives it GA-style unique and returning visitor counts. Switch cookies off and Matomo falls back to `config_id`: a hash of operating system, browser, plugins, IP address and language, seeded with a value that is discarded daily so the identifier cannot outlive 24 hours. Matomo's own FAQ is candid that unique-visitor reports become inaccurate in that mode, and its consent-free checklist asks you to truncate IPs, disable User ID, anonymise referrers and limit tracking to a single site.

Sealmetrics has no cookie mode to switch off. Every hit carries timestamp, user agent, URL and referrer, grouped within a visit by a session marker that exists only in memory for around two hours and includes nothing derived from the IP. The trade-off is that unique visitors are not reported at all — Sealmetrics uses entrances as the audience-size signal — but nothing degrades when a visitor blocks cookies, because nothing depended on them.

## When Matomo is the better choice

- You must run analytics on your own servers, in a specific country, or with no external processor at all — Sealmetrics is cloud-only.
- You want unique and returning visitor counts, visit duration and visitor logs, and are prepared to obtain consent for the cookie that makes them accurate.
- You want to read and modify the source, or extend the product with community plugins.

## When Sealmetrics is the better choice

- You want consent-free measurement without a configuration checklist — there is no IP masking to set, no cookie to disable, no User ID feature to leave off.
- You do not want any identifier derived from the IP address, even a daily-rotated hash.
- You want a light tracker: Matomo's script measured roughly 42 times heavier on the wire than Sealmetrics'.

## Frequently asked questions

### Is Matomo's cookieless mode the same as Sealmetrics' consentless design?

No. Matomo's cookieless mode still computes a visitor fingerprint (`config_id`) that includes the IP address, rotated daily. Sealmetrics computes no visitor fingerprint at all; its session marker is short-lived, in-memory and not derived from the IP.

### Where is Matomo Cloud data stored?

Matomo's pricing FAQ states that Cloud data is stored in Frankfurt, Germany. Self-hosted installations store data wherever you run them. Sealmetrics stores all customer analytics data in Dublin, Ireland, with no choice of region.

### Does Matomo require a cookie banner?

Matomo's position is that, with anonymisation configured, you can track visitors without a cookie consent screen, and it publishes a self-assessment against the French CNIL criteria. That is the vendor's assessment, not a regulator's approval — the same is true of Sealmetrics' own [CNIL self-assessment](/compliance/cnil-self-assessment).

### Can I import Matomo history into Sealmetrics?

No. Sealmetrics starts collecting from the day the tracker is installed and keeps 24 months of aggregates. Run both in parallel during the transition if you need continuity.

**Note:**
- Matomo is GPLv3 and self-hostable; Sealmetrics is a managed cloud in Dublin.
- Matomo's cookieless identifier is a daily hash that includes the IP; Sealmetrics derives nothing from the IP.
- Matomo gives you unique visitors with consent; Sealmetrics gives you every visitor without it.

## Related documentation

- [How Consentless Tracking Works](/security-privacy/how-consentless-works)
- [How Sealmetrics determines the country without IP addresses](/security-privacy/country-detection)
- [Tracker performance report](/guides/tracker-performance-report)
- [Data Location & Retention](/security-privacy/data-location)
