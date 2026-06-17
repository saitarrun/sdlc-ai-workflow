---
description: Phase 6 only — Production, Maintenance & Monitoring. Defines SLOs, creates alerting rules, on-call runbooks, and data pipelines.
argument-hint: "[--service <name>] [--framework prometheus]"
---

# Phase 6 — Production, Maintenance & Monitoring

Spawns agents: sre-engineer → secops-analyst → data-engineer

Outputs:
- `./projects/<feature-name>/06-slo.md` — Service Level Objectives, error budgets, runbook stubs
- `./projects/<feature-name>/06-secops.md` — Security monitoring setup, alert rules
- `./projects/<feature-name>/06-data-pipelines.md` — ETL/ELT workflows, data quality checks

## Process

1. SRE Engineer: Define SLOs (availability, latency, error rate), error budgets, on-call runbooks
2. SecOps Analyst: Design security monitoring, alert triage procedures
3. Data Engineer: Design data pipelines (ETL/ELT), analytics schemas
4. **GATE**: User approves SLOs and runbook coverage

## Usage

```bash
/sdlc-ops                              # All ops setup
/sdlc-ops --service api                # Focus on API service
/sdlc-ops --framework prometheus       # Use Prometheus for monitoring
```
