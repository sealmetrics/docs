---
title: "Why Sealmetrics Can Measure Without Consent"
description: "Sealmetrics needs no consent banner because it stores nothing on the visitor's device and no data that identifies anyone, and fits the audience-measurement exemption — the short version, as our self-assessment."
canonical_url: "https://docs.sealmetrics.com/security-privacy/why-no-consent"
lang: "en"
date_generated: "2026-10-09T12:37:21.365Z"
source_hash: "b7f4af686e8464e85895b1f75bd806093879b8aa386fdf1fe22c456db9ba1ff3"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "security-privacy/why-no-consent.mdx"
publisher: "Sealmetrics"
---

# Why Sealmetrics Can Measure Without Consent

Canonical page: https://docs.sealmetrics.com/security-privacy/why-no-consent

In our self-assessment, Sealmetrics needs no consent banner because it stores **nothing on the visitor's device** and **no data that identifies anyone**: the session identifier is ephemeral — it rotates daily and, once rotated, not even we can reconstruct it — and reports are always aggregated. Two separate rules are in play:

- **GDPR** ([Article 4(1), Recital 26](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679)) governs the processing of personal data. Sealmetrics stores no IP address, no user ID, no persistent identifier and no profile. During the day the session identifier is pseudonymised data, processed under legitimate interest (Art. 6(1)(f)) rather than consent; the per-hit log is purged after one day and the identifier becomes unrecoverable when the daily salt rotates.
- **The ePrivacy Directive** ([Article 5(3)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32002L0058)) requires consent to store or read information on a user's terminal equipment, unless an exemption applies. Sealmetrics sets no cookies and uses no localStorage or sessionStorage, so nothing is stored on the device. The tracker does read standard browser properties to compute a session identifier, which engages Article 5(3); the consent exemption rests on the audience-measurement criteria described below — see [Analytics Cookies: Consent Exemption Requirements](/compliance/analytics-cookies-exemption).

What Sealmetrics records instead is a small set of non-identifying fields per hit: **timestamp**, **user agent** (used for device classification — the raw string is used in flight and never written to storage, and only the derived browser/OS/device categories persist in aggregates for 24 months), **current URL**, **referral URL**, **browser timezone** (for the country) and a **session identifier** that is re-keyed every day with a salt destroyed on rotation, so it cannot link a device across days. Hits are never joined to a person or linked across sessions — see [What We Track](/security-privacy/what-we-track) for the full list.

This distinction matters more than it looks. Under ePrivacy, tracking individuals requires consent *even when the tracking is anonymous* — which is why moving tags server-side does not remove the consent requirement. Sealmetrics does not track individuals at all, which is a different thing from tracking them anonymously.

Both the [CNIL (France)](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience) and the [AEPD (Spain)](https://www.aepd.es/guias/guia-cookies.pdf) have published criteria under which audience measurement can operate without consent, and Sealmetrics has self-assessed against them. To be clear about what that is and is not: no supervisory authority certifies or approves analytics tools, so the [compliance pages](/compliance) are our own assessments against published criteria, not third-party validations. Sealmetrics also holds no ISO 27001 or SOC 2 certification.

Germany is an open question rather than a settled yes: the DSK does not extend the §25(2) TDDDG exemption to audience measurement, and because the tracker reads device properties via JavaScript, that read may count as "access" under §25(1) TDDDG (EDPB Guidelines 2/2023 read access broadly). If you operate in Germany, check with your DPO or counsel. A Data Processing Agreement is included and ready to sign at [sealmetrics.com/dpa](https://sealmetrics.com/dpa/).

## Primary sources

- GDPR (Regulation 2016/679) — Art. 4(1) defines personal data; Recital 26 excludes anonymous data — [eur-lex](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679)
- ePrivacy Directive 2002/58/EC — Art. 5(3): consent to store or access terminal-equipment data — [eur-lex](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32002L0058)
- EDPB Guidelines 2/2023 — technical scope of Art. 5(3), including server-side and pixel tracking — [edpb.europa.eu](https://edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-22023-technical-scope-art-53-eprivacy-directive_en)
- CNIL — audience-measurement exemption criteria for consent-free analytics — [cnil.fr](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience)
- AEPD — Guía sobre el uso de las cookies, analytics-cookie exemption conditions — [aepd.es](https://www.aepd.es/guias/guia-cookies.pdf)

## Related documentation

- [What is Consentless Analytics?](/security-privacy/consentless-analytics) — the full reasoning, with the GDPR and ePrivacy articles and the regulatory guidance
- [What We Track vs What We Don't](/security-privacy/what-we-track) — every variable recorded, with its retention
- [How Consentless Tracking Works](/security-privacy/how-consentless-works) — the technical mechanism
- [GDPR and Cookieless Analytics](/compliance/gdpr-cookieless-analytics) — the detailed regulatory analysis
- [Consentless Analytics FAQ](/faq/consentless-analytics) — the same question in Q&A form
