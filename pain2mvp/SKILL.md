---
name: painpoint-to-prd
description: discover and structure product opportunities from public user discussions, then convert a selected opportunity into a lightweight prd for a coding agent. use when the user wants to mine reddit or hacker news for recurring pain points, unmet needs, competitor complaints, or market signals around an idea, user group, or product category, or when the user wants to turn one identified opportunity into a scoped brief for codex or claude code.
---

# Painpoint To PRD

## What this skill does

Use this skill in two modes:

1. Discovery mode: find and rank product opportunities from public user discussion evidence.
2. PRD mode: turn one persisted opportunity into a lightweight PRD for a coding agent.

If the user asks for both, discovery always comes first.

## Source of truth

- `references/contracts.md` is the only reference contract for scoring, payloads, TiDB persistence, and PRD handoff.
- TiDB Cloud Zero is the canonical store for evidence, opportunities, and PRDs.
- The current OpenClaw model remains the default for all work in v1.

## Required environment

- Bright Data credentials must be present for evidence collection.
- `TIDB_DATABASE_URL` must be present for any persistence or PRD retrieval.
- `TIDB_DATABASE_URL` must include a database name and `?sslaccept=strict`.

When required environment is missing:

- fail early
- say exactly which variable is missing or invalid
- do not continue with partial persistence

## Command surface

Use these repo-local commands:

- `npm run bootstrap:tidb`
- `npm run tidb -- save-evidence`
- `npm run tidb -- save-opportunity`
- `npm run tidb -- get-opportunity`
- `npm run tidb -- save-prd`
- `npm run tidb -- get-prd`
- `npm run tidb -- list-runs`

All payload shapes are defined in `references/contracts.md`.

## Workflow routing

### Discovery mode

Use this for:

- idea-led research
- user-group research
- competitor complaint research
- mixed requests that need ranking before scoping

Steps:

1. Normalize the brief.
   - combine idea, user group, and competitor signals when present
   - infer synonyms and adjacent workflow terms
   - default to the last 12 months of discussion and favor the last 180 days in ranking
2. Collect evidence with the Bright Data scripts already available in the environment.
   - use the configured search and scrape scripts
   - favor concrete workflow pain, failed workarounds, switching intent, and complaint threads
   - down-rank praise, memes, and unsupported wishlists
3. Persist raw evidence to `agent_memory` with `save-evidence`.
4. Cluster evidence into underlying pains.
   - merge phrasing variants for the same job
   - split clusters when root cause differs
5. Score and rank opportunities using `references/contracts.md`.
6. Persist ranked opportunities with `save-opportunity`.
7. Return a ranked summary that includes:
   - `run_id`
   - `opportunity_id`
   - score
   - confidence
   - contradictions or caveats
   - suggested next cuts

### PRD mode

Use this when the user wants a brief for one specific opportunity.

Steps:

1. Resolve the target opportunity.
   - prefer user-supplied `opportunity_id`
   - otherwise use an explicit `run_id` plus rank
   - if neither is provided, fetch the latest valid opportunity only when the choice is unambiguous
2. Read the persisted opportunity with `get-opportunity`.
3. Generate the PRD from the persisted opportunity and its evidence, not from chat memory.
4. Persist the final PRD with `save-prd`.
5. Return the PRD in human-readable form and include the stored `prd_id`.

## Optional subagents

- Default path is single-agent.
- Use optional worker agents only when the brief is broad enough to justify sharding evidence collection.
- Workers may only return `WorkerEvidenceBundle`.
- The coordinator is the only role allowed to:
  - cluster evidence
  - score opportunities
  - write `opportunity_snapshots`
  - write `prds`

## Non-drift rules

- Never invent SQL in prompts. Use the helper scripts.
- Never generate a PRD from an unpersisted opportunity summary.
- Never use conversational numbering like "opportunity #2" as the only identifier once results are persisted.
- Never claim product-market fit. This workflow produces directional evidence, not final validation.
- When evidence is weak, say `insufficient evidence`.
- Preserve contradictions when sources disagree.

## Quality bar

- Prefer repeated, concrete complaints over clever one-offs.
- Distinguish category pain from vendor-specific pricing, support, or policy complaints.
- Keep evidence traceable through `source_url`, `pain_cluster_id`, and persisted identifiers.
- Optimize PRDs for a coding agent with explicit scope, non-goals, constraints, and acceptance criteria.

## Example triggers

- "What are the top pain points for in-house intellectual property professionals?"
- "What are Harvey users complaining about?"
- "Turn the latest high-confidence opportunity into a PRD."
- "Generate a PRD from opportunity `opp_20260328_01`."
