---
title: "How Consentless Tracking Works"
description: "The mechanics of consentless tracking — a small set of non-identifying fields, isolated hits, a daily re-keyed session identifier, and EU-only aggregate storage."
canonical_url: "https://docs.sealmetrics.com/security-privacy/how-consentless-works"
lang: "en"
date_generated: "2026-09-21T08:45:24.602Z"
source_hash: "41a181dfa1755ffc813d0e6e156d26159b70e7d2a5841f330ca6690c5a01d094"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "security-privacy/how-consentless-works.mdx"
publisher: "Sealmetrics"
---

# How Consentless Tracking Works

Canonical page: https://docs.sealmetrics.com/security-privacy/how-consentless-works

Sealmetrics is a consentless analytics platform built on the aggregate, cookie-free tracking mechanics described below. It records events without a persistent visitor identifier and without writing anything to the visitor's device, which is what allows measurement to run without a consent banner.


Consentless tracking measures **events in aggregate instead of following people**. The tracker records a small set of non-identifying fields per hit — timestamp, user agent, current URL, referral URL, browser timezone and a session identifier (see [What We Track](/security-privacy/what-we-track)) — sends them to EU infrastructure, and never writes anything to the visitor's device. Nothing stored can identify a person or link a device across days.

## The mechanics, in four steps

1. **Event detection.** A JavaScript tracker (about 1.1 KB gzipped) fires on page load and on events you instrument. It sets no cookies and uses no localStorage or sessionStorage. It reads standard browser properties to compute the session identifier described below; that hash is never written to the device and never stored as sent.
2. **Transmission.** The hit is sent as a lightweight beacon request. The visitor's IP appears at the network layer, as it does for any HTTP request, but is never persisted in the analytics database — it is used in memory only for anti-abuse checks and site-configured exclusions.
3. **Isolated processing.** Each hit is processed on its own. Hits from the same person are never joined across sessions, so no journey or profile can be reconstructed.
4. **Aggregation.** Reports are built from aggregate counts. Event-level rows are purged after 1 day, and the raw user agent string is never stored — only the browser, OS and device categories derived from it; hourly aggregates are kept 90 days; daily aggregates and conversions 24 months. Retention is fixed for every plan and enforced by database TTLs.

All customer analytics data is stored and processed in **Dublin, Ireland (EU)**.

## Two measurement modes

**Isolated hits** — every page view is an independent, anonymous event with no link to any other event. This is the most privacy-preserving mode: pure aggregate counting.

**Session-marked hits** — a session identifier groups the hits of one visit (a two-hour inactivity window). The tracker computes it in the browser as a hash of standard device characteristics (a device fingerprint) combined with the publisher's account ID; it is never written to the device. On the server it is re-keyed with a daily salt that is destroyed on rotation, so the stored identifier changes every day, the raw hash is never stored, and a returning visitor cannot be recognised on another day. Because the account ID is part of the hash, the same browser produces different identifiers on different sites and no cross-site correlation is possible. This is what makes within-session metrics such as bounce rate and pages per session possible without a persistent identifier.

## Why this needs no consent

No personal data is collected, so the GDPR obligations that attach to personal data are not triggered ([Article 4(1) and Recital 26](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679)); and nothing is stored on the visitor's terminal equipment. The tracker does read standard browser properties to compute the session identifier, which engages the ePrivacy Directive's [Article 5(3)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32002L0058); see [Analytics Cookies: Consent Exemption Requirements](/compliance/analytics-cookies-exemption) for how the audience-measurement exemption criteria apply. Cookie-based tools face the opposite situation, which is why they typically lose a significant share of visitor data in EU markets when visitors decline, depending on sector, brand strength and traffic mix.

Sealmetrics holds no third-party security certification, and no supervisory authority certifies analytics tools — the [compliance pages](/compliance) are self-assessments against published criteria.

## Where to read the detail

- [What is Consentless Analytics?](/security-privacy/consentless-analytics) — the full concept, the legal basis, the comparison with cookie-based tools, and what the model can and cannot measure
- [What We Track vs What We Don't](/security-privacy/what-we-track) — every field recorded, with its retention
- [Data Location & Retention](/security-privacy/data-location) — EU hosting, complete retention schedule, encryption
- [How Attribution Works Without a User-ID](/security-privacy/attribution-without-userid) — last-click attribution mechanics
- [Installation](/implementation/tracker/installation) — adding the script tag and instrumenting conversions
- [Cookieless Tracking: Technical Deep Dive](/blog/cookieless-tracking-technical-deep-dive) — extended analysis of the architecture
