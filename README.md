# pain2mvp

OpenClaw skill for turning public user pain points into ranked opportunities and persisted PRDs.

- Skill entrypoint: `pain2mvp/SKILL.md`
- Contract doc: `pain2mvp/references/contracts.md`
- TiDB bootstrap: `npm run bootstrap:tidb`
- TiDB tool: `npm run tidb -- <command>`

## Install

1. Clone this repo into your OpenClaw skills directory.
2. Run `npm install`.
3. Set `TIDB_DATABASE_URL` to your TiDB Cloud Zero database URL with `?sslaccept=strict`.
4. Run `npm run bootstrap:tidb`.

## Notes

- `agent_memory` stores raw evidence.
- `opportunity_snapshots` stores ranked opportunities.
- `prds` stores structured PRDs plus markdown snapshots.
