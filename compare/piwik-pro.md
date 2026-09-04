---
title: "Sealmetrics vs Piwik PRO: enterprise suite with consent manager vs consentless by design"
description: "Piwik PRO pairs analytics with a consent manager and an anonymous mode hashed from the IP. Sealmetrics needs no consent layer, no IP and stores only in Dublin."
canonical_url: "https://docs.sealmetrics.com/compare/piwik-pro"
lang: "en"
date_generated: "2026-09-04T11:01:07.053Z"
source_hash: "066153f6fa27cb208ab6853f92ef70fb6d761d8ffde22131eb3a18975594d984"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "compare/piwik-pro.mdx"
publisher: "Sealmetrics"
---

# Sealmetrics vs Piwik PRO: enterprise suite with consent manager vs consentless by design

Canonical page: https://docs.sealmetrics.com/compare/piwik-pro

Sealmetrics and Piwik PRO are both European analytics platforms aimed at organisations with a data protection review to pass. The main difference is philosophy: Piwik PRO is a suite — analytics, tag manager and consent manager — that collects anonymous data before consent and full data after it, using a session hash that includes the IP; Sealmetrics removes the consent step entirely by never storing personal data or deriving anything from the IP.

## Side-by-side

Piwik PRO facts checked 2026-09-04 on piwik.pro and help.piwik.pro; each row links to the page it was read on.

| Criterion | Sealmetrics | Piwik PRO |
|---|---|---|
| Company / HQ | Sealmetrics, EU company | Piwik PRO SA, Wrocław, Poland ([source](https://piwik.pro/contact/)) |
| Hosting model | Managed cloud only | Public cloud, private cloud on Azure regions or Elastx ([source](https://piwik.pro/privacy-compliance/)) |
| Licence | Proprietary | Proprietary ([source](https://piwik.pro/pricing/)) |
| Identifier between pageviews | In-memory session marker, ~2 h, not derived from IP ([details](/security-privacy/what-we-track)) | Cookie ID by default; anonymous mode uses a session hash of IP address, OS, browser name and version, language, plugins and site ID ([source](https://help.piwik.pro/support/questions/what-are-sessions-and-how-are-they-counted/)), used for 30 minutes since the last event ([source](https://help.piwik.pro/support/privacy/collect-data-in-a-privacy-friendly-way/)) |
| Visitor IP address | Never stored; country from browser timezone ([details](/security-privacy/country-detection)) | Processed; masking "removes the selected number of bytes from the address before saving it" ([source](https://help.piwik.pro/support/privacy/collect-data-in-a-privacy-friendly-way/)) |
| Data residency | Dublin, Ireland only ([details](/security-privacy/data-location)) | EU-operated hosting in Sweden, plus Germany, the Netherlands, the US, Hong Kong and UAE North ([source](https://piwik.pro/pricing/)) |
| Vendor's position on consent | No banner needed for measurement | Anonymous data can be collected without a consent form; full tracking after consent ([source](https://help.piwik.pro/support/privacy/collect-data-in-a-privacy-friendly-way/)) |
| Security certifications | None held | Vendor states ISO 27001 and SOC 2 ([source](https://piwik.pro/privacy-compliance/)) |
| Script size (gzipped) | 1.1 KB ([measured](/guides/tracker-performance-report)) | Not published; Sealmetrics measured ~26 KB on the vendor demo instance, 27 Aug 2026 ([method](/guides/tracker-performance-report)) |
| Free tier | 14-day free trial; no self-service free plan ([billing](/billing)) | 30-day free trial; no free plan — see [pricing](https://piwik.pro/pricing/) |

## How each one measures visitors

Piwik PRO's default is a visitor cookie, which unlocks the full suite: visitor profiles, multi-session attribution and audience segments. For visitors who have not consented, it offers a privacy-friendly mode built on a session hash — computed from the IP address, operating system, browser name and version, language, enabled plugins and the site ID — that recognises a session for 30 minutes after the last event. IP masking can strip bytes before the address is saved. When the visitor accepts the consent manager's prompt, Piwik PRO upgrades to full tracking. The model gives you two data sets: anonymous for everyone, identified for those who agreed.

Sealmetrics has one data set. Every hit is timestamp, user agent, URL and referrer, grouped within a visit by an in-memory marker that lasts around two hours and contains nothing derived from the IP. There is no consent manager because there is nothing to consent to, and no "upgrade" path to identified tracking. The price is that Sealmetrics never reports unique visitors, session duration or user-level journeys, on any plan.

## When Piwik PRO is the better choice

- Your procurement checklist requires a vendor with ISO 27001 or SOC 2 — Piwik PRO states it holds both; Sealmetrics holds neither.
- You need a choice of hosting region or a private cloud deployment, or you must keep data in a specific non-Irish jurisdiction.
- You want an integrated tag manager and consent manager, and user-level analytics for the visitors who consent.

## When Sealmetrics is the better choice

- You want to remove the consent layer from analytics altogether instead of managing two data sets.
- You do not want an identifier — even a 30-minute one — that takes the IP address as an input.
- You want the lightest tracker and a simpler vendor review: no personal data, EU-only storage in one region, a public [DPA](https://sealmetrics.com/dpa/) and a three-entry subprocessor list.

## Frequently asked questions

### Is Piwik PRO's anonymous mode consentless?

Piwik PRO's documentation says you can choose not to use a consent form and collect data through session identifiers. Its session hash still takes the IP address as an input, which is a different design from Sealmetrics, where no identifier is derived from the IP at all. Whether either approach satisfies a given regulator is a question for your DPO; neither vendor's claim is a regulatory approval.

### Where can Piwik PRO data be hosted?

Piwik PRO's pricing page lists EU-operated hosting in Sweden, plus Germany, the Netherlands, the US, Hong Kong and UAE North, with private cloud on Enterprise. Sealmetrics offers one location: Dublin, Ireland.

### Does Sealmetrics have a consent manager or tag manager?

No. Sealmetrics does not need a consent manager for its own measurement, and it installs as a single script or through your existing tag manager — see [Google Tag Manager](/integrations/google-tag-manager).

### Which is lighter on the page?

Piwik PRO's script measured about 26 KB gzipped on its demo instance in August 2026, the lightest of the incumbent tools Sealmetrics has measured; the Sealmetrics tracker measured 1.1 KB. Details and method are in the [tracker performance report](/guides/tracker-performance-report).

**Note:**
- Piwik PRO collects anonymous data before consent and full data after it; Sealmetrics has one consentless data set.
- Piwik PRO's anonymous session hash includes the IP; Sealmetrics derives nothing from it.
- Piwik PRO states ISO 27001 and SOC 2 and offers several regions; Sealmetrics holds no certification and stores only in Dublin.

## Related documentation

- [Tracker performance report](/guides/tracker-performance-report)
- [Subprocessors](/compliance/subprocessors)
- [What We Track vs What We Don't](/security-privacy/what-we-track)
- [Why Sealmetrics Can Measure Without Consent](/security-privacy/why-no-consent)
