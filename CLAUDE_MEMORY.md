# Claude Memory Log

---
### 2026-03-06 — Add "Live Site" links to project cards

**Files Changed:** index.html, style.css

**What Was Done:** Added "Live Site →" links next to "View Project →" on 3 project cards (RDR2, Bearded Threads, DJ Big Cali). Wrapped both links in a `.project-links` flex container. Styled `.live-site-link` with muted white (0.5 opacity) + underline, hover transitions to `var(--accent)` coral. CocoCoin card left without a live site link.

**Mistakes Made:**
- None — executed cleanly

**Lesson Learned:**
- Project links are inside `.main-project-card`, NOT inside `.tilt-card` — the tilt card mobile kill switch (`pointer-events: none` on `.tilt-card-inner`) doesn't affect them
- The mobile kill switch at `@media (hover: none), (pointer: coarse), (max-width: 1024px)` already covers `.tilt-card a` for pointer-events, so any `<a>` inside tilt cards is clickable
- `.project-link` uses `var(--font-heading)` (Space Grotesk), `0.875rem`, weight 600, letter-spacing 1px
- Portfolio accent color: `var(--accent)` = `#e94560` (coral)
- Font Awesome icon for external link: `fa-solid fa-arrow-up-right-from-square`

**Portfolio Live Site URLs:**
- RDR2: https://rdr2-portfolio-site.vercel.app/
- Bearded Threads: https://bearded-threads-portfolio.vercel.app/
- DJ Big Cali: https://dj-big-cali-website.vercel.app/
- CocoCoin: NO live site (TripleTen case study only)

**Project State:** All 3 live project cards now have both "View Project" and "Live Site" links. CocoCoin unchanged. Desktop and mobile layouts working.
---

---
### 2026-03-06 — Add tilt effect + hover overlay to RDR2 pillar cards

**Files Changed:** index.html, style.css, script.js

**What Was Done:** Wrapped all 3 RDR2 pillar cards in `.tilt-card` > `.tilt-card-inner` structure (matching Bearded Threads, DJ Big Cali, CocoCoin). Added `.tilt-overlay.tilt-overlay--rdr2` to each card with descriptive text. Removed `.rdr2-pillars` wrapper entirely. Updated all CSS selectors from `.rdr2-pillars .X` to `.X` (unscoped). Updated JS `clearProps` selector. Added `.tilt-overlay--rdr2` variant with dark red background `rgba(180, 30, 30, 0.92)`.

**Mistakes Made:**
- None — executed cleanly

**Lesson Learned:**
- The tilt effect is JS-driven (GSAP mousemove in `initTiltCards()` in script.js) — it targets `.tilt-card` class and animates `.tilt-card-inner` with `rotationX/Y`. Any element with `.tilt-card` class auto-gets tilt.
- The overlay is CSS-only: `.tilt-overlay` uses `position: absolute; inset: 0; opacity: 0` and `.tilt-card:hover .tilt-overlay { opacity: 1 }`
- RDR2 cards are data-heavy (metrics, bar graphs, directive lists) — unlike the image-based Bearded Threads cards. The `.pillar-card` content serves as the "base view" and `.tilt-overlay` adds context on hover.
- `.rdr2-pillars` wrapper was removed — pillar CSS selectors were all unscoped (`.rdr2-pillars .pillar-card` → `.pillar-card`)
- JS reference in script.js line 1428 also needed updating (`clearProps` call)
- Mobile kill switch at `@media (hover: none), (pointer: coarse), (max-width: 1024px)` already handles `.tilt-card` transform reset — no extra mobile work needed
- All 4 projects now use identical `.tilt-card` structure: RDR2 (3), Bearded Threads (3), DJ Big Cali (3), CocoCoin (3) = 12 total
- RDR2 overlay color: `rgba(180, 30, 30, 0.92)` (dark red). Other projects use default coral `rgba(233, 69, 96, 0.92)`.

**Project State:** All 12 tilt cards across 4 projects now have tilt + overlay. RDR2 pillar content (metrics, graphs, directives) preserved as base view with overlay for richer descriptions.
---

---
### 2026-03-06 — Fix "Back to Projects" triggering splash curtain animation (v2)

**Files Changed:** script.js

**What Was Done:** Added `window.location.hash` check at the top of the preloader IIFE (~line 50). When hash exists (e.g. `#projects`): preloader element hidden + removed, `#main-content` `.content-hidden` class removed, header forced visible via `gsap.set(siteHeader, { opacity: 1 })` + `.visible` class, badge video started, then scrolls to hash target and calls `ScrollTrigger.refresh()`. First attempt was reverted due to user request, then reimplemented with fixes.

**Mistakes Made:**
- v1 used `showHeader()` and `if (header)` — but `const header` is declared at line 144 (AFTER the IIFE), so it was undefined inside the IIFE. Fixed in v2 by querying `document.getElementById('siteHeader')` directly inside the skip block.
- v1 called `if (heroTL) heroTL.play()` — `heroTL` is `let` at line 503, also unavailable. Removed in v2 since hero animation isn't needed when skipping to #projects.

**Lesson Learned:**
- CRITICAL: `const header` (line 144) and `let heroTL` (line 503) are NOT available inside the preloader IIFE at line 45 — they're declared after it. Must query DOM directly inside the IIFE.
- `mainContent` (line 40, `const mainContent = document.getElementById('main-content')`) IS available since it's declared before the IIFE.
- `badgeVideo` (line 39) also available before the IIFE.
- The preloader element is `#preloader` with class `.preloader`. Adding class `.done` triggers CSS `opacity: 0; visibility: hidden`. For instant skip, `display: none` + DOM removal is faster.
- Header in index.html is `#siteHeader` with class `.staggered-menu-header` (different from case study headers which use `.site-header.visible`).
- All 4 case study files already link to `index.html#projects` — no HTML changes needed.
- The `#projects` anchor is `<div id="projects">` at line 229 of index.html.

**Project State:** "Back to Projects" now bypasses splash and scrolls directly to projects section. Fresh visits (no hash) still get the full SVG curtain animation.
---

---
### 2026-03-06 — Remove SVG curtain intro entirely + fix invisible hero text

**Files Changed:** index.html, style.css, script.js

**What Was Done:**
1. Removed entire `<div class="preloader">` HTML block (SVG name paths) from index.html
2. Removed `content-hidden` class from `<main id="main-content">`
3. Removed all preloader CSS (`.preloader`, `.preloader.done`, `.preloader-content`, `.preloader-svg`, `.name-path`, `.content-hidden`) from style.css
4. Changed `.staggered-menu-header` from `opacity: 0` to `opacity: 1` — header visible by default
5. Removed `.staggered-menu-header.visible` CSS rule (now redundant)
6. Removed entire preloader IIFE (~100 lines) from script.js — SVG animation, hash skip, safety timeout
7. Removed `showHeader()` function from script.js
8. Removed `mainContent` reference from script.js
9. Changed `heroTL` from `paused: true` to auto-play (no longer waits for preloader)
10. Added `hasHash` flag — when arriving via `#projects`, hero `.gs-reveal` elements get `opacity:1; visibility:visible` instantly, SVG name text gets `strokeDashoffset:0; fill:#ffffff`, and hero animations are skipped
11. Added `.hero .gs-reveal { opacity: 1; visibility: visible; }` CSS override — hero text visible by default as no-JS fallback (GSAP `fromTo` overrides this when animating)
12. Badge video now starts immediately on load

**Mistakes Made:**
- After removing the curtain in session 1, forgot that hero text elements were also hidden via `.gs-reveal` class (`opacity: 0; visibility: hidden`) and `heroTL` was `paused: true` — both were waiting for the preloader `onComplete` callback that no longer existed. Fixed in session 2.

**Lesson Learned:**
- `.gs-reveal` class applies `opacity: 0; visibility: hidden` globally — used by hero elements AND scroll-reveal sections. Can't remove the class entirely, but hero elements need a CSS override to be visible by default.
- `heroTL` was `paused: true` — it was played by `preloaderTL.onComplete`. After removing preloader, must also remove `paused: true` so hero animations auto-play.
- `fromTo()` calls in GSAP set the "from" state immediately when the timeline is created (synchronously), so a CSS `opacity: 1` default won't cause a flash — GSAP overrides it before first paint.
- The hash navigation handler must both reveal elements AND skip the `heroTL` to avoid animation delay when returning from case studies.

**Project State:** No SVG curtain intro. Hero section loads directly with animated text entrance (name stroke draw, label/subtitle/CTA fade in). Hash navigation shows everything instantly. Header visible by default.
---
