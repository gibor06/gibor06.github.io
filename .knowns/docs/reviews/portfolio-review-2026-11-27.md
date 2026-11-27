---
id: doc-aac3e0fe6a2449c8b7bfb1a51b80af80
title: Portfolio Review 2026-11-27
description: Four reproduced P2 findings covering navigation, keyboard focus, sitemap discovery and motion controls, with verification evidence.
createdAt: '2026-11-27T05:37:49.266Z'
updatedAt: '2026-11-27T05:57:08.297Z'
tags:
  - review
  - accessibility
---

# Portfolio repository review - 2026-11-27

## Scope and verdict
Follow-up verification PASS: all four originally reported P2 findings are resolved locally under @task-GP-H5EMZS. No remaining P1/P2 was identified in this bounded follow-up. This is not a full security, dependency or cross-browser audit. No commit, push or deployment was performed.

## Resolved findings

1. Works: shared header and footer use #work; sitemap fixes remain in place.
2. Keyboard: native scrollLeft and focusin correction keep all original cards visible when tabbed. Visual duplicate groups have aria-hidden and tabindex=-1 links; they do not add keyboard stops.
3. Sitemap: robots advertises the generated root sitemap-index.xml.
4. Latest user direction on 2026-11-27 supersedes both the static lanes and the intermediate pause-button design: evidence moves left and Google certificates move right, at 65px/s (previously 24px/s), with seamless repeating content. No pause buttons or visible scrollbars, as explicitly requested. Motion pauses for hover/focus, offscreen/hidden tabs and document viewing; reduced-motion preference disables autoplay and hides visual copies. This follows the requested visual behavior rather than claiming a visible pause control exists. Intro and other effects remain in place.

## Verification evidence

Latest automatic-loop implementation verified on 2026-11-27: npm run build succeeded (31 pages); npm run check succeeded (0 errors, 0 warnings, 2 existing hints in ignored QA scripts); git diff --check passed. Chromium passed 8 lane scenarios across English/Vietnamese and widths 390/1440: opposite directions, seamless forward/backward boundary wrapping, no pause controls, hidden scrollbars, all 10 original cards reachable and fully visible by keyboard per lane, visual duplicate copies hidden under reduced motion, and no page runtime errors. Earlier navigation/sitemap verification: 537 fragment links had no missing targets; root sitemap index and referenced XML returned 200. Prior static-lane and pause-button test outcomes are historical and do not describe current motion behavior. Changes remain local; no publish or commit.

## Limits and unrelated notes
Knowns doctor still reports the previously documented language-server and Claude-integration warnings; these do not prevent CLI documentation or validation. The earlier /vi/404 alternate metadata observation was outside the four requested fixes and was not changed. External-site availability, live deployment and other browser engines were not tested.

## Source locations
- src/components/common/Header.astro and Footer.astro
- src/components/home/EvidenceGallery.astro and PremiumPortfolio.astro
- src/scripts/photo-story.ts
- src/styles/premium.css
- public/robots.txt
Latest refinement: user explicitly requested no pause on hover. Mouse pointerenter/leave handlers removed; both lanes continue while hovered. Browser verified both lanes move under the mouse. Keyboard focus, reduced-motion and hidden/offscreen safeguards remain.
