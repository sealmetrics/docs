---
title: "Consentless Analytics"
description: "Why Sealmetrics needs no consent banner — no cookies, no fingerprinting, no personal data, and what exactly is recorded on each hit."
canonical_url: "https://docs.sealmetrics.com/faq/consentless-analytics"
lang: "en"
date_generated: "2026-09-03T23:47:35.161Z"
source_hash: "c7aef790132603de8320a5ba6cf84c6d2f4f578cb722284a7bce1ac26b152c46"
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

[ePrivacy](https://eur-lex.europa.eu/eli/dir/2002/58/oj) requires consent for storing or reading information on a device. Sealmetrics stores nothing on the device, so the consent requirement does not attach. GDPR obligations for personal data do not attach either, because no personal data is collected.

We follow the measurement guidelines published by the AEPD and [CNIL](https://www.cnil.fr/en/sheet-ndeg16-use-analytics-your-websites-and-applications). Note that no supervisory authority certifies or approves analytics tools — our [compliance pages](/compliance) are self-assessments against the published criteria, not third-party validations.

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

**Note:**
- Sealmetrics needs no consent because nothing is stored on the device (ePrivacy) and no personal data is collected (GDPR).
- Each hit records only timestamp, URL, referral URL and user agent (raw string purged after 1 day) — no IP address, no persistent identifiers, no fingerprinting.
- Hits are never linked, so there is no cross-session tracking; the compliance pages are self-assessments, not supervisory-authority validations.

## Related documentation

- [How consentless analytics works](/security-privacy/consentless-analytics) — the model and its legal basis in detail.
- [What we track](/security-privacy/what-we-track) — every variable we record, field by field, with retention.
- [Compliance self-assessments](/compliance) — GDPR, ePrivacy, CNIL, AEPD, PECR analysed one by one.
