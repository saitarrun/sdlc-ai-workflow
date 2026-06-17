---
description: Phase 1 planning with grill-me interview. Asks questions, captures understanding, chains agents.
argument-hint: <feature-description>
tools: Bash
model: sonnet
---

# /sdlc-plan Implementation

This command orchestrates Phase 1 with the grill-me skill.

## How to Invoke

```bash
/sdlc-plan "add OAuth login to SaaS"
```

## Execution Flow

1. **Initialize orchestrator** — Create run directory, init context/logs
2. **Grill-me interview** — Ask 4 questions interactively
3. **Capture answers** — Store in shared context
4. **Save summary** — Document grill results
5. **Register agents** — Tell orchestrator about Phase 1 agents
6. **Spawn agents** — product-manager → business-analyst → architect → security
7. **Display results** — Show artifacts and summary

## Implementation

When user invokes `/sdlc-plan <feature>`:

```bash
# Start orchestrator if not running
if ! curl -s http://127.0.0.1:4242/api/health > /dev/null 2>&1; then
  npm run orchestrator &
  sleep 2
fi

# Run the orchestrator with grill-me
node scripts/sdlc-orchestrator.js "$1"
```

## Grill-Me Interview Questions

The orchestrator asks these 4 questions, one at a time:

1. **What problem are you solving?**
   - Recommended: Describe the user pain point
   - Example: "Users cannot log in with social accounts"

2. **Who are the users?**
   - Recommended: 2-3 personas with pain points
   - Example: "Developers and engineering managers"

3. **What constraints exist?**
   - Recommended: Timeline, budget, team, tech constraints
   - Example: "4 weeks, 2 engineers, use existing auth service"

4. **What are success criteria?**
   - Recommended: QUANTS metrics (quality, attention, toil, time, satisfaction)
   - Example: "70% of new signups use OAuth in 30 days"

## Grill-Complete Gate

Once you confirm the interview:
- ✅ `grill-complete` gate is marked
- ✅ Product-manager can spawn
- ✅ Dependent agents unlock when their dependencies complete

## Phase 1 Agents

Spawned in sequence after grill-complete:

1. **product-manager** (no deps)
   - Uses grill answers for roadmap
   - QUANTS metrics aligned with success criteria

2. **business-analyst** (→ product-manager)
   - User stories for each persona
   - Acceptance criteria from success metrics

3. **software-architect** (→ business-analyst)
   - Tech stack respecting constraints
   - ADR reflecting problem statement

4. **security-architect** (→ software-architect)
   - Threat model for actual use case
   - Security controls for stated users

## Artifacts

After completion:

```
./projects/<feature-name>/run-<timestamp>/
├── 01-grill-summary.md       (interview + confirmation)
├── 01-roadmap.md              (product vision, milestones)
├── 01-requirements.md          (user stories, AC)
├── 01-architecture.md          (tech stack, ADR)
└── 01-threat-model.md          (STRIDE, controls)
```

---

**Status**: Full workflow with interactive grill-me + agent chaining
**Entry Point**: `/sdlc-plan "feature description"`
**First Step**: Asks grill-me questions interactively
**Gate**: Grill-complete blocks downstream agents
