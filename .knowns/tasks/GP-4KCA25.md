---
id: GP-4KCA25
title: Restore seamless opposite document loops
status: done
priority: medium
labels: []
createdAt: '2026-11-27T05:51:48.570Z'
updatedAt: '2026-11-27T06:04:36.116Z'
completedAt: '2026-11-27T05:56:35.337Z'
timeSpent: 0
---
# Restore seamless opposite document loops

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
User requests automatic scrolling for both evidence and Google certificate lanes; preserve keyboard visibility from @doc/reviews/portfolio-review-2026-11-27.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Both document lanes automatically scroll when visible.
- [x] #2 Cards remain keyboard-visible; document viewer and localized controls work.
- [x] #3 Two lanes loop seamlessly in opposite directions at 65px/s, without pause buttons or visible scrollbars; reduced motion and keyboard visibility remain supported.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Remove pause controls and scrollbar. 2. Loop native scrolling across visual duplicate groups in opposite directions at 65px/s. 3. Preserve focus visibility and reduced motion; hover must not pause. 4. Verify movement, wrapping, keyboard access and build; update Knowns.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
User refinement: opposite directions, faster continuous seamless loops, remove pause buttons and scrollbar. Retain keyboard visibility and reduced-motion support.

Completed latest user refinement: opposite seamless loops at 65px/s, no pause controls or scrollbars. Browser checks passed 8 lane scenarios (EN/VI, 390/1440), both wrap boundaries, original keyboard visibility and reduced motion; build/check pass. Results: @doc/reviews/portfolio-review-2026-11-27. System Decision Impact: none — scoped visual adjustment to document lanes following explicit user direction, without introducing a project-wide convention.

User refinement applied: hover no longer pauses either lane. Browser hover-motion checks passed for both lanes.
<!-- SECTION:NOTES:END -->

