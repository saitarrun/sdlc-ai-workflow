#!/bin/bash
# gh-issue-scaffold.sh — Create a GitHub issue from a markdown body file
# Usage: gh-issue-scaffold.sh <title> <body-file> [labels]

set -e

TITLE="${1:-}"
BODY_FILE="${2:-}"
LABELS="${3:-}"

if [ -z "$TITLE" ] || [ -z "$BODY_FILE" ]; then
  echo "ERROR: Usage: gh-issue-scaffold.sh <title> <body-file> [labels]"
  exit 1
fi

if [ ! -f "$BODY_FILE" ]; then
  echo "ERROR: Body file not found: $BODY_FILE"
  exit 1
fi

# Attempt to create issue via gh CLI; gracefully fall back if no remote
if ! git remote get-url origin &>/dev/null; then
  echo "⚠ No GitHub remote detected. Skipping issue creation."
  echo "Issue would have been:"
  echo "  Title: $TITLE"
  echo "  Labels: ${LABELS:-(none)}"
  exit 0
fi

# Create issue
CMD="gh issue create --title \"$TITLE\" --body-file \"$BODY_FILE\""
if [ -n "$LABELS" ]; then
  CMD="$CMD --label \"$LABELS\""
fi

echo "Creating GitHub issue: $TITLE"
ISSUE_URL=$(eval "$CMD" 2>&1 | tail -1)

if [ -z "$ISSUE_URL" ]; then
  echo "⚠ Issue creation may have failed, but proceeding."
  exit 0
fi

echo "✓ Issue created: $ISSUE_URL"
