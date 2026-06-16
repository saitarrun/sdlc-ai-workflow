# Multi-Agent Collaboration Framework

Enable 20 specialized agents to work in **parallel**, share context, communicate findings, and collaborate on complex product development.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SDLC Orchestrator (/sdlc)                        │
│                   Manages 6 Phases + Agent Collab                   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
    ┌─────▼─────┐        ┌─────▼─────┐      ┌─────▼─────┐
    │  Phase 1  │        │  Phase 2  │      │  Phase 3  │
    │ Planning  │        │  Design   │      │   Dev     │
    └─────┬─────┘        └─────┬─────┘      └─────┬─────┘
          │                    │                    │
   ┌──────┴──────┐      ┌──────┴──────┐    ┌──────┴──────┐
   │              │      │              │    │              │
   ▼              ▼      ▼              ▼    ▼              ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Product  │ │Business  │ │  UX      │ │Frontend  │ │Backend   │
│ Manager  │ │Analyst   │ │Researcher│ │Engineer  │ │Engineer  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
   │              │          │           │              │
   └──────────────┼──────────┼───────────┼──────────────┘
                  │          │           │
        ┌─────────▼──────────▼───────────▼────────┐
        │   Shared Context & State Management     │
        │  (Requirements, Design, Code, Tests)    │
        └────────────────────────────────────────┘
```

## Core Concepts

### 1. Shared Workspace (`.sdlc/run-<timestamp>/`)

All agents read from and write to a shared workspace:

```
.sdlc/run-2026-06-16-123456/
├── context.json              # Shared context for all agents
├── phase-1/                  # Phase 1 outputs
│   ├── requirements.md       # PRD + user stories
│   ├── threat-model.json     # STRIDE analysis
│   └── stories.json          # User stories + AC
├── phase-2/                  # Phase 2 outputs
│   ├── wireframes.md         # UI wireframes
│   ├── design-system.md      # Component specs
│   └── user-journeys.json    # User flow maps
├── phase-3/                  # Phase 3 outputs
│   ├── backend/
│   │   ├── api.ts            # Generated API code
│   │   └── schema.sql        # Database schema
│   ├── frontend/
│   │   ├── App.tsx           # Generated UI code
│   │   └── components/
│   └── database/
│       └── migrations/
├── phase-4/                  # Phase 4 outputs
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── security-audit.md     # AppSec findings
│   └── pen-test.md           # Penetration test results
├── phase-5/                  # Phase 5 outputs
│   ├── Dockerfile
│   ├── .github/workflows/ci.yml
│   └── terraform/
├── phase-6/                  # Phase 6 outputs
│   ├── slos.md               # SLO definitions
│   ├── runbooks/
│   └── monitoring.yaml
└── collaboration-log.json    # Inter-agent communications
```

### 2. Shared Context (context.json)

All agents read and update a shared context:

```json
{
  "project": {
    "name": "User Authentication System",
    "description": "OAuth 2.0 + JWT + MFA",
    "phase": 3,
    "status": "in-progress"
  },
  "requirements": {
    "user_stories": [
      {
        "id": "US-001",
        "title": "User can sign up with email",
        "acceptance_criteria": ["Valid email", "Password >8 chars"],
        "priority": "P0",
        "estimated_hours": 8
      }
    ],
    "non_functional": {
      "performance": "API <200ms p99",
      "availability": "99.9% uptime",
      "security": "OWASP compliance"
    }
  },
  "design": {
    "architecture": "Microservices with API Gateway",
    "tech_stack": {
      "frontend": "React 18 + TypeScript",
      "backend": "Node.js + Express",
      "database": "PostgreSQL"
    },
    "design_system": {
      "colors": { "primary": "#0066cc" },
      "typography": { "body": "Inter 16px" }
    }
  },
  "development": {
    "code_generated": true,
    "tests_written": false,
    "coverage": 0
  },
  "security": {
    "sast_scan": "pending",
    "sca_scan": "pending",
    "threat_model": "STRIDE applied"
  },
  "collaboration": {
    "agents_involved": ["ProductManager", "Architect", "Frontend", "Backend"],
    "current_blockers": [],
    "ready_for_next_phase": false
  }
}
```

### 3. Agent Communication Protocol

Agents communicate via structured messages in `collaboration-log.json`:

```json
{
  "messages": [
    {
      "timestamp": "2026-06-16T10:00:00Z",
      "from_agent": "product-manager",
      "to_agents": ["business-analyst", "software-architect"],
      "type": "requirement_published",
      "content": "PRD and user stories ready for review",
      "artifacts": ["requirements.md", "stories.json"],
      "blocking": false,
      "requires_feedback": true
    },
    {
      "timestamp": "2026-06-16T10:15:00Z",
      "from_agent": "business-analyst",
      "to_agents": ["product-manager"],
      "type": "validation_feedback",
      "content": "Stories meet INVEST criteria. AC are testable.",
      "issues": [],
      "ready_for_next_phase": true
    },
    {
      "timestamp": "2026-06-16T10:30:00Z",
      "from_agent": "software-architect",
      "to_agents": ["frontend-engineer", "backend-engineer"],
      "type": "architecture_approved",
      "content": "Architecture designed. Ready for implementation.",
      "artifacts": ["architecture.md", "tech-stack.json"],
      "blocking": true,
      "required_for": "phase-3-start"
    }
  ]
}
```

## Collaboration Patterns

### Pattern 1: Parallel Phase Execution

**When**: Tasks in a phase are independent

```
Phase 1: Planning
├─ ProductManager ──┐
│                   ├─► (parallel) ─► Shared Context
├─ BusinessAnalyst ─┤
│                   ├─► (no dependencies)
└─ SecurityArchitect┘

Completion: All tasks done → Phase 1 Complete → Move to Phase 2
```

### Pattern 2: Dependency Chain

**When**: Task B depends on Task A output

```
Phase 3: Development
├─ SoftwareArchitect (design) ──┐
│                                ├─► FrontendEngineer (implement UI)
├─ DatabaseEngineer (schema) ────┤
│                                ├─► BackendEngineer (implement API)
└─ (share design artifacts) ─────┘

Blocking: FrontendEngineer & BackendEngineer block on Architect output
```

### Pattern 3: Peer Review Loop

**When**: Quality/security validation needed

```
BackendEngineer (writes code)
        │
        ▼
AppSecEngineer (security review)
        │
    ┌───┴──────────────┐
    │                  │
   Yes                No (issues found)
    │                  │
    ▼                  ▼
Phase 4          BackendEngineer (fix issues)
                        │
                        └──────► AppSecEngineer (re-review)
```

### Pattern 4: Feedback Integration

**When**: Feedback from one agent improves another's work

```
FrontendEngineer (generates UI)
        │
        ▼
UXDesigner (reviews UX compliance)
        │
    ┌───┴─────────────────┐
    │                     │
 Good              Issues Found
    │                     │
    ▼                     ▼
Phase 4        FrontendEngineer (refine)
                        │
                        └──► UXDesigner (re-validate)
```

## Implementation: Agent Collaboration Commands

### 1. Initialize Shared Workspace

```bash
/sdlc "build a product" --init-collab
```

Creates `.sdlc/run-<timestamp>/` with shared context and collaboration log.

### 2. Run Phase with Parallel Agents

**Command**:
```bash
/sdlc-dev --parallel --max-workers=4
```

**Execution**:
```
Phase 3: Development
├─ [1/4] FrontendEngineer    (0s)  ║
├─ [2/4] BackendEngineer     (0s)  ║  All start in parallel
├─ [3/4] DatabaseEngineer    (0s)  ║
└─ [4/4] FullstackEngineer   (0s)  ║

[BLOCKED] FrontendEngineer waiting for Architect output
[RUNNING] BackendEngineer writing API code
[RUNNING] DatabaseEngineer creating schema
[READY] FullstackEngineer waiting for frontend + backend

[COMPLETE] DatabaseEngineer (8m 45s)
[COMPLETE] BackendEngineer (12m 30s)
[COMPLETE] FrontendEngineer (14m 20s)
[COMPLETE] FullstackEngineer (integration - 3m 15s)

Phase 3 Complete: 14m 20s total (vs 30m serial)
```

### 3. Agent Feedback & Communication

**From within an agent**:

```typescript
// BackendEngineer writes to collaboration log
{
  from: "backend-engineer",
  to: ["frontend-engineer", "appSec-engineer"],
  type: "code_ready_for_review",
  message: "REST API implementation complete",
  artifacts: ["api.ts", "models.ts"],
  requires_feedback: true,
  blocking_for: "integration-tests"
}

// FrontendEngineer consumes feedback
const backendArtifacts = getColaborationMessage(
  from: "backend-engineer",
  type: "code_ready_for_review"
);
// Use backendArtifacts.api to understand endpoints
```

### 4. Dependency Management

**Agent declares dependencies**:

```javascript
// automation-qa-engineer
const dependencies = {
  blocking_on: ["backend-engineer:api-complete", "frontend-engineer:ui-complete"],
  needs: ["api.ts", "component-specs.md"],
  provides: ["test-suite.ts"],
  provides_to: ["devops-engineer"]
};

// System blocks execution until dependencies satisfied
const blocked = await checkDependencies(dependencies);
// blocked = true → wait for BackendEngineer + FrontendEngineer to complete
```

## Parallel Agent Scenarios

### Scenario 1: Planning Phase (All Parallel, No Dependencies)

```
Time: 0m
├─ ProductManager starts PRD
├─ BusinessAnalyst starts user stories
├─ SoftwareArchitect starts tech stack selection
└─ SecurityArchitect starts threat model

Time: 5m
├─ ProductManager: PRD ready (5m)
└─ Update shared context

Time: 8m
├─ BusinessAnalyst: Stories ready (8m)
└─ Update shared context

Time: 12m
├─ SoftwareArchitect: Architecture ready (12m)
└─ Update shared context

Time: 15m
├─ SecurityArchitect: Threat model ready (15m)
└─ Update shared context

Total: 15m (vs 40m if serial)
Speedup: 2.67x
```

### Scenario 2: Development Phase (Depends on Architecture)

```
Time: 0m
├─ SoftwareArchitect working on design (BLOCKING for others)

Time: 8m
├─ SoftwareArchitect: Architecture ready
├─ FrontendEngineer starts UI implementation
├─ BackendEngineer starts API implementation
└─ DatabaseEngineer starts schema design

Time: 20m
├─ FrontendEngineer: UI complete (12m from start)
├─ BackendEngineer: API complete (12m from start)
├─ DatabaseEngineer: Schema complete (12m from start)
└─ FullstackEngineer starts integration tests

Time: 25m
└─ FullstackEngineer: Integration complete

Total: 25m (vs 45m if serial)
Speedup: 1.8x
```

### Scenario 3: Testing Phase (Peer Reviews in Parallel)

```
Time: 0m
├─ AutomationQA writes test suite
├─ AppSecEngineer does security audit (can read code)
└─ PenetrationTester does penetration testing

Time: 10m
├─ AutomationQA: Tests ready
├─ AppSecEngineer: Security audit ready
└─ PenetrationTester: Pen test results ready

All feedback collected in parallel → Developers fix issues simultaneously

Total: 10m + fix time (vs 30m if sequential reviews)
```

## Inter-Agent Communication Examples

### 1. FrontendEngineer Requests Clarification

```json
{
  "from": "frontend-engineer",
  "to": ["backend-engineer", "business-analyst"],
  "type": "clarification_request",
  "message": "User profile endpoint - should it return user's posts?",
  "reference": "US-005: User can view profile",
  "blocking_resolution": false,
  "deadline": "1 hour"
}
```

### 2. AppSecEngineer Flags Critical Issue

```json
{
  "from": "appsec-engineer",
  "to": ["backend-engineer"],
  "type": "security_blocker",
  "severity": "critical",
  "message": "SQL injection vulnerability in user search endpoint",
  "code_location": "api/search.ts:45",
  "remediation": "Use parameterized queries",
  "blocking_deployment": true
}
```

### 3. DevOpsEngineer Requests Artifact

```json
{
  "from": "devops-engineer",
  "to": ["backend-engineer", "frontend-engineer"],
  "type": "artifact_request",
  "message": "Need Docker configuration requirements",
  "needs": [
    "Node version",
    "Environment variables",
    "Build command",
    "Start command"
  ],
  "uses_for": "ci-cd-pipeline"
}
```

## Conflict Resolution

### When Agents Disagree

**Example**: FrontendEngineer wants REST API, BackendEngineer wants GraphQL

```
1. FrontendEngineer publishes concern:
   {type: "architecture_concern", message: "GraphQL is overkill"}

2. BackendEngineer responds with reasoning:
   {type: "architecture_justification", provides: ["scalability_analysis", "complexity_comparison"]}

3. SoftwareArchitect arbitrates:
   {type: "architecture_decision", decision: "GraphQL", rationale: "..."}

4. Both agents acknowledge and proceed:
   {type: "decision_acknowledged", agent: "frontend-engineer"}
```

## Collaboration Metrics

Track collaboration quality:

```json
{
  "phase": 3,
  "agents": 4,
  "metrics": {
    "parallelization_factor": 2.5,
    "critical_path": 25,
    "total_agent_time": 62,
    "efficiency": "40%",
    "blockers_resolved": 3,
    "conflicts": 1,
    "feedback_iterations": 2
  }
}
```

## Configuration

### Enable/Disable Parallelization

```json
// .sdlc/config.json
{
  "collaboration": {
    "parallel_execution": true,
    "max_parallel_agents": 4,
    "feedback_loops": true,
    "conflict_resolution": "architect-arbitrates",
    "communication_log": true,
    "blocking_mode": "strict"
  }
}
```

### Agent Affinity (Prefer Certain Collaborations)

```json
{
  "agent_affinities": {
    "frontend-engineer": ["ux-designer", "backend-engineer"],
    "backend-engineer": ["database-engineer", "devops-engineer"],
    "appsec-engineer": ["backend-engineer", "devops-engineer"]
  }
}
```

## Benefits

| Aspect | Serial | Parallel | Improvement |
|--------|--------|----------|-------------|
| **Speed** | 40 mins | 15 mins | 2.67x faster |
| **Feedback** | Linear | Bidirectional | Richer decisions |
| **Quality** | Deferred | Continuous | Earlier detection |
| **Throughput** | 1 project | 2-3 projects | Higher capacity |
| **Collaboration** | Handoffs | Real-time | Better integration |

## Usage Commands

```bash
# Run full SDLC with parallel agents
/sdlc "build a product" --parallel

# Run specific phase with parallelization
/sdlc-dev --parallel --max-workers=4

# Show agent collaboration status
/sdlc --show-collaboration-log

# Run agents sequentially (default fallback)
/sdlc "build a product" --sequential

# Debug collaboration issues
/sdlc --debug-collaboration --verbose
```

## Next Steps

1. Agents spawn and acquire tasks from queue
2. Each agent works independently with shared context access
3. Agents publish results to collaboration log
4. Dependent agents wake up and begin work
5. Feedback loops and peer reviews run in parallel
6. Phase completion when all dependencies satisfied
7. Move to next phase

---

**Status**: Framework designed for production implementation
**Integration**: Merge with existing `/sdlc` orchestrator commands
**Testing**: Multi-agent scenarios documented for validation
