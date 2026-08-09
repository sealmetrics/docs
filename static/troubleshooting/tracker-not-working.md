---
title: "Tracker or Pixel Not Working: No Data Appearing"
description: "What to check when the Sealmetrics tracker or pixel is not working and no data appears in your dashboard: a 60-second check plus a symptom-by-symptom triage to the right fix."
canonical_url: "https://docs.sealmetrics.com/troubleshooting/tracker-not-working"
lang: "en"
date_generated: "2026-08-09T18:18:16.203Z"
source_hash: "a3c3fcb578793aaa64ffce3de8c0eef1fae1d35fd1a59b8037eeb8cc98c70532"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "troubleshooting/tracker-not-working.mdx"
publisher: "SealMetrics"
---

# Tracker or Pixel Not Working: No Data Appearing

Canonical page: https://docs.sealmetrics.com/troubleshooting/tracker-not-working

If the tracker (pixel) seems to be not working — no data showing in your dashboard, no visits recorded, or tracking that suddenly stopped — the cause is almost always one of six things: the script isn't loading, consent tooling is blocking it, the domain isn't authorized, the Site ID is wrong, your own traffic is being filtered, or you're simply looking at the wrong date range. This page gets you to the right fix in a couple of minutes.

---

## The 60-second check

Do these two checks first — together they tell you which half of the problem you have.

**1. Is the pixel firing on your site?**

1. Open your website in a browser
2. Open Developer Tools (F12) → **Network** tab
3. Filter by `sealmetrics`
4. Reload the page

You should see the `t.js` script load (200 OK) and a beacon request to `t.sealmetrics.com` (204 No Content).

**2. Is Sealmetrics receiving anything?**

1. Open the **Overview** report at [my.sealmetrics.com](https://my.sealmetrics.com)
2. Check the **Last hit** timestamp at the top right — it updates within seconds of a tracked visit

| Pixel fires | Last hit updates | Meaning |
|---|---|---|
| ❌ No | ❌ No | The script never loads → [script not loading](#the-script-is-not-loading-at-all) |
| ✅ Yes | ❌ No | The hit is sent but rejected → [hits rejected](#the-pixel-fires-but-no-data-reaches-the-dashboard) |
| ✅ Yes | ✅ Yes | Data arrives; the report view is the issue → [data exists but you can't see it](#data-arrives-but-you-dont-see-it-in-reports) |

---

## The script is not loading at all

No `t.js` request appears in the Network tab. Most common causes, in order:

1. **The snippet isn't on the page (or not on all pages).** View the page source and search for `sealmetrics`. If it's missing, revisit the [installation guide](/implementation/tracker/installation) or your platform's integration ([WordPress](/integrations/cms/wordpress), [Shopify](/integrations/ecommerce/shopify), [GTM](/integrations/google-tag-manager)).
2. **GTM Consent Mode is holding the tag back.** If you load the tracker via Google Tag Manager and a consent banner went live recently, the tag is probably waiting for consent it doesn't need. See [GTM Consent Mode blocking the tag](/troubleshooting/gtm-consent-mode-blocking).
3. **Your Content-Security-Policy blocks the script.** The console shows "Refused to load the script" errors. See [CSP errors: domains to allow](/troubleshooting/csp-errors-domains-to-allow).
4. **An ad blocker on *your* browser.** Test in a private window with extensions disabled before concluding the tracker is broken — Sealmetrics resists ad blockers, but your own aggressive blocker can still hide requests locally. For a permanent solution, use [first-party tracking](/implementation/tracker/first-party).
5. **Page errors before the snippet runs.** Check the Console tab for a `ReferenceError: sealmetrics is not defined` — see [the stub-buffer fix](/troubleshooting/sealmetrics-is-not-defined).

---

## The pixel fires but no data reaches the dashboard

The beacon request appears in the Network tab, but **Last hit** never updates. The hit is being rejected server-side:

1. **Unauthorized domain** — the most common cause. Hits from domains not listed for the site are silently dropped. Go to Settings → Sites → [your site] → Domains and check the exact hostname (including `www.` vs apex). Full guide: [Unauthorized domain](/troubleshooting/unauthorized-domain).
2. **Wrong Site ID.** The `id=` in your snippet must match the Site ID in Settings → Sites → General. See [How to find your Site ID](/platform/account-setup/find-account-id).
3. **Your IP is excluded.** If your office or VPN IP is listed under [IP exclusions](/platform/settings/tracking/ip-exclusions), your own visits will never appear — test from another network or a mobile connection.
4. **Your test visits look like a bot.** Automated visits (Selenium, Playwright, curl, headless Chrome) are filtered. See [Test traffic blocked as bot](/troubleshooting/test-traffic-blocked-as-bot).

---

## Data arrives but you don't see it in reports

**Last hit** updates, so tracking works — the issue is where you're looking:

1. **Date range and timezone.** "Today" is defined by the site's timezone, not yours. See [Dates & timezone mismatch](/troubleshooting/dates-timezone-mismatch).
2. **Brief processing delay.** Hits normally land in seconds; during traffic spikes a short queue delay is normal. Decision tree: [Data delay](/troubleshooting/data-delay).
3. **Wrong site selected.** With multiple sites in the account, confirm the site picker at the top matches the domain you're testing.

---

## Tracking worked before and suddenly stopped

When data flowed historically and then dropped to zero (or dropped sharply) on a specific date, ask what changed that day:

- **A consent banner / CMP went live** → [GTM Consent Mode blocking](/troubleshooting/gtm-consent-mode-blocking)
- **A site redesign or theme change removed the snippet** → re-check the [installation](/implementation/tracker/installation)
- **A CSP or security header was added** → [CSP errors](/troubleshooting/csp-errors-domains-to-allow)
- **The domain changed** (new domain, added `www.`, moved to a subdomain) → [Unauthorized domain](/troubleshooting/unauthorized-domain)
- **Numbers dropped but not to zero** → that's a different problem; see [Numbers lower than another tool](/troubleshooting/lower-numbers-than-other-tools)

---

## Pageviews work but conversions don't

That's its own checklist — correct `conv()` signature, numeric amount, base pixel firing first: [Conversions not appearing](/troubleshooting/conversions-not-appearing).

---

## Still stuck?

Write to **support@sealmetrics.com** and include: the page URL you tested, a screenshot of the Network tab filtered by `sealmetrics`, and your Site ID. Those three things let support reproduce the problem immediately.
