---
description: Phase 5 only — Infrastructure & Deployment. Generates CI/CD pipelines, Dockerfiles, and cloud infrastructure (Terraform/CDK).
argument-hint: "[--stack github-actions,dockerfile,terraform] [--trigger]"
---

# Phase 5 — Infrastructure & Deployment

Spawns agents: devops-engineer → cloud-engineer

Outputs:
- `.github/workflows/` — GitHub Actions pipeline
- `Dockerfile` (multi-stage build)
- `infra/terraform/` or `infra/cdk/` — Cloud infrastructure as code
- `./projects/<feature-name>/05-pipeline.log` — CI/CD execution results

## Process

1. DevOps Engineer: Design CI/CD pipeline, create Dockerfile, define presubmit gates
2. Cloud Engineer: Create cloud infrastructure (VPC, IAM, databases, networking)
3. Deploy Pipeline Trigger (optional --trigger flag)
4. **GATE**: Pipeline runs green with all checks passing

## Usage

```bash
/sdlc-deploy                           # All: pipeline + Docker + cloud IaC
/sdlc-deploy --stack github-actions    # CI/CD pipeline only
/sdlc-deploy --trigger                 # Auto-trigger CI run after creation
```
