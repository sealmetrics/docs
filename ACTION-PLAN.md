# SEO Action Plan — docs.sealmetrics.com

**Audit date:** 2026-04-18
**Target:** `https://docs.sealmetrics.com` (Docusaurus v3.9.2, GitHub Pages)
**Pages crawled:** 268 (from `sitemap.xml`, 100% coverage)
**Business type:** B2B SaaS — documentation + marketing blog for a cookieless / GDPR-compliant web analytics product
**Overall SEO Health Score:** **75 / 100**

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 25% | 82 |
| Content Quality | 25% | 78 |
| On-Page SEO | 20% | 75 |
| Schema / Structured Data | 10% | 55 |
| Performance (CWV) | 10% | 70 |
| Images | 5% | 70 |
| AI Search Readiness | 5% | 85 |

---

## Top 5 Critical Issues

1. **Homepage title/H1 is "Reports Overview"** — not a docs landing page. Cannibalizes `/reports/overview`.
2. **Staging pixel leaking to production** — `pixel-pre.sealmetrics.com/t.js` embedded site-wide. Data integrity + perf bug.
3. **`SoftwareApplication` JSON-LD emitted on every URL** — including blog, FAQ, API docs. Rich-result spam signal.
4. **No `BlogPosting` / `BreadcrumbList` / `TechArticle` schema anywhere** — biggest SERP / AI-citation loss.
5. **Factual contradiction in flagship comparison post** — `/blog/google-analytics-vs-sealmetrics` states both 99 EUR and 229 EUR for the same plan.

## Top 5 Quick Wins (hours, not days)

1. Swap `pixel-pre` → `pixel` (1 line in `docusaurus.config.ts`).
2. Fix 99/229 EUR contradiction in GA comparison post.
3. Consolidate `blog/authors.yml` duplicates (`rafa` + `rafael-jimenez` → one slug).
4. Enable `lastmod` in sitemap plugin config.
5. Add 7 `ignorePatterns` to sitemap plugin (search, markdown-page, tag archives, paginated blog).

---

## Critical — fix this week

### C1. Homepage has wrong title, H1, and routing
- **Where:** root `/` renders `<title>Reports Overview | Sealmetrics Docs</title>` and `<h1>Reports Overview</h1>`. Canonical is `/`, but content duplicates `/reports/overview`. First-time visitor gets no product intro.
- **Impact:** Keyword cannibalization, zero brand value prop above the fold, confuses both users and LLM crawlers trying to cite "what Sealmetrics is."
- **Fix:** in `docs/index.mdx` (and `docusaurus.config.ts` if needed), either (a) make `/` a dedicated docs landing page with H1 **"Sealmetrics Documentation — Consentless Web Analytics"** and a 1–2 sentence value prop above the report cards, or (b) 301 `/` → `/intro` and drop `/` from sitemap. Option (a) preferred.
- **File:** `docs/index.mdx`, `docusaurus.config.ts`

### C2. Staging pixel on production docs
- **Where:** `/tmp/seal-home.html` line 15 — `<script src="https://pixel-pre.sealmetrics.com/t.js?id=sealmetrics2&group=docs" defer>`.
- **Impact:** Live docs visitors are tracked into a non-prod bucket; you are not dogfooding your own production pixel; adds a third-party origin handshake to every page load.
- **Fix:** change host to `pixel.sealmetrics.com` in `docusaurus.config.ts` scripts/head section. Also add `<link rel="preconnect" href="https://pixel.sealmetrics.com" crossorigin>`.
- **File:** `docusaurus.config.ts`

### C3. `SoftwareApplication` JSON-LD site-wide
- **Where:** `docusaurus.config.ts` `headTags` (lines ~28–86) inject one `@graph` containing `Organization` + `WebSite` + `SoftwareApplication` on every page, including blog posts, FAQ, API docs, changelog.
- **Impact:** Google treats `SoftwareApplication` as a per-page entity. Emitting it on a blog post is a bad signal. `offers.price` without `aggregateRating`/`review` is also ineligible for the rich snippet (required since 2023).
- **Fix:** restrict `SoftwareApplication` to `/` only (via a route filter or by moving it to a `<Head>` inside `src/pages/index`). Keep `Organization` + `WebSite` global. Add `aggregateRating` or `review` if you have verified reviews.
- **File:** `docusaurus.config.ts`

### C4. No per-page structured data on blog / docs / integrations
- **Missing:** `BlogPosting` on `/blog/*`, `BreadcrumbList` on docs, `TechArticle` on `/api/*`, `CollectionPage` on `/changelog`. Docusaurus blog plugin does NOT auto-emit these.
- **Impact:** Biggest single SERP + AI-citation loss. Comparison posts and the cookieless-analytics guide are ideal citation candidates but have no machine-readable author / publisher / headline / datePublished.
- **Fix:** swizzle `theme/BlogPostItem` and `theme/DocBreadcrumbs` to inject per-page JSON-LD. Snippet ready in the audit notes; start with `BlogPosting` on the 10 posts, then breadcrumbs globally.
- **File:** new `src/theme/BlogPostItem/StructuredData.tsx`, `src/theme/DocBreadcrumbs/index.tsx`

### C5. Factual contradiction in `/blog/google-analytics-vs-sealmetrics`
- **Where:** `blog/google-analytics-vs-sealmetrics.mdx` — line 374 says "99 EUR/month for 1M pageviews" while lines 311 and 603 say **229 EUR/month** for the Starter plan.
- **Impact:** September 2025 QRG flags this as low-quality AI content. LLMs will extract whichever number appears first; SERP snippets will be inconsistent.
- **Fix:** pick the correct price (likely 229) and replace all three occurrences.
- **File:** `blog/google-analytics-vs-sealmetrics.mdx`

---

## High — fix within 1–2 weeks

### H1. Sitemap missing `<lastmod>` on all 268 URLs
- `changefreq=weekly` and `priority=0.5` are hardcoded on every URL — Google ignores both. `<lastmod>` is absent everywhere.
- **Fix:** in `docusaurus.config.ts`, set `@docusaurus/plugin-sitemap` options to `{ lastmod: 'date', changefreq: null, priority: null }`.

### H2. Sitemap includes low-value URLs
- In sitemap: `/markdown-page`, `/search`, `/blog/page/2`, `/blog/archive`, `/blog/authors`, 28 `/blog/tags/*`, 9 `/category/*` (thin auto-gen pages).
- **Fix:** add `ignorePatterns: ['/markdown-page', '/search', '/blog/page/**', '/blog/archive', '/blog/authors', '/blog/tags/**', '/category/**']` to the sitemap plugin. Expected new count: ~225 URLs.

### H3. Blog tag proliferation (27 tags over ~12 posts)
- Near-duplicate tags: `cookieless` vs `cookieless-analytics`, `consentless` vs `consentless-analytics`, `gdpr` vs `gdpr-compliance` vs `gdpr-tag`, `privacy` vs `privacy-analytics` vs `privacy-first-analytics`. Many "One post tagged with X" thin archive pages.
- **Fix:** consolidate to ~8 canonical tags in each post's frontmatter. After consolidation, `noindex` all `/blog/tags/*` (keep crawlable, drop from index).

### H4. Thin FAQ pages (core citation surface)
- Under 300 words each: `faq/attribution.mdx` (120), `faq/implementation.mdx` (138), `faq/legal-compliance.mdx` (108), `faq/product.mdx` (109), `faq/consentless-analytics.mdx` (205).
- **Fix:** expand each Q with evidence + cite regulatory sources (CNIL §, GDPR articles, AEPD guidance). These are your best AI-citation real estate; waste.

### H5. Duplicate author identity in `authors.yml`
- Both `rafa` and `rafael-jimenez` exist with identical bio/image. `2025-12-06-eu-omnibus-regulation.md` uses `rafa`; 10 others use `rafael-jimenez`.
- **Fix:** delete one key, update the lone post's frontmatter. Fragmented author entity hurts E-E-A-T.

### H6. Security headers missing
- Only `Strict-Transport-Security: max-age=31556952` is sent. Absent: CSP, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`. HSTS also lacks `includeSubDomains; preload`.
- **Fix:** GitHub Pages can't set custom headers. Front the site with Cloudflare (free tier) and inject via Transform Rules, or move hosting. Extend HSTS to `max-age=63072000; includeSubDomains; preload`.

### H7. `/platform` returns 404 (sub-pages 200)
- 24 pages exist under `/platform/*` but the hub `/platform` itself 404s. Other sections (`/compliance`, `/security-privacy`, `/lens`) all have index pages.
- **Fix:** create `/platform/index.mdx` with overview + child links, or 301 redirect to `/platform/settings`.

### H8. Empty placeholder page `/integrations/ecommerce/bigcommerce`
- 21 words: "This integration is not currently available." Marked `unlisted: true` but still in URL list.
- **Fix:** either remove the file or build the integration. Branded empty pages hurt trust.

### H9. Truncated content on `/security-privacy/adblocker-bypass`
- 162 words; body ends with "for example:" and no example follows. Content bug.
- **Fix:** finish the section or revert to a previous commit.

### H10. `/ga4-migration` only 106 words
- High-intent SEO keyword ("GA4 migration") landing on a 106-word page. Thin.
- **Fix:** expand to a full migration guide or 301 to the comparison post.

### H11. Stale flagship post
- `/blog/long-term-analytics-data-retention` dated **2024-06-13** (22 months old) in a "2026" content program.
- **Fix:** refresh content + bump `dateModified` — do NOT delete.

### H12. Homepage preload misplaced
- `<link rel="preload" as="image" href="/img/logo.svg">` sits inside `#__docusaurus` instead of `<head>` — browser preloader won't find it.
- **Fix:** move to `<head>` via Docusaurus head tags.

### H13. Changelog heading bug
- `docs/changelog.mdx` line 38: `##Update to the Robot User Agents Database` — missing space after `##`, heading doesn't render.

---

## Medium — fix within 1 month

### M1. Hardcoded card colors on homepage break dark mode
Inline styles `background-color:#FFFFFF; color:#333` on the 5 report cards stay white-on-white in dark mode. Replace with CSS vars `var(--ifm-card-background-color)` / `var(--ifm-color-emphasis-700)`.

### M2. WCAG AA contrast failure
Card headings use `color:#00A47C` on white — ratio ~3.3:1. Use `#007a5c` or darker.

### M3. Tag archive titles / meta
Titles like "One post tagged with X" (generic) and meta descriptions under 30 chars on every tag page. If tags are kept indexable, customize titles and descriptions via a theme override. Better: `noindex` and move on.

### M4. `Organization` JSON-LD incomplete
Missing `contactPoint`, `address`, `foundingDate`, `description`. `sameAs` could add YouTube, Crunchbase. Hurts Knowledge Panel eligibility.

### M5. `SoftwareApplication.priceValidUntil`
`2026-12-31` expires in ~8 months. Add an annual renewal task or compute dynamically.

### M6. `WebSite` missing `potentialAction` SearchAction
Add an Algolia-backed `SearchAction` so Google can show a sitelinks search box.

### M7. Weak internal linking on `/reports/overview`
644 words, no explicit "Related reports" section. The card grid lives on `/reports/` (index), not `/reports/overview`. Add an explicit cross-link block.

### M8. Inline styles bloat homepage HTML
Every card has 10+ `style=""` attributes — ~3 KB duplicated per render, and defeats CSS caching. Extract to a CSS module + reusable `<ReportCard>` component.

### M9. Images without intrinsic dimensions
Navbar logo `<img>` has no `width`/`height` → CLS risk during hydration. Add to all decorative `<img>` tags.

### M10. Social card unverified
`og:image = /img/sealmetrics-social-card.jpg` — dimensions and design not confirmed. Validate at `https://www.opengraph.xyz/url/https%3A%2F%2Fdocs.sealmetrics.com`. Must be 1200×630 for `twitter:card=summary_large_image`.

### M11. Nine blog post titles exceed 65 chars
Risk of truncation in SERPs. Examples: `cookie-banner-ghosting-data-loss` (87), `cookieless-tracking-technical-deep-dive` (86), `long-term-analytics-data-retention` (79), `sealmetrics-vs-plausible` (79), `google-analytics-vs-sealmetrics` (76). Trim the `| Sealmetrics Docs` suffix on blog only, or shorten headlines.

### M12. Comparison post imbalance
`/blog/google-analytics-vs-sealmetrics` has a thin "When to Choose Google Analytics" section vs a rich "When to Choose Sealmetrics." QRG flags as promotional. Add 2–3 concrete GA-wins scenarios (enterprise BI integrations, legacy reporting, GA360 audience sharing).

### M13. Grammar / AI-slop markers in `sealmetrics-vs-plausible`
Line 68 "less 1KB", line 125 "Less number of clients", line 180 duplicated CNIL/AEPD wording, line 303 partial "Slack/Email Alerts" row.

### M14. Docusaurus dev-banner script in production HTML
`insertBanner` inline script (~1.3 KB) ships on every page. Strip via `headTags` override or post-build.

---

## Low — backlog

- **L1.** Empty `<b class="navbar__title"></b>` — add `title: 'Sealmetrics'` in navbar config so mobile has a text fallback when logo shrinks.
- **L2.** No `<meta name="theme-color">` for mobile browser chrome.
- **L3.** `Organization.logo` is SVG — Google ignores SVG for logo rich result. Provide a 112×112+ PNG at a stable URL.
- **L4.** Consider `Person` schema for blog authors (E-E-A-T signal beyond the author slug).
- **L5.** `/guides` only has 2 entries — hide from navbar until content exists, or ship at least 5 guides.
- **L6.** Add `WebPage` node per doc page with `inLanguage`, `isPartOf`, `primaryImageOfPage`.
- **L7.** `/compliance` index (257 words) does not link to the Comply attestation surfaced in the footer — add it.
- **L8.** Consider Cloudflare fronting for HTTP/3 (QUIC), security-header injection, and tail-latency improvements (APAC/LATAM).
- **L9.** Hreflang emits `en` + `x-default` both pointing to same URL — keep only `x-default` until alternates exist.

---

## Suggested order of operations

**Week 1 (one engineer-day):** C1, C2, C5, H1, H2, H5, H12, H13 — all small diffs in `docusaurus.config.ts` + a few `.mdx` files.

**Week 2:** C3, C4 — requires swizzling blog theme + splitting JSON-LD per route. ~1 day of dev.

**Week 3:** H3, H4, H7, H8, H9, H10, H11 — content work + tag consolidation.

**Week 4:** H6 — Cloudflare fronting + HSTS extension + security headers.

**Month 2:** all Medium items.

---

## Measurement — after fixes ship

Re-run this audit in 4 weeks. Expected target: **85+ / 100**, driven mainly by:
- Schema score: 55 → 85 (adding BlogPosting + BreadcrumbList alone)
- Technical: 82 → 92 (lastmod + security headers + homepage fix)
- Content: 78 → 88 (fixing contradictions, expanding FAQ, consolidating authors/tags)

Monitor in Google Search Console:
- **Indexation** — expect ~225 indexed pages after sitemap cleanup (down from 268, up in quality).
- **Rich results** — Article/BlogPosting eligibility jumps from 0 to 12+ posts.
- **CTR lift** on blog posts once BlogPosting + breadcrumb SERP features render.
