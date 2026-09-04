---
title: "Why Sealmetrics Is Not Blocked by AdBlockers"
description: "Learn why Sealmetrics bypasses AdBlockers through 1st-party tracking and a privacy-first architecture that avoids third-party domain blocking."
canonical_url: "https://docs.sealmetrics.com/security-privacy/adblocker-bypass"
lang: "en"
date_generated: "2026-09-04T00:07:24.876Z"
source_hash: "9d7ec0f1d67f1db1af0335860a8ddc458629b378eacae88a4c547ae814d6a1b4"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "security-privacy/adblocker-bypass.mdx"
publisher: "Sealmetrics"
---

# Why Sealmetrics Is Not Blocked by AdBlockers

Canonical page: https://docs.sealmetrics.com/security-privacy/adblocker-bypass

## How Sealmetrics Bypasses AdBlockers

Most analytics platforms rely on **third-party tracking domains**, which are automatically flagged and blocked by AdBlockers. Sealmetrics avoids this completely by using a **1st-party tracking architecture** that is treated as part of your own website.

---

## How do AdBlockers work? {#how-adblockers-work}

AdBlockers typically block requests to well-known tracking domains such as:

- `google-analytics.com`
- `facebook.net`
- `doubleclick.net`

When a pixel or script loads from a recognized third-party tracker, the AdBlocker intercepts and blocks it automatically.

This is one of the reasons traditional analytics lose data — alongside consent rejection, which costs them 15–60% depending on sector, brand strength and traffic mix.

---

## Why Sealmetrics Is Not Blocked
### Sealmetrics Uses 1st-Party Tracking

Instead of loading the pixel from a third-party domain, Sealmetrics works through **your own domain**, for example:

```
https://analytics.yourdomain.com/t.js
```

Because the request is served from a subdomain of your own site, AdBlockers treat it as a first-party asset and do **not** block it. No uBlock, AdBlock Plus, Brave Shields, or Safari ITP heuristic flags this traffic as third-party tracking.

---

## Why does first-party tracking matter?

- **No data loss** from ad-blocking users (typically 25–40% of tech-literate audiences).
- **Accurate attribution** — cookieless, server-side attribution works without cookies or third-party domains.
- **GDPR-safe** — first-party collection of non-personal data requires no consent banner.
- **Resilient** — [Safari ITP](https://webkit.org/blog/7675/intelligent-tracking-prevention/), [Firefox ETP](https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop) and Chrome's [Privacy Sandbox](https://privacysandbox.com/) target cross-site tracking, not first-party requests, so first-party delivery is not what those mechanisms are built to block.

---

## How do I configure 1st-party tracking? {#how-to-configure-1st-party-tracking}

See the [Tracker Installation guide](/implementation/tracker/installation) and the [CNAME setup](/implementation/tracking-methods) to point a subdomain of your own site at the Sealmetrics pixel.

Once configured, Sealmetrics captures 100% of your traffic — including users behind AdBlockers, VPNs, and aggressive privacy extensions.

**Note:**
- AdBlockers block requests to known third-party tracking domains (google-analytics.com, facebook.net, doubleclick.net); a Sealmetrics pixel served from a subdomain of your own site is treated as a first-party asset.
- Ad-blocking users are typically 25–40% of tech-literate audiences, on top of the 15–60% that consent rejection costs traditional analytics.
- Set up 1st-party tracking by pointing a CNAME subdomain at the Sealmetrics pixel — see the Tracker Installation guide.

## Related documentation

- [1st Party Tracker](/implementation/tracker/first-party) — the first-party architecture that avoids ad-blocker filters
- [First Party Tracker](/implementation/tracker/first-party) — configure the first-party subdomain
- [Installation](/implementation/tracker/installation) — install and point a subdomain at the pixel
- [Bot Detection & Traffic Quality](/security-privacy/bot-detection) — how captured traffic is kept clean of bots
- [Frequently Asked Questions](/faq/privacy-security) — common privacy and tracking questions
