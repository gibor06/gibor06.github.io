---
id: doc-1c5e0d0fb62266be55467c415ffd4df3
title: README
description: Project architecture, active homepage entrypoints, local commands and Knowns bootstrap context.
createdAt: '2026-11-27T05:34:45.518Z'
updatedAt: '2026-11-27T06:04:37.180Z'
tags:
  - project
---

# Project overview

Portfolio of Tran Gia Bao (GIBOR06), with English and Vietnamese homepages, selected work, experience, research and credentials.

## Architecture
- Actual repository root: D:/GIBOR/GIBOR06_portfolio.
- Astro 5, TypeScript, Tailwind CSS 4, MDX; static output for GitHub Pages.
- src/pages/index.astro and src/pages/vi/index.astro use src/components/home/PremiumPortfolio.astro. This is the active homepage; Hero.astro is a separate older component.
- Active homepage styles: src/styles/premium.css. Behavior: src/scripts/premium.ts. Locale helpers: src/i18n/utils.ts.
- astro.config.mjs currently sets base to /; the older README mentions /portfolio/, so check actual configuration before choosing URLs.
- Existing detailed material remains in README.md and docs/portfolio-v4-design.md; use current source when these differ.

## Commands
- npm run dev -- --host 127.0.0.1 --port 4321
- npm run check
- npm run build
- npm run preview -- --host 127.0.0.1 --port 4330

## Current work

Cinematic opening animation and accessible document loops implemented on 2026-11-27. See @doc/guides/cinematic-intro and @doc/reviews/portfolio-review-2026-11-27 for behavior and verification. User requested commit and push to main; consult Git history for delivery status.

## Knowns setup
Initialized on 2026-11-27 using the CLI because Knowns MCP tools were unavailable in this chat. Doctor reported 0 failures and 6 warnings: four unavailable language servers plus Claude integration and hook warnings. npm spawning failed during automatic language-server installation. Keyword search works; semantic search is not configured. Do not rerun global setup or install local skill copies.
