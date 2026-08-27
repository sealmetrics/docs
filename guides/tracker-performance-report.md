---
title: "Tracker Performance Report: Sealmetrics vs GA4, Matomo and Piwik PRO"
description: "A technical comparison of tracking pixel weight, protocol, latency, and traffic capture: the current Sealmetrics tracker vs the legacy v1 tracker vs GA4's gtag.js, plus measured script weights for Matomo and Piwik PRO — with methodology, real measurements, and modeled network scenarios."
canonical_url: "https://docs.sealmetrics.com/guides/tracker-performance-report"
lang: "en"
date_generated: "2026-08-27T14:00:32.362Z"
source_hash: "bb952978f2e0ad75fd6e5760bdec6ce1229280e88ff47d49f5d0679041824592"
content_type: "documentation"
owner: "docs"
llm_priority: "useful"
source_file: "guides/tracker-performance-report.mdx"
publisher: "SealMetrics"
---

# Tracker Performance Report: Sealmetrics vs GA4, Matomo and Piwik PRO

Canonical page: https://docs.sealmetrics.com/guides/tracker-performance-report

The current Sealmetrics tracker weighs **1.1 KB on the wire** — 12× less than the legacy Sealmetrics v1 tracker and roughly 132× less than GA4's `gtag.js`. The two open-source-lineage alternatives sit in between and much closer to GA4 than to Sealmetrics: Piwik PRO's `ppms.js` is ~24× heavier than `t.js`, Matomo's `matomo.js` ~42× heavier. That weight, combined with a single-step dispatch chain and an ingestion pipeline rebuilt from scratch (Go → RabbitMQ → ClickHouse), translates into more hits captured: dual-tagged sites (running both Sealmetrics trackers in parallel) measure **25–30% more traffic on average with the current tracker than with v1**, with the gain concentrated in mobile traffic and in visitors geographically far from our Dublin servers.

**Key numbers at a glance:**

| Sealmetrics compared with | Wire weight advantage | Measured traffic difference |
|---|---|---|
| Legacy Sealmetrics v1 | 12× lighter | +25–30% (dual-tag average) |
| GA4 (`gtag.js`) | ~132× lighter | +25–45% (EU markets, estimate) |
| Matomo (`matomo.js`) | ~42× lighter | not measured |
| Piwik PRO (`ppms.js`) | ~24× lighter | not measured |

Matomo and Piwik PRO appear here on **script weight only** — see [Matomo and Piwik PRO](#matomo-and-piwik-pro) for why this report makes no timing or traffic-capture claim about either.

**Note:**
Two dated passes, both taken the same way: one GET per script with `Accept-Encoding: gzip`, bytes counted on disk, headers read from that same GET.

- **9 August 2026** — Sealmetrics (current and v1) and GA4. These are the figures used throughout the report.
- **27 August 2026** — Matomo and Piwik PRO added, with Sealmetrics and GA4 re-measured alongside them so the comparison shares one pass.

Vendor scripts change: `gtag.js` went from ~171 KB to ~146 KB between earlier passes, and drifted another ~1 KB between these two. Treat every figure here as a dated snapshot, not a constant.

## Methodology

The weight and latency figures in this report come from **direct measurements** taken in July 2026 against production scripts, downloaded exactly as a real browser receives them (`Accept-Encoding: gzip`, 3 samples per measurement, fiber connection from Spain):

- **Sealmetrics (current)**: `t.sealmetrics.com/t.js` — the production script.
- **Sealmetrics v1 (legacy)**: `app.sealmetrics.com/tag/v3/tracker` (version `sm 16.x`).
- **GA4**: `googletagmanager.com/gtag/js` with the ID of a real GA4 property in production.
- **Matomo**: `demo.matomo.cloud/matomo.js` — the vendor's own public demo instance (27 August pass).
- **Piwik PRO**: `demo.piwik.pro/ppms.js` — the vendor's own public demo instance (27 August pass).

Script URLs and tag configurations were extracted from the **real Google Tag Manager container** of a European e-commerce site that runs both Sealmetrics trackers in parallel alongside GA4. To preserve the site's anonymity, the GA4 figures and latency values have been rounded and lightly adjusted; orders of magnitude and ratios between systems are preserved. The Sealmetrics tracker weights are exact — they are product scripts, identical for every customer.

### What is measured and what is modeled

- **Measured**: script weights (exact bytes, compressed and uncompressed), HTTP protocol and headers, the latency table below (median of 3 samples from a single location), IP addresses, and GTM configuration. Absolute latency values depend on the origin network; the relative differences between systems hold.
- **Modeled**: the four network scenarios (round-trip, bandwidth, and CPU arithmetic built on top of the measurements) and the per-device parse costs. These are always labeled as estimates.
- **Business data**: the +25–30% traffic difference vs v1 comes from Sealmetrics accounts running both trackers in parallel on the same site (dual-tagging). The +25–45% vs GA4 is a reasoned estimate, not a measurement of any single site.

### Reproducing the weight measurements

The weight figures are the part of this report easiest to verify independently, and the one most often cited back at us. Four things trip up a re-run:

- **`t.js` needs a query parameter**: `https://t.sealmetrics.com/t.js?id=<account-id>`. A bare GET returns HTTP 400. The account id is echoed into the script body, so the uncompressed size is a function of its length by a handful of bytes — the canonical 1,991 B corresponds to a 4-character id.
- **Do not read `content-encoding` from `curl -I`.** Servers routinely skip compression on HEAD requests, so a gzipped asset looks uncompressed and the wire figure comes out several times too high. Read the headers from the same GET that fetches the bytes.
- **Do not use `curl`'s `%{size_download}`.** It reports bytes handed to the transfer regardless of `--compressed`. Count the bytes on disk instead.
- **Validate against `t.js` before measuring any vendor.** It should return ~1,128 B on the wire and 1,991 B uncompressed (the wire figure varies by a byte or two — gzip encoder variance). If it does not, the method is wrong and every other number in the run is too.

### How consent is treated

Every GA4 measurement and model in this report represents its technical chain *once the tag fires* — that is, GA4's **best case** (a visitor who has already granted consent). The cost of the consent banner is quantified separately, as volume loss, in the traffic impact section. Sealmetrics trackers have no such wait: they are consentless measurement by design (no cookies, no personal identifiers).

## Script weight

What travels over the network determines when the first hit can fire. The legacy v1 tracker is also served **uncompressed**, so its wire weight is its raw weight.

| | Sealmetrics (current) | Sealmetrics v1 (legacy) | GA4 (gtag.js) |
|---|---|---|---|
| **Transferred over the network** | **1.1 KB** (gzip) | 13.7 KB (no gzip) | ~146 KB (gzip) |
| **Uncompressed (what the CPU parses)** | 2.0 KB | 13.7 KB | ~409 KB |
| **Relative wire weight** | 1× | 12× | ~132× |

**The TCP detail that matters:** the current tracker's 1.1 KB fits in a single packet and arrives in the first round-trip. The v1 tracker's 13.7 KB uncompressed sits right at the edge of TCP's initial congestion window (~14.6 KB), and GA4's ~146 KB needs 4–5 slow-start round-trips. When the visitor is far from the server, every extra round-trip multiplies latency.

## Matomo and Piwik PRO

Matomo and Piwik PRO are the alternatives most often evaluated alongside Sealmetrics by teams leaving GA4 for privacy reasons, so they belong in a weight comparison even though the rest of this report predates them. Both descend from the same open-source `piwik.js` tracking client, and both land between Sealmetrics and GA4 — far closer to GA4.

Measured **27 August 2026**, identical method to the pass above: one GET per script with `Accept-Encoding: gzip`, bytes counted on disk, headers read from that same GET. Sealmetrics and GA4 were re-measured in the same pass so all four rows share one snapshot.

| Vendor | Script measured | On the wire (gzip) | Parsed by the CPU | Wire weight vs Sealmetrics |
|---|---|---|---|---|
| **Sealmetrics** | `t.sealmetrics.com/t.js` | **1,126 B** | **1,991 B** | 1× |
| Piwik PRO | `demo.piwik.pro/ppms.js` | 26,762 B (~26 KB) | 69,075 B (~67 KB) | **~24×** |
| Matomo | `demo.matomo.cloud/matomo.js` | 47,354 B (~46 KB) | 156,183 B (~153 KB) | **~42×** |
| GA4 | `googletagmanager.com/gtag/js` | 148,679 B (~145 KB) | 417,429 B (~408 KB) | **132×** |

Reading these numbers:

- **Piwik PRO is the lightest of the three incumbents**, and by a wide margin over GA4 — roughly a fifth of `gtag.js` on the wire. It is still ~24× the Sealmetrics tracker, and its ~67 KB of JavaScript still has to be parsed on the visitor's device.
- **Matomo sits between the two**, at ~42×. Its ~153 KB parse cost is the figure that matters on mobile: the TCP and CPU arguments made earlier in this report apply to it in the same direction as to GA4, just at a smaller multiple.
- **`matomo.js` is not a fixed size.** Matomo compiles the tracker code of installed plugins into the file it serves — the build measured here carries the MediaAnalytics and FormAnalytics extensions. A bare install serves less, a plugin-heavy one more. Treat ~46 KB as this instance's figure, not a constant for every Matomo deployment.
- **Only the Sealmetrics tracker fits in one TCP packet.** At 1,126 B it arrives in the first round-trip; `ppms.js` and `matomo.js` both exceed TCP's initial congestion window (~14.6 KB) and need extra slow-start round-trips before the script is even complete.
- **GA4 drifted ~1 KB between the 9 and 27 August passes** — visible in the ~146 KB above versus ~145 KB here. The ratio holds at 132×, and the drift is the reason these figures carry dates.

**Note:**
This is a **script-weight measurement only**. The delivery-chain, latency, time-to-first-hit, hit-transport and traffic-capture sections of this report rest on a field run over a real site carrying the Sealmetrics trackers and GA4, plus dual-tag traffic data. **No equivalent run exists for Matomo or Piwik PRO**, so this report deliberately makes no timing, transport or capture claim about either: their rows appear in the weight tables and nowhere else. The structural arguments about download and parse cost follow from the measured weights; anything about when their hit actually leaves the device would be an estimate we have not made.

## Delivery protocol and infrastructure

| | Sealmetrics (current) | Sealmetrics v1 (legacy) | GA4 |
|---|---|---|---|
| Protocol | HTTP/2 | HTTP/1.1 | HTTP/2 + HTTP/3 |
| Compression | gzip (1.1 KB) | none | gzip |
| Origin | Dedicated Go service (Dublin) | nginx (Dublin) | Google global anycast CDN |
| Requests until first hit | 1 script → immediate beacon | loader + script + hit (2 steps) | gtag ~146 KB + collect on a 2nd domain |
| Hit transport | `sendBeacon` — survives page close | standard request after tracker loads | beacon/fetch after evaluating ~409 KB |
| Data pipeline | Go → RabbitMQ → ClickHouse (columnar, real time) | legacy monolithic stack | batch processing; reports lag 24–48 h with thresholds |

## Measured latency (fiber, Spain)

Median of 3 samples with warm DNS. Even in the best possible network scenario, the current tracker completes its download in roughly half the time of v1 and GA4.

| Phase | Sealmetrics (current) | Sealmetrics v1 | GA4 |
|---|---|---|---|
| TCP connect (≈ RTT) | ~34 ms | ~48 ms | ~19 ms (local edge) |
| TLS established | ~80 ms | ~95–100 ms | ~55–70 ms |
| Time to first byte | ~110 ms | ~190–280 ms | ~110–140 ms |
| Script fully downloaded | **~110 ms** | ~190–340 ms | ~210–290 ms |

GA4 wins on network proximity (a Google edge in every city) but loses it all on volume: even with a better RTT, downloading ~146 KB takes twice as long as downloading 1.1 KB from Dublin — and after that, ~409 KB of JavaScript still has to be parsed on the visitor's device.

## Time to first hit: four network scenarios

The tables below break the full pageview path into four phases: **connection** (DNS + TCP + TLS — driven by distance to the server), **download** (driven by script weight), **CPU** (parsing and executing the JavaScript — driven by uncompressed weight and device), and **hit dispatch** (v1 needs an extra round-trip; GA4 connects to a second domain; in the current tracker the beacon fires inside the execution phase). These are **modeled estimates** built on the measurements above. This is the time from tag fire until the pageview leaves the device — the window during which an abandonment is a lost hit.

**Note:**
They model the technical chain from the moment the tag fires — a visitor with consent already granted. For a new EU visitor, GA4 additionally requires prior banner acceptance: an extra delay of seconds (or forever, if they never accept) that does not appear in these numbers.

**Fiber / fast 4G · Spain** (RTT ~30 ms to Dublin, ~15 ms to Google edge, fast CPU):

| | Connection | Download | CPU | Hit dispatch | Total |
|---|---|---|---|---|---|
| Sealmetrics (current) | ~80 ms | ~30 ms | ~2 ms | included | **~0.1 s** |
| Sealmetrics v1 | ~95 ms | ~145 ms | ~15 ms | ~45 ms | ~0.2–0.3 s |
| GA4 | ~60 ms | ~170 ms | ~180 ms | ~60 ms | ~0.5–0.7 s |

GA4's connection phase is the shortest of the three — its edge is 15 ms away. It still finishes last: download and CPU consume the advantage twenty times over.

**Mid 4G · mobile** (RTT ~80 ms to Dublin, ~50 ms to edge, 8 Mbps, mid-range CPU):

| | Connection | Download | CPU | Hit dispatch | Total |
|---|---|---|---|---|---|
| Sealmetrics (current) | ~180 ms | ~90 ms | ~5 ms | included | **~0.3 s** |
| Sealmetrics v1 | ~260 ms | ~250 ms | ~35 ms | ~80 ms | ~0.6–0.9 s |
| GA4 | ~120 ms | ~380 ms | ~400 ms | ~100 ms | ~1.0–1.5 s |

On a mid-range phone, CPU becomes GA4's largest phase: parsing ~409 KB costs more than the current tracker's entire chain.

**3G / weak signal** (RTT ~200 ms, 1.5 Mbps, slow CPU):

| | Connection | Download | CPU | Hit dispatch | Total |
|---|---|---|---|---|---|
| Sealmetrics (current) | ~430 ms | ~220 ms | ~10 ms | included | **~0.7 s** |
| Sealmetrics v1 | ~650 ms | ~800 ms | ~100 ms | ~250 ms | ~1.6–2.2 s |
| GA4 | ~350 ms | ~1.8 s | ~1.6 s | ~400 ms | ~3.5–5 s |

At 1.5 Mbps, GA4 spends ~3.4 s just downloading and parsing. The current tracker has had the hit delivered for 3 seconds by the time gtag is still downloading.

**Remote visitor · e.g. LATAM → Dublin** (RTT ~220 ms to Dublin, ~30 ms to local Google edge, 10 Mbps):

| | Connection | Download | CPU | Hit dispatch | Total |
|---|---|---|---|---|---|
| Sealmetrics (current) | ~460 ms | ~280 ms | ~10 ms | included | **~0.7–0.9 s** |
| Sealmetrics v1 | ~680 ms | ~500 ms | ~40 ms | ~250 ms | ~1.4–1.9 s |
| GA4 | ~80 ms | ~330 ms | ~450 ms | ~140 ms | ~0.9–1.4 s |

The most illustrative case: GA4 has its best connection here (an edge in the visitor's own city) and Sealmetrics its worst (2 round-trips of ~220 ms to Dublin). Even with that network disadvantage, **the current tracker delivers the hit first**: its download and CPU phases are so small that distance is the only thing it pays for. GA4 wins the connection and loses the race on volume and CPU.

### Round-trips and bytes

| | Sealmetrics (current) | Sealmetrics v1 | GA4 |
|---|---|---|---|
| TLS connections needed | 1 | 1 | 2 (gtag + collect) |
| Round-trips until the hit | ~3 | ~5–6 | ~7–9 |
| Bytes over the network | 1.1 KB | 13.7 KB | ~170 KB |
| JavaScript to parse | 2.0 KB | 13.7 KB | ~510 KB |

### The hidden cost: parsing JavaScript has no CDN

A global edge brings bytes closer, but parsing always happens on the visitor's device. Estimated parse + execution cost by device class:

| Device | Sealmetrics · 2 KB | v1 · 13.7 KB | GA4 · ~510 KB |
|---|---|---|---|
| Laptop / high-end | under 1 ms | ~5 ms | ~120–250 ms |
| Mid-range phone | ~2 ms | ~15 ms | ~300–500 ms |
| Low-end phone | ~5 ms | ~40 ms | ~800–1,500 ms |

This is the structural reason GA4 cannot compensate for its weight with infrastructure: Google can put an edge in every city, but it cannot put a faster CPU in every visitor's pocket. The current tracker attacks the problem from the other side — making sure there is almost nothing to download or parse.

## Why the current tracker captures hits the others lose

Every visit that abandons the page **before** the pixel fires is invisible traffic. The current tracker's vulnerability window is ~0.1–0.9 s depending on network; v1's is 2–3× larger — and v1 can also lose the hit to a race condition even when the visitor stays.

**Legacy v1 chain — two steps with a race:**

1. An inline loader snippet creates the `sealmetrics.q` queue.
2. The 13.7 KB tracker downloads (HTTP/1.1, no gzip).
3. The script parses and executes; tags call `window.sm`.
4. If the tracker has not loaded yet: `"sm2 plugin is not available"` — **hit lost, no retry**.
5. The hit request fires (an additional round-trip).

**Current tracker chain — one step:**

1. `t.js` downloads: 1.1 KB, HTTP/2, one packet.
2. The pageview fires from inside the script itself via `sendBeacon` — no dependencies, no race.
3. The beacon survives even if the visitor closes or navigates away: the browser delivers it anyway.
4. The Go ingestion service acknowledges in milliseconds → RabbitMQ → ClickHouse.

### The hit's life insurance: sendBeacon

There is a transport difference that multiplies everything above. A classic request (`XMLHttpRequest`, `fetch`) is **tied to the page's lifetime**: if the visitor closes the tab or navigates to another URL while the request is in flight, the browser cancels it and the hit is lost. `navigator.sendBeacon()` inverts the model: the page **hands the packet to the browser** and steps aside — the browser queues it internally and delivers it even after the page no longer exists. It is the API browsers themselves designed for telemetry.

Verified against the production scripts: the **current tracker uses `sendBeacon`** (with `fetch keepalive` as fallback, which has the same property), while the **legacy v1 tracker does not use it at all** — it sends via a cancelable `XMLHttpRequest`. In practice: as soon as the current tracker executes (~0.1–0.3 s), the hit already belongs to the browser and closing the page cannot lose it; v1 additionally needs to **complete the round-trip to the server** with the page still alive.

The band of visits lasting **between ~0.3 s and ~1.5–2 s** — instant bounces from paid traffic, accidental taps on mobile, abandonments due to slowness — is captured systematically by the current tracker and lost systematically by v1. It is one of the clearest signatures of the dual-tag gap: segmented by visit duration, the current tracker's surplus should concentrate in the shortest visits.

| Hit transport | Sealmetrics (current) | Sealmetrics v1 | GA4 |
|---|---|---|---|
| Mechanism | `sendBeacon` + `fetch keepalive` | `XMLHttpRequest` | `sendBeacon`/`fetch keepalive` |
| Survives page close? | Yes | No — canceled | Yes |
| Moment the hit is secured | ~0.1–0.3 s | ~0.5–2 s (when the XHR completes) | ~0.5–1.5 s (after parsing gtag, and only with consent) |

**Note:**
GA4 also uses beacon-style transport — its problem is not the transport but that it reaches the dispatch point much later (weight + CPU) and only after consent. And `sendBeacon` is *best effort*: if the browser crashes or the OS kills the process, the beacon can be lost — practical reliability is very high, but not literally 100%. The current tracker also cannot measure a visitor who leaves before `t.js` executes; loading it through GTM widens that window, which is one more reason to install the snippet directly in the `<head>`.

## Impact on measured traffic

| Comparison | Traffic difference | Where it comes from |
|---|---|---|
| Current vs legacy v1 | **+25–30% on average** | Observed on dual-tagged accounts (both trackers in parallel on the same site). Gain concentrated in mobile traffic, slow connections, and visitors far from Dublin: earlier fire, race-free chain, `sendBeacon`, HTTP/2, and compression. |
| Current vs GA4 (EU markets) | **+25–45% (estimate)** | Three GA4 losses the Sealmetrics tracker does not have: consent banner rejection/ignoring (~20–35% of visitors), blocking of Google domains by browsers and filter lists (~10–15%, partially overlapping), and abandonment before gtag fires (~2–5% on mobile). |

### Session window change ("Rejoined Traffic"): 6 h → 2 h

There is also a **definitional** factor that pushes the current tracker's numbers up, worth keeping in mind when reading the gap: the session re-entry window. In v1, if a visitor clicked through to the site again within **6 hours** of their entrance, that visit was classified as *Rejoined* — it did not open a new entrance. In the current tracker that window is **2 hours**.

Example: a user with 2 clicks 5 hours apart — v1 counted **1 entrance + 1 pageview** (the second click became Rejoined); the current tracker counts **2 entrances + 2 pageviews**. Same user behavior, more entrances and pageviews recorded.

This effect is **more granular measurement, not newly captured traffic**: it adds to the real capture gains (timing, `sendBeacon`, race-free chain) in the total v1-vs-current difference. To isolate it in your own data, look at the segment of re-entries between 2 and 6 hours — that is exactly the band where the two definitions diverge.

## Deployment recommendations

- **Do not gate Sealmetrics tags behind consent in GTM.** A frequent misconfiguration: if Sealmetrics tags sit behind the CMP's consent state, you give up their main advantage — Sealmetrics can measure without consent by design (no cookies, no personal identifiers). Fire them on *Consent Initialization* or with no consent condition.
- **Install the snippet directly in the `<head>`, outside GTM.** Loaded through GTM, the tracker inherits the container's latency (typically 100–250 KB): if GTM is slow, blocked, or the visitor leaves before it loads, the tracker cannot measure either. With the snippet directly in the `<head>` you capture the full advantage shown above.
- **Compare v1 and the current tracker with homogeneous metrics.** When evaluating a dual-tag, compare pageviews with pageviews and entrances with entrances — and account for the different session windows (Rejoined at 6 h in v1 vs 2 h in the current tracker, see above): mixing metrics or ignoring the window inflates or hides differences.
- **Keep the dual-tag for a validation period.** Running both trackers in parallel lets you quantify the capture difference with your own data, segmented by device and geography, before retiring v1.

## Limitations and honest notes

- Latencies were measured from a single location (fiber, Spain) in July 2026; the four network scenarios are **models**, not field measurements, and should be cited as such.
- The GA4 timings above are its **best case**: they exclude the consent wait, which for new EU visitors adds seconds or prevents measurement entirely.
- The +25–30% vs v1 is an average across dual-tagged accounts; each site will have its own figure depending on its device, network, and geography mix. The GA4 range depends critically on each site's CMP acceptance rate.
- Part of the entrance increase vs v1 is definitional, not capture: the Rejoined session window changed from 6 h (v1) to 2 h (current tracker).
- EasyPrivacy includes the rule `||sealmetrics.com^$third-party`: visitors with uBlock/AdGuard block both Sealmetrics tracker versions equally. The advantage over GA4 lies in consent and timing, not in ad blockers.
- Matomo and Piwik PRO were measured on **each vendor's own public demo instance**, the most neutral source available for products that are otherwise self-hosted or account-provisioned. The file a given install serves can differ — Matomo in particular bundles installed plugins' tracker code into `matomo.js`.
- There is **no field run, no dual-tag data and no latency measurement for Matomo or Piwik PRO**. Their script weights are measured; nothing else about them in this report is claimed.
- To preserve the anonymity of the reference site, GA4 figures and latencies are rounded and lightly adjusted (see methodology); Sealmetrics tracker weights are exact.
