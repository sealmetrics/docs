# SEO Action Plan — docs.sealmetrics.com

**Audit date:** 2026-04-25
**Target:** `https://docs.sealmetrics.com`
**Pages crawled:** 229 (sitemap, 100% coverage)
**Overall SEO Health Score:** **78 / 100** (+3 vs 2026-04-18)

> The 2026-04-18 fix sweep closed the four largest issues (homepage title/H1, staging-pixel leak, sitemap pollution, SoftwareApplication everywhere). This plan focuses on (a) one critical regression caused *by* that sweep and (b) issues that survived it.

---

## Critical — STATUS

| ID | Issue | Status | Fix |
|---|---|---|---|
| C1 | og:image 404 | ✅ FIXED | Renamed `docusaurus-social-card.jpg` → `sealmetrics-social-card.jpg` |
| C2 | Pricing typo (29 vs 229 EUR) | ✅ FIXED | `blog/google-analytics-vs-sealmetrics.mdx:229` |
| C3 | BlogPosting incomplete | ✅ FIXED | Swizzled `theme/BlogPostPage/StructuredData` (adds `image`, `publisher`, absolutizes `author.image`); enabled `showLastUpdateTime: true` for blog (gives `dateModified`); absolute author image in `authors.yml` |
| C4 | Single-item BreadcrumbList | ✅ FIXED | Swizzled `theme/DocBreadcrumbs/StructuredData` to prepend `Home` (now ≥2 items per page) |
| C5 | `/guides` thin content | ✅ FIXED | `noindex, follow` via `<Head>` in `docs/guides/index.mdx`; excluded `/guides` from sitemap |
| H4 (partial) | `authors/*/authors/2` in sitemap | ✅ FIXED | Added to `sitemap.ignorePatterns` |

Sitemap dropped from 229 → 227 URLs (removed `/guides` + paginated author archive). Two hub URLs (`/blog`, `/blog/authors/rafael-jimenez`) still lack `<lastmod>` — Docusaurus limitation for index/list pages.

---

## Critical — fix this week

### C1. `og:image` returns 404 site-wide
- **Where:** every page has `<meta property="og:image" content="https://docs.sealmetrics.com/img/sealmetrics-social-card.jpg">` and the same URL in `twitter:image` and in `SoftwareApplication.screenshot` on the homepage. The file at that URL returns **HTTP 404**. The actual file in `static/img/` is `docusaurus-social-card.jpg` (unbranded default).
- **Impact:** Every share preview on Twitter/X, LinkedIn, Slack, Discord, iMessage, WhatsApp shows a broken image. Schema validators flag the broken `screenshot` URL on the homepage.
- **Fix (1 of 2):**
  - Quick: rename `static/img/docusaurus-social-card.jpg` → `static/img/sealmetrics-social-card.jpg` and commit. (1 min — but you'll be sharing the unbranded Docusaurus illustration.)
  - Better: design a 1200×630 branded card and save as `static/img/sealmetrics-social-card.jpg`.
- **Files:** `static/img/`, possibly `docusaurus.config.ts` (`themeConfig.image`)

### C2. Pricing typo in flagship comparison post
- **Where:** `blog/google-analytics-vs-sealmetrics.mdx:229` — `| Paid Plans | Google Analytics 360: $50K+/yr | From 29 EUR/month |`
- **Conflict:** every other pricing reference in the same post says **229 EUR/month** (lines 311, 330, 374, 603 and the JSON-LD `Offer` at line 440). Looks like a one-character drop introduced when fixing last week's 99/229 contradiction.
- **Impact:** Users see a price 10× lower than reality in a comparison table. AI engines that scrape this post will cite "29 EUR/month" as the Sealmetrics starting price.
- **Fix:** change `From 29 EUR/month` → `From 229 EUR/month` on line 229.
- **File:** `blog/google-analytics-vs-sealmetrics.mdx`

### C3. `BlogPosting` schema missing required fields
- **Where:** `/blog/**` — emitted JSON-LD for `BlogPosting` lacks `image`, `publisher`, `dateModified`. `author.image` is a relative URL (`/img/rafa-sealmetrics.png`).
- **Impact:** Google rich results require `image` and `publisher` (Organization with name + logo). Validators (Schema.org, Google Rich Results Test) flag this. AI engines also use these fields for source attribution.
- **Fix:** in the Docusaurus blog theme override (or the plugin emitting this JSON-LD — check `src/theme/` or wherever `BlogPosting` is generated), add:
  ```json
  "image": "https://docs.sealmetrics.com/img/<post-cover-or-social-card>.jpg",
  "publisher": { "@id": "https://sealmetrics.com/#organization" },
  "dateModified": "<frontmatter last_update or git mtime>"
  ```
  And make `author.image` an absolute URL: `https://docs.sealmetrics.com/img/rafa-sealmetrics.png`.
- **Files:** the blog `BlogPosting` schema generator (search the repo for `BlogPosting`)

### C4. `BreadcrumbList` on doc pages is single-item
- **Where:** `/intro`, `/api/quick-start`, and other doc pages emit a `BreadcrumbList` with one `ListItem` only ("Introduction", "Quick Start", etc.).
- **Impact:** Google ignores single-item breadcrumbs; they don't appear in SERPs and waste schema budget. You get the cost without the rich-result benefit.
- **Fix:** generator should emit `Home → <Section> → <Page>` (or at minimum `Home → <Page>`). For `/intro`: 2 items. For `/api/quick-start`: 3 items (Home → API → Quick Start).
- **File:** the breadcrumb schema generator (search repo for `BreadcrumbList`)

### C5. `/guides` is thin content
- **Where:** `https://docs.sealmetrics.com/guides`
- **Body:** 57 visible words, 1 listed guide (`/guides/cookieless-analytics`).
- **Impact:** Thin-content signal on a page that's in the navbar AND sitemap as a top-level entry point. Risks site quality demotion.
- **Fix (pick one):**
  - (a) Add 2–3 more guides this month, then keep the page.
  - (b) Hide from navbar, remove from sitemap, redirect `/guides` → `/guides/cookieless-analytics` until you have ≥3 guides.
  - (c) Add `<meta name="robots" content="noindex, follow">` until expanded.

---

## High — fix within 1 week

### H1. Add `BreadcrumbList` on blog posts
- Currently no breadcrumb schema on `/blog/**`. Add `Home → Blog → <Post Title>`.

### H2. Add `FAQPage` schema to `/faq/**`
- 10 URLs under `/faq/` in the sitemap. `FAQPage` schema is one of the highest-leverage AI-citation wins for question-shaped content. Cost: a few lines of generated JSON-LD per page.

### H3. Lengthen meta descriptions
- `/blog`: currently `"Blog"` (4 chars). Write a real 140–160 char description.
- `/api/quick-start`: 45 chars. Expand.
- `/changelog`: 45 chars. Expand.
- `/compliance`: 264 chars — truncate to ≤160.

### H4. Fix sitemap residuals
- Add `/blog/authors/*/authors/**` to `sitemap.ignorePatterns` to remove `/blog/authors/rafael-jimenez/authors/2`.
- Investigate why `/blog`, `/blog/authors/rafael-jimenez`, and the above paginated archive lack `<lastmod>` — likely the `lastmod: 'date'` config isn't applied to author/blog index pages.

### H5. Internal-link the GA comparison post
- 3 672-word post linking externally to Comply but not internally to `/intro`, `/getting-started`, `/api/quick-start`, or `/compliance`. Add 4–6 contextual internal links to surface the conversion path.

---

## Medium — fix within 1 month

### M1. Add `TechArticle` or `Article` schema to long-form docs
- `/getting-started`, `/implementation/**`, `/api/quick-start` are tutorial-shaped and would benefit from `TechArticle`. Same generator pattern as `BlogPosting`.

### M2. Add a "Quick answer" callout to every blog post
- 1–2 sentence TL;DR at the top, ideally in a `<blockquote>` or labelled callout. Heavily favored by AI search summaries (Perplexity, ChatGPT web, Google AI Overviews).

### M3. Add CSP / Referrer-Policy / Permissions-Policy via meta
- GitHub Pages doesn't support arbitrary response headers, but you can add `<meta http-equiv="Content-Security-Policy">` and `<meta name="referrer">` via `headTags` in `docusaurus.config.ts`. Start permissive, tighten over time.

### M4. Fix double "Sealmetrics Docs" in titles
- Pages whose own frontmatter title ends in "Sealmetrics Docs" (e.g. home, intro) render `"Sealmetrics Docs — X | Sealmetrics Docs"`. Strip the suffix in those frontmatters, or change the title template to omit it when the page title already contains it.

### M5. Lazy-load images in long blog posts
- Add `loading="lazy"` to below-fold images in posts >1 500 words.

---

## Low — backlog

- **L1.** Real branded `sealmetrics-social-card.jpg` if C1 was solved by renaming the Docusaurus default.
- **L2.** Generate WebP/AVIF variants of large screenshots in `static/img/` if any specific page becomes a CWV bottleneck.
- **L3.** Expand the footer with 6–10 deep-link items (top reports, top integrations) to spread internal link equity.
- **L4.** Consider a JSON-LD `ItemList` on `/blog` and on hub pages like `/reports` to expose post/page lists to crawlers more explicitly.
- **L5.** `dateModified` on every doc page (Docusaurus has `showLastUpdateTime` — currently `false`). Turning it on would also feed `dateModified` into schema if you wire it through.

---

## Score tracking

| Date | Score | Notes |
|---|---:|---|
| 2026-04-18 | 75 | First audit, 268 sitemap URLs |
| 2026-04-25 | **78** | Sitemap cleaned, schema added, pixel fixed, og:image regression, pricing typo |
| Target after Critical fixes | ~85 | C1–C5 closed |
| Target after High fixes | ~90 | + FAQ/breadcrumb schema, meta descriptions |
