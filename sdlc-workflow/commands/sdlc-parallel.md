---
description: Run multiple agents in parallel across phases with shared context and collaboration
argument-hint: [phase] [--max-workers=N] [--feedback-loops] [--verbose]
---

# Command: /sdlc-parallel

Run SDLC phases with multiple agents working in parallel, sharing context, and providing real-time feedback.

## Usage

```bash
# Full SDLC with automatic parallelization
/sdlc "build a user auth system" --parallel

# Specific phase with parallelization
/sdlc-parallel phase-3 --max-workers=4

# Show collaboration log as agents work
/sdlc-parallel phase-1 --feedback-loops --verbose

# Run with strict dependency checking
/sdlc-parallel phase-2 --dependencies=strict
```

## How It Works

### 1. Workspace Initialization

Creates shared workspace:
```
.sdlc/run-<timestamp>/
├── context.json                 # Shared by all agents
├── collaboration-log.json       # Real-time agent messages
└── phases/                      # Phase outputs
```

### 2. Agent Spawning

Spawns agents for phase based on task independence:

**Phase 1 (Planning)** — All parallel (no dependencies):
```
ProductManager     BusinessAnalyst     SoftwareArchitect     SecurityArchitect
    ↓                   ↓                     ↓                    ↓
   PRD              User Stories         Tech Stack          Threat Model
    ↓                   ↓                     ↓                    ↓
    └─────────────────────────────────────────────────────────────┘
                      (parallel, all start at time 0)
                      
Merged into context.json when complete
```

**Phase 3 (Development)** — Depends on architecture:
```
SoftwareArchitect (blocking)
         ↓
    (publishes)
         ↓
    ┌────┴────┬─────────┐
    ↓         ↓         ↓
Frontend   Backend    Database
(parallel) (parallel) (parallel)
    ↓         ↓         ↓
   UI API    Schema
    └────┬────┘
    (integration)
    FullstackEngineer
         ↓
   End-to-end tests
```

### 3. Context Sharing

All agents read/write to `context.json`:

```javascript
// Agent 1: ProductManager
context.requirements = { stories: [...] };
publishToContext(context);

// Agent 2: FrontendEngineer (waiting)
const requirements = readFromContext().requirements;
// Use requirements to design UI
```

### 4. Collaboration Communication

Agents publish messages to `collaboration-log.json`:

```javascript
// BackendEngineer publishes
publishMessage({
  from: "backend-engineer",
  to: ["frontend-engineer", "automation-qa-engineer"],
  type: "artifact_ready",
  artifact: "api.ts",
  provides: "REST endpoints for login, signup, profile"
});

// FrontendEngineer receives
const message = listenForMessage({
  from: "backend-engineer",
  type: "artifact_ready"
});
// FrontendEngineer can now write integration code
```

### 5. Dependency Resolution

System automatically manages dependencies:

```
┌─ BackendEngineer (needs: architecture)
│  Status: BLOCKED (waiting for SoftwareArchitect)
│
├─ FrontendEngineer (needs: architecture + design)
│  Status: BLOCKED (waiting for 2 agents)
│
├─ DatabaseEngineer (needs: architecture)
│  Status: BLOCKED (waiting for SoftwareArchitect)
│
└─ SoftwareArchitect (needs: requirements from Phase 1)
   Status: READY (requirements loaded from context)
   
   ⏱️  SoftwareArchitect completes in 12m
   
   ✅ Publishes: "architecture-complete"
   
   ⏱️  BackendEngineer unblocked, starts (12m)
   ⏱️  FrontendEngineer unblocked, starts (12m)
   ⏱️  DatabaseEngineer unblocked, starts (12m)
   
   All 3 run in parallel for 12m
```

## Output

### Real-Time Status

```
📋 PHASE 3: Development (Parallel Mode)

[1/5] 🟡 FrontendEngineer     BLOCKED (waiting: architecture)
[2/5] 🟡 BackendEngineer      BLOCKED (waiting: architecture)
[3/5] 🟡 DatabaseEngineer     BLOCKED (waiting: architecture)
[4/5] 🟢 SoftwareArchitect    WORKING (architecture design)
[5/5] ⏳ FullstackEngineer    QUEUED (waits for FE + BE)

🕐 Elapsed: 8m 23s
├─ SoftwareArchitect: 8m 23s (in progress)
└─ Estimated total: 25m (vs 45m if serial)

📨 Messages: 3
├─ 🔄 FrontendEngineer requests clarification on API
├─ ✅ BackendEngineer ready for code generation
└─ ⚠️  SecurityArchitect flags: check OWASP compliance
```

### Collaboration Log Sample

```json
{
  "phase": 3,
  "timestamp": "2026-06-16T10:00:00Z",
  "agents": [
    {
      "agent": "software-architect",
      "status": "complete",
      "duration_ms": 450000,
      "artifacts": ["architecture.md", "tech-stack.json"],
      "messages_sent": 3
    },
    {
      "agent": "backend-engineer",
      "status": "working",
      "duration_ms": 380000,
      "depends_on": ["software-architect"],
      "messages_sent": 2
    }
  ],
  "communications": [
    {
      "from": "software-architect",
      "to": ["backend-engineer", "frontend-engineer"],
      "type": "artifact_ready",
      "timestamp": "2026-06-16T10:08:00Z",
      "resolved": true
    }
  ]
}
```

## Parallelization Strategies

### Strategy 1: Max Parallelism (Default)

```bash
/sdlc-parallel phase-3 --max-workers=10
```

Spawns all available agents immediately, blocks on dependencies.

**Pros**: Fastest possible completion
**Cons**: More resource intensive

### Strategy 2: Limited Workers

```bash
/sdlc-parallel phase-3 --max-workers=3
```

Spawns agents up to limit, queues remainder.

**Pros**: Controlled resource usage
**Cons**: Slightly slower

### Strategy 3: Sequential with Feedback

```bash
/sdlc-parallel phase-3 --sequential --feedback-loops
```

Runs agents one at a time, but collects async feedback.

**Pros**: Simple, resource-light
**Cons**: No actual parallelism

## Feedback Loops

### Real-Time Feedback

Enable agents to provide feedback while others work:

```bash
/sdlc-parallel phase-3 --feedback-loops
```

**Example**:
```
Time 5m:  FrontendEngineer (working)
          └─ 📨 "API contract question" → BackendEngineer

Time 5:30m: BackendEngineer (working)
           └─ 📨 "Responds with API design" → FrontendEngineer

FrontendEngineer adjusts while BackendEngineer continues
(no blocking, both make progress)
```

### Conflict Resolution

When agents disagree:

```bash
/sdlc-parallel phase-3 --conflict-resolution=architect-arbitrates
```

**Flow**:
1. Agent A proposes: "Use REST API"
2. Agent B proposes: "Use GraphQL"
3. System detects conflict
4. SoftwareArchitect arbitrates
5. Decision: "GraphQL - scalability wins"
6. Both agents acknowledge and proceed

## Examples

### Example 1: Phase 1 Planning (15 min total)

```bash
/sdlc-parallel phase-1 --max-workers=4 --verbose
```

```
Time 0:00    🟢 ProductManager starts
             🟢 BusinessAnalyst starts
             🟢 SoftwareArchitect starts
             🟢 SecurityArchitect starts
             
Time 5:00    ✅ ProductManager done (PRD ready)
Time 8:15    ✅ BusinessAnalyst done (user stories ready)
Time 12:30   ✅ SoftwareArchitect done (tech stack ready)
Time 15:45   ✅ SecurityArchitect done (threat model ready)

Total: 15m 45s
Serial would be: ~40 minutes
Speedup: 2.5x
```

### Example 2: Phase 3 Development (25 min total)

```bash
/sdlc-parallel phase-3 --max-workers=4 --feedback-loops
```

```
Time 0:00    🟡 FrontendEngineer BLOCKED (waiting: architecture)
             🟡 BackendEngineer BLOCKED (waiting: architecture)
             🟡 DatabaseEngineer BLOCKED (waiting: architecture)
             🟢 SoftwareArchitect working

Time 8:30    ✅ SoftwareArchitect done
             🟢 FrontendEngineer starts
             🟢 BackendEngineer starts
             🟢 DatabaseEngineer starts
             
Time 10:00   📨 FrontendEngineer: "API contract question"
             └─ BackendEngineer responds immediately

Time 20:45   ✅ FrontendEngineer done
             ✅ BackendEngineer done
             ✅ DatabaseEngineer done
             🟢 FullstackEngineer starts integration
             
Time 25:15   ✅ FullstackEngineer done

Total: 25m 15s
Serial would be: ~45 minutes
Speedup: 1.8x
```

### Example 3: Full SDLC (All Phases)

```bash
/sdlc "build a user auth system" --parallel --show-collaboration-log
```

```
✅ PHASE 1 (Planning):           15 min
✅ PHASE 2 (Design):             12 min
✅ PHASE 3 (Development):        25 min
✅ PHASE 4 (Testing + Security): 18 min
✅ PHASE 5 (Deployment):         10 min
✅ PHASE 6 (Operations):         8 min

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 88 minutes

Serial equivalent: ~200 minutes
Speedup: 2.27x (88% time saved)

📊 Agents Used: 20
📊 Parallel Groups: 6 (one per phase)
📊 Critical Path: Phase 3 Development (25 min)
📊 Total Messages: 47
📊 Conflicts Resolved: 2
```

## Troubleshooting

### Agent Blocked Too Long

**Problem**: Agent waiting for dependency >30 min

```bash
/sdlc-parallel phase-3 --debug-collaboration
```

**Output**:
```
⚠️  AutomationQA blocked on BackendEngineer for 32m
    ├─ Message sent: 8m ago
    ├─ No response received
    ├─ BackendEngineer status: ERROR (SQL syntax)
    └─ Action: Fix BackendEngineer, resync
```

### Conflict Unresolved

**Problem**: Two agents disagree, no progress

```bash
/sdlc-parallel phase-3 --conflict-resolution=escalate
```

**Output**:
```
⚠️  Conflict: FrontendEngineer vs BackendEngineer
    ├─ Topic: API authentication
    ├─ FE wants: JWT in header
    ├─ BE wants: Session cookies
    ├─ Escalated to: SoftwareArchitect
    ├─ Decision: "JWT for scalability"
    └─ Status: RESOLVED
```

## Configuration

Create `.sdlc/parallel.json`:

```json
{
  "parallelization": {
    "enabled": true,
    "max_workers": 4,
    "strategy": "max-parallelism",
    "dependency_checking": "strict"
  },
  "feedback": {
    "enabled": true,
    "response_timeout_ms": 300000,
    "auto_escalate_after_ms": 600000
  },
  "conflict_resolution": {
    "mode": "architect-arbitrates",
    "timeout_ms": 600000
  },
  "logging": {
    "collaboration_log": true,
    "verbose": false,
    "metrics": true
  }
}
```

## Performance Metrics

Tracked automatically:

```json
{
  "metrics": {
    "total_duration_ms": 88000,
    "serial_equivalent_ms": 200000,
    "speedup_factor": 2.27,
    "parallel_efficiency": 0.92,
    "agents_active_max": 4,
    "critical_path_agent": "backend-engineer",
    "blockers_hit": 3,
    "conflicts_resolved": 2,
    "feedback_messages": 47
  }
}
```

## Best Practices

1. **Set realistic max-workers**: 3-5 for most projects
2. **Enable feedback-loops**: Better decisions, slightly slower
3. **Monitor collaboration-log**: Catch blockers early
4. **Use conflict-resolution**: Prevents deadlocks
5. **Check metrics after**: Optimize for future runs

## See Also

- [AGENT_COLLABORATION.md](../AGENT_COLLABORATION.md) — Design & patterns
- [README.md](../README.md) — Main documentation
- `/sdlc-plan`, `/sdlc-dev`, `/sdlc-test` — Phase-specific commands
