#!/bin/bash
# ci-status-check.sh — Poll GitHub Actions workflow run status
# Usage: ci-status-check.sh <run-id-or-workflow-name> [poll-interval] [max-wait]

set -e

RUN_ID="${1:-}"
POLL_INTERVAL="${2:-10}"
MAX_WAIT="${3:-300}"

if [ -z "$RUN_ID" ]; then
  echo "ERROR: Usage: ci-status-check.sh <run-id-or-workflow-name> [poll-interval] [max-wait]"
  exit 1
fi

ELAPSED=0
echo "Waiting for CI run to complete (max ${MAX_WAIT}s, polling every ${POLL_INTERVAL}s)..."

while [ $ELAPSED -lt $MAX_WAIT ]; do
  # Query run status
  STATUS=$(gh run view "$RUN_ID" --json status,conclusion 2>/dev/null | grep -o '"conclusion":"[^"]*"' | cut -d'"' -f4)

  if [ -z "$STATUS" ] || [ "$STATUS" = "null" ]; then
    echo -n "."
    sleep "$POLL_INTERVAL"
    ELAPSED=$((ELAPSED + POLL_INTERVAL))
    continue
  fi

  echo ""
  if [ "$STATUS" = "success" ]; then
    echo "✓ CI run succeeded"
    RUN_URL=$(gh run view "$RUN_ID" --json url | grep -o '"[^"]*"' | tail -1 | tr -d '"')
    echo "  Run: $RUN_URL"
    echo "PASS"
    exit 0
  elif [ "$STATUS" = "failure" ]; then
    echo "✗ CI run failed"
    RUN_URL=$(gh run view "$RUN_ID" --json url | grep -o '"[^"]*"' | tail -1 | tr -d '"')
    echo "  Run: $RUN_URL"
    echo "FAIL"
    exit 1
  else
    echo "⚠ CI run status: $STATUS"
    echo "FAIL"
    exit 1
  fi
done

echo ""
echo "✗ CI run timed out after ${MAX_WAIT}s"
echo "TIMEOUT"
exit 1
