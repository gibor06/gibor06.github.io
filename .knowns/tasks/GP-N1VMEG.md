---
id: GP-N1VMEG
title: Harden static portfolio security on GitHub Pages
status: done
priority: high
labels: []
createdAt: '2026-11-27T15:02:59.078Z'
updatedAt: '2026-11-27T15:12:17.093Z'
completedAt: '2026-11-27T15:12:17.093Z'
timeSpent: 521
---
# Harden static portfolio security on GitHub Pages

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
User authorized implementation after security assessment; retain github.io and static deployment. Upgrade vulnerable toolchain, enforce CSP without breaking interactions, restrict CI permissions, add security regression verification and maintenance documentation. DDoS/WAF and account settings remain platform/user controlled.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Production build and typecheck pass with all existing locale and project routes.
- [x] #2 npm audit has no high or critical findings, or remaining findings are explicitly documented with applicability.
- [x] #3 Built pages enforce script CSP without unsafe-inline/unsafe-eval and retain interactive functionality.
- [x] #4 Build job has read-only permissions; deployment privileges are isolated, Actions pinned and security checks run for PRs.
- [x] #5 Document platform DDoS limitations and account controls without claiming they were enabled.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Upgrade Astro/MDX/Tailwind toolchain and migrate content collection config; retain all static routes.
2. Enable native build-time CSP hashes with minimal resource allowlists, referrer policy and safe JSON-LD serialization.
3. Pin GitHub Actions to verified SHAs, isolate deployment permissions, add PR security checks and Dependabot.
4. Add production artifact security verification (CSP, hashes, resource allowlists, no executable handlers/secrets) and regression tests.
5. Run clean install, audit, typecheck, production build and browser interaction/CSP verification; document github.io DDoS/header limits and recovery/account steps.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Upgraded Astro 5.18.2 to 7.4.13 with matching integrations and migrated content collections. npm audit now reports zero vulnerabilities. Native CSP required a build-finalization hook to place policy before resources and authorize existing is:inline scripts by exact SHA-256 hash. All 33 generated HTML files pass policy inspection; 8 unit tests and 14 Chromium browser tests pass, including actual blocking of injected inline script and menu/photo/evidence/theme interactions. CI build is read-only, deployment permissions isolated, verified Actions SHAs pinned; PR validation and Dependabot added. Clean-install reproducibility and final review in progress.

Final verification after clean npm ci: audit 0 vulnerabilities; astro check 0 errors/0 warnings (2 existing tmp/qa hints); 8 unit tests pass; static build passes; 33 HTML artifacts verified; 14 Chromium tests pass including injected-script blocking. Workflow YAML parsed and least-privilege/pinned-action assertions passed. Direct Actions updated to current verified release SHAs. Common credential-pattern history scan across 18 local commits found no matches (not exhaustive secret scanning). kn-review: no remaining blocking findings in reviewed diff. Build has expected CSP scope/Shiki warnings with deliberate style-src-attr allowance. Hosted CI and live deployment not run; account controls documented, not changed. System Decision Impact: candidate @decision/20261127-2210-enforce-static-portfolio-csp-and-security-gates-for-github-io (added) — retain static github.io, require generated CSP and security gates; candidate remains draft.
<!-- SECTION:NOTES:END -->

