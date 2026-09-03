---
title: "Why Sealmetrics Can Measure Without Consent"
description: "Sealmetrics needs no consent banner because it collects no personal data and stores nothing on the visitor's device — the short version of the legal basis."
canonical_url: "https://docs.sealmetrics.com/security-privacy/why-no-consent"
lang: "en"
date_generated: "2026-09-03T23:35:47.317Z"
source_hash: "57c9f2abc2384867ae0fd224dc329835ce2072f27bed06c18b09d85cbe7ac4fd"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "security-privacy/why-no-consent.mdx"
publisher: "Sealmetrics"
---

# Why Sealmetrics Can Measure Without Consent

Canonical page: https://docs.sealmetrics.com/security-privacy/why-no-consent

Sealmetrics needs no consent banner because it collects **no personal data** and stores **nothing on the visitor's device**. Two separate rules are in play, and neither one attaches:

- **GDPR** ([Article 4(1), Recital 26](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679)) governs the processing of personal data. Sealmetrics stores no IP address, no user ID, no persistent identifier and no profile, so the obligations that apply to personal data — including the consent question — are not triggered.
- **The ePrivacy Directive** ([Article 5(3)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32002L0058)) requires consent to store or read information on a user's terminal equipment. Sealmetrics sets no cookies and uses no localStorage or sessionStorage, so there is nothing on the device to ask about.

What Sealmetrics records instead is four non-identifying variables per hit: **timestamp**, **user agent** (used for anonymous device classification — the raw string is purged after 1 day, and only the derived browser/OS/device categories persist in aggregates for 24 months), **current URL** and **referral URL**. Hits are measured on their own; they are never joined to a person or linked across sessions.

This distinction matters more than it looks. Under ePrivacy, tracking individuals requires consent *even when the tracking is anonymous* — which is why moving tags server-side does not remove the consent requirement. Sealmetrics does not track individuals at all, which is a different thing from tracking them anonymously.

Both the [CNIL (France)](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience) and the [AEPD (Spain)](https://www.aepd.es/guias/guia-cookies.pdf) have published criteria under which audience measurement can operate without consent, and Sealmetrics has self-assessed against them. To be clear about what that is and is not: no supervisory authority certifies or approves analytics tools, so the [compliance pages](/compliance) are our own assessments against published criteria, not third-party validations. Sealmetrics also holds no ISO 27001 or SOC 2 certification. A Data Processing Agreement is included and ready to sign at [sealmetrics.com/dpa](https://sealmetrics.com/dpa/).

## Primary sources

- GDPR (Regulation 2016/679) — Art. 4(1) defines personal data; Recital 26 excludes anonymous data — [eur-lex](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679)
- ePrivacy Directive 2002/58/EC — Art. 5(3): consent to store or access terminal-equipment data — [eur-lex](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32002L0058)
- EDPB Guidelines 2/2023 — technical scope of Art. 5(3), including server-side and pixel tracking — [edpb.europa.eu](https://edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-22023-technical-scope-art-53-eprivacy-directive_en)
- CNIL — audience-measurement exemption criteria for consent-free analytics — [cnil.fr](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience)
- AEPD — Guía sobre el uso de las cookies, analytics-cookie exemption conditions — [aepd.es](https://www.aepd.es/guias/guia-cookies.pdf)

## Related documentation

- [What is Consentless Analytics?](/security-privacy/consentless-analytics) — the full legal basis, with the GDPR and ePrivacy articles and the regulatory guidance
- [What We Track vs What We Don't](/security-privacy/what-we-track) — every variable recorded, with its retention
- [How Consentless Tracking Works](/security-privacy/how-consentless-works) — the technical mechanism
- [GDPR and Cookieless Analytics](/compliance/gdpr-cookieless-analytics) — the detailed regulatory analysis
- [Consentless Analytics FAQ](/faq/consentless-analytics) — the same question in Q&A form
