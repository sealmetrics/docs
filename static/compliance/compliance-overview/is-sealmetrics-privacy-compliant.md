---
title: "Is Sealmetrics GDPR, ePrivacy, CCPA, and PECR Compliant?"
description: "Learn how Sealmetrics ensures full compliance with GDPR, ePrivacy, CCPA, PECR, and global privacy regulations through its privacy-first, isolated-hit architecture."
canonical_url: "https://docs.sealmetrics.com/compliance/compliance-overview/is-sealmetrics-privacy-compliant"
lang: "en"
date_generated: "2026-09-03T23:47:35.161Z"
source_hash: "89185b08db4549f7f9aa743ad7f79503df8886e2c87285f6c25d67a0cb1e4fe6"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "compliance/compliance-overview/is-sealmetrics-privacy-compliant.mdx"
publisher: "Sealmetrics"
---

# Is Sealmetrics GDPR, ePrivacy, CCPA, and PECR Compliant?

Canonical page: https://docs.sealmetrics.com/compliance/compliance-overview/is-sealmetrics-privacy-compliant

**Info:**
This is a **self-assessment**, not a certification. No supervisory authority certifies or validates analytics tools, and Sealmetrics holds no third-party security certification (no ISO 27001, no SOC 2). This page documents how the architecture meets the published criteria of each framework.

Sealmetrics is built so that the questions these frameworks ask about personal data do not arise: no personal data is collected, so there is nothing to consent to and no personal-data obligations are triggered. This is our own assessment against:

- **[GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj)** (European Union)
- **[ePrivacy Directive](https://eur-lex.europa.eu/eli/dir/2002/58/oj)** (EU)
- **CCPA** (California Consumer Privacy Act)
- **[PECR](https://www.legislation.gov.uk/uksi/2003/2426/contents)** (UK Privacy and Electronic Communications Regulations)

Sealmetrics achieves this by operating on a **privacy-first, cookieless, consentless measurement model** based entirely on **isolated hits**.

---

## 1. European Infrastructure & Legal Alignment

Sealmetrics is a **European company**, and:

- All servers are located in **Dublin, Ireland**
- All data is processed within the **EU**
- No personal data is transferred outside the EU
- Operations comply with GDPR’s strict data handling requirements

All customer analytics data therefore stays within the EU.

---

## 2. Compliant by Design: No Personal Data, No Tracking

Sealmetrics does **not**:

- Track individual users
- Correlate hits across time
- Build user profiles
- Use cookies, localStorage, fingerprinting, or identifiers
- Insert any tracking code in the user’s terminal beyond the measurement script

This architectural model ensures there is **no processing of personal data**, eliminating the need for cookie banners or consent.

---

## 3. Based on “Isolated Hits” — No User Tracking

Sealmetrics does not track sessions or users.
Instead, it measures **isolated page views (hits)** that are *never linked together*.

### For each hit, Sealmetrics collects only four variables:

1. **Timestamp**
2. **User Agent** *(used for anonymous device classification; the raw string is purged after 1 day and only the derived browser/OS/device categories persist in aggregates — never linked to a person)*
3. **Current URL**
4. **Referral URL**

These four elements allow meaningful analytics, but **do not enable any type of identification or re-identification**, keeping the stored dataset anonymous, which is what places it outside the GDPR's material scope (Recital 26).

---

## 4. How does Sealmetrics interpret the ePrivacy Directive? {#4-eprivacy-directive-interpretation}

Sealmetrics follows a strict privacy interpretation:

> **Tracking individual users without consent is not permissible — even anonymously — under the ePrivacy Directive.**

Because Sealmetrics never tracks individuals and never correlates hits, measurement can operate without consent.

This makes Sealmetrics one of the only analytics platforms capable of providing **cookieless and consentless analytics** that still offer valuable insights.

---

## 5. Compliance With Global Privacy Regulations

### GDPR
✔ No personal data collected
✔ No identifiers
✔ No consent required
✔ EU-based processing

### ePrivacy Directive
✔ No individual user tracking
✔ No session reconstruction
✔ No device-level identifiers

### CCPA
✔ No personal information collected
✔ No user profiling
✔ No cross-site tracking

### PECR
✔ No cookies or terminal identifiers
✔ No persistent technology used

---

## Is Sealmetrics compliant by design?

Sealmetrics is **GDPR, ePrivacy, CCPA, and PECR compliant by design**, thanks to its strict privacy-first architecture:

- 0 personal data
- 0 cookies
- 0 user identifiers
- Isolated hits that are never joined to a person or to each other

This enables marketers and analysts to access reliable, actionable analytics **without compromising user privacy or requiring consent banners**.

**Note:**
- Sealmetrics collects only four variables per hit — timestamp, user agent (raw string purged after 1 day), current URL and referral URL — and never links hits to each other or to a person.
- All servers are in Dublin, Ireland; no personal data is transferred outside the EU.
- This is a self-assessment against GDPR, ePrivacy, CCPA and PECR — Sealmetrics holds no ISO 27001 or SOC 2 certification and no supervisory authority certifies analytics tools.

## Related documentation

- [Does Sealmetrics comply with CNIL guidelines?](/compliance/cnil-self-assessment) — the French consent-exemption criteria in detail.
- [Legal FAQ — Sealmetrics Compliance Questions](/compliance/compliance-overview/legal-faq) — audits, DPIA, data processing, and retention questions.
- [UK PECR Self-Assessment: Sealmetrics Compliance](/compliance/uk-pecr-self-assessment) — the UK analytics exemption under DUAA 2025.
- [GDPR and Cookieless Analytics](/compliance/gdpr-cookieless-analytics) — the GDPR reasoning behind the isolated-hit model.
- [What We Track vs What We Don’t](/security-privacy/what-we-track) — the four variables Sealmetrics records and nothing more.
