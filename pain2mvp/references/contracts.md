# Painpoint To PRD Contracts

This file is the single reference contract for discovery, scoring, TiDB persistence, and PRD handoff.

## Operating model

- TiDB Cloud Zero is the canonical artifact store.
- `agent_memory` stores raw evidence rows.
- `opportunity_snapshots` stores ranked opportunities.
- `prds` stores final PRDs in both structured and markdown form.
- The coordinator is the only role allowed to score, rank, persist opportunities, or persist PRDs.
- Optional worker agents may only return `WorkerEvidenceBundle`.

## Scoring rubric

Score each opportunity from `0-100` using this breakdown:

- `recurrence` (`0-25`): repeated pain across independent users, threads, or communities
- `severity_and_urgency` (`0-20`): clear workflow, deadline, quality, or compliance harm
- `workaround_burden` (`0-20`): copy-paste chains, spreadsheets, repeated review loops, brittle tool stitching
- `buying_or_switching_signal` (`0-15`): willingness to pay, switch, or actively seek alternatives
- `evidence_quality_and_freshness` (`0-20`): recent, concrete, independently corroborated evidence

Confidence is separate from score:

- `High`: repeated, recent, concrete, and corroborated
- `Medium`: directional but patchy or source-concentrated
- `Low`: interesting hypothesis with thin evidence

Use `insufficient evidence` when the evidence is too weak to rank confidently.

## EvidenceRow

Use this payload with `save-evidence`.

```json
{
  "source_url": "https://example.com/thread",
  "source_type": "reddit_comment",
  "author_handle": "user123",
  "community_or_site": "r/startups",
  "published_at": "2026-03-20T12:00:00Z",
  "snippet": "We still stitch three tools together and miss deadlines.",
  "pain_cluster_id": "run_20260328:cluster_a",
  "engagement_signals": {
    "score": 18,
    "comments": 6
  },
  "retrieval_timestamp": "2026-03-28T13:00:00Z",
  "traceability_status": "verified"
}
```

## WorkerEvidenceBundle

Workers return only evidence and collection notes.

```json
{
  "run_id": "run_20260328_01",
  "worker_id": "worker_reddit_competitor_a",
  "query_scope": {
    "source": "reddit",
    "query_family": "competitor complaints"
  },
  "evidence_rows": [
    {
      "source_url": "https://example.com/thread",
      "source_type": "reddit_post",
      "author_handle": "user123",
      "community_or_site": "r/legaltech",
      "published_at": "2026-03-20T12:00:00Z",
      "snippet": "The workflow is manual and hard to review.",
      "pain_cluster_id": "run_20260328_01:cluster_a",
      "engagement_signals": {
        "score": 41
      },
      "retrieval_timestamp": "2026-03-28T13:00:00Z",
      "traceability_status": "verified"
    }
  ],
  "notes": "No high-signal Hacker News threads found for this slice."
}
```

## OpportunitySnapshot

Use this payload with `save-opportunity`.

```json
{
  "opportunity_id": "opp_20260328_01",
  "run_id": "run_20260328_01",
  "rank": 1,
  "title": "Review-safe drafting workflow for in-house IP teams",
  "affected_user": "In-house IP counsel at lean legal teams",
  "job_to_be_done": "Draft and review work product faster without introducing compliance risk",
  "pain_statement": "Teams lose time and confidence when drafting requires manual stitching and repeated review passes.",
  "score_total": 83,
  "score_breakdown_json": {
    "recurrence": 21,
    "severity_and_urgency": 18,
    "workaround_burden": 17,
    "buying_or_switching_signal": 11,
    "evidence_quality_and_freshness": 16
  },
  "confidence": "High",
  "confidence_reason": "Repeated and recent complaints across multiple threads with concrete workflow details.",
  "pain_cluster_key": "run_20260328_01:cluster_a",
  "supporting_evidence_json": [
    {
      "source_url": "https://example.com/thread",
      "note": "Manual review loop complaint"
    }
  ],
  "contradictions_json": [
    {
      "note": "Some users tolerate the workflow when volume is low."
    }
  ],
  "query_scope_json": {
    "sources": ["reddit", "hacker_news"],
    "date_range_days": 365
  }
}
```

## PrdRecord

Use this payload with `save-prd`.

```json
{
  "prd_id": "prd_20260328_01",
  "run_id": "run_20260328_01",
  "opportunity_id": "opp_20260328_01",
  "title": "Review-safe drafting assistant",
  "status": "draft",
  "target_user": "In-house IP counsel",
  "goal": "Reduce manual drafting and review loops for the first high-confidence slice.",
  "structured_prd_json": {
    "problem": "Drafting is slow and brittle.",
    "target_user": {
      "primary_user": "In-house IP counsel",
      "context_of_use": "Lean legal teams with deadlines"
    },
    "goal": "Deliver a thin slice that speeds drafting while preserving reviewability."
  },
  "markdown_snapshot": "# Lightweight PRD: Review-safe drafting assistant\n\n## Problem\nDrafting is slow and brittle.",
  "source_evidence_json": [
    {
      "opportunity_id": "opp_20260328_01",
      "source_url": "https://example.com/thread"
    }
  ]
}
```

## TiDB column mapping

### `agent_memory`

- `source_url`
- `source_type`
- `author_handle`
- `community_or_site`
- `published_at`
- `snippet`
- `pain_cluster_id`
- `engagement_signals`
- `retrieval_timestamp`
- `traceability_status`

### `opportunity_snapshots`

- `opportunity_id`
- `run_id`
- `rank`
- `title`
- `affected_user`
- `job_to_be_done`
- `pain_statement`
- `score_total`
- `score_breakdown_json`
- `confidence`
- `confidence_reason`
- `pain_cluster_key`
- `supporting_evidence_json`
- `contradictions_json`
- `query_scope_json`
- `created_at`

### `prds`

- `prd_id`
- `run_id`
- `opportunity_id`
- `title`
- `status`
- `target_user`
- `goal`
- `structured_prd_json`
- `markdown_snapshot`
- `source_evidence_json`
- `created_at`
- `updated_at`

## Helper script commands

All commands accept JSON via stdin or `--input-file <path>`.

### `save-evidence`

- Input: `EvidenceRow`
- Output:

```json
{
  "ok": true,
  "command": "save-evidence",
  "result": {
    "ok": true,
    "command": "save-evidence",
    "pain_cluster_id": "run_20260328:cluster_a",
    "source_url": "https://example.com/thread"
  }
}
```

### `save-opportunity`

- Input: `OpportunitySnapshot`
- Output:

```json
{
  "ok": true,
  "command": "save-opportunity",
  "result": {
    "ok": true,
    "command": "save-opportunity",
    "run_id": "run_20260328_01",
    "opportunity_id": "opp_20260328_01"
  }
}
```

### `get-opportunity`

- Input: `{"opportunity_id":"opp_20260328_01"}` or `{"run_id":"run_20260328_01","rank":1}`
- Output: one `OpportunitySnapshot`

### `save-prd`

- Input: `PrdRecord`
- Output:

```json
{
  "ok": true,
  "command": "save-prd",
  "result": {
    "ok": true,
    "command": "save-prd",
    "prd_id": "prd_20260328_01",
    "opportunity_id": "opp_20260328_01",
    "run_id": "run_20260328_01"
  }
}
```

### `get-prd`

- Input: `{"prd_id":"prd_20260328_01"}`, `{"opportunity_id":"opp_20260328_01"}`, `{"run_id":"run_20260328_01"}`, or `{"latest":true}`
- Output: one `PrdRecord`

### `list-runs`

- Input: optional empty object
- Output: newest-first run metadata derived from `opportunity_snapshots`

## PRD generation rules

- Generate a PRD only from a persisted `OpportunitySnapshot`.
- Carry forward the strongest evidence and constraints instead of inventing scope.
- Optimize for a coding agent, not an executive audience.
- Prefer a thin vertical slice.
- Include explicit non-goals, constraints, and acceptance criteria.

## Output quality rules

- Prefer repeated, concrete complaints over clever one-offs.
- Separate category pain from vendor-specific pricing, support, or trust complaints.
- Preserve contradictions when evidence conflicts.
- Down-rank hype, memes, and unsupported wishlists.
- Keep evidence traceable through `source_url` and `pain_cluster_id`.
