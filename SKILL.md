---
name: pain2mvp
description: Discover and structure product opportunities from public user discussions, then convert top opportunities into a lightweight PRD for a coding agent. Use when the user needs direction on what to build, or wants to find recurring pain points, unmet needs, competitor complaints, or market signals around an idea, user group, or product category.
version: 1.0.3
metadata:
  openclaw:
    skillKey: pain2mvp
    requires:
      bins:
        - node
        - npm
    emoji: "🔬"
    homepage: "https://github.com/zhao-weijie/pain2mvp"
---

# Painpoint To MVP

## Modes of Operation
1. **Discovery Mode**: Find and rank product opportunities from public user discussion evidence. (Always run this first if the user asks for both modes).
2. **PRD Mode**: Turn one persisted opportunity into a lightweight PRD for a coding agent.

## Permitted Commands
ONLY use these commands:
- `npm run bootstrap:db` - Run once if DB not initialized.
- `npm run db -- save-evidence-batch` - Pass scraped evidence here.
- `npm run db -- save-opportunity-batch` - Pass clustered opportunities here.
- `npm run db -- get-opportunity` - Read an opportunity by ID.
- `npm run db -- search-similar-evidence` - Pass a `query` string to find duplicates or clusters.
- `npm run db -- save-prd` - Save a generated PRD.
- `npm run db -- get-prd` - Read a generated PRD.
- `npm run db -- list-runs` - List past runs.

*Fallback Only: `save-evidence` and `save-opportunity` should ONLY be used if batch commands absolutely fail.*

## Core Constraints & Rules
- **Documentation**: You MUST read `references/contracts.md` ONCE per run. Rely ONLY on this for schemas and rubrics. 
- **Tooling**: NEVER invent SQL. Use only the provided `npm run db` helper commands.
- **Data Entry**: Prefer passing JSON via stdin. Use `--input-file` ONLY when the payload is too large/awkward for stdin.
- **Reporting**: 
  - Say `insufficient evidence` when evidence is weak. Preserve contradictions. Never claim product-market fit.
  - Distinguish category pain vs. vendor-specific complaints. Focus on repeated, concrete complaints. 
  - Ensure evidence remains traceable via `source_url`, `pain_cluster_id`, and persisted identifiers. NEVER use conversation numbers (e.g., "opportunity #2") as sole identifiers.
- **PRD Standards**: Optimize PRDs for coding agents by detailing scope, non-goals, constraints, and acceptance criteria. Never generate a PRD from an unpersisted opportunity.

## Workflow 1: Discovery Mode
1. Read `references/contracts.md` and check the required environment (if not already done).
2. Search and scrape for evidence. 
3. Use `search-similar-evidence` to check for duplicates or map new evidence to existing clusters. 
4. Save new evidence with `save-evidence-batch`. *Note: DO NOT generate vector embeddings yourself; the database processes embeddings automatically for `.snippet` content.*
5. **Internal Agent Reasoning Task**: You must evaluate the raw evidence yourself without a script. Cluster it into distinct problems, and score/rank the opportunities using the contract rubric.
6. Persist ranked opportunities using `save-opportunity-batch`.
7. Output a summary to the user including: `run_id`, `opportunity_id`, score, confidence, and caveats.

## Workflow 2: PRD Mode
1. Resolve the target opportunity by `opportunity_id` (or by `run_id` + rank if requested).
2. Retrieve the opportunity data with `get-opportunity`.
3. Generate the PRD using the persisted opportunity and its connected evidence. DO NOT use chat memory for generation.
4. Save the PRD using `save-prd`.
5. Return the human-readable PRD to the user and include its `prd_id`.
