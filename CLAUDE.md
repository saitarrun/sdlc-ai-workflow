# SDLC Workflow Plugin — Development Guide

This document explains the structure of the sdlc-workflow plugin and how to extend it with new agents, skills, and commands.

## File Structure

```
sdlc-workflow/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata for Claude Code marketplace
├── README.md                # User-facing documentation
├── CLAUDE.md                # This file — development guide
├── Makefile                 # Development tooling
├── agents/                  # 20 role-specific agents
│   ├── product-manager.md
│   ├── business-analyst.md
│   ├── ... (18 more agents)
│   └── data-engineer.md
├── skills/                  # 13 knowledge skills (no tools/model)
│   ├── skill-requirements/SKILL.md
│   ├── skill-architecture/SKILL.md
│   ├── ... (10 more skills)
│   └── skill-ops-sre/SKILL.md
├── commands/                # 9 user-invoked orchestrator commands
│   ├── sdlc.md                      # Master orchestrator
│   ├── sdlc-plan.md                 # Phase 1 only
│   ├── sdlc-design.md               # Phase 2 only
│   ├── ... (5 more commands)
│   └── sdlc-review.md               # Anytime code review
└── scripts/                 # 5 shell script wrappers
    ├── gh-pr-create.sh              # GitHub PR creation
    ├── gh-issue-scaffold.sh         # GitHub issue creation
    ├── ci-status-check.sh           # Poll CI run status
    ├── trivy-scan.sh                # Vulnerability scanner
    └── cloud-validate.sh            # Terraform/CDK validator
```

## Agent Anatomy

Each agent is a `.md` file with YAML frontmatter + system prompt:

```yaml
---
name: agent-name
description: When to invoke this agent. Use when...
tools: Read, Bash, Write, Glob, Grep, WebFetch
model: haiku|sonnet|opus
color: optional-display-color
---

# Agent Title

Your system prompt here...
```

### Frontmatter Fields

- **name** (required): Snake-case identifier (e.g., `product-manager`)
- **description** (required): When to invoke (what triggers the agent)
- **tools** (required): Comma-separated list of allowed tools
- **model** (required): `haiku` (fast/cheap), `sonnet` (balanced), `opus` (powerful)
- **color** (optional): Display color for terminal UI

### Model Tiering Strategy

- **Haiku**: Templated tasks (database engineer, doc writer, DevOps scaffolding)
- **Sonnet**: Development + analysis (engineers, test engineer, architects, reviewers)
- **Opus**: High-leverage decisions (system architect, security architect, SRE, penetration tester)

### Tools Whitelist

Only include tools the agent actually uses:

- **Read**: Parse documents, requirements, architecture
- **Write/Edit**: Generate code, tests, documentation
- **Bash**: Execute scripts, run tests, query tools
- **Glob/Grep**: Search codebase for patterns, dependencies
- **WebFetch/WebSearch**: Research competing products, standards

## Skill Anatomy

Each skill is a directory with a `SKILL.md` file (no `tools` or `model` fields):

```
skills/
└── skill-name/
    └── SKILL.md              # Required
    └── references/           # Optional supporting docs
        └── reference.md
```

### Skill Frontmatter

```yaml
---
name: skill-name
description: This skill should be used when the user asks to "X", "Y", or discusses "Z".
version: 1.0.0
---
```

**Skills are pure knowledge injection** — they don't run code; they load methodology into agents' context windows.

## Command Anatomy

Commands are single `.md` files with minimal frontmatter:

```yaml
---
description: One-line help text shown in /help
argument-hint: <required> [optional]
---

# Command Title

Body: Instructions for what this command does and how to use it.
```

## Adding a New Agent

### 1. Create Agent File

```bash
cd agents/
cat > new-agent-role.md << 'EOF'
---
name: new-agent-role
description: When to invoke this agent. Use when the user asks to "...", "...", or discusses "...".
tools: Read, Bash, Write, Glob, Grep
model: sonnet
color: blue
---

# New Agent Role

You are a [role] who [responsibilities].

## Core Responsibilities

1. [Responsibility 1]
2. [Responsibility 2]

## Key Principles

[Principles from the reference books]

## Process

[Step-by-step process]

## Output Format

[What the agent produces]

## Success Criteria

[How to know the agent succeeded]
EOF
```

### 2. Wire Into a Command

Edit the relevant command (e.g., `commands/sdlc-dev.md`) and add the agent to the orchestration flow.

### 3. Create a Skill (if needed)

If the agent uses methodology that other agents could also use, create a corresponding skill:

```bash
mkdir -p skills/skill-new-methodology
cat > skills/skill-new-methodology/SKILL.md << 'EOF'
---
name: skill-new-methodology
description: This skill should be used when the user mentions keywords related to [methodology].
version: 1.0.0
---

# Skill: [Methodology Name]

[Methodology content]
EOF
```

### 4. Update plugin.json (if new phase)

If you're adding an entirely new phase, update `.claude-plugin/plugin.json` to reflect the new scope.

## Extending the Plugin

### Adding a New Phase

1. Create 3-5 new agents for the phase
2. Create a new skill for phase methodology
3. Create a new command `/sdlc-phase-name`
4. Wire the command into `/sdlc` master orchestrator

### Adding a New Tool Integration

If you need a new capability (e.g., Jira integration, Slack notifications):

1. Create a new script in `scripts/`
2. Update agents' `tools` field to include `Bash`
3. Call the script via `Bash` tool in the agent body

### Updating Book Principles

If you read the reference PDFs and extract new principles:

1. Add to the relevant skill's content
2. Update agent bodies to reference the new principle
3. Document in this file's "Book Integration" section

## Testing the Plugin

### Local Installation

```bash
make install-local
```

This copies agents, skills, and commands to `~/.claude/` for immediate use.

### Validation

```bash
make validate
```

Checks that all required files exist and have proper structure.

### Uninstall

```bash
make uninstall
```

Removes plugin files from `~/.claude/`.

## Book Integration

The plugin embeds principles from 4 reference books:

### Software Engineering at Google
- **QUANTS Framework** — Measure productivity via Quality, Attention, Toil, Time, Satisfaction
- **INVEST User Stories** — Independent, Negotiable, Valuable, Estimable, Small, Testable
- **Critique Code Review** — Readability, LGTM culture, blocking vs. nits
- **Testing Pyramid** — 70% unit / 20% integration / 10% E2E
- **Beyoncé Rule** — "If you care about it, test it"
- **Hermetic Builds** — No network calls, reproducible artifacts, artifact-based caching
- **Trunk-Based Development** — Short-lived branches, feature flags, no broken trunk
- **Docs-as-Code** — Docs live next to code, audience-first writing

### Architecture: The Hard Parts
- **ADR Format** — Context/Decision/Consequences with trade-off tables
- **Coupling & Cohesion** — Static vs. dynamic coupling, module boundaries
- **Service Granularity** — Monolith vs. microservices decision framework
- **Fitness Functions** — Automated architecture compliance checks
- **One-Version Rule** — Minimize external dependency versions

### The Pragmatic Programmer
- **DRY (Don't Repeat Yourself)** — Eliminate duplication in code, schema, IaC, docs
- **ETC (Easy To Change)** — Every design choice evaluated for future changeability
- **Tracer Bullets** — Build minimal end-to-end feature first, then iterate
- **Broken Windows Theory** — Fix technical debt immediately, don't let it accumulate
- **Code Generation** — Generate repetitive code patterns, not written by hand
- **Contracts** — Preconditions/postconditions clarify function behavior

### Clean Code
- **Meaningful Names** — No `d`, `info`, `data`, `temp` — be specific
- **Small Functions** — Fit on one screen (~20 lines), one level of abstraction
- **SOLID Principles** — Single responsibility, Open/closed, Liskov, Interface segregation, Dependency inversion
- **F.I.R.S.T. Tests** — Fast, Independent, Repeatable, Self-validating, Timely
- **Self-Documenting Code** — Comments explain WHY, not WHAT (names already say WHAT)
- **Error Handling** — Exceptions over return codes, create informative error context

## Troubleshooting

### Plugin Not Loading

1. Check agent frontmatter fields: `name`, `description`, `tools`, `model` are all required
2. Verify `tools` field is comma-separated, not JSON array
3. Run `make validate` to check file structure
4. Restart Claude Code session

### Agent Not Invoked

1. Check command file references the agent correctly
2. Verify agent description matches trigger keywords
3. Review agent `tools` field has required tools for the command

### Permission Prompts

If you get many permission prompts, add tool patterns to `~/.claude/settings.local.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(gh *)",
      "Bash(npm audit*)",
      "Bash(terraform validate*)"
    ]
  }
}
```

## Contributing

To contribute improvements to this plugin:

1. Follow the anatomy patterns above for agents/skills/commands
2. Embed book principles in agent bodies
3. Test locally with `make install-local`
4. Validate structure with `make validate`
5. Submit PR with clear description of changes

---

**Last Updated**: 2026-06-16  
**Maintained By**: xploit404
