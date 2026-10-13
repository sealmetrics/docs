---
title: "How Sealmetrics Blocks Bot Traffic (And Stays Consentless)"
description: "How Sealmetrics filters bot traffic with layered, privacy-safe defenses — and why its ephemeral, in-memory use of IPs fits a platform designed to comply with the GDPR and ePrivacy."
canonical_url: "https://docs.sealmetrics.com/compliance/compliance-overview/how-sealmetrics-blocks-bot-traffic"
lang: "en"
date_generated: "2026-10-09T12:37:21.365Z"
source_hash: "4f3f790ab3cfb84e651e988e450738ed281eca6d84bf6083de4daea43714fe2d"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "compliance/compliance-overview/how-sealmetrics-blocks-bot-traffic.mdx"
publisher: "Sealmetrics"
---

# How Sealmetrics Blocks Bot Traffic (And Stays Consentless)

Canonical page: https://docs.sealmetrics.com/compliance/compliance-overview/how-sealmetrics-blocks-bot-traffic

Bot and automated traffic can distort every metric you rely on. Sealmetrics filters it out with a layered, privacy-safe system — and this page explains exactly how each layer works and why, on our self-assessment, the approach adds no consent requirement.

---

## Our IP position, stated plainly

Let's address the most common question first: **does bot filtering involve IP addresses?**

Yes — transiently, and never stored in the analytics database. Here is the complete picture:

- **No analytics metric is ever calculated from an IP.** Visitor country comes from the [browser timezone](/security-privacy/country-detection), not from IP lookup.
- **The visitor's IP is never written to the analytics database.** Our event storage has no IP column at all — storing one is architecturally impossible, not just policy.
- During request handling, the IP is used **transiently on the server** for security purposes: checking the request against curated blocklists of known bots and datacenters. If it matches, the request is dropped. Either way, the IP is not carried forward into analytics processing. (As with any web service, IPs may appear transiently in operational logs with limited retention, separate from analytics data.)
- **The IP is never linked to any hit, session, or metric**, and never used to identify, profile, or track anyone.

Transient use of an IP is still "processing" under GDPR — we don't pretend otherwise. It is processed under **legitimate interest (Art. 6(1)(f))**, which Recital 49 explicitly recognizes for network and information security purposes, including "preventing unauthorised access... and stopping denial-of-service attacks". Transient, security-focused IP handling with nothing persisted in the analytics database is the textbook case.

The visitor analytics data rests on the same basis. It holds no IP, no persistent identifier and nothing that identifies anyone; its only per-visitor value is a session identifier that is pseudonymised data while the daily salt exists, processed under legitimate interest (Art. 6(1)(f)) and unrecoverable once the salt rotates. Reports are always aggregated.

What makes Sealmetrics consentless is not a claim that IPs never exist in our infrastructure — it's that they are **never stored with analytics data, never used for tracking, and never used for analytics**.

---

## Layer 1 — Bot user-agent signatures

Every browser and bot sends a *user agent* string describing the client software. Most legitimate bots identify themselves clearly.

Sealmetrics maintains an updated signature list of known bot user agents — search engine crawlers, uptime monitors, headless browsers, automation tools — with exact, prefix, substring, and pattern matching. A hit matching a bot signature is discarded immediately and never enters your reports.

---

## Layer 2 — Curated IP and datacenter blocklists

Sealmetrics maintains curated blocklists of IPs and network ranges (CIDRs) belonging to known bots, scrapers, and datacenters, plus any per-site block rules you configure yourself.

When a hit arrives:

1. The request's IP is checked **in memory** against these lists.
2. If it matches, the request is dropped.
3. The IP is discarded — it is never persisted, in either case.

These lists are curated block rules (like a firewall's), not records of your visitors.

---

## Layer 3 — Request-header consistency checks

Automated clients frequently send request headers that are inconsistent with the browser they claim to be. Sealmetrics scores header consistency on each request as an additional bot signal — nothing is stored from the headers.

---

## Layer 4 — Agent Analytics (not available)

**Caution:**
Agent Analytics is **not live and cannot be enabled on any account**. No site performs the processing described below. It is documented here only so that this page stays a complete description of the detection design; treat it as roadmap, not as current behaviour.

If it ships, sites that explicitly enable it would get deeper detection of AI agents and automated browsers on entrance hits:

- A **stateless GeoLite2 lookup** deriving datacenter/ISP signals from the IP (is this a datacenter? does the network belong to a known AI provider?) and a country label used to detect geo/timezone mismatches, with only the derived signals kept and the IP discarded.
- **Environmental signals** about the browser (e.g. WebDriver flag, rendering characteristics) and **behavioral signals** about the interaction pattern (e.g. mouse-movement linearity, click-timing variance) feeding a score that classifies each session as human or automated.

Those signals would describe the *software environment*, not the person, and would never be associated with an identifier. **Today, no account collects any of it** — Layers 1 to 3 above are the whole of what runs.

---

## Why this approach is privacy-compliant

- **User agents** are used in flight as device-category signals — the raw string is never written to storage; only the derived browser/OS/device categories persist, in aggregates, for up to 24 months — never linked to any personal or persistent identifier (the only identifier is a session pseudonym that rotates daily), and never used to reconstruct anyone's history.
- **IPs** are processed transiently on the server for security only, under legitimate interest (Recital 49), and never stored with analytics data.
- **No persistent or cross-site identifiers** are created or used at any layer — the session identifier is ephemeral, scoped to one site and rotates daily.
- **No profiling of individuals** — classification targets bot vs. human traffic, at session level, based on software signals.

This is why, on our assessment, bot filtering adds **no consent requirement of its own** and **stores no IP addresses**.

---

## Summary

| Layer | Signal | IP stored? | Identifying data stored? |
|---|---|---|---|
| Bot UA signatures | User-agent string | No | No |
| IP/datacenter blocklists | IP, in memory only | No | No |
| Header consistency | Request headers | No | No |
| Agent Analytics *(not available)* | Derived geo/ISP + environment + behavior | No | No |

The result: clean analytics and an honest architecture, with no consent needed for bot filtering.

## Related documentation

- [Is Sealmetrics GDPR, ePrivacy, CCPA, and PECR Compliant?](/compliance/compliance-overview/is-sealmetrics-privacy-compliant) — the full compliance picture.
- [Legal FAQ — Sealmetrics Compliance Questions](/compliance/compliance-overview/legal-faq) — how IPs are (and aren't) used, in FAQ form.
- [What We Track vs What We Don't](/security-privacy/what-we-track) — the exact data Sealmetrics does and does not collect.
- [How Sealmetrics determines the country without using IP addresses](/security-privacy/country-detection) — timezone-based geolocation for analytics.
- [Bot Detection & Traffic Quality](/security-privacy/bot-detection) — how filtered bot traffic keeps reports clean.
