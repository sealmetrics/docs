---
title: "GDPR and ePrivacy"
description: "Why a dataset with no personal data sits outside the GDPR, how the ePrivacy consent rule works, and when a session ID does or does not require consent."
canonical_url: "https://docs.sealmetrics.com/legal/gdpr-and-eprivacy"
lang: "en"
date_generated: "2026-09-21T08:45:24.602Z"
source_hash: "18593ca9aad1626e6e85f426734b12ad51f39a8740fa65c122d33497ccc06c9c"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "compliance/GDPR-and-ePrivacy/index.mdx"
publisher: "Sealmetrics"
---

# GDPR and ePrivacy

Canonical page: https://docs.sealmetrics.com/legal/gdpr-and-eprivacy

Learn about GDPR and ePrivacy compliance with Sealmetrics. This section addresses the legal framework that enables consentless analytics in the European Union.

Two separate rules decide whether analytics needs consent: the [ePrivacy Directive](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32002L0058) (Article 5(3)) governs what you store on or read from the device, and the [GDPR](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679) (Article 4(1)) governs the processing of personal data. Nothing is written to the device, and the stored dataset holds no personal data. The tracker does read standard browser properties to compute a session identifier (re-keyed daily on the server, never stored as sent), so on the ePrivacy side Sealmetrics relies on the audience-measurement exemption criteria rather than on nothing being read. These pages explain how the session identifier fits into that framework and when a session identifier does require consent.

## Available Documentation

- [Do Session IDs Require Consent](/legal/gdpr-and-eprivacy/do-session-ids-require-consent) - Legal analysis of session-based tracking under GDPR and ePrivacy
