---
title: "Consentless Analytics"
description: "Why Sealmetrics needs no consent banner — no cookies, no fingerprinting, no personal data, and what exactly is recorded on each hit."
canonical_url: "https://docs.sealmetrics.com/faq/consentless-analytics"
lang: "en"
date_generated: "2026-08-11T17:21:23.786Z"
source_hash: "8f09e445657f5ae8eba7d8c3e5b58d73512f43bc8d682af02610afcc660e2040"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "faq/consentless-analytics.mdx"
publisher: "Sealmetrics"
---

# Consentless Analytics

Canonical page: https://docs.sealmetrics.com/faq/consentless-analytics

## How can Sealmetrics measure without consent?

Because there is nothing to consent to. Sealmetrics is a cookieless tracking system: no cookies, no fingerprinting, no cross-session tracking, no personal data. We measure isolated hits (page views), not user journeys.

ePrivacy requires consent for storing or reading information on a device. Sealmetrics stores nothing on the device, so the consent requirement does not attach. GDPR obligations for personal data do not attach either, because no personal data is collected.

We follow the measurement guidelines published by the AEPD and CNIL. Note that no supervisory authority certifies or approves analytics tools — our [compliance pages](/compliance) are self-assessments against the published criteria, not third-party validations.

---

## Do you track users anonymously?

No.
We do not track users individually, even anonymously.

Every interaction is treated as a standalone hit.
There is no reconstruction of journeys, no profiling, no identification.

---

## What makes Sealmetrics compliant?

For each hit, Sealmetrics records:

- Timestamp
- URL
- Referral URL
- User Agent — the raw string is purged after 1 day; only anonymous device categories persist in aggregates

No IP address
No persistent identifiers
No device fingerprinting

With no personal data collected and nothing written to the visitor's device, there is no consent to obtain under ePrivacy and no personal-data processing under GDPR. See the [compliance self-assessments](/compliance) for the framework-by-framework analysis.

---

## Why does consentless analytics require aggregated measurement?

Because ePrivacy requires consent for any technology that tracks users across sessions.
Sealmetrics avoids this by **not linking hits**, so no cross-session tracking takes place.

---

## Related documentation

- [How consentless analytics works](/security-privacy/consentless-analytics) — the model and its legal basis in detail.
- [What we track](/security-privacy/what-we-track) — every variable we record, field by field, with retention.
- [Compliance self-assessments](/compliance) — GDPR, ePrivacy, CNIL, AEPD, PECR analysed one by one.
