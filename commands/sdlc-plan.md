---
description: Phase 1 only — Requirements gathering. Produces PRD, user stories, acceptance criteria, threat model, and GitHub issues.
argument-hint: <feature-description-or-gh-issue-url>
---

# Phase 1 — Planning & Requirements

Spawns agents: product-manager → business-analyst → software-architect → security-architect

Outputs:
- `.sdlc/01-roadmap.md` — Product vision, QUANTS targets, roadmap
- `.sdlc/01-requirements.md` — User stories (INVEST), data flows
- `.sdlc/01-architecture.md` — Tech stack decision, ADR, component design
- `.sdlc/01-threat-model.md` — STRIDE analysis, security controls
- GitHub issues created for each user story

## Process

1. **Product Manager (Grill Phase)**: Use skill-grill-me to relentlessly interview customer about their product/feature — understand the problem deeply, resolve ambiguities, walk the decision tree
2. Product Manager: Define goals, success metrics, roadmap (informed by grill session)
3. Business Analyst: Decompose into INVEST-compliant user stories with AC
4. Software Architect: Select tech stack, produce ADR
5. Security Architect: Threat model (STRIDE), security requirements
6. **GATE**: User approves all artifacts before proceeding to Phase 2

## Usage

```bash
/sdlc-plan "add OAuth login to our SaaS product"
/sdlc-plan https://github.com/org/repo/issues/123  # Parse GitHub issue
```
