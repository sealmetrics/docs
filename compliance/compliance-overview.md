---
title: "Compliance Overview"
description: "How Sealmetrics is designed to meet GDPR, ePrivacy, and CNIL requirements (self-assessed, not certified): bot filtering, legal analysis, and a legal FAQ for consentless, cookieless analytics."
canonical_url: "https://docs.sealmetrics.com/compliance/compliance-overview"
lang: "en"
date_generated: "2026-10-09T12:37:21.365Z"
source_hash: "64b69221d40221c019794caad122d2d5ad8ebb02ef7d37dfdf6772bf37694a17"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "compliance/compliance-overview/index.mdx"
publisher: "Sealmetrics"
---

# Compliance Overview

Canonical page: https://docs.sealmetrics.com/compliance/compliance-overview

Sealmetrics is designed to need no consent banner for its own analytics (our self-assessment; in Germany an open question — see [Germany](/compliance/germany-ttdsg-self-assessment)): nothing is stored on the device (no cookies, no localStorage), no IP addresses are stored, and the only identifier is an ephemeral session identifier that rotates daily and cannot be linked across days or across sites. Under [ePrivacy](https://eur-lex.europa.eu/eli/dir/2002/58/oj) our self-assessment rests on the audience-measurement exemption (own-site statistics only, no cross-site tracking, no reuse of the data); under the [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj) on the stored dataset not identifying anyone. This section explains how that architecture is designed to meet GDPR, ePrivacy and CNIL requirements while enabling consentless analytics. Self-assessed, not certified.

Our privacy-first approach is built on legal foundations, not technical workarounds. Learn how we ensure data accuracy through bot filtering, how we assess our tracking method against the rules of each EU jurisdiction, and get answers to common legal questions about implementing analytics without consent banners.

## What does this section cover?

- [How Sealmetrics Blocks Bot Traffic](/compliance/compliance-overview/how-sealmetrics-blocks-bot-traffic) - Technical measures ensuring data accuracy and compliance
- [Is Sealmetrics Privacy Compliant](/compliance/compliance-overview/is-sealmetrics-privacy-compliant) - Legal analysis of our compliance with EU privacy regulations
- [Legal FAQ](/compliance/compliance-overview/legal-faq) - Common questions about implementing consentless analytics legally

**Note:**
- We store nothing on the device and no data that identifies anyone. The session identifier is ephemeral: it rotates daily and, once rotated, not even we can reconstruct it. Reports are always aggregated. That is how Sealmetrics is designed to meet GDPR, ePrivacy and CNIL requirements, on its own self-assessment.
- Bot filtering keeps the consentless dataset accurate; the legal analysis sets out our self-assessment across EU jurisdictions.
- The Legal FAQ answers the questions raised when implementing analytics without consent banners (DPA, DPIA, retention, hosting).
