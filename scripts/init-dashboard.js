#!/usr/bin/env node

/**
 * Dashboard Initializer
 * Called when agents start — ensures orchestrator is running and dashboard is open
 * Usage: node init-dashboard.js [--dir /path/to/project] [--port 4242]
 */

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let projectDir = process.cwd();
let port = process.env.SDLC_PORT || 4242;
let host = process.env.SDLC_HOST || '127.0.0.1';

for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--dir' && i + 1 < process.argv.length) {
    projectDir = path.resolve(process.argv[++i]);
  } else if (process.argv[i] === '--port' && i + 1 < process.argv.length) {
    port = parseInt(process.argv[++i], 10);
  }
}

// Check if orchestrator is running
function checkOrchestratorRunning() {
  return new Promise((resolve) => {
    const req = http.get(`http://${host}:${port}/api/health`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Start orchestrator in background
function startOrchestrator() {
  return new Promise((resolve) => {
    console.log(`🚀 Starting orchestrator on ${host}:${port}...`);

    const orchestratorScript = path.join(__dirname, 'orchestrator.js');
    const child = spawn('node', [
      orchestratorScript,
      '--dir', projectDir,
      '--port', port.toString(),
    ], {
      detached: true,
      stdio: 'ignore',
      env: {
        ...process.env,
        SDLC_HOST: host,
        SDLC_PORT: port.toString(),
      },
    });

    // Detach parent process
    child.unref();

    // Wait for orchestrator to be ready
    const maxRetries = 10;
    let retries = 0;

    const checkReady = setInterval(async () => {
      retries++;
      const isRunning = await checkOrchestratorRunning();

      if (isRunning) {
        clearInterval(checkReady);
        console.log('✓ Orchestrator ready');
        resolve(true);
      } else if (retries >= maxRetries) {
        clearInterval(checkReady);
        console.warn('⚠ Orchestrator startup timeout');
        resolve(false);
      }
    }, 500);
  });
}

// Open dashboard in default browser
function openDashboard() {
  const dashboardUrl = `http://${host}:${port}`;

  // Detect OS and open browser
  const { platform } = process;
  let command;

  switch (platform) {
    case 'darwin':
      command = `open "${dashboardUrl}"`;
      break;
    case 'win32':
      command = `start "${dashboardUrl}"`;
      break;
    default:
      command = `xdg-open "${dashboardUrl}"`;
  }

  // Try to open browser silently
  const { exec } = require('child_process');
  exec(command, (err) => {
    if (!err) {
      console.log(`🌐 Dashboard opened: ${dashboardUrl}`);
    } else {
      console.log(`🔗 View dashboard at: ${dashboardUrl}`);
    }
  });
}

// Main initialization
async function init() {
  // Check if orchestrator already running
  const isRunning = await checkOrchestratorRunning();

  if (!isRunning) {
    await startOrchestrator();
  } else {
    console.log('✓ Orchestrator already running');
  }

  // Open dashboard
  openDashboard();

  // Set environment variables for child processes
  process.env.ORCHESTRATOR_HOST = host;
  process.env.ORCHESTRATOR_PORT = port.toString();

  console.log('\n📊 Dashboard synced. Agents will report status in real-time.\n');
}

init().catch((err) => {
  console.error('Error initializing dashboard:', err);
  process.exit(1);
});
