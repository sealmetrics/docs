---
title: "How to Change UTM Parameters in Sealmetrics"
description: "Learn how to customize UTM parameters in Sealmetrics by mapping custom URL parameters to standard UTM fields."
canonical_url: "https://docs.sealmetrics.com/reports/insights/how-to-change-utm-parameters"
lang: "en"
date_generated: "2026-08-09T18:18:16.203Z"
source_hash: "70b7d5c4e09a58ea349121ac17ec44a45f370375ad2162f81bed3db10d907082"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "reports/insights/how-to-change-utm-parameters.mdx"
publisher: "SealMetrics"
---

# How to Change UTM Parameters in Sealmetrics

Canonical page: https://docs.sealmetrics.com/reports/insights/how-to-change-utm-parameters

Some businesses use custom UTM structures or alternative analytics platforms such as Adobe Analytics, Piwik PRO, or proprietary BI systems.
If your marketing tools use different parameter names (e.g., `campaign_id` instead of `utm_campaign`), you can create custom mappings in Sealmetrics.

---

## 1. Access UTM Mappings

1. Go to **Settings → Sites** in the sidebar.
2. Click on the site you want to configure.
3. Click the **UTM Mappings** tab.

This section lets you map custom URL parameters to the standard UTM fields that Sealmetrics uses for reporting.

**Info:**

---

## 2. Add a Custom Mapping

1. Enter your custom parameter name in the **Custom Parameter Name** field (e.g., `campaign_id`).
2. Select which UTM field it maps to from the **Maps To** dropdown:
   - **Source** (`utm_source`)
   - **Medium** (`utm_medium`)
   - **Campaign** (`utm_campaign`)
   - **Term** (`utm_term`)
   - **Content** (`utm_content`)
3. Click **Add** (or press Enter).

The mapping will appear in the list below the form.

---

## 3. Remove a Mapping

Click the **trash icon** next to any mapping to remove it. A confirmation dialog will appear before deletion.

---

## Why Customize UTMs?

Customizing UTM mappings is especially helpful when:

- Your marketing tools use non-standard parameter names (e.g., Hubspot's `campaign_id`)
- Migrating from another platform and keeping existing URL conventions
- Maintaining internal naming conventions for campaign management
- Shortening long parameter names (e.g., `cmp` instead of `utm_campaign`)
- Standardizing parameters across teams and tools

---

## Important Notes

- Changes apply **from the moment you add the mapping**. Previous hits will not be remapped retroactively.
- If a UTM parameter is missing in the URL, Sealmetrics will display **"(not set)"** for that field — except for `utm_medium`, which is shown as **"(none)"** (aligned with GA4).
- Custom mappings are additive — they don't modify how standard UTM parameters are captured.
- Keep your UTM structure consistent across all campaigns to maintain clean and accurate reports.

## Related documentation

- [Understanding the "(not set)" Value in Sealmetrics Reports](/reports/insights/understanding-not-set) — What happens when a UTM is missing
- [How to Track Google Ads Campaigns](/reports/insights/how-to-track-google-ads-campaigns) — UTM templates for paid search
- [How to Track Social Ads Campaigns](/reports/insights/how-to-track-social-ads-campaigns) — UTM tagging for Meta Ads
- [Sources Report](/reports/sources) — Where UTM data is reported
