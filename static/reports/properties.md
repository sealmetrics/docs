---
title: "Properties Report"
description: "Break down the custom properties of conversions, microconversions and purchased items by UTM source, medium and campaign — e.g. which campaigns sell each product category."
canonical_url: "https://docs.sealmetrics.com/reports/properties"
lang: "en"
date_generated: "2026-09-21T07:18:17.820Z"
source_hash: "2bee90abc8538da9d0cb1e149cab16bd49cf18a117a14e8b50aac353238840a1"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "reports/properties.mdx"
publisher: "Sealmetrics"
---

# Properties Report

Canonical page: https://docs.sealmetrics.com/reports/properties

The Properties report lets you analyze the custom properties attached to conversions, microconversions and purchased items (`items`), broken down by traffic source (UTM source / medium / campaign).

## What This Report Shows

When you track conversions with custom properties (like `product_category`, `plan_type`, or `payment_method`), this report helps you understand:

- How events distribute across the values of a property for each source / medium / campaign
- Which traffic sources over- or under-index on specific property values
- Which products or categories each traffic source sells (with the **Conv. Items** data source)

The report counts **events** (or, for Conv. Items, units). It does not show revenue — for revenue by source use the [Sources](./sources) or [Conversions](./conversions) reports.

## Accessing the Report

1. Select a site from the site selector
2. Click **Properties** in the sidebar

## Report Interface

### Controls

| Control | Description |
|---------|-------------|
| **View Mode** | Toggle between **Totals** (absolute numbers) and **Rates** (percentages). See [View Modes](#view-modes) |
| **Data Source** | Toggle between **Conversions**, **Microconversions**, and **Conv. Items**. See [Data Sources](#data-sources) |
| **Property Key** | Select which property to analyze (e.g., `currency`, `plan_type`). Each option shows its event count. The first key is selected automatically |
| **Export** | Download the current breakdown as CSV or PDF |

### Data Sources

| Data Source | What is counted | Notes |
|-------------|-----------------|-------|
| **Conversions** | One per conversion carrying the selected key | Includes every conversion type (e.g. `purchase`, `lead`) that carries the key. The `items` key is hidden here — analyze it with Conv. Items |
| **Microconversions** | One per microconversion carrying the selected key | Includes every microconversion type (e.g. `view_item`, `add_to_cart`) that carries the key |
| **Conv. Items** | Units of each product in the `items` array of your conversions | Each field inside an item (`category`, `product_name`, `brand`…) becomes a selectable key. An item with `quantity: 2` counts as 2; an item without `quantity` counts as 1. `quantity` itself is not offered as a key |

The report has no conversion-type or microconversion-type selector. If the same key is sent on several event types, their counts are added together — use distinct keys, or send the key only on the event you want to analyze.

Events where the selected key is missing or empty are left out of the breakdown.

### Property Analysis Table

The main table shows:

| Column | Description |
|--------|-------------|
| **Source / Medium / Campaign** | UTM attribution for this row. An empty source is shown as `(direct)`, an empty medium or campaign as `(none)`. In Rates mode, an entrance count is also shown |
| **Total** / **Share %** | In Totals mode, the sum of all events for this UTM combination. In Rates mode the header changes to **Share %** (see [View Modes](#view-modes)) |
| **[Property Values]** | One dynamic column for each distinct value of the selected property |

Rows are sorted by total, largest first. Click any column header to sort by the value it displays. The table is paginated (10, 50, 100 or 500 rows per page).

A summary above the table shows the selected property key, its number of distinct values, and the total events.

### Heatmap Visualization

Property-value cells are color-coded. The legend above the table labels them **\> avg**, **≈ avg** and **\< avg**:

| Color | Meaning |
|-------|---------|
| **Green** | This value takes more than an even share of the row's total |
| **Yellow** | Within ±15% of an even share |
| **Red** | This value takes less than an even share of the row's total |

The comparison is made **within each row**: a row's total is divided evenly across all the property's values, and each cell is compared with that even share. Green therefore means "this source leans towards this value", not "this source outperforms other sources". A value that is large for every source (for example your best-selling category) will be green on most rows — compare rows against each other before drawing conclusions.

### View Modes

**Totals Mode**
- Shows absolute counts for each property value
- Useful for understanding volume distribution

**Rates Mode**
- Shows percentages instead of counts. For each row, the dashboard looks up the entrances recorded for that source / medium / campaign and shows that count under the source name
- When an entrance count is found, each cell shows events ÷ entrances, and **Share %** shows the row total ÷ entrances
- When no entrance count is found (the row shows **0 entrances**), each cell shows its share of the row's total and **Share %** shows 100%
- Check the entrance count under the source before reading a Rates cell as a conversion rate

## Available Properties Table

Below the main analysis, you'll find a summary of the property keys available for the selected data source and date range:

| Column | Description |
|--------|-------------|
| **Property Key** | The property name (click to analyze it in the table above) |
| **Conversions** | Count from conversion events (in Conv. Items mode, the item unit count appears here) |
| **Microconversions** | Count from microconversion events |
| **Total** | Combined count |

Because the table follows the **Data Source** toggle, one of the two count columns is normally 0.

## Filters

The Properties report has fewer filters than the traffic reports:

| Filter | Applies to this report? |
|--------|-------------------------|
| **Date range** | Yes — every table on the page |
| **Comparison period** | No — the report shows no comparison values |
| **Segment** (country, device type, browser, OS) | **No** for event counts. The filter bar stays visible, but property counts always include all countries, devices, browsers and operating systems. Active Segment filters only change the entrance counts used in Rates mode |
| **Local filter builder / search** | Not available on this report |
| **UTM, channel or conversion-type filters** | Not available. Rows are already split by source / medium / campaign; sort a column or export to CSV to narrow down |

The only report-specific controls are the **View Mode**, **Data Source** and **Property Key** selectors described above. See [Filters](./filters) for how global filters work in other reports.

## Example Use Cases

For online stores, see [E-commerce use cases](#e-commerce-use-cases) below.

### SaaS: Plan Type Analysis

Understand which campaigns drive premium vs basic subscriptions:

```javascript
sealmetrics.conv('subscription', 49.00, {
  plan_type: 'premium',
  billing_cycle: 'annual'
});
```

Analyze `plan_type` to optimize campaigns for higher-value plans.

### Lead Gen: Lead Source Analysis

Track which forms and sources generate leads:

```javascript
sealmetrics.conv('lead', 0, {
  form_name: 'contact',
  lead_source: 'pricing_page'
});
```

## E-commerce use cases

These cases assume your purchase conversion carries transaction-level properties and an `items` array, as described in the [E-commerce Setup Guide](/implementation/ecommerce-conversion-tracking/ecommerce-setup-guide):

```javascript
sealmetrics.conv('purchase', 267.97, {
  currency: 'EUR',
  payment_method: 'credit_card',
  coupon: 'SAVE10',
  items: [
    { product_name: 'Blue Running Shoes', product_id: 'SKU-123', price: 89.99, quantity: 2, category: 'footwear', brand: 'Acme' },
    { product_name: 'Sports Socks', product_id: 'SKU-456', price: 89.99, quantity: 1, category: 'accessories', brand: 'Acme' }
  ]
});
```

Attribution in every case is the source / medium / campaign of the session in which the event happened (last click per session).

### Which campaigns sell which product categories?

1. Set **Data Source** to **Conv. Items** and **Property Key** to `category`.
2. Keep **View Mode** on **Totals**.
3. Read each campaign's row across the category columns.

**How to read it:** the counts are units sold per category for that campaign. Green cells show the categories a campaign leans towards. If a campaign built for one category mostly sells another, its targeting or landing page is attracting a different buyer than intended — adjust the creative or landing page, or move budget to the campaign that already sells that category. Remember the heatmap compares within the row: a category that dominates your whole catalogue will be green almost everywhere.

**Needs:** `items` with a `category` field on the purchase conversion.

### Which traffic source sells a specific product?

1. Set **Data Source** to **Conv. Items** and **Property Key** to `product_name` (or `product_id`, or `brand`).
2. Click the column header of the product you care about to sort rows by units of that product.
3. Export to CSV if you need to share or pivot the result.

**How to read it:** the top rows are the sources, mediums and campaigns that sold the most units of that product. If a product you promote heavily barely appears in the rows of the campaign that promotes it, that campaign is not selling it. Product-level keys produce one column per product, so a large catalogue gives a wide table — use `category` or `brand` for an overview and `product_name` for a short list of key products.

**Needs:** `items` with the chosen field on the purchase conversion.

### Which campaigns depend on discount codes?

1. Set **Data Source** to **Conversions** and **Property Key** to `coupon`.
2. Keep **View Mode** on **Totals**.
3. Compare each row's **Total** with that source's total conversions in the [Sources report](./sources) for the same date range.

**How to read it:** this table only counts orders that carried a coupon — orders without one are left out. A campaign whose coupon orders are close to its total orders is selling on discount; one with few coupon orders is bringing full-price buyers. The coupon columns also show which codes leak into channels they were not issued for (for example an affiliate code appearing under paid search). Review codes that show up in unexpected rows.

**Needs:** a `coupon` property on the purchase conversion, sent only when a code is used. Because the Conversions data source includes every conversion type, send `coupon` only on `purchase`.

### Which categories get added to the cart but not bought?

1. Set **Data Source** to **Microconversions** and **Property Key** to `category`. Note the category mix for a source.
2. Switch **Data Source** to **Conv. Items** (key `category`) and compare the same source's mix of purchased units.

**How to read it:** a category that takes a large share of a source's add-to-carts but a small share of its purchased units is losing buyers between cart and order — check price, shipping costs or stock for that category, and look at the cart-to-checkout step in the [Funnel report](./funnel). Compare shares rather than raw numbers: one add-to-cart event can hold several units, and purchased units are counted by `quantity`.

**Needs:** an `add_to_cart` microconversion with a `category` property. The Microconversions data source adds together every microconversion type that carries `category`, so if you also send `category` on `view_item` or `begin_checkout`, those are counted too. Either send `category` only on `add_to_cart`, or use a distinct key such as `cart_category`. See [Microconversions](/implementation/tracker/microconversions) and the funnel events in the [E-commerce Setup Guide](/implementation/ecommerce-conversion-tracking/ecommerce-setup-guide).

## Best Practices

### 1. Use Consistent Property Names

Standardize property names across your implementation:

```javascript
// Good - consistent naming
sealmetrics.conv('purchase', value, { product_category: 'shoes' });

// Avoid - inconsistent
sealmetrics.conv('purchase', value, { category: 'shoes' });
sealmetrics.conv('purchase', value, { productCategory: 'shoes' });
```

### 2. Keep Property Values Clean

Use consistent, lowercase values:

```javascript
// Good
{ plan_type: 'premium' }

// Avoid
{ plan_type: 'Premium' }
{ plan_type: 'PREMIUM' }
```

Values are stored as text. Numbers and booleans are converted to strings, so `premium`, `Premium` and `PREMIUM` appear as three separate columns.

### 3. Limit Property Cardinality

Every distinct value becomes a column in the analysis table. There is no hard limit on the number of values, but keys with many unique values (order IDs, prices, timestamps) produce tables too wide to read. Avoid using unique IDs as property values.

### 4. Track Meaningful Properties

Focus on properties that inform business decisions:

**Good properties:**
- `product_category` - Informs inventory and marketing decisions
- `plan_type` - Helps optimize pricing campaigns
- `payment_method` - Identifies payment preferences by source

**Less useful properties:**
- `order_id` - Too many unique values
- `timestamp` - Already tracked automatically
- `user_email` - Privacy concern, too granular

## Requirements

The Properties report requires:

1. **Conversions or microconversions with properties** - Events must include custom properties
2. **Purchases with an `items` array** - Only for the **Conv. Items** data source

UTM parameters are not required: events without a recorded source are grouped under `(direct)`.

If no properties are found, the report will display: "No properties found. Properties are set when tracking conversions and microconversions."

## Related Documentation

- [Event Properties Guide](/implementation/ecommerce-conversion-tracking/event-properties) - How to implement properties
- [E-commerce Setup Guide](/implementation/ecommerce-conversion-tracking/ecommerce-setup-guide) - Purchase, `items` and funnel events
- [Conversions](/implementation/tracker/conversions) - Tracking conversions
- [Microconversions](/implementation/tracker/microconversions) - Tracking microconversions
- [Sources Report](./sources) - Traffic source analysis
- [Funnel Report](./funnel) - Step-by-step drop-off
