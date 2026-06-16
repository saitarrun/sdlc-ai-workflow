# Google Engineering Team Replication Roadmap

Complete plan to replicate a full Google Software Engineering team structure, practices, and culture.

## Status: Gap Analysis

**Current**: 20 agents, 30 skills, 6 phases  
**Target**: 26 agents, 43 skills, 9 phases (complete Google team)  

---

## MISSING AGENTS (Add 6)

### Engineering Manager
- **Phase**: Cross-cutting (all phases)
- **Responsibilities**: Team health, career development, hiring, roadmap alignment, stakeholder management
- **Output**: Team retrospectives, 1:1 summaries, hiring rubrics, team quarterly goals
- **Model**: Opus (high-leverage decisions)
- **Skills needed**: skill-organizational-health, skill-knowledge-management, skill-tech-debt

### Tech Lead / Technical Lead
- **Phase**: Cross-cutting (planning + architecture)
- **Responsibilities**: Technical direction, ADR reviews, architecture decisions, mentoring, code review leadership
- **Output**: RFC decisions, architecture reviews, mentoring plans, tech strategy docs
- **Model**: Opus
- **Skills needed**: skill-architecture, skill-knowledge-management, skill-api-design

### Release Manager
- **Phase**: 5 (Deployment)
- **Responsibilities**: Release planning, rollout strategy, rollback procedures, version management, changelog
- **Output**: Release notes, rollout plan, runbook, backport strategy
- **Model**: Sonnet
- **Skills needed**: skill-release-management, skill-configuration-management, skill-dependency-management

### Technical Writer / Developer Relations
- **Phase**: 2 (Design) + Cross-cutting
- **Responsibilities**: API documentation, SDK docs, guides, tutorials, external communication, examples
- **Output**: API reference, tutorials, developer guides, release announcements
- **Model**: Sonnet
- **Skills needed**: skill-developer-relations, skill-documentation

### Performance Engineer
- **Phase**: 3 (Dev) + 4 (Test)
- **Responsibilities**: Profiling, benchmarking, optimization, bottleneck analysis, performance testing
- **Output**: Performance reports, optimization PRs, benchmark results, profiling analysis
- **Model**: Sonnet
- **Skills needed**: skill-performance-optimization, skill-playwright

### Accessibility Engineer
- **Phase**: 2 (Design) + 4 (Test)
- **Responsibilities**: WCAG compliance, accessibility testing, inclusive design, assistive tech validation
- **Output**: Accessibility audit, WCAG checklist, accessible components, testing guidelines
- **Model**: Sonnet
- **Skills needed**: skill-accessibility, skill-code-quality

---

## MISSING SKILLS (Add 13)

### Phase-Specific Skills

#### skill-release-management
- Release planning & scheduling
- Version numbering (semver)
- Rollout strategies (canary, blue-green, feature flags)
- Rollback procedures
- Changelog generation
- Dependency coordination
- Performance validation pre-release

#### skill-performance-optimization
- Profiling (CPU, memory, allocations)
- Benchmarking & regression detection
- Bottleneck analysis (flame graphs, trace data)
- Optimization strategies (algorithmic, caching, parallelization)
- Perf testing infrastructure
- Metrics collection & interpretation
- Profiling best practices (reduce noise, iterate)

#### skill-accessibility
- WCAG 2.1 AA compliance
- Semantic HTML, ARIA labels
- Keyboard navigation
- Color contrast, text sizing
- Screen reader testing
- Inclusive design patterns
- Accessibility testing tools (axe, WAVE)

#### skill-api-design
- RESTful API principles
- API versioning strategies
- Error codes & formats
- Request/response contracts
- Backward compatibility
- Rate limiting & throttling
- API documentation standards
- SDK generation from OpenAPI

#### skill-build-systems
- Hermetic builds (Bazel, Buck)
- Dependency caching & distribution
- Incremental compilation
- Build optimization (parallelism, caching)
- Build reproducibility (bit-for-bit)
- Binary stripping & optimization
- Cross-compilation

#### skill-observability
- Metrics (time-series, cardinality)
- Logging (structured, sampling, retention)
- Distributed tracing (spans, context propagation)
- Dashboards (Grafana, custom)
- Alert design (reducing noise)
- SLO-driven alerting
- Post-incident analysis via observability

#### skill-incident-management
- Incident classification (SEV1/2/3)
- Incident timeline & communication
- Incident commander role
- Escalation procedures
- Blameless postmortem process
- RCA (root cause analysis) methodology
- Incident retrospectives & action items
- On-call burden tracking

#### skill-tech-debt
- Tech debt inventory & scoring
- Paydown strategy & prioritization
- Deprecation planning
- Migration tracking
- Refactoring initiatives
- Backward compatibility vs. cleanup
- Communicating tech debt to stakeholders

#### skill-configuration-management
- Secrets management (vaults, rotation)
- Environment-specific configs
- Safe defaults & fail-secure
- Config validation & schema
- Feature flags (safe rollout)
- Configuration as code
- Compliance & audit trails

#### skill-localization
- i18n/l10n strategy
- String externalization
- Plural/gender handling
- Right-to-left text support
- Cultural adaptation
- Translation workflow
- Locale-specific testing

#### skill-dependency-management
- Dependency updates (major/minor/patch)
- Security patch application
- Version pinning vs. ranges
- Transitive dependency resolution
- Monorepo dependency management
- Deprecation tracking
- License compliance

#### skill-knowledge-management
- Design doc format (context, decision, consequences)
- RFC (Request for Comments) process
- ADR (Architecture Decision Records)
- Code comments (WHY, not WHAT)
- Documentation structure (README, API, guides)
- Knowledge discovery (search, tags)
- Cross-team communication

#### skill-organizational-health
- Retrospectives (blameless, action items)
- Team health metrics (sentiment, velocity, deployment frequency)
- Psychological safety & trust
- Mentoring & career growth
- Diversity & inclusion
- On-call burden & burnout prevention
- Team dynamics & conflict resolution

---

## MISSING PHASES & COMMANDS (Add 3 Phases + 5 Commands)

### Phase 7: Incident Response (Production Issues)
**When**: Triggered by production incident  
**Agents**: Incident Commander, SRE Engineer, On-Call Engineer (backend/frontend relevant)  
**Skills**: skill-incident-management, skill-diagnose, skill-ops-sre  
**Output**: Incident timeline, mitigation steps, communication log, action items  
**Command**: `/sdlc-incident` or triggered automatically  

### Phase 8: Retrospectives & Learning
**When**: After incident or release  
**Agents**: Engineering Manager, Tech Lead, relevant phase leads  
**Skills**: skill-organizational-health, skill-knowledge-management, skill-incident-management  
**Output**: Postmortem report, action items, team notes, lessons learned  
**Command**: `/sdlc-retrospective`  

### Phase 3.5: Tech Debt & Performance (Continuous)
**When**: Between features, sprint planning  
**Agents**: Performance Engineer, Tech Lead, relevant engineers  
**Skills**: skill-performance-optimization, skill-tech-debt, skill-architecture  
**Output**: Optimization PRs, benchmarks, tech debt paydown plan  
**Commands**: `/sdlc-optimize` (performance), `/sdlc-tech-debt` (debt paydown)  

### New Commands

| Command | Phase | Purpose |
|---------|-------|---------|
| `/sdlc-incident` | 7 | Incident response: timeline, triage, mitigation |
| `/sdlc-retrospective` | 8 | Postmortem & lessons learned |
| `/sdlc-optimize` | 3.5 | Performance profiling & optimization |
| `/sdlc-tech-debt` | 3.5 | Tech debt inventory & paydown |
| `/sdlc-release` | 5+ | Release planning & rollout |

---

## KEY ARTIFACTS & TEMPLATES (Add 15)

### Design & Decision-Making
1. **RFC Template** — Request for Comments (pre-design discussion)
   - Problem statement, proposed solution, alternatives, tradeoffs, timeline
   
2. **Design Doc Template** — Detailed design (before implementation)
   - Context, goals, proposed design, alternatives, tradeoffs, rollout plan

3. **ADR Template** — Architecture Decision Record (decision history)
   - Context, decision, consequences, tradeoffs, alternatives considered

### Development
4. **API Contract Template** — OpenAPI/gRPC definition
   - Endpoints, request/response, error codes, versioning strategy
   
5. **Code Review Checklist** — What to look for
   - Tests (coverage, flakiness), docs, perf impact, security, accessibility

### Testing & Quality
6. **Performance Benchmark Template** — Profiling results
   - Baseline, change, regression analysis, profiling data

7. **Accessibility Audit Checklist** — WCAG 2.1 AA
   - Semantic HTML, ARIA, keyboard nav, color contrast, screen reader

8. **Security Audit Checklist** — OWASP Top 10
   - Input validation, auth/authz, secrets, injection, XSS, CSRF

### Operations
9. **Incident Report Template** — During incident
   - Timeline, affected services, SEV level, mitigation steps, status

10. **Postmortem Template** — After incident
    - Incident summary, root causes, timeline, action items, prevention

11. **Release Notes Template** — Release communication
    - What's new, breaking changes, migration guide, known issues

12. **Runbook Template** — Operational procedures
    - Prerequisites, steps, rollback, monitoring, escalation

### Observability
13. **SLO Definition Template** — Service Level Objective
    - SLI (indicator), target, error budget, measurement method

14. **Alert Rule Template** — Monitoring & alerting
    - Condition, severity, escalation, runbook link

15. **Metrics Dashboard Template** — Grafana/custom
    - Key metrics, panels, drill-down, alerting thresholds

---

## PRACTICES TO EMBED (New Skill Content)

### From "Software Engineering at Google"

**Critique Culture**
- Readability reviews (separate from code reviews)
- LGTM culture (trust + quality)
- Blocking vs. informational comments
- Review SLA (24 hours)
- Code ownership clarity

**Testing Culture**
- Testing Pyramid: 70% unit / 20% integration / 10% E2E
- Flake prevention (hermetic, deterministic)
- Test failure severity (fix immediately or file bug)
- Coverage targets (80%+ for critical paths)

**Documentation Culture**
- Docs live next to code
- README as user manual
- API docs as contract
- Design docs for major decisions
- Code comments explain WHY, not WHAT

**Operational Excellence**
- SLO-driven development
- Error budgets (consume wisely)
- On-call readiness (documented, paged fairly)
- Postmortem culture (blameless, action items)
- Toil measurement & automation

**Team Health**
- Psychological safety (speak up, disagree, fail)
- Career growth (mentoring, promotions)
- Diverse hiring & inclusion
- Burnout prevention (on-call rotation, vacation)
- Retrospectives (continuous improvement)

---

## WORKFLOW INTEGRATIONS (New Hooks & Automation)

### Pre-Commit Hooks
```bash
# Run before commit
- Linting (ESLint, Prettier, Black, etc.)
- Type checking (TypeScript, mypy, etc.)
- Unit tests (fail if any fail)
- Secret scanning (no API keys)
- Accessibility checks (automated a11y linting)
```

### Pre-Push Hooks
```bash
# Run before push
- All pre-commit checks
- Integration tests (if time allows)
- Performance benchmark (warn if regression)
- Build verification (compile, bundle)
```

### CI Pipeline Stages
```bash
1. Presubmit (before merge)
   - All tests pass
   - Coverage ≥ threshold
   - No linting/type errors
   - Security scan pass
   - Build succeeds

2. Postsubmit (after merge)
   - Full integration tests
   - Performance benchmarks
   - Deployment to staging
   - E2E tests vs. staging

3. Release
   - Version bump (semver)
   - Changelog generation
   - Build artifacts
   - Rollout plan (canary → full)
```

### Monitoring & Alerting
```bash
- Deployment frequency (track velocity)
- Lead time for changes (how fast can we ship)
- Change failure rate (quality metric)
- MTTR (mean time to recovery)
- Error budget consumption (SLO tracking)
```

---

## ORGANIZATIONAL STRUCTURE (Matrix)

### By Phase (Current)
```
Phase 1: Product Manager, Business Analyst, Architect, Security Architect
Phase 2: UX Researcher, UI Designer
Phase 3: Frontend/Backend/Fullstack Engineer, Database Engineer, Mobile Developer
Phase 4: QA Tester, Automation QA, AppSec Engineer, Pen Tester, Performance Engineer
Phase 5: DevOps Engineer, Cloud Engineer, Release Manager
Phase 6: SRE Engineer, SecOps Analyst, Data Engineer
```

### By Cross-Cutting Role (New)
```
Engineering Manager — Oversees team health, career growth, roadmap alignment
Tech Lead — Ensures architectural consistency, mentors, reviews ADRs/RFCs
Technical Writer — API docs, SDK docs, guides, tutorials
Build System Engineer — Build speed, reproducibility, dependency management
Incident Commander — Incident response, postmortem facilitation
```

### By Specialty (Add)
```
Performance Engineer — Profiling, optimization, benchmarking
Accessibility Engineer — WCAG compliance, inclusive design
Configuration Manager — Secrets, env configs, feature flags
Localization Engineer — i18n/l10n, multi-language support
Observability Engineer — Metrics, logs, traces, dashboards
```

---

## SUCCESS METRICS (Google QUANTS)

### Quality
- Code coverage ≥ 80% (critical paths)
- Zero linting/type errors in presubmit
- Test flakiness < 1%
- Security findings fixed within SLA
- Accessibility compliance: WCAG 2.1 AA

### Attention
- Code review turnaround < 24 hours
- Tech debt paydown: 10% of sprint capacity
- On-call fairness (rotation balanced)
- Mentoring hours (1:1s, code review feedback)

### Toil
- Manual release steps → automated (CI/CD)
- Manual testing → automated (test pyramid)
- Manual config → IaC (Terraform/CDK)
- Manual incident response → runbooks + automation

### Time
- Deployment frequency (daily or on-demand)
- Lead time for changes (< 1 hour)
- MTTR (< 30 min for SEV1)
- Feature velocity (story points/sprint)

### Satisfaction
- Team engagement (survey)
- Code review feedback quality (helpfulness)
- On-call satisfaction (not burned out)
- Career growth (promotions, learning)
- Psychological safety (blameless culture)

---

## IMPLEMENTATION PRIORITY

### Phase 1 (Immediate)
- Add 6 agents (Manager, Tech Lead, Release, Writer, Performance, A11y)
- Add 8 core skills (incident, tech debt, perf, a11y, observability, API design, build systems, localization)
- Add incident response phase + command
- Add artifact templates (RFC, design doc, postmortem)

### Phase 2 (Short-term)
- Add 5 remaining skills (config, dependency, knowledge mgmt, org health, release)
- Add retrospective phase + command
- Add tech debt + optimize commands
- Implement pre-commit/pre-push hooks

### Phase 3 (Long-term)
- Integration with incident tracking (PagerDuty, OpsGenie)
- Integration with CI/CD (GitHub Actions monitoring)
- Integration with monitoring (Prometheus, Grafana)
- Integration with docs (confluence, wiki)
- Analytics & dashboards (QUANTS tracking)

---

## REFERENCES

- "Software Engineering at Google" — Chapters on testing, documentation, tools, culture
- "Architecture: The Hard Parts" — Service design, coupling, fitness functions
- Google SRE Book — Incident response, postmortems, observability
- Google Cloud Best Practices — Release, deployment, operations
- Web.dev — Accessibility standards, performance
- OpenAPI Specification — API design standards

---

**Status**: Roadmap for complete Google team replication  
**Effort**: ~40 commits, ~80 code changes, ~20 new templates  
**Timeline**: Can be implemented incrementally (phase by phase)
