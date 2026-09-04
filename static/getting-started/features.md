---
title: "Features"
description: "Explore the complete feature set of Sealmetrics - from core analytics reports to API access, conversion tracking, and privacy-first capabilities."
canonical_url: "https://docs.sealmetrics.com/getting-started/features"
lang: "en"
date_generated: "2026-09-04T00:07:24.876Z"
source_hash: "4ed53b00358574537bd12df817ade57146c162f1f8cfc18935052476e776597f"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "getting-started/features.mdx"
publisher: "Sealmetrics"
---

# Features

Canonical page: https://docs.sealmetrics.com/getting-started/features

Sealmetrics is a consentless analytics platform whose feature set covers core reports (Overview, Evolution, Pages, Sources, Geography, Devices, Conversions, Properties, Funnel), conversion and e-commerce tracking, custom event tracking, UTM attribution, a full REST API with CSV export, and 24 months of data retention. Every feature works cookielessly, requires no consent banner, and runs on EU-only infrastructure in Dublin, Ireland.

## Which reports are included?

### Dashboard Overview
Your command center for instant insights. See pageviews, sessions, conversions, and revenue at a glance. Compare current performance against the previous 30 days automatically. Filter by date range, traffic source, or campaign with one click.

### Acquisition Analysis
Understand exactly where your traffic comes from and which channels drive results. Track performance across:

- **Organic Search** - SEO traffic from Google, Bing, and other search engines
- **Paid Search** - Google Ads and other PPC campaigns
- **Social Media** - Facebook, Instagram, LinkedIn, Twitter, and more
- **Referral Traffic** - Links from other websites
- **Direct Visits** - Bookmarks and direct URL entries
- **Email Campaigns** - Newsletter and email marketing performance
- **Display Advertising** - Banner ads and retargeting campaigns

Every source is automatically categorized. Use UTM parameters for granular campaign tracking and attribution.

### Evolution
Track performance over time with the Evolution report. See which campaigns, channels, and sources generate revenue and which ones drain your budget. Make data-driven decisions about where to invest your marketing dollars.

### Funnel Analysis
Visualize the e-commerce customer journey with the Funnel report. It follows a fixed sequence of steps:

1. Entrances
2. View Product
3. Add To Cart
4. Begin Checkout
5. Purchase

Instrument the intermediate steps as microconversions (`sealmetrics.micro('add_to_cart')`, etc.) and the report fills in automatically. See drop-off rates between each stage, and filter by country with the selector at the top right.

### Page Performance
Deep insights into how individual pages perform:

- **Page Views** - Traffic to each URL
- **Entry Pages** - Where sessions start
- **Engagement Metrics** - Bounce rate, engagement rate and pages per session, all computed in aggregate

Identify your highest-performing content and optimize underperforming pages.

### Fast Data Pipeline
Your data arrives in seconds, not hours. Hits flow from the pixel to your reports almost instantly, and the **Last hit** timestamp on the Overview report shows exactly when the most recent hit was received. Perfect for verifying tracking implementation or monitoring campaign launches.

## Conversion Tracking

### Conversion Instrumentation
Track unlimited conversion types with a single JavaScript call — no dashboard configuration required. Call `sealmetrics.conv('type', amount)` wherever a goal completes:

- **Purchases** - Thank-you and confirmation pages
- **Leads and signups** - Form submissions
- **Custom conversions** - Any goal you want to measure

Each conversion type tracks:
- Conversion count
- Conversion rate
- Revenue attribution (optional)
- Source attribution

### E-commerce Tracking
Full-featured e-commerce analytics for online stores:

- **Purchase Tracking** - Revenue, order value, transaction counts
- **Add to Cart Events** - Shopping intent measurement
- **Checkout Initiation** - Funnel entry point tracking
- **Product Performance** - Individual SKU analysis
- **Revenue Attribution** - Channel-level ROI calculation

Measure the complete customer journey from first visit to completed purchase.

### Micro-conversions
Track partial conversion events that indicate intent:

- Form field completion (not full submission)
- Video engagement milestones
- Scroll depth tracking
- Time-on-page thresholds
- Content downloads
- Newsletter signups

Understand user engagement beyond final conversions.

## Event Tracking System

Measure any interaction on your website with custom event tracking:

### Supported Event Types
- **Click Events** - Buttons, links, CTAs, navigation items
- **Scroll Events** - Content engagement depth
- **Form Interactions** - Field focus, completion, validation errors
- **Video Tracking** - Play, pause, completion percentage
- **File Downloads** - PDFs, documents, resources
- **Outbound Links** - External site clicks
- **Custom Actions** - Any JavaScript-triggered event

### Event Properties
Enrich events with custom data:
- Revenue values
- Product categories
- User segments
- Campaign IDs
- Custom dimensions

All without collecting personal information.

## Attribution & Campaign Tracking

### UTM Parameter Support
Full support for standard UTM tagging:
- `utm_source` - Traffic source identification
- `utm_medium` - Marketing medium (email, social, cpc)
- `utm_campaign` - Campaign naming
- `utm_term` - Keyword tracking
- `utm_content` - A/B test variation tracking

### Last-Click Attribution
Conversions are attributed to the final traffic source before conversion. This industry-standard model gives you clear ROI data for each marketing channel without requiring user-level tracking.

### Channel-Level Revenue Attribution
See exactly how much revenue each channel generates. Make informed budget allocation decisions based on actual performance, not incomplete data.

## Technical Capabilities

### Device & Browser Intelligence
Understand your audience's technical profile:

- **Browser Type** - Chrome, Safari, Firefox, Edge, etc.
- **Operating System** - Windows, macOS, iOS, Android, Linux
- **Device Category** - Desktop, mobile, tablet
- **Screen Sizes** - Resolution and viewport data
- **Language Settings** - Preferred languages

All detected from user agent strings without storing personal information.

### Geographic Insights
Country-level visitor attribution derived from time zone data, not IP addresses. Know where your audience is located without privacy risks.

### Session Analytics
- Pages per session tracking
- Bounce rate and engagement rate, computed in aggregate

Session duration and individual navigation paths are **not** measured: both require following one visitor across page loads, which needs a persistent identifier. See the [Metrics Reference](/reports/definitions) for what is and isn't tracked.

Sessions are identified by a temporary, non-persistent marker derived from the browser context — nothing is stored in cookies or local storage. A session ends after roughly two hours of inactivity, and Sealmetrics never recognizes visitors across sessions: separate visits can never be linked together.

## Data Access & Export

### API Access
Full REST API with bearer token authentication. Access all your analytics data programmatically:

- Traffic and source data
- Page performance metrics
- Conversion statistics
- Funnel analysis results

Automate reporting, or integrate with your existing tools.

### CSV & PDF Export
Export any report to CSV or PDF format for offline analysis, custom reporting, or presentation building.

### Data Retention
24 months of historical data without requiring user consent. Analyze long-term trends and year-over-year performance.

## What makes Sealmetrics privacy-first? {#privacy-first-features}

### Cookieless by Design
No cookies, no local storage, no fingerprinting. Zero impact on page speed from privacy scripts.

### No Consent Required
Skip the banner. Keep 100% of your data. Stay compliant with all major privacy regulations.

### Ad Blocker Resistant
First-party tracking means ad blockers don't interfere. Measure all your traffic, not just the users who allow tracking.

### EU-Only Infrastructure
All data processed and stored in Dublin, Ireland. No international transfers. Full GDPR compliance by design.

## Framework & Platform Support

### Single Page Applications
Full support for React, Vue, Angular, and other SPAs. Track route changes as page views automatically.

### AJAX Form Tracking
Capture form submissions that don't trigger page loads. Perfect for modern web applications.

### WordPress Plugin
Native WordPress integration. Install and configure in minutes without touching code.

### Google Tag Manager
Deploy via GTM for centralized tag management and easy configuration updates.

### Universal Compatibility
Works with any website framework or CMS. Just add the tracking script and start measuring.

## Performance & Reliability

### Lightweight Script
Minimal performance impact. Asynchronous loading means tracking never blocks page rendering.

### CDN Delivery
Global content delivery for fast script loading regardless of visitor location.

### Automatic Scaling
Infrastructure scales automatically with your traffic. Handle traffic spikes without configuration changes.

### Bot Filtering
Sophisticated bot detection removes scrapers, search engine crawlers, and monitoring tools. Only see real human visitors.

### AI & Agent Traffic Analytics *(not available yet)*
Classifying sessions as human or AI-agent traffic is designed but **not live**, and cannot be enabled on any account today. What does run is the bot filtering above. See [Bot & Agent Detection](/security-privacy/bot-detection) for the current state.

(Not to be confused with the [Agentic Package](/integrations/agentic-package), which *is* available — it lets an AI assistant create your account and query your analytics from a chat.)

## Account Management

### Multi-Domain Support
Track multiple websites under one account. Each domain gets its own tracking ID and isolated data.

### Subdomain Tracking
Automatically track across subdomains. Sessions continue seamlessly as users navigate your entire domain.

### Team Collaboration
Add team members with role-based access controls. Share insights while maintaining security.

### Usage Transparency
Clear visibility into your event consumption. No overage charges — if you consistently exceed your limit, you'll be automatically upgraded to the next tier.

---

**Every feature. Zero tracking. Full compliance.**

Sealmetrics proves you don't need to compromise between analytics and privacy. Get complete data, powerful insights, and peace of mind—all in one platform.

Ready to measure your traffic the right way? Start your free trial today.

**Note:**
- Nine core reports (Overview, Evolution, Pages, Sources, Geography, Devices, Conversions, Properties, Funnel) plus conversion, e-commerce and custom event tracking with last-click UTM attribution.
- Full REST API with bearer token authentication, CSV/PDF export and 24 months of data retention; WordPress plugin, GTM and SPA support.
- Cookieless by design with no consent banner; session duration and unique visitors are not measured; all data is processed in Dublin, Ireland. AI-agent classification is designed but not live.

## Related documentation

- [First Steps with Sealmetrics](/getting-started/quick-start) — set up your account and start seeing data
- [Installation](/implementation/tracker/installation) — add the tracking script to your site
- [How to Measure Conversions](/getting-started/measure-conversions) — put conversion and e-commerce tracking to work
- [Overview Report](/reports/overview) — where the dashboard metrics described above appear
- [API Overview](/api) — access every feature programmatically over REST
