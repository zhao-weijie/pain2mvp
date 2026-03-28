# Lightweight PRD Template

Use this structure for PRD mode.

# Lightweight PRD: [feature or product slice]

## Problem
A concise statement of the pain being solved.

## Target user
- Primary user
- Context of use
- Current workflow

## Evidence carried forward
- Short summary of the supporting evidence
- Key quotes or examples
- Important constraints implied by the research

## Goal
What the first version must achieve.

## Non-goals
What this PRD intentionally does not try to solve.

## User stories
- As a [user], I want [capability], so that [outcome].
- Add only the minimum set required for the first slice.

## Scope
### In scope
- ...

### Out of scope
- ...

## Requirements
List only concrete requirements that are supported by the evidence or explicitly requested.

## Constraints and assumptions
- Technical, workflow, or trust constraints
- Assumptions the coding agent should not silently expand

## Acceptance criteria
Write pass/fail criteria a coding agent can verify.

Example patterns:
- Given ..., when ..., then ...
- The system must ...
- The workflow is complete only when ...

## Risks and open questions
- Key unknowns
- Follow-up research needed
- Decisions deferred to later iterations

## Implementation handoff
Only include this section when it makes execution easier.

Suggested contents:
- recommended thin slice
- critical edge cases
- obvious test scenarios
- interfaces or artifacts the coding agent must preserve
