# Agent-Skills Mapping Manifest

**Complete SDLC Workflow** — 26 agents × 43 skills × 6 phases

---

## How It Works

1. **Agent frontmatter** includes `skills: [skill-name, ...]`
2. **Commands** auto-load all phase-specific skills before spawning agents
3. **Agent system prompt** begins with: "You have access to these skills: X, Y, Z..."
4. **Skill content** loads as context (pure methodology, not tools)
5. **Outputs** follow skill templates and industry-standard practices

---

## Phase 1 — Planning, Strategy & Requirements

### product-manager
**Skills**: skill-grill-me, skill-requirements, skill-prd-synthesis
**Output**: Customer interview (grill session), PRD with QUANTS metrics, roadmap, success criteria
**Key**: Relentless customer interview, INVEST criteria, QUANTS framework, stakeholder alignment

### business-analyst
**Skills**: skill-requirements, skill-plan-breakdown, skill-issue-triage
**Output**: User stories (INVEST), vertical-slice breakdown, triage workflow
**Key**: Tracer bullets, independent slices, acceptance criteria

### software-architect
**Skills**: skill-architecture, skill-threat-modeling, skill-api-design
**Output**: ADR with trade-offs, coupling analysis, fitness functions, API contracts
**Key**: ADR (Context/Decision/Consequences), One-Version Rule, API contracts

### security-architect
**Skills**: skill-threat-modeling, skill-security-audit
**Output**: Threat model (STRIDE/PASTA), attack surface map, security controls
**Key**: Attack surface ranking, defense-in-depth, risk prioritization

### tech-lead ⭐ NEW
**Skills**: skill-architecture, skill-knowledge-management, skill-api-design, skill-code-review
**Output**: RFC decisions, ADR reviews, mentoring plans, architecture consistency
**Key**: RFC process, code review leadership, architectural oversight

### engineering-manager ⭐ NEW
**Skills**: skill-organizational-health, skill-knowledge-management, skill-tech-debt
**Output**: Team retrospectives, QUANTS metrics, career growth plans, hiring rubrics
**Key**: Blameless culture, psychological safety, continuous improvement

---

## Phase 2 — Design & Prototyping

### ux-researcher
**Skills**: skill-ux-design
**Output standard**: User journey maps, personas with archetypes, research findings
**Key principles**: User-centered design, journey mapping, persona development

### ui-ux-designer
**Skills**: skill-ux-design, skill-prototype
**Output standard**: Wireframes (ASCII or tool), design system tokens, component specs, interactive prototype
**Key principles**: Design system DRY, accessibility-first, responsive design

---

## Phase 3 — Development & Coding

### frontend-engineer
**Skills**: skill-code-standards, skill-code-quality, skill-architecture, skill-zoom-out
**Output standard**: Components + unit tests (70%), integration tests (20%), E2E tests (10%), zero linting/type errors
**Key principles**: Clean Code (naming, small functions, SOLID), testing pyramid, hermetic builds

### backend-engineer
**Skills**: skill-code-standards, skill-code-quality, skill-architecture, skill-zoom-out
**Output standard**: API handlers + business logic + tests (Testing Pyramid), ADR for decisions, zero type errors
**Key principles**: Clean Code, repository pattern, service layer separation, error handling

### fullstack-engineer
**Skills**: skill-code-standards, skill-code-quality, skill-architecture, skill-zoom-out
**Output standard**: End-to-end feature (frontend + backend + tests), ADR, API contracts documented
**Key principles**: Clean Code, Testing Pyramid, tracer bullets (minimal viable feature first), SOLID

### database-engineer
**Skills**: skill-code-standards, skill-code-quality, skill-architecture
**Output standard**: Schema migrations, index strategy, query optimization, zero N+1 bugs
**Key principles**: Normalization, constraint-driven design, query plans, immutability patterns

### mobile-developer
**Skills**: skill-code-standards, skill-code-quality, skill-architecture, skill-zoom-out
**Output standard**: Native components + platform best practices + tests, offline-first design
**Key principles**: Clean Code, platform patterns, accessibility, battery/network awareness

---

## Phase 4 — Testing & Security Auditing

### qa-manual-tester
**Skills**: skill-testing, skill-code-quality, skill-playwright
**Output standard**: Test cases (Given-When-Then), bug reports with reproduction steps, accessibility audit
**Key principles**: Exploratory testing, edge cases, usability-from-user-perspective, WCAG compliance

### automation-qa-engineer
**Skills**: skill-testing, skill-tdd, skill-code-quality, skill-playwright
**Output standard**: Test suite (70% unit / 20% integration / 10% E2E), CI-wired, zero flakes, Page Object Model
**Key principles**: Testing Pyramid, F.I.R.S.T. (Fast, Independent, Repeatable, Self-validating, Timely), DRY selectors

### appsec-engineer
**Skills**: skill-security-audit, skill-code-quality, skill-threat-modeling
**Output standard**: SAST findings with severity/remediation, SCA report, CWE mapping, OWASP Top 10 audit
**Key principles**: Defense-in-depth, input validation, least privilege, secure defaults

### penetration-tester
**Skills**: skill-security-audit, skill-threat-modeling, skill-diagnose
**Output standard**: Exploit scenarios, business impact, remediation steps, verification of fixes
**Key principles**: Attack chains, privilege escalation, defense evasion, impact assessment

---

## Phase 5 — Infrastructure & Deployment

### devops-engineer
**Skills**: skill-cicd, skill-precommit-hooks, skill-code-quality, skill-git-safety
**Output standard**: GitHub Actions pipeline (presubmit gates, artifact-based caching), Dockerfile, no broken trunk
**Key principles**: Hermetic builds, trunk-based development, feature flags, fail-fast gates

### cloud-engineer
**Skills**: skill-cloud-infra, skill-architecture, skill-code-quality
**Output standard**: Terraform/CDK code, VPC/IAM/storage design, cost optimization, disaster recovery plan
**Key principles**: IaC immutability, least privilege IAM, high availability, cost-aware design

---

## Phase 6 — Production, Maintenance & Monitoring

### sre-engineer
**Skills**: skill-ops-sre, skill-diagnose, skill-code-quality
**Output standard**: SLO/SLI definitions, alerting rules, on-call runbook, QUANTS summary, error budget tracking
**Key principles**: SLO-driven reliability, error budget allocation, toil measurement, on-call burden

### secops-analyst
**Skills**: skill-ops-sre, skill-security-audit, skill-threat-modeling
**Output standard**: Incident response runbooks, threat hunting queries, detection rules, post-incident report
**Key principles**: Detection & response, threat intelligence, incident severity triage, root cause analysis

### data-engineer
**Skills**: skill-architecture, skill-code-quality, skill-code-standards
**Output standard**: ETL/ELT pipeline, schema design, data quality checks, performance benchmarks, documentation
**Key principles**: Data modeling, pipeline observability, quality gates, incremental loading

---

## Utilities (All Phases)

### Universal Skills
- **skill-caveman**: Activate when user says "caveman mode", "less tokens", "be brief"
- **skill-grill-me**: Activate when user says "grill me", "stress test", "challenge this"
- **skill-git-safety**: Always active during code/infrastructure changes
- **skill-handoff**: Use when handing off to another agent
- **skill-pr-review**: Use when reviewing GitHub PRs
- **skill-playwright**: Use for frontend testing/automation
- **skill-write-skill**: Use when creating new skills
- **skill-teach**: Use when user asks to learn a topic

---

## How Commands Load Skills

Commands (sdlc-plan, sdlc-dev, sdlc-test, etc.) perform the following:

```
1. Identify phase agents to spawn
2. Collect all skills for that phase
3. Inject skills into agent context via system prompt
4. Supply skill files as reference documents
5. Agent system prompt begins: "Apply these skills: X, Y, Z"
```

**Example**: `/sdlc-dev` spawns frontend-engineer, backend-engineer, database-engineer
- Collects: skill-code-standards, skill-code-quality, skill-architecture, skill-zoom-out (union of all)
- Injects into each agent's context
- Each agent's prompt references these skills

---

## Output Standards by Phase

### Phase 1 — Planning
- **Format**: Markdown with structured sections (Goals, User Stories, Acceptance Criteria, Risks)
- **Validation**: User stories follow INVEST criteria
- **Artifacts**: PRD, user stories, threat model, GitHub issues

### Phase 2 — Design
- **Format**: ASCII wireframes or design tokens, component spec (structure + behavior + states)
- **Validation**: Wireframes reflect user journeys, WCAG AA accessibility
- **Artifacts**: Wireframes, design system, prototype

### Phase 3 — Development
- **Format**: Clean code (Clean Code principles), tests inline with code
- **Validation**: Zero linting errors, zero type errors, zero test failures, code follows ADR
- **Artifacts**: Implementation, tests (70/20/10), ADR for decisions

### Phase 4 — Testing
- **Format**: Test cases (Given-When-Then), bug reports (Steps to Reproduce, Expected vs. Actual)
- **Validation**: All tests pass, flake-free, 80%+ coverage, no false positives
- **Artifacts**: Test suite, security audit, bug reports

### Phase 5 — Deployment
- **Format**: IaC (Terraform/CDK), CI/CD pipeline YAML
- **Validation**: Hermetic (no network calls), reproducible, artifact-based caching
- **Artifacts**: Pipeline, Dockerfile, IaC, presubmit gates

### Phase 6 — Operations
- **Format**: YAML (SLOs, alerts), Markdown (runbooks), JSON (metrics)
- **Validation**: SLOs tied to business goals, alerts actionable, runbooks executable
- **Artifacts**: SLO/SLI definitions, alert rules, runbooks, dashboards

---

## Implementation Checklist

- [ ] Update each agent's frontmatter with `skills: [...]`
- [ ] Update each agent's system prompt to reference skills
- [ ] Create output templates in each skill
- [ ] Update commands (sdlc-plan, sdlc-dev, etc.) to inject skills
- [ ] Document in CLAUDE.md: "Agents auto-load phase-specific skills"
- [ ] Test: Verify agent mentions skill principles in output
- [ ] Test: Verify outputs follow phase standards

---

**Last Updated**: 2026-06-16  
**Status**: Reference document for agent-skill wiring
