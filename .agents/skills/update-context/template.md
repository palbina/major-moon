# [Title - Replace with actual title]

**Type**: [Feature | Bug | Architecture | Refactor | Performance | Security]
**Date**: [YYYY-MM-DD]
**Status**: [In Progress | Complete | Blocked | Review]
**Branch**: [git branch name if applicable]
**Related Issues/PRs**: [#123, #456]

---

## Overview

[Write a clear, concise description of what this is about. 2-3 sentences maximum. This should be the TL;DR for someone quickly scanning the documentation.]

---

## Problem / Goal / Context

**What problem are we solving? What's the business goal? What triggered this work?**

### Background
[Any relevant history or context that led to this work]

### Triggers
- [What caused this discussion/work to start?]
- [User feedback? Bug report? Tech debt? New requirement?]

### Requirements
- [Key requirement 1]
- [Key requirement 2]
- [Key constraint 1]

### Success Criteria
- [How do we know this is successful?]
- [What metrics or outcomes indicate success?]

---

## Solution / Implementation

**How did we solve it? What's the technical approach?**

### High-Level Approach

[Step-by-step breakdown of the solution at a conceptual level]

1. [Step 1]
2. [Step 2]
3. [Step 3]

### Key Components / Modules

- **Component/Module 1**: [What does it do? Why is it needed?]
- **Component/Module 2**: [What does it do? Why is it needed?]
- **Component/Module 3**: [What does it do? Why is it needed?]

### Technical Details

[Dive deeper into implementation specifics]

**Data Structures:**
```typescript
// Example of key data structures if applicable
interface Example {
  field: string;
}
```

**Key Algorithms/Logic:**
[Explain any non-trivial algorithms or business logic]

**APIs/Interfaces:**
[Document any new APIs, function signatures, or interfaces created]

---

## Code Changes

**[This section is populated when git diff analysis is performed]**

### Files Modified

| File | Lines Changed | Type of Change |
|------|---------------|----------------|
| `src/example.ts` | +45 / -12 | Feature addition |
| `src/another.tsx` | +8 / -3 | Bug fix |
| `tests/example.test.ts` | +32 / -0 | Test coverage |

### Key Code Changes

**Added:**
```typescript
// Example of significant code additions
function newFeature() {
  // Implementation details
}
```

**Modified:**
```typescript
// Example of important modifications
// Before: old approach
// After: new approach
```

**Removed:**
[What code was removed and why?]

### Patterns & Architecture

- **Design Pattern Used**: [e.g., Factory, Observer, etc.]
- **Architectural Approach**: [e.g., separation of concerns, dependency injection]
- **Code Organization**: [How the code is structured and why]

### Dependencies Changed

**Added:**
```json
{
  "new-package": "^1.0.0"
}
```

**Removed:**
```json
{
  "old-package": "^0.5.0"
}
```

**Updated:**
```json
{
  "existing-package": "^1.2.0" // was ^1.0.0
}
```

### Configuration Changes

- `.env` changes: [List any environment variables added/modified]
- Config files: [Any changes to tsconfig, webpack, etc.]
- Build scripts: [Any package.json script changes]

---

## Key Decisions

### Decision 1: [Decision title]
- **What we decided**: [Clear statement]
- **Alternatives considered**:
  - Option A: [Description and why not chosen]
  - Option B: [Description and why not chosen]
- **Rationale**: [Why we chose this approach]
- **Tradeoffs**: [What we gained vs what we gave up]

### Decision 2: [Decision title]
- **What we decided**: [Clear statement]
- **Alternatives considered**:
  - Option A: [Description]
  - Option B: [Description]
- **Rationale**: [Why we chose this approach]
- **Tradeoffs**: [What we gained vs what we gave up]

### Decision 3: [If applicable]
[Repeat pattern above]

---

## Tradeoffs

### Pros / Benefits

- **[Benefit 1]**: [Why this matters]
- **[Benefit 2]**: [Why this matters]
- **[Benefit 3]**: [Why this matters]

### Cons / Costs / Limitations

- **[Cost 1]**: [Impact and mitigation if any]
- **[Cost 2]**: [Impact and mitigation if any]
- **[Limitation/Gotcha]**: [What developers should be aware of]

### Performance Impact

- [Any performance improvements or degradations?]
- [Benchmarks if applicable]

### Security Impact

- [Any security considerations?]
- [Vulnerabilities addressed or introduced?]

---

## Related Files

**Files created or significantly modified:**

- `src/path/to/file1.ts` - [What role does this file play? What's its primary responsibility?]
- `src/path/to/file2.tsx` - [What role does this file play?]
- `src/path/to/file3.js` - [What role does this file play?]

**Key functions/classes:**

- `functionName()` in `file.ts:123` - [What does it do?]
- `ClassName` in `file.tsx:45` - [What's its purpose?]

**Configuration files:**

- `.env` - [Any new environment variables?]
- `package.json` - [Any new dependencies?]

---

## Testing / Verification

### Test Coverage

- [ ] Unit tests written
  - [ ] Test file: `path/to/test.test.ts`
  - [ ] Coverage: [percentage or description]
- [ ] Integration tests written
  - [ ] Test file: `path/to/integration.test.ts`
- [ ] E2E tests written (if applicable)
  - [ ] Test file: `tests/e2e/specs/feature.spec.ts`
- [ ] Manual testing completed
  - [ ] Test scenario 1
  - [ ] Test scenario 2

### How to Test

```bash
# Commands to run tests
npm test path/to/test.test.ts
npm run test:e2e
```

### Manual Verification Steps

1. [Step 1 to manually verify this works]
2. [Step 2]
3. [Expected outcome]

### Edge Cases Tested

- [Edge case 1 and how it's handled]
- [Edge case 2 and how it's handled]

---

## Deployment Notes

### Prerequisites

- [Any environment setup needed]
- [Database migrations required?]
- [Feature flags to enable/disable?]

### Deployment Steps

1. [Step 1]
2. [Step 2]
3. [Step 3]

### Rollback Plan

[How to roll back if something goes wrong]

### Monitoring

- [What metrics to watch?]
- [Where to check logs?]
- [Alert conditions?]

---

## Future Improvements / Technical Debt

### Potential Enhancements

- **[Enhancement 1]**: [Description and why not done now]
- **[Enhancement 2]**: [Description and why not done now]

### Known Limitations

- **[Limitation 1]**: [Description and potential workaround]
- **[Limitation 2]**: [Description and potential workaround]

### Technical Debt Introduced

- [Any shortcuts taken that should be addressed later?]
- [Any hardcoded values that should be configurable?]
- [Any missing abstractions?]

### Follow-up Tasks

- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]

---

## References

### Related Documentation

- [Link to design doc]
- [Link to API documentation]
- [Link to architecture diagrams]

### Related Issues/PRs

- Issue: #123 - [Description]
- PR: #456 - [Description]

### External References

- [Relevant blog posts]
- [Stack Overflow answers]
- [Library documentation]
- [RFCs or specifications]

### Team Discussions

- [Link to Slack thread]
- [Link to meeting notes]
- [Key points from design review]

---

## Notes / Lessons Learned

### Gotchas

- **[Gotcha 1]**: [What's non-obvious that future developers should know?]
- **[Gotcha 2]**: [Common mistake to avoid]

### Lessons Learned

- **[Lesson 1]**: [What did we learn during implementation?]
- **[Lesson 2]**: [What would we do differently next time?]

### Context for Future Developers

[Any additional context that would be helpful for someone working on this code in 6 months or a year. What might be confusing? What's the "why" behind certain choices?]

---

## Timeline / History

- **[YYYY-MM-DD]**: Initial implementation started
- **[YYYY-MM-DD]**: Key decision made about [topic]
- **[YYYY-MM-DD]**: Code review completed
- **[YYYY-MM-DD]**: Deployed to staging
- **[YYYY-MM-DD]**: Deployed to production
- **[YYYY-MM-DD]**: Follow-up fix for [issue]

---

## Contributors / Reviewers

- **Implementation**: [Names or Claude session]
- **Code Review**: [Reviewers]
- **Design Review**: [Participants]
- **QA**: [Testers]

---

_This document was generated using the `/update-context` skill. Last updated: [YYYY-MM-DD]_
