---
name: Agent Dashboard Integration Guide
description: How agents report status to the dashboard in real-time
---

# Agent Dashboard Integration

When agents are spawned via plugin commands (e.g., `/sdlc-plan`, `/sdlc-dev`), the dashboard automatically:
1. **Starts** the orchestrator (if not already running)
2. **Opens** the dashboard in your browser
3. **Syncs** agent status in real-time as agents report their progress

## How It Works

### 1. Dashboard Auto-Start

When you run any `/sdlc-*` command:

```bash
/sdlc-plan "build a user authentication system"
```

The system automatically:
- Calls `init-dashboard.js` in background
- Checks if orchestrator is running on `http://127.0.0.1:4242`
- Starts orchestrator if needed
- Opens dashboard in your default browser
- Sets environment variables: `ORCHESTRATOR_HOST`, `ORCHESTRATOR_PORT`

### 2. Agent Status Reporting

Agents report their lifecycle to the dashboard:

```bash
# When agent starts
node scripts/agent-reporter.js product-manager spawn "Starting product definition"

# While working
node scripts/agent-reporter.js product-manager working "Gathering requirements"

# When complete
node scripts/agent-reporter.js product-manager complete "PRD created"

# If blocked
node scripts/agent-reporter.js product-manager block "Awaiting customer clarification"
```

### 3. Real-Time Dashboard Sync

The dashboard displays:
- **Agent Status** — waiting, working, complete, blocked
- **Phase Progress** — which agents are ready/active
- **Dependencies** — which agents block which
- **Timestamps** — when each agent started/completed
- **Messages** — custom status messages from agents

## For Agent Developers

### Reporting Status from Your Agent

When writing custom agents or hooks, use the reporter:

```javascript
// Node.js
const reporter = require('./agent-reporter.js');
await reporter('my-agent', 'spawn', 'Starting analysis');
await reporter('my-agent', 'working', 'Processing requirements');
await reporter('my-agent', 'complete', 'Analysis complete');
```

Or via bash:

```bash
# Start
node scripts/agent-reporter.js my-agent spawn "Starting"

# Working
node scripts/agent-reporter.js my-agent working "Processing..."

# Done
node scripts/agent-reporter.js my-agent complete "Done"
```

### Environment Variables

Agents receive from the system:

```bash
ORCHESTRATOR_HOST=127.0.0.1
ORCHESTRATOR_PORT=4242
SDLC_PORT=4242
SDLC_HOST=127.0.0.1
```

Use these to connect back to the orchestrator.

## Dashboard URL

Once running, access the dashboard at:

```
http://127.0.0.1:4242
```

The dashboard shows:

### Runs Tab
- List of all SDLC runs (newest first)
- Each run's status (in-progress, complete)
- Which phase is active

### Available Agents
- All 26 agents with their current status
- Filter by phase
- Dependencies highlighted

### Collaboration Log
- Real-time event stream
- Agent start/complete events
- Custom messages

### Artifacts
- Generated PRDs, wireframes, code, tests, etc.
- Organized by phase
- Direct download links

## Troubleshooting

**Dashboard not opening?**
- Manually visit `http://127.0.0.1:4242`
- Check if port 4242 is available
- Use `--port 5000` to override: `npm run init-dashboard -- --port 5000`

**Agents not showing in dashboard?**
- Ensure agents are calling `agent-reporter.js`
- Check that `ORCHESTRATOR_HOST:PORT` environment variables are set
- Check orchestrator logs: `.sdlc/orchestrator.log`

**Dashboard shows old runs?**
- Refresh browser (Cmd+R / Ctrl+R)
- Dashboard auto-updates when agents report status

## Example: Custom Agent with Dashboard Integration

```bash
#!/bin/bash
# my-agent.sh

AGENT_NAME="my-custom-agent"
ORCHESTRATOR_HOST=${ORCHESTRATOR_HOST:-127.0.0.1}
ORCHESTRATOR_PORT=${ORCHESTRATOR_PORT:-4242}

# Report: starting
node scripts/agent-reporter.js $AGENT_NAME spawn "Initializing"

# Do work...
echo "Processing..."

# Report: working
node scripts/agent-reporter.js $AGENT_NAME working "Processing data"

# More work...
sleep 2

# Report: complete
node scripts/agent-reporter.js $AGENT_NAME complete "Generated output.txt"
```

When this runs after `/sdlc-plan`, the dashboard will:
1. Show `my-custom-agent` transitioning: waiting → working → complete
2. Display timestamps for each state change
3. Show custom messages in the collaboration log
4. Update in real-time without refresh

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Claude Code Plugin Command (/sdlc-plan, etc.)  │
└────────────────┬────────────────────────────────┘
                 │
                 ├─→ init-dashboard.js
                 │   ├─ Check if orchestrator running
                 │   ├─ Start orchestrator if needed
                 │   └─ Open dashboard in browser
                 │
                 ├─→ Spawn agents (product-manager, etc.)
                 │   └─ Each agent calls agent-reporter.js
                 │       ├─ POST spawn → orchestrator
                 │       ├─ POST working → orchestrator
                 │       └─ POST complete → orchestrator
                 │
                 └─→ Orchestrator API (port 4242)
                     ├─ /api/agent/spawn/:name
                     ├─ /api/agent/complete/:name
                     ├─ /api/agent/block/:name
                     └─ /api/runs (SSE stream)
                         └─ Dashboard subscribes & updates in real-time
```

## Status Codes

| Status | Meaning | UI Color |
|--------|---------|----------|
| `waiting` | Agent dependencies not met | Gray |
| `spawn` / `working` | Agent currently running | Blue |
| `complete` | Agent finished successfully | Green |
| `block` / `blocked` | Agent blocked (waiting for input) | Yellow |
| `fail` | Agent encountered error | Red |

---

**Key Takeaway**: When you run `/sdlc-plan`, the dashboard **automatically opens and syncs**. Just let agents run — they'll report their status to the dashboard in real-time.
