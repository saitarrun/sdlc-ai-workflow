# SDLC Workflow Plugin — Installation Guide

Get instant access to 20 role-based agents, 13 knowledge skills, and 9 commands for building complete products with Claude Code.

## Quick Start (1 minute)

### Option 1: NPM Installation (Recommended)

```bash
npm install -g sdlc-workflow
sdlc-workflow install
```

### Option 2: Local Installation (from source)

```bash
git clone https://github.com/saitarrun/sdlc-workflow
cd sdlc-workflow
npm run install-local
```

### Option 3: Claude Code Plugin System

In Claude Code, run:
```
/plugin install github:saitarrun/sdlc-workflow
```

Then restart Claude Code.

---

## What You Get

### 20 Specialized Agents

**Phase 1 — Planning**
- Product Manager (roadmap, KPIs)
- Business Analyst (user stories, acceptance criteria)
- Software Architect (tech stack, ADR)
- Security Architect (threat modeling, STRIDE)

**Phase 2 — Design**
- UX Researcher (user journeys, personas)
- UI/UX Designer (wireframes, design system)

**Phase 3 — Development**
- Frontend Engineer (UI, client logic)
- Backend Engineer (APIs, business logic)
- Fullstack Engineer (end-to-end)
- Database Engineer (schema, migrations)
- Mobile Developer (iOS/Android)

**Phase 4 — Testing & Security**
- QA Manual Tester (exploratory testing, bugs)
- Automation QA Engineer (test suites, CI/CD)
- AppSec Engineer (SAST, SCA, OWASP)
- Penetration Tester (attack simulation)

**Phase 5 — Deployment**
- DevOps Engineer (CI/CD, containers)
- Cloud Engineer (IaC, VPC, IAM)

**Phase 6 — Operations**
- SRE Engineer (SLOs, monitoring)
- SecOps/SOC Analyst (security monitoring)
- Data Engineer (pipelines, analytics)

### 13 Knowledge Skills

- `skill-requirements` — INVEST, QUANTS framework
- `skill-architecture` — ADR, coupling/cohesion
- `skill-threat-modeling` — STRIDE, PASTA
- `skill-ux-design` — User journeys, wireframes
- `skill-code-standards` — Clean Code, SOLID, DRY
- **`skill-code-quality`** — NEW: Linting, testing, SAST/SCA, CI/CD gates
- `skill-code-review` — SE@Google Critique
- `skill-testing` — Testing Pyramid, F.I.R.S.T.
- `skill-security-audit` — OWASP Top 10
- `skill-cicd` — Hermetic builds, trunk-based dev
- `skill-cloud-infra` — Terraform, IaC
- `skill-documentation` — Docs-as-code
- `skill-ops-sre` — SLO/SLI, QUANTS, error budgets

### 9 Commands

| Command | Purpose |
|---------|---------|
| `/sdlc` | Master orchestrator (all 6 phases with approval gates) |
| `/sdlc-plan` | Phase 1: Planning & requirements → PRD + stories + threat model |
| `/sdlc-design` | Phase 2: Design & UX → wireframes + specs |
| `/sdlc-dev` | Phase 3: Development → code generation |
| `/sdlc-test` | Phase 4: Testing → test suites + security audits |
| `/sdlc-deploy` | Phase 5: Deployment → CI/CD + IaC |
| `/sdlc-ops` | Phase 6: Operations → SLOs + monitoring + runbooks |
| `/sdlc-review` | Code review (any phase) → PR comments + findings |
| `/sdlc-parallel` | Run a phase with agents collaborating in parallel |

---

## Verification

After installation, verify the plugin is available:

```bash
# Restart Claude Code, then:
/sdlc --help
```

You should see the master orchestrator help.

---

## Usage Examples

### Build a Complete Feature End-to-End

```
/sdlc "build a user authentication system with OAuth, JWT, and MFA"
```

This will:
1. Generate requirements (PRD, user stories, threat model)
2. Design UX flows and wireframes
3. Implement frontend + backend + database
4. Create comprehensive test suite (unit, integration, E2E)
5. Run security audits (SAST, SCA, OWASP)
6. Generate CI/CD pipeline and IaC
7. Define SLOs and monitoring

### Run Individual Phases

```bash
# Planning only
/sdlc-plan "add email notifications"

# Development only (use existing design)
/sdlc-dev --stack backend,frontend

# Testing + Security audits
/sdlc-test --layer all --run

# CI/CD setup with code quality gates
/sdlc-deploy --quality-gates
```

### Code Quality Standards

All development enforces code quality standards:
- ✓ Linting (ESLint, Pylint)
- ✓ Formatting (Prettier, Black)
- ✓ Type checking (TypeScript, mypy)
- ✓ Test coverage (80%+ threshold)
- ✓ SAST scanning (Snyk, SonarJS)
- ✓ SCA audits (npm audit, Trivy)
- ✓ Secret detection (git-secrets)
- ✓ Hermetic builds (no external deps)

---

## Configuration

### Default Settings

The plugin works out-of-the-box with sensible defaults:
- **Model tier**: Haiku (cheap/fast) → Sonnet (balanced) → Opus (powerful)
- **Coverage threshold**: 80% (95% for critical paths)
- **Test pyramid**: 70% unit, 20% integration, 10% E2E
- **Code complexity**: max 10 branches per function

### Customization

Create a `.sdlc/config.json` in your project root to override defaults:

```json
{
  "coverage_threshold": 85,
  "complexity_limit": 8,
  "test_pyramid": { "unit": 75, "integration": 20, "e2e": 5 },
  "models": {
    "planning": "sonnet",
    "development": "opus",
    "testing": "opus",
    "deployment": "sonnet"
  }
}
```

---

## Troubleshooting

### Plugin not showing up in `/help`

1. Verify installation:
   ```bash
   npm run validate
   ```

2. Restart Claude Code completely

3. Check agent files exist:
   ```bash
   ls ~/.claude/agents/sdlc-workflow/
   ```

### Commands return "not found"

1. Ensure plugin is installed:
   ```bash
   npm run install-local
   ```

2. Restart Claude Code

3. Type `/sdlc` to test

### Models fail to run

1. Verify your Claude Code model setting supports agents
2. Use `/fast` toggle to ensure you have sufficient quota

---

## Support

- **Issues**: https://github.com/saitarrun/sdlc-workflow/issues
- **Discussions**: https://github.com/saitarrun/sdlc-workflow/discussions
- **Email**: saitarrunpitta@gmail.com

---

## What's New in This Release

### v1.0.0

✨ **New Skill**: `skill-code-quality`
- Comprehensive code quality standards (linting, testing, SAST/SCA, security)
- Configuration templates (ESLint, Jest, pre-commit hooks, GitHub Actions)
- Integration with all QA and DevOps agents

✅ **Enhanced Agents**:
- automation-qa-engineer: SAST/SCA scanning, coverage gates, CI/CD integration
- qa-manual-tester: Security testing checklist, input validation testing
- appsec-engineer: Code quality integration with security audits
- devops-engineer: Quality gates in CI/CD pipeline

📋 **Resources**:
- Complete CHECKLIST.md mapping all standards to implementations
- Configuration templates for immediate adoption
- Pre-commit hooks for local enforcement

---

## License

MIT — Use freely in your projects!

---

**Ready to build?** Start with `/sdlc "describe what you want to build"`

Happy building! 🚀
