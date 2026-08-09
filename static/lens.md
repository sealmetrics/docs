---
title: "LENS AI Overview"
description: "The natural-language assistant for your analytics data — ask questions, build reports. Automated detection rules are on the roadmap."
canonical_url: "https://docs.sealmetrics.com/lens"
lang: "en"
date_generated: "2026-08-09T18:18:16.203Z"
source_hash: "627b979850d1c91564475c3e0b8801f25de94362c8263216209c531ee313e474"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "lens/index.mdx"
publisher: "SealMetrics"
---

# LENS AI Overview

Canonical page: https://docs.sealmetrics.com/lens

LENS is Sealmetrics' AI layer. Today it does two things: it lets you **ask questions about your data in natural language**, and it turns those answers into **reports** you can schedule and share.

**Caution:**
The rule-based detection library described on these pages is **built but not active**. No detection rule currently runs on customer accounts, and no automated anomaly alert is generated. The catalog below documents the planned library and the categories it is organised into; treat it as roadmap, not as shipped behaviour. What is live today is LENS chat and LENS reports.

## What is LENS?

LENS (Learning Engine for Notifications & Signals) puts a large language model on top of your full-resolution data so you can:

- **Understand your data faster** — ask questions in natural language and get answers grounded in your own numbers
- **Build and share reports** — turn any answer into a report, on demand or on a schedule
- **(Planned) Detect problems automatically** — rule-based detection of traffic drops, conversion changes and tracking breaks is built but not yet active on accounts

## Key Components

### Insight Detection

LENS has a rule library for automated insight detection. **No rule is active today** — the library is documented here because it defines the categories and signals we will ship, and because the API surface already reflects them.

The planned rules are organized into **11 categories**, which will be available on every plan:

| Category | What it covers |
|----------|----------------|
| Critical Alerts | Issues requiring immediate attention |
| Business Monitoring | General business health tracking |
| Risk Management | Structural business risks (e.g. source concentration) |
| Autopilot Checks | Automated monitoring and tracking-health tasks |
| Instant Wins | Immediate value from day 1 |
| Forecasting & Prediction | AI-powered predictions |
| Growth & Revenue Upside | Direct growth opportunities |
| E-commerce Performance | Product & catalog insights |
| User Experience & Funnel | UX frictions & behavior |
| Multi-site & Portfolio | Multi-web management |
| Reporting | Executive summaries |

LENS produces five types of insight: **anomaly**, **opportunity**, **trend**, **alert**, and **health** (tracking/system status).

[Learn more about anomaly detection →](/lens/anomaly-detection)

### AI Assistant

Ask LENS questions about your data in natural language:

- *"Why did conversions drop last week?"*
- *"Which campaigns are performing best this month?"*
- *"Compare traffic from Google vs Facebook"*

The assistant supports two provider modes: **[Seal AI Private](/billing/seal-ai-private)** (the managed EU platform LLM, no key required — usage counts against your org's monthly 5M-token quota plus any purchased packs) and **bring-your-own-key (BYOK)** with Anthropic (`claude-3-5-haiku` / `claude-sonnet-4` / `claude-opus-4`), OpenAI (`gpt-4o-mini` / `gpt-4o`), DeepSeek (`deepseek-chat`), or Google Gemini (`gemini-2.5-flash` / `gemini-2.5-pro`). BYOK has no quota — you pay your provider directly. LENS picks the appropriate model automatically based on task complexity.

[Learn more about the AI assistant →](/lens/ai-assistant)

### Insight Delivery

Receive proactive insights without lifting a finger:

- **In-app insights** - New insights appear in the LENS dashboard as they're detected
- **Email summaries** - Key metrics, trends, and recommendations delivered to your inbox

Email is currently the only delivery channel for LENS notifications.

## Availability by Plan

LENS AI (chat + insights) is included in every paid plan — **Growth, Scale, and Enterprise** — and all LENS insight categories are available on every tier. Plans differ in how the AI is powered:

| Plan | BYOK (your own key) | [Seal AI Private](/billing/seal-ai-private) (managed, EU) |
|------|---------------------|------------------------------------------------------------|
| Free | — | Not available |
| Growth | Yes, unmetered | Available as a paid add-on |
| Scale | Yes, unmetered | **Included** (5M tokens/month) |
| Enterprise | Yes, unmetered | **Included** (5M tokens/month) |

**BYOK is free from Sealmetrics** — no add-on fee, no per-plan cap on questions, no token quota. You pay only your own LLM provider for what you use. The [Seal AI Private](/billing/seal-ai-private) pricing applies only if you opt for the managed EU provider instead of your own key; its usage draws from the monthly token quota (plus optional non-expiring packs).

## Getting Started
