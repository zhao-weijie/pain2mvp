import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeOpportunitySnapshot,
  normalizePrdRecord,
  parseJsonArgument,
  parseTidbUrl,
} from "./tidb_lib.mjs";

test("parseTidbUrl accepts mysql URLs with db and strict ssl", () => {
  const parsed = parseTidbUrl("mysql://user:pass@example.com:4000/agent_memory?sslaccept=strict");
  assert.equal(parsed.databaseName, "agent_memory");
});

test("parseTidbUrl rejects missing db name", () => {
  assert.throws(
    () => parseTidbUrl("mysql://user:pass@example.com:4000/?sslaccept=strict"),
    /must include a database name/,
  );
});

test("parseTidbUrl rejects missing strict sslaccept", () => {
  assert.throws(
    () => parseTidbUrl("mysql://user:pass@example.com:4000/agent_memory"),
    /sslaccept=strict/,
  );
});

test("parseJsonArgument returns empty object for empty input", () => {
  assert.deepEqual(parseJsonArgument("", "stdin"), {});
});

test("normalizeOpportunitySnapshot stringifies JSON fields", () => {
  const row = normalizeOpportunitySnapshot({
    opportunity_id: "opp_1",
    run_id: "run_1",
    rank: 1,
    title: "Title",
    affected_user: "Ops lead",
    job_to_be_done: "Do a job",
    pain_statement: "Pain",
    score_total: 81,
    score_breakdown_json: { recurrence: 20 },
    confidence: "High",
    confidence_reason: "Repeated complaints",
    pain_cluster_key: "cluster_a",
    supporting_evidence_json: [{ source_url: "https://example.com" }],
    contradictions_json: [],
    query_scope_json: { sources: ["reddit"] },
  });

  assert.equal(row.rank, 1);
  assert.equal(row.score_total, 81);
  assert.equal(row.score_breakdown_json, JSON.stringify({ recurrence: 20 }));
});

test("normalizePrdRecord stringifies JSON fields", () => {
  const row = normalizePrdRecord({
    prd_id: "prd_1",
    run_id: "run_1",
    opportunity_id: "opp_1",
    title: "PRD",
    status: "draft",
    target_user: "Ops lead",
    goal: "Save time",
    structured_prd_json: { sections: ["problem"] },
    markdown_snapshot: "# PRD",
    source_evidence_json: [{ source_url: "https://example.com" }],
  });

  assert.equal(row.structured_prd_json, JSON.stringify({ sections: ["problem"] }));
  assert.equal(row.source_evidence_json, JSON.stringify([{ source_url: "https://example.com" }]));
});
