---
title: "Sealmetrics vs Google Analytics 4: consent-based vs consentless measurement"
description: "GA4 needs cookies and consent, so it loses 15–60% of EU visitors. Sealmetrics measures every hit without cookies, IP storage or a banner, hosted in Dublin."
canonical_url: "https://docs.sealmetrics.com/compare/google-analytics-4"
lang: "en"
date_generated: "2026-09-04T11:01:07.053Z"
source_hash: "73f1a20cd1b22b0286145d6307773bd4f8d5c0c5bee37e76e33b409ef5ec2caf"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "compare/google-analytics-4.mdx"
publisher: "Sealmetrics"
---

# Sealmetrics vs Google Analytics 4: consent-based vs consentless measurement

Canonical page: https://docs.sealmetrics.com/compare/google-analytics-4

Sealmetrics and Google Analytics 4 are both web analytics tools that report traffic, sources, conversions and revenue. The main difference is the identifier: GA4 relies on a first-party cookie and therefore on visitor consent in the EU, while Sealmetrics sets no cookie, stores no IP address and needs no banner. In practice that means GA4 reports the visitors who accepted the banner, and Sealmetrics reports all of them.

## Side-by-side

Google facts checked 2026-09-04 on Google's own help pages; each row links to the page it was read on.

| Criterion | Sealmetrics | Google Analytics 4 |
|---|---|---|
| Company / HQ | Sealmetrics, EU company | Google LLC, Mountain View, USA; Google Ireland Limited for EEA users ([source](https://policies.google.com/privacy)) |
| Hosting model | Managed cloud only | Managed cloud only ([source](https://support.google.com/analytics/answer/6004245)) |
| Identifier between pageviews | In-memory session marker, ~2 h, not derived from IP; no cookies or localStorage ([details](/security-privacy/what-we-track)) | First-party cookie `_ga` with a 2-year default expiry, used "to distinguish users" ([source](https://support.google.com/analytics/answer/11397207)) |
| Visitor IP address | Never stored; country derived from browser timezone ([details](/security-privacy/country-detection)) | Not logged or stored for EU/UK/CH users; used for geolocation and then discarded ([source](https://support.google.com/analytics/answer/12017362)) |
| Data residency | Dublin, Ireland only ([details](/security-privacy/data-location)) | EU device data collected on EU servers "before forwarding traffic to Analytics servers for processing"; final location not stated ([source](https://support.google.com/analytics/answer/12017362)) |
| Vendor's position on consent | No banner needed for measurement | Consent required for cookies "where legally required" under Google's EU User Consent Policy ([source](https://www.google.com/about/company/user-consent-policy/)) |
| Behaviour when consent is denied | Not applicable — every hit measured | Tags send cookieless pings; gaps filled by conversion and behavioural modelling ([source](https://support.google.com/analytics/answer/9976101)) |
| Script size (gzipped) | 1.1 KB ([measured](/guides/tracker-performance-report)) | Not published; Sealmetrics measured ~145 KB on 27 Aug 2026 ([method](/guides/tracker-performance-report)) |
| Free tier | 14-day free trial; no self-service free plan ([billing](/billing)) | Standard properties free; Analytics 360 paid with SLA ([source](https://support.google.com/analytics/answer/1070983)) |
| Data retention | 24 months, fixed for every plan | 2 or 14 months for event data; up to 50 months on 360 ([source](https://support.google.com/analytics/answer/7667196)) |

## How each one measures visitors

GA4 writes a client ID into the `_ga` cookie on the first pageview and reads it back on every later one. That single mechanism is what makes unique visitors, session duration, cross-session journeys and audience lists possible — and it is also what puts GA4 inside the scope of the ePrivacy Directive's consent requirement. Google's own policy requires legally valid consent for cookies where the law demands it, and when a visitor declines, GA4 falls back to cookieless pings and statistical modelling rather than measurement.

Sealmetrics records four non-identifying variables per hit — timestamp, user agent, current URL and referral URL — plus a session marker that lives in memory for roughly two hours and is never written to the device. Nothing is stored on the visitor's browser, the IP is used only in memory for anti-abuse checks, and the country comes from the browser's timezone. Because no personal data is stored, there is nothing for a banner to ask permission for. The cost of that design is fixed: no unique visitors, no session duration, no exit pages, no user journeys.

## When Google Analytics 4 is the better choice

- You optimise Google Ads with audience sync and automated bidding — Sealmetrics attributes campaigns via UTMs but does not push audiences back to Google Ads.
- You need user-level analysis: cohorts, cross-device journeys, predictive metrics, or a BigQuery pipeline you have already built on GA4's event schema.
- Most of your traffic comes from markets where consent rejection is low, so the data gap that motivates a switch is small.

## When Sealmetrics is the better choice

- Your EU traffic is material and you are losing 15–60% of it to the banner — the exact share depends on sector, brand strength and traffic mix.
- Your DPO wants a short answer to "what personal data does the analytics tool process?" — the answer here is none, with a [DPA](https://sealmetrics.com/dpa/) ready to sign.
- Page weight matters: the tracker fits in a single TCP packet and fires before a visitor can abandon the page.

## Frequently asked questions

### Can I run GA4 and Sealmetrics at the same time?

Yes, and many teams do during a transition. The two scripts do not interfere, and running them side by side is the easiest way to see the size of the consent gap on your own traffic. The [GA4 migration checklist](/guides/ga4-migration-checklist) describes the parallel-run period.

### Does GA4 store IP addresses?

Google states that it does not log or store individual IP addresses from EU, UK or Swiss users, and that IP data is used for geolocation and then discarded. Sealmetrics goes one step further: the IP is never used for geolocation at all — country comes from the browser timezone.

### Why does GA4 show more Direct traffic than Sealmetrics?

When a visitor arrives from a campaign and declines the banner, GA4 cannot set its attribution cookie, so the visit is filed as Direct. Sealmetrics reads UTM parameters on arrival without any cookie, so attribution does not depend on the banner outcome.

### Is Sealmetrics less detailed than GA4?

For anything that requires following an individual — unique visitors, session duration, journeys — yes, by design. For aggregate traffic, conversions, revenue and attribution, Sealmetrics covers every visitor while GA4 covers the consenting subset.

**Note:**
- GA4's identifier is a 2-year cookie, so EU measurement depends on the banner; Sealmetrics uses no cookie and needs no banner.
- GA4 discards EU IPs after geolocation; Sealmetrics never uses the IP for geolocation and stores data only in Dublin.
- GA4 offers user-level analysis and Google Ads audience sync; Sealmetrics trades those for complete, consent-independent data.

## Related documentation

- [GA4 vs Sealmetrics — feature-by-feature FAQ](/faq/ga4-vs-sealmetrics)
- [GA4 to Sealmetrics migration checklist](/guides/ga4-migration-checklist)
- [Tracker performance report](/guides/tracker-performance-report)
- [What is Consentless Analytics?](/security-privacy/consentless-analytics)
