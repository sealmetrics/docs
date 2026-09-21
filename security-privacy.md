---
title: "Security & Privacy"
description: "How Sealmetrics measures without personal data — a small set of non-identifying fields, nothing stored on the device, EU-only storage in Dublin — with the index of every privacy and security page."
canonical_url: "https://docs.sealmetrics.com/security-privacy"
lang: "en"
date_generated: "2026-09-21T08:45:24.602Z"
source_hash: "2ba3c5f841925c91f271072852ea8f42a81242048420b34cb5f7af7de36b6919"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "security-privacy/index.mdx"
publisher: "Sealmetrics"
---

# Security & Privacy

Canonical page: https://docs.sealmetrics.com/security-privacy

Sealmetrics measures websites **without collecting personal data**: a small set of non-identifying fields per hit, nothing written to the visitor's device, no identifier carried across days or sessions, and all customer analytics data stored in Dublin, Ireland. Because there is no personal data, the GDPR obligations that attach to personal data are not triggered; for ePrivacy, nothing is stored on the device, and the tracker's reading of standard browser properties to compute its daily re-keyed session identifier relies on the audience-measurement exemption criteria — the reasoning is set out in full in [What is Consentless Analytics?](/security-privacy/consentless-analytics).

Sealmetrics holds no third-party security certification (no ISO 27001, no SOC 2), and no supervisory authority certifies analytics tools. The pages under [compliance](/compliance) are our own self-assessments against published criteria. A Data Processing Agreement is included and ready to sign at [sealmetrics.com/dpa](https://sealmetrics.com/dpa/); Annex 3 of that DPA is the authoritative subprocessor list.

## Start here

- [What is Consentless Analytics?](/security-privacy/consentless-analytics) — the concept, the legal basis under GDPR and ePrivacy, and what the model can and cannot measure
- [What We Track vs What We Don't](/security-privacy/what-we-track) — the field-by-field list, with retention for each field

## The consentless model

- [How Consentless Tracking Works](/security-privacy/how-consentless-works) — the technical mechanics, step by step
- [Why Sealmetrics Can Measure Without Consent](/security-privacy/why-no-consent) — the short answer on consent
- [Benefits of Consentless Tracking](/security-privacy/consentless-benefits) — what complete data changes in practice
- [How Attribution Works Without a User-ID](/security-privacy/attribution-without-userid) — last-click attribution without identifiers

## Privacy practice

- [How Sealmetrics Protects User Privacy](/security-privacy/how-we-protect-privacy) — the concrete protections
- [Privacy by Design Principles](/security-privacy/privacy-by-design) — the seven principles mapped to architecture
- [How Sealmetrics determines the country without using IP addresses](/security-privacy/country-detection) — timezone-based geolocation

## Data, hosting and quality

- [Data Location & Retention](/security-privacy/data-location) — EU hosting, retention schedule, encryption, deletion and export
- [Bot Detection & Traffic Quality](/security-privacy/bot-detection) — how automated traffic is filtered out of reports
- [How Sealmetrics Reduces AdBlocker Data Loss](/security-privacy/adblocker-bypass) — first-party delivery and why filter lists do not match

## Account security

- [Two-Factor Authentication](/security-privacy/account-security/two-factor-auth)
- [Backup Codes](/security-privacy/account-security/backup-codes)
- [Session Management](/security-privacy/account-security/session-management)
- [IP Allowlist](/security-privacy/account-security/ip-allowlist)

## Auditing someone else's tags

- [What Is This Domain in My Cookie Audit?](/security-privacy/third-party-analytics-domains) — lookup table of external analytics domains
- [What Is demdex.net?](/security-privacy/demdex-net-cookies) — Adobe's Experience Cloud ID cookies
- [What Is omtrdc.net?](/security-privacy/omtrdc-net-requests) — Adobe Analytics' collection domain

**Note:**
- A small set of fields per hit (timestamp, user agent, URL, referrer, browser timezone, a session identifier re-keyed daily); no cookies, no IP stored, no persistent identifier.
- All customer analytics data lives in Dublin, Ireland; retention is fixed at 1 day / 90 days / 24 months by aggregation level.
- No certifications and no regulator approval exist; compliance pages are self-assessments, and the DPA's Annex 3 lists the subprocessors.

## Related documentation

- [Compliance self-assessments](/compliance) — GDPR, ePrivacy, CNIL, AEPD, PECR analysed one by one
- [Data Subject Rights (DSAR)](/compliance/data-subject-rights) — how access and erasure requests work
- [Subprocessors](/compliance/subprocessors) — who touches customer analytics data
