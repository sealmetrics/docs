---
title: "GDPR and ePrivacy"
description: "How the ePrivacy consent rule and the GDPR apply to a session identifier that rotates daily, the legitimate-interest basis, and when a session ID does or does not require consent."
canonical_url: "https://docs.sealmetrics.com/legal/gdpr-and-eprivacy"
lang: "en"
date_generated: "2026-10-08T17:05:41.082Z"
source_hash: "b381b428ff2e657e6efc2ca723ab86428e169d3b5b03ad60d29d43a11ff09422"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "compliance/GDPR-and-ePrivacy/index.mdx"
publisher: "Sealmetrics"
---

# GDPR and ePrivacy

Canonical page: https://docs.sealmetrics.com/legal/gdpr-and-eprivacy

Learn about GDPR and ePrivacy compliance with Sealmetrics. This section addresses the legal framework that enables consentless analytics in the European Union.

Two separate rules decide whether analytics needs consent: the [ePrivacy Directive](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32002L0058) (Article 5(3)) governs what you store on or read from the device, and the [GDPR](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679) (Article 4(1)) governs the processing of personal data. Nothing is written to the device, and nothing stored identifies anyone; the session identifier is pseudonymised data processed under legitimate interest (GDPR Art. 6(1)(f)) and unrecoverable after its daily rotation. The tracker does read standard browser properties to compute a session identifier (re-keyed daily on the server, never stored as sent), so on the ePrivacy side Sealmetrics relies on the audience-measurement exemption criteria rather than on nothing being read. These pages explain how the session identifier fits into that framework and when a session identifier does require consent.

## Available Documentation

- [Do Session IDs Require Consent](/legal/gdpr-and-eprivacy/do-session-ids-require-consent) - Legal analysis of session-based tracking under GDPR and ePrivacy
