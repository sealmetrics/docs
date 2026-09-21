---
title: "Is Sealmetrics GDPR, ePrivacy, CCPA, and PECR Compliant?"
description: "Self-assessment of how Sealmetrics' privacy-first, isolated-hit architecture is designed to meet GDPR, ePrivacy, CCPA and PECR requirements. Not a certification."
canonical_url: "https://docs.sealmetrics.com/compliance/compliance-overview/is-sealmetrics-privacy-compliant"
lang: "en"
date_generated: "2026-09-21T08:45:24.602Z"
source_hash: "ae0231428a921e4b8bd576517c4462e9a74f0b2d927f15bc54e7349918356ed7"
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
- Operations are designed around GDPR’s data handling requirements

All customer analytics data therefore stays within the EU.

---

## 2. Privacy by Design: No Personal Data, No Tracking

Sealmetrics does **not**:

- Track individual users
- Correlate hits across sessions or days
- Build user profiles
- Store anything on the device (no cookies, localStorage or sessionStorage), or keep any persistent identifier or stored fingerprint
- Insert any tracking code in the user’s terminal beyond the measurement script

This architectural model is designed so that **no personal data is processed**, which is why, in our assessment, no cookie banner or consent is needed for measurement.

---

## 3. Based on “Isolated Hits” — No User Tracking

Sealmetrics does not track users.
It measures **page views (hits)** that are never linked to a person, and are grouped only within a single session — never across sessions or days.

### For each hit, Sealmetrics collects only a small set of non-identifying fields:

1. **Timestamp**
2. **User Agent** *(used for anonymous device classification; the raw string is used in flight and never written to storage — only the derived browser/OS/device categories persist in aggregates — never linked to a person)*
3. **Current URL**
4. **Referral URL**
5. **Browser timezone** *(used to assign the country)*
6. **Session identifier** *(a hash of standard device characteristics computed in the browser and never stored on the device; re-keyed on the server with a daily salt that is destroyed on rotation, so it cannot be linked across days — see [What We Track](/security-privacy/what-we-track#6-session-identifier))*

These fields allow meaningful analytics, but are chosen so they **do not allow identification or re-identification**, keeping the stored dataset anonymous. That is the basis of our assessment that it falls outside the GDPR's material scope (Recital 26).

---

## 4. How does Sealmetrics interpret the ePrivacy Directive? {#4-eprivacy-directive-interpretation}

Sealmetrics follows a strict privacy interpretation:

> **Tracking individual users without consent is not permissible — even anonymously — under the ePrivacy Directive.**

Sealmetrics never tracks individuals and never correlates hits across sessions or days. Nothing is stored on the device; the tracker does read standard browser properties to compute the session identifier, so the consent exemption rests on the audience-measurement criteria described in [Analytics Cookies: Consent Exemption Requirements](/compliance/analytics-cookies-exemption).

This makes Sealmetrics one of the only analytics platforms capable of providing **cookieless and consentless analytics** that still offer valuable insights.

---

## 5. How the Architecture Maps to Each Regulation

### GDPR
✔ No personal data collected
✔ No persistent identifiers
✔ No consent required
✔ EU-based processing

### ePrivacy Directive
✔ No individual user tracking
✔ No cross-session reconstruction
✔ Nothing stored on the device; no stored device fingerprint

### CCPA
✔ No personal information collected
✔ No user profiling
✔ No cross-site tracking

### PECR
✔ No cookies or identifiers stored on the device
✔ No persistent technology used

---

## Is Sealmetrics compliant by design?

Sealmetrics is **designed for GDPR, ePrivacy, CCPA and PECR** from the architecture up. This is our self-assessment, not a certification, and it rests on four facts about measurement:

- 0 personal data
- 0 cookies
- 0 user identifiers
- Hits that are never joined to a person, or to each other across sessions or days

Those zeros describe **measurement**: what the tracking script does on your site. Signing in to the Sealmetrics dashboard uses a session cookie on `my.sealmetrics.com`, like any web application — it is not part of measurement and never reaches your visitors.

This enables marketers and analysts to access reliable, actionable analytics **without compromising user privacy or requiring consent banners**.

**Note:**
- Sealmetrics collects only a small set of non-identifying fields per hit — timestamp, user agent (raw string never written to storage), current URL, referral URL, browser timezone and a daily-re-keyed session identifier — and never links hits to a person or across sessions.
- All servers are in Dublin, Ireland; no personal data is transferred outside the EU.
- This is a self-assessment against GDPR, ePrivacy, CCPA and PECR — Sealmetrics holds no ISO 27001 or SOC 2 certification and no supervisory authority certifies analytics tools.

## Related documentation

- [Does Sealmetrics comply with CNIL guidelines?](/compliance/cnil-self-assessment) — the French consent-exemption criteria in detail.
- [Legal FAQ — Sealmetrics Compliance Questions](/compliance/compliance-overview/legal-faq) — audits, DPIA, data processing, and retention questions.
- [UK PECR Self-Assessment: Sealmetrics Compliance](/compliance/uk-pecr-self-assessment) — the UK analytics exemption under DUAA 2025.
- [GDPR and Cookieless Analytics](/compliance/gdpr-cookieless-analytics) — the GDPR reasoning behind the isolated-hit model.
- [What We Track vs What We Don’t](/security-privacy/what-we-track) — the fields Sealmetrics records and nothing more.
