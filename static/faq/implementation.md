---
title: "Implementation & Tracking"
description: "How to install the Sealmetrics pixel in the head or via Google Tag Manager, add event pixels for conversions and micro-conversions, and verify tracking in Real-Time."
canonical_url: "https://docs.sealmetrics.com/faq/implementation"
lang: "en"
date_generated: "2026-09-23T06:38:54.626Z"
source_hash: "4f887d553ffd273cc42d079d22be85dccd0202178482517c8faa4c603711f811"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "faq/implementation.mdx"
publisher: "Sealmetrics"
---

# Implementation & Tracking

Canonical page: https://docs.sealmetrics.com/faq/implementation

Installing Sealmetrics takes one tracking pixel in the `<head>` of your site or a Google Tag Manager tag, after which measurement starts immediately; conversions and micro-conversions are event pixels you add where the action happens, and the Real-Time Report shows events within 10 seconds.

## How do I install Sealmetrics?

Insert your tracking pixel in the `<head>` of your website or via Google Tag Manager.
Once added, Sealmetrics begins measuring immediately.

---

## Does Sealmetrics work with Google Tag Manager?

Yes.
Just ensure the Sealmetrics tag is not blocked by [Consent Mode](https://developers.google.com/tag-platform/security/guides/consent) or cookie banners.

---

## Can I track conversions and micro-conversions?

Yes.
Add event pixels anywhere in your site:

- Add to cart
- Checkout
- Form submits
- Leads
- Purchases (with revenue variable)

---

## How do I verify tracking?

Use the Real-Time Report.
Events appear within 10 seconds.

---

**Note:**
- Install the tracking pixel in the `<head>` or via Google Tag Manager; measurement begins immediately, as long as the tag is not gated behind Consent Mode or a cookie banner.
- Conversions and micro-conversions (add to cart, checkout, form submits, leads, purchases with revenue) are event pixels placed anywhere on the site.
- Verify tracking in the Real-Time Report — events appear within 10 seconds.
