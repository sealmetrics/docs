---
title: "Switzerland FADP Self-Assessment: Sealmetrics Compliance"
description: "Self-assessment of Sealmetrics against the revised Swiss FADP (nFADP) and Art. 45c TCA: no personal data stored, nothing on the device, EU-only processing in Dublin."
canonical_url: "https://docs.sealmetrics.com/compliance/switzerland-fadp-self-assessment"
lang: "en"
date_generated: "2026-09-03T23:47:35.161Z"
source_hash: "0810e07949655a26b4ab9bebd954db9503edd37c481051ff32a87329bf11e38f"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "compliance/switzerland-fadp-self-assessment.mdx"
publisher: "Sealmetrics"
---

# Switzerland FADP Self-Assessment: Sealmetrics Compliance

Canonical page: https://docs.sealmetrics.com/compliance/switzerland-fadp-self-assessment

*Reviewed: 12 August 2026. This is a self-assessment; no supervisory authority certifies analytics tools.*\
Sealmetrics stores no personal data of visitors under the revised **Swiss Federal Act on Data Protection** (**nFADP / revDSG**, in force since 1 September 2023), stores nothing on the device under **Article 45c(b) of the Swiss Telecommunications Act (TCA/FMG)**, and processes data only in Dublin, Ireland — adequate territory under the Federal Council's country list. This self-assessment reviews each FADP duty and the Swiss terminal-equipment rule against that architecture.

**Info:**
This self-assessment follows the published Swiss legal framework and guidance from the Federal Data Protection and Information Commissioner (FDPIC), but **does not constitute certification or approval by the FDPIC**. This document demonstrates how Sealmetrics meets the applicable requirements when properly configured.

---

## Does the Swiss FADP require a consent banner for Sealmetrics? {#executive-summary}

| Category | Status |
|----------|--------|
| **Personal data of visitors under FADP** | ✅ None stored — no identifiers by design |
| **FADP processing principles (Art. 6)** | ✅ Compliant |
| **Privacy by design & default (Art. 7)** | ✅ Compliant |
| **Data security (Art. 8)** | ✅ Compliant |
| **Cross-border disclosure (Art. 16–17)** | ✅ EU only — adequate under the Federal Council's country list |
| **Art. 45c(b) TCA — terminal equipment** | ✅ Not triggered — nothing stored on the device |
| **Consent banner required** | ✅ No |
| **Last Assessment Date** | February 2026 |

---

## Background: The Swiss Model

Switzerland's framework differs from the EU's in two ways that matter for analytics:

1. **No general consent requirement.** Under the FADP, processing personal data is generally lawful **without consent**, provided the processing principles (Art. 6) are respected and personality rights are not unlawfully breached (Art. 30–31). Consent becomes relevant mainly for sensitive personal data, high-risk profiling, or where principles are departed from.
2. **Terminal equipment rule is opt-out, not opt-in.** Article 45c(b) TCA permits processing data on third-party terminal equipment if users are informed about it and about how they can refuse — an information-plus-refusal model, not the EU's consent model.

This makes Switzerland structurally more permissive than the EU. Sealmetrics nonetheless assesses itself against the stricter reading on every criterion, because most Swiss customers also serve EU visitors and prefer one uniform standard.

---

## Part 1: Applicability — Is Visitor Data "Personal Data"?

### Criterion 1: Personal data (Art. 5 lit. a FADP)

**Requirement:** The FADP applies to data relating to an identified or identifiable natural person. Swiss law follows a **relative approach** to identifiability: what counts is whether identification is reasonably possible for the data holder with proportionate effort.

| Data point stored | Identifiable? |
|-------------------|---------------|
| Timestamp | ✅ No — cannot single out a person |
| Page URL / referrer | ✅ No (publishers must not put PII in URLs — see checklist) |
| User agent (category signal) | ✅ No — never joined to any identity; no identifier exists to join on |
| Country (from browser timezone) | ✅ No — country-level only |
| Short-lived session marker (~2h, server-side) | ✅ No — expires, never persisted to the device, cannot recognize a returning visitor |
| IP address | ✅ **Not stored** — ephemeral in-memory use for anti-bot protection only |

**Assessment:** ✅ Stored visitor analytics records are not personal data under the FADP's relative approach: neither Sealmetrics nor the publisher can identify a person from them with any means reasonably likely to be used. For visitor data, the FADP's material obligations therefore largely do not attach — a conclusion reached by design, not by exception.

**Honest nuance:** identifiability is always assessed in context. If a publisher injected identifying data (e.g., an email in a URL or custom property), the analysis would change. The configuration checklist below exists precisely to keep implementations on the right side of this line.

---

## Part 2: Processing Principles (Art. 6 FADP)

Even where visitor data falls outside the FADP, Sealmetrics applies the Art. 6 principles as an engineering baseline — and they apply fully to **account data** (dashboard users' email, name, billing details).

### Criterion 2: Lawfulness, good faith, proportionality (Art. 6 paras. 1–2)

| Aspect | Compliance |
|--------|------------|
| Lawful processing | ✅ Aggregate statistics for the publisher's own audience measurement |
| Good faith / transparency | ✅ Documented publicly; privacy policy template provided |
| Proportionality (data minimization) | ✅ Four non-identifying variables per hit; no IP stored; country-level geo only |

### Criterion 3: Purpose limitation (Art. 6 para. 3)

| Aspect | Compliance |
|--------|------------|
| Purpose stated and recognizable | ✅ Audience measurement only |
| No secondary use | ✅ No advertising, profiling, resale, or model training on client data |
| Provider reuse prohibited | ✅ Contractually excluded ([Terms](https://sealmetrics.com/terms), [DPA](https://sealmetrics.com/dpa)) |

### Criterion 4: Accuracy and retention (Art. 6 paras. 4–5)

| Aspect | Compliance |
|--------|------------|
| Retention limited | ✅ 24 months for analytics data, then automatic deletion |
| Account data | ✅ Deleted within 30 days of account closure; backups purged within 90 days |

---

## Part 3: Privacy by Design and by Default (Art. 7 FADP)

The nFADP made privacy by design and by default a statutory duty — one of the notable additions over the old law.

| Aspect | Compliance |
|--------|------------|
| Data protection built into the architecture | ✅ No cookies, no identifiers, no stored IP — irrespective of configuration |
| Most protective default settings | ✅ The consentless, identifier-free mode is the default — and currently the only mode. The one optional feature designed on top of it (Agent Analytics bot detection) is **not live and cannot be enabled** |
| Cannot be degraded by misconfiguration alone | ✅ Individual-level tracking is architecturally unavailable, not merely disabled |

**Assessment:** ✅ Compliant. Sealmetrics is a working example of Art. 7: the privacy properties are structural, not settings.

---

## Part 4: Data Security (Art. 8 FADP)

| Measure | Status |
|---------|--------|
| Encryption in transit | ✅ TLS 1.3 |
| Encryption at rest | ✅ AES-256 |
| Access control | ✅ Role-based access, audit logging, 2FA available |
| Breach notification readiness (Art. 24) | ✅ Processes in place; note that stored analytics data contains no personal identifiers, which drastically limits breach impact |

---

## Part 5: Cross-Border Disclosure (Art. 16–17 FADP)

**Requirement:** Personal data may be disclosed abroad only to countries with adequate protection (per the Federal Council's country list in the Data Protection Ordinance) or with appropriate safeguards.

| Aspect | Compliance |
|--------|------------|
| Processing location | ✅ Dublin, Ireland (EU) |
| Ireland / EU on the Federal Council's adequacy list | ✅ Yes — EU/EEA states are recognized as providing adequate protection |
| Transfers to the US or other non-adequate countries | ✅ None |
| Additional safeguards needed (SCCs, etc.) | ✅ Not required — disclosure is only to adequate territory, and stored visitor records contain no personal data in any case |

**Assessment:** ✅ For Swiss publishers, data leaving Switzerland for the EU is a disclosure to an adequate jurisdiction. There are no transfers outside EU/CH-adequate territory. See [Subprocessors](/compliance/subprocessors) for the (short) processing chain.

---

## Part 6: Terminal Equipment — Art. 45c(b) TCA

**Requirement:** Processing data on third-party terminal equipment (the Swiss "cookie rule") is permitted if users are informed and told how to refuse.

| Aspect | Sealmetrics Compliance |
|--------|----------------------|
| Data stored on the terminal | ✅ **None** — no cookies, no localStorage, nothing written |
| Stored information accessed | ✅ None read |
| Information duty | ✅ Satisfied via the publisher's privacy policy (template below) |
| Refusal mechanism | ✅ Standard browser controls / ad blockers; nothing individual to refuse in any case |

**Assessment:** ✅ The rule is not meaningfully triggered — there is no storage on the device — and the information/refusal duties are satisfied regardless.

---

## Part 7: Duties That Do Not Arise (and Why)

For completeness, the nFADP duties that a Swiss publisher might worry about, assessed against Sealmetrics:

| Duty | Analysis |
|------|----------|
| Information duty (Art. 19) | Applies to personal data collection; for Sealmetrics, satisfied by a short privacy-policy mention (template below). Recommended regardless of strict necessity. |
| Right of access (Art. 25) | For visitor analytics data, no record can be linked to a requester — no identifiers exist. See [Data Subject Rights](/compliance/data-subject-rights). Applies normally to dashboard account data. |
| DPIA (Art. 22) | No high-risk processing: no profiling, no sensitive data, no systematic monitoring of individuals. A DPIA for the analytics function is not indicated; publishers can reference this document in their records. |
| Records of processing (Art. 12) | Publishers should include their Sealmetrics use in their records where they maintain them; this page provides the needed facts. |
| Profiling / high-risk profiling (Art. 5 lit. f–g) | Not performed — no individual-level data exists to profile. |

**Recommended Privacy Policy Text (German — adapt for FR/IT):**
```
Diese Website verwendet Sealmetrics zur Reichweitenmessung. Sealmetrics
setzt keine Cookies, speichert nichts auf Ihrem Gerät und erhebt keine
Personendaten: IP-Adressen werden nicht gespeichert, und es bestehen
keine individuellen Identifikatoren. Die aggregierten Daten werden
ausschliesslich in der EU (Dublin, Irland) verarbeitet — einem Land mit
angemessenem Datenschutzniveau gemäss Verordnung des Bundesrates.
Sie können das Analyse-Skript jederzeit über Ihre Browser-Einstellungen
blockieren.
```

---

## Part 8: Configuration Checklist for Swiss Publishers

### Required ✅

- [ ] Standard tracking mode (default configuration)
- [ ] No custom user IDs enabling cross-session tracking
- [ ] No PII in custom event properties or URLs
- [ ] Privacy policy updated to mention Sealmetrics (information duty, Art. 19 FADP / Art. 45c TCA)

### Prohibited ❌

- [ ] Do NOT pass email addresses or other PII as properties
- [ ] Do NOT combine Sealmetrics data with profiling or advertising tools
- [ ] Do NOT export data for individual-level analysis

---

## Part 9: Compliance Statement

Sealmetrics declares that:

1. Stored visitor analytics data **contains no personal data** within the meaning of Art. 5 lit. a FADP — no identifiers of any kind are created or kept
2. Its architecture satisfies the FADP's processing principles, **privacy by design and by default** (Art. 7), and data security (Art. 8) requirements
3. Customer analytics data is processed **exclusively in Dublin, Ireland (EU)** — adequate territory under the Federal Council's country list — with **no transfers outside EU/CH-adequate jurisdictions**
4. Nothing is stored on or read from the visitor's device, so the Swiss terminal-equipment rule (Art. 45c(b) TCA) imposes no consent or banner obligation
5. Swiss publishers can use Sealmetrics **without a consent banner** when configured per this document

Publishers **cannot** claim Sealmetrics is "certified" or "approved" by the FDPIC — no such certification exists.

---

## Part 10: Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | February 2026 | Initial self-assessment against the nFADP (in force 1 September 2023) and Art. 45c TCA |

---

## References

- [Federal Act on Data Protection (FADP, SR 235.1) — official text](https://www.fedlex.admin.ch/eli/cc/2022/491/en)
- [Data Protection Ordinance (DPO, SR 235.11) — including the adequacy country list](https://www.fedlex.admin.ch/eli/cc/2022/568/en)
- [FDPIC — Federal Data Protection and Information Commissioner](https://www.edoeb.admin.ch/)
- [Telecommunications Act (TCA, SR 784.10), Art. 45c](https://www.fedlex.admin.ch/eli/cc/1997/2187_2187_2187/en)
- [Sealmetrics Privacy Policy](https://sealmetrics.com/privacy)
- [Sealmetrics DPA](https://sealmetrics.com/dpa)

## Contact

- **Email:** privacy@sealmetrics.com
- **DPO Contact:** dpo@sealmetrics.com

**Note:**
- Under the nFADP (in force 1 September 2023) stored visitor records are not personal data: no identifiers, no stored IP, country-level geo from the browser timezone, a ~2-hour server-side session marker.
- Analytics data is retained 24 months; account data is deleted within 30 days of closure and backups purged within 90 days; encryption is TLS 1.3 in transit and AES-256 at rest.
- Processing in Dublin, Ireland is a disclosure to adequate territory under the Federal Council's list, and Art. 45c(b) TCA is not triggered because nothing is stored on the device; this is not an FDPIC certification.

## Related documentation

- [CNIL Self-Assessment](/compliance/cnil-self-assessment) — the equivalent self-assessment for France
- [Germany TDDDG Self-Assessment](/compliance/germany-ttdsg-self-assessment) — the equivalent self-assessment for Germany
- [Italy Garante Self-Assessment](/compliance/italy-garante-self-assessment) — the equivalent self-assessment for Italy
- [Data Subject Rights (DSAR)](/compliance/data-subject-rights) — how access requests work with identifier-free data
- [Data Location & Retention](/security-privacy/data-location) — Dublin hosting and retention schedules
