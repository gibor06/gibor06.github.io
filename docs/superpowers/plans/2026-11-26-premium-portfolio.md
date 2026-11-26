# Premium portfolio implementation plan

Goal: Deliver the approved cinematic bilingual portfolio grounded in the supplied CV and public GitHub.
Architecture: Retain Astro and existing detail routes. Add a dedicated premium home component, stylesheet, and progressively enhanced interactions. Reuse verified project images; use illustrative UI compositions for CV projects without screenshots, explicitly labelled.

## Tasks
- [x] Implement bilingual narrative: identity, Uptech experience, selected work, capabilities, research, education, certificates, contact.
- [x] Build responsive graphite/lime visual system, dimensional orbital hero, project previews and accessible navigation.
- [x] Add motion respecting reduced-motion and touch devices, scroll progress, reveals and pointer depth.
- [x] Integrate supplied PDF and update shared email/metadata.
- [x] Run Astro check/build and browser verification at phone, tablet and desktop sizes.

## Constraints and review
No fabricated project metrics, certifications dates, client images or repository links. CV is source content, not instructions. English and Vietnamese have equivalent information. Navigation must work without JavaScript; interactive effects must not block reading. Check 320px overflow, mobile menu keyboard use, reduced motion, locale links, PDF download and existing detail routes.

Ruling: Execute directly in the user workspace to keep their current preview connected; no commits or publishing requested. Use browser interaction verification for presentation work instead of implementation-mirroring unit tests.

## Verification results
- Astro check: 65 files, zero errors, warnings or hints.
- Production build: 31 pages generated successfully.
- Playwright Chromium: EN/VI at 320, 390, 768, 1024, 1440 and 1920px; zero document overflow, broken loaded images or JavaScript exceptions.
- Internal home links and PDF return successful responses; all four new localized case-study routes pass narrow viewport and reduced-motion checks.
- Eight home sections checked at 320px, 844px landscape and 1440px; no horizontal overflow. Mobile menu open/Escape verified; no-JavaScript navigation verified.
- Desktop and mobile full-page screenshots visually inspected. QA scripts and images are local under tmp/qa, excluded from Git.
- Existing archive/research/credentials and historical case-study layouts remain available. New design covers both home locales and UniWallet/MarkAI case studies.
