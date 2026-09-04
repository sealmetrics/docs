---
title: "How Sealmetrics Protects User Privacy"
description: "The concrete protections behind Sealmetrics — no cookies, no persistent identifiers, no stored IP addresses, EU-only storage and short retention."
canonical_url: "https://docs.sealmetrics.com/security-privacy/how-we-protect-privacy"
lang: "en"
date_generated: "2026-09-04T00:07:24.876Z"
source_hash: "79fc5909aef386371f61741bd3bb9326845f16d8fe5be114978a9984635339f7"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "security-privacy/how-we-protect-privacy.mdx"
publisher: "Sealmetrics"
---

# How Sealmetrics Protects User Privacy

Canonical page: https://docs.sealmetrics.com/security-privacy/how-we-protect-privacy

Sealmetrics does not collect the data that would put visitors at risk in the first place — **that is how it protects their privacy**. The protection is architectural rather than procedural: there is no personal data to secure, disclose, leak or hand over, because none is collected.

## How does that protection work in practice?

In practice that means four things:

- **Nothing is written to the visitor's device.** No cookies, no localStorage, no sessionStorage, no fingerprinting. The session marker used to group hits within one visit is held in memory, expires with the visit, and cannot recognise a returning visitor.
- **No identifier is stored.** No IP addresses in the analytics database (they are used in memory only for anti-abuse checks and site-configured exclusions), no user IDs, no device IDs, no cross-session or cross-device linking. The user agent is kept for anonymous device classification only — the raw string for 1 day, then only the derived browser/OS/device categories inside aggregates.
- **Data is minimised, then aged out.** Event-level rows are purged after 1 day, hourly aggregates after 90 days, daily aggregates and conversions after 24 months. Retention is fixed for every plan and enforced by database TTLs.
- **Storage stays in the EU.** All customer analytics data is stored and processed in Dublin, Ireland, encrypted in transit and at rest, under role-based access control.

## What happens with data subject requests?

Because visitor analytics data carries no identifier, a visitor access or deletion request cannot be matched to any record — there is nothing tied to an individual to produce or erase. Account data (your dashboard users: name, email, billing) is a different category and data subject rights apply to it in full; see [Data Subject Rights (DSAR)](/compliance/data-subject-rights). A Data Processing Agreement is included and ready to sign at [sealmetrics.com/dpa](https://sealmetrics.com/dpa/).

Sealmetrics holds no third-party security certification such as ISO 27001 or SOC 2, and no supervisory authority certifies analytics tools. What exists is our own [compliance self-assessments](/compliance) against published criteria.

**Note:**
- Nothing is written to the visitor's device and no identifier is stored: no cookies, no IP addresses in the analytics database, no user or device IDs.
- Retention is fixed for every plan: event-level rows purged after 1 day, hourly aggregates after 90 days, daily aggregates and conversions after 24 months.
- All customer analytics data is stored and processed in Dublin, Ireland; a DPA is ready to sign at sealmetrics.com/dpa. No ISO 27001 or SOC 2 certification is held.

## Related documentation

- [What We Track vs What We Don't](/security-privacy/what-we-track) — the field-by-field detail, with retention
- [What is Consentless Analytics?](/security-privacy/consentless-analytics) — the model and its legal basis
- [Data Location & Retention](/security-privacy/data-location) — EU hosting, encryption, retention schedule, account closure
- [Privacy by Design Principles](/security-privacy/privacy-by-design) — how these choices map to the privacy-by-design framework
- [Account Security](/security-privacy/account-security/two-factor-auth) — protecting the dashboard account itself
