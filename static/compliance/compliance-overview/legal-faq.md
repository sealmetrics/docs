---
title: "Legal FAQ — Sealmetrics Compliance Questions"
description: "Answers to the legal questions asked in vendor reviews of Sealmetrics: DPA, DPIA, subprocessors, Dublin hosting, IP handling, cookies, 24-month retention."
canonical_url: "https://docs.sealmetrics.com/compliance/compliance-overview/legal-faq"
lang: "en"
date_generated: "2026-09-04T00:07:24.876Z"
source_hash: "7a92ff9939ab222fcbd0b07533b4567c88b8d1cba2f7468a32c3a50a11390708"
content_type: "trust-and-legal"
owner: "legal"
llm_priority: "critical"
source_file: "compliance/compliance-overview/legal-faq.mdx"
publisher: "Sealmetrics"
---

# Legal FAQ — Sealmetrics Compliance Questions

Canonical page: https://docs.sealmetrics.com/compliance/compliance-overview/legal-faq

Sealmetrics is a B2B data controller for account data and a data processor for analytics data; this page answers the legal and compliance questions that come up in audits and vendor reviews — DPA, DPIA, subprocessors, data hosting, IP handling, cookies and retention.

---

## **Compliance Validation**

### How can I validate Sealmetrics' compliance claims?
Sealmetrics publishes detailed, criterion-by-criterion **self-assessments** against the published frameworks of European regulators, so your DPO can verify every claim directly:

👉 [CNIL (France)](/compliance/cnil-self-assessment) · [ICO PECR (UK)](/compliance/uk-pecr-self-assessment) · [TDDDG (Germany)](/compliance/germany-ttdsg-self-assessment) · [Garante (Italy)](/compliance/italy-garante-self-assessment) · [FADP (Switzerland)](/compliance/switzerland-fadp-self-assessment)

Technical claims (what is collected, what is never stored) are documented in [What We Track](/security-privacy/what-we-track) and can be verified from the browser: every request the tracker sends is visible in your own DevTools.

---

## **Data Processing & Legal Documentation**

### **How does Sealmetrics process customer data?**
You can review our full **Privacy Notice** for our role as a B2B Data Controller here:

👉 [Sealmetrics Privacy Notice](https://sealmetrics.com/privacy)

For our role as Data Processor:
👉 [Data Processing Agreement (DPA)](https://sealmetrics.com/dpa) · [Subprocessors](/compliance/subprocessors)

---

### **Where can I access Sealmetrics' DPIA?**
We provide a completed **DPIA** (Data Protection Impact Assessment) for all customers.
You can request access directly from our team.

---

### **Legal Documentation**
All legal documentation is available in the footer of our website, including:

- Privacy Notice
- Data Processing Agreement (DPA)
- Terms of Service
- Customer DPIA availability

---

## **Privacy by Design & Company Structure**

### **Why is Sealmetrics a true privacy-by-design solution?**
Because **every metric that appears in the Sealmetrics platform must be validated and approved by our Legal Department** before being allowed into the product.

No exceptions.

---

### **What kind of company is Sealmetrics?**
Sealmetrics is a **bootstrapped European company** with no external investors on the board.

---

## **Data Collection & Calculation**

### **What data does Sealmetrics collect?**
We only collect four essential, non-personal variables per hit:

- Current URL (including UTM parameters)
- Referral URL
- Timestamp
- User Agent (used for anonymous device classification; event detail purged after 1 day, aggregated categories kept 24 months; never linked to a person)

Plus a short-lived **session context marker** used to tell a second pageview apart from a new entrance. See [What We Track vs What We Don't](/security-privacy/what-we-track) for the full breakdown.

All data is anonymous and isolated.

---

### **What data does Sealmetrics calculate?**
We compute:

- **Source ID** (`_adin`): Used for attribution
- **Session context marker**: a short-lived identifier scoped to a single browsing session (~2-hour inactivity window). It is not stored in the browser, does not persist across sessions, and cannot recognize a returning visitor.

---

### **Does Sealmetrics use IP addresses for calculation?**
**Never for analytics, and never stored in the analytics database.**

- No metric in Sealmetrics is calculated from IP addresses. Visitor country comes from the [browser timezone](/security-privacy/country-detection), not from the IP.
- The visitor's IP is used **transiently on the server** for security and anti-bot protection (checking the request against curated bot/datacenter blocklists before it is accepted). As with any web service, IPs may also appear transiently in operational logs with limited retention; those logs are separate from analytics data and are never available to clients.
- The IP is **never written to the analytics database** — there is no IP column in our event storage — and it is never linked to any hit, session, or metric.
- No GeoIP lookup is performed on the IP. One was designed for the optional **Agent Analytics** bot detector, but that feature is **not live and cannot be enabled on any account**, so it runs nowhere today.

This transient security use is processed under legitimate interest ([GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj) Art. 6(1)(f), Recital 49 — network and information security). It is the only point at which an Article 6 basis is engaged: the visitor analytics dataset itself holds no personal data (no IP, no identifier, four non-identifying variables), so under Recital 26 it falls outside the GDPR and needs no legal basis — Sealmetrics does not rely on legitimate interest or consent for visitor analytics. What keeps Sealmetrics consentless is that the IP is never stored with analytics data, never used for identification or tracking, and never used to compute analytics.

---

## **Bot Filtering**

### **How does Sealmetrics block bots?**
We use several layers, none of which stores personal data:

- **Bot user-agent signature lists** (known crawlers, headless browsers, automation tools)
- **Curated IP/CIDR blocklists** of known bots and datacenters, checked in memory at request time — the IP is used only for this transient check and never stored with analytics data
- **Request-header consistency checks**
(A fourth layer — **Agent Analytics**, using environmental and behavioral signals to classify traffic as human vs. automated — is designed but **not live**, and collects nothing on any account today.)

See [How Sealmetrics Blocks Bot Traffic](/compliance/compliance-overview/how-sealmetrics-blocks-bot-traffic) for the full picture.

---

## **Cookies & Storage**

### Does Sealmetrics use cookies?
No.
Sealmetrics does **not** use:

- cookies
- session storage
- local storage
- fingerprinting
- cross-site IDs

---

## **Data Retention**

### How many months does Sealmetrics store my data?
We store data for a **maximum of 24 months**.
This stays inside the 25-month ceiling that [CNIL guidance](https://www.cnil.fr/en/sheet-ndeg16-use-analytics-your-websites-and-applications) sets for consent-exempt analytics — Sealmetrics deliberately applies the stricter 24-month limit.

**Note:**
- The DPA is at sealmetrics.com/dpa and the Privacy Notice at sealmetrics.com/privacy; a completed DPIA is available to customers on request.
- Sealmetrics collects four non-personal variables per hit, uses no cookies or storage, and never writes the IP address to the analytics database.
- Data is stored for a maximum of 24 months, inside the 25-month ceiling in CNIL guidance.

## Related documentation

- [Is Sealmetrics GDPR, ePrivacy, CCPA, and PECR Compliant?](/compliance/compliance-overview/is-sealmetrics-privacy-compliant) — the architecture behind these answers.
- [How Sealmetrics Blocks Bot Traffic](/compliance/compliance-overview/how-sealmetrics-blocks-bot-traffic) — the full anti-bot pipeline and why it stays consentless.
- [Do Temporary Session Identifiers (Session IDs) Require Consent Under GDPR?](/legal/gdpr-and-eprivacy/do-session-ids-require-consent) — why the Session ID and Source ID stay consent-exempt.
- [CNIL Self-Assessment: Sealmetrics Compliance](/compliance/cnil-self-assessment) — the retention and cookie-lifetime criteria referenced above.
- [Why Sealmetrics Can Measure Without Consent](/security-privacy/why-no-consent) — the consentless measurement model explained.
