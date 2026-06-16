---
name: skill-developer-relations
description: SDK development, external developer communication, code samples, API client libraries, community engagement, and developer experience. Use when creating SDKs, writing external guides, creating code samples, or improving developer experience.
version: 1.0.0
---

# Skill: Developer Relations

## Overview

Develop SDKs, guides, and external-facing communication that makes your product accessible and enjoyable for third-party developers.

## Core Principles

### 1. **SDK Design**
- **Single Responsibility**: One SDK = one language, one purpose
- **Familiar Patterns**: Match community conventions (not your internal patterns)
  - Python: classes, context managers, snake_case
  - JavaScript: async/await, CommonJS or ESM, camelCase
  - Go: interfaces, structs, package-level functions
- **Minimal Dependencies**: Reduce transitive dependency bloat
- **Versioning**: Semantic versioning, clear deprecation paths

### 2. **Code Samples**
- **Real, Runnable**: Not pseudocode — every sample executes
- **Progressive Complexity**: Start simple, build up
  - Hello World (authentication only)
  - Basic operation (read/write)
  - Advanced pattern (error handling, retries, batching)
- **Error Paths**: Show what failure looks like and how to handle it
- **Tested**: CI verifies samples remain accurate as APIs evolve

### 3. **Documentation for Developers**
- **Task-First, Not API-First**:
  - Instead of: "Query using GET /users/{id}"
  - Write: "To fetch a user by ID: [sample code]"
- **Examples Over Explanation**: Code sample > prose description
- **Quick Start**: First 5 minutes = working integration (not configuration)
- **API Reference**: Auto-generated from OpenAPI/GraphQL schema (not hand-written)

### 4. **Developer Experience (DX)**
- **Obvious Error Messages**: Include context (what happened, why, how to fix)
- **Retry Logic**: Built-in exponential backoff for transient failures
- **Rate Limit Handling**: Transparent queuing or clear backpressure
- **Type Safety**: Static typing (TypeScript, mypy stubs, Go generics)
- **Zero Configuration**: Sensible defaults; only require secrets

### 5. **Community & Feedback**
- **Clear Contribution Guidelines**: What community code is accepted
- **Deprecation Policy**: 2+ minor versions before removal, clear migration path
- **Response Time**: Triage issues within 48 hours
- **Use Cases**: Document common patterns from community questions

## Execution Checklist

### When Creating an SDK
- [ ] Decide target language(s) and justify (what developers use this API?)
- [ ] Design API surface (objects, functions, errors) from community perspective
- [ ] Write 3 samples: auth → basic operation → advanced pattern
- [ ] Add error handling: timeouts, retries, rate limits
- [ ] Generate OpenAPI/GraphQL client (or hand-craft minimal wrapper)
- [ ] Run samples in CI (every commit)
- [ ] Package: choose common distribution (npm, PyPI, Maven, Go modules)

### When Writing Developer Guides
- [ ] **Audience**: Who is this for? (backend engineer? mobile? data engineer?)
- [ ] **Goal**: What will they build by end of guide?
- [ ] **Sample App**: Real project they can clone and run locally
- [ ] **Runbook Format**:
  1. Prerequisites (what you need)
  2. 1-sentence goal
  3. Step 1: [screenshot of result]
  4. Step 2: [screenshot of result]
  5. Troubleshooting (common failures)
- [ ] **Code Samples**: Copy-paste ready (not pseudocode)
- [ ] **Testing**: Walk through yourself, measure time (target: <15 min for quick start)

### When Responding to Community Questions
- [ ] **Extract Pattern**: What is the underlying use case?
- [ ] **Document**: If it's the 3rd time someone asks, it's underdocumented
- [ ] **Create Issue**: For unclear error messages or missing samples
- [ ] **Build Sample**: If it's a complex pattern, add to guides

## Example: Python SDK Design

```python
# Familiar: context manager, snake_case, exceptions
from myapi import Client, AuthenticationError, RateLimitError

with Client(api_key="sk-...") as client:
    try:
        user = client.users.get(user_id="123")
        print(f"User: {user.email}")
    except AuthenticationError:
        print("Invalid API key")
    except RateLimitError as e:
        print(f"Rate limited. Retry after {e.retry_after}s")
```

## Example: Developer Guide (Task-First)

**Goal**: Build a webhook receiver that listens for order events.

**Step 1**: Create Flask endpoint
```python
from flask import Flask, request

app = Flask(__name__)

@app.route("/webhook", methods=["POST"])
def handle_webhook():
    event = request.json
    print(f"Received {event['type']}: {event['id']}")
    return {"ok": True}
```

**Step 2**: Verify signature
```python
import hmac
import hashlib

secret = "webhook_secret_from_dashboard"

def verify_signature(body: bytes, signature: str) -> bool:
    expected = hmac.new(
        secret.encode(),
        body,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected)

@app.route("/webhook", methods=["POST"])
def handle_webhook():
    signature = request.headers.get("X-Webhook-Signature", "")
    if not verify_signature(request.data, signature):
        return {"error": "Invalid signature"}, 401
    # ... rest of handler
```

## Common Pitfalls to Avoid

❌ **SDK with opinionated architecture**: Forces framework choice (use minimal wrapper)  
❌ **Incomplete error context**: "Error 401" instead of "Invalid API key. See docs.example.com/auth"  
❌ **Samples that don't run**: Pseudocode or manual setup required before copy-paste works  
❌ **API-first documentation**: "GET /users/{id}" instead of "To fetch a user..."  
❌ **Silent failures**: Missing retry logic, rate limit handling, or timeout defaults  

## Success Metrics

- **Adoption**: SDK downloads/installs trending up (PyPI, npm, Maven)
- **Time-to-First-Success**: Measure how long until developer's first successful API call (target: <10 min)
- **Support Load**: Fewer duplicated questions (indicates good docs)
- **Community Contributions**: Issues opened, PRs submitted, Stack Overflow answers
- **Satisfaction**: Developer survey NPS on ease-of-use
