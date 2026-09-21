---
title: "Devices Report"
description: "Analyze entrances, conversions and revenue by device type, browser and operating system — and find out whether mobile shoppers or a specific browser are costing your store sales."
canonical_url: "https://docs.sealmetrics.com/reports/devices"
lang: "en"
date_generated: "2026-09-21T07:18:17.820Z"
source_hash: "8b29812a06320421a522e12612b64e3c88f098755d9e56e7da71045beefddfb4"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "reports/devices.mdx"
publisher: "Sealmetrics"
---

# Devices Report

Canonical page: https://docs.sealmetrics.com/reports/devices

The Devices report breaks your traffic, conversions and revenue down by device type, browser and operating system, so you can see how visitors reach your site and whether any device or browser converts noticeably worse than the rest.

## Accessing the Report

1. Select a site from the site selector
2. Click **Devices** in the sidebar

**URL pattern:** `/sites/{site_id}/devices`

## Report Sections

Below the charts, the report stacks three tables on a single page, one per device dimension: **Device Types**, **Browsers**, and **Operating Systems**. Each table has its own **Filters** builder and **Export** button; the Browsers and Operating Systems tables also have a search box.

All three tables share the same eight columns and behave the same way:

- **Sorting:** click any column header. The default sort is **Entrances**, descending.
- **Pagination:** 10 rows per page by default (10, 50, 100 or 500 selectable).
- **Totals row:** a **Total** row sums Entrances, Pageviews, Events, Conv. and Revenue; Bounce Rate and Conv. Rate in the totals row are recalculated from the summed counts, not averaged. When a table filter or a Segment is active, the table shows two rows — **Total** (the unfiltered reference) and **Filtered** (the rows that match, with each additive column's share of the total).
- **Row limit:** the Browsers and Operating Systems tables list up to the 15 values with the most entrances in the period.

### Device Types

Shows traffic grouped by device category.

| Device Type | Description |
|-------------|-------------|
| **Desktop** | Computers and laptops — and any user agent not recognised as mobile or tablet |
| **Mobile** | Smartphones, plus most Android tablets (see [User Agent Detection](#user-agent-detection)) |
| **Tablet** | User agents that identify as an iPad or a tablet |

#### Columns

| Column | Description |
|--------|-------------|
| **Device** | Device type name |
| **Entrances** | Sessions that started on this device type |
| **Pageviews** | Total page views |
| **Bounce Rate** | Percentage of entrances with a single pageview. Shown in red above 70% and in green below 40% |
| **Events** | Microconversions — all types combined |
| **Conv.** | Conversions — all conversion types combined |
| **Revenue** | Sum of conversion amounts, in the site's currency |
| **Conv. Rate** | Conversions ÷ Entrances × 100 |

See the [Metrics Reference](/reports/definitions) for the exact definition of each metric.

### Browsers

Shows traffic grouped by browser family. Versions are not recorded — "Chrome" covers every Chrome version.

| Browser value | What it covers |
|---------------|----------------|
| Chrome | Chrome and most Chromium-based browsers (see below) |
| Safari | Safari, and every browser on iPhone and iPad |
| Firefox | Firefox on desktop and Android |
| Edge | Microsoft Edge (Chromium) on desktop and Android |
| Opera | Older Opera builds only — current Opera is counted as Chrome |
| Internet Explorer | Internet Explorer |
| Unknown | User agents that match none of the above |

#### Columns

Same columns as the Device Types table, with **Browser** as the first column.

### Operating Systems

Shows traffic grouped by operating system family. Versions are not recorded.

| OS value | Description |
|----------|-------------|
| Windows | Microsoft Windows |
| macOS | Apple macOS — also iPads browsing in Safari's default desktop mode |
| iOS | iPhone, and iPads that identify as an iPad |
| Android | Google Android |
| Linux | Linux distributions |
| Unknown | User agents that match none of the above, including Chromebooks |

#### Columns

Same columns as the Device Types table, with **Operating System** as the first column.

### Comparing with a previous period

When **Compare** is enabled in the [date range](/reports/date-range) control, **Entrances**, **Pageviews**, **Events**, **Conv.** and **Revenue** show the change against the comparison period under each value. **Bounce Rate** and **Conv. Rate** show the current value only — compare them by switching periods.

This report supports **Previous period** and **Previous year**. If you choose **Custom comparison**, the deltas are currently calculated against the previous period, not the custom range you picked.

## Charts

At the top of the report there are three charts. They reflect the active Segment and each table's filter, but not the table search boxes.

### Device Types Pie Chart

- Share of entrances by device type (Desktop, Mobile, Tablet)
- Quick visual of audience composition

### Top Browsers Bar Chart

- Horizontal bars for the top 8 browsers by entrances

### Operating Systems Bar Chart

- Bars for the top 8 operating systems by entrances

## Filtering

Two kinds of filter act on this report: the global **Segment** (applies to every report) and each table's own **Filters** builder (applies to that table only). Date range and comparison come from the header controls. There are no UTM, channel, content group or page filters on this report. To go the other way — campaigns or landing pages for one device — set a device Segment and open the [Sources](/reports/sources) or [Pages](/reports/pages) report.

### Global Device Filters

All four Segment filters apply to this report, and they are applied on the server, so they filter every table and chart at once:

| Segment filter | Options | Effect on this report |
|----------------|---------|-----------------------|
| **Countries** | Country list | All three tables show only traffic from the selected countries |
| **Device Type** | Desktop, Mobile, Tablet | All three tables show only that device's traffic — e.g. the Browsers table becomes "browsers used on mobile" |
| **Browser** | Chrome, Safari, Firefox, Edge, Opera | All three tables show only that browser's traffic |
| **Operating System** | Windows, macOS, iOS, Android, Linux | All three tables show only that OS's traffic |

To apply a Segment:

1. Click **Segment** in the filter bar
2. Pick values under **Geography** and/or **Devices**
3. Click **Apply Segment**

Values are matched exactly. Selecting several values in one filter matches any of them; different filters combine with AND. **Unknown** and **Internet Explorer** are not offered in the Segment panel — use the table filters below to isolate them in this report. See [Filters](/reports/filters) for segments, chips and persistence.

### Table Filter Builder

Each table has its own **Filters** button. Conditions take effect as you edit them — there is no Apply button — and **Clear** removes them all.

**Available fields (per table):**

| Field | Type |
|-------|------|
| Device / Browser / Operating System (the table's own dimension) | Text |
| Entrances | Number |
| Pageviews | Number |
| Bounce Rate | Percentage |
| Events | Number |
| Conversions | Number |
| Revenue | Number |
| Conv. Rate | Percentage |

**Operators:**

| Field type | Operators |
|------------|-----------|
| Text | equals, does not equal, contains, does not contain, starts with, ends with, is empty, is not empty (case-insensitive) |
| Number / Percentage | equals, does not equal, greater than, less than, greater or equal, less or equal |

Percentages are entered as plain numbers (60 means 60%). Conditions are organised in **filter groups** (**Add filter group**, then **Add condition**); conditions inside a group and the groups themselves can each be combined with **AND** or **OR**.

**Example filters:**

| Goal | Filter |
|------|--------|
| High-traffic browsers | Entrances greater than 500 |
| Converting devices | Conversions greater than 0 |
| Problem areas | Bounce Rate greater than 60 |
| Revenue-generating | Revenue greater than 100 |
| Unclassified traffic | Browser equals Unknown |

### Table Search

The Browsers and Operating Systems tables have a search box that matches the browser or OS name (case-insensitive substring). Search only narrows the rows on screen: it does not change the charts or the exported file.

## Device Performance Analysis

### Mobile vs Desktop

| Metric | Insight |
|--------|---------|
| Mobile bounce rate higher | Check mobile UX, page speed |
| Mobile conversion lower | Review mobile checkout flow |
| Mobile traffic growing | Prioritize mobile optimization |
| Desktop revenue higher | Consider device-specific offers |

### Browser Compatibility

Issues to investigate when a browser shows poor metrics:

| Symptom | Possible Cause |
|---------|----------------|
| High bounce rate | CSS/JS compatibility issues |
| Zero conversions | Checkout not working |
| Low pageviews | Navigation problems |

### OS-Specific Patterns

| Pattern | Action |
|---------|--------|
| iOS lower conversion | Test checkout and payment options in Safari on iPhone |
| Android high bounce | Test on popular Android devices |

## Use Cases

### Identifying Mobile Issues

1. Go to the **Device Types** table
2. Compare Mobile vs Desktop:
   - Bounce Rate difference
   - Conv. Rate difference
   - Revenue per entrance (Revenue ÷ Entrances)
3. If Mobile underperforms significantly:
   - Audit mobile experience
   - Check Core Web Vitals for mobile
   - Review mobile checkout flow

### Browser Compatibility Testing

1. Go to the **Browsers** table
2. Filter: Entrances greater than 100 (significant sample)
3. Sort by **Bounce Rate** (descending)
4. High bounce on a specific browser may indicate:
   - JavaScript errors
   - CSS rendering issues
   - Feature incompatibility

### OS Market Share Tracking

1. Go to the **Operating Systems** table and the **Operating Systems** chart
2. Note each OS's share of total Entrances (the **Filtered** row shows the share when you filter to one OS)
3. Compare with development testing:
   - Are you testing on the top 3 OS?
   - Any untested OS with significant traffic?

### Revenue by Device

1. Go to the **Device Types** table
2. Sort by **Revenue** (descending)
3. Calculate [revenue per entrance](/reports/definitions#revenue-per-entrance) for each
4. Prioritize optimization for highest-value devices

### Safari/iOS Performance Check

Sealmetrics does not use cookies, so Safari's Intelligent Tracking Prevention cookie limits do not reduce what it counts — a Safari gap is usually a real experience difference, not a measurement artefact.

1. Go to the **Browsers** table
2. Compare Safari's Bounce Rate and Conv. Rate with Chrome's
3. Remember that Safari includes every browser on iPhone and iPad, so this is effectively "iOS vs the rest"
4. If Safari is clearly behind, test your key pages and checkout on an iPhone

## E-commerce use cases

These cases assume your store sends a `purchase` conversion with the order amount; the funnel steps also need the `add_to_cart` and `begin_checkout` microconversions. See [E-commerce conversion tracking](/implementation/ecommerce-conversion-tracking) for the event names and platform guides.

Keep in mind that **Conv.** and **Revenue** in this report include every conversion type you track, and **Events** includes every microconversion type. If you track other conversions besides `purchase` (a newsletter signup, for example), use the [Conversions report](/reports/conversions) with a device Segment for purchase-only figures.

### Is my mobile checkout losing sales?

1. Open the **Device Types** table.
2. Compare Mobile and Desktop on **Conv. Rate**, and compare each device's share of **Entrances** (pie chart) with its share of **Revenue**.
3. If Mobile brings a large share of entrances but a clearly lower Conv. Rate and a smaller share of revenue, find the step where mobile shoppers drop out: set **Segment → Device Type → Mobile**, open the [Funnel report](/reports/funnel) and note the drop-off between Add to Cart, Begin Checkout and Purchase. Repeat with **Desktop** and compare.
4. A drop concentrated at one step on mobile only (for example Begin Checkout → Purchase) points to that step's mobile experience — payment form, address entry, payment options — rather than to your traffic.

### Which devices bring the money, not just the visits?

1. In the **Device Types** table, sort by **Revenue**.
2. Work out [revenue per entrance](/reports/definitions#revenue-per-entrance) (Revenue ÷ Entrances) and [average order value](/reports/definitions#average-order-value-aov) (Revenue ÷ Conv.) for each device — export the table as CSV if you prefer to do this in a spreadsheet.
3. A device with many entrances but low revenue per entrance is where optimisation pays most; a device with a high average order value but few conversions may deserve device-specific offers or ad bids.

### Is one browser breaking my checkout?

1. Open the **Browsers** table and add a filter: **Entrances greater than** a threshold that is meaningful for your traffic.
2. Look for rows with healthy **Events** but **Conv.** at or near 0, or a Conv. Rate far below the other browsers with similar traffic. Shoppers are adding to cart and starting checkout on that browser, but purchases are not arriving.
3. If the browser is offered in the Segment panel (Chrome, Safari, Firefox, Edge, Opera), set **Segment → Browser** to it and open the [Funnel report](/reports/funnel) to see which step collapses.
4. Reproduce the purchase on that browser. If the order goes through but no purchase shows up in Sealmetrics, the problem is in the conversion tracking rather than the checkout — see [E-commerce conversion tracking](/implementation/ecommerce-conversion-tracking).

### Did my mobile redesign actually lift sales?

1. Select a date range that starts after the release and enable **Compare → Previous period** (or **Previous year** for seasonal stores).
2. In the **Device Types** table, read the change under **Conv.** and **Revenue** for the Mobile row, and check that **Entrances** did not simply grow.
3. Conv. Rate has no delta indicator: note it for both periods by switching the date range. For a week-by-week view by device, set a Device Type Segment and use the [Evolution report](/reports/evolution).
4. Mobile conversions and revenue up while Desktop stays flat supports the redesign; both moving together points to seasonality or a campaign instead.

### Do iPhone and Android shoppers behave differently?

1. Open the **Operating Systems** table and compare **iOS** and **Android** on Conv. Rate, Revenue and revenue per entrance.
2. A large gap on similar traffic is worth a device test of your payment options and checkout on the weaker platform.
3. To see which traffic sources feed each platform, set **Segment → Operating System** to iOS or Android and open the [Sources report](/reports/sources).

## Technical Considerations

### User Agent Detection

Device type, browser and OS are derived from the User-Agent header of each pageview by simple keyword rules. The raw User-Agent string is kept only in the event-level log, which is purged after 1 day; only the derived categories (device type, browser family, OS family) are kept, inside daily aggregates, for up to 24 months. See [What We Track](/security-privacy/what-we-track).

Known consequences of the detection rules:

- **Tablets:** only user agents containing "iPad" or "Tablet" count as Tablet. iPads browsing in Safari's default desktop mode send a Mac user agent and are counted as **Desktop / macOS**; most Android tablets are counted as **Mobile**.
- **Chromium-based browsers** that include "Chrome" in their user agent — current Opera, Samsung Internet, Brave and others — are counted as **Chrome**.
- **iPhone and iPad browsers** (including Chrome, Firefox and Edge for iOS) are counted as **Safari**.
- **Chromebooks** report as `CrOS` and currently fall under **Unknown** OS.
- Anything unrecognised defaults to **Desktop** / **Unknown** browser / **Unknown** OS.

As with any user-agent-based analytics, the header can be spoofed or reduced by privacy tools. Known bots are filtered out before they reach reports — see [Bot Detection](/security-privacy/bot-detection).

Server-side conversions (for example orders sent by the Shopify integration) carry the platform's server user agent, not the shopper's. When the order can be matched to the visitor's session, Sealmetrics assigns it the device, browser and OS recorded for that session, so the purchase lands on the shopper's device row.

### Browser Privacy Features

Sealmetrics sets no cookies and can be served from your own subdomain, so browser protections aimed at cross-site tracking — Safari's Intelligent Tracking Prevention, Firefox's Enhanced Tracking Protection — do not remove it by design. A visitor running an ad blocker with a custom rule against your tracking subdomain can still block it. See [How Sealmetrics Reduces AdBlocker Data Loss](/security-privacy/adblocker-bypass).

### Mobile App Traffic

Sealmetrics measures pages that load the tracker, so native app screens are not counted. Pages opened inside an app (a WebView or an in-app browser, such as the one social apps use for links) are counted, classified from that WebView's user agent:

- On Android they usually appear as **Chrome** / **Android** / **Mobile**
- On iOS they usually appear under **Unknown** browser, because iOS WebView user agents do not include "Safari"

There is no separate app-vs-web dimension in this report.

## Export

Each table has its own **Export** button:

- **Export as CSV** or **Export as PDF**
- Exports that table only, with all eight columns (Conv. is labelled **Conversions** in the file)
- Includes every row that matches the active Segment and table filters — not only the current page — but ignores the table search box

## Related documentation

- [Overview Report](/reports/overview) — The high-level dashboard for all reports
- [Geography Report](/reports/geography) — Break traffic down by country
- [Funnel Report](/reports/funnel) — Combine with a device Segment to find where shoppers drop out
- [Filters](/reports/filters) — Segment reports by device, browser, and OS
- [How Sealmetrics Reduces AdBlocker Data Loss](/security-privacy/adblocker-bypass) — why device data loses far less to ad blockers
- [Metrics Reference](/reports/definitions) — Definitions for entrances, bounce rate, and conversions
