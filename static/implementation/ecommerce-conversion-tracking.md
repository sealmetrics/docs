---
title: "E-commerce Conversion Tracking"
description: "Set up e-commerce conversion tracking in Sealmetrics: purchase and revenue tracking, event properties, and ERP/CRM reconciliation — no cookie consent."
canonical_url: "https://docs.sealmetrics.com/implementation/ecommerce-conversion-tracking"
lang: "en"
date_generated: "2026-08-27T14:18:06.639Z"
source_hash: "78dbbeab6b074449a92cf63f6f1686eb297f9cff6c1da85c9093b4d7458bcfad"
content_type: "implementation"
owner: "engineering"
llm_priority: "critical"
source_file: "implementation/ecommerce-conversion-tracking/index.mdx"
publisher: "Sealmetrics"
---

# E-commerce Conversion Tracking

Canonical page: https://docs.sealmetrics.com/implementation/ecommerce-conversion-tracking

Complete guide for tracking e-commerce conversions with Sealmetrics. This section provides everything you need to measure sales, revenue, and shopping behavior on your online store.

Proper e-commerce tracking enables you to calculate accurate ROI, understand which marketing channels drive sales, and optimize your conversion funnel. Learn how to implement purchase tracking, send transaction data with custom properties, and measure the complete customer journey from first click to final sale without requiring cookie consent.

## Available Guides

- [E-commerce Setup Guide](/implementation/ecommerce-conversion-tracking/ecommerce-setup-guide) - Step-by-step instructions for implementing purchase and revenue tracking
- [Event Properties Guide](/implementation/ecommerce-conversion-tracking/event-properties) - Learn which data fields to send with conversion events for maximum insight

## Reconciling Against Your ERP / CRM

If Sealmetrics shows substantially fewer conversions than your ERP, CRM, or internal database, the cause is almost always the same: the **base pixel must fire and register the pageview before `sealmetrics.conv(...)` is called** on the confirmation page. See [Conversions Don't Match Your ERP, CRM, or Database](/troubleshooting/erp-crm-database-discrepancy) for the full diagnostic — firing order, off-domain confirmation pages, payment methods that skip the thank-you page, and the rest of the secondary causes.
