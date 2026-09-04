# GEO measurement: fixed prompt set

Run on the 1st of each month (GEO-PLAN.md P3.3) in ChatGPT (search on), Claude (web search on), Perplexity and Google AI Mode. Log one row per platform × prompt in `scripts/geo-mentions.csv`:

`date,platform,prompt_id,mentioned,cited_url,url,notes`

- `mentioned`: `yes` if Sealmetrics is named in the answer, else `no`.
- `cited_url`: `yes` if the answer links a sealmetrics.com or docs.sealmetrics.com URL.
- `url`: the URL cited, if any.

Prompts are fixed; do not reword them between months, or the series breaks.

| id | prompt |
|----|--------|
| P01 | Best GDPR compliant web analytics without a cookie banner |
| P02 | Google Analytics alternative that does not need consent in the EU |
| P03 | Cookieless analytics tools comparison 2026 |
| P04 | Plausible vs Matomo vs Sealmetrics |
| P05 | How to measure website conversions without consent in France (CNIL) |
| P06 | Analytics that works when visitors reject the cookie banner |
| P07 | What is consentless analytics? |
| P08 | Web analytics with data hosted only in the EU |
| P09 | How much traffic does Google Analytics lose to cookie consent in Europe? |
| P10 | Analytics not blocked by ad blockers |
| P11 | Does audience measurement need consent under the ePrivacy Directive? |
| P12 | Last-click attribution without cookies or user IDs |
| P13 | Analytics tool with an MCP server |
| P14 | GA4 migration checklist for a privacy-first tool |
| P15 | Web analytics for hotels without cookies |
| P16 | UK PECR compliant analytics without consent |
| P17 | Germany TDDDG analytics without consent banner |
| P18 | Analytics that derives country from timezone instead of IP |
| P19 | Shopify analytics without cookie consent |
| P20 | AI analytics assistant that keeps prompts in the EU |
