#!/bin/bash
# gh-pr-create.sh — Create a GitHub PR via gh CLI with validation
# Usage: gh-pr-create.sh <title> <body-file> [base-branch]

set -e

TITLE="${1:-}"
BODY_FILE="${2:-}"
BASE_BRANCH="${3:-main}"

if [ -z "$TITLE" ] || [ -z "$BODY_FILE" ]; then
  echo "ERROR: Usage: gh-pr-create.sh <title> <body-file> [base-branch]"
  exit 1
fi

if [ ! -f "$BODY_FILE" ]; then
  echo "ERROR: Body file not found: $BODY_FILE"
  exit 1
fi

# Check that working tree is clean
if ! git diff --quiet && ! git diff --cached --quiet; then
  echo "ERROR: Working tree is dirty. Commit or stash changes before creating a PR."
  exit 1
fi

# Check that current branch is ahead of base
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" = "HEAD" ]; then
  echo "ERROR: Currently on detached HEAD. Check out a branch before creating a PR."
  exit 1
fi

COMMITS_AHEAD=$(git rev-list --count "$BASE_BRANCH"..HEAD 2>/dev/null || echo "0")
if [ "$COMMITS_AHEAD" -eq 0 ]; then
  echo "ERROR: Current branch is not ahead of $BASE_BRANCH. Push changes first."
  exit 1
fi

# Create PR
echo "Creating PR on branch '$CURRENT_BRANCH' → '$BASE_BRANCH'..."
PR_URL=$(gh pr create --title "$TITLE" --body-file "$BODY_FILE" --base "$BASE_BRANCH" --web=false 2>&1 | tail -1)

if [ -z "$PR_URL" ]; then
  echo "ERROR: Failed to create PR. Check gh CLI credentials."
  exit 1
fi

echo "✓ PR created: $PR_URL"
