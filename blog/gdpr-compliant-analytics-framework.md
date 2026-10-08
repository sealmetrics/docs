---
title: "GDPR Compliant Analytics: Complete Framework 2026"
description: "GDPR framework for web analytics: which legal basis you actually need, the technical requirements, and how to stop losing the visitors who reject or ignore the cookie banner."
canonical_url: "https://docs.sealmetrics.com/blog/gdpr-compliant-analytics-framework"
lang: "en"
date_generated: "2026-10-08T17:05:41.082Z"
source_hash: "004d77d18bc225ed34860a9ddf6776efaf5f1838d68f86a77d9c8b86e445dec3"
content_type: "blog"
owner: "content"
llm_priority: "useful"
source_file: "gdpr-compliant-analytics-framework.mdx"
publisher: "Sealmetrics"
---

# GDPR Compliant Analytics: Complete Framework 2026

Canonical page: https://docs.sealmetrics.com/blog/gdpr-compliant-analytics-framework

<!-- AUTO-TLDR:START -->
> **TL;DR** — GDPR framework for web analytics: which legal basis you actually need, the technical requirements, and how to stop losing the visitors who reject or ignore the cookie banner.
<!-- AUTO-TLDR:END -->

The European Union issued over €20 million in fines for analytics violations in 2023, yet most companies still don't understand what makes their analytics GDPR compliant. Many businesses either accept massive data loss from cookie consent requirements or operate in a gray area of regulatory uncertainty.

This comprehensive framework explains exactly what GDPR compliance requires for web analytics, which legal bases work, and how to implement compliant tracking without losing visitor data.

**Key Takeaways**:
- Consent-based analytics loses the visitors who reject or ignore the cookie banner; the strongest position is minimising the data so far that no banner is needed
- Most analytics tools fail GDPR because they store IP addresses or require cookies
- Sealmetrics stores nothing on the device and no data that identifies anyone; its session identifier rotates daily and, once rotated, not even Sealmetrics can reconstruct it, and reports are always aggregated
- Country-specific regulations (TDDDG, CNIL) have additional requirements beyond baseline GDPR

## What Makes Analytics GDPR Compliant?

GDPR compliance for web analytics rests on three fundamental pillars established by the General Data Protection Regulation.

### The Three Pillars of Compliance

**Legal Basis (Article 6)**: Every processing activity involving personal data requires a lawful basis. For analytics that touches personal data, that means consent or legitimate interest. How little data you handle, and for how long, determines how strong that position is.

**Data Minimization (Article 5)**: You can only collect data that's adequate, relevant, and limited to what's necessary. This principle prohibits collecting unnecessary identifiers, storing full IP addresses without justification, or retaining data longer than needed.

**Privacy by Design (Article 25)**: Analytics must implement technical and organizational measures to protect user privacy from the design stage. This includes pseudonymization, encryption, and default privacy-protective configurations.

Most analytics tools fail on at least one of these pillars. Google Analytics fails on legal basis (requires consent due to cookies and US transfers). Plausible and Matomo store hashed IP addresses, creating questions under data minimization. Sealmetrics was built specifically to satisfy all three pillars simultaneously.

---

## Legal Bases for Analytics Under GDPR

GDPR Article 6 defines six legal bases for processing personal data. For web analytics, two get used — consent and legitimate interest. But the question that comes first, and usually gets skipped, is how much personal data you are processing, and for how long.

### Consent (Article 6(1)(a)) - The Problem

Consent means users must actively opt in before any tracking occurs. This approach sounds simple but creates severe practical problems.

**The Data Loss Problem**: many EU visitors reject the consent banner, and many more ignore it without choosing.

Be careful how you translate those into a data loss figure — a rejection rate is measured among the people who engaged with the banner, and it is not your loss rate. Consent Mode v2 models part of the unconsented traffic back in as estimates, and visitors who ignore a banner on one visit sometimes accept on the next. What actually reaches your reports is a shortfall whose size depends on your sector, the strength of your brand and where your traffic comes from — a recognised consumer brand serving mostly direct traffic loses less than a site buying cold traffic in a privacy-sensitive vertical. Measure it on your own site.

**Implementation Complexity**: Consent requires explicit, informed, freely given agreement. Your cookie banner must clearly explain what data you collect, why you collect it, and allow granular control. Users must be able to withdraw consent as easily as they gave it. For analytics that span multiple sessions, you need to manage consent state across visits, handle consent withdrawal, and delete historical data on request.

**Legal Requirements**: Consent must be documented, time-stamped, and provable. You need systems to track who consented, when they consented, what they consented to, and whether consent is still valid. This creates significant technical and legal overhead.

### Legitimate Interest (Article 6(1)(f)) - The Popular Answer

Legitimate interest allows processing when your business needs are not overridden by user privacy rights. It is what most privacy-conscious analytics vendors reach for, and for a tool that stores hashed IPs or any other identifier, it is often the right answer.

**The Balancing Test**: you weigh your business interest against user rights, document the reasoning, and keep it on file for the day someone asks.

*Your Interest*: understanding how visitors use your website to improve user experience, optimize content, and make informed business decisions.

*User Impact*: minimal when analytics is cookieless, stores no IP addresses, and implements data minimization.

*Result*: for tools that do process some personal data, the balancing test can come out in your favour, and no consent is required.

**What it comes with.** Relying on any Article 6 basis means you are processing personal data, so the downstream obligations follow: data subject rights, the right to object under Article 21, records of processing, the balancing test you have to defend. The less data you hold, and the shorter you hold it, the lighter those become.

### Minimal, Short-Lived Data - The Stronger Position

There is a prior question, and it is the one worth asking: **how little data can you handle, and for how short a time?**

**GDPR Recital 26** is explicit that anonymous information is outside the GDPR, but that pseudonymised data — data that could still be attributed to a person with additional information — is personal data. A daily-rotating session identifier is a pseudonym while its key and salt exist. Sealmetrics keeps that window to one day: the salt rotates daily and the old one is destroyed, after which not even Sealmetrics can reconstruct the identifier, and reports are always aggregated. That minimal operational data relies on legitimate interest, Article 6(1)(f).

**ePrivacy Article 5(3)** is the separate rule that actually mandates cookie banners. It requires consent to store information on, or gain access to information stored in, a user's terminal equipment. This one is not about personal data at all — it applies to *anything* written to or read from the device. A tool that writes nothing still engages it if it reads information from the device — Sealmetrics, for example, reads standard browser properties to compute its session identifier — and then needs an exemption, such as the audience-measurement exemption described below.

Both have to hold. Clear one and fail the other and you still need a banner.

**When this position applies**: to cookieless analytics like Sealmetrics that:
- Collect only necessary data (pageviews, sessions, referrers)
- Store no data that identifies anyone — no IP addresses, not even hashed
- Write nothing to the device: no cookies, no LocalStorage, no persisted fingerprint — and read from it only what an audience-measurement exemption covers
- Don't use data for other purposes (advertising, profiling)
- Retain aggregates for reasonable periods (24 months for trend analysis)

**CNIL 2020 Guidance**: the French data protection authority published guidance stating that audience measurement can operate without consent when it "strictly respects users' privacy," specifying no cross-site tracking, limited retention, no IP storage, and transparency in privacy policies. Worth stating plainly: CNIL does not certify or approve individual analytics tools, and neither does any other supervisory authority. No such scheme exists. What exists is guidance you can assess yourself against — see our [CNIL self-assessment](/compliance/cnil-self-assessment).

Unlike consent-based approaches, this removes the consent gap entirely.

---

## The GDPR Compliance Checklist

Implementing GDPR compliant analytics requires addressing technical, legal, and organizational requirements.

### Technical Requirements

**No Unnecessary Data Collection**: Collect only what's needed for analytics. Sealmetrics tracks pageviews, sessions, referrers, device types, and basic engagement metrics. We don't collect names, emails, precise locations, or other unnecessary identifiers.

**IP Address Handling**: This is where most analytics tools fail GDPR. Google Analytics stores full IP addresses. Plausible and Matomo hash IP addresses, which GDPR still considers personal data because hashed values can be reversed or matched. Sealmetrics never stores IP addresses—not even hashed versions. Our session identifier rotates daily and, once rotated, not even Sealmetrics can reconstruct it.

**Data Retention Limits**: Determine legitimate retention periods and enforce them. Sealmetrics defaults to 24 months of retention, documented as necessary for year-over-year trend analysis and seasonal pattern identification. Data older than 24 months is automatically purged.

**Security Measures**: Implement encryption in transit (HTTPS), encryption at rest, access controls, and regular security audits. Sealmetrics uses AES-256 encryption, role-based access control, and annual penetration testing.

### Legal Requirements

**Privacy Policy**: Your privacy policy must explain what analytics you use, what data gets collected, how long it is retained, and on what footing you operate. If you rely on legitimate interest, document your balancing test. With Sealmetrics, say that it handles minimal pseudonymised data under legitimate interest, keeps the per-hit log for one day, reports in aggregate, and explain why no consent is required.

**Legal Position Documentation**: Maintain internal documentation for whichever footing you're on. If you rely on legitimate interest, document: (1) what business purpose the analytics serves, (2) why this data is necessary, (3) how you minimize privacy impact, and (4) what safeguards you implement. Either way, document what is stored field by field and how long each part is kept.

**Data Processing Agreement (DPA)**: GDPR Article 28 requires a DPA between you and your analytics provider. Sealmetrics provides a standard DPA covering all processor obligations including security, confidentiality, sub-processor management, and data deletion.

**Data Protection Impact Assessment (DPIA)**: Required when processing presents high risk to user rights. Cookieless analytics typically don't require DPIA because they implement data minimization and have minimal privacy impact. However, document why you determined DPIA isn't needed.

### Organizational Requirements

**Internal Documentation**: Maintain records of processing activities under GDPR Article 30. Document what analytics you use, why, what legal basis applies, what data gets processed, and where data is stored.

**Staff Training**: Ensure team members understand GDPR requirements, know how to handle data requests, and follow privacy procedures.

**Incident Response Plan**: Establish procedures for handling potential data breaches, including detection, assessment, notification to authorities within 72 hours if required, and user notification when appropriate.

---

## Tools Comparison: GDPR Compliance

Understanding how different analytics tools handle GDPR compliance helps you choose the right solution for your needs.

| Feature | Google Analytics | Plausible | Matomo | Sealmetrics |
|---------|------------------|-----------|--------|-------------|
| **Legal Basis** | Consent required | Legitimate interest | Legitimate interest | **Legitimate interest — minimal pseudonymised data, unrecoverable after daily rotation** |
| **Cookie Usage** | Yes (multiple) | No | Optional | No |
| **IP Storage** | Yes (full) | Yes (hashed) | Yes (hashed) | **No - zero IPs** |
| **Consent Banner Needed** | Yes | No* | No* | **No (self-assessed; Germany: open question)** |
| **Data Location** | US + EU | EU only | Self-hosted or EU | EU only |
| **Consent-driven data loss** | Varies by site | None where consent isn't required | None where consent isn't required | **None** |
| **US Data Transfers** | Yes | No | No | No for analytics data (service emails: Resend, US, under SCCs) |
| **Schrems II Compliant** | Questionable | Yes | Yes | Analytics data stays in the EU (self-assessed) |
| **CNIL 2020 Compliant** | No | With config | With config | **Yes (default, self-assessed)** |
| **TDDDG (Germany)** | No | Yes | Yes | **Open question (our reading: no consent needed)** |
| **Setup Complexity** | High | Low | Medium | **Very Low (2 min)** |
| **DPA Included** | Yes | Yes | Yes | Yes |

*May need consent depending on configuration and cookie usage

The table reveals a critical insight: tools that hash IP addresses (Plausible, Matomo) still process personal data under GDPR. Hashing is pseudonymization, not anonymization. Sealmetrics never stores IP addresses at all.

---

## Why Most Analytics Tools Fail GDPR

Three common failures plague analytics tools attempting GDPR compliance.

### Problem 1: IP Address Storage

GDPR defines personal data as any information relating to an identified or identifiable person. IP addresses clearly qualify as personal data according to multiple court rulings and regulatory guidance.

**The Hashing Myth**: Many analytics tools claim GDPR compliance by hashing IP addresses before storage. This creates a false sense of security. GDPR distinguishes between anonymization (irreversible, not personal data) and pseudonymization (reversible, still personal data). Hashed IPs are pseudonymized, not anonymized.

Why hashing doesn't solve the problem:
- Hash algorithms can be reversed with rainbow tables
- Hashed values can be matched across systems
- Same IP produces same hash, enabling tracking
- GDPR Recital 26 explicitly states pseudonymization doesn't remove personal data status

**Schrems II Implications**: The Schrems II decision invalidated Privacy Shield, making US data transfers problematic. Many companies responded by hosting analytics in the EU, but if those tools store IP addresses (even hashed), they still process personal data requiring careful legal basis justification.

Sealmetrics solves this by never storing IP addresses. Our session identifier is ephemeral: nothing is stored on the device, and the server re-keys it with a salt that rotates daily and is then destroyed, so it cannot be linked across days or across sites.

### Problem 2: Cookie Requirements

The ePrivacy Directive Article 5(3)—often called the Cookie Law—requires consent before storing information on user devices. This operates alongside GDPR, creating a dual compliance requirement.

**The Cookie Consent Trap**: Analytics tools using cookies face an impossible choice. They can require consent and lose the visitors who reject or ignore the cookie banner, or operate without consent and violate the ePrivacy Directive. Many companies choose the latter, hoping enforcement remains limited.

**Technical Cookies Exemption**: The ePrivacy Directive exempts "strictly necessary" cookies for functionality users explicitly request. Analytics cookies don't qualify for this exemption according to regulatory consensus. The upcoming ePrivacy Regulation will likely remove any remaining ambiguity.

Sealmetrics avoids this problem through cookieless tracking: nothing is stored on the device, and its ephemeral session identifier, which rotates daily, is assessed against the audience-measurement exemption rather than consent — so, on our own assessment, no consent banner for its own analytics and no data loss from rejections (in Germany an open question — see [Germany](/compliance/germany-ttdsg-self-assessment)).

### Problem 3: US Data Transfers

Google Analytics stores data in US servers, creating complex legal challenges post-Schrems II.

**Why This Matters**: Schrems II invalidated the Privacy Shield framework that allowed EU-US data transfers. The Court ruled that US surveillance laws (FISA 702, EO 12333) don't provide adequate protection for EU citizen data. While a new adequacy decision was adopted in July 2023, uncertainty remains about its long-term validity.

**The Google Problem**: Multiple European data protection authorities (Austria, France, Italy) have ruled that Google Analytics violates GDPR due to US data transfers. Even with Google's EU hosting options, the underlying data sharing with Google's US operations creates compliance risks.

Sealmetrics operates exclusively on EU infrastructure with no US parent company, eliminating data transfer concerns entirely.

---

## How Sealmetrics Handles GDPR

Sealmetrics was built from the ground up around the GDPR, not retrofitted like most analytics tools.

### No Consent Required

Sealmetrics needs no cookie consent banner, and the reasoning has two parts. Nothing is stored on the user's device; the tracker does read standard browser properties to compute a session identifier, which engages ePrivacy Article 5(3) — the rule that mandates banners — and relies on its audience-measurement exemption (see the CNIL criteria below) rather than on consent. And nothing stored identifies anyone: the session identifier rotates daily and becomes unrecoverable, and reports are aggregated; that short-lived pseudonymised data relies on legitimate interest, Article 6(1)(f). That removes the consent gap at its source.

**The Technical Foundation**: Our tracker computes, in the browser, a hash of standard device characteristics and never writes it to the device. Before anything is stored, the server re-keys it with a secret and a daily salt that is destroyed on rotation, so the stored identifier changes every day and two days of the same device cannot be linked. A session ends after 2 hours of inactivity. This prevents returning-visitor recognition while still providing valuable analytics on how users navigate your site within individual visits.

**CNIL Compliance**: The French data protection authority's 2020 guidance on analytics explicitly allows this approach. CNIL confirms that audience measurement without consent is permissible when analytics strictly respect user privacy through technical safeguards like cookieless tracking and no IP storage.

**No Stored Fingerprint**: The in-browser hash of device characteristics is, technically, a device fingerprint, and we say so plainly. What separates it from fingerprint-based tracking is that it is never stored as sent: the server re-keys it daily with a salt that is then destroyed, so nothing Sealmetrics keeps can recognise the same device on another day, and the site's account ID in the hash prevents correlation across sites. See [what we track](/security-privacy/what-we-track#6-session-identifier).

### Zero IP Storage

This is Sealmetrics' most significant differentiator. We don't store IP addresses—not full, not truncated, not hashed, not at all.

**How It Works**: When a pageview hits our servers, we process the request, extract necessary analytics data (page URL, referrer, timestamp), and use the IP address only transiently server-side for security and anti-abuse checks. The IP never touches our analytics database and is never linked to any hit or metric — it appears only in short-lived operational logs with limited retention.

**Contrast with Competitors**:
- Google Analytics: Stores full IP addresses by default (can be configured for anonymization but still processes full IPs)
- Plausible: Hashes IP addresses before storage
- Matomo: Offers IP anonymization but defaults to storing IP addresses
- Sealmetrics: Zero IP storage, not even hashed

This technical choice means Sealmetrics stores no IP address in any form, which keeps the data it does hold minimal and short-lived.

### 24-Month Retention Without Consent

Data retention limits are crucial for GDPR compliance under the data minimization principle. Sealmetrics retains analytics data for 24 months, a period we've documented as necessary for meaningful trend analysis.

**Why 24 Months**: This retention period allows:
- Year-over-year comparisons (12 months of current data + 12 months historical)
- Seasonal pattern identification (requires full annual cycles)
- Long-term trend analysis for strategic decisions
- Buffer period for data exports and migrations

**Automatic Purging**: Data older than 24 months is automatically deleted from our systems. No manual intervention needed, no risk of keeping data too long.

**Documented Justification**: We maintain internal documentation explaining why 24-month retention is necessary for business intelligence and user experience optimization, and confirming that what is retained is aggregate data containing no personal identifiers.

### EU Infrastructure

Sealmetrics runs its analytics on European infrastructure: analytics data is hosted and processed only in the EU (Dublin).

**Data Location**: Analytics data is hosted and processed only in the EU (Dublin). Service emails go through Resend (US) under SCCs. Our company is EU-based with no US parent organization.

**Processor Compliance**: Our subprocessor list is deliberately short — infrastructure and database hosting in Ireland, managed LLM inference in Paris for the optional Seal AI Private add-on, and a transactional email provider (Resend, US, under SCCs). The authoritative, always-current list is Annex 3 of our [DPA](https://sealmetrics.com/dpa), which also sets out the notification procedure if processors change. If you use LENS with your own LLM key instead, that provider is your contract, not our subprocessor.

**No Surveillance Exposure**: Analytics data is held by an EU company on EU infrastructure, not by a US provider subject to US surveillance laws (FISA 702, EO 12333) that caused Schrems II complications for US-based analytics providers.

---

## Country-Specific GDPR Considerations

While GDPR provides baseline requirements across the EU, individual countries have additional regulations affecting analytics.

### Germany (TDDDG)

Germany's Telecommunications Digital Services Data Protection Act (TDDDG, renamed from TTDSG in May 2024) is stricter than baseline GDPR regarding cookies and tracking.

**Key Requirements**:
- Consent required for storing information on devices (including cookies)
- Higher bar for "technically necessary" exemptions
- Specific rules around telecommunications data
- Fines up to €300,000 for violations

**Sealmetrics position**: an open question. Sealmetrics stores nothing on the device, and our reading is that no consent is needed. But the DSK does not extend the §25(2) exemption to audience measurement, and the tracker reads device properties via JavaScript, which may count as "access" under §25(1) (EDPB Guidelines 2/2023 read access broadly). Check with your DPO or counsel.

### France (CNIL)

The French data protection authority (Commission Nationale de l'Informatique et des Libertés) published influential guidance on analytics in 2020.

**CNIL 2020 Analytics Guidance**: This document established that "audience measurement" can operate without consent under specific conditions:
- Purpose limited to measuring audience
- No cross-site tracking
- No data sharing with third parties for other purposes
- Limited retention periods
- Transparent privacy disclosures

**Exemption Categories**: CNIL identifies two types of exempt audience measurement:
1. First-party audience measurement (tracking on your own site)
2. Delegated audience measurement (using analytics providers like Sealmetrics)

**Sealmetrics and the CNIL criteria**: on our [self-assessment](/compliance/cnil-self-assessment), Sealmetrics meets the CNIL criteria for the audience-measurement exemption (no supervisory authority certifies analytics tools): purpose limitation, no cross-site tracking, documented retention limits, EU-only operation, and clear privacy disclosures.

### Spain (AEPD)

Spain's data protection authority (Agencia Española de Protección de Datos) follows similar principles to CNIL with emphasis on data minimization.

**Key Focus Areas**:
- Proportionality of data collection
- Technical necessity justification
- User transparency requirements
- Cross-border data transfer restrictions

**Implementation**: Spanish companies using Sealmetrics should document in their privacy policies what is processed — no IPs, no cookies, minimal pseudonymised data under legitimate interest that becomes unrecoverable daily, aggregated reports.

---

## Implementation Guide

Moving to GDPR compliant analytics involves choosing your legal basis, implementing technical measures, updating legal documentation, and verifying compliance.

### Step 1: Establish Your Legal Position

The first decision determines everything else — and it starts one question earlier than most teams assume.

```
Decision Tree:

Does your analytics store identifying data
(IP addresses, hashed or not, user IDs, persistent identifiers)?
│
├─ No, and it writes nothing to the device
│  └─ Legitimate interest for minimal, short-lived data
│     No consent needed if the audience-measurement
│     exemption to ePrivacy 5(3) is met
│     └─ Choose Sealmetrics or a similar truly cookieless tool
│
└─ Yes → pick a basis for that data:
   │
   ├─ Consent → implement a cookie banner
   │  └─ Accept consent-driven data loss, unevenly distributed
   │
   └─ Legitimate interest → run and document a balancing test
      └─ Accept the obligations that come with processing personal data
```

**Minimal-data checklist** — every answer must be yes:
- Are you certain no IP address is stored, in any form, including hashed?
- Is nothing written to the user's device (no cookies, no LocalStorage, no persisted fingerprint), and is anything read from it covered by an ePrivacy exemption?
- Are all identifiers session-scoped and never correlated across visits?
- Is the retained data aggregate, with no field that could single out a person, and is any per-hit data purged quickly?
- Can you show all of the above to a DPO in writing?

If any answer is no, you are processing more personal data than you need, and the no-banner position gets harder to defend. Don't assert it for a tool that doesn't earn it.

### Step 2: Technical Setup

Implementation differs by platform but follows similar principles.

That's it. No cookie configuration, no IP anonymization settings, no consent management. The script loads asynchronously, doesn't block page rendering, and starts capturing analytics immediately.

**For Other Platforms**:
- Remove or configure cookie-based tracking
- Enable IP anonymization (though this doesn't fully solve GDPR issues)
- Disable advertising features
- Disable user ID tracking
- Configure EU-only data storage

### Step 3: Legal Documentation

Update three key documents to reflect your analytics approach.

**Privacy Policy Updates**:

Add or update your analytics section:

```
We use Sealmetrics for web analytics. Sealmetrics collects minimal
usage data (pages viewed, referral sources, aggregate engagement)
without cookies and without storing IP addresses. Nothing is stored
on your device; standard browser properties are read only to compute
a session identifier that changes daily and cannot link your visits
across days; once rotated, it cannot be reconstructed. This
pseudonymised data is processed on the basis of our legitimate
interest (GDPR Art. 6(1)(f)), the per-hit log is kept for one day,
reports are aggregated, and measurement relies on the
audience-measurement exemption rather than consent. Data is retained for 24 months for trend analysis and
stored exclusively on EU servers in Dublin, Ireland. You can
object at [link to your objection page]; we will then stop loading
the analytics script for you.
```

**Processing Documentation** (Internal):

Maintain internal records documenting:
- What is stored, field by field, and how long (per-hit log one day, aggregated reports 24 months)
- That nothing is written to the device, what is read from it (standard browser properties for the session identifier), and the ePrivacy Article 5(3) exemption relied on for that read
- That the session identifier is pseudonymised data under legitimate interest, Article 6(1)(f), and becomes unrecoverable after the daily rotation
- Safeguards: cookieless, IP-less, EU-only, limited retention
- Alternative considered: consent-based analytics rejected due to consent-driven data loss

**Data Processing Agreement**:

Execute Sealmetrics' standard DPA, which covers:
- Processor obligations (security, confidentiality, instructions)
- Sub-processor authorization and notification
- Data subject rights assistance
- Data breach notification procedures
- Post-termination data deletion
- Audit rights

### Step 4: Verify Compliance

After implementation, verify everything works correctly.

**Technical Verification**:
- Open browser developer tools → Application → Cookies
- Confirm: No analytics cookies set
- Check: Privacy policy updated
- Test: Analytics dashboard receiving data
- Verify: if you offer an objection page, the tracker no longer loads after objecting

**Legal Verification**:
- Privacy policy describes the analytics accurately, including why no consent is required
- DPA executed with Sealmetrics
- Internal processing documentation complete (what is stored, for how long, and on what basis)
- Data retention schedule understood (fixed 24 months for aggregates and conversions)
- Team trained on data handling procedures

**Ongoing Compliance**:
- Review analytics configuration quarterly
- Update documentation when practices change
- Monitor regulatory guidance for updates
- Conduct annual GDPR compliance audit

---

## Common GDPR Compliance Mistakes

Avoiding these frequent errors saves legal headaches and potential fines.

### Mistake 1: Relying on Consent for Analytics

**The Problem**: Consent sounds legally safe but creates massive business problems. Many EU visitors reject or ignore the banner, and the resulting shortfall in your reports is spread unevenly across your channels, which is what quietly reorders your rankings rather than just shrinking your totals.

**Why It Happens**: Companies fear legitimate interest is too uncertain or worry about regulatory challenges. They choose consent thinking it's the "safer" option.

**The Fix**: use a properly implemented cookieless tool that stores nothing on the device and no data that identifies anyone, and rely on legitimate interest for the minimal data it handles. Document what is stored and for how long, minimize collection, and implement technical safeguards.

### Mistake 2: Using Google Analytics Without Configuration

**The Problem**: Default Google Analytics configuration violates GDPR in multiple ways: sets cookies without consent, stores IP addresses, transfers data to US servers, and enables advertising features.

**Why It Happens**: Companies install Google Analytics with default settings, assuming a major tech company must be GDPR compliant by default. This assumption is incorrect.

**The Fix**: either configure Google Analytics extensively (IP anonymization, cookie consent integration, disable advertising, EU-only hosting) and accept consent-driven data loss, or switch to Sealmetrics and avoid the gap altogether.

### Mistake 3: Thinking Hashed IPs Solve GDPR

**The Problem**: Many analytics tools claim GDPR compliance by hashing IP addresses before storage. This is pseudonymization, not anonymization. GDPR still considers pseudonymized data as personal data.

**Why It Happens**: Marketing materials from analytics vendors incorrectly conflate hashing with anonymization. Companies believe "we hash IPs" means "we don't process personal data."

**The Fix**: Use analytics that doesn't store IP addresses at all. Sealmetrics never stores IPs—not hashed, not truncated, not at all. This removes the hashed-IP question entirely.

### Mistake 4: No DPA with Analytics Provider

**The Problem**: GDPR Article 28 requires a Data Processing Agreement between controllers (you) and processors (your analytics provider). Operating without a DPA is a compliance violation regardless of how privacy-protective your analytics tool is.

**Why It Happens**: Small companies often overlook this administrative requirement, focusing only on technical compliance.

**The Fix**: Execute a DPA with your analytics provider. Sealmetrics provides a standard DPA to all customers covering all Article 28 requirements.

### Mistake 5: Inadequate Privacy Policy Disclosures

**The Problem**: GDPR Article 13 requires transparent information about data processing. Many companies mention "we use analytics" without explaining what data is collected, what legal basis applies, or how long data is retained.

**Why It Happens**: Companies copy privacy policy templates without customizing them for their specific analytics implementation.

**The Fix**: clearly disclose in your privacy policy what analytics you use, what specific data gets collected, where it is stored, how long it is retained, why no consent is required, and how users can opt out. See Step 3 above for specific language.

---

## Expert Perspectives on GDPR Analytics

Regulatory guidance and legal opinions provide authoritative views on compliant analytics implementation.

### CNIL (French Data Protection Authority)

In their groundbreaking 2020 guidance on audience measurement, CNIL stated:

> "Audience measurement can be performed without consent when it strictly respects users' privacy and is limited to producing anonymous statistical data."

CNIL's guidance establishes specific requirements:
- Purpose limitation to audience measurement only
- No cross-site tracking or user profiling
- Limited data retention periods (maximum 24 months mentioned)
- No IP address storage beyond immediate processing needs
- Transparent privacy policy disclosures

This guidance forms the foundation for consent-exempt audience measurement across the EU, as other data protection authorities have referenced CNIL's framework in their own. Note the wording CNIL uses: *anonymous statistical data*. That is a statement about the nature of the output: reports have to be aggregated and non-identifying.

### GDPR Article 5(1)(c) - Data Minimization

The regulation itself provides clear direction:

> "Personal data shall be adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed."

For analytics, this means:
- Collect only essential metrics (pageviews, sessions, referrers)
- Don't collect unnecessary identifiers (names, emails, precise locations)
- Don't store IP addresses if your technical approach doesn't require them
- Don't retain data longer than necessary for your documented purposes

Sealmetrics implements data minimization as a core design principle. We collect the minimum data necessary for meaningful analytics: what pages users visit, how they navigate, where they came from, and basic device information. We don't collect anything else.

### The Sealmetrics Approach

Unlike cookie-based analytics tools that retrofit GDPR compliance onto existing architectures, Sealmetrics was designed from inception for compliance.

**No Compromise Required**: Traditional analytics forces a choice between a clean legal position and complete data. Cookie consent buys the former at the cost of part of the latter. Sealmetrics measures all the traffic you lose today to the cookie banner and keeps the legal position clean, through:

1. **Cookieless Architecture**: Nothing is stored on the device, and the session identifier is assessed against the audience-measurement exemption rather than consent, so there is no data loss from rejections.

2. **Zero IP Storage**: Not hashing, not truncating—zero storage. IP addresses never touch our database, eliminating the largest GDPR compliance question.

3. **Session-Based Tracking**: An ephemeral session identifier that rotates daily provides analytics value without enabling cross-day or cross-site tracking or user identification.

4. **EU-Exclusive Operation**: An EU company, and analytics data hosted and processed only in the EU (Dublin). No US parent, and no adequacy decision dependency for analytics data.

5. **Purpose Limitation**: Sealmetrics processes data only for audience measurement. No advertising integrations, no data selling, no repurposing for other commercial activities.

6. **Documented Retention**: 24-month retention justified and documented as necessary for trend analysis, with automatic purging of older data.

This technical foundation keeps the data minimal and short-lived — consistent with CNIL's guidance, and accepted by DPOs across the EU. To be clear about what that is and isn't: DPO acceptance is a customer assessment, not a regulatory endorsement. No supervisory authority certifies analytics tools, and Sealmetrics holds no ISO 27001 or SOC 2 certification.

---

## Frequently Asked Questions

### Is Google Analytics GDPR compliant?

Google Analytics is not GDPR compliant in its default configuration. Multiple European data protection authorities (Austria, France, Italy) have ruled that standard Google Analytics implementations violate GDPR due to three main issues:

First, Google Analytics uses cookies, triggering ePrivacy Directive consent requirements. This means you need cookie banners and will lose the visitors who reject or ignore the cookie banner.

Second, Google Analytics stores IP addresses. Even with the IP anonymization feature enabled, full IPs are processed before anonymization occurs, constituting personal data processing.

Third, Google Analytics transfers data to US Google servers, creating Schrems II compliance challenges. While Google offers a consent mode and EU hosting options, the fundamental architecture involves data sharing with a US parent company.

You can make Google Analytics more GDPR compliant through extensive configuration, but you'll still need consent banners and accept massive data loss. Sealmetrics is designed to comply with the GDPR without these compromises (our self-assessment, not a certification).

### Can I use analytics without a cookie banner?

On our own assessment, yes, with properly implemented cookieless analytics like Sealmetrics (in Germany an open question — see below). Cookie banners are required by the ePrivacy Directive when websites store information on user devices (cookies) or read information from them, unless an exemption applies. If your analytics uses no cookies and whatever it reads is covered by an exemption, no banner is needed.

The GDPR is a separate question from ePrivacy, and both have to be satisfied. Sealmetrics addresses both: nothing is stored on the device, and the standard browser properties it reads to compute its session identifier rely on the audience-measurement exemption from ePrivacy Article 5(3); and nothing stored identifies anyone: the session identifier rotates daily and becomes unrecoverable, and the short-lived pseudonymised data relies on legitimate interest, Article 6(1)(f).

This measures all the traffic you lose today to the cookie banner, without one.

### What's the difference between legitimate interest and consent?

Consent (Article 6(1)(a)) requires users to actively opt in before processing begins. For analytics that means cookie banners, explicit checkboxes, and the consent gap in your data.

Legitimate interest (Article 6(1)(f)) allows processing when your business needs are not overridden by privacy rights. It's the right answer for a tool that stores hashed IPs or other identifiers, provided the purpose is audience measurement rather than advertising, collection is minimized, safeguards are in place, and users can object.

**What makes legitimate interest strong is how little data you hold.** Sealmetrics stores no IP in any form, no persistent identifier, and nothing on the device; its session identifier is pseudonymised data that rotates daily and, once rotated, not even Sealmetrics can reconstruct. It relies on legitimate interest, Article 6(1)(f), for that short-lived operational data, and reports are always aggregated. CNIL confirmed in 2020 that cookieless audience measurement can operate without consent when it produces anonymous statistical data — the reports, in Sealmetrics' case.

### Does hashing IP addresses make them anonymous under GDPR?

No. Hashing IP addresses is pseudonymization, not anonymization. GDPR treats pseudonymized data as personal data requiring the same protections as unprocessed personal data.

GDPR Recital 26 explicitly states: "Personal data which have undergone pseudonymization, which could be attributed to a natural person by the use of additional information should be considered to be information on an identifiable natural person."

Hashed IPs remain personal data because:
- Hash functions can be reversed with rainbow tables
- Same IP produces same hash, enabling tracking
- Hashes can be matched across systems
- Technical possibility of re-identification exists

Sealmetrics solves this by never storing IP addresses—not hashed, not truncated, zero storage. This removes the hashed-IP question entirely.

### How long can I store analytics data under GDPR?

GDPR doesn't specify exact retention periods but requires you to keep data only as long as necessary for documented purposes. For analytics, retention depends on your business justification.

CNIL's 2020 guidance mentions 24 months as an acceptable retention period for audience measurement, justified by the need for year-over-year comparisons and seasonal pattern identification.

Sealmetrics implements 24-month retention with documented justification:
- 12 months of current data for analysis
- 12 months of historical data for year-over-year comparison
- 1 month buffer for data exports and migrations
- Automatic deletion after 24 months

Your privacy policy should specify retention periods, and you should maintain internal documentation justifying why these periods are necessary for your stated purposes.

### Do I need a Data Processing Agreement (DPA) with my analytics provider?

Yes. GDPR Article 28 requires a written contract between data controllers (you) and data processors (your analytics provider) establishing:
- Subject matter and duration of processing
- Nature and purpose of processing
- Type of personal data processed
- Categories of data subjects
- Obligations and rights of the controller

The DPA must include specific processor obligations around security, confidentiality, sub-processor management, data subject rights assistance, data breach notification, and post-termination data handling.

Sealmetrics provides a standard DPA to all customers covering all Article 28 requirements. Operating without a DPA violates GDPR regardless of how privacy-protective your analytics tool is.

### What is a Data Protection Impact Assessment (DPIA) and do I need one?

A DPIA is a systematic analysis required under GDPR Article 35 when processing is "likely to result in high risk to the rights and freedoms of natural persons." DPIAs are mandatory for:
- Systematic and extensive profiling with significant effects
- Large-scale processing of special category data
- Systematic monitoring of publicly accessible areas at large scale

Most cookieless analytics don't require DPIA because they implement data minimization, don't create detailed user profiles, and have minimal privacy impact. However, you should document your reasoning for not conducting a DPIA.

If your DPO or legal counsel determines a DPIA is needed, the assessment should document: description of processing operations, necessity and proportionality assessment, risk analysis, and mitigation measures.

Sealmetrics' technical approach (no IPs, no cookies, minimal data, EU-only) creates low privacy impact, typically not requiring DPIA. Many customers document this determination as part of their compliance records.

### Can I use Sealmetrics without consent in Germany (TDDDG)?

It is an open question. Sealmetrics' reading is that no consent is needed, but check with your DPO or counsel: the DSK does not extend the §25(2) TDDDG exemption to audience measurement, and the tracker reads device properties via JavaScript, which may count as "access" under §25(1) (EDPB Guidelines 2/2023 read access broadly).

The TDDDG (renamed from TTDSG in May 2024) is stricter than baseline GDPR, particularly regarding device storage and tracking. The law requires consent for storing information on devices (including cookies) with limited exemptions for technically necessary functionality.

What supports Sealmetrics' reading:
- No cookies or device storage
- No stored or persistent fingerprint: the device-characteristics hash computed in the browser is re-keyed daily on the server and never stored as sent
- Data minimization by design
- EU-exclusive operation (no German-US data transfer concerns)

§25 TDDDG (formerly TTDSG) governs storing and reading information on devices. Sealmetrics stores nothing there; it does read standard browser properties to compute its session identifier. How §25 applies to that read is assessed in our [Germany self-assessment](/compliance/germany-ttdsg-self-assessment).

### What if my Data Protection Officer (DPO) rejects cookieless analytics?

DPOs sometimes push back on cookieless analytics out of unfamiliarity with the framework — and, fairly often, because a previous vendor oversold it. Address this by providing:

**CNIL 2020 Guidance**: share the French DPA's documentation confirming that audience measurement can operate without consent when it produces anonymous statistical data. Be precise about what this is: guidance you can assess yourself against, not a certification. CNIL does not approve individual tools.

**Technical Documentation**: explain the implementation — no cookies, zero IP storage, session-scoped identifiers never written to the device, EU-only servers in Dublin. This is what carries the argument, so lead with it.

**The Data, Field by Field**: present what is stored, for how long, and why the legitimate interest balance is easy: no IP, nothing on the device, a pseudonymised session identifier that becomes unrecoverable after the daily rotation, a per-hit log purged after one day, and aggregated reports. A DPO who has seen a dozen weak balancing tests will find this a refreshing change.

**Comparison with Alternatives**: show that consent-based analytics loses the visitors who reject or ignore the cookie banner, unevenly across channels. Resist inflating it — a DPO who catches an exaggerated number will discount everything else you said.

Most DPOs approve once they understand the legal framework and technical implementation. If concerns remain, consider requesting a second opinion from external GDPR counsel or consulting other DPOs in your industry who have approved similar approaches.

### How do I document a consentless analytics setup?

GDPR doesn't prescribe documentation formats, but the records worth keeping are these:

**Purpose Statement**: "We measure website usage in order to understand how visitors navigate our site, enabling user experience improvements and informed business decisions."

**Scope Analysis** — the important one:
- What is stored: pages viewed, referrer, aggregate engagement, country derived from browser timezone
- What is not stored: IP addresses in any form including hashed, user IDs, cross-session identifiers
- Device storage: none — no cookies, no LocalStorage, nothing written; standard browser properties are read only to compute a session identifier that the server re-keys daily
- Conclusion: the session identifier is pseudonymised data, processed under legitimate interest (Article 6(1)(f)), per-hit log purged after one day and unrecoverable after the daily rotation; reports are aggregated and non-identifying

**Safeguards**: cookieless, zero IP storage, EU servers in Dublin, 24-month retention on aggregates with automatic purging.

**Alternative Considered**: "We considered consent-based analytics but rejected it because consent-driven data loss from banner ghosting and rejection would prevent achieving our business intelligence purposes."

**Objection**: "Users can object via [describe how your site stops loading the tracker for them]."

Sealmetrics provides documentation templates to help customers formalize this for internal records and DPO review.

---

## Conclusion

GDPR compliance for web analytics doesn't require choosing between legal safety and data completeness. The consent-or-data-loss dilemma is a false choice created by outdated cookie-based analytics architectures.

The path to a clean legal position without giving up the visitors who reject the banner:

1. **Ask the prior question**: how little data can you handle, and for how short a time?
2. **Implement truly cookieless analytics** that writes nothing to the device and reads from it only what an exemption covers
3. **Ensure zero IP storage**—not hashed or truncated, but zero storage
4. **Document your approach**: what is stored, for how long, and on what basis
5. **Update your privacy policy** with clear, specific disclosures
6. **Execute a DPA** with your analytics provider

Sealmetrics satisfies all of these by default:

- **No consent required**: nothing stored on the device and a session identifier that rotates daily (audience-measurement exemption to ePrivacy 5(3), self-assessed), no data that identifies anyone
- **No cookies**: no cookie lifespan to manage and no consent-driven data loss
- **Zero IP storage**: not even hashed—the hashed-IP question doesn't arise
- **No consent gap**: the traffic the banner loses is measured too, not just the visitors who accept the banner
- **EU-exclusive**: analytics data is hosted and processed only in the EU (Dublin)
- **24-month retention**: documented as necessary for trend analysis, with automatic purging

Stop compromising between compliance and complete analytics data.

Start your 14-day free trial: [Sealmetrics.com](https://sealmetrics.com)

---

## Additional Resources

- [Complete Guide to Cookieless Analytics](/blog/cookieless-analytics-guide)
- [Cookieless vs Cookie-Based Analytics](/blog/cookieless-analytics-vs-cookie-based)
- [How Consentless Tracking Works](/security-privacy/how-consentless-works) — Technical architecture behind tracking designed for the GDPR
- [What Is Consentless Analytics?](/security-privacy/consentless-analytics) — Legal basis and implementation details
- [CNIL 2020 Analytics Guidance (Official)](https://www.cnil.fr/en/cookies-and-other-trackers/rules/cookies/how-comply-cookies-and-trackers)
- [GDPR Official Text](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [ePrivacy Directive Article 5(3)](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32002L0058)
