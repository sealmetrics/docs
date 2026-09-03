---
title: "Technical Privacy Model"
description: "Learn exactly what data Sealmetrics collects, what it does not collect, and how privacy is enforced technically."
canonical_url: "https://docs.sealmetrics.com/faq/privacy-technical"
lang: "en"
date_generated: "2026-09-03T23:47:35.161Z"
source_hash: "bfcb7af65959d74ea670a886b32d9e17877112c52570496f353c3e4ee4f45e6c"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "faq/privacy-technical.mdx"
publisher: "Sealmetrics"
---

# Technical Privacy Model

Canonical page: https://docs.sealmetrics.com/faq/privacy-technical

Sealmetrics records only 4 variables per hit — timestamp, URL, referral URL and user agent (raw string purged after 1 day) — with no IP address, no unique identifiers, no cookies or local storage and no fingerprinting; the visitor's country is estimated from the browser timezone rather than the IP address.

## What data does Sealmetrics collect?

Only four variables:

- Timestamp
- URL
- Referral URL
- User Agent (used for anonymous device classification; event-level raw string purged after 1 day)

No IP address.
No unique identifiers.
No cookies or local storage.

---

## Do you use fingerprinting?

No.
No techniques that might identify or re-identify individuals.

---

## Can Sealmetrics reconstruct user journeys?

No.
Hits are isolated by design.

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
- Only 4 variables per hit: timestamp, URL, referral URL and user agent (raw string purged after 1 day); no IP address, no unique identifiers, no cookies or local storage.
- No fingerprinting and no reconstruction of user journeys — hits are isolated by design.
- Country is estimated from the browser timezone, not the IP: accurate for unique timezones, most-likely country for shared ones, country level only.
