#!/bin/bash
# cloud-validate.sh — Validate IaC (Terraform or CDK)
# Usage: cloud-validate.sh [path]

SCAN_PATH="${1:-.}"

# Try terraform validate first
if [ -f "$SCAN_PATH/terraform.tf" ] || [ -f "$SCAN_PATH/main.tf" ] || [ -d "$SCAN_PATH/.terraform" ]; then
  if command -v terraform &>/dev/null; then
    echo "Running terraform validate..."
    if terraform validate "$SCAN_PATH" 2>/dev/null; then
      echo "✓ Terraform configuration is valid"
      exit 0
    else
      echo "✗ Terraform validation failed"
      exit 1
    fi
  fi
fi

# Try CDK
if [ -f "$SCAN_PATH/cdk.json" ] || [ -d "$SCAN_PATH/cdk" ]; then
  if command -v cdk &>/dev/null; then
    echo "Running cdk synth..."
    if cdk synth --quiet 2>/dev/null; then
      echo "✓ CDK app is valid"
      exit 0
    else
      echo "✗ CDK synthesis failed"
      exit 1
    fi
  fi
fi

# No IaC detected
echo "⚠ No Terraform or CDK configuration found in $SCAN_PATH"
exit 0
