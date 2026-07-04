# cs-agent evaluation harness

A regression gate for the Sealmetrics **cs-agent** (the assistant that ingests
this docs repo and answers customer questions). It runs a set of golden
question → expected-source cases and scores whether the agent retrieves the
right pages and states the right facts.

Run it before and after any change to the docs corpus, the ingest pipeline, or
the agent itself, and watch the score. Without this, there's no way to know if a
doc edit or a prompt tweak made the agent better or worse.

## Files

- `cases.jsonl` — the golden set. One JSON object per line:
  ```json
  {"id": "install-basic", "category": "implementation", "lang": "en",
   "question": "How do I install the Sealmetrics tracker?",
   "expected_sources": ["/implementation/tracker/installation"],
   "must_include": [["t.sealmetrics.com/t.js", "t.js"], ["script"], ["head"]]}
  ```
  - `expected_sources` — doc slugs the agent should retrieve/cite. Validated to
    exist in `docs/`.
  - `must_include` — fact groups. Each group is a list of synonyms; the group is
    satisfied if the answer contains **any** of them (case-insensitive). Use
    language-neutral tokens (code, product names, numbers) so the check survives
    the agent answering in English or Spanish.
- `run-eval.mjs` — the runner (Node ≥20, no dependencies).

## Usage

```bash
# Validate the golden set only — every expected_source exists in docs/.
# Runs today, no backend needed. Good pre-commit check when editing cases.
node cs-agent-eval/run-eval.mjs --check

# Run all cases against the live agent and print a scorecard.
CS_AGENT_URL=https://<cs-agent-host>/query node cs-agent-eval/run-eval.mjs

# Filters and JSON report.
node cs-agent-eval/run-eval.mjs --category api
node cs-agent-eval/run-eval.mjs --lang es
node cs-agent-eval/run-eval.mjs --json report.json
```

Env: `CS_AGENT_URL` (required to run), `CS_AGENT_API_KEY` (optional bearer),
`PASS_SOURCE_RECALL` (default 0.5), `PASS_FACT_COVERAGE` (default 0.6).

## Wiring the agent

`run-eval.mjs` calls one function, `queryAgent(question)`, which must return
`{ answer: string, sources: string[] }`. The default implementation does a JSON
`POST { question }` and reads `{ answer, sources }`, tolerating a few common
field names (`response`/`text`, `citations`/`documents`/`context`). If your
deployment differs, edit that single function — it's clearly marked at the top
of the file.

Scoring matches each expected slug as a substring against both the cited sources
**and** the answer text, so even a partial `sources` shape still scores.

## Scoring

Per case:
- **source recall** = expected sources found / expected sources total
- **fact coverage** = fact groups satisfied / fact groups total
- **pass** = `source_recall ≥ PASS_SOURCE_RECALL` and `fact_coverage ≥ PASS_FACT_COVERAGE`

The scorecard aggregates pass-rate overall and per category. Exit code is non-zero
if any case fails, so it can gate CI.

## Extending

Add lines to `cases.jsonl` and run `--check`. Grow it from real support tickets:
every question the agent got wrong (or escalated) becomes a new case, so the set
tracks actual failure modes over time. Aim to cover each docs cluster and both
languages. This is the feedback loop — the harness is only as good as the cases,
and the cases should come from what real users ask.
