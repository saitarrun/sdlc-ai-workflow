---
description: Anytime — SE@Google Critique-style code review. Spawns 3 parallel reviewers (compliance, bugs, history). Posts inline comments via gh pr comment.
argument-hint: "[--pr <number>] [--aspects all]"
---

# Code Review — SE@Google Critique Style

Spawns agents in parallel: code-critic ×3 (compliance | bugs | history)

Outputs:
- Inline PR comments via `gh pr comment`
- Confidence-scored findings (only surface ≥80/100)
- Categorized as: blocking issues | important | nits

## Process

1. Backend Engineer Review: CLAUDE.md compliance, code patterns, SOLID principles
2. Test Coverage Review: Missing tests, untested code paths
3. Git History Review: Prior PRs, known issues, architectural decisions

Each reviewer confidence-filters (<80 is dropped), then findings are merged into one list.

## Usage

```bash
/sdlc-review --pr 1                   # Review PR #1
/sdlc-review --pr 1 --aspects all     # All review aspects
```

## Results

Comments are posted to the PR with:
- **Blocking** (red flag): Must fix before merge
- **Important** (yellow): Should fix before merge
- **Nit** (gray): Nice-to-have improvement

