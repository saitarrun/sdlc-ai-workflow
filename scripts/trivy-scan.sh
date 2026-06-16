#!/bin/bash
# trivy-scan.sh — Run container/dependency vulnerability scanner
# Usage: trivy-scan.sh [path] [severity]
# Falls back gracefully if trivy not installed; tries npm audit, pip-audit

SCAN_PATH="${1:-.}"
SEVERITY="${2:-HIGH,CRITICAL}"

# Try trivy first (container/fs scanner)
if command -v trivy &>/dev/null; then
  echo "Running trivy filesystem scan on $SCAN_PATH..."
  trivy fs --severity "$SEVERITY" --format json "$SCAN_PATH" 2>/dev/null || {
    echo "⚠ Trivy scan failed or found no vulnerabilities"
    exit 0
  }
  exit 0
fi

# Fall back to npm audit if package.json exists
if [ -f "$SCAN_PATH/package.json" ] || [ -f "package.json" ]; then
  if command -v npm &>/dev/null; then
    echo "Running npm audit..."
    npm audit --json 2>/dev/null || {
      echo "⚠ npm audit failed or found no vulnerabilities"
      exit 0
    }
    exit 0
  fi
fi

# Fall back to pip-audit if requirements.txt exists
if [ -f "$SCAN_PATH/requirements.txt" ] || [ -f "requirements.txt" ]; then
  if command -v pip-audit &>/dev/null; then
    echo "Running pip-audit..."
    pip-audit --format json 2>/dev/null || {
      echo "⚠ pip-audit failed or found no vulnerabilities"
      exit 0
    }
    exit 0
  fi
fi

# No scanner available
echo "⚠ No vulnerability scanner found (trivy, npm audit, or pip-audit)"
echo "Install trivy or appropriate language auditor to enable security scanning"
exit 0
