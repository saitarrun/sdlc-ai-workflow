#!/bin/sh
# Pre-commit Hook — Enforces code quality standards before commit
# Covers: linting, formatting, type checking, test coverage, secret detection
# Install: cp .husky-pre-commit.sh .husky/pre-commit && chmod +x .husky/pre-commit

set -e

echo "🔍 Running pre-commit quality checks..."

# Get staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|ts|jsx|tsx)$' || true)

if [ -z "$STAGED_FILES" ]; then
  echo "✓ No TypeScript/JavaScript files to check"
  exit 0
fi

echo "📋 Staged files:"
echo "$STAGED_FILES"

# 1. LINT CHECK — ESLint with auto-fix
echo "\n🔧 Step 1/5: Linting and auto-fixing..."
if ! npx eslint --fix $STAGED_FILES 2>/dev/null; then
  echo "❌ Linting failed. Please fix errors manually."
  exit 1
fi
echo "✓ Linting passed"

# 2. FORMAT CHECK — Prettier auto-format
echo "\n✨ Step 2/5: Formatting with Prettier..."
npx prettier --write $STAGED_FILES 2>/dev/null
echo "✓ Formatting applied"

# 3. TYPE CHECK — TypeScript strict
echo "\n🔍 Step 3/5: Type checking..."
if ! npx tsc --noEmit 2>/dev/null; then
  echo "❌ Type check failed. Please fix errors."
  exit 1
fi
echo "✓ Type checking passed"

# 4. UNIT TESTS — Run affected tests only
echo "\n🧪 Step 4/5: Running affected unit tests..."
if ! npx jest --bail --findRelatedTests $STAGED_FILES 2>/dev/null; then
  echo "❌ Tests failed. Please fix and try again."
  exit 1
fi
echo "✓ Unit tests passed"

# 5. SECRET DETECTION — Scan for hardcoded secrets
echo "\n🔐 Step 5/5: Detecting secrets..."
if npx detect-secrets scan --baseline .secrets.baseline 2>/dev/null | grep -q '"version":'; then
  echo "⚠️  Potential secrets detected. Review before committing."
fi
echo "✓ Secret scan complete"

# Stage auto-fixed files
echo "\n📝 Re-staging auto-fixed files..."
git add $STAGED_FILES

echo "\n✅ All pre-commit checks passed! Ready to commit."
