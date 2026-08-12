---
title: "How Consentless Tracking Works"
description: "The mechanics of consentless tracking — four non-identifying variables, isolated hits, a short-lived session marker, and EU-only aggregate storage."
canonical_url: "https://docs.sealmetrics.com/security-privacy/how-consentless-works"
lang: "en"
date_generated: "2026-08-12T08:53:56.085Z"
source_hash: "f166240c487bb0190eea8615775fc7d55d7bef3b4187d1fea9cff1fdb0f7fbc6"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "security-privacy/how-consentless-works.mdx"
publisher: "SealMetrics"
---

# How Consentless Tracking Works

Canonical page: https://docs.sealmetrics.com/security-privacy/how-consentless-works

Consentless tracking measures **events in aggregate instead of following people**. The tracker records four non-identifying variables per hit — timestamp, user agent, current URL and referral URL — sends them to EU infrastructure, and never writes anything to the visitor's device. Because there is no identifier and nothing stored on the device, there is nothing to ask consent for.

## The mechanics, in four steps

1. **Event detection.** A JavaScript tracker (1.3 KB gzipped) fires on page load and on events you instrument. It sets no cookies and uses no localStorage, sessionStorage or fingerprinting.
2. **Transmission.** The hit is sent as a lightweight beacon request. The visitor's IP appears at the network layer, as it does for any HTTP request, but is never persisted in the analytics database — it is used in memory only for anti-abuse checks and site-configured exclusions.
3. **Isolated processing.** Each hit is processed on its own. Hits from the same person are never joined across sessions, so no journey or profile can be reconstructed.
4. **Aggregation.** Reports are built from aggregate counts. Event-level rows — including the raw user agent string — are purged after 1 day; hourly aggregates are kept 90 days; daily aggregates and conversions 24 months. Retention is fixed for every plan and enforced by database TTLs.

All customer analytics data is stored and processed in **Dublin, Ireland (EU)**.

## Two measurement modes

**Isolated hits** — every page view is an independent, anonymous event with no link to any other event. This is the most privacy-preserving mode: pure aggregate counting.

**Session-marked hits** — a short-lived, context-derived marker groups the hits of one visit (roughly a two-hour inactivity window). It is held in memory, never written to the device, and cannot recognise a returning visitor. Markers incorporate the publisher account, so the same browser produces different markers on different sites and no cross-site correlation is possible. This is what makes within-session metrics such as bounce rate and pages per session possible without an identifier.

## Why this needs no consent

No personal data is collected, so the GDPR obligations that attach to personal data are not triggered; and nothing is stored on or read from the visitor's terminal equipment, so the ePrivacy Directive's Article 5(3) consent requirement does not attach either. Cookie-based tools face the opposite situation, which is why they typically lose **15–60% of visitor data** in EU markets when visitors decline, depending on sector, brand strength and traffic mix.

Sealmetrics holds no third-party security certification, and no supervisory authority certifies analytics tools — the [compliance pages](/compliance) are self-assessments against published criteria.

## Where to read the detail

- [What is Consentless Analytics?](/security-privacy/consentless-analytics) — the full concept, the legal basis, the comparison with cookie-based tools, and what the model can and cannot measure
- [What We Track vs What We Don't](/security-privacy/what-we-track) — every field recorded, with its retention
- [Data Location & Retention](/security-privacy/data-location) — EU hosting, complete retention schedule, encryption
- [How Attribution Works Without a User-ID](/security-privacy/attribution-without-userid) — last-click attribution mechanics
- [Installation](/implementation/tracker/installation) — adding the script tag and instrumenting conversions
- [Cookieless Tracking: Technical Deep Dive](/blog/cookieless-tracking-technical-deep-dive) — extended analysis of the architecture
