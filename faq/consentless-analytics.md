---
title: "Consentless Analytics"
description: "Why, on our self-assessment, Sealmetrics needs no consent banner for its own analytics (Germany is an open question) — no cookies, nothing stored on the device, a session identifier that rotates daily, and what exactly is recorded on each hit."
canonical_url: "https://docs.sealmetrics.com/faq/consentless-analytics"
lang: "en"
date_generated: "2026-10-08T17:05:41.082Z"
source_hash: "a038e6222d0450179ddeededc498d1562e6cb58cb20c375469a600a374b4f4f9"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "faq/consentless-analytics.mdx"
publisher: "Sealmetrics"
---

# Consentless Analytics

Canonical page: https://docs.sealmetrics.com/faq/consentless-analytics

## How can Sealmetrics measure without consent?

We store nothing on the device and no data that identifies anyone. The session identifier is ephemeral: it rotates daily and, once rotated, not even we can reconstruct it. Reports are always aggregated. Sealmetrics is a cookieless tracking system: no cookies, no stored or persistent fingerprint, no cross-session tracking. We measure hits (page views), not user journeys.

[ePrivacy](https://eur-lex.europa.eu/eli/dir/2002/58/oj) requires consent for storing or reading information on a device, unless an exemption applies. Sealmetrics stores nothing on the device. The tracker does read standard browser properties to compute a session identifier; for that, Sealmetrics relies on the audience-measurement exemption criteria — see [Analytics Cookies: Consent Exemption Requirements](/compliance/analytics-cookies-exemption). Under GDPR, the session identifier is pseudonymised data while the day's salt exists; it is processed under legitimate interest (Article 6(1)(f)) and becomes unrecoverable at the daily rotation. On that basis our self-assessment is that no consent banner is needed for Sealmetrics' own analytics; in Germany that is an open question, because the DSK does not extend §25(2) TDDDG to audience measurement and reading device properties may count as "access" under §25(1) — see [Germany](/compliance/germany-ttdsg-self-assessment).

We follow the measurement guidelines published by the AEPD and [CNIL](https://www.cnil.fr/en/sheet-ndeg16-use-analytics-your-websites-and-applications). Note that no supervisory authority certifies or approves analytics tools — our [compliance pages](/compliance) are self-assessments against the published criteria, not third-party validations.

---

## Do you track users anonymously?

No.
We do not track users individually, even anonymously.

Hits are grouped only within a single session, by an identifier that is re-keyed every day; nothing links them across days or sessions.
There is no reconstruction of journeys, no profiling, no identification.

---

## What makes Sealmetrics compliant?

For each hit, Sealmetrics records:

- Timestamp
- URL
- Referral URL
- User Agent — the raw string is never written to storage; only device categories persist, in aggregated reports
- Browser timezone — used to assign the country
- Session identifier — re-keyed every day; it cannot link a device across days

No IP address
No persistent identifiers
No stored or persistent device fingerprint

Under GDPR this is minimal, pseudonymised data, processed under legitimate interest (Article 6(1)(f)) and unrecoverable after the daily rotation; the per-hit log is purged after 1 day. Nothing is written to the visitor's device; the tracker's reading of standard browser properties for the session identifier relies on the ePrivacy audience-measurement exemption criteria. See the [compliance self-assessments](/compliance) for the framework-by-framework analysis.

---

## Why does consentless analytics require aggregated measurement?

Because ePrivacy requires consent for any technology that tracks users across sessions.
Sealmetrics avoids this by **not linking hits across sessions or days**, so no cross-session tracking takes place.

---

**Note:**
- Sealmetrics needs no consent because nothing is stored on the device and its reading of browser properties for the session identifier meets the audience-measurement exemption criteria (ePrivacy), on our own assessment; under GDPR the daily-rotating, pseudonymised identifier is processed under legitimate interest.
- Each hit records only timestamp, URL, referral URL, user agent (raw string never written to storage), browser timezone and a daily re-keyed session identifier — no IP address, no persistent identifiers, no stored fingerprint.
- Hits are never linked across sessions or days, so there is no cross-session tracking; the compliance pages are self-assessments, not supervisory-authority validations.

## Related documentation

- [How consentless analytics works](/security-privacy/consentless-analytics) — the model and its legal basis in detail.
- [What we track](/security-privacy/what-we-track) — every variable we record, field by field, with retention.
- [Compliance self-assessments](/compliance) — GDPR, ePrivacy, CNIL, AEPD, PECR analysed one by one.
