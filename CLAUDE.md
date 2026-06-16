# SDLC Workflow Plugin

26 agents × 43 skills × 14 commands × 9 phases → planning, design, development, testing, deployment, operations, incidents, retrospectives.

**Repo**: github.com/saitarrun/sdlc-workflow | **Version**: 1.0.0 | **License**: MIT

## Agent Conventions

**Frontmatter**: `name`, `description`, `tools`, `model` (haiku/sonnet/opus), `skills: [...]`

**Model tiers**: Haiku (templated), Sonnet (development), Opus (architecture/security)

**Codebase queries**: Prefer `code-review-graph` (bundled) for structural analysis; fallback to `grep` for text search.

Embed principles: QUANTS/INVEST/Testing Pyramid, ADR/fitness functions, DRY/ETC, Clean Code naming/SOLID.

## Skill Conventions

**Structure**: `skills/skill-name/SKILL.md` — Pure methodology (no tools, no model).

**Frontmatter**: `name`, `description`, `version`

**Content**: Methodology, checklists, patterns. Auto-wired per agent.

## Auto-Wiring

Agent frontmatter declares `skills: [skill-a, skill-b, ...]`. Commands load all phase skills into agent context as methodology. Agent system prompt: "Apply these skills: X, Y, Z." Result: polished industry-standard outputs.

## Extending

**Agent**: Create `.md` with frontmatter (`name`, `description`, `tools`, `model`, `skills`). System prompt embeds principles.

**Skill**: Create `skills/skill-name/SKILL.md` with frontmatter + methodology. Auto-wired to agents.

**Command**: Create `/commands/sdlc-*.md`. Command injects phase skills before spawning agents.

**Phase**: Add 3-5 agents, phase skill with output standards, command, wire into `/sdlc`.

## Validation

- **Plugin not loading**: Check frontmatter (`name`, `description`, `tools`, `model`), run `validate`, restart.
- **Agent not invoked**: Verify command references match agent description.
- **Permissions**: Add to `~/.claude/settings.local.json` under `permissions.allow`.
