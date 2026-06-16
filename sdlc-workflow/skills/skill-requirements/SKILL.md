---
name: skill-requirements
description: This skill should be used when the user asks to "write requirements", "create user stories", "define acceptance criteria", "decompose a feature", "analyze an issue", "write a PRD", "create user stories", "acceptance criteria", "roadmap", "feature spec", or discusses "INVEST" criteria, "ambiguity", or "story estimation".
version: 1.0.0
---

# Skill: Requirements & User Stories (INVEST)

## INVEST Criteria — Making Stories Actionable

A well-written user story is **INVEST-compliant**:

- **Independent**: Story doesn't depend on another story (can be built in any order)
- **Negotiable**: Details can be discussed and refined (not cast in stone)
- **Valuable**: Delivers value to the end user (not just internal plumbing)
- **Estimable**: Engineer can estimate size (2-13 story points)
- **Small**: Fits in a single sprint (1-2 weeks max)
- **Testable**: Acceptance criteria are clear and provable

## Story Format

```markdown
## User Story: [Feature Name]

As a [role/persona]
I want to [action/capability]
So that [business value/outcome]

### Acceptance Criteria
- Given [precondition]
  When [action]
  Then [observable result]

### Edge Cases & Questions
- Q: What happens if [scenario]?
- Q: Should we support [case]?

### Definition of Done
- [ ] Code written and reviewed
- [ ] Acceptance criteria tests pass
- [ ] Documentation updated
- [ ] Performance tested (if relevant)
- [ ] Security review passed (if relevant)
```

## Story Estimation

- **Small (2-3 pts)**: Can be done in a day, low complexity, well-understood
- **Medium (5 pts)**: Takes 2-3 days, some unknowns, requires design
- **Large (8 pts)**: Takes full sprint, many unknowns, high risk
- **Too Large (13+ pts)**: Break into smaller stories

## Common Pitfalls

| Pitfall | Bad Example | Good Example |
|---------|-------------|--------------|
| Not independent | "Add payment form" depends on "Add payment backend" | "Add payment form UI" + "Add payment API" (can be mocked) |
| Not valuable | "Refactor database layer" | "Enable payments via Stripe" |
| Not testable | "Code should be fast" | "Page load <2 seconds on 3G" |
| Too large | "Build entire user profile system" | "User can upload profile photo" |
| Unclear | "Handle edge cases" | "Given missing email, show validation error" |

## Ambiguity Detection

Always ask these questions before starting work:

1. **Scope**: Are there other features needed first? Any dependencies?
2. **Success**: How do we know this is done? What's the test?
3. **Users**: Who specifically benefits? All users or subset?
4. **Edge Cases**: What happens if user has no data? Empty input? Slow connection?
5. **Performance**: Are there speed requirements?
6. **Integration**: Does this affect other features? APIs? Databases?

