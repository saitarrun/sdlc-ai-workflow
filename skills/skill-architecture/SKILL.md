---
name: skill-architecture
description: This skill should be used when the user asks to "design a system", "architecture", "ADR", "system design", "tech stack", "choose between approaches", "coupling", "service granularity", "blueprint", "component design", "API contract", "schema design", "trade-offs", or discusses "monolith", "microservices", "fitness functions", or architectural decisions.
version: 1.0.0
---

# Skill: System Architecture & ADRs

## Architecture Decision Record (ADR) Format

An ADR documents **why** an architectural decision was made, not just **what** was chosen.

```markdown
# ADR-NNN: [Decision Title]

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-NNN

## Context
Why are we making this decision? What's the problem?
What constraints do we have (timeline, team size, technical)?
What have we already tried or considered?

## Decision
What exactly are we choosing to do?
Be specific and precise.

## Consequences

### Positive
- Benefit 1
- Benefit 2

### Negative
- Tradeoff 1
- Tradeoff 2

### Mitigations
- How we'll handle negative consequences
```

## Tech Stack Decision Template

Compare 3 options for each major choice:

| Factor | Option A | Option B | Option C |
|--------|----------|----------|----------|
| Learning curve | Steep | Gentle | Moderate |
| Community | Large | Small | Medium |
| Performance | 1000 rps | 10k rps | 5k rps |
| Scalability | Hard | Easy | Medium |
| Team expertise | None | High | Medium |

**Decision**: Option B  
**Reasoning**: Team knows it, easy to scale, community support

## Coupling vs. Cohesion

**High Cohesion** = related code lives together
- Example: All user auth logic in AuthService module

**Low Coupling** = modules don't depend on each other heavily
- Example: PaymentService doesn't directly call AuthService; uses events instead

**Goal**: High cohesion + low coupling = easy to change

## Service Granularity Spectrum

| Monolith | Distributed Monolith | Microservices |
|----------|---------------------|---------------|
| One codebase, one deploy | One codebase, separate deploys | Many codebases, many deploys |
| Easy to test end-to-end | Harder to test end-to-end | Complex testing, many moving parts |
| Scales vertically (bigger server) | Scales each layer independently | Scales each service independently |
| All-or-nothing deploy risk | Lower deploy risk | Highest deploy risk if not careful |

**When to split from monolith → services:**
- Team is >20 engineers (communication overhead)
- Need independent scaling (some services get more traffic)
- Different technology stacks needed (one service needs fast Go, another needs Python ML)
- Deploy frequency conflict (some teams want to deploy hourly, others weekly)

## Fitness Functions

Automated architecture compliance checks:

```bash
# "Fitness function": verify architecture is maintained

# 1. No circular dependencies
$ grep -r "import.*from.*$module" $module  # Should be empty

# 2. Only public APIs are used across modules
$ grep -r "from.*_internal" # Should be zero

# 3. All HTTP endpoints document schema
$ grep -r "@Post\|@Get" --include="*.ts" | wc -l
$ grep -r "^export.*DTO" --include="*.ts" | wc -l
# These should match (all endpoints have DTOs)

# 4. Database queries use ORM, not raw SQL
$ grep -r "query(.*SELECT" # Should be zero
```

