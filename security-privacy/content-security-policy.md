---
title: "Content Security Policy (CSP) for the Sealmetrics tracker"
description: "How to allow the Sealmetrics tracker in a Content Security Policy: script-src and connect-src for t.sealmetrics.com, inline snippets with a nonce, first-party hosts, and what a CSP does and does not protect."
canonical_url: "https://docs.sealmetrics.com/security-privacy/content-security-policy"
lang: "en"
date_generated: "2026-11-19T16:06:40.231Z"
source_hash: "9172326ab1993ce53f692ba6723cd4c665592c1b2e762de91c7f11498a4a3731"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "security-privacy/content-security-policy.mdx"
publisher: "Sealmetrics"
---

# Content Security Policy (CSP) for the Sealmetrics tracker

Canonical page: https://docs.sealmetrics.com/security-privacy/content-security-policy

A [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) tells the browser which hosts your pages may load scripts from and send data to. If your site uses one, this page lists exactly what Sealmetrics needs. Nothing else has to be allowed.

If the tracker is already being blocked and you are looking for the console errors, see [Tracker blocked by CSP](/troubleshooting/csp-errors-domains-to-allow).

## Minimum policy {#minimum-policy}

The tracker needs two directives, both pointing to the host that serves `t.js`:

```http
Content-Security-Policy: script-src 'self' https://t.sealmetrics.com; connect-src 'self' https://t.sealmetrics.com
```

| Directive | Why Sealmetrics needs it |
|---|---|
| `script-src https://t.sealmetrics.com` | Loads the tracker (`/t.js`) and, on Shopify, the loader (`/shopify-loader.js`). |
| `connect-src https://t.sealmetrics.com` | Sends pageviews, conversions and microconversions to `/event` with `sendBeacon` or `fetch` (and, when Agent Analytics is enabled, signals to `/agent-signals` on the same host). |

The tracker sets no cookies, opens no iframes, and loads no images, fonts or other scripts, so no other directive needs a Sealmetrics entry.

If you already have a policy, add the Sealmetrics host to your existing `script-src` and `connect-src` lists. Do not send a second `Content-Security-Policy` header: the browser enforces both, and a script must pass both to run.

## Use the host you load the tracker from {#which-host}

Allow the host that appears in your snippet's `src`. Events are always sent to the same host that served `t.js`, so `script-src` and `connect-src` take the same host.

- **Standard install**: `https://t.sealmetrics.com`.
- **[First-party tracker](/implementation/tracker/first-party) on your own subdomain** (for example `metrics.yourstore.com`): allow that subdomain. `'self'` only matches the exact origin of the page, so a subdomain must be listed explicitly.
- **CMS plugin with the first-party proxy** (WordPress, WooCommerce, PrestaShop, Magento 2, OpenCart, Joomla and Drupal): `t.js` and the events go through a path on your own site, so `'self'` covers them. Keep `https://t.sealmetrics.com` in both directives anyway: if the proxy cannot be reached, the plugin falls back to loading the tracker directly from it.

## Inline snippets need a nonce or hash {#inline-snippets}

If your policy does not allow `'unsafe-inline'`, any inline `` tag with no inline code, needs no nonce.

## Google Tag Manager {#google-tag-manager}

If you load Sealmetrics through GTM, your policy must allow GTM itself, following [Google's CSP guide for Tag Manager](https://developers.google.com/tag-platform/security/guides/csp), in addition to the Sealmetrics host above. Custom HTML tags injected by GTM are inline scripts, so they need GTM's nonce-aware setup.

## Shopify {#shopify}

- **Public app (theme app embed)**: the loader and the tracker come from `https://t.sealmetrics.com`. Allow it in `script-src` and `connect-src` if your theme sets a CSP. Most Shopify themes do not set one. The same applies to custom-app stores connected before October 2026, which load the same loader through a ScriptTag.
- **Custom app (Web Pixel)**: Shopify runs the pixel in its own sandbox, so your storefront CSP does not govern it.

See [Shopify](/integrations/ecommerce/shopify) for which install your store uses.

## Why there is no Subresource Integrity (SRI) hash {#no-sri}

SRI (`integrity="sha384-…"`) only works for a file that is byte-identical on every request. Each `t.js` response embeds a short-lived signed token that protects your data from spam and fake events. A new token is generated for each request, so the file's hash changes and an `integrity` attribute would block it.

The integrity of the tracker is protected on our side instead:

- `t.js` is compiled into our server software. Per site, only your account ID, the token and your snippet options are filled in. There is no per-site custom JavaScript stored anywhere, so a compromised dashboard account cannot change the code served on your site.
- The minified tracker is built from its readable source in our repository, and our CI fails if the code the server ships differs from a fresh build of that source by a single byte. The served code cannot be changed without changing the source.

## What a CSP does and does not protect {#limits}

A CSP is defence in depth, and it is worth having:

- **It does** stop other scripts on your pages, including a compromised third-party tag, from loading code or sending data to hosts you did not list.
- **It does** make our privacy promise verifiable: the browser itself enforces that Sealmetrics can only send data to the host you allowed.
- **It does not** protect against a compromised `t.js`, because the policy allows that file. That risk is covered by the controls described [above](#no-sri).

## Check your policy {#check}

1. Open your site with the browser developer tools (Console tab).
2. Look for `Refused to load the script` or `Refused to connect` messages that mention the Sealmetrics host.
3. In the Network tab, filter by `event` and check that requests to `/event` return `204`.

To test a policy without breaking anything, send it first as `Content-Security-Policy-Report-Only`. The browser reports violations but blocks nothing.

## Related

- [Tracker blocked by CSP](/troubleshooting/csp-errors-domains-to-allow) — symptoms and fixes when the policy is already blocking the tracker
- [First-Party Tracker](/implementation/tracker/first-party) — serving the tracker from your own subdomain
- [How Sealmetrics Reduces AdBlocker Data Loss](/security-privacy/adblocker-bypass) — why first-party delivery matters
