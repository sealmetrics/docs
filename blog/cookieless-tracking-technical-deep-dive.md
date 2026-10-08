---
title: "How Session-Based Tracking Works: Cookieless Architecture Explained"
description: "How session-based tracking replaces cookies. Technical deep dive into Sealmetrics' architecture: hashing, token rotation, and data flow."
canonical_url: "https://docs.sealmetrics.com/blog/cookieless-tracking-technical-deep-dive"
lang: "en"
date_generated: "2026-10-08T17:05:41.082Z"
source_hash: "ed71891319d5a1b22bf0caa53749adcc4a30d8c36b50b4bcb10ecfe16b216057"
content_type: "blog"
owner: "content"
llm_priority: "useful"
source_file: "cookieless-tracking-technical-deep-dive.mdx"
publisher: "Sealmetrics"
---

# How Session-Based Tracking Works: Cookieless Architecture Explained

Canonical page: https://docs.sealmetrics.com/blog/cookieless-tracking-technical-deep-dive

<!-- AUTO-TLDR:START -->
> **TL;DR** — How session-based tracking replaces cookies. Technical deep dive into Sealmetrics' architecture: hashing, token rotation, and data flow.
<!-- AUTO-TLDR:END -->

## Introduction

**The Problem**: Google Analytics loses the visitors who drop out at the banner through [cookie rejections and banner ghosting](/blog/cookie-banner-ghosting-data-loss) — where you land depends on your sector, brand strength and traffic sources. Cookieless analytics solves this by tracking without cookies, consent banners, or IP addresses.

**What You'll Learn**:
- How cookieless tracking actually works technically
- Why it captures the data cookie-based tools miss
- The session-based architecture behind Sealmetrics
- Implementation differences vs traditional analytics
- The legal position: minimal, pseudonymised data under legitimate interest (Art. 6(1)(f))

**Key Takeaways**:
- Cookieless tracking uses session identifiers instead of persistent cookies
- Nothing stored on the device and no data that identifies anyone (no consent banner needed for Sealmetrics' own analytics, self-assessed; in Germany an open question — see [Germany](/compliance/germany-ttdsg-self-assessment))
- 24-month retention on aggregated, non-identifying reports
- Sealmetrics captures what GA4 misses: [ghosted users](/blog/cookie-banner-ghosting-data-loss), cookie rejecters, Safari/Firefox visitors

For a complete overview of cookieless analytics, see our [Cookieless Analytics: Complete Guide 2026](/blog/cookieless-analytics-guide).

---

## Table of Contents

1. How Cookies Work (Why They Fail)
2. Cookieless Architecture Explained
3. Session-Based Tracking Deep Dive
4. Zero IP Storage Implementation
5. GDPR Compliance Through Technical Design
6. Sealmetrics Cookieless System
7. Performance & Data Accuracy
8. Comparison: Cookieless vs Cookie-Based
9. Why Sealmetrics Wins Over Competitors
10. FAQ: Technical Questions

---

## How Cookies Work (Why They Fail)

### The Traditional Cookie-Based Approach

Google Analytics and most cookie-based analytics tools use **persistent third-party cookies** to track users:
```javascript
// Traditional Google Analytics approach (simplified)
// Sets cookie that persists across sessions
document.cookie = "ga_id=" + generateUUID() + "; max-age=63072000"; // 2 years

// Sends hits with same user ID across visits
fetch('https://analytics-backend.com/collect', {
  body: {
    userId: getCookie('ga_id'),
    pageUrl: window.location.href,
    timestamp: Date.now()
  }
});
```

**What Happens**:
1. JavaScript runs on page load
2. Creates persistent cookie (stored on user's device for 2 years)
3. Sends cookie value with every page view
4. Server ties all hits to single user across visits

### Why This Fails in EU

**Cookie Rejection**: many EU visitors reject the consent banner
**Banner Ghosting**: a large share of visitors ignore consent banners entirely, making no choice — usually a bigger group than the rejecters
**Browser Changes**: Safari ITP + Firefox ETP blocks third-party cookies by default

**Result**: [Google Analytics loses the visitors who reject or ignore the cookie banner](/blog/google-analytics-vs-sealmetrics). Note that this is smaller than the raw rejection rate — Consent Mode models part of the gap back in as estimates — and it is still more than enough to make the data unreliable for decision-making, because the loss is not spread evenly across your channels.

**The Core Issue**: Cookies require **explicit consent** under GDPR Article 7. When users reject or ignore, tracking stops completely.

---

## Cookieless Architecture Explained

### The Fundamental Shift

Cookieless analytics inverts the approach:

**Cookie-Based** → One persistent ID across all sessions
**Cookieless** → No persistent ID: the stored session identifier changes every day

This single change has profound implications:
```
COOKIE-BASED:
User A visits → Generate cookie ID "abc123"
Cookie stored for 2 years on device
User A visits again 3 months later → Same ID "abc123"
= Can track across time and devices

COOKIELESS:
User A visits (Nov 14, 2pm) → Browser computes device hash, server stores daily pseudonym "sess_1234"
Session expires after visit ends (~2h inactivity)
User A visits again (Nov 20, 3pm) → New daily salt → different stored pseudonym "sess_5678"
= Cannot link across days, only within single visit
BUT = no consent-driven loss (no banner needed, self-assessed)
```

### Why This Changes Everything

**No consent banner — see the [GDPR framework guide](/blog/gdpr-compliant-analytics-framework)**:

Cookieless analytics doesn't require consent because:
1. No persistent identifiers = the session identifier rotates daily and, once rotated, cannot be reconstructed
2. No IP addresses stored = cannot identify individuals
3. Sessions reset = no cross-session profiling
4. Nothing written to the device (standard browser properties are read only to compute the session identifier — see [consent exemption requirements](/compliance/analytics-cookies-exemption) for how ePrivacy Article 5(3) applies)

**Translation**: On our own assessment, Sealmetrics measures all the traffic you lose today to the cookie banner, without one, for its own analytics (Germany: open question). The short-lived pseudonymised data it does handle relies on legitimate interest, GDPR Article 6(1)(f), and reports are always aggregated.

---

## Session-Based Tracking Deep Dive

### What is a Session Identifier?

A **session identifier** is computed in the browser on each page load and re-keyed daily on the server, so nothing stored links a device across days:
```javascript
// Sealmetrics cookieless approach
// NO persistent cookies, NO IP storage

// 1. Compute the session identifier in the browser:
// a hash of standard device characteristics (user agent,
// timezone, languages, screen resolution, colour depth, ...)
// plus the site's account ID. This hash is a device
// fingerprint; the server re-keys it with a daily salt that
// is destroyed on rotation, and never stores it as sent.
const sessionId = deriveSessionId(); // "sess_a7k9m2x1"

// 2. Never stored on the device
// No cookies, no localStorage, no sessionStorage

// 3. Collect pageviews with session ID
function trackPageview() {
  const payload = {
    sessionId: sessionId,        // Re-keyed daily server-side ✓
    url: window.location.href,   // Page URL
    timestamp: Date.now(),       // When viewed
    referrer: document.referrer, // Where from
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Country, not IP
    // NO IP address stored ✓
    // NO data that identifies anyone ✓
  };

  fetch('https://sealmetrics.io/api/events', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// 4. Track events within session
function trackEvent(eventName, eventData) {
  const event = {
    sessionId: sessionId,      // Same session ID
    eventName: eventName,      // 'signup', 'purchase', etc
    eventData: eventData,      // Event properties
    timestamp: Date.now()
  };

  fetch('https://sealmetrics.io/api/events', {
    method: 'POST',
    body: JSON.stringify(event)
  });
}
```

### The Dual-System Architecture (Sealmetrics Specificity)

Sealmetrics uses a proprietary **dual-system** to maximize data capture:

**System 1: Session-ID Tracking** (Primary)
```javascript
// Visitor arrives
// Session ID computed: "sess_k9m2x1a7"
// All pageviews linked to this session
// Expires: end of visit (~2h of inactivity)
// Data: Visit patterns, pages viewed, in-session engagement
```

**System 2: Isolated Hits** (Fallback)
```javascript
// If a session identifier can't be computed
// The JavaScript tracker still sends the pageview as an isolated hit
// No session linking (single pageviews only)
// Data: counted, but not stitched into a journey
```

**Result**:
- Pageviews without a session identifier are still counted, as isolated hits
- Visits where the JavaScript never runs (JS disabled, some ad blockers) are not measured — there is no server-side capture for them

---

## Zero IP Storage Implementation

### Why IP Storage Matters for GDPR

IP addresses are **personal data** under GDPR. Storing them requires:
1. Legal basis (consent OR legitimate interest)
2. Data Processing Agreement with hoster
3. Data protection impact assessment

**Most "cookieless" tools still hash IPs**, creating gray area:
```javascript
// Competitor approach
const clientIP = req.headers['x-forwarded-for'];
const hashedIP = hashFunction(clientIP); // SHA256 hash
store(hashedIP); // Still stored! Still requires DPA

// Issue: Even hashed IPs can be re-identified
// GDPR regulators increasingly view hashing as insufficient
```

### Sealmetrics: True Zero-IP Architecture
```javascript
// Sealmetrics approach - NO IP in analytics data

// 1. NO IP stored in the analytics database
// 2. NO IP hashing
// 3. NO IP linked to any hit, session, or metric
// 4. IP used only transiently server-side (anti-abuse checks,
//    short-lived operational logs with limited retention)

const trackPageview = async () => {
  const payload = {
    sessionId: 'sess_a7k9m2x1',
    url: window.location.href,
    timestamp: Date.now(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // IP intentionally absent ✓
  };

  // Request IPs never reach the analytics database

  await fetch('https://sealmetrics.io/api/events', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};
```

### Technical Implementation Benefits

**No IP, nothing on the device** = **No Consent Banner**
```
GDPR Compliance Chain:
Personal Data = requires an Article 6 legal basis
                (consent, or legitimate interest + safeguards)

Cookieless tracking (no IP) = pseudonymised session ID, rotated daily
                            = unrecoverable after rotation, reports aggregated
                            = legitimate interest, Art. 6(1)(f)
Hashed IP = disputed, regulators disagree = gray area risk
```

**Practical difference for you**:
- Sealmetrics: Deploy without consent banner for its own analytics (self-assessed; Germany: open question) ✓
- Google Analytics: MUST have consent + DPA ✓
- Other tools: Work without consent, but hash IPs (regulatory risk)

For a complete comparison of [cookieless vs cookie-based analytics](/blog/cookieless-analytics-vs-cookie-based), see our detailed technical guide.

---

## GDPR Compliance Through Technical Design

### The Legal Foundation

For a complete understanding of GDPR compliance for analytics, read our [GDPR Compliant Analytics Framework guide](/blog/gdpr-compliant-analytics-framework).

**GDPR Recital 26 - Anonymous Information**:

> "The principles of data protection should therefore not apply to anonymous information, namely information which does not relate to an identified or identifiable natural person."

Pseudonymised data is still personal data, though, and a daily-rotating session identifier is a pseudonym while its key and salt exist. Sealmetrics keeps that window to one day: after the rotation not even Sealmetrics can reconstruct the identifier, and reports are always aggregated.

**Sealmetrics Technical Design Keeps the Data Minimal**:

| Requirement | Implementation | How Sealmetrics Does It |
|------------|-----------------|------------------------|
| Lawful Basis | Needed if personal data is processed | Legitimate interest, Art. 6(1)(f), for short-lived pseudonymised data |
| Minimal Identifier | Session-only, no ID | Session identifier re-keyed daily, never stored as sent, unrecoverable after rotation |
| No IP Storage | Cannot identify individuals | Zero IP collection |
| Data Minimization | Collect only necessary | No email, no stored device fingerprint |
| Storage Limitation | Don't keep longer than needed | 24-month retention max |
| Transparency | Privacy Policy required | Disclose to users |
| Balancing Test | Conduct DPIA | Sealmetrics provides DPA |

### GDPR Article 25 - Data Protection by Design

Sealmetrics cookieless architecture **embeds compliance into code**:
```javascript
// Article 25: Data Protection by Design and Default

// ✓ Data Minimization Built-In
const minimumRequiredFields = {
  sessionId: true,      // Required: track visit
  url: true,            // Required: know which page
  timestamp: true,      // Required: when visited

  // NOT collected:
  // ipAddress: false,
  // deviceId: false,
  // macAddress: false,
  // emailHash: false,
};

// ✓ Storage Limitation Built-In (fixed for all plans)
const retentionPolicy = {
  eventDetailDays: 14,         // Event-level rows purged after 1 day
  hourlyAggregateDays: 90,     // Hourly aggregates: 90 days
  dailyAggregateDays: 730,     // Daily aggregates & conversions: 24 months
  // Automatically enforced by database TTLs
};

// ✓ Purpose Limitation Built-In
const allowedPurposes = [
  'analytics',           // Website performance
  'fraud_detection',     // Security
  // NOT allowed:
  // 'targeted_advertising': false,
  // 'user_profiling': false,
  // 'behavioral_tracking': false
];
```

---

## Sealmetrics Cookieless System

### Full Architecture Overview
```
┌─────────────────────────────────────────────────────────┐
│                    WEBSITE VISITOR                      │
│              (Chrome, Safari, Firefox, etc)             │
└────────────────────────┬────────────────────────────────┘
                         │
                    Page loads
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              SEALMETRICS TRACKING CODE                  │
│  (JavaScript snippet injected in website)               │
│                                                         │
│  1. Compute session hash (never stored on device)      │
│  2. Collect pageview data                              │
│  3. NO IP capture                                      │
│  4. NO cookie creation                                 │
└────────────────────────┬────────────────────────────────┘
                         │
                    HTTPS POST
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              SEALMETRICS API ENDPOINT                   │
│         (Receives pageview/event data)                  │
│                                                         │
│  • Validates data integrity                            │
│  • Filters spam/bot traffic                            │
│  • Stores in database (encrypted)                      │
│  • Does NOT log IP addresses                           │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              DATA AGGREGATION LAYER                     │
│                                                         │
│  • Sessions aggregated by date                         │
│  • Pageviews grouped by URL                            │
│  • Events counted and categorized                      │
│  • Retention policy enforced (24-month max)            │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              DASHBOARD & REPORTS                        │
│         (What you see in analytics interface)           │
│                                                         │
│  • Session count (by date, device, source)             │
│  • Pageview metrics (views, bounce rate, time)         │
│  • Event tracking (signups, purchases, etc)            │
│  • Custom segments (referrer, device, etc)             │
│  • Data exports (designed for the GDPR)                │
└─────────────────────────────────────────────────────────┘
```

---

## Performance & Data Accuracy

### How Cookieless Captures More Data

**Google Analytics (cookie-based)**: only the visitors who accept the banner are measured. Those who reject it or simply ignore it are lost, and browser protections such as Safari's ITP shorten what is kept for the rest. How large the gap is depends on the site — measure it side by side; in the [Incapto case](https://sealmetrics.com/case-studies/incapto/) (one Shopify store, not a benchmark), GA4 did not record 29% of real visits.

**Sealmetrics (cookieless)**: there is no banner to reject or ignore. Every visitor whose browser runs the tracker is measured — most visits with a session identifier, and the few without one as isolated hits (each counted as a new entrance). Visits where the JavaScript never runs (JavaScript disabled, or an ad blocker that stops it) are not measured.

### Accuracy Comparison Table

| Metric | Google Analytics | Other Cookieless Tools | Sealmetrics |
|--------|-----------------|----------------------|------------|
| **Data Capture Rate (EU)** | Only visitors who consent | Higher, but non-zero loss where consent applies | **No consent-driven loss** |
| **Banner Required** | Yes | No | **No** |
| **IP Stored** | Yes | Hashed | **No** |
| **Consent Required** | Yes | No | **No** |
| **Session Expiry** | 2 years | 30 mins - Session-based | **Session-based** |
| **GDPR position** | Requires DPA + consent | Built-in | **Legitimate interest, unrecoverable daily identifier** |
| **Consent-driven data loss** | Varies by site | Lower, non-zero | **None** |

**Why Sealmetrics is Superior**:
- No data loss from cookie rejection
- No regulatory gray area (true zero-IP)
- No banner fatigue for users
- Better decision-making, on your whole audience rather than the consenting slice of it

Want to learn more about why [privacy-first analytics matters in 2025](/blog/privacy-first-analytics-2025)? Read our comprehensive guide.

---

## Comparison: Cookieless vs Cookie-Based

### Technical Architecture Differences

**COOKIE-BASED (Google Analytics)**
```
Day 1: User visits
├─ Cookie created: "ga_id=abc123" (2-year expiry)
├─ Stored on user device
└─ Requires: Consent, Privacy Policy, DPA

Day 30: Same user visits again
├─ Cookie exists: "ga_id=abc123"
├─ Sent with request
└─ Same visitor recognized

Day 365: User visits again
├─ Cookie still exists: "ga_id=abc123"
├─ Still same visitor
└─ 2-year cross-session tracking

Day 365: Safari user visits
├─ Safari ITP blocks third-party cookies
├─ "ga_id" not created
└─ Not tracked (lost entirely)
```

**COOKIELESS (Sealmetrics)**
```
Day 1: User visits
├─ Session computed: "sess_xyz" (in-browser hash, re-keyed daily on the server)
├─ Never stored on the device; session ends after ~2h of inactivity
└─ No consent banner (nothing stored on the device; self-assessed)

Day 1: Same user browses 3 pages
├─ All 3 pages linked to "sess_xyz"
├─ Session metrics calculated
└─ Visit understood

Day 2: Same user visits again
├─ NEW stored identifier: "sess_abc" (new daily salt)
├─ No link to previous session
└─ Treated as new visitor

Day 30: Same user visits again
├─ NEW session: "sess_def"
├─ Can't recognize returning user
└─ But the visit is still measured

Day 365: Safari user visits
├─ Session created: "sess_ghi" (normally)
├─ Safari doesn't block sessions
└─ Tracked fully (no loss)
```

### Data You Get With Each Approach

| Question | Cookie-Based Answer | Cookieless Answer |
|----------|-------------------|-------------------|
| How many visits? | Only visitors who consent | **All of them** |
| How many sessions? | Unknown (many lost) | **All tracked** |
| Pages per session? | Biased (low estimate) | **Accurate** |
| Bounce rate? | Inflated (missing data) | **Accurate** |
| Which pages convert? | Underestimated | **Accurate** |
| Traffic source effectiveness? | Unreliable | **Accurate** |
| Are users returning? | Only those accepting cookies | **Not measured — each entrance counts as new** |
| Where do visitors from Germany go? | Only German visitors who consent | **All German traffic** |

---

## Why Sealmetrics Wins Over Competitors

### Technical Superiority

For detailed platform comparisons, see:
- [Sealmetrics vs Google Analytics](/blog/google-analytics-vs-sealmetrics)
- [Sealmetrics vs Plausible](/blog/sealmetrics-vs-plausible)

**Cookie-Based Analytics (e.g., Google Analytics)**
- ❌ Loses the EU visitors who reject or ignore the banner
- ❌ Requires consent banner
- ❌ Stores IPs (even latest versions)
- ❌ Safari ITP blocks tracking
- ✓ Excellent for non-GDPR regions

**Other Cookieless Tools**
- ✓ Cookieless approach
- ✓ No banner needed
- ⚠️ Hash IPs (gray area)
- ✓ Privacy-focused
- ❌ Can miss JS-blocked traffic
- ❌ Some require self-hosting

**Sealmetrics**
- ✓ True cookieless (sessions only)
- ✓ Zero IP storage (true GDPR)
- ✓ No consent-driven data loss (dual system)
- ✓ No consent needed
- ✓ Works with Safari, Firefox, Chrome
- ✓ Simple 1-minute setup

### The Bottom Line

Sealmetrics captures what competitors miss:
- **The traffic a cookie-based tool misses** — the amount is specific to your site
- **All browsers equally** (no Safari data loss)
- **Zero IP stored**, which sidesteps the hashed-IP debate rather than answering it
- **No banner fatigue** (no consent popup)
- **Better insights** (based on your whole audience, not the consenting part of it)

---

## FAQ: Technical Questions

### How does Sealmetrics work without cookies?

Sealmetrics computes a **session identifier** in the browser from a hash of standard device characteristics. It is never stored on the device; before anything is stored, the server re-keys it with a daily salt that is destroyed on rotation, so the stored identifier changes every day and two days of the same device cannot be re-linked — not even by Sealmetrics. A session ends after ~2 hours of inactivity. Unlike cookies that persist for years, nothing persists on the device or links visits across days. See [what we track](/security-privacy/what-we-track#6-session-identifier).

### Why doesn't Sealmetrics store IP addresses?

IP addresses are **personal data** under GDPR. Storing them (even hashed) requires consent or another legal basis. Sealmetrics never persists IPs in the analytics database — they are used only transiently server-side for security and anti-abuse checks, and appear only in short-lived operational logs with limited retention. No analytics metric is ever calculated from an IP.

### Can I track returning visitors with Sealmetrics?

**Not across visits.** The stored identifier changes every day and is never used to link one visit to another. So you can't say "John returned on Tuesday" (you don't know it's John). Each entrance is counted as new, independent data — there is no returning-visitor metric, because no identifier links one visit to another.

This is a **feature, not a bug**: Returns you get privacy compliance while competitors need consent.

### How does Sealmetrics handle bot traffic?

Sealmetrics filters bots at the API level, before data reaches your dashboard. We don't store IPs. To filter bots we check the IP in flight against a public list of automated-traffic IPs, and don't keep it. The user agent is checked too:
```javascript
// API-side bot detection
const botSignatures = [
  'googlebot', 'bingbot', 'slurp', 'duckduckgo',
  'baiduspider', 'yandexbot', 'facebookexternalhit'
];

if (userAgent.some(sig => userAgent.includes(sig))) {
  // Mark as bot, filter from analytics
  isBot = true;
}

// Only non-bot traffic appears in dashboard
```

Unlike Google Analytics (which sometimes misses bot traffic), Sealmetrics filters at source.

### What if JavaScript is disabled on visitor's browser?

Then that visit isn't measured. Sealmetrics counts visits through its JavaScript tracker (plus Shopify order webhooks for orders); there is no server-side capture of pageviews, so a browser with JavaScript disabled — or an ad blocker that stops the tracker — hides that visit. Unlike consent loss, this doesn't depend on a banner.

### How does Sealmetrics handle GDPR data subject requests?

Sealmetrics stores no IPs and no persistent IDs, and the session identifier cannot be reconstructed after the daily rotation. In practice, a data subject request cannot be matched to a person (GDPR Article 11):

- **Right of Access**: there is no stored record that can be linked to the requester
- **Right to Deletion**: the per-hit log is purged after one day; reports are aggregated
- **Right to Portability**: no individual record can be matched to the requester to export

**Competitors' situation** (hashing IPs): Gray area. Regulators argue hashed IPs + user agent + time = can be re-identified, so DPA required.

### Can I integrate Sealmetrics with my CDP or marketing tools?

Yes, Sealmetrics provides an **open API**:
```javascript
// Sealmetrics API
GET /api/v1/analytics/{siteId}/sessions
GET /api/v1/analytics/{siteId}/events
GET /api/v1/analytics/{siteId}/conversions

// Parameters:
// - dateRange
// - segmentation
// - custom events
// - attribution

// Returns: JSON data
// Use with webhooks, custom integrations
```

Unlike Google Analytics (which restricts API), Sealmetrics data is yours.

### How accurate is Sealmetrics compared to Google Analytics?

**More accurate, actually:**

| Metric | GA4 | Sealmetrics |
|--------|-----|------------|
| Captured data | Only visitors who consent | No consent-driven loss |
| Accuracy of captured data | 97% | 97% |
| **Overall coverage** | **Only visitors who consent** | **No consent gap** |

Sealmetrics might show 100,000 sessions/month where GA4 shows 45,000 for the same period. Sealmetrics is more accurate because it also measures the traffic GA4 loses to the cookie banner — and because the 55,000 GA4 missed were not a random sample.

### What about cross-domain tracking?

Sealmetrics handles cross-domain tracking **without cookies**:
```javascript
// Verify two domains belong to same business
// via verified ownership in Sealmetrics dashboard

// Then sessions automatically shared:
// User visits: mysite.com → shared-session-id-1
// User clicks to: shop.mysite.com → same-session-id-1
// All tracked as one session across domains
```

**Unlike GA**: No need for complex _ga cookies across domain boundaries.

### How does Sealmetrics GDPR compliance work technically?

**Architecture ensures GDPR compliance:**
```
Session ID (re-keyed daily) → Pseudonymised, for one day
├─ Can't identify individual
├─ Unrecoverable after the daily rotation
└─ Legitimate interest, Art. 6(1)(f)

No IP storage → IP never stored
├─ Can't geolocation
├─ Can't identify
└─ No DPA required

No email/device ID → Nothing that identifies anyone
├─ No behavioral profile
├─ No individual tracking
└─ No consent needed

Result: minimal pseudonymised data, unrecoverable daily; reports aggregated
```

**Competitors (GA + hashing)**:
```
Hashed IP + user agent + timestamp + location
├─ Possible re-identification? YES (regulators argue)
└─ Requires: Consent + DPA + DPIA (safer)
```

Sealmetrics removes this regulatory risk entirely.

---

## Conclusion: Why Cookieless Analytics Matters

Learn more about [how cookieless analytics works](/blog/cookieless-analytics-guide) in our complete implementation guide.

**The Problem** (Today):
- Google Analytics loses the visitors who reject or ignore the cookie banner, and not at random
- Cookie banners interrupt every first visit
- GDPR fines for non-compliance (up to 4% of global revenue)
- You're making decisions on a self-selected sample

**The Solution** (Sealmetrics):
- Cookieless tracking measures **all the traffic you lose today to the cookie banner**
- No consent banner needed for its own analytics (self-assessed; no user frustration)
- Zero IP storage, so no hashed-IP gray area
- Better insights based on your whole audience

**What You Get With Sealmetrics**:
- Real pageview counts, not the visitors who accept the banner
- Accurate bounce rates and session metrics, measured in aggregate
- A legal position that rests on architecture, not on a balancing test
- Same insights, without a consent record to defend

**Implementation Takes 1 Minute**:
1. Copy tracking snippet
2. Paste in website `<head>`
3. Wait 1-2 minutes
4. See all of your traffic in the dashboard

No more consent-driven data loss. No more consent banners. No more regulatory uncertainty.

That's how cookieless analytics works—and why Sealmetrics leads the market in technical implementation.

---

## Additional Resources

- [GDPR and ePrivacy Explained](/legal/gdpr-and-eprivacy) - Why we assess no consent banner is required
- [Sealmetrics vs Google Analytics: Complete Comparison](/blog/google-analytics-vs-sealmetrics) - Feature breakdown
- [GDPR Compliant Analytics Framework](/blog/gdpr-compliant-analytics-framework) - Full compliance guide
- [Cookie Banner Ghosting & Data Loss](/blog/cookie-banner-ghosting-data-loss) - Why cookieless matters
- [Cookieless Analytics Guide](/blog/cookieless-analytics-guide) - Complete implementation guide
