import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeEvidenceBatchPayload,
  normalizeOpportunitySnapshot,
  normalizeOpportunityBatchPayload,
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

test("normalizeEvidenceBatchPayload normalizes multiple rows and rejects empty batches", () => {
  const batch = normalizeEvidenceBatchPayload({
    run_id: "run_1",
    evidence_rows: [
      {
        source_url: "https://example.com/thread-1",
        source_type: "reddit_post",
        author_handle: "user1",
        community_or_site: "r/test",
        published_at: "2026-03-20T12:00:00Z",
        snippet: "Pain one",
        pain_cluster_id: "run_1:cluster_a",
        engagement_signals: { score: 10 },
        retrieval_timestamp: "2026-03-28T13:00:00Z",
        traceability_status: "verified",
      },
      {
        source_url: "https://example.com/thread-2",
        source_type: "reddit_comment",
        author_handle: "user2",
        community_or_site: "r/test",
        published_at: "2026-03-21T12:00:00Z",
        snippet: "Pain two",
        pain_cluster_id: "run_1:cluster_b",
        engagement_signals: { score: 11, comments: 2 },
        retrieval_timestamp: "2026-03-28T13:05:00Z",
        traceability_status: "verified",
      },
    ],
  });

  assert.equal(batch.run_id, "run_1");
  assert.equal(batch.evidence_rows.length, 2);
  assert.equal(batch.evidence_rows[0].engagement_signals, JSON.stringify({ score: 10 }));
  assert.equal(
    batch.evidence_rows[1].engagement_signals,
    JSON.stringify({ score: 11, comments: 2 }),
  );
  assert.throws(
    () => normalizeEvidenceBatchPayload({ run_id: "run_1", evidence_rows: [] }),
    /non-empty evidence_rows array/,
  );
});

test("normalizeOpportunityBatchPayload normalizes multiple rows and rejects empty batches", () => {
  const batch = normalizeOpportunityBatchPayload({
    run_id: "run_1",
    opportunities: [
      {
        opportunity_id: "opp_1",
        run_id: "run_1",
        rank: "1",
        title: "Title 1",
        affected_user: "Ops lead",
        job_to_be_done: "Do a job",
        pain_statement: "Pain",
        score_total: "81",
        score_breakdown_json: { recurrence: 20 },
        confidence: "High",
        confidence_reason: "Repeated complaints",
        pain_cluster_key: "run_1:cluster_a",
        supporting_evidence_json: [{ source_url: "https://example.com/1" }],
        contradictions_json: [],
        query_scope_json: { sources: ["reddit"] },
      },
      {
        opportunity_id: "opp_2",
        run_id: "run_1",
        rank: 2,
        title: "Title 2",
        affected_user: "Ops lead",
        job_to_be_done: "Do another job",
        pain_statement: "Another pain",
        score_total: 72,
        score_breakdown_json: { recurrence: 18 },
        confidence: "Medium",
        confidence_reason: "Directional evidence",
        pain_cluster_key: "run_1:cluster_b",
        supporting_evidence_json: [{ source_url: "https://example.com/2" }],
        contradictions_json: [{ note: "Low volume" }],
        query_scope_json: { sources: ["reddit", "hacker_news"] },
      },
    ],
  });

  assert.equal(batch.run_id, "run_1");
  assert.equal(batch.opportunities.length, 2);
  assert.equal(batch.opportunities[0].rank, 1);
  assert.equal(batch.opportunities[0].score_total, 81);
  assert.equal(batch.opportunities[1].rank, 2);
  assert.equal(
    batch.opportunities[1].query_scope_json,
    JSON.stringify({ sources: ["reddit", "hacker_news"] }),
  );
  assert.throws(
    () => normalizeOpportunityBatchPayload({ run_id: "run_1", opportunities: [] }),
    /non-empty opportunities array/,
  );
});
