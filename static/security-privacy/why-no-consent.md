---
title: "Why Sealmetrics Can Measure Without Consent"
description: "Sealmetrics needs no consent banner because it collects no personal data and stores nothing on the visitor's device — the short version of the legal basis."
canonical_url: "https://docs.sealmetrics.com/security-privacy/why-no-consent"
lang: "en"
date_generated: "2026-08-12T08:33:12.834Z"
source_hash: "7eddf161645235ae4f7b50bf114328af2868145fc3b735846cfb1b97da4ffcff"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "security-privacy/why-no-consent.mdx"
publisher: "Sealmetrics"
---

# Why Sealmetrics Can Measure Without Consent

Canonical page: https://docs.sealmetrics.com/security-privacy/why-no-consent

Sealmetrics needs no consent banner because it collects **no personal data** and stores **nothing on the visitor's device**. Two separate rules are in play, and neither one attaches:

- **GDPR** governs the processing of personal data. Sealmetrics stores no IP address, no user ID, no persistent identifier and no profile, so the obligations that apply to personal data — including the consent question — are not triggered.
- **The ePrivacy Directive** (Article 5(3)) requires consent to store or read information on a user's terminal equipment. Sealmetrics sets no cookies and uses no localStorage or sessionStorage, so there is nothing on the device to ask about.

What Sealmetrics records instead is four non-identifying variables per hit: **timestamp**, **user agent** (used for anonymous device classification — the raw string is purged after 1 day, and only the derived browser/OS/device categories persist in aggregates for 24 months), **current URL** and **referral URL**. Hits are measured on their own; they are never joined to a person or linked across sessions.

This distinction matters more than it looks. Under ePrivacy, tracking individuals requires consent *even when the tracking is anonymous* — which is why moving tags server-side does not remove the consent requirement. Sealmetrics does not track individuals at all, which is a different thing from tracking them anonymously.

Both the CNIL (France) and the AEPD (Spain) have published criteria under which audience measurement can operate without consent, and Sealmetrics has self-assessed against them. To be clear about what that is and is not: no supervisory authority certifies or approves analytics tools, so the [compliance pages](/compliance) are our own assessments against published criteria, not third-party validations. Sealmetrics also holds no ISO 27001 or SOC 2 certification. A Data Processing Agreement is included and ready to sign at [sealmetrics.com/dpa](https://sealmetrics.com/dpa/).

## Related documentation

- [What is Consentless Analytics?](/security-privacy/consentless-analytics) — the full legal basis, with the GDPR and ePrivacy articles and the regulatory guidance
- [What We Track vs What We Don't](/security-privacy/what-we-track) — every variable recorded, with its retention
- [How Consentless Tracking Works](/security-privacy/how-consentless-works) — the technical mechanism
- [GDPR and Cookieless Analytics](/compliance/gdpr-cookieless-analytics) — the detailed regulatory analysis
- [Consentless Analytics FAQ](/faq/consentless-analytics) — the same question in Q&A form
