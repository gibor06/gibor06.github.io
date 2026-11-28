---
id: GP-KZ1K1F
title: Fix cramped mobile homepage header and hero actions
status: done
priority: medium
labels:
  - bugfix
  - responsive
createdAt: '2026-11-28T00:09:26.022Z'
updatedAt: '2026-11-28T00:11:28.771Z'
completedAt: '2026-11-28T00:11:28.771Z'
timeSpent: 0
---
# Fix cramped mobile homepage header and hero actions

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Screenshot shows hero links wrapping inside a shared flex row and oversized header controls on narrow screens.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Reproduce EN/VI header and hero action wrapping at 320–699px. 2. Use compact mobile header controls and stack hero actions without shrinking labels. 3. Verify both locales at mobile/tablet/desktop widths, menu interactions, Astro check and build.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Root cause: .hero-cta kept two shrinkable text links in a flex row on mobile; original primary button height reproduced at 79px at 390px. premium.css now stacks hero links at <=699px, prevents label wrapping, centers links, and simplifies mobile header by keeping contact in the navigation. Playwright passed EN/VI at 320,359,390,480,699,768,1440px: no horizontal overflow; mobile CTA <60px, CV 44px, header in bounds, menu opens and closes on navigation. Screenshot inspected at tmp/qa/mobile-header-hero-after.png. npm run check: 0 errors, 0 warnings, 2 existing hints in tmp/qa; npm run build: 31 pages successfully built, existing CSP warnings. git diff --check passed.
<!-- SECTION:NOTES:END -->

