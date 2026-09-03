---
title: "CNIL Self-Assessment: Sealmetrics Compliance"
description: "Official CNIL self-assessment documentation for Sealmetrics analytics - demonstrating compliance with French consent exemption requirements."
canonical_url: "https://docs.sealmetrics.com/compliance/cnil-self-assessment"
lang: "en"
date_generated: "2026-09-03T23:47:35.161Z"
source_hash: "84d81025c59f9d5d045df357089aa52f564735281df469c22952d7692fd7c32d"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "compliance/cnil-self-assessment.mdx"
publisher: "Sealmetrics"
---

# CNIL Self-Assessment: Sealmetrics Compliance

Canonical page: https://docs.sealmetrics.com/compliance/cnil-self-assessment

*Reviewed: 12 August 2026. This is a self-assessment; no supervisory authority certifies analytics tools.*\
Sealmetrics is self-assessed as meeting all 5 permitted objectives and all 14 technical criteria of the [CNIL's auto-evaluation framework](https://www.cnil.fr/sites/default/files/2025-07/outil_d_auto-evaluation_mesure_d_audience.pdf) (July 2025) for consent-exempt audience measurement: no cookies, no stored IP address, country-level geolocation only, 24-month retention and per-publisher isolation. This document walks through each objective and criterion with the evidence and configuration behind it.

**Info:**
This self-assessment follows CNIL guidelines but **does not constitute CNIL certification**. Per CNIL guidance, providers cannot claim to be "certified" or "validated" by CNIL. This document demonstrates how Sealmetrics meets the published exemption criteria when properly configured.

---

## Does Sealmetrics meet the CNIL exemption criteria? {#executive-summary}

| Category | Status |
|----------|--------|
| **5 Permitted Objectives** | ✅ All compliant |
| **14 Technical Criteria** | ✅ All compliant |
| **Consent Exemption Eligible** | ✅ Yes |
| **Last Assessment Date** | February 2026 |

---

## Part 1: Permitted Objectives

CNIL allows consent exemption **only** when analytics are used for these 5 specific purposes:

### Objective 1: Performance Measurement
**Requirement:** Measure website/application performance metrics.

| Criterion | Sealmetrics Compliance |
|-----------|----------------------|
| Measures page load times | ✅ Yes |
| Tracks error rates | ✅ Yes |
| Limited to performance data | ✅ Yes - no behavioral profiling |

**Evidence:** Sealmetrics tracks pageviews, load events, and technical errors exclusively for performance analysis.

---

### Objective 2: Navigation Problem Detection
**Requirement:** Identify navigation issues affecting user experience.

| Criterion | Sealmetrics Compliance |
|-----------|----------------------|
| Detects 404 errors | ✅ Yes — error pages appear in the Pages report when they load the pixel |
| Identifies drop-off between funnel steps | ✅ Yes — aggregate, via the Funnel report |
| Tracks individual user flows or exit pages | ❌ No — would require per-visitor page sequencing |

**Evidence:** The Funnel report shows aggregate drop-off between defined steps, and the Pages report surfaces underperforming or erroring URLs. Sealmetrics does **not** reconstruct individual navigation paths or exit pages, because both require following one visitor across page loads — precisely the processing this exemption depends on avoiding.

---

### Objective 3: Technical & Ergonomic Optimization
**Requirement:** Optimize technical performance and user experience.

| Criterion | Sealmetrics Compliance |
|-----------|----------------------|
| Device/browser analysis | ✅ Yes |
| Screen resolution data | ✅ Yes |
| Used only for optimization | ✅ Yes - not for targeting |

**Evidence:** Device reports provide aggregated, anonymized data for UX optimization only.

---

### Objective 4: Server Capacity Estimation
**Requirement:** Estimate necessary server infrastructure.

| Criterion | Sealmetrics Compliance |
|-----------|----------------------|
| Traffic volume metrics | ✅ Yes |
| Peak usage identification | ✅ Yes |
| Real-time visitor counts | ✅ Yes |

**Evidence:** Real-time dashboard and traffic reports enable infrastructure planning.

---

### Objective 5: Content Analysis
**Requirement:** Analyze which content is consulted by visitors.

| Criterion | Sealmetrics Compliance |
|-----------|----------------------|
| Page view tracking | ✅ Yes |
| Content grouping | ✅ Yes |
| Aggregated statistics only | ✅ Yes |

**Evidence:** Pages report shows aggregated content performance without individual user tracking.

---

## Part 2: Technical Criteria (14 Points)

### Criterion 1: Purpose Limitation
**Requirement:** Tool must be used exclusively for audience measurement for the publisher's own account.

| Aspect | Compliance |
|--------|------------|
| Single-purpose tool | ✅ Sealmetrics is exclusively for analytics |
| Publisher's own account | ✅ Each client has isolated account |
| No secondary uses | ✅ No advertising, profiling, or resale |

**Configuration:** Default configuration. No additional setup required.

---

### Criterion 2: Anonymous Statistical Output
**Requirement:** Must produce only anonymous statistical data.

| Aspect | Compliance |
|--------|------------|
| Aggregated reports | ✅ All reports show aggregated data |
| No individual user data export | ✅ Cannot export individual sessions |
| Statistical anonymization | ✅ Data aggregated before display |

**Configuration:** Built into platform architecture. Cannot be disabled.

---

### Criterion 3: No Cross-Site Tracking
**Requirement:** Cannot track users across different websites or applications.

| Aspect | Compliance |
|--------|------------|
| First-party only | ✅ No third-party cookies (no cookies at all) |
| Site-isolated identifiers | ✅ Session identifiers incorporate the publisher account into their derivation, so the same browser yields different identifiers on different publishers' sites |
| No cross-domain identification | ✅ Hits are stored per account and never joined across sites |
| No unified IDs | ✅ No cross-site user graph, no shared advertising ID |

**Technical Implementation:**
```
Session marker: ephemeral (~2h), computed in the browser, never stored on the device
Session marker scope: per publisher account — the account is an input to the identifier's derivation, so identifiers cannot match across different publishers' sites
Cookies: none (neither first- nor third-party)
Cross-domain tracking: not performed — data is collected, stored, and reported per account
```

---

### Criterion 4: No Data Cross-Referencing
**Requirement:** Cannot cross-reference analytics data with other processing activities.

| Aspect | Compliance |
|--------|------------|
| Isolated data processing | ✅ Analytics data stays in Sealmetrics |
| No CRM integration for profiling | ✅ No user-level data merge |
| No external enrichment | ✅ No third-party data added |

**Configuration:** Platform architecture prevents data cross-referencing. API exports only aggregated statistics.

---

### Criterion 5: No Third-Party Data Transmission
**Requirement:** Cannot transmit non-anonymized data to third parties.

| Aspect | Compliance |
|--------|------------|
| No data sales | ✅ Sealmetrics never sells data |
| No third-party sharing | ✅ No data shared with external parties |
| Client owns their data | ✅ Data belongs exclusively to client |

**Legal Basis:** [Sealmetrics Privacy Policy](https://sealmetrics.com/privacy) and [DPA](https://sealmetrics.com/dpa) guarantee no third-party data sharing.

---

### Criterion 6: Cookie Lifetime ≤ 13 Months
**Requirement:** Cookie validity must not exceed 13 months, without automatic renewal.

| Aspect | Compliance |
|--------|------------|
| Cookie duration | ✅ **No persistent cookies used** |
| Session-based identification | ✅ Session IDs expire with browser session |
| No automatic renewal | ✅ N/A - no persistent storage |

**Technical Implementation:**
```
Storage method: Session-based (no cookies in default mode)
Maximum theoretical lifetime: Browser session only
```

**Note:** Sealmetrics exceeds this requirement by not using persistent cookies at all in standard configuration.

---

### Criterion 7: Data Retention ≤ 25 Months
**Requirement:** Collected data must not be retained beyond 25 months. Sealmetrics deliberately applies a stricter 24-month limit.

| Aspect | Compliance |
|--------|------------|
| Analytics data retention | ✅ 24 months maximum |
| Automatic deletion | ✅ Data purged after retention period |
| Raw logs retention | ✅ 1 day only |

**Data Retention Schedule:**
| Data Type | Retention Period |
|-----------|-----------------|
| Raw request logs | 1 day |
| Aggregated analytics | 24 months |
| Account configuration | Until account deletion |

---

### Criterion 8: IP Address Anonymization
**Requirement:** IP addresses must be anonymized (last octet removed minimum).

| Aspect | Compliance |
|--------|------------|
| IP storage | ✅ **IP is never persisted in the analytics database** (operational request logs are retained a maximum of 1 day) |
| Geolocation (default) | ✅ Country derived from browser timezone, not IP |
| In-memory use | ✅ IP is used in-memory only for rate limiting and blocklist matching, then discarded. It is never associated with a hit that reaches ClickHouse. (A GeoIP lookup was designed for the Agent Analytics bot detector, but that feature is **not live and cannot be enabled**, so no such lookup runs today.) |

**Technical Implementation:**
```javascript
// Country detection (default): browser timezone API
Intl.DateTimeFormat().resolvedOptions().timeZone

// No GeoIP lookup runs today: the Agent Analytics bot detector
// that would use one is not live and cannot be enabled.
```

**Note:** Sealmetrics goes beyond this requirement — no IP anonymization is needed because the IP is never persisted with analytics data in the first place.

---

### Criterion 9: Geolocation Precision Limit
**Requirement:** Geolocation must not be more precise than postal code level.

| Aspect | Compliance |
|--------|------------|
| Location precision | ✅ Country level only |
| No precise geolocation | ✅ No city/region/postal code |
| Privacy-preserving method | ✅ Timezone-based detection |

**Geolocation Data Collected:**
- Country (derived from timezone)
- No region, city, or postal code
- No GPS or IP-based location

---

### Criterion 10: Independent Data Collection Per Publisher
**Requirement:** For services serving multiple publishers, data collection must be independent for each.

| Aspect | Compliance |
|--------|------------|
| Client data isolation | ✅ Complete separation of datasets |
| Per-account tracking IDs | ✅ Each account has a unique tracking ID |
| Independent databases | ✅ Logical separation per account |

**Architecture:**
```
Account A ──► Isolated dataset A ──► Reports A only
Account B ──► Isolated dataset B ──► Reports B only
                    ↓
         No cross-account access possible
```

---

### Criterion 11: Totally Independent Trackers
**Requirement:** Trackers must be completely independent with no interdependencies.

| Aspect | Compliance |
|--------|------------|
| Unique tracking IDs | ✅ Each account has unique ID |
| No shared infrastructure impact | ✅ Client A cannot affect Client B |
| Independent configuration | ✅ Each account configured separately |

**Implementation:**
```html
<!-- Each client gets unique, independent tracker -->
<script src="https://t.sealmetrics.com/t.js?id=UNIQUE_ACCOUNT_ID" defer></script>
```

---

### Criterion 12: User Information Requirement
**Requirement:** Users must be informed about analytics via privacy policy.

| Aspect | Compliance |
|--------|------------|
| Documentation provided | ✅ Privacy policy template available |
| Clear information | ✅ Plain language explanation |
| Purpose explanation | ✅ Audience measurement stated |

**Recommended Privacy Policy Text:**
```
This website uses Sealmetrics for audience measurement. This tool
is configured to comply with CNIL guidelines for consent exemption.
It collects anonymous statistical data only, does not use cookies,
and does not track you across websites. You can block analytics
using your browser's privacy settings or an ad blocker.
```

---

### Criterion 13: Opt-Out Mechanism
**Requirement:** Users must have ability to refuse audience measurement.

| Aspect | Compliance |
|--------|------------|
| Opt-out available | ✅ Yes - via browser settings or site implementation |
| Easy to access | ✅ Standard browser controls |
| No individual tracking | ✅ Nothing personal to opt out of |

**Important Context:**

Sealmetrics does **not use localStorage, cookies, or any persistent storage** by default. This means:
- There is no individual user tracking to opt out of
- Data is collected as aggregate statistics only
- Each pageview is independent with no user identification

**Opt-Out Methods:**

1. **Browser-level blocking** - Users can block the tracking script using browser privacy settings or ad blockers
2. **Publisher-implemented opt-out** - Site owners can implement conditional script loading based on user preference

```html
<!-- Example: Publisher-implemented opt-out -->
<script>
  if (!localStorage.getItem('analytics_optout')) {
    var s = document.createElement('script');
    s.src = 'https://t.sealmetrics.com/t.js?id=YOUR_ID';
    s.defer = true;
    document.head.appendChild(s);
  }
</script>
```

**Note:** Since Sealmetrics collects only aggregate statistics without individual identification, the opt-out requirement is satisfied by standard browser controls.

---

### Criterion 14: No Reuse by Provider
**Requirement:** Analytics provider cannot reuse data for their own commercial purposes.

| Aspect | Compliance |
|--------|------------|
| No data monetization | ✅ Sealmetrics never sells data |
| No model training | ✅ Client data not used for AI/ML |
| No benchmarking without consent | ✅ No cross-client analysis |

**Legal Guarantee:** Our [Terms of Service](https://sealmetrics.com/terms) and [DPA](https://sealmetrics.com/dpa) legally prohibit any reuse of client data.

---

## Part 3: Data Processing Details

### Data Collected

| Data Point | Collected | Purpose | Anonymization |
|------------|-----------|---------|---------------|
| Page URL | ✅ | Content analysis | Aggregated |
| Referrer | ✅ | Traffic source | Aggregated |
| User agent | ✅ | Device analysis | Aggregated |
| Screen size | ✅ | UX optimization | Aggregated |
| Timezone | ✅ | Country detection | Country only |
| Session ID | ✅ | Visit counting | Temporary, hashed |
| IP address | ❌ | Not collected | N/A |
| Email/name | ❌ | Not collected | N/A |
| Precise location | ❌ | Not collected | N/A |

### Data NOT Collected

Sealmetrics explicitly does **not** collect:
- IP addresses
- Email addresses or personal identifiers
- Precise geolocation (GPS, city, postal code)
- Device fingerprints
- Cross-site identifiers
- Advertising IDs
- Social media profiles

---

## Part 4: Infrastructure & Security

### Data Location

| Aspect | Detail |
|--------|--------|
| **Processing location** | Dublin, Ireland (EU) |
| **Data storage** | EU only |
| **Subprocessors** | Visitor analytics data processed only in the EU (full list: Annex 3 of the [DPA](https://sealmetrics.com/dpa/)) |
| **International transfers** | None required |

### Security Measures

- TLS 1.3 encryption in transit
- AES-256 encryption at rest
- Regular security audits
- GDPR Article 32 technical measures

---

## Part 5: Configuration Checklist

To ensure CNIL compliance, verify your Sealmetrics configuration:

### Required Settings ✅

- [ ] Standard tracking mode enabled (not debug mode)
- [ ] No custom user ID implementation
- [ ] No PII in custom properties
- [ ] Privacy policy updated with Sealmetrics mention
- [ ] Opt-out mechanism available to users

### Recommended Settings

- [ ] Content grouping for aggregated analysis
- [ ] Conversion tracking without PII

### Prohibited Configurations ❌

- [ ] Do NOT pass email addresses as properties
- [ ] Do NOT use custom user IDs for cross-session tracking
- [ ] Do NOT combine with advertising/remarketing tools
- [ ] Do NOT export individual-level data for profiling

---

## Part 6: Compliance Statement

### Official Declaration

Sealmetrics declares that:

1. Our solution **meets the CNIL criteria** for consent-exempt audience measurement
2. When properly configured, Sealmetrics **can be implemented without requiring user consent** under Article 82 of French Data Protection Law
3. We provide **documentation and configuration guidance** to ensure compliant implementation
4. We **do not reuse client data** for any commercial purpose

### What does this mean for publishers in France?

Publishers using Sealmetrics in France can:
- ✅ Measure website traffic without consent banners
- ✅ Track conversions for their own business analysis
- ✅ Analyze content performance
- ✅ Monitor technical performance

Publishers **cannot**:
- ❌ Claim Sealmetrics is "CNIL certified" or "CNIL validated"
- ❌ Use Sealmetrics data for advertising purposes
- ❌ Combine Sealmetrics with profiling tools and claim exemption

---

## Part 7: Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | February 2026 | Initial self-assessment based on CNIL July 2025 framework |

---

## References

- [CNIL - Cookies: solutions pour les outils de mesure d'audience](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience)
- [CNIL - Self-Assessment Tool (PDF)](https://www.cnil.fr/sites/default/files/2025-07/outil_d_auto-evaluation_mesure_d_audience.pdf)
- [CNIL - Sheet n°16: Use analytics on your websites](https://www.cnil.fr/en/sheet-ndeg16-use-analytics-your-websites-and-applications)
- [Sealmetrics Privacy Policy](https://sealmetrics.com/privacy)
- [Sealmetrics DPA](https://sealmetrics.com/dpa)

---

## Contact

For compliance questions or DPO inquiries:
- **Email:** privacy@sealmetrics.com
- **DPO Contact:** dpo@sealmetrics.com

**Note:**
- All 5 permitted objectives and all 14 technical criteria of the CNIL's July 2025 auto-evaluation framework are met on Sealmetrics' own assessment (last assessed February 2026).
- No cookies are used, the IP address is never persisted with analytics data, geolocation is country-level from the browser timezone, and retention is 24 months (below the 25-month ceiling).
- Publishers may measure without a consent banner under Article 82 of French data protection law, but cannot claim Sealmetrics is "CNIL certified" or "CNIL validated".

## Related documentation

- [Does Sealmetrics comply with CNIL guidelines?](/compliance/cnil-self-assessment) — the plain-language overview of CNIL consent exemption.
- [Analytics Cookies: Consent Exemption Requirements](/compliance/analytics-cookies-exemption) — how CNIL and AEPD exemption criteria compare.
- [UK PECR Self-Assessment: Sealmetrics Compliance](/compliance/uk-pecr-self-assessment) — the equivalent self-assessment for the UK.
- [Do Temporary Session Identifiers (Session IDs) Require Consent Under GDPR?](/legal/gdpr-and-eprivacy/do-session-ids-require-consent) — the session-ID condition assessed above.
- [Cookie Consent Reform: The End of Banner Fatigue](/compliance/omnibus/cookies-eprivacy) — how the Digital Omnibus reinforces this exemption.
