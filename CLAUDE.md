# SealMetrics Documentation

Docusaurus 3 site published at `docs.sealmetrics.com`. Docs live in `docs/`, blog posts in `blog/`, navigation in `sidebars.ts`.

This is reference documentation read during customer security reviews and vendor due diligence. A wrong factual claim here is not a typo — it is something a DPO or procurement team will rely on. Accuracy outranks completeness, and outranks how good a claim sounds.

## Claims that must never appear

- **NEVER claim ISO 27001, SOC 2, or any third-party security certification** — SealMetrics holds none. Not "in progress", not "planned", not "SOC 2 compliant infrastructure". If compliance needs describing, the true framing is: GDPR by architecture, ePrivacy, Schrems II clean, EU-hosted in Dublin, DPA included, TPSR package for vendor reviews.
- **NEVER say a supervisory authority has certified, approved, or validated SealMetrics.** No such certification scheme exists for analytics tools in France (CNIL), Italy (Garante), Germany (DSK/BfDI/Landesdatenschutzbehörden), Switzerland (FDPIC), or the UK (ICO). The pages under `docs/compliance/` are *self-assessments* and each carries a disclaimer saying so — keep it when editing them.
- **The data centre for customer analytics data is Dublin, Ireland only** — never Frankfurt, never Germany. One deliberate exception, not a contradiction: Seal AI Private processes LLM prompts in **Paris**, which is a separate service and is correct as documented — do not "fix" it to Dublin.
- **The customer-data subprocessor list is Cloudflare only** (CDN/DDoS at the edge). Hetzner runs internal company workloads and touches no customer analytics data — do not reintroduce it as a subprocessor.
- **LENS AI is free with BYOK; only Seal AI Private is paid.** Never imply LENS itself costs money — it is included in every paid plan, and running it on the customer's own LLM key carries no SealMetrics charge, no quota and no packs. **Seal AI Private** (shipped July 2026) is the optional managed alternative: SealMetrics' own EU-hosted LLM, no API key needed, 5M tokens/month, an add-on on Growth (€299/month annual, €358.80/month monthly), included in Scale and Enterprise, with top-up packs at €358.80 per 5M tokens. What never existed is the *older* metered model — per-plan question quotas (1,000/2,000 a month) and €99/500-question packs. Do not reintroduce those.

A certification held by a *vendor* may be stated as that vendor's (e.g. Stripe is PCI DSS Level 1; Anthropic is SOC 2 Type II). Never let a vendor's certification read as SealMetrics'.

When a true claim would be weaker than the reader hopes, say the weaker true thing. Stating "we are not certified" outright is preferred over silence on pages used in due diligence — the marketing site already does this, and the docs should not contradict it.

## Verifying claims

Automated checkers exist for the two areas where docs previously drifted from reality. Run them after touching API or dashboard-UI documentation:

```bash
npm run check:api-contract && npm run check:ui-claims
```

- `check:api-contract` — every endpoint documented under `docs/api/` and `docs/lens/api/` must exist in `scripts/openapi-snapshot.json`.
- `check:ui-claims` — every dashboard route and Site Settings tab cited in docs must exist in `scripts/ui-manifest.json`.

Both refuse to invent: if a doc describes something the product does not have, they exit 1. Compliance claims have no such checker, which is exactly why the rules above are written down.

## Generated files

`static/llms.txt`, `static/llms-full.txt` and `static/docs-raw/**` are generated from `docs/` and `blog/`. After editing any doc or blog content:

```bash
npm run generate:llms
```

Commit the regenerated output alongside the source change. Two known behaviours:

- The raw mirrors are never purged, so files for deleted docs linger until noticed. Regenerating may flush drift from earlier commits that skipped this step — that is a catch-up, not a regression.
- An unclosed code fence in a `.mdx` file silently truncates that page in the generated output. If a page looks short in `llms-full.txt`, check its fences.

`prebuild` runs the FAQ schema, blog TL;DR injection and llms generation, so `npm run build` regenerates them too.

## Search

Algolia relevance depends on frontmatter. Every doc needs a `description` (used as the search snippet) and meaningful `tags` / `keywords`. Troubleshooting pages should lead with the symptom the user would type, not the internal cause.
