---
title: "What Is omtrdc.net? Adobe's Collection Domain, Explained"
description: "omtrdc.net is where Adobe Analytics sends every hit. What the requests are, when they fire, why an image GET loses data, and how to check your own site."
canonical_url: "https://docs.sealmetrics.com/security-privacy/omtrdc-net-requests"
lang: "en"
date_generated: "2026-08-09T18:09:39.170Z"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "security-privacy/omtrdc-net-requests.mdx"
publisher: "SealMetrics"
---

# What Is omtrdc.net? Adobe's Collection Domain, Explained

Canonical page: https://docs.sealmetrics.com/security-privacy/omtrdc-net-requests

`omtrdc.net` turns up in network logs, cookie audits and CSP reports on any site running
Adobe Analytics. It is **Adobe** — the name is a contraction of *Omniture Track Domain*,
from the company Adobe acquired in 2009.

Unlike [`demdex.net`](/security-privacy/demdex-net-cookies), which handles identity,
`omtrdc.net` is the **collection endpoint**. Every pageview, event and conversion Adobe
records leaves the browser as a request to this domain. If a request to `omtrdc.net` does not
happen, that visit does not exist in Adobe Analytics.

That makes it the most useful domain on the list to understand, because it is where data is
won or lost.

---

## 1. The hostnames you will see

| Hostname | Role |
|---|---|
| `sc.omtrdc.net` | Primary collection endpoint |
| `d1.sc.omtrdc.net` | Regional collection endpoint |
| `<namespace>.sc.omtrdc.net` | Tenant-specific collection host |

The `<namespace>` portion is your Adobe report suite's tracking namespace, so the exact
hostname differs per account. All of them serve the same function.

For context, a standard Adobe Analytics install contacts **four** external domains:

| Domain | Role |
|---|---|
| `assets.adobedtm.com` | Adobe Launch tag manager (Akamai CDN) |
| `dpm.demdex.net` | Experience Cloud ID sync |
| `sc.omtrdc.net` | Analytics collection |
| `d1.sc.omtrdc.net` | Analytics collection |

---

## 2. What the request actually is

The hit to `omtrdc.net` is an **image GET** — historically a 1×1 pixel request with the
measurement payload encoded in the URL.

This matters more than it sounds. An image GET is a normal browser resource request, which
means it is **cancelled if the visitor leaves the page before it completes**. A visit that
bounces, or a user who taps back quickly, can produce no hit at all.

The modern alternative is `navigator.sendBeacon()`, which hands the payload to the browser
and survives page unload by design. SealMetrics uses `sendBeacon`; Adobe's AppMeasurement
uses the image GET.

---

## 3. When the hit fires

We measured this on a real European media site running both vendors side by side:

| Time | Event |
|---|---|
| ~1.5–1.6 s | SealMetrics `t.js` loads (late — through the site's own tag chain) |
| **~1.8 s** | SealMetrics pageview dispatched via `sendBeacon` — secured |
| **~3.0 s** | Adobe Analytics pageview fires — image GET to the collection domain |

Installed directly in the `<head>` rather than through a tag chain, the SealMetrics hit is
secured at ~0.1–0.3 s.

**In fairness to Adobe:** part of that 3.0 seconds is this specific site's rule sequencing —
identity and personalization calls are ordered before the analytics hit. That ordering is
common, because ECID and Target are designed to run early, but a leaner Adobe install will
fire sooner. The structural floor is what remains: roughly 730 KB of JavaScript to parse and
a multi-stage chain to walk before any hit can leave the device.

Over a 30-day dual-tag run on that reference site, the gap came to **+25% pageviews** measured
by SealMetrics over Adobe — with Adobe firing without a consent gate at all.

Full methodology: [Adobe Analytics tracker performance](/guides/tracker-performance-adobe-analytics).

---

## 4. The cookie question

The visitor identifier associated with collection is `s_vi`, with `s_fid` as the fallback when
`s_vi` cannot be set.

Whether these appear as first-party or third-party cookies depends on your implementation:

- **Default setup** — the collection server sets the identifier on the Adobe domain, making
  it a third-party cookie, which Safari and Firefox block by default.
- **CNAME / first-party implementation** — collection is routed through a subdomain of your
  own site, so the cookie is first-party and survives browser restrictions.

If you are filling in a cookie register, this is the distinction to check before you classify
the entry, because both configurations are common and the audit answer differs.

The identity cookies on `.demdex.net` are covered separately in
[demdex.net cookies](/security-privacy/demdex-net-cookies).

---

## 5. Why requests to omtrdc.net go missing

Three independent causes, all of which reduce what Adobe records:

1. **Privacy filter lists.** `omtrdc.net` appears on the common blocklists used by uBlock
   Origin, Brave and Firefox Enhanced Tracking Protection. The request never leaves.
2. **The transport.** An image GET cancelled on unload, as described in section 2.
3. **Consent.** Where the hit is gated behind a banner, rejection means no request at all.
   In European eCommerce, banner rejection runs 40–60%.

These compound. A visitor can be lost to any one of them, and the three populations do not
overlap neatly.

---

## 6. How to check your own site

1. Open your site in a private window with DevTools on the **Network** tab.
2. Filter for `omtrdc`.
3. Reload and note the **timestamp** of the first request — that is when your measurement
   actually starts. Everything before it is unmeasured.
4. Check the request **type**. If it is `img`, unload cancellation applies to you.
5. Now enable an ad blocker and reload. If the request disappears entirely, every visitor
   using that blocker is invisible in Adobe.
6. Finally, reload with the consent banner **rejected**. If a request still fires, that is a
   compliance finding rather than a data one.

Steps 3 and 5 are the ones worth writing down. Step 3 tells you how much of the visit you
never see; step 5 tells you how many visitors you never see at all.

---

## 7. Related documentation

- [Third-party domain lookup](/security-privacy/third-party-analytics-domains) — the full table of external domains analytics tools contact, and which tool owns each
- [demdex.net cookies](/security-privacy/demdex-net-cookies) — the identity side of the same stack
- [Adobe Analytics tracker performance](/guides/tracker-performance-adobe-analytics) — full methodology behind the timings above
- [Adblocker Bypass](/security-privacy/adblocker-bypass) — why filter lists block collection endpoints and what it costs
- [Consentless Analytics](/security-privacy/consentless-analytics) — collecting without a banner, so rejection is not a data-loss path
- [Bot Detection](/security-privacy/bot-detection) — separating real visitors from automated traffic
