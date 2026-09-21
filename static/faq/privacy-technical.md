---
title: "Technical Privacy Model"
description: "Learn exactly what data Sealmetrics collects, what it does not collect, and how privacy is enforced technically."
canonical_url: "https://docs.sealmetrics.com/faq/privacy-technical"
lang: "en"
date_generated: "2026-09-21T08:45:24.602Z"
source_hash: "d87d0b12fba64d5ac5cba09f821ef8adfaca94fe8ad0c084c2ad36dabc3d79e4"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "faq/privacy-technical.mdx"
publisher: "Sealmetrics"
---

# Technical Privacy Model

Canonical page: https://docs.sealmetrics.com/faq/privacy-technical

Sealmetrics records a small set of non-identifying fields per hit — timestamp, URL, referral URL, user agent (raw string never written to storage), browser timezone and a session identifier re-keyed every day — with no IP address, no persistent identifier, no cookies or local storage and no stored fingerprint; the visitor's country is estimated from the browser timezone rather than the IP address.

## What data does Sealmetrics collect?

A small set of non-identifying fields:

- Timestamp
- URL
- Referral URL
- User Agent (used for anonymous device classification; raw string never written to storage)
- Browser timezone (used to assign the country)
- Session identifier (re-keyed every day; see [What We Track](/security-privacy/what-we-track))

No IP address.
No persistent identifier: nothing stored can link a device across days.
No cookies or local storage.

---

## Do you use fingerprinting?

Not in any persistent form. The session identifier is computed in the browser as a hash of standard device characteristics (user agent, timezone, languages, screen resolution and similar), which is technically a device fingerprint. It is never written to the device, and on the server it is re-keyed with a daily salt that is destroyed on rotation; the raw hash is never stored. The stored identifier therefore changes every day and cannot link a device across days — not even for Sealmetrics.

---

## Can Sealmetrics reconstruct user journeys?

No.
Hits are grouped only within a single session (2 hours of inactivity) and nothing links them across days or sessions, so no journey can be reconstructed.

## How can the country of origin of my visitors be determined without knowing their IP and while respecting user privacy?

Sealmetrics estimates the country using the timezone configured in the visitor’s browser, a technical value that does not identify the user and does not require processing IP addresses. Each timezone is mapped to the countries that use it. For unique timezones, the estimation is highly accurate; for shared timezones, the most likely country is selected.
This method is reliable for aggregated analytics and fully aligns with privacy and data-minimization principles, as no IPs or personal identifiers are collected.

## Why doesn’t Sealmetrics use IP addresses for geolocation?

Because processing IP addresses involves handling personal data under the [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj). Sealmetrics is built with a privacy-first approach: we do not track individuals or use data that could identify them. Using the timezone allows us to provide useful insights without relying on personal information.

## Is the browser timezone considered personal data?

No. The timezone is a technical value exposed automatically by the browser and does not identify an individual or allow profiling. On its own, it cannot be used for tracking and aligns with data-minimization principles established by privacy regulations.

## How does timezone-based detection affect the accuracy of my reports?

Reports show a country estimation based on the browser’s timezone. This is more than adequate for traffic analysis, marketing, attribution, and global trends. It does not provide city- or region-level accuracy, but it avoids processing personal data and keeps analytics within strict privacy compliance.

---

**Note:**
- A small set of fields per hit: timestamp, URL, referral URL, user agent (raw string never written to storage), browser timezone and a daily re-keyed session identifier; no IP address, no persistent identifier, no cookies or local storage.
- No stored or persistent fingerprint and no reconstruction of user journeys — nothing links hits across days or sessions.
- Country is estimated from the browser timezone, not the IP: accurate for unique timezones, most-likely country for shared ones, country level only.
