---
title: "Reports Overview"
description: "Guide to the 9 Sealmetrics reports — Overview, Evolution, Pages, Sources, Geography, Devices, Conversions, Properties, and Funnel — and shared features."
canonical_url: "https://docs.sealmetrics.com/reports"
lang: "en"
date_generated: "2026-09-21T07:18:17.820Z"
source_hash: "62927bbce2d24e4e7536489ca26a316e1898699b3e827a6bfe0c3b4725ad0a5c"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "reports/index.mdx"
publisher: "Sealmetrics"
---

# Reports Overview

Canonical page: https://docs.sealmetrics.com/reports

Sealmetrics provides 9 specialized reports to analyze your website traffic, conversions, and user behavior. The Analytics sidebar lists them in this order, plus **Lens** at the top — the AI assistant (`/sites/{site_id}/lens/chat`), which is a conversational assistant rather than a tabular report.

## Available Reports

| Report | Purpose | Key Metrics |
|--------|---------|-------------|
| [Overview](/reports/overview) | Real-time dashboard summary | Entrances, Pageviews, Conversions, Revenue |
| [Evolution](/reports/evolution) | Temporal trends analysis | Metrics over time, grouped by day/week/month |
| [Pages](/reports/pages) | Page performance analysis | Top pages, landing pages, bounce rates |
| [Sources](/reports/sources) | Traffic source breakdown | UTM analysis, referrers, campaigns |
| [Geography](/reports/geography) | Geographic distribution | Country-level metrics |
| [Devices](/reports/devices) | Device and browser analysis | Device types, browsers, operating systems |
| [Conversions](/reports/conversions) | Conversion and event tracking | Conversions, microconversions, revenue |
| [Properties](/reports/properties) | Event property analysis | Property breakdown by UTM attribution |
| [Funnel](/reports/funnel) | Conversion funnel analysis | Step progression, drop-off rates |

## E-commerce: which report answers which question

Every report page ends with an **E-commerce use cases** section built from what that report actually shows. Start from the question you have:

| Question | Report |
|---|---|
| [How much did the store sell, and is the average order growing?](/reports/conversions#how-much-did-the-store-actually-sell-and-is-the-average-order-growing) | Conversions |
| [Is revenue growing, or only traffic?](/reports/evolution#is-my-revenue-growing-or-only-my-traffic) | Evolution |
| [Is today's revenue on track?](/reports/overview#is-todays-revenue-on-track) | Overview |
| [Which channels and campaigns bring buyers, not just visits?](/reports/sources#which-campaigns-bring-buyers-not-just-visits) | Sources |
| [Is Google Shopping / Performance Max credited to the right campaign?](/reports/sources#is-my-google-shopping--performance-max-traffic-credited-to-the-right-campaign) | Sources |
| [Is my payment gateway taking credit for sales?](/reports/sources#is-my-payment-gateway-taking-credit-for-sales) | Sources |
| [Where do shoppers abandon the checkout?](/reports/funnel#where-do-shoppers-abandon-the-checkout) | Funnel |
| [Which campaigns fill carts that never reach checkout?](/reports/sources#do-my-campaigns-fill-carts-that-never-reach-checkout) | Sources |
| [Which landing pages bring in sales, and which get visits but no sales?](/reports/pages#which-landing-pages-actually-bring-in-sales) | Pages |
| [Do product pages or category pages work better as entry points?](/reports/pages#do-product-pages-or-category-pages-work-better-as-entry-points) | Pages |
| [Is my mobile checkout losing sales?](/reports/devices#is-my-mobile-checkout-losing-sales) | Devices |
| [Is one browser breaking my checkout?](/reports/devices#is-one-browser-breaking-my-checkout) | Devices |
| [Which countries buy, not just visit?](/reports/geography#which-countries-actually-buy-not-just-visit) | Geography |
| [Which campaigns sell which products or categories?](/reports/properties#which-campaigns-sell-which-product-categories) | Properties |
| [Which campaigns depend on discount codes?](/reports/properties#which-campaigns-depend-on-discount-codes) | Properties |
| [What days and hours do customers buy?](/reports/evolution#what-days-and-hours-do-my-customers-buy) | Evolution |
| [Did a promotion lift orders, or only traffic?](/reports/overview#did-the-promotion-lift-orders-or-only-traffic) | Overview |

Most of these need the standard e-commerce events: a `purchase` conversion **with the order amount**, and `view_item`, `add_to_cart` and `begin_checkout` as microconversions (product breakdowns also need the `items` array). See the [E-commerce Setup Guide](/implementation/ecommerce-conversion-tracking/ecommerce-setup-guide).

Two limits apply to every answer: Sealmetrics counts **entrances, not unique visitors**, and attribution is **last click per session** — there is no cross-session customer journey to follow.

## Accessing Reports

1. Log in to [Sealmetrics Dashboard](https://my.sealmetrics.com)
2. Select a site from the site selector (top left)
3. Click any report in the sidebar

## Common Features

All reports share these features:

### Date Range Picker

Located in the header. Options:

| Preset | Description |
|--------|-------------|
| Today | Current day |
| Yesterday | Previous day |
| 7d | Last 7 days |
| 30d | Last 30 days |
| 90d | Last 90 days |
| This Week/Month/Quarter/Year | Current period |
| Last Week/Month/Quarter/Year | Previous period |
| Custom | Select specific date range |

**Keyboard shortcuts:**
- `T` = Today
- `Y` = Yesterday
- `W` = This Week
- `M` = This Month
- `C` = Toggle comparison mode

### Comparison Mode

Compare current period with:
- **Previous Period**: Same number of days before the selected range
- **Previous Year**: Same dates in the prior year
- **Custom**: Manually select comparison range

When enabled, charts show a secondary line and tables show delta percentages where the report supports them. Not every report honours every mode: the Overview and Evolution cards always compare with the previous period, the Conversions cards show no deltas, and a **Custom** comparison range currently falls back to the previous period. Each report page says what its comparison covers.

### Global Filters

Open the **Segment** panel from the filter bar below the header. Available filters:

| Category | Filters |
|----------|---------|
| Geography | Countries (multi-select) |
| Devices | Device type, Browser, Operating System |

Filters apply across report pages and active filters appear as removable chips. One exception: in the [Properties report](/reports/properties) they change the entrance counts but not the property event counts — see that page.

### Segments

Save filter combinations for quick access:

1. Apply desired filters
2. Click **Save Segment** (or **Save current as segment** from the Segments dropdown)
3. Name the segment
4. Access saved segments from the dropdown

### Export

Every report except Overview has an **Export** button to download the table as CSV or PDF. What the export contains (loaded rows vs all rows, which columns) varies by report and is described on each report's page.

## Report Details

- [Overview](/reports/overview) - Main dashboard with key metrics
- [Evolution](/reports/evolution) - Time-based trend analysis
- [Pages](/reports/pages) - Page-level performance
- [Sources](/reports/sources) - Traffic source analysis
- [Geography](/reports/geography) - Country breakdown
- [Devices](/reports/devices) - Device and browser stats
- [Conversions](/reports/conversions) - Conversion tracking
- [Properties](/reports/properties) - Event property analysis by UTM
- [Funnel](/reports/funnel) - Funnel progression

## Additional Documentation

- [Filters](/reports/filters) - Detailed filter documentation
- [Date Range](/reports/date-range) - Date selection and comparison
- [Definitions](/reports/definitions) - Metric definitions
