# SDLC Workflow Execution Guide

## How the System Works

The SDLC Workflow plugin coordinates 26 agents across 6 phases with real-time monitoring and dependency management.

### Architecture

```
Command (/sdlc-plan)
    ↓
Orchestrator (manages dependencies, tracks state)
    ↓
Agent Spawner (invokes agents as they become ready)
    ↓
Agents (execute in sequence, respecting dependencies)
    ↓
Collaboration Log (shared state, status updates)
```

## Quick Start

### 1. Start the Orchestrator

```bash
npm run orchestrator
```

### 2. Run Phase 1 with Grill-Me Interview

When you invoke `/sdlc-plan`, the workflow is:

**Step A: Grill-Me Interview (Interactive)**
```
The system asks you 4 key questions about your project:

Q1: What problem are you solving?
    → Describe the user pain point

Q2: Who are the users?
    → Define 2-3 personas with pain points

Q3: What constraints exist?
    → Timeline, budget, tech debt, resources

Q4: What are success criteria?
    → Measurable outcomes (QUANTS framework)

Once answered → grill-complete gate is set
```

**Step B: Agent Execution (Sequential)**
```
Once grill-complete:

1. product-manager      → Synthesizes roadmap from grill session
2. business-analyst     → Decomposes into INVEST user stories
3. software-architect   → Selects tech stack, produces ADR
4. security-architect   → STRIDE threat modeling
```

**Invoke it with:**
```bash
# Option 1: Provide feature description
/sdlc-plan "add OAuth login to our SaaS product"

# Option 2: Interactive (system asks "what are you planning?")
/sdlc-plan

# Option 3: From GitHub issue
/sdlc-plan https://github.com/org/repo/issues/123
```

**Example Flow:**
```
$ /sdlc-plan "add OAuth login"

🔥 GRILL-ME INTERVIEW STARTED

Q: What problem are you solving?
My take: Users can't log in with social accounts. Is that it?
> [You answer the question]

Q: Who are the users?
My take: SaaS customers, guest users? Specific roles?
> [You answer]

Q: What constraints exist?
My take: Timeline (30 days)? Budget? Security requirements?
> [You answer]

Q: What are success criteria?
My take: 80% login via OAuth in 60 days?
> [You confirm]

✅ Grill-complete. Proceeding to agents...

▶️  Spawned: product-manager (roadmap)
✅ Completed: product-manager

▶️  Spawned: business-analyst (user stories)
✅ Completed: business-analyst

(continues with architect agents...)

Phase 1 Complete! Review artifacts:
- ./projects/<feature-name>/01-roadmap.md
- ./projects/<feature-name>/01-requirements.md
- ./projects/<feature-name>/01-architecture.md
- ./projects/<feature-name>/01-threat-model.md
```

---

## Full Execution Flow with Grill-Me

### Phase 1: Planning (Interactive Interview + 4 Agents)

```bash
# Terminal 1: Start orchestrator
npm run orchestrator

# Terminal 2: Invoke planning with grill-me interview
/sdlc-plan "add OAuth login to SaaS"

# === GRILL-ME INTERVIEW PHASE ===
# (Interactive — you answer 4 questions)

🔥 GRILL-ME INTERVIEW

Q: What problem are you solving?
My take: Current login is password-only. Want OAuth?
> Our users demand single sign-on with Google/GitHub

Q: Who are the users?
My take: B2B SaaS customers? Engineers? Product teams?
> Primarily developers and engineering managers

Q: What constraints exist?
My take: Timeline? Budget? Team size?
> 4 weeks, 2 engineers, use existing auth service

Q: What are success criteria?
My take: QUANTS metrics? 70% adoption in 30 days?
> Yes, 70% of new signups use OAuth within 30 days

✅ Understanding confirmed. Marking grill-complete...

# === AGENT EXECUTION PHASE ===

▶️  Spawned: product-manager
  ✓ Roadmap synthesized from interview
✅ Completed: product-manager

▶️  Spawned: business-analyst
  ✓ User stories (INVEST) from personas
✅ Completed: business-analyst

▶️  Spawned: software-architect
  ✓ ADR for OAuth2 + tech stack
✅ Completed: software-architect

▶️  Spawned: security-architect
  ✓ STRIDE analysis, security controls
✅ Completed: security-architect

✅ Phase 1 Complete!

# Artifacts generated:
# ./projects/<feature-name>/01-grill-summary.md (interview + confirmation)
# ./projects/<feature-name>/01-roadmap.md
# ./projects/<feature-name>/01-requirements.md
# ./projects/<feature-name>/01-architecture.md
# ./projects/<feature-name>/01-threat-model.md
```

**Key: The grill-me interview informs all 4 agents' work.**

### Phase 2: Design

```bash
node scripts/spawn-phase-agents.js design run-20260616T133615

# Spawns 3 agents:
# ▶️  Spawned: ux-researcher
# ✅ Completed: ux-researcher
# ▶️  Spawned: ui-ux-designer
# ✅ Completed: ui-ux-designer
# ▶️  Spawned: accessibility-engineer
# ✅ Completed: accessibility-engineer

# Artifacts:
# ./projects/<feature-name>/02-user-journeys.md
# ./projects/<feature-name>/02-wireframes.md
```

### Phase 3: Development

```bash
node scripts/spawn-phase-agents.js dev run-20260616T133615

# Spawns 5 agents (can run in parallel):
# ▶️  Spawned: frontend-engineer
# ▶️  Spawned: backend-engineer
# ▶️  Spawned: database-engineer
# ▶️  Spawned: mobile-developer
# ▶️  Spawned: fullstack-engineer
# (all complete)

# Artifacts:
# ./projects/<feature-name>/03-implementation.log
# (code changes, schema designs, etc.)
```

### Continue with Phases 4-6

```bash
node scripts/spawn-phase-agents.js test <run-id>
node scripts/spawn-phase-agents.js deploy <run-id>
node scripts/spawn-phase-agents.js ops <run-id>
```

---

## Dependency Management

Agents only spawn when their dependencies are satisfied:

```
product-manager (no deps, starts first)
  ↓
business-analyst (waits for product-manager)
  ↓
software-architect (waits for business-analyst)
  ↓
security-architect (waits for software-architect)
```

**Phase Gates**: Some agents have blocking gates (e.g., product-manager's `grill-complete`). Dependent agents won't spawn until gate is marked.

---

## Artifact Output

### Location
All artifacts are in: `./projects/<feature-name>/`

### Phase 1 Artifacts
- `01-roadmap.md` — Product vision, QUANTS metrics, milestones
- `01-requirements.md` — INVEST user stories, acceptance criteria
- `01-architecture.md` — ADR, tech stack, component design
- `01-threat-model.md` — STRIDE threats, security controls

### Phase 2 Artifacts
- `02-user-journeys.md` — Personas, journey maps, pain points
- `02-wireframes.md` — UI design, component specs, prototypes

### Phase 3 Artifacts
- `03-implementation.log` — Code changes, implementation details

### Phase 4 Artifacts
- `04-test-cases.md` — Test strategy, test cases, coverage
- `04-security.md` — OWASP audit, CVE scan, penetration test results

### Phase 5 Artifacts
- `05-pipeline.log` — CI/CD status, deployment logs

### Phase 6 Artifacts
- `06-slo.md` — SLOs, error budgets, runbooks
- `06-secops.md` — Security monitoring, incident response
- `06-data-pipelines.md` — Data ETL/ELT workflows

### Summary
- `SUMMARY.md` — Complete project summary across all phases

---

## Troubleshooting

### Problem: Orchestrator not accessible

```bash
# Check if running
ps aux | grep orchestrator

# If not running, start it
npm run orchestrator
```

### Problem: Agents not spawning

```bash
# Check orchestrator health
curl http://127.0.0.1:4242/api/health

# Check run status
curl http://127.0.0.1:4242/api/runs/<run-id>

# Verify spawner is running
# (should show agent status updates)
```

### Problem: Port 4242 in use

```bash
# Use different port
SDLC_PORT=5000 npm run orchestrator

# Then update spawner commands
SDLC_PORT=5000 node scripts/spawn-phase-agents.js plan <run-id>
```

### Problem: Artifacts not generating

```bash
# Check ./projects/<feature-name>/collaboration-log.json
cat ./projects/<feature-name>/collaboration-log.json | jq '.agents'

# Should show agent status: working, complete, blocked
```

---

## Advanced Usage

### Run Multiple Phases in Parallel

```bash
# Terminal 1: Orchestrator
npm run orchestrator

# Terminal 2: Phase 1
node scripts/spawn-phase-agents.js plan run-id

# Terminal 3: Phase 4 (independent of 1-3, so can run separately)
node scripts/spawn-phase-agents.js test run-id
```

### Monitor Specific Run

```bash
# Get run details
curl http://127.0.0.1:4242/api/runs/run-20260616T133615 | jq '.'

# Watch agent status
watch -n 1 'curl -s http://127.0.0.1:4242/api/runs/run-20260616T133615 | jq ".log.agents | keys"'
```

### List All Runs

```bash
curl http://127.0.0.1:4242/api/runs | jq '.'
```

### Download Artifacts

```bash
# List artifacts
curl http://127.0.0.1:4242/api/runs/<run-id>/artifacts

# Download specific artifact
curl http://127.0.0.1:4242/api/runs/<run-id>/artifacts/01-roadmap.md > roadmap.md
```

---

## Performance

- **Phase 1 (Planning)**: 4 agents sequentially (~30s simulation, depends on actual agent execution)
- **Phase 2 (Design)**: 3 agents sequentially (~20s)
- **Phase 3 (Development)**: 5 agents (can parallelize, ~25s)
- **Phase 4 (Testing)**: 4 agents sequentially (~20s)
- **Phase 5 (Deployment)**: 3 agents sequentially (~15s)
- **Phase 6 (Operations)**: 7 agents (can parallelize, ~35s)

**Total for full SDLC**: ~2-3 minutes (depending on parallelization)

---

## Production Deployment

For production use with actual Claude agent execution:

1. Update orchestrator.js to invoke agents via Agent() tool
2. Implement proper error handling and retries
3. Add persistence for long-running executions
4. Configure logging and monitoring
5. Set up CI/CD integration

See `CLAUDE.md` and `README.md` for integration details.

---

**Status**: System ready for orchestrated execution  
**Latest Commit**: Check git log
