---
name: skill-code-quality
description: This skill should be used when implementing code quality standards, setting up linting/testing/security scans, enforcing coverage thresholds, or establishing CI/CD guardrails.
version: 1.0.0
---

# Skill: Code Quality Standards & Metrics

## Overview

Code quality is the cornerstone of maintainable, secure, and performant software. This skill provides a comprehensive framework for enforcing quality across five dimensions: static analysis, testing, architecture, security, and CI/CD automation.

## 1. Static Code Quality & Standards

### Linting & Style Enforcement

**What**: Enforce language-specific style guides with automated tools
- **JavaScript/TypeScript**: ESLint + Prettier
- **Python**: Pylint + Black + isort
- **Go**: golangci-lint + gofmt
- **Java**: Checkstyle + Spotless

**Why**: Consistent code style reduces cognitive load, prevents merge conflicts, and catches common mistakes early.

**How to Enforce**:
```yaml
# .eslintrc.js or similar
extends: ['recommended', 'prettier']
rules:
  no-console: warn
  no-unused-vars: error
  max-lines: [warn, { max: 300 }]
```

Configure pre-commit hook:
```bash
husky install
npx husky add .husky/pre-commit "npm run lint:fix"
```

### Naming Conventions

**Standard Patterns**:
- **Variables/functions**: camelCase (JavaScript, Python, Java)
- **Classes**: PascalCase
- **Constants**: SCREAMING_SNAKE_CASE
- **Files**: lowercase with hyphens (components) or snake_case (modules)
- **Avoid**: Single-letter vars (except loop counters), cryptic abbreviations, `data`, `temp`, `info`, `obj`

**Example Violations**:
```javascript
// ❌ Bad
const d = new Date();
const temp = calculateTotal(items);
function x() { return 42; }

// ✓ Good
const currentDate = new Date();
const cartTotal = calculateTotal(items);
function getUserAge() { return 42; }
```

### Complexity Control

**Cyclomatic Complexity Limits**:
- Functions: max 10 branches (if/else, loops, switches)
- Classes: max 50 methods
- Files: max 300 lines

**Tools**: SonarQube, eslint-plugin-complexity, radon (Python)

**How to Measure**:
```bash
# JavaScript
npx eslint --max-warnings 0 --ext .js,.ts src/

# Python
radon cc -n C your_code.py  # Show functions with complexity > C
```

### DRY Principle (Don't Repeat Yourself)

**Red Flags**:
- Copy-pasted code blocks (3+ identical/similar lines)
- Duplicated business logic across files
- Similar patterns in schema definitions

**How to Detect**:
```bash
# Find duplicated code blocks
npx jscpd --threshold 0.1 src/

# Clone detection with git
git diff --stat HEAD~10
```

**Refactoring Patterns**:
- Extract repeated logic into utility functions
- Use mixins, inheritance, or composition for shared behavior
- Consolidate config duplicates into a single source of truth

## 2. Testing & Coverage Rules

### Testing Pyramid (SE@Google)

```
          ▲
         /E2E\        10% (expensive, slow)
        /─────\       1-2 tests per critical flow
       /Integration\  20% (medium cost)
      /─────────────\ 10-20 tests per service
     /Unit Tests─────\70% (cheap, fast)
    /─────────────────\Hundreds of tests
```

**Unit Tests** (70%):
- Isolated logic, mocked dependencies
- Run in <100ms
- Fast feedback loop
- Test error cases, boundary conditions

**Integration Tests** (20%):
- Real database/external dependencies
- Run in <1s per test
- Validate module interactions
- Test request/response contracts

**E2E Tests** (10%):
- Real browser or deployed environment
- Run in <5s per test
- Test critical user flows only
- Smoke tests, not exhaustive scenarios

### Code Coverage Thresholds

**Minimum Standards**:
- Unit tests: 80%+ coverage
- Integration tests: 60%+ coverage
- Overall: 75%+ coverage
- Critical paths: 95%+ coverage

**Enforcement**:
```json
{
  "jest": {
    "collectCoverageFrom": ["src/**/*.{js,ts}"],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      },
      "src/auth/**": {
        "lines": 95,
        "functions": 95
      }
    }
  }
}
```

### Test Quality Criteria (F.I.R.S.T.)

- **Fast**: Unit tests <100ms, integration <1s
- **Independent**: No test depends on another; can run in any order
- **Repeatable**: Same result every time (no flakiness)
- **Self-Validating**: Pass/fail clear, no manual verification
- **Timely**: Written before or with implementation (TDD-like)

### Regression Testing

**How**: Automatically rerun all tests on every commit
- Pre-commit hook: run affected tests
- CI pipeline: run full suite on PR
- Nightly: full suite + integration tests

**Flaky Test Detection**:
```bash
# Run tests 5+ times, track inconsistency
for i in {1..5}; do npm test -- --seed $RANDOM; done
```

## 3. Architecture & Maintainability

### SOLID Principles

**S — Single Responsibility**: One class/module, one reason to change
```javascript
// ❌ Bad
class UserManager {
  createUser() { /* ... */ }
  sendEmail() { /* ... */ }
  logAnalytics() { /* ... */ }
}

// ✓ Good
class UserRepository { createUser() { /* ... */ } }
class EmailService { sendEmail() { /* ... */ } }
class AnalyticsService { logEvent() { /* ... */ } }
```

**O — Open/Closed**: Open for extension, closed for modification
```javascript
// Use inheritance/composition, not hardcoding
interface PaymentGateway { process(amount) }
class StripeGateway implements PaymentGateway { /* ... */ }
class PayPalGateway implements PaymentGateway { /* ... */ }
// Add new gateways without modifying existing code
```

**L — Liskov Substitution**: Subtypes must be substitutable for parent types
**I — Interface Segregation**: Clients shouldn't depend on unused methods
**D — Dependency Inversion**: Depend on abstractions, not concrete implementations

### Documentation Standards

**Code-Level**:
- Function docstrings: purpose, params, return, exceptions
- Inline comments: WHY (not WHAT — names explain that)
- Complex algorithms: explain invariants and edge cases

**Project-Level**:
- README: getting started, architecture overview, key design decisions
- ARCHITECTURE.md: component diagram, data flow, critical paths
- CONTRIBUTING.md: dev setup, testing, PR process, code style

**Example**:
```typescript
/**
 * Calculate discount based on customer tier and purchase history.
 * Premium customers (3+ purchases) get 15% off; others get 5%.
 * @param customerId - UUID of the customer
 * @param purchaseCount - Number of prior purchases
 * @returns Discount percentage (0-100)
 */
function calculateDiscount(customerId: string, purchaseCount: number): number {
  // Historical data shows 15% threshold improves LTV without margin impact
  return purchaseCount >= 3 ? 15 : 5;
}
```

### Technical Debt Tracking

**What Counts**:
- Hardcoded values that should be configurable
- Copy-pasted code awaiting refactoring
- Temporary workarounds for bugs
- Deprecated library usage
- TODO comments with no timeline

**Enforcement**:
```bash
# Find all TODO comments
git grep -n "TODO\|FIXME\|HACK" -- src/

# Track in issues with label "tech-debt"
# Review quarterly, prioritize by impact
```

### Dependency Hygiene

**Standards**:
- Minimize external dependencies
- Keep dependencies up-to-date (patch versions automatically, minor/major reviewed)
- Audit for CVEs weekly
- Remove unused dependencies quarterly

**Tools**:
```bash
npm audit                    # Check for CVEs
npm outdated                 # Show outdated packages
npm ls --depth=0            # See direct dependencies
depcheck                     # Find unused dependencies
```

## 4. Security Code Quality (DevSecOps)

### Static Application Security Testing (SAST)

**Tools by Language**:
- **JavaScript/TypeScript**: SonarJS, Snyk, semgrep
- **Python**: Bandit, semgrep
- **Java**: SpotBugs, Checkmarx
- **Go**: gosec, golangci-lint

**Common Patterns Caught**:
- SQL injection, XSS, command injection
- Hardcoded secrets
- Unsafe deserialization
- Weak cryptography
- Missing input validation

**CI Integration**:
```yaml
# GitHub Actions example
- name: SAST Scan
  run: |
    npm install -g snyk
    snyk test --severity-threshold=high --fail-on=all
```

### Software Composition Analysis (SCA)

**What**: Scan dependencies for known CVEs

**Tools**:
- npm audit (built-in)
- Snyk
- OWASP Dependency-Check
- Black Duck

**Threshold**: 0 high/critical vulnerabilities; medium resolved within 30 days

```bash
npm audit --audit-level=moderate
```

### Secret Detection

**Tools**:
- git-secrets, pre-commit, TruffleHog
- Snyk Secret Scanner
- GitGuardian

**Patterns to Catch**:
- AWS keys, API keys
- Database credentials
- Private certificates
- OAuth tokens
- Slack/GitHub tokens

**Pre-Commit Hook**:
```bash
husky add .husky/pre-commit "npx detect-secrets scan --baseline .secrets.baseline"
```

### Input Validation & Output Encoding

**Standards**:
- Validate ALL user input (type, length, format, range)
- Encode output based on context (HTML, JSON, URL, CSS)
- Use allowlists, not blocklists
- Reject suspicious patterns early

**Example**:
```typescript
// ❌ Bad: no validation
function transferFunds(amount, toAccount) {
  return db.query(`UPDATE accounts SET balance = balance - ${amount} WHERE id = ${toAccount}`);
}

// ✓ Good: validated and parameterized
function transferFunds(amount: number, toAccount: UUID) {
  if (amount <= 0 || amount > 1000000) throw new Error("Invalid amount");
  if (!isValidUUID(toAccount)) throw new Error("Invalid account");
  return db.query("UPDATE accounts SET balance = balance - ? WHERE id = ?", [amount, toAccount]);
}
```

### OWASP Top 10 Alignment

Ensure defenses for:
1. Broken Access Control (IDOR, authorization bypass)
2. Cryptographic Failures (weak encryption, exposed secrets)
3. Injection (SQL, command, template)
4. Insecure Design (missing threat modeling)
5. Security Misconfiguration (exposed debug endpoints, weak defaults)
6. Vulnerable & Outdated Components (unpatched dependencies)
7. Authentication Failures (weak session, MFA bypass)
8. Software & Data Integrity Failures (insecure deserialization, unsigned updates)
9. Logging & Monitoring Failures (insufficient audit trails)
10. SSRF (server-side request forgery)

## 5. Review & CI/CD Guardrails

### Peer Review Process

**Standards**:
- At least 1 senior approval before merge
- Code review focuses on: correctness, design, maintainability, security
- Nits/formatting flagged but don't block merge
- Blocking issues: architecture violations, security gaps, test gaps

**Checklist for Reviewers**:
- [ ] Code follows style guide (lint passes)
- [ ] Tests cover new logic (>80% coverage)
- [ ] No hardcoded secrets or credentials
- [ ] Backwards compatible (or deprecation path documented)
- [ ] Database migrations reversible (if applicable)
- [ ] Documentation updated
- [ ] No n+1 queries or obvious performance issues
- [ ] Error handling appropriate (not silent failures)

### Automated Quality Gates (CI/CD)

**Block on Failure**:
- ✓ Linting errors (eslint, pylint)
- ✓ Test failures (unit, integration, E2E)
- ✓ Coverage drop (enforce minimum %)
- ✓ Type checking (TypeScript, mypy)
- ✓ SAST scan findings (severity: high/critical)
- ✓ SCA vulnerabilities (high/critical)
- ✓ Secret detection positives
- ✓ Build errors or artifact generation failures

**Report but Don't Block** (comment on PR):
- ✓ Performance regressions (>10% slower)
- ✓ Complexity increases
- ✓ Documentation gaps (low priority)
- ✓ Minor style issues auto-fixed by pre-commit

**Example CI Pipeline**:
```yaml
name: Quality Gates
on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage --collectCoverageFrom='src/**'
      - run: npm run build
      - name: Check Coverage
        run: |
          if [ $(cat coverage/coverage-summary.json | jq .total.lines.pct) -lt 80 ]; then
            echo "Coverage below 80%"
            exit 1
          fi
      - name: SAST Scan
        run: npm audit --audit-level=high
      - name: Secret Detection
        run: npm run secrets:check
```

### Continuous Integration Best Practices

**Hermetic Builds**: No network calls during tests
- Use fixtures, mocks, or containers instead of calling external services
- Artifact caching: cache dependencies between runs
- Reproducible: same commit always produces same artifact

**Trunk-Based Development**:
- Short-lived branches (<1 day old)
- Feature flags for incomplete features
- Broken main is a blocker for everyone
- Revert rather than patch when urgent

**Pre-Commit Hooks** (enforce before push):
```bash
# .husky/pre-commit
npm run lint:fix
npm run type-check
npm test -- --bail --findRelatedTests
```

## Integration Checklist

Use this checklist when setting up quality standards on a new project:

- [ ] **Linting**: ESLint/Pylint configured, pre-commit hook installed
- [ ] **Formatting**: Prettier/Black configured, auto-fixed on save
- [ ] **Testing**: Test suite with >80% coverage, pyramid ratio enforced
- [ ] **Type Checking**: TypeScript/mypy enabled, strict mode
- [ ] **Architecture**: SOLID principles documented, ADR process established
- [ ] **Documentation**: README, ARCHITECTURE.md, inline docs in place
- [ ] **Secrets**: git-secrets or truffleHog pre-commit hook
- [ ] **SAST**: Snyk/SonarJS integrated in CI, blocking on high/critical
- [ ] **SCA**: npm audit or Snyk dependency scanning, blocking on high/critical
- [ ] **Code Review**: Review checklist documented, approval required
- [ ] **CI/CD**: All gates automated, no manual sign-offs for quality checks
- [ ] **Tech Debt**: Issue tracker with "tech-debt" label, quarterly review scheduled
- [ ] **Monitoring**: Build times tracked, flaky test detection enabled

---

**Reference**: SE@Google, Clean Code, The Pragmatic Programmer, Architecture: The Hard Parts
