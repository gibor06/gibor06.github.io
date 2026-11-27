---
id: doc-4ccfae37c7e5257b8c0d7111599cedf0
title: GitHub Pages security hardening
description: Implementation design and operating limits for hardened static github.io portfolio.
createdAt: '2026-11-27T15:05:04.937Z'
updatedAt: '2026-11-27T15:12:16.714Z'
tags: []
---

# Security hardening on GitHub Pages

## Scope and design
User authorized implementation on 2026-11-27, retaining gibor06.github.io. Keep static output; upgrade the vulnerable toolchain, use Astro's native per-build script/style CSP hashes and narrowly scoped resource allowlists, escape less-than signs in JSON-LD, apply no-referrer metadata, isolate deployment privileges and verify built output in CI. Existing inline style attributes are required by animation and are allowed separately from style elements. No unsafe-inline/unsafe-eval for scripts.

## Alternatives and constraints
Keeping Astro 5 leaves known dependency advisories; upgrade the toolchain and migrate content config. Moving to a custom domain/CDN would enable WAF/rate limiting/response headers but conflicts with the user's instruction to retain github.io. GitHub Pages cannot be configured through _headers or .htaccess. CSP meta cannot enforce frame-ancestors, report-only policies or response headers. Do not claim custom DDoS mitigation or clickjacking headers are enabled.

## Implementation plan
1. Upgrade dependencies and migrate content collections.
2. Configure CSP/referrer controls and safe JSON-LD.
3. Isolate CI permissions, pin actions, add PR validation and Dependabot.
4. Verify production CSP/hashes and browser interactions; audit and typecheck.
5. Record results and account/recovery controls.

## Verification goals
All existing locale/project routes remain generated. npm audit reports no known high/critical findings. Each HTML document has CSP before executable content, each inline executable script matches an approved hash, and external scripts stay same-origin. Browser navigation, mobile menu and theme controls remain functional without CSP violations.

## User-controlled account settings
Require phishing-resistant passkey/security-key protection, offline recovery codes, minimal collaborators/tokens, branch rules requiring the Security and production build check, secret scanning/push protection where available, and restricted deployment environment branches. These settings have not been inspected or enabled by this local change.

## DDoS and recovery
DDoS filtering/rate limiting for github.io belong to GitHub. Never add client-side IP blocking/CAPTCHA and claim it protects origin bandwidth. GitHub Pages documents a soft 100 GB/month bandwidth limit and possible 429s: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits . Investigate availability incidents through GitHub Status and Support. Preserve a known-good commit; revert a bad change through review, let validation pass, then redeploy. If credentials leak, revoke/rotate them before history cleanup. Verify public PDFs/images contain only intended public information.

## Deployment boundary
Local implementation does not publish changes. Commit/push/deploy and account-level changes require user authorization.


## Verified implementation
- Astro 7.4.13, MDX 8.1.6, sitemap 3.7.6, Tailwind 4.3.5. Content collection uses src/content.config.ts with glob loader and astro/zod.
- Native CSP plus scripts/finalize-csp.mjs moves the policy immediately after charset and includes exact hashes for authored inline scripts. scripts/security-policy.mjs checks policy constraints and hashes independently. Style attributes remain allowed for current animations; script attributes are denied. Only Google font CSS/fonts are allowed cross-origin.
- scripts/verify-security.mjs verifies all 33 HTML artifacts (31 pages and 2 approved GitHub redirect stubs), rejects private-key/environment/source-map artifacts and common credential patterns without printing secret values. This pattern check is not a complete secret-history audit.
- Eight unit tests and fourteen Chromium tests passed; the browser tests verify actual rejection of injected inline JavaScript and menu/photo/evidence/theme behavior.
- Read-only CI build, isolated deployment permissions, pinned Actions, PR security validation and weekly Dependabot configuration added. CI additionally runs real Chromium tests.
- npm audit reports zero known vulnerabilities at verification time. This is not an ASVS certification or assurance against future advisories.
- No custom DDoS/WAF/header settings or GitHub account settings were enabled. No changes published yet.


## Final verification
Clean npm ci succeeded; npm audit reported zero vulnerabilities. astro check reported 0 errors/0 warnings (2 hints in existing ignored tmp/qa files). After clean install: 8 unit tests passed, build completed, 33 HTML artifacts passed security inspection, and all 14 Chromium tests passed. Build emits informational warnings about Shiki/style-attribute and CSP scope overrides; style attributes are intentionally allowed, and browser tests observed no unintended CSP violations. Both workflow YAML files parsed successfully; all direct Actions references are pinned to verified release SHAs (checkout v7.0.1, setup-node v7.1.0, upload-pages-artifact v5.0.0, deploy-pages v5.0.1). Hosted Actions execution still requires publishing the changes and has not been observed here. Common credential-pattern changes were checked across 18 locally available Git commits with no matches; remote-only history, all possible secret formats and GitHub account settings remain unverified.
