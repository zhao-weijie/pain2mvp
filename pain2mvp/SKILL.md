---
name: painpoint-to-prd
description: discover and structure product opportunities from public user discussions, then convert a selected opportunity into a lightweight prd for a coding agent. use when the user wants to mine reddit or hacker news for recurring pain points, unmet needs, competitor complaints, or market signals around an idea, user group, or product category, or when the user wants to turn one identified opportunity into a scoped brief for codex or claude code.
---

# Painpoint To PRD

## Overview

Use this skill in two modes:

1. Discovery mode: produce a scored opportunities list from Reddit and Hacker News evidence.
2. PRD mode: turn one selected opportunity into a lightweight PRD optimized for Codex or Claude Code.

If the user asks for both, do discovery first and only draft a PRD for the highest-ranked or explicitly selected opportunity.

## Workflow decision tree

1. Classify the request.
   - **Idea-led research**: "I am considering X. What pain points does it solve?"
   - **User-group research**: "What are the top pain points for Y?"
   - **Competitor-led research**: "What are users complaining about in Z?"
   - **Handoff**: "Turn opportunity N into a build brief/PRD."

2. Pick the mode.
   - Idea, user group, competitor -> follow the Discovery workflow.
   - Selected opportunity or "turn this into a brief" -> follow the PRD workflow.
   - Mixed request -> run Discovery first, then either use the user's chosen opportunity or default to the highest-confidence item if the user asks for an immediate PRD.

## Discovery workflow

1. Normalize the research brief.
   - Accept any of: idea, user group, competitor. Combine signals when multiple are given.
   - Infer synonyms and adjacent terms before searching.
   - Default to the last 12 months of public discussion, but prioritize the last 180 days when ranking.
   - Search both Reddit and Hacker News. Do not treat one source as representative of the market by itself.

2. Gather evidence using the BrightData Reddit and Hacker News tooling already available in the environment.
   - Use the existing configured BrightData tools or scripts. Do not invent tool names or ask for secrets.
   - Search for problem statements, workflow friction, failed workarounds, switching intent, and complaint threads.
   - Favor posts and comments that describe a real workflow, consequence, or workaround.
   - Down-rank generic praise, memes, and wishlists with no context.
   - For competitor research, separate pains about missing product capability from pains about pricing, support, onboarding, trust, or policy.

3. Cluster raw evidence into pain points.
   - Merge phrasing variants into one underlying job or problem.
   - Split clusters when the root cause differs even if the wording is similar.
   - Track user type, source, date, and a short evidence note for each item.

4. Score opportunities.
   - Use the rubric in `references/discovery-rubric.md`.
   - Score based on recurrence, severity, workaround burden, buying signal, and evidence quality plus freshness.
   - Report both overall score and confidence.
   - Reduce confidence when evidence is thin, old, or isolated to one community.
   - Do not claim product-market fit. This is directional signal, not final validation.

5. Produce the output.
   - Use the structure in `references/scored-opportunities.md`.
   - Rank opportunities from strongest to weakest signal.
   - Include disconfirming evidence or ambiguity where relevant.
   - End with 3 to 5 concrete next questions or double-click directions the user could pursue.

## PRD workflow

1. Anchor on one opportunity.
   - Use the user-selected opportunity when available.
   - If the user asks for a PRD without selecting one, choose the highest-confidence opportunity from the latest discovery output and state that assumption clearly.

2. Preserve the evidence.
   - Carry forward the core pain statement, target user, job to be done, main quotes or examples, and the strongest constraints implied by the evidence.
   - Avoid inventing requirements that were not supported by the evidence or explicitly requested by the user.

3. Scope for agent autonomy.
   - Optimize for a coding agent, not an executive audience.
   - Prefer a thin vertical slice over a large roadmap.
   - Make scope boundaries explicit so Codex or Claude Code can execute without drifting.
   - State in-scope, out-of-scope, assumptions, and unresolved questions.

4. Produce the output.
   - Use the structure in `references/lightweight-prd.md`.
   - Keep it lightweight and implementation-ready.
   - Include acceptance criteria that a coding agent could verify.
   - Add an implementation handoff section only when it materially improves execution.

## Quality bar

- Prefer repeated, concrete complaints over clever one-off comments.
- Surface contradictions. If some users love the workflow others hate, say so.
- Distinguish pain about the problem category from pain caused by one vendor's pricing, support, or brand perception.
- When evidence is weak, say `insufficient evidence` instead of forcing a ranking.
- Keep quotes short and only use them to support a claim.
- When the user asks for iteration, keep the earlier evidence model and tighten the scope instead of restarting from scratch.

## Example triggers

- "What are the top pain points for in-house intellectual property professionals?"
- "I am considering a drafting agent for formulation patents. What unmet needs does that map to?"
- "What are Harvey users complaining about?"
- "Take opportunity #2 and turn it into a lightweight PRD for Claude Code."
