---
description: Phase 4 only — Testing & Security Auditing. Generates and runs test suites, performs OWASP/CVE audits, penetration testing, and security findings review.
argument-hint: "[--layer all] [--run] [--coverage-gap]"
---

# Phase 4 — Testing & Security Auditing

Spawns agents: qa-manual-tester → automation-qa-engineer → appsec-engineer → penetration-tester

Outputs:
- Test files (unit, integration, E2E)
- `.sdlc/04-test-cases.md` — Test coverage report, flaky tests
- `.sdlc/04-security.md` — OWASP audit, CVE scan, penetration test findings (severity-ranked)
- Test execution results

## Process

1. QA Manual Tester: Write test cases, exploratory testing script
2. Automation QA Engineer: Build automated test suite (Testing Pyramid: 70/20/10)
3. AppSec Engineer: SAST, dependency scan, OWASP Top 10 audit
4. Penetration Tester: Attack simulation, auth bypass testing, IDOR, SQL injection, etc.
5. **GATE**: All tests green + no unwaived Critical/High security findings

## Usage

```bash
/sdlc-test                           # Full test + security suite
/sdlc-test --layer unit              # Unit tests only
/sdlc-test --run                     # Generate + execute tests
/sdlc-test --coverage-gap            # Report untested acceptance criteria
```
