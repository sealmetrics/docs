---
title: "Installation"
description: "Install the Sealmetrics tracker with one script tag: basic setup, content grouping via the group parameter, custom endpoints, and parameter reference."
canonical_url: "https://docs.sealmetrics.com/implementation/tracker/installation"
lang: "en"
date_generated: "2026-08-12T08:27:36.924Z"
source_hash: "b57d9bd8911cd67f2e60f9777f37c1974a4a4c5ca58be7b052d566817b7ba7f4"
content_type: "implementation"
owner: "engineering"
llm_priority: "critical"
source_file: "implementation/tracker/installation.mdx"
publisher: "SealMetrics"
---

# Installation

Canonical page: https://docs.sealmetrics.com/implementation/tracker/installation

Installing the Sealmetrics tracker adds cookieless, consentless analytics to your site — it fires the initial pageview automatically and exposes the `sealmetrics` object for tracking conversions and microconversions. The method is a single `<script>` tag with your Site ID, placed in your page's `<head>`.

## Basic Installation

Add this script tag to your HTML, preferably in `<head>`:

```html
<script src="https://t.sealmetrics.com/t.js?id=YOUR_SITE_ID" defer></script>
```

Replace `YOUR_SITE_ID` with your Sealmetrics Site ID (found in Settings → Sites → [your site]).

The `defer` attribute ensures the script loads asynchronously without blocking page rendering.

## With Content Grouping

Content grouping categorizes pages into sections for analysis (e.g., "blog", "product", "checkout").

Add the `group` parameter:

```html
<!-- Blog pages -->
<script src="https://t.sealmetrics.com/t.js?id=YOUR_SITE_ID&group=blog" defer></script>

<!-- Product pages -->
<script src="https://t.sealmetrics.com/t.js?id=YOUR_SITE_ID&group=product" defer></script>

<!-- Documentation pages -->
<script src="https://t.sealmetrics.com/t.js?id=YOUR_SITE_ID&group=docs" defer></script>

<!-- Checkout flow -->
<script src="https://t.sealmetrics.com/t.js?id=YOUR_SITE_ID&group=checkout" defer></script>
```

Content grouping enables reports like:
- Conversions by content group
- Bounce rate per section
- Traffic distribution across page types

## Custom Endpoint

For self-hosted deployments or custom domains:

```html
<script src="https://your-pixel-domain.com/t.js?id=YOUR_SITE_ID" defer></script>
```

## Parameters Reference

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `id` | Yes | Your Sealmetrics Site ID | `id=67a1d6c0bb10b861397fdd3a` |
| `group` | No | Content grouping for this page. Must match `^[a-zA-Z0-9_-]{0,64}$`; an invalid value makes `/t.js` return HTTP 400 | `group=blog` |
| `auto` | No | Set `auto=0` to suppress the automatic initial pageview (manual mode). Any other value keeps it on | `auto=0` |
| `spa` | No | Set `spa=0` to suppress automatic pageview on SPA navigation (pushState/replaceState/popstate). SPA listeners stay wired and URL state still updates. Independent from `auto`. | `spa=0` |

### Manual Pageview Mode (`auto=0`)

By default the tracker fires the initial pageview as soon as it loads. Add `auto=0` to keep everything wired up (SPA listeners, `conv()`, `micro()`) while firing the pageview yourself — useful when you need to set a content group after your dataLayer is ready:

```html
<script src="https://t.sealmetrics.com/t.js?id=YOUR_SITE_ID&auto=0" defer></script>
<script>
  window.addEventListener('load', function () {
    sealmetrics({ group: 'checkout' });
  });
</script>
```

### Deferred Loading / GTM (pre-load queue)

If a `sealmetrics(...)` call may run **before** the library finishes loading (e.g., Google Tag Manager), inject this fbq-style stub **before** the script tag. It buffers calls in `sealmetrics.q` and replays them once the library boots:

```html
<script>
!function(w){w.sealmetrics=w.sealmetrics||function(){(w.sealmetrics.q=w.sealmetrics.q||[]).push(['pv',arguments])};w.sealmetrics.q=w.sealmetrics.q||[];w.sealmetrics.conv=w.sealmetrics.conv||function(){w.sealmetrics.q.push(['cv',arguments])};w.sealmetrics.micro=w.sealmetrics.micro||function(){w.sealmetrics.q.push(['mc',arguments])}}(window);
</script>
```

When using the stub to enqueue a pageview, load the tracker with `auto=0` so the queued pageview and the automatic one do not both fire. See the [API Reference](/implementation/tracker/api-reference#pre-load-queue-stub) for details.

## What Happens After Installation

1. The script loads asynchronously (does not block rendering)
2. A session ID is generated automatically without cookies
3. An anti-spam token is validated (embedded in the script, valid for 24 hours)
4. The initial pageview is tracked automatically
5. SPA navigation is detected automatically (History API)

## Verifying Installation

### Option 1: Pixel Status in the dashboard

The **Pixel Status** section on the **Pixels** page shows the install status for each site:

- **Active** — the pixel is receiving data
- **Inactive** — no hits received recently
- **Not installed** — no hits received yet

### Option 2: Browser Console

Open DevTools (F12) and type:

```javascript
typeof sealmetrics === 'function'
// Should return: true
```

### Option 3: Network Tab

1. Open DevTools > Network
2. Filter by "event"
3. Reload the page
4. Look for a POST request to `/event` with status 204

### Option 4: Inspect Tracker State

In the console you can read the tracker's own state to confirm it initialized correctly:

```javascript
sealmetrics.sessionId; // current session ID
sealmetrics.accountId; // your site ID
sealmetrics.autoMode;  // "1" (auto-pageview) or "0" (manual mode)
```

## Platform-Specific Guides

The script tag above is all you need on any platform that lets you edit the `<head>`. If your site runs on a CMS, store platform, site builder or framework, follow the dedicated guide instead — each one covers where exactly to paste the snippet plus the platform's own conversion hooks:

- [WordPress](/integrations/cms/wordpress)
- [WooCommerce](/integrations/ecommerce/woocommerce)
- [Shopify](/integrations/ecommerce/shopify)
- [Wix](/integrations/website-builders/wix)
- [Squarespace](/integrations/website-builders/squarespace)
- [Webflow](/integrations/website-builders/webflow)
- [Next.js](/integrations/frameworks/nextjs)
- [Nuxt 3](/integrations/frameworks/nuxt)
- [React](/integrations/frameworks/react)
- [Google Tag Manager](/integrations/google-tag-manager)

See [all integrations](/integrations) for the full list (Drupal, Joomla, Magento, PrestaShop, BigCommerce, OpenCart and more).

## Generating Event Snippets

Once the tracker is installed, the **Pixel Builder** on the Pixels page generates ready-to-copy `conv()` / `micro()` snippets for JavaScript, GTM or Tealium — see the [Pixel Builder guide](/platform/settings/tracking/pixel-builder). To write the calls yourself, see [Conversions](/implementation/tracker/conversions) and [Microconversions](/implementation/tracker/microconversions).

## Troubleshooting

### Script not loading

1. Check that `YOUR_SITE_ID` is replaced with your actual Site ID
2. Verify the site is active in Sealmetrics dashboard
3. Check browser console for errors

### Events not appearing in dashboard

1. Check the **Last hit** timestamp at the top right of the **Overview** report — hits arrive in seconds, so it should move to "seconds ago" right after a test visit. If it does, the hit arrived and the problem is on the report side (date range, timezone, filters). If it doesn't, nothing is being ingested — see [Data Delay](/troubleshooting/data-delay)
2. Verify the domain is registered in Settings → Sites → [your site] → Domains
3. Check if adblockers are blocking requests (unlikely with first-party setup)

### 204 response but no data

The server returns 204 for all requests (valid or rejected) to prevent information leakage. Check:
1. Site ID is correct
2. Domain is authorized for this site
3. Token is valid (script was loaded less than 24 hours ago)

---

*Need help with installation? Contact us at support@sealmetrics.com or [start your free trial](https://my.sealmetrics.com/register).*
