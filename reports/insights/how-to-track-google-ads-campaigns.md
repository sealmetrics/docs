---
title: "How to Track Google Ads Campaigns"
description: "Learn how to correctly track Google Ads campaigns in Sealmetrics using UTM parameters and Google Ads value-track templates."
canonical_url: "https://docs.sealmetrics.com/reports/insights/how-to-track-google-ads-campaigns"
lang: "en"
date_generated: "2026-08-12T08:27:36.924Z"
source_hash: "253238d8f2238accb64a160bba1bc3a9e451826a4cdaac7b9f64234111addb38"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "reports/insights/how-to-track-google-ads-campaigns.mdx"
publisher: "Sealmetrics"
---

# How to Track Google Ads Campaigns

Canonical page: https://docs.sealmetrics.com/reports/insights/how-to-track-google-ads-campaigns

Sealmetrics reads the UTM parameters located in your URLs.

By incorporating these URL tracking templates into your Google Ads campaigns, SEAL can track campaigns, terms/keywords, placements, or product IDs from Google Ads.

Because Sealmetrics is cookieless, the landing URL is the only place attribution data can come from: UTM tags and ad click IDs are extracted **server-side from the page URL** the visitor actually lands on. If a parameter is not in that URL, it cannot be reported.

---

## Google Search & Display (GDN)

```
{lpurl}?utm_medium=cpc&utm_source=google&utm_campaign={Campaignid}&utm_term={ifsearch:{keyword}\{matchtype}}{ifcontent:{placement}}
```

## Google Shopping

```
{lpurl}?utm_medium=cpc&utm_source=google&utm_campaign={Campaignid}&utm_term={_term}
```

---

## What the template does

Everything in `{curly braces}` is a **Google Ads ValueTrack parameter**. Google replaces it at click time, before the visitor reaches your site, so Sealmetrics only ever sees the final resolved values.

| Placeholder | Replaced by | Lands in Sealmetrics as |
|---|---|---|
| `{lpurl}` | The ad's final URL | The landing page |
| `{Campaignid}` | The campaign's numeric ID | **Campaign** in the [Campaigns tab](/reports/sources#4-campaigns-tab) |
| `{keyword}` | The keyword that triggered the ad | Part of **Term** |
| `{matchtype}` | The keyword's match type (`e` exact, `p` phrase, `b` broad) | Part of **Term** |
| `{placement}` | The site or app where a Display ad was shown | **Term**, for Display clicks |
| `{_term}` | A custom parameter you define in Google Ads | **Term**, for Shopping clicks |

The two conditional wrappers are what let a **single template cover both networks**:

- `{ifsearch:…}` resolves only when the click came from the **Search** network. Everything else is dropped.
- `{ifcontent:…}` resolves only when the click came from the **Display** network.

So `utm_term={ifsearch:{keyword}\{matchtype}}{ifcontent:{placement}}` produces a `utm_term` that holds the **keyword and its match type** on Search clicks, and the **placement domain** on Display clicks — never both, and never an empty tag on either network. Sealmetrics then reports whichever value arrived as the [TERM](/reports/insights/what-is-a-term).

`utm_medium=cpc` and `utm_source=google` are fixed values, not ValueTrack. They are what keep these visits classified as paid: a hit carrying `utm_` parameters or a `gclid` is never counted as organic search. See [How Sealmetrics Calculates SEO Traffic](/reports/insights/how-sealmetrics-calculates-seo-traffic).

**Note:**

---

## Google Ads Account-Level Setup

You can add this code directly at the Account level following these [Google Ads instructions](https://support.google.com/google-ads/answer/6305348?hl=en).

When configured at the account level, Google Ads will automatically append all value-track parameters to every campaign — including new ones — ensuring reliable attribution in Sealmetrics.

---

## How to verify it works

You do not have to wait for a real click. Sealmetrics processes hits in **seconds, not hours**, so you can confirm the setup end to end in a couple of minutes.

**1. Test the resolved URL first.** In Google Ads, use the **Test** button next to the tracking template. Google shows you the final URL a click would produce. Check that the UTM parameters are present and filled in — not left as literal `{keyword}` text.

**2. Land on your own site with a tagged URL.** Paste that resolved URL into a browser and load the page. Any URL with the same parameters works for a smoke test, for example:

```
https://yoursite.com/landing?utm_medium=cpc&utm_source=google&utm_campaign=123456789&utm_term=running+shoes
```

**3. Confirm the hit arrived.** Open the **Overview** report and check the **Last hit** timestamp at the top right — it should read "seconds ago". If it does not move, the hit never arrived and the problem is with your tracking installation, not the template. See [Data Delay](/troubleshooting/data-delay).

**4. Confirm the values landed in the right tabs.** Open the [Sources report](/reports/sources) and check:

| Tab | What you should see |
|---|---|
| **Mediums** | `cpc` |
| **Sources** | `google` |
| **Campaigns** | Your campaign ID (the numeric value `{Campaignid}` resolved to) |
| **Terms** | Your keyword and match type, or the placement for Display clicks |

---

## Troubleshooting

**Terms show `(not set)`, or campaigns show numeric IDs you can't read.**
`(not set)` means the parameter never reached the landing URL. `{Campaignid}` resolves to Google's numeric campaign ID, not the campaign name, so numbers in the Campaigns tab are expected behaviour rather than a fault. See [Understanding the "(not set)" Value](/reports/insights/understanding-not-set).

**A redirect sits between the ad and the landing page.**
Redirect chains frequently strip query parameters. Because Sealmetrics reads UTMs from the URL of the page where the pixel fires, anything dropped in a redirect is gone for good. Load the ad URL and inspect the address bar *after* all redirects settle — the parameters must still be there.

**Your marketing stack uses different parameter names.**
If your team standardises on names like `campaign_id` instead of `utm_campaign`, map them in **Settings → Sites → UTM Mappings** rather than editing the template. See [How to Change UTM Parameters](/reports/insights/how-to-change-utm-parameters).

**Medium shows `(none)` instead of `(not set)`.**
That is specific to a missing `utm_medium`, and is aligned with GA4's behaviour. It means `utm_medium=cpc` did not survive to the landing URL.

## Related documentation

- [How Sealmetrics Calculates SEO Traffic](/reports/insights/how-sealmetrics-calculates-seo-traffic) — How paid is kept separate from organic
- [What Is a TERM in Sealmetrics?](/reports/insights/what-is-a-term) — How keywords are captured from Google Ads
- [How to Track Social Ads Campaigns](/reports/insights/how-to-track-social-ads-campaigns) — UTM tagging for Meta Ads
- [How to Change UTM Parameters in Sealmetrics](/reports/insights/how-to-change-utm-parameters) — Map custom parameter names
- [Sources Report](/reports/sources) — Analyze campaign and keyword performance
