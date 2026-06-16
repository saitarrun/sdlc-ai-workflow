# Agent Development Guide: Enabling Collaboration

Guide for writing agents that work in parallel with shared context and real-time communication.

## Agent Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│ 1. REGISTER                                                 │
│    └─ Declare dependencies & what you'll provide           │
├─────────────────────────────────────────────────────────────┤
│ 2. WAIT FOR DEPENDENCIES                                    │
│    └─ Block until all dependencies are satisfied            │
├─────────────────────────────────────────────────────────────┤
│ 3. LOAD CONTEXT                                             │
│    └─ Read shared context.json for requirements/design      │
├─────────────────────────────────────────────────────────────┤
│ 4. WORK                                                     │
│    └─ Do your job (generate code, write tests, etc.)        │
│    └─ Optionally publish messages for feedback              │
├─────────────────────────────────────────────────────────────┤
│ 5. PUBLISH RESULTS                                          │
│    └─ Write to shared context & collaboration log           │
├─────────────────────────────────────────────────────────────┤
│ 6. MARK COMPLETE                                            │
│    └─ Signal that results are ready for dependent agents    │
└─────────────────────────────────────────────────────────────┘
```

## Agent Code Template

```typescript
// agents/example-agent.ts
import { AgentCoordinator } from '../scripts/collaboration-framework';

// 1. SETUP
const coordinator = new AgentCoordinator('.sdlc/run-<timestamp>');
const agentName = 'example-engineer';
const dependencies = ['software-architect:architecture'];
const provides = ['example-output'];

// 2. REGISTER
coordinator.registerAgent(agentName, dependencies, provides);
console.log(`[${agentName}] Registered, waiting for dependencies...`);

// 3. WAIT FOR DEPENDENCIES
try {
  await coordinator.waitForDependencies(agentName, dependencies);
  console.log(`[${agentName}] Dependencies satisfied, starting work`);
} catch (error) {
  console.error(`[${agentName}] Timeout waiting for dependencies:`, error);
  process.exit(1);
}

// 4. LOAD CONTEXT
coordinator.markWorking(agentName);
const context = coordinator.getContext();
const requirements = context.requirements;
const architecture = context.design.architecture;

// 5. DO YOUR WORK
console.log(`[${agentName}] Working...`);
const result = doYourWork(requirements, architecture);

// Optionally: Ask questions to other agents
coordinator.publishMessage(
  agentName,
  'backend-engineer',
  'clarification_request',
  'Should the API return user.id or user.uuid?',
  []
);

// Wait for response (optional)
const response = coordinator.waitForResponse('backend-engineer', 'clarification_response');
console.log(`[${agentName}] Got response:`, response.content);

// 6. PUBLISH RESULTS
coordinator.updateContext({
  development: {
    ...context.development,
    your_work: result,
  },
});

coordinator.publishMessage(
  agentName,
  ['automation-qa-engineer', 'devops-engineer'],
  'work_complete',
  'Example work ready for next phase',
  ['output.json']
);

// 7. MARK COMPLETE
coordinator.markComplete(agentName, ['output.json']);
console.log(`[${agentName}] Complete!`);
```

## Pattern 1: Simple Output

Agent does work and publishes result.

```typescript
// FrontendEngineer
const coordinator = new AgentCoordinator('.sdlc/run-123');
coordinator.registerAgent('frontend-engineer', ['software-architect:architecture'], ['ui']);

await coordinator.waitForDependencies('frontend-engineer', [
  'software-architect:architecture',
]);

coordinator.markWorking('frontend-engineer');

// Do work
const ui = generateUI(context);

// Publish
coordinator.updateContext({
  development: {
    ...context.development,
    frontend_generated: true,
    ui_components: ui,
  },
});

coordinator.publishMessage(
  'frontend-engineer',
  ['automation-qa-engineer'],
  'ui_ready',
  'UI components generated and ready for testing',
  ['components.tsx']
);

coordinator.markComplete('frontend-engineer', ['components.tsx']);
```

## Pattern 2: Request & Response

Agent asks another agent a question.

```typescript
// FrontendEngineer asks BackendEngineer about API
coordinator.publishMessage(
  'frontend-engineer',
  'backend-engineer',
  'api_contract_question',
  'What fields should POST /user return?',
  []
);

// BackendEngineer receives and responds
const question = coordinator.waitForMessage({
  from: 'frontend-engineer',
  type: 'api_contract_question',
});

// Respond
coordinator.publishMessage(
  'backend-engineer',
  'frontend-engineer',
  'api_contract_answer',
  'POST /user returns: { id, email, created_at }',
  ['api-spec.json']
);

// FrontendEngineer receives response
const answer = coordinator.waitForResponse('backend-engineer', 'api_contract_answer');
```

## Pattern 3: Peer Review

Reviewer evaluates work while developer continues.

```typescript
// BackendEngineer publishes code
coordinator.publishMessage(
  'backend-engineer',
  ['appsec-engineer'],
  'code_ready_for_security_review',
  'API implementation ready for security audit',
  ['api.ts', 'models.ts']
);
coordinator.markComplete('backend-engineer', ['api.ts']);

// AppSecEngineer reviews (non-blocking)
const backendCode = getArtifacts('api.ts');
const findings = auditSecurity(backendCode);

if (findings.critical.length > 0) {
  coordinator.publishMessage(
    'appsec-engineer',
    'backend-engineer',
    'security_issues_found',
    'Critical vulnerabilities found',
    ['findings.json']
  );
} else {
  coordinator.publishMessage(
    'appsec-engineer',
    'backend-engineer',
    'security_approved',
    'Code passes security review',
    []
  );
}

// BackendEngineer can fix in parallel
const findings = coordinator.waitForResponse('appsec-engineer', 'security_issues_found');
// Fix issues
coordinator.publishMessage(
  'backend-engineer',
  'appsec-engineer',
  'issues_fixed',
  'Vulnerabilities addressed',
  ['api.ts']
);
```

## Pattern 4: Conditional Blocking

Agent waits only if dependency is critical.

```typescript
// FullstackEngineer (needs both FE and BE)
coordinator.registerAgent('fullstack-engineer', ['frontend-engineer:ui', 'backend-engineer:api'], [
  'integration',
]);

// Wait for BOTH
await coordinator.waitForDependencies('fullstack-engineer', [
  'frontend-engineer:ui',
  'backend-engineer:api',
]);

// FullstackEngineer blocks: can't integrate without both UI and API
```

## Pattern 5: Conflict Resolution

When two agents disagree.

```typescript
// FrontendEngineer proposes REST
coordinator.publishMessage('frontend-engineer', 'software-architect', 'architecture_proposal', 'Use REST API', [
  'rest-design.md',
]);

// BackendEngineer proposes GraphQL
coordinator.publishMessage('backend-engineer', 'software-architect', 'architecture_proposal', 'Use GraphQL', [
  'graphql-design.md',
]);

// SoftwareArchitect arbitrates
const proposal1 = coordinator.waitForMessage({
  from: 'frontend-engineer',
  type: 'architecture_proposal',
});
const proposal2 = coordinator.waitForMessage({
  from: 'backend-engineer',
  type: 'architecture_proposal',
});

const decision = {
  type: 'REST',
  rationale: 'Simpler for MVP, can migrate to GraphQL later',
};

coordinator.publishMessage('software-architect', ['frontend-engineer', 'backend-engineer'], 
  'architecture_decision',
  `Decision: ${decision.type}. Rationale: ${decision.rationale}`,
  []
);
```

## Best Practices

### 1. Fail Fast on Dependencies

```typescript
// ❌ Bad: Unclear what's needed
await coordinator.waitForDependencies('my-agent', ['architect']);

// ✅ Good: Explicit dependency chain
await coordinator.waitForDependencies('my-agent', [
  'software-architect:architecture',
  'security-architect:threat-model',
]);
```

### 2. Communicate Clearly

```typescript
// ❌ Bad: Vague message
coordinator.publishMessage('my-agent', 'other-agent', 'ready', 'Done', []);

// ✅ Good: Clear, actionable message
coordinator.publishMessage(
  'backend-engineer',
  'frontend-engineer',
  'api_endpoints_ready',
  'REST API endpoints implemented and documented in api.ts',
  ['api.ts', 'api-spec.json']
);
```

### 3. Set Appropriate Timeouts

```typescript
// ❌ Bad: Waits forever if blocker never completes
await coordinator.waitForDependencies('my-agent', deps); // Default 10 min

// ✅ Good: Reasonable timeout with fallback
try {
  await coordinator.waitForDependencies('my-agent', deps, 300000); // 5 min
} catch (error) {
  console.error('Dependency timeout, proceeding with defaults...');
  // Fallback logic
}
```

### 4. Publish Early, Iterate

```typescript
// ✅ Good: Publish work-in-progress, get feedback early
coordinator.publishMessage(
  'my-agent',
  ['peer-reviewer'],
  'work_in_progress',
  'Initial implementation ready for feedback',
  ['draft.ts']
);

// Get feedback while continuing work
const feedback = coordinator.waitForResponse('peer-reviewer', 'feedback', 60000);
// Incorporate feedback
```

## Testing Multi-Agent Flows

```typescript
// Test file: tests/collaboration.test.ts

describe('Agent Collaboration', () => {
  let coordinator: AgentCoordinator;

  beforeEach(() => {
    coordinator = new AgentCoordinator('.sdlc/test-run');
  });

  it('should handle agent dependency resolution', async () => {
    coordinator.registerAgent('agent-a', [], ['output-a']);
    coordinator.registerAgent('agent-b', ['agent-a:output-a'], ['output-b']);

    // Simulate agent-a completing
    coordinator.publishMessage('agent-a', 'agent-b', 'complete', 'Done', []);
    coordinator.markComplete('agent-a', []);

    // agent-b should unblock
    const unblocked = coordinator.waitForDependencies('agent-b', ['agent-a:output-a']);
    expect(unblocked).toBe(true);
  });

  it('should handle communication between agents', () => {
    coordinator.publishMessage('agent-a', 'agent-b', 'question', 'What should I do?', []);

    const message = coordinator.waitForMessage({
      from: 'agent-a',
      type: 'question',
    });

    expect(message.content).toBe('What should I do?');
  });
});
```

## Debugging Collaboration Issues

### Monitor Real-Time

```bash
# Watch collaboration log as agents work
watch -n 1 'cat .sdlc/run-latest/collaboration-log.json | jq ".messages | reverse | .[0:5]"'
```

### Check Agent Status

```bash
# See which agents are blocked
cat .sdlc/run-latest/collaboration-log.json | jq '.agents[] | select(.status == "blocked")'
```

### Trace Dependency Chain

```bash
# Show dependency resolution for specific agent
cat .sdlc/run-latest/collaboration-log.json | jq '.agents["backend-engineer"]'
```

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Agent waits forever | Dependency never publishes result | Check if dependency agent errored |
| Circular dependency | A needs B, B needs A | Redesign phase to have clear ordering |
| Slow execution | Too many agents waiting | Increase max-workers or redesign dependencies |
| Conflicting outputs | Two agents write same context key | Use namespaced keys (e.g., `development.frontend.*`) |
| Lost messages | Message published but not received | Use collaboration log, not in-memory messaging |

## See Also

- [AGENT_COLLABORATION.md](./AGENT_COLLABORATION.md) — Architecture & patterns
- [commands/sdlc-parallel.md](./commands/sdlc-parallel.md) — User-facing parallel mode
- [scripts/collaboration-framework.js](./scripts/collaboration-framework.js) — Implementation

---

**Status**: Ready for agent implementation
**Version**: 1.0.0
