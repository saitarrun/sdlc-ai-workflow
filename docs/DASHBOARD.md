# Dashboard — Real-Time Agent Monitoring

## Overview

The SDLC Workflow dashboard provides a professional, terminal-style monitoring interface for tracking all 26 agents across 6 SDLC phases. Built with Tailwind CSS and Material Design Icons, it offers real-time status updates, metrics, and full execution history.

## Dashboard Architecture

```
┌─────────────────────────────────────────────────────┐
│  SYSTEM MONITOR          [Total: 26] [Uptime: 99.9%]│
├─────────────────────────────────────────────────────┤
│                                                       │
│  Agent Deployment                   [EXPORT_CSV]    │
│  Monitoring 26 active SDLC nodes     [PAUSE_ALL]    │
│                                                       │
│  ▶ Running Agents (0)                                │
│  ┌─────────────────────────────────────────────────┐ │
│  │ AGENT ID │ STATUS │ PHASE │ START │ DURATION   │ │
│  ├─────────────────────────────────────────────────┤ │
│  │ (empty - agents start here)                     │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ⏸ Available Agents (26)                            │
│  ┌─────────────────────────────────────────────────┐ │
│  │ AGENT ID │ STATUS    │ PHASE       │ DURATION  │ │
│  ├─────────────────────────────────────────────────┤ │
│  │ #PRODUCT │ AVAILABLE │ Planning    │ 00:00:00  │ │
│  │ #BUSINES │ AVAILABLE │ Planning    │ 00:00:00  │ │
│  │ #SOFTWAR │ AVAILABLE │ Planning    │ 00:00:00  │ │
│  │ ... (23 more agents)                            │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ✓ Completed Agents (0)                              │
│  ┌─────────────────────────────────────────────────┐ │
│  │ (empty - agents appear here on completion)      │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  Metrics:                                             │
│  ┌──────────────────────────────────────────────────┐│
│  │ QUEUED: 26  RUNNING: 0  COMPLETED: 0  FAILED: 0 ││
│  │ █████░░░░  █░░░░░░░░  █░░░░░░░░░  █░░░░░░░░░ ││
│  └──────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

## Features

### 1. System Monitor Header
- **Title**: SYSTEM MONITOR
- **Real-Time Stats**:
  - Total Agents: Count of all agents in current run
  - Uptime: System uptime percentage
  - Recent Errors: Count of recent failures

### 2. Running Agents Section
Displays actively executing agents with:
- **AGENT ID**: First 8 chars of agent name (uppercase)
- **STATUS**: 
  - 🟢 WORKING (green with pulse animation)
  - ⚪ WAITING (gray)
  - 🔴 BLOCKED (red)
- **PHASE**: PLANNING, DESIGN, DEVELOPMENT, TESTING, DEPLOYMENT, OPERATIONS
- **START TIME**: ISO timestamp when agent started
- **DURATION**: Elapsed time (HH:MM:SS)
- **LATEST LOG**: [STATUS] agent-name
- **ACTIONS**: Terminal icon to view logs

### 3. Available Agents Section
Shows all 26 repository agents with synchronized status:
- Lists every agent across all 6 phases
- Status syncs with active run in real-time
- Shows WORKING, COMPLETE, WAITING, or AVAILABLE
- Updated every 2 seconds from orchestrator

### 4. Completed Agents Section
Agents that have finished execution:
- Same columns as Running Agents
- Shows completion timestamp
- Full execution duration

### 5. Metrics Dashboard
Four cards showing execution metrics:

**QUEUED_AGENTS** (Yellow progress bar)
- Agents waiting for dependencies
- Depends on: blocked_agents + waiting_agents

**RUNNING_AGENTS** (Green progress bar)
- Currently executing agents
- Shows with pulse animation in tables

**COMPLETED** (Green progress bar)
- Successfully finished agents
- Full execution time recorded

**FAILED** (Red progress bar)
- Blocked or errored agents
- Reason tracked in agent record

## Status Colors

```
WORKING     → Green (#00ff41) with pulse animation
COMPLETE    → Green (#a7d2a1) 
WAITING     → Gray (#b9ccb2)
BLOCKED     → Red (#ffb4ab)
AVAILABLE   → Gray (#b9ccb2)
```

## Real-Time Sync Flow

```
Agent Terminal          Orchestrator           Dashboard
     │                      │                       │
     │─ report-agent ──────>│                       │
     │  /api/agent/complete │                       │
     │                      │─ updates log ────────>│
     │                      │                       │─ SSE broadcast
     │                      │                       │
     │                      │  polls every 2s       │
     │                      │<─ /api/runs/:id ──────│
     │                      │                       │
     │                      │                       │─ refresh tables
     │                      │                       │─ update metrics
```

## Using the Dashboard

### 1. Start the Orchestrator
```bash
npm run orchestrator -- --dir /path/to/project --port 4242
```

### 2. Open Dashboard
```bash
open http://localhost:4242
```

### 3. Report Agent Status from CLI
```bash
# From your agent script or terminal
npm run report-agent -- product-manager working "Gathering requirements"
npm run report-agent -- product-manager complete
```

### 4. Monitor in Real-Time
- Dashboard auto-refreshes every 2 seconds
- Available Agents shows current run status
- Metrics cards update live
- Completed agents move to Completed section

## Theme & Styling

**Colors** (Terminal Green on Black):
- Background: #000000
- Primary: #00ff41 (terminal green)
- Secondary: #a7d2a1 (muted green)
- Error: #ffb4ab (red)
- Surface: #0a0a0a (dark gray)

**Typography**:
- Headlines: Hanken Grotesk (bold, 32px)
- Body: JetBrains Mono (14px)
- Labels: JetBrains Mono (11px, uppercase, letter-spaced)

**Icons**: Material Design Icons

## API Endpoints

The dashboard uses these orchestrator endpoints:

```
GET  /api/runs                          # List all runs
GET  /api/runs/:id                      # Get run with agent statuses
GET  /events                            # SSE stream for real-time updates
POST /api/agent/spawn/:agent            # Mark agent as working
POST /api/agent/complete/:agent         # Mark agent as complete
POST /api/agent/block/:agent            # Mark agent as blocked
```

## Performance

- **Update Frequency**: Every 2 seconds via polling
- **SSE Fallback**: If EventSource unavailable
- **Browser Compatibility**: Chrome, Firefox, Safari, Edge
- **Responsive**: Works on desktop, tablets, mobile
- **No External CDN**: All assets bundled

## Troubleshooting

**Dashboard shows "Monitoring 0 active SDLC nodes"**
- Ensure orchestrator is running: `npm run orchestrator`
- Check port matches: default is 4242
- Verify project directory has `.sdlc/run-*` folders

**Agents not updating**
- Refresh browser (Cmd+R or Ctrl+R)
- Check orchestrator logs: `tail -f /tmp/orchestrator.log`
- Verify agent-reporter is using correct HOST/PORT

**No agents appearing**
- Agent must be in run's `collaboration-log.json`
- Report agent status via: `npm run report-agent -- <name> working`

## See Also

- [AGENT_REPORTER_GUIDE.md](../AGENT_REPORTER_GUIDE.md) — How to integrate agents
- [scripts/orchestrator.js](../scripts/orchestrator.js) — Orchestrator implementation
- [scripts/ui/index.html](../scripts/ui/index.html) — Dashboard UI source
