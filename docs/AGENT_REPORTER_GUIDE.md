# Agent Reporter Guide

Real-time status updates for Claude Code agents running in the orchestrator.

## Overview

When you run agents via Claude Code CLI (e.g., `/sdlc-plan`, `/sdlc-dev`), they execute independently. The **Agent Reporter** lets your agents report their status back to the orchestrator so the dashboard displays live updates.

## Setup

### 1. Start the Orchestrator

```bash
npm run orchestrator -- --dir /path/to/your/project
```

The orchestrator listens on `http://127.0.0.1:4242` (or `$ORCHESTRATOR_HOST:$ORCHESTRATOR_PORT`).

### 2. Open Dashboard

```bash
# In another terminal
open http://localhost:4242
```

## Usage from Claude Code

### In an Agent Execution

When an agent starts and finishes, report it:

```bash
# Agent starts working
npm run report-agent -- <agent-name> working "<what it's doing>"

# Agent completes
npm run report-agent -- <agent-name> complete

# Agent hits a blocker
npm run report-agent -- <agent-name> block "Waiting for API schema"
```

### Examples

**From a backend-engineer agent run:**

```bash
#!/bin/bash
set -e

# Report that we're starting
npm run report-agent -- backend-engineer working "Generating API schema and endpoints"

# Do work
echo "Creating schema..."
node scripts/generate-schema.js > schema.sql

echo "Creating API handlers..."
npm run build:api

# Report completion
npm run report-agent -- backend-engineer complete
```

**From a product-manager agent:**

```bash
npm run report-agent -- product-manager working "Gathering stakeholder requirements"
sleep 5  # simulating work
npm run report-agent -- product-manager complete
```

**Handling blockers:**

```bash
npm run report-agent -- frontend-engineer block "Waiting for backend API schema"
# ... later, when unblocked:
npm run report-agent -- frontend-engineer working "Now building UI"
npm run report-agent -- frontend-engineer complete
```

## Dashboard Integration

When agents report status:

1. **Status Updates**: Card colors change (gray→amber→green) in real-time
2. **Queue Updates**: Dependent agents automatically appear in "Ready to Spawn"
3. **Metrics**: Duration, phase progress, and bottlenecks are tracked
4. **Messages Log**: Status changes are recorded for audit trail

## Status Options

| Status | Meaning | Effect |
|--------|---------|--------|
| `spawn` / `working` | Agent is running | Card turns amber, shows "working" |
| `complete` | Agent finished successfully | Card turns green, duration shown |
| `block` / `blocked` / `fail` | Agent hit a blocker | Card turns red with blocker reason |

## Environment Variables

Control where the reporter sends updates:

```bash
export ORCHESTRATOR_HOST=127.0.0.1   # default
export ORCHESTRATOR_PORT=4242         # default

npm run report-agent -- my-agent complete
```

## Integration with Existing Workflows

### Option A: Add Reporting to Agent Script

Wrap your agent execution:

```bash
#!/bin/bash
AGENT="product-manager"

npm run report-agent -- $AGENT working "Starting phase 1 planning"

# Your agent work
... run your agent logic ...

if [ $? -eq 0 ]; then
  npm run report-agent -- $AGENT complete
else
  npm run report-agent -- $AGENT block "Execution failed"
  exit 1
fi
```

### Option B: Manual Terminal Updates

Run agents normally, update status manually from another terminal:

```bash
# Terminal 1: Run agent (Claude Code CLI)
/sdlc-plan "add user authentication"

# Terminal 2: Report status while running
npm run report-agent -- product-manager working "Writing requirements"
npm run report-agent -- business-analyst working "Creating user stories"

# When done
npm run report-agent -- business-analyst complete
```

### Option C: Monitor-Only (No Updates)

Just run agents normally—the dashboard still shows execution log from collaboration-log.json, but without live real-time updates. Perfect for read-only monitoring.

## Tips

1. **Report early & often**: Status updates help identify bottlenecks
2. **Use meaningful messages**: Include what the agent is currently doing
3. **Chain with `&&`**: Report completion only if agent succeeds
4. **Set environment variables**: If orchestrator runs on a different host/port
5. **Check connectivity**: If report fails, orchestrator may not be running

## Troubleshooting

**"Connection error" message?**
- Verify orchestrator is running: `npm run orchestrator`
- Check ORCHESTRATOR_HOST and ORCHESTRATOR_PORT match

**Status not updating in dashboard?**
- Refresh browser or wait for SSE poll (updates every 2-5 seconds)
- Check orchestrator logs: `tail -f /tmp/orchestrator.log`

**"Unknown status" error?**
- Valid options: `spawn`, `working`, `complete`, `block`, `blocked`, `fail`

## See Also

- [Orchestrator Architecture](./CLAUDE.md)
- [Dashboard Features](./README.md#dashboard—real-time-agent-monitoring)
