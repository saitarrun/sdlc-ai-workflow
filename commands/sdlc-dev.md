---
description: Phase 3 only — Development & Coding. Implements frontend, backend, fullstack, database, and mobile code following architecture and design specs.
argument-hint: "[architecture-file] [--stack backend,frontend,mobile]"
---

# Phase 3 — Development & Coding

Spawns agents: backend-engineer | frontend-engineer | fullstack-engineer | database-engineer | mobile-developer (controlled by --stack flag)

Outputs:
- Implementation files across the full stack
- Unit and integration tests
- Database migrations
- Component files
- `./projects/<feature-name>/03-implementation.log` — Summary of files changed per component

## Process

1. Read approved architecture ADR
2. Spawn engineers for selected stack (--stack backend,frontend,database)
3. Implement code following existing patterns and design specs
4. Write unit + integration tests
5. **GATE**: User reviews all changed files before proceeding to Phase 4

## Usage

```bash
/sdlc-dev                                    # All stack components
/sdlc-dev --stack backend,frontend           # Backend + Frontend only
/sdlc-dev --stack database                   # Database schema + migrations only
```
