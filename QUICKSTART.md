# SDLC Workflow Plugin — Quick Start Guide

## Install (1 minute)

```bash
cd /Users/xploit404/Documents/claude_agents_workflow/sdlc-workflow
make install-local
```

✅ Plugin is now live in your Claude Code environment.

---

## Use (Try These Commands)

### Option 1: Full 6-Phase Pipeline (20 minutes)

Run the complete SDLC end-to-end:

```
/sdlc "build a user dashboard that shows real-time analytics"
```

**What happens:**
1. **Phase 1** → Product Manager defines roadmap, Business Analyst writes user stories, Architect designs system, Security Architect threat-models
2. **GATE**: You review and approve the requirements + architecture
3. **Phase 2** → UX Researcher studies users, Designer creates wireframes
4. **GATE**: You review and approve designs
5. **Phase 3** → Engineers implement code (frontend + backend + database)
6. **GATE**: You review implementation
7. **Phase 4** → QA writes tests, Security team audits for OWASP Top 10
8. **GATE**: Tests green, security findings resolved
9. **Phase 5** → DevOps creates CI/CD pipeline, Cloud engineer provisions infrastructure
10. **Phase 6** → SRE defines SLOs, SecOps sets up monitoring, Data engineer creates pipelines
11. **Summary** → All artifacts compiled, PR created automatically

**Output**: `.sdlc/run-<timestamp>/` directory with 12+ comprehensive documents

---

### Option 2: Individual Phases (Faster Iteration)

Use individual commands to skip ahead or redo phases:

```bash
# Just Phase 1 — Requirements
/sdlc-plan "add OAuth login"
# Output: PRD + user stories + ADR + threat model

# Just Phase 2 — Design
/sdlc-design
# Output: Wireframes + component specs

# Just Phase 3 — Code
/sdlc-dev --stack backend,frontend
# Output: Implementation files

# Just Phase 4 — Tests + Security
/sdlc-test --layer all --run
# Output: Test files + security audit

# Just Phase 5 — Infrastructure
/sdlc-deploy --trigger
# Output: GitHub Actions pipeline + Terraform

# Just Phase 6 — Operations
/sdlc-ops
# Output: SLOs + monitoring rules + runbooks

# Anytime — Code Review
/sdlc-review --pr 1
# Output: SE@Google Critique-style review as PR comments
```

---

## What You Get

Each phase produces specific artifacts:

| Phase | Output Files | What's Inside |
|-------|--------------|---------------|
| 1 | `01-roadmap.md` | Product vision, QUANTS metrics, milestones |
| 1 | `01-requirements.md` | User stories (INVEST format), acceptance criteria |
| 1 | `01-architecture.md` | Tech stack decision, ADR, component design, trade-off table |
| 1 | `01-threat-model.md` | STRIDE analysis, security controls |
| 2 | `02-user-journeys.md` | Personas, journey maps, competitive analysis |
| 2 | `02-wireframes.md` | ASCII wireframes, component specs, design system |
| 3 | `03-implementation.log` | All code files created, organized by component |
| 4 | `04-test-cases.md` | Test suite (unit/integration/E2E), coverage report |
| 4 | `04-security.md` | OWASP audit, CVE scan, penetration test findings |
| 5 | `05-pipeline.log` | GitHub Actions workflow status, Docker image details |
| 6 | `06-slo.md` | Service Level Objectives, error budgets, on-call runbooks |
| 6 | `06-secops.md` | Security monitoring setup, alert rules |
| 6 | `06-data-pipelines.md` | ETL/ELT workflows, analytics schema |
| All | `SUMMARY.md` | Complete summary + PR link |

---

## Key Features

### 1. **Book-Guided Best Practices**

Every agent is trained on principles from:
- **Software Engineering at Google** — QUANTS, INVEST, Testing Pyramid, Hermetic Builds
- **Architecture: The Hard Parts** — ADRs, coupling/cohesion, fitness functions
- **The Pragmatic Programmer** — DRY, ETC, tracer bullets, code generation
- **Clean Code** — naming, small functions, SOLID, F.I.R.S.T. tests

### 2. **Approval Gates Between Phases**

No phase runs until you explicitly approve the previous phase's output. Prevents cascading errors.

### 3. **Shared State**

All phases read/write to `.sdlc/run-N/` directory, so you can re-run a single phase without redoing everything upstream.

### 4. **GitHub Integration**

- Creates issues from user stories
- Posts inline PR comments for code review
- Auto-creates PRs with comprehensive summaries

### 5. **Security-First**

- Threat modeling (STRIDE) in architecture phase
- Full OWASP Top 10 audit in testing phase
- Penetration testing before deployment
- Secrets masking (never prints raw credentials)

### 6. **Model Tiering**

- **Haiku** for fast/templated tasks (database engineer, DevOps)
- **Sonnet** for development/analysis (all engineers)
- **Opus** for high-leverage decisions (architects, security, SRE)

---

## Common Workflows

### Scenario 1: Build a Feature End-to-End

```
/sdlc "add email notifications to user profile changes"
→ Approval at each gate
→ Complete feature ready to merge
```

### Scenario 2: Just Need Code, Already Have Design

```
/sdlc-dev --stack backend
→ Skips to coding phase
→ Reads from architecture doc
→ Generates code + tests
```

### Scenario 3: Security Review of Existing PR

```
/sdlc-review --pr 42
→ 3 parallel reviewers (compliance, bugs, history)
→ Posts comments to PR
→ Severity-ranked findings
```

### Scenario 4: New SRE Joining Team

```
/sdlc-ops --service api-backend
→ Generates SLO template
→ Creates on-call runbook
→ Sets up monitoring config
```

---

## Helpful Tips

### 🔍 See What Each Agent Does

Each agent file (in `agents/`) has:
- **name**: Identifier (e.g., `product-manager`)
- **description**: When to invoke
- **tools**: What it can do
- **model**: How powerful (haiku/sonnet/opus)
- **Body**: Full system prompt

Read the body to understand exactly what that agent will do.

### 🛠️ Extend with New Agents

1. Create `agents/new-role.md` with proper frontmatter
2. Follow the pattern in existing agents
3. Wire into a command's orchestration flow
4. Run `make install-local` to test

See `CLAUDE.md` for detailed development guide.

### 📚 Reference the Books

When you see an agent doing something smart (e.g., Critique review, Testing Pyramid), that's a principle from one of the 4 reference books embedded directly in the agent's system prompt.

Curious which book? Check the agent's body — book principles are explicitly documented.

### 🚀 Performance

- Phase 1 (requirements) takes ~2 minutes per phase gate
- Phase 3 (code generation) varies by feature size (small: 3 min, large: 10 min)
- Total end-to-end for a small feature: ~20 minutes with gates

---

## Troubleshooting

### Plugin Not Loading?

```bash
cd /Users/xploit404/Documents/claude_agents_workflow/sdlc-workflow
make validate
```

If validation fails, check `CLAUDE.md` for agent frontmatter requirements.

### Missing Agent?

```bash
make install-local
```

Re-installs all agents to `~/.claude/agents/`.

### Want to Uninstall?

```bash
make uninstall
```

Removes all plugin files from `~/.claude/`.

---

## What's Next?

1. **Try it**: `/sdlc "your feature here"`
2. **Extend it**: Add new agents to `agents/` directory
3. **Integrate it**: Wire into your team's workflow
4. **Share it**: Push to GitHub, install via `/plugin install`

---

## Support

- **User Guide**: See `README.md`
- **Development**: See `CLAUDE.md`
- **Architecture**: See `IMPLEMENTATION_SUMMARY.md`
- **Plan**: See `/Users/xploit404/.claude/plans/foamy-stirring-allen.md`

---

**Ready? Try this:**

```
/sdlc "build a TODO application with users, auth, and real-time collaboration"
```

You'll see a complete, book-guided SDLC pipeline run end-to-end. ✨
