# pain2mvp

OpenClaw skill for turning public user pain points into ranked opportunities and persisted PRDs.

## Docs

- `pain2mvp/SKILL.md`: runtime instructions for agents
- `pain2mvp/references/contracts.md`: command and payload contract
- `pain2mvp/scripts/`: implementation details, not normal runtime reading material

## Install

1. Clone this repo into your OpenClaw skills directory.
2. Run `npm install`.
3. Set `TIDB_DATABASE_URL` to your TiDB Cloud Zero database URL with `?sslaccept=strict`.
4. Run `npm run bootstrap:tidb`.
