---
title: "Do Temporary Session Identifiers (Session IDs) Require Consent Under GDPR?"
description: "When a session ID triggers the ePrivacy consent requirement and when it does not, and why Sealmetrics' short-lived, context-derived marker falls on the no-consent side."
canonical_url: "https://docs.sealmetrics.com/legal/gdpr-and-eprivacy/do-session-ids-require-consent"
lang: "en"
date_generated: "2026-08-12T08:53:56.085Z"
source_hash: "9c3f15bc92005213e20448f46ac59989bc6fd09fe8f6fab77c5dd388638ffc0a"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "compliance/GDPR-and-ePrivacy/do-session-ids-require-consent.mdx"
publisher: "SealMetrics"
---

# Do Temporary Session Identifiers (Session IDs) Require Consent Under GDPR?

Canonical page: https://docs.sealmetrics.com/legal/gdpr-and-eprivacy/do-session-ids-require-consent

A common question around privacy-compliant analytics is whether **temporary Session IDs** fall under “tracking technologies” that require user consent.
The short answer: **it depends on how the Session ID is implemented**.

## When Session IDs *Do* Require Consent

A temporary Session ID **requires consent** if:

- It is **stored in a cookie** or similar persistent storage
- It can be used to **recognize a user over time**
- It can be combined with other identifiers to **reconstruct a profile**
- It is used for **tracking across multiple domains**

In these cases, the Session ID becomes a **personal identifier**, making consent mandatory under:

- **GDPR**
- **ePrivacy Directive**
- Local guidelines (CNIL, AEPD, ICO…)

## When Session IDs *Do Not* Require Consent

Regulators such as **CNIL (France)** and **AEPD (Spain)** explicitly allow “cookie-less session identifiers” for **audience measurement**, *as long as* they meet **strict conditions**:

### Conditions for Consent-Free Session IDs

- **Used exclusively for audience measurement** (no marketing / profiling)
- **No cross-site tracking**
- **Not persistent** → disappears after the browser session ends
- **Not stored in cookies or localStorage**
- **Cannot be combined with other identifiers** to re-identify the user
- **No fingerprinting techniques**

If all these requirements are met, the Session ID is considered **non-identifying**, and consent is not required.

## How Sealmetrics Ensures Compliance

Sealmetrics uses a temporary, context-derived session marker that meets the CNIL and AEPD audience-measurement criteria for operating without consent:

✔ Temporary Session IDs
✔ Meets the CNIL and AEPD audience-measurement criteria (self-assessed)
✔ No persistence
✔ No personal identification

Session IDs are used only within the active session to group hits — never to track or identify users.

## Summary

| Scenario | Requires Consent? | Why |
|---------|-------------------|------|
| Session ID stored in a cookie | **Yes** | Persistence = identification |
| Temporary ID without cookies | **No** | Cannot identify the user |
| Cross-site session tracking | **Yes** | Considered profiling |
| Sealmetrics session tracking | **No** | Temporary, non-identifying |

---

**The marker is never stored on the device and never joins hits across sessions, which is what keeps measurement outside the ePrivacy consent requirement — without compromising your analytics.**

## Related documentation

- [GDPR and Cookieless Analytics](/compliance/gdpr-cookieless-analytics) — the wider GDPR case for cookieless, non-identifying measurement.
- [Does SealMetrics comply with CNIL guidelines?](/compliance/cnil-self-assessment) — the CNIL first-party session-ID exemption in detail.
- [CNIL Self-Assessment: Sealmetrics Compliance](/compliance/cnil-self-assessment) — the session-ID condition assessed criterion by criterion.
- [Legal FAQ — Sealmetrics Compliance Questions](/compliance/compliance-overview/legal-faq) — how the Session ID and Source ID are computed and used.
- [How Attribution Works Without a User-ID](/security-privacy/attribution-without-userid) — attribution without persistent user identifiers.
