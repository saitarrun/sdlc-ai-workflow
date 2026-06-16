#!/usr/bin/env node

/**
 * Multi-Agent Collaboration Framework
 * Enables agents to work in parallel with shared context and real-time communication
 */

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class SharedContext {
  constructor(workspacePath) {
    this.workspacePath = workspacePath;
    this.contextFile = path.join(workspacePath, 'context.json');
    this.collaborationLogFile = path.join(workspacePath, 'collaboration-log.json');
    this.initializeFiles();
  }

  initializeFiles() {
    // Create context.json if doesn't exist
    if (!fs.existsSync(this.contextFile)) {
      const initialContext = {
        project: { phase: 0, status: 'initialized' },
        requirements: {},
        design: {},
        development: {},
        security: {},
        testing: {},
        deployment: {},
        operations: {},
        collaboration: { agents_involved: [], current_blockers: [] },
      };
      fs.writeFileSync(this.contextFile, JSON.stringify(initialContext, null, 2));
    }

    // Create collaboration log if doesn't exist
    if (!fs.existsSync(this.collaborationLogFile)) {
      const initialLog = { messages: [], agents: {}, metrics: {} };
      fs.writeFileSync(this.collaborationLogFile, JSON.stringify(initialLog, null, 2));
    }
  }

  read() {
    return JSON.parse(fs.readFileSync(this.contextFile, 'utf8'));
  }

  write(context) {
    fs.writeFileSync(this.contextFile, JSON.stringify(context, null, 2));
  }

  update(updates) {
    const context = this.read();
    Object.assign(context, updates);
    this.write(context);
  }

  patch(path, value) {
    const context = this.read();
    setNestedValue(context, path, value);
    this.write(context);
  }
}

class CollaborationLog {
  constructor(workspacePath) {
    this.logFile = path.join(workspacePath, 'collaboration-log.json');
  }

  read() {
    return JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
  }

  write(log) {
    fs.writeFileSync(this.logFile, JSON.stringify(log, null, 2));
  }

  publishMessage(message) {
    message.timestamp = new Date().toISOString();
    const log = this.read();
    log.messages.push(message);
    this.write(log);
    return message;
  }

  listenForMessage(filter, timeout = 30000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const log = this.read();
      const message = log.messages.find(
        (m) =>
          (!filter.from || m.from === filter.from) &&
          (!filter.type || m.type === filter.type) &&
          (!filter.to || m.to.includes(filter.to)),
      );
      if (message) return message;
      // Poll every 500ms
      sleepSync(500);
    }
    return null;
  }

  registerAgent(agentName, dependencies = [], provides = []) {
    const log = this.read();
    log.agents[agentName] = {
      name: agentName,
      status: 'waiting',
      started_at: null,
      completed_at: null,
      duration_ms: 0,
      dependencies,
      provides,
      blocked_on: [],
    };
    this.write(log);
  }

  updateAgentStatus(agentName, status, metadata = {}) {
    const log = this.read();
    if (log.agents[agentName]) {
      log.agents[agentName].status = status;
      if (status === 'working' && !log.agents[agentName].started_at) {
        log.agents[agentName].started_at = new Date().toISOString();
      }
      if (status === 'complete' && log.agents[agentName].started_at) {
        log.agents[agentName].completed_at = new Date().toISOString();
        const start = new Date(log.agents[agentName].started_at);
        const end = new Date(log.agents[agentName].completed_at);
        log.agents[agentName].duration_ms = end - start;
      }
      Object.assign(log.agents[agentName], metadata);
    }
    this.write(log);
  }

  recordMetrics(phase, metrics) {
    const log = this.read();
    log.metrics[phase] = {
      timestamp: new Date().toISOString(),
      ...metrics,
    };
    this.write(log);
  }
}

class AgentCoordinator extends EventEmitter {
  constructor(workspacePath) {
    super();
    this.workspacePath = workspacePath;
    this.context = new SharedContext(workspacePath);
    this.log = new CollaborationLog(workspacePath);
  }

  /**
   * Register an agent and its dependencies
   */
  registerAgent(agentName, dependencies = [], provides = []) {
    this.log.registerAgent(agentName, dependencies, provides);
    this.emit('agent-registered', { agent: agentName, dependencies, provides });
  }

  /**
   * Wait for dependencies to be satisfied
   */
  waitForDependencies(agentName, dependencies, timeout = 600000) {
    const startTime = Date.now();
    const satisfied = new Set();

    while (satisfied.size < dependencies.length && Date.now() - startTime < timeout) {
      const log = this.log.read();

      for (const dep of dependencies) {
        if (satisfied.has(dep)) continue;

        const [depAgent, depCondition] = dep.split(':');
        const agentLog = log.agents[depAgent];

        if (agentLog && agentLog.status === 'complete') {
          if (!depCondition || agentLog.provides.includes(depCondition)) {
            satisfied.add(dep);
            this.emit('dependency-satisfied', { agent: agentName, dependency: dep });
          }
        }
      }

      if (satisfied.size < dependencies.length) {
        sleepSync(1000); // Wait 1s before re-checking
      }
    }

    if (satisfied.size < dependencies.length) {
      throw new Error(`Agent ${agentName} timeout waiting for dependencies: ${Array.from(
        dependencies,
      ).filter((d) => !satisfied.has(d))}`);
    }

    this.log.updateAgentStatus(agentName, 'unblocked');
    return true;
  }

  /**
   * Publish message to other agents
   */
  publishMessage(from, to, type, content, artifacts = []) {
    const message = {
      from,
      to: Array.isArray(to) ? to : [to],
      type,
      content,
      artifacts,
      timestamp: new Date().toISOString(),
    };
    this.log.publishMessage(message);
    this.emit('message-published', message);
    return message;
  }

  /**
   * Listen for messages from specific agents
   */
  waitForResponse(from, type, timeout = 30000) {
    const message = this.log.listenForMessage({ from, type }, timeout);
    if (!message) {
      throw new Error(`Timeout waiting for message from ${from} (type: ${type})`);
    }
    this.emit('message-received', message);
    return message;
  }

  /**
   * Read shared context
   */
  getContext() {
    return this.context.read();
  }

  /**
   * Update shared context
   */
  updateContext(updates) {
    this.context.update(updates);
    this.emit('context-updated', updates);
  }

  /**
   * Update nested value in context
   */
  patchContext(path, value) {
    this.context.patch(path, value);
    this.emit('context-patched', { path, value });
  }

  /**
   * Mark agent as working
   */
  markWorking(agentName) {
    this.log.updateAgentStatus(agentName, 'working');
    this.emit('agent-working', { agent: agentName });
  }

  /**
   * Mark agent as complete
   */
  markComplete(agentName, artifacts = []) {
    this.log.updateAgentStatus(agentName, 'complete', { artifacts });
    this.emit('agent-complete', { agent: agentName, artifacts });
  }

  /**
   * Get collaboration status
   */
  getStatus(agentName = null) {
    const log = this.log.read();
    if (agentName) {
      return log.agents[agentName] || null;
    }
    return log.agents;
  }

  /**
   * Get metrics for phase
   */
  getMetrics(phase) {
    const log = this.log.read();
    return log.metrics[phase] || null;
  }
}

// Block the current thread for `ms` milliseconds without spawning a process.
// Portable across platforms (unlike shelling out to `sleep`).
function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

// Helper function to set nested values
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) current[key] = {};
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}

module.exports = {
  SharedContext,
  CollaborationLog,
  AgentCoordinator,
};

// CLI Usage Example
if (require.main === module) {
  const workspacePath = process.argv[2] || '.sdlc/run-latest';

  if (!fs.existsSync(workspacePath)) {
    console.error(`Workspace not found: ${workspacePath}`);
    process.exit(1);
  }

  const coordinator = new AgentCoordinator(workspacePath);

  // Example: Register agents for phase 3
  coordinator.registerAgent('software-architect', [], ['architecture']);
  coordinator.registerAgent('backend-engineer', ['software-architect:architecture'], ['api']);
  coordinator.registerAgent('frontend-engineer', ['software-architect:architecture'], ['ui']);

  // Example: Show status
  console.log('📊 Agent Status:');
  console.log(JSON.stringify(coordinator.getStatus(), null, 2));

  // Example: Show messages
  const log = coordinator.log.read();
  console.log(`\n📨 Messages (${log.messages.length}):`);
  log.messages.forEach((msg) => {
    console.log(`  ${msg.timestamp} [${msg.from}] → [${msg.to.join(',')}] ${msg.type}`);
  });
}
