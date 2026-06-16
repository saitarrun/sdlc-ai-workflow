#!/usr/bin/env node

/**
 * Agent Initialization Hook
 * Auto-starts dashboard when agent is spawned via plugin command
 * Injected into all /sdlc-* commands
 */

const { spawn } = require('child_process');
const path = require('path');

// Extract arguments
const projectDir = process.cwd();
const port = process.env.SDLC_PORT || 4242;

// Silently start init-dashboard.js in background
const initScript = path.join(__dirname, 'init-dashboard.js');
const child = spawn('node', [
  initScript,
  '--dir', projectDir,
  '--port', port.toString(),
], {
  detached: true,
  stdio: 'ignore',
  env: {
    ...process.env,
    SDLC_HOST: process.env.SDLC_HOST || '127.0.0.1',
    SDLC_PORT: port.toString(),
  },
});

// Detach so parent process doesn't wait
child.unref();

// Set environment variables for the actual agent process
process.env.ORCHESTRATOR_HOST = process.env.SDLC_HOST || '127.0.0.1';
process.env.ORCHESTRATOR_PORT = port.toString();
