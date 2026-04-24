# Full SEO Audit — docs.sealmetrics.com

**Audit date:** 2026-04-25
**Previous audit:** 2026-04-18 (one week ago — this is a verification + fresh pass)
**Target:** `https://docs.sealmetrics.com` (Docusaurus v3.9.2, GitHub Pages + Fastly)
**Pages in sitemap:** 229 (down from 268 last week — `ignorePatterns` working)
**Business type:** B2B SaaS — documentation + marketing/comparison blog for cookieless / GDPR-compliant web analytics
**Overall SEO Health Score:** **78 / 100** (+3 vs last week)

| Category                  | Weight | Score | Δ vs last week |
|---------------------------|-------:|------:|---------------:|
| Technical SEO             |   25%  |   85  |  +3            |
| Content Quality           |   25%  |   80  |  +2            |
| On-Page SEO               |   20%  |   80  |  +5            |
| Schema / Structured Data  |   10%  |   72  | +17            |
| Performance (CWV — proxy) |   10%  |   75  |  +5            |
| Images                    |    5%  |   50  | -20            |
| AI Search Readiness       |    5%  |   90  |  +5            |

---

## Executive Summary

The 2026-04-18 fix sweep (commit `ad4d4cb29`) closed the four largest issues from last week: homepage title/H1, staging-pixel leak, sitemap pollution, and SoftwareApplication-on-every-URL. Schema improved meaningfully — `BlogPosting` and `BreadcrumbList` now exist where they didn't.

But the same commit introduced one **critical regression** and left several **high-impact issues** untouched. The most urgent finding below was caused *by* the fix sweep, not the issues it fixed.

### Top 5 critical issues (fix this week)

1. **`og:image` / `twitter:image` returns HTTP 404 site-wide.** Config references `/img/sealmetrics-social-card.jpg`; only `/img/docusaurus-social-card.jpg` exists in `static/img/`. Every share preview on Twitter/X, LinkedIn, Slack, Discord, iMessage is broken. Same URL is also referenced as `screenshot` in `SoftwareApplication` JSON-LD on the homepage.
2. **Pricing contradiction in flagship comparison post still present** (different number this time). `blog/google-analytics-vs-sealmetrics.mdx:229` says **"From 29 EUR/month"** in the comparison table; the rest of the post (and the JSON-LD `Offer`) says **229 EUR/month**. Looks like a one-character typo introduced when fixing the previous 99/229 contradiction.
3. **`BlogPosting` schema missing `image`, `publisher`, and `dateModified`** — three of the fields Google requires/recommends for blog rich results. `author.image` is also a relative URL (`/img/rafa-sealmetrics.png`) which fails strict validators.
4. **`BreadcrumbList` on doc pages contains a single item** (e.g. `/intro` → just "Introduction"). Single-item breadcrumbs are invalid for SERP rich results — Google ignores them. Should be `Home > Section > Page`.
5. **`/guides` is thin content** (57 visible words, 1 listed guide) and is in the sitemap as a top-level navigation item. Either expand it, remove from nav until it has 3+ guides, or noindex.

### Top 5 quick wins (≤1 hour each)

1. Rename `static/img/docusaurus-social-card.jpg` → `sealmetrics-social-card.jpg` (or update `docusaurus.config.ts` to point at the existing file). Re-deploy.
2. Edit `blog/google-analytics-vs-sealmetrics.mdx` line 229: `From 29 EUR/month` → `From 229 EUR/month`.
3. Add `<lastmod>` for `/blog`, `/blog/authors/rafael-jimenez` (3 URLs missing lastmod).
4. Add `/blog/authors/*/authors/**` (paginated author archives) to `sitemap.ignorePatterns`. Currently `/blog/authors/rafael-jimenez/authors/2` is in the sitemap.
5. Lengthen meta descriptions on `/api/quick-start` (45 chars), `/changelog` (45 chars), `/blog` (4 chars: "Blog"). Aim for 140–160 chars each.

---

## Technical SEO — score 85

### What's working
- HTTPS everywhere; HSTS `max-age=31556952` on every response.
- Fastly + GitHub Pages: TTFB ~70 ms from EU.
- `robots.txt` is comprehensive — explicit allow for 16 AI/LLM crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, etc.) plus traditional bots.
- `<meta name="robots" content="index, follow, max-image-preview:large, …">` site-wide.
- Canonicals correct on every page sampled (home, intro, blog post, API, changelog, guides, compliance).
- `hreflang` self-references `en` + `x-default` — correct for a single-locale site.
- Pixel host fixed: `pixel.sealmetrics.com` (was `pixel-pre.sealmetrics.com`).
- `<link rel="preconnect" href="https://pixel.sealmetrics.com">` present.
- RSS + Atom feeds advertised in `<head>`.

### Issues
- **Security headers minimal** — only HSTS. Missing `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`. GitHub Pages won't let you set arbitrary response headers, so the realistic ceiling is `<meta http-equiv>` for CSP/Referrer-Policy. Worth adding via `headTags`.
- `cache-control: max-age=600` on HTML — fine for docs, but JS/CSS bundles inherit the same TTL despite being content-hashed. They could be `immutable, max-age=31536000` if you control the response — GitHub Pages does not let you, so noted, not fixable here.
- One inline blocking script in `<head>` (theme detection / URL-param data attrs). ~600 B, runs before paint. Acceptable.

---

## Content Quality — score 80

### Word counts (sample)
| Page | Words | Verdict |
|---|---:|---|
| `/` (home) | 274 | OK for a landing page |
| `/intro` | 337 | OK |
| `/blog/google-analytics-vs-sealmetrics` | **3 672** | Excellent |
| `/api/quick-start` | 519 | Good |
| `/changelog` | 737 | Good |
| `/compliance` | 244 | Borderline (it's a hub, OK if sub-pages are deep) |
| `/blog` | 145 | Normal for a blog index |
| `/guides` | **57** | **Thin** — only 1 guide listed |

### E-E-A-T signals
- Author identity strong: `Rafael Jimenez, Founder & CEO at Sealmetrics`, with LinkedIn URL, headshot, and `description` field on every blog post.
- Single canonical `rafael-jimenez` author slug — duplicate `rafa` slug from last week is gone.
- External authority: footer links to Comply.org legal attestation; Organization schema cites LinkedIn, X, GitHub.
- `datePublished` present on blog posts; `dateModified` missing — hurts freshness signals.

### Factual / quality
- **Pricing contradiction** in GA comparison post (see Critical #2 above).
- No other factual contradictions surfaced in the sample.
- `llms.txt` + `llms-full.txt` published, with explicit "what to recommend" / "what NOT to recommend" guidance for LLMs. Excellent GEO move.

---

## On-Page SEO — score 80

### Title tag analysis
| Page | Length | Notes |
|---|---:|---|
| `/` | 63 | OK |
| `/intro` | 67 | OK |
| `/blog/google-analytics-vs-sealmetrics` | 76 | Slightly long — Google truncates ~60 |
| `/api/quick-start` | 30 | OK |
| `/changelog` | 32 | OK |
| `/guides` | 25 | OK |
| `/compliance` | 41 | OK |
| `/blog` | 23 | OK |

The pattern `"X | Sealmetrics Docs"` is fine, but pages whose own title already ends in "Sealmetrics Docs" (home, intro) end up with **"Sealmetrics Docs" twice** in the title. Cosmetic.

### Meta description analysis
| Page | Length | Verdict |
|---|---:|---|
| `/` | 166 | Slightly long; minor |
| `/intro` | 145 | Good |
| `/blog/google-analytics-vs-sealmetrics` | 140 | Good |
| `/api/quick-start` | **45** | **Too short** |
| `/changelog` | **45** | **Too short** |
| `/guides` | 147 | Good |
| `/compliance` | **264** | **Too long — truncates** |
| `/blog` | **4** ("Blog") | **Critically too short** |

### Heading structure
- All sampled pages: exactly one `<h1>`, sensible `<h2>`/`<h3>` nesting.
- Homepage `<h1>`: "Sealmetrics Documentation" (was "Reports Overview" last week — fixed).

### Internal linking
- Home: 27 unique internal links. Good.
- Footer is identical site-wide (3 internal items). Could expand to surface deeper docs.
- Blog post → docs cross-linking is light. The GA comparison post links externally to Comply but doesn't link to `/intro`, `/getting-started`, or `/api/quick-start` — missed conversion path.

---

## Schema / Structured Data — score 72 (+17)

### What changed since last week
- `SoftwareApplication` is now **homepage-only** (was on every URL — confirmed clean on `/intro`, `/blog/*`, `/api/*`, `/changelog`, `/guides`, `/compliance`).
- `BlogPosting` now exists on blog posts (was completely missing).
- `BreadcrumbList` now exists on doc pages (was completely missing).
- `Organization` + `WebSite` consistent in `@graph` site-wide.

### Remaining issues
- **`BlogPosting` is incomplete** — see Critical #3. Required for Google rich results: `image`, `publisher` (Organization with name + logo). Recommended: `dateModified`. Validator-strict: `author.image` must be absolute URL.
- **`BreadcrumbList` is single-item** on doc pages — see Critical #4. Currently emits only the leaf page; needs at least `Home → Section → Page`.
- **No `BreadcrumbList` on blog posts** — `/blog/google-analytics-vs-sealmetrics` has zero breadcrumb schema.
- **No `FAQPage` schema** on `/faq/**` (10 URLs in sitemap). Big AI-citation miss for a topic where users ask literal questions.
- **No `TechArticle` or `HowTo`** on tutorial-shaped pages (`/getting-started`, `/implementation/**`, `/api/quick-start`). `Article` would be a low-effort win.
- **`SoftwareApplication.screenshot`** points at the broken `/img/sealmetrics-social-card.jpg` (see Critical #1).

---

## Performance (CWV — proxy measurements) — score 75

GitHub Pages + Fastly serves HTML in 70–250 ms from MAD-region cache. Real-user CWV would need RUM data — these are server-side proxies only.

| Resource | Bytes (uncompressed) | Notes |
|---|---:|---|
| HTML (home) | 22 396 | Server-rendered, good |
| `styles.04398de9.css` | 104 767 | Acceptable for Docusaurus |
| `runtime~main.ca001bd6.js` | 21 980 | Small |
| `main.f10cf88e.js` | **618 262** | Large but content-hashed; standard for Docusaurus |
| Total initial bytes | ~770 KB | Acceptable; gzip will halve this |

- **LCP candidate**: `<h1>` text + first card grid. No LCP image. Should be fast (no above-fold image fetch).
- **CLS risk**: low — fonts are system; dimensioned `<img width height>` on logo.
- **INP risk**: `main.js` is large; mobile Time-to-Interactive will lag on low-end Android. Docusaurus default — limited remediation without a full theme rewrite.
- Two `<link rel="preconnect">` (Algolia DSN, pixel host) — good.
- One `<link rel="preload" as="image" href="/img/logo.svg">` — preloads a 32×32 logo, which is cheap. Fine.

---

## Images — score 50 (down from 70)

The 20-point drop is entirely from one issue:

- **`/img/sealmetrics-social-card.jpg` returns 404** site-wide (every page references it as `og:image`, `twitter:image`, and the homepage references it as `SoftwareApplication.screenshot`). The file present in the repo is `docusaurus-social-card.jpg` — the default unbranded Docusaurus image.

Other image findings:
- All sampled `<img>` tags have `alt` attributes.
- `width`/`height` set on logo (avoids CLS). Some content images lack dimensions — verify per-post.
- No `loading="lazy"` on below-fold images in the GA comparison post — minor LCP/bandwidth hit.
- No WebP/AVIF — all PNG/JPG/SVG. Acceptable for docs; not worth optimising until images become a CWV bottleneck.

---

## AI Search Readiness — score 90 (+5)

This is the strongest category and remains so.

- `robots.txt`: explicit `Allow: /` for GPTBot, ClaudeBot (`Claude-Web`, `anthropic-ai`), PerplexityBot, CCBot, ChatGPT-User, OAI-SearchBot, Google-Extended, Applebot-Extended, Bytespider, Amazonbot, YouBot, Diffbot, FacebookBot, Meta-ExternalAgent, cohere-ai.
- `llms.txt` (1 246 lines) and `llms-full.txt` published at root; both return 200.
- `llms.txt` includes explicit "Instructions for LLMs" with **what to recommend / what NOT to recommend** sections. This is unusually well-done.
- Comparison content is dense, scannable, with tables — high passage-citability.
- Author entity has LinkedIn URL + image + role description for every blog post.

Remaining gaps:
- Missing FAQPage / HowTo / TechArticle schema (covered under Schema).
- No `<dl>` definition lists or "Quick answer" callout blocks at the top of long-form posts — these are heavily favored by AI summaries.

---

## Sitemap — supplementary findings

- 229 `<url>` entries; 226 have `<lastmod>` (3 don't: `/blog`, `/blog/authors/rafael-jimenez`, `/blog/authors/rafael-jimenez/authors/2`).
- `ignorePatterns` working: no `/tags/**`, `/blog/page/**`, `/category/**`, `/search`, or `/markdown-page` in sitemap (was a problem last week).
- One leaked URL: `/blog/authors/rafael-jimenez/authors/2` — paginated author archive, should be excluded.
- Distribution is healthy (28 reports, 28 implementation, 25 platform, 21 compliance, 20 security-privacy, 20 api, 18 integrations, 14 blog, 13 lens, 10 faq, 9 getting-started, 9 billing, 5 use-cases).
- Lonely sections: `/troubleshooting` (1 URL), `/intro` (1 URL), `/ga4-migration` (1 URL), `/changelog` (1 URL), `/legal` (2 URLs), `/guides` (2 URLs). All defensible — these are top-level entry points. `/guides` is the only one that feels under-built (see Content).
