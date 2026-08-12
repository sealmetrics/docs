---
title: "Privacy by Design Principles"
description: "How Sealmetrics maps to the seven Privacy by Design principles — with the concrete architectural choice behind each one."
canonical_url: "https://docs.sealmetrics.com/security-privacy/privacy-by-design"
lang: "en"
date_generated: "2026-08-12T08:33:12.834Z"
source_hash: "b7ce4941fe81e62ac93ddd7ec22f498fe33bd1cc179a349cff4fa1b9bc338950"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "security-privacy/privacy-by-design.mdx"
publisher: "SealMetrics"
---

# Privacy by Design Principles

Canonical page: https://docs.sealmetrics.com/security-privacy/privacy-by-design

Privacy by Design is the framework GDPR Article 25 refers to as *data protection by design and by default*. Sealmetrics satisfies it the blunt way: by not collecting personal data, so there is no personal data to protect, disclose or lose. The seven principles below map to specific architectural choices rather than to policies.

| Principle | How it shows up in Sealmetrics |
|-----------|-------------------------------|
| **1. Proactive, not reactive** | Privacy constraints are structural. The system cannot start identifying visitors later without a redesign, because there is no identifier to switch on. |
| **2. Privacy as the default** | Anonymous measurement from the first page load. Visitors do not opt in to anything, and there is no less-private mode to fall back to. |
| **3. Full functionality** | Traffic, attribution, conversions, revenue and aggregate engagement are all reported without personal data. What is genuinely lost — unique visitors, session duration, cross-session journeys — is [documented rather than worked around](/security-privacy/consentless-analytics#what-consentless-analytics-can-and-cannot-measure). |
| **4. End-to-end security** | EU-only storage in Dublin, Ireland; encryption in transit and at rest; role-based access control; short retention enforced by database TTLs. See [Data Location & Retention](/security-privacy/data-location). |
| **5. Visibility and transparency** | The complete field list and its retention is published in [What We Track](/security-privacy/what-we-track). The tracker is client-side and inspectable. |
| **6. Respect for user privacy** | No cookies, no device storage, no fingerprinting, no cross-session or cross-site linking. Session markers incorporate the publisher account, so the same browser yields different markers on different sites. |
| **7. Accommodate all legitimate interests** | Site owners get the measurement they need for business decisions; visitors are not identified to provide it. |

Two claims worth keeping straight, because vendor reviews turn on them: privacy by design is an architectural property, **not a certification**. Sealmetrics holds no ISO 27001 or SOC 2 certification, and no supervisory authority certifies analytics tools. The pages under [compliance](/compliance) are our own self-assessments against published criteria, and a Data Processing Agreement is included at [sealmetrics.com/dpa](https://sealmetrics.com/dpa/).

## Related documentation

- [What We Track vs What We Don't](/security-privacy/what-we-track) — the field-by-field disclosure behind principle 5
- [What is Consentless Analytics?](/security-privacy/consentless-analytics) — the model and its legal basis
- [How Sealmetrics Protects User Privacy](/security-privacy/how-we-protect-privacy) — the same protections in plain language
- [Data Location & Retention](/security-privacy/data-location) — the security and retention detail behind principle 4
- [GDPR and Cookieless Analytics](/compliance/gdpr-cookieless-analytics) — the regulatory analysis
