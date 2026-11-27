---
id: doc-cec25f7d8db1ee90478d330bea00df6d
title: Cinematic Intro
description: Approved opening animation, integration, accessibility behavior, replay instructions and recorded verification.
createdAt: '2026-11-27T05:34:46.228Z'
updatedAt: '2026-11-27T06:04:36.813Z'
tags:
  - frontend
  - animation
---

# Cinematic intro

## Intent and integration
The user approved implementing a cinematic opening animation before entering the portfolio on 2026-11-27. The implementation is src/components/home/CinematicIntro.astro, imported and rendered immediately inside the body of PremiumPortfolio.astro for both English and Vietnamese.

## Current behavior
- Full-screen black native dialog, oversized GIBOR06 letters with staggered reveals, lime light rule and developer signature.
- Automatic dismissal after 2400 ms; upward exit starts at 1750 ms and lasts 650 ms.
- Skip intro button and Escape close and remove the dialog.
- Session storage key gibor-intro-seen makes it run once per browser session across locales. Storage errors are caught.
- Reduced-motion preference, fragment deep links and unsupported showModal skip the intro. Changing to reduced motion during playback dismisses it.
- Without JavaScript, the unopened dialog stays hidden and the page remains available.
- Styles are scoped to the Astro component; no new runtime dependencies were installed.

## Verification recorded on 2026-11-27
- npm run check: 0 errors, 0 warnings, 2 pre-existing hints in temporary QA scripts.
- npm run build: success, 31 generated pages.
- Browser checks: English desktop at 1440px and Vietnamese mobile at 390px, auto dismissal, visible hero afterward, no horizontal overflow, repeat reload skips intro, reduced motion skips intro, no runtime errors.
- Script behavior checks: skip button, Escape, storage unavailable, fragment deep links and automatic dismissal.
- Desktop screenshot visually inspected. Local QA screenshots: tmp/qa/intro-desktop.png and tmp/qa/intro-mobile.png (ignored by Git).

## Previewing again
The dev server was started at http://127.0.0.1:4321/ during this chat; check whether it is still running before relying on it. To replay in the same tab, remove sessionStorage key gibor-intro-seen and reload without a fragment. Reloading alone intentionally skips the animation after the first showing.

## Delivery state

Implementation is included in the portfolio change set prepared for main on 2026-11-27. Consult Git history and remote state for commit/publication status. Verification notes above describe the recorded local checks; repeat relevant checks when source changes.
