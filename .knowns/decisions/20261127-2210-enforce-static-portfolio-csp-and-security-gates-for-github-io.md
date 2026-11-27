---
id: 20261127-2210-enforce-static-portfolio-csp-and-security-gates-for-github-io
title: Enforce static portfolio CSP and security gates for github.io
status: draft
supersedes: []
supersededBy: []
tags: []
sources:
  - '@task-GP-N1VMEG'
  - '@doc/security/github-pages-security-hardening'
relatedDocs:
  - security/github-pages-security-hardening
relatedTasks:
  - GP-N1VMEG
verification: []
reviewState: needs_evidence
reviewBlockers:
  - 'linked task "GP-N1VMEG" is "in-progress"; all linked tasks must be done before accepting candidate'
reviewMatches: []
reviewAllowedResolutions: []
reviewEvaluatedHash: '5b9202690ad3b2f97e1d14d7dbb00c882f412cd4d9b6580c875146d022c91637'
reviewEvaluatedAt: '2026-11-27T15:10:26.471Z'
createdAt: '2026-11-27T15:10:26.473Z'
updatedAt: '2026-11-27T15:10:26.473Z'
---

## Context

User retains github.io; custom edge/WAF and HTTP headers are not configurable from this repository.

## Decision

Keep static output. Generate native CSP and finalize placement/inline hashes at build time; run artifact-policy and browser tests before deploy. Build has read-only token permissions; deploy alone receives Pages/OIDC permissions. Document DDoS/platform limitations rather than simulating client-side protection.

## Alternatives Considered


## Consequences
