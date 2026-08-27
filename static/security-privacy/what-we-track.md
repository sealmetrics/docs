---
title: "What We Track vs What We Don’t"
description: "Field-by-field list of what Sealmetrics records on every hit, how long each field is kept, and what it never collects."
canonical_url: "https://docs.sealmetrics.com/security-privacy/what-we-track"
lang: "en"
date_generated: "2026-08-12T11:53:00.332Z"
source_hash: "47af9bd5c98072577bfb90705ade3e3187967630524e38cd2f2781a29070b7fa"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "security-privacy/what-we-track.mdx"
publisher: "Sealmetrics"
---

# What We Track vs What We Don’t

Canonical page: https://docs.sealmetrics.com/security-privacy/what-we-track

Sealmetrics records a small set of **non-identifying variables** per page view ("hit") — timestamp, user agent (for anonymous device classification), current URL, referral URL, and a short-lived contextual session marker — and never collects personal data or sets cookies. **No IP address, user ID, cross-session identifier, name, email or persistent device fingerprint is stored.** Because this minimal, aggregation-only dataset contains no personal data, the GDPR obligations that attach to personal data are not triggered, and there is nothing stored on the visitor's device for the ePrivacy Directive to require consent for. This page is the authority on what is collected and for how long; for the concept and the legal reasoning, see [What is Consentless Analytics?](/security-privacy/consentless-analytics).

---

## What We DO Track
### The Four-Variable System (Isolated Hits)

Sealmetrics processes each page view (“hit”) independently using **only four non-identifying data points**:

#### 1. Timestamp
- **Purpose:** time-based analysis and trend insights
- **Privacy:** cannot identify an individual

#### 2. User Agent
- **Purpose:** anonymous device classification (browser family, OS family, mobile/desktop/tablet)
- **What we keep:** the raw UA string is stored in the event row alongside the derived category buckets. Event-level rows are purged after 1 day; the derived category dimensions (browser family, OS family, device type) persist in aggregated reports for 24 months.
- **What we never do:** the UA is never linked to an individual, never joined with any personal identifier (we don't have one), and never used to reconstruct a user's history across sessions. It's a **category signal**, not an identifier.

#### 3. Current URL
- Page path
- Page popularity
- Anonymous content performance

#### 4. Referral URL
- Anonymous attribution
- Campaign performance
- Traffic source identification

#### 5. Session context marker
- **What it is:** an in-memory, short-lived identifier scoped to a single browsing session (~2-hour inactivity timeout, GA4-style), derived from the visitor's browser context. It exists so that within one session we can distinguish "second pageview" from "new entrance".
- **What it isn't:** a cross-session identifier. It is not a cookie, it is not stored in the browser (localStorage, sessionStorage, or otherwise), and it does not persist beyond the session. It cannot be used to recognize a returning visitor.
- **Site-isolated by design:** session identifiers incorporate the publisher account into their derivation, so the same browser yields different identifiers on different publishers' sites — no cross-site correlation is possible at the identifier level.
- **Why it's compliant:** the identifier is context-derived and short-lived — it does not enable individual tracking under GDPR Article 4(1), which is why analytics without user identifiers can operate without consent under the CNIL's audience-measurement criteria. Note that no Article 6 legal basis is needed for the stored dataset: with no personal data in it, the GDPR does not apply to it (Recital 26).

---

## How Long Each Field Is Kept

Retention is **fixed and identical for every plan**, enforced by database TTLs. Nothing here is configurable per customer.

| What | Retention | Notes |
|------|-----------|-------|
| Event-level rows (including the raw user agent string) | **1 day** | The row that holds the individual hit, then purged |
| Session context marker | ~2 hours | In-memory only (Redis), expires with the inactivity window |
| Hourly aggregates | 90 days | Hour-by-hour reporting |
| Daily aggregates and conversions | 24 months | Includes the *derived* device categories — browser family, OS family, device type |

The distinction that matters for the user agent: **the raw UA string lives for 1 day** in the event row. What survives for 24 months is only the derived category (for example "Chrome / Windows / desktop") inside aggregate counts — never the original string, and never attached to anything that identifies a person.

Full operational retention (logs, backups, account closure) is documented in [Data Location & Retention](/security-privacy/data-location).

---

## What This Allows Us to Measure

### 1. Page Analytics
- Pageviews (aggregated)
- Top pages
- Anonymous navigation patterns

### 2. Traffic Analytics
- Entrances (anonymous hits)
- Traffic volume trends
- Marketing channel performance
- Within-session engagement — bounce rate, engaged entrances, engagement rate, pages per session. These are computed inside a single session from the session context marker; they never require recognising a returning visitor. Session *duration* and unique visitors are not measured. See the [Metrics Reference](/reports/definitions).

### 3. Engagement Behavior (Custom Events)
- Click events
- Scroll depth
- Form interactions
- Video plays
- Downloads

ALL aggregated — no user-level behavior.

### 4. Entry Points
- Entry pages (landing pages)
- Internal search (anonymous; via events)

Exit pages and individual navigation paths are **not** tracked — reconstructing either requires sequencing one visitor's pageviews, which needs a persistent identifier.

### 5. Campaign & Marketing Analytics
- UTM campaign tracking
- Referrer attribution
- Search traffic
- Social media traffic
- Revenue attribution (aggregated)

### 6. Conversion Tracking
- Goal completions
- E-commerce events
- Lead generation
- Micro-conversions
- Channel-level revenue attribution

### 7. Anonymous Device Data
- Browser category
- OS category
- Desktop / mobile / tablet
- Screen-size buckets
- Language

### 8. Geographic Data
- **Country — primary source: browser timezone.** Every visit's country comes from `Intl.DateTimeFormat().resolvedOptions().timeZone`, mapped to the country most represented by that IANA zone. No IP lookup involved.
- ❌ GeoIP country — **not collected**. A stateless GeoLite2 lookup was designed for the Agent Analytics bot detector, but that feature is **not live and cannot be enabled**, so no IP-based country lookup runs on any account.
- ❌ Region / City — **not collected**.

### 9. Automated-traffic detection signals — not collected

**Caution:**
Agent Analytics, an automated-traffic detector that would classify traffic as human vs. automated, is **designed but not live, and cannot be enabled on any account**. **No account collects any of the signals below today.** They are listed so this page stays a complete statement of what could ever be collected.

If it ships, it would store aggregate, per-hit **environmental** and **behavioral** signals about the browser and the interaction pattern — not about the person. Examples: WebDriver flag, whether the WebGL renderer is `SwiftShader`, screen size buckets, aggregate mouse-movement linearity, click-timing variance. They would never be associated with an identifier, and the purpose would be filtering bot traffic out of reports. See [Bot Detection](/security-privacy/bot-detection) for what actually runs today.

### 10. Business Intelligence Metrics
- Conversion rate
- Average order value
- ROAS
- Funnel performance

---

## What We DO NOT Track

### No Personal Data Stored
❌ IP addresses (used in memory only, never persisted)
❌ User IDs
❌ Emails
❌ Phone numbers
❌ Names
❌ Persistent identifiers (no cross-session or cross-device linking)

### No Individual-Level Tracking
❌ User journeys across sessions
❌ Returning-visitor recognition
❌ Individual preferences
❌ Personal browsing behavior
❌ Any join between a hit and a person's identity

### No Cross-Site Tracking
❌ Third-party cookies
❌ Advertising identifiers
❌ Cross-domain identification
❌ Social media identifiers

### No Sensitive Personal Data
❌ Health
❌ Financial
❌ Political
❌ Religious
❌ Demographic profiling

### No Device-Level Identifiers
❌ Device IDs
❌ MAC addresses
❌ Hardware fingerprints
❌ Advertising IDs

### No Tracking Technologies
❌ Cookies
❌ LocalStorage
❌ SessionStorage
❌ Fingerprinting
❌ Terminal code
❌ Web beacons

### No Private Communications or Content
❌ Email contents
❌ Chat messages
❌ Form personal data (only event counts)
❌ Uploaded files
❌ Social media posts
❌ Documents

---

## Why This Dataset Needs No Consent

- **GDPR** — European company, customer analytics data stored only in Dublin, Ireland. No personal data is collected, so the obligations that attach to personal data are not triggered. Hits are processed in isolation and no identifier is carried across sessions.
- **ePrivacy Directive** — nothing is stored on or read from the visitor's device (no cookies, no localStorage, no sessionStorage), so the Article 5(3) consent requirement does not attach.
- **CCPA / PECR** — no personal information is collected and no user-level data is sold or shared.

Sealmetrics holds no third-party security certification (no ISO 27001, no SOC 2), and no supervisory authority certifies analytics tools. The pages under [compliance](/compliance) are our own self-assessments against published criteria. A signed DPA is available at [sealmetrics.com/dpa](https://sealmetrics.com/dpa/).

---

## How We Decide What to Track

Before tracking any metric, we evaluate:

- **Privacy Risk:** Could this identify someone?
- **Business Need:** Is this essential?
- **Legal Compliance:** GDPR, ePrivacy, CCPA, PECR
- **Future Proofing:** Will it remain compliant?
- **User Expectation:** Would users expect this?

Sealmetrics always chooses the **more restrictive option**.

---

## Summary

Web analytics that answers business questions does not require personal data. From the fields above, Sealmetrics reports:

- every hit, with no loss from consent rejection
- channel and campaign attribution
- conversions, revenue and ROAS
- aggregate engagement and funnel performance

What it does not report is anything tied to an individual — that is the deliberate trade-off that removes the consent requirement.

## Related documentation

- [What is Consentless Analytics?](/security-privacy/consentless-analytics) — the concept and the legal basis in full
- [Data Location & Retention](/security-privacy/data-location) — where the data lives and the complete retention schedule
- [How Attribution Works Without a User-ID](/security-privacy/attribution-without-userid) — how the four variables still produce attribution
- [How Sealmetrics determines the country without using IP addresses](/security-privacy/country-detection) — timezone-based geo without personal data
- [Why Sealmetrics Can Measure Without Consent](/security-privacy/why-no-consent) — why this minimal dataset needs no consent
- [Frequently Asked Questions](/faq/privacy-security) — common questions about what is and isn't collected
- [Analytics Cookies: Consent Exemption Requirements](/compliance/analytics-cookies-exemption) — the criteria that make consent-free analytics lawful
