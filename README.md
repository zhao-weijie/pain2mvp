# pain2mvp

OpenClaw skill for turning public user pain points into ranked opportunities and persisted PRDs.

## Install

1. Clone this repo into your OpenClaw skills directory.
2. Run `npm install`.
3. Set `TIDB_DATABASE_URL` to your TiDB Cloud Zero database URL with `?sslaccept=strict`.
4. Run `npm run bootstrap:tidb`.

## Use

- Discovery mode: ask for top pain points by user group, idea, or existing solution.
- Example: "What are the top pain points for in-house IP counsel?"
- Example: "What are OpenClaw users frustrated by?" or "What are Harvey users complaining about?"
- PRD mode: ask for a PRD from a persisted opportunity id or latest high-confidence result.
- Example: "Generate a PRD from opportunity `opp_20260328_01`."

See `pain2mvp/SKILL.md` for runtime flow and `pain2mvp/references/contracts.md` for the command contract.
