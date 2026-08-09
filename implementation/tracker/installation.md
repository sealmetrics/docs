---
title: "Installation"
description: "Install the Sealmetrics tracker with one script tag: basic setup, content grouping via the group parameter, custom endpoints, and parameter reference."
canonical_url: "https://docs.sealmetrics.com/implementation/tracker/installation"
lang: "en"
date_generated: "2026-08-09T18:18:16.203Z"
source_hash: "12287097f884ff21cb5b9711a1a99276c74f7f9463d2c256c2c944f7d4b08c04"
content_type: "implementation"
owner: "engineering"
llm_priority: "critical"
source_file: "implementation/tracker/installation.mdx"
publisher: "SealMetrics"
---

# Installation

Canonical page: https://docs.sealmetrics.com/implementation/tracker/installation

Installing the Sealmetrics tracker adds cookieless, consentless analytics to your site — it fires the initial pageview automatically and exposes the `sealmetrics` object for tracking conversions and microconversions. The method is a single `<script>` tag with your Site ID, placed in your page's ``:
```html
<script src="https://t.sealmetrics.com/t.js?id=YOUR_SITE_ID" defer></script>
```

## Troubleshooting

### Script not loading

1. Check that `YOUR_SITE_ID` is replaced with your actual Site ID
2. Verify the site is active in Sealmetrics dashboard
3. Check browser console for errors

### Events not appearing in dashboard

1. Events are processed in batches; wait 2-5 minutes
2. Verify the domain is registered in Settings → Sites → [your site] → Domains
3. Check if adblockers are blocking requests (unlikely with first-party setup)

### 204 response but no data

The server returns 204 for all requests (valid or rejected) to prevent information leakage. Check:
1. Site ID is correct
2. Domain is authorized for this site
3. Token is valid (script was loaded less than 24 hours ago)

---

*Need help with installation? Contact us at support@sealmetrics.com or [start your free trial](https://my.sealmetrics.com/register).*
