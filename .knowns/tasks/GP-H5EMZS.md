---
id: GP-H5EMZS
title: Fix four portfolio review findings
status: done
priority: medium
labels: []
createdAt: '2026-11-27T05:38:52.096Z'
updatedAt: '2026-11-27T05:43:12.150Z'
completedAt: '2026-11-27T05:43:12.150Z'
timeSpent: 197
---
# Fix four portfolio review findings

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Resolve all four P2 findings in @doc/reviews/portfolio-review-2026-11-27 as authorized by the user.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Works navigation targets existing project sections in both locales.
- [x] #2 Every certificate remains visible when reached by keyboard at desktop and mobile widths.
- [x] #3 Every sitemap advertised by robots resolves to generated XML.
- [x] #4 Evidence and certificate content is readable without involuntary continuous motion.
- [x] #5 Build, type checks, browser checks and Knowns results are updated.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Align shared Works anchor and root sitemap. 2. Replace automatic evidence/certificate marquees with single-copy manually scrollable lanes; preserve localized labels, focus, reduced motion and document viewer. 3. Verify keyboard traversal, both locales, mobile/desktop, sitemap XML and fragment targets. 4. Run check/build and update review plus task in Knowns.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Resolved all four P2 findings. Final browser matrix covers both locales, widths 390/1440 and both motion preferences; all 20 cards traverse visibly in both keyboard directions, manual scrolling and document viewer work. Production build passes; Astro check has 0 errors/0 warnings and 2 existing QA hints. Static fragment audit: 537 links, no missing targets. robots index and nested sitemap return 200 XML. Full results: @doc/reviews/portfolio-review-2026-11-27. System Decision Impact: none — bounded corrections to broken navigation, metadata and content accessibility; no new project-wide architecture or workflow guidance. Spec Decision Compliance: not applicable — standalone review follow-up, no linked spec.
<!-- SECTION:NOTES:END -->

