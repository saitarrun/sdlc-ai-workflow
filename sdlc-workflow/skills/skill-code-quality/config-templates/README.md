# Configuration Templates — Ready to Use

All files in this directory are production-ready configurations that implement the code quality standards documented in `../SKILL.md`.

## Quick Setup

Copy these files to your project root and customize as needed:

```bash
# Copy ESLint config
cp .eslintrc.js /path/to/your/project/

# Copy Jest config  
cp jest.config.js /path/to/your/project/

# Copy pre-commit hook setup
mkdir -p /path/to/your/project/.husky
cp .husky-pre-commit.sh /path/to/your/project/.husky/pre-commit
chmod +x /path/to/your/project/.husky/pre-commit

# Copy GitHub Actions workflow
mkdir -p /path/to/your/project/.github/workflows
cp github-actions-ci.yml /path/to/your/project/.github/workflows/ci.yml

# Merge NPM scripts into your package.json
cat package.json.scripts >> /path/to/your/project/package.json
```

## Files Overview

### 1. `.eslintrc.js` — Linting & Code Quality Rules

**What it enforces**:
- Naming conventions (id-length, id-match)
- Code complexity (max 10 branches per function)
- Security rules (no eval, detect object injection)
- DRY principle (no duplicate imports)
- Best practices (eqeqeq, no-implicit-coercion)

**Tools required**: `eslint`, `@typescript-eslint/parser`, `eslint-plugin-security`, `eslint-plugin-sonarjs`

**Use**:
```bash
npm run lint              # Check for violations
npm run lint:fix         # Auto-fix fixable violations
```

**Coverage**: Sections 1, 4 (Static Code Quality, Security)

---

### 2. `jest.config.js` — Testing Pyramid & Coverage

**What it enforces**:
- Unit tests: <100ms per test
- Integration tests: <1s per test  
- Coverage threshold: 80% (95% for critical paths)
- F.I.R.S.T. principles (fast, independent, repeatable, self-validating, timely)
- Test pyramid ratio: 70% unit, 20% integration, 10% E2E

**Tools required**: `jest`, `ts-jest`, `@testing-library/react`, `@testing-library/jest-dom`

**Use**:
```bash
npm run test:unit                          # Unit tests only
npm run test:integration                   # Integration tests
npm run test:coverage                      # Coverage report
npm test -- --coverage --bail              # Stop on first failure
```

**Coverage**: Section 2 (Testing & Coverage Rules)

---

### 3. `.husky-pre-commit.sh` — Local Quality Enforcement

**What it enforces** (in order):
1. ✓ Linting (ESLint, auto-fix)
2. ✓ Formatting (Prettier, auto-format)
3. ✓ Type checking (TypeScript)
4. ✓ Unit tests (Jest, bail on failure)
5. ✓ Secret detection (detect-secrets)

**Tools required**: `husky`, `lint-staged`, `detect-secrets`

**Setup**:
```bash
npm install husky lint-staged -D
husky install
cp .husky-pre-commit.sh .husky/pre-commit
chmod +x .husky/pre-commit
```

**What happens**: 
- When you run `git commit`, the hook runs automatically
- Blocks commit if any check fails
- Auto-fixes linting/formatting violations

**Coverage**: Sections 1, 2, 4 (Code Quality, Testing, Security)

---

### 4. `github-actions-ci.yml` — CI/CD Pipeline with Quality Gates

**What it enforces**:
- Step 1️⃣ Linting, formatting, type checking, complexity, DRY
- Step 2️⃣ Unit tests (coverage 80%), integration tests, regression detection
- Step 3️⃣ Technical debt check, dependency audit, outdated package detection
- Step 4️⃣ SAST scanning (Snyk), SCA audit, secret detection
- Step 5️⃣ Build verification

**Merge behavior**:
- ✅ Passes all checks → merge allowed
- ❌ Any check fails → merge blocked

**Setup**:
```bash
mkdir -p .github/workflows
cp github-actions-ci.yml .github/workflows/ci.yml
git push  # Workflow runs automatically on PR
```

**Coverage**: All 5 sections (comprehensive CI/CD)

---

### 5. `package.json.scripts` — NPM Commands

**What it provides**:
- Linting commands: `npm run lint`, `npm run lint:fix`
- Formatting: `npm run format`, `npm run format:check`
- Type checking: `npm run type-check`
- Testing: `npm run test:unit`, `npm run test:coverage`
- Security: `npm run security:check`, `npm run audit`
- Full pipeline: `npm run ci` (runs all checks)

**Setup**:
```bash
# Merge scripts into your package.json
cat package.json.scripts >> package.json  # Add to existing scripts section
```

**Common workflows**:
```bash
npm run quality:check      # Quick check (lint + type + test)
npm run quality:fix        # Auto-fix linting + formatting + audit
npm run ci                 # Full pipeline (all checks)
```

**Coverage**: All sections (orchestration commands)

---

## Customization Guide

### Modify ESLint Rules

Edit `.eslintrc.js` to adjust strictness:

```javascript
rules: {
  'complexity': ['warn', { max: 15 }],        // Increase from 10 to 15
  'max-lines': ['warn', { max: 500 }],       // Increase from 300 to 500
  'no-console': 'warn',                       // Change to warn instead of error
}
```

### Adjust Coverage Thresholds

Edit `jest.config.js`:

```javascript
coverageThreshold: {
  global: {
    branches: 75,      // Lower from 80 to 75
    lines: 75,         // Lower from 80 to 75
  }
}
```

### Customize Pre-Commit Hook

Edit `.husky-pre-commit.sh` to add/remove checks:

```bash
# Add new check
echo "\n🔐 Step 6/6: Custom check..."
npx custom-tool --check
git add $STAGED_FILES
```

### Modify CI/CD Pipeline

Edit `github-actions-ci.yml` to:
- Add new jobs (e.g., performance testing, accessibility)
- Adjust timeouts
- Add custom security scanning tools
- Configure notifications

---

## Troubleshooting

### "ESLint not found"

```bash
npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin -D
```

### "Jest timeout"

Increase in `jest.config.js`:
```javascript
testTimeout: 20000,  // Increase from 10s to 20s
```

### "Pre-commit hook fails"

1. Run `npm run lint:fix` to auto-fix
2. Run `npm test` to verify tests pass
3. Commit again

### "GitHub Actions not running"

1. Verify `.github/workflows/ci.yml` exists
2. Check branch name matches trigger (main/develop)
3. Commit and push to trigger workflow

---

## Integration Examples

### Next.js Project

```bash
# Install dependencies
npm install --save-dev eslint jest @testing-library/react

# Copy configs
cp .eslintrc.js next.eslintrc.js
cp jest.config.js .
```

### Express Backend

```bash
# Install dependencies
npm install --save-dev eslint jest ts-jest

# Copy configs  
cp .eslintrc.js .
cp jest.config.js .
```

### React + Node Monorepo

Create `packages/frontend/.eslintrc.js` and `packages/backend/.eslintrc.js` extending the root config.

---

## References

- ESLint Rules: https://eslint.org/docs/rules/
- Jest Config: https://jestjs.io/docs/configuration
- Husky Docs: https://typicode.github.io/husky/
- GitHub Actions: https://docs.github.com/en/actions

---

**Last Updated**: 2026-06-16  
**Status**: Production-ready, tested configurations
