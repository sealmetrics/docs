---
title: "How Sealmetrics determines the country without using IP addresses"
description: "How Sealmetrics detects visitor country from the browser timezone instead of IP addresses — GDPR-friendly geo data with zero personal data processing."
canonical_url: "https://docs.sealmetrics.com/security-privacy/country-detection"
lang: "en"
date_generated: "2026-09-04T00:07:24.876Z"
source_hash: "f1d606bc1aa2012026403e77c4fbced0ad94e3bee90353d496a92818e2eda784"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "security-privacy/country-detection.mdx"
publisher: "Sealmetrics"
---

# How Sealmetrics determines the country without using IP addresses

Canonical page: https://docs.sealmetrics.com/security-privacy/country-detection

## How does Sealmetrics determine the country without IP addresses? {#timezone-based-geo-estimation}

Sealmetrics uses the **timezone configured in the user's browser** to determine the country of origin for each event ("hit"), instead of looking up the IP address. The timezone is mapped to a country through an internal IANA table, which yields an approximate, aggregate-level geographic estimate without processing IP addresses or collecting personal identifiers.

### 1. Retrieving the Timezone

The browser exposes the timezone value through standard APIs such as:

``` js
Intl.DateTimeFormat().resolvedOptions().timeZone
```

Examples of possible values include:\
- `Europe/Madrid`\
- `America/Santiago`\
- `Asia/Tokyo`

This information is provided directly by the user's device through the standard [`Intl.DateTimeFormat` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions) and **does not contain identifiable data**, nor does it allow individual tracking.

### 2. How is a timezone mapped to a country?

Each timezone is matched against an internal table connecting **[IANA
timezones](https://www.iana.org/time-zones)** to the countries that use them.

-   For unique timezones (e.g., `Asia/Tokyo`), the country is determined
    with high confidence.\
-   For shared timezones (e.g., `Europe/Paris`), the system selects the
    most likely country based on majority usage or internal statistical
    criteria.

The resulting estimation is accurate enough for aggregated analytics and
attribution metrics, although it cannot guarantee absolute precision in
every case.

### 3. Privacy & Compliance

This approach fully adheres to privacy and data-minimization principles:

-   No IP lookup is involved in country determination — not for
    analytics reports, and not for anything else. (A country-by-IP
    signal was designed for the Agent Analytics bot detector, but that
    feature is not live and cannot be enabled, so no such lookup runs
    on any account. See
    [What We Track](/security-privacy/what-we-track).)\
-   No unique device identifiers are stored.\
-   Timezone information does not identify the user.\
-   Country calculation relies solely on non-personal technical data
    provided by the browser.

Thanks to this method, Sealmetrics can offer meaningful geographic
insights while preserving user privacy and operating without requiring
consent for tracking.

**Note:**
- Country comes from the browser timezone (`Intl.DateTimeFormat().resolvedOptions().timeZone`) mapped against an IANA timezone table — no IP lookup is involved.
- Unique timezones (e.g. Asia/Tokyo) resolve with high confidence; shared timezones (e.g. Europe/Paris) resolve to the most likely country, so precision is country-level only.
- No device identifiers are stored and the timezone does not identify the user, which is why this geo data needs no consent.

## Related documentation

- [What We Track vs What We Don't](/security-privacy/what-we-track) — where timezone-based country fits in the data model
- [How Sealmetrics Protects User Privacy](/security-privacy/how-we-protect-privacy) — the data-minimization approach behind this method
- [Why Sealmetrics Can Measure Without Consent](/security-privacy/why-no-consent) — why non-IP geo needs no consent
- [Geography Report](/reports/geography) — see the country-level insights this produces
- [Frequently Asked Questions](/faq/privacy-security) — common privacy questions
