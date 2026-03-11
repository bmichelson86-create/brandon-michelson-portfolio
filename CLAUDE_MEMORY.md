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

---
### 2026-03-06 — Add Lottie + GSAP preloader with vertical blind reveal

**Files Changed:** index.html, style.css, script.js, loading-screen.json (copied from Downloads)

**What Was Done:**
1. Copied `loading screen.json` from Downloads → `loading-screen.json` in project (renamed, no spaces)
2. Added Lottie script (`lottie-web 5.12.2`) to `<head>` before stylesheet
3. Added `#bm-preloader` HTML after `<body>` — contains blinds container, Lottie container, percentage counter, progress line, scramble text
4. Added preloader CSS to style.css — `#bm-preloader` (fixed, z-index 9999), `.loader-blind` (vertical blinds), `.lottie-container`, percentage/scramble/progress styles
5. Added preloader script (inline, DOMContentLoaded) between GSAP scripts and script.js — generates 5 vertical blinds, loads Lottie animation, runs GSAP master timeline (2.8s count + fade out + blind reveal)
6. Changed `.hero .gs-reveal` CSS from `opacity: 1; visibility: visible` back to `opacity: 0; visibility: hidden` — preloader reveals them
7. Changed `.staggered-menu-header` CSS from `opacity: 1` to `opacity: 0` — preloader reveals it via `gsap.fromTo`
8. Changed `let heroTL` to `window.heroTL` in script.js for cross-script access
9. Changed `heroTL` back to `paused: true` — preloader `onComplete` calls `window.heroTL.play()`
10. Removed `delay: 0.3` from heroTL (preloader handles timing)
11. Hash-skip logic in preloader: hides `#bm-preloader`, sets hero elements + header visible, scrolls to target

**Mistakes Made:**
- `replace_all` for `heroTL` → `window.heroTL` caused `window.window.heroTL` on lines already updated — caught and fixed immediately
- Initially used `gsap.from` for header reveal but CSS `opacity: 0` meant it would animate 0→0 — switched to `gsap.fromTo`

**Lesson Learned:**
- `let heroTL` at top-level of script.js is NOT accessible from inline `<script>` blocks — must use `window.heroTL`
- Preloader script runs in DOMContentLoaded, script.js runs synchronously at load — by the time `onComplete` fires, `window.heroTL` exists
- `gsap.from()` animates FROM specified values TO current CSS values — if CSS is already `opacity: 0`, `gsap.from({opacity: 0})` does nothing. Use `gsap.fromTo()` instead.
- The `.staggered-menu-wrapper` has `z-index: 9000`, preloader has `z-index: 9999` — preloader correctly covers the header
- Lottie JSON was in Downloads, not project folder — always check Downloads if missing
- `replace_all` can double-prefix when some lines already contain the replacement target — always verify after bulk replace

**Key selectors/IDs:**
- Preloader: `#bm-preloader`, `#blinds-container`, `#lottieLogo`, `#loaderPercentage`, `#progressLine`, `#scrambleText`
- CSS classes: `.loader-blind`, `.loader-content`, `.lottie-container`, `.loader-bottom-data`, `.loader-percentage`, `.scramble-text`, `.progress-line-container`, `.progress-line`
- Lottie file: `loading-screen.json` (800x800, 60fps, 241 frames)
- Hero timeline: `window.heroTL` (paused, played by preloader onComplete)

**Project State:** Full Lottie + GSAP preloader working. Fresh visits: preloader → Lottie animation + percentage + scramble text → fade out → vertical blind reveal → heroTL plays (lanyard drop, SVG name draw, label/subtitle/CTA). Hash visits: preloader skipped, everything visible immediately.
---

---
### 2026-03-10 — Fix LinkedIn URL, skill card height, replace Adobe XD

**Files Changed:** index.html, style.css

**What Was Done:**
1. Updated all LinkedIn URLs (4 instances + JSON-LD schema) from `https://linkedin.com/in/brandon-michelson` to `https://www.linkedin.com/in/brandonmichelson/` — contact section, nav socials, footer, and structured data. Also updated display text from `/in/brandon-michelson` to `/in/brandonmichelson`.
2. Fixed Performance skill card height mismatch — added `min-height: 341px` to `.skill-category` so all 5 cards match. Added `@media (min-width: 1200px)` breakpoint with `grid-template-columns: repeat(5, 1fr)` to `.skills-grid` so all 5 cards sit in one row on desktop.
3. Replaced "Adobe XD" with "Typography Systems" in the Design skill card. Used `fa-solid fa-font` icon to match the text/type theme.

**Mistakes Made:**
- None — executed cleanly

**Lesson Learned:**
- LinkedIn URLs appeared in 4 places: JSON-LD schema (line ~56), staggered menu socials (line ~154), contact section card (line ~765), and footer (line ~821)
- Skills grid used `repeat(auto-fit, minmax(280px, 1fr))` which wraps the 5th card on most screens — needed explicit `repeat(5, 1fr)` at 1200px+ to force single row
- Skill cards use `.skill-category` class (not `.skill-card`)
- The correct LinkedIn URL format is `https://www.linkedin.com/in/brandonmichelson/` (no hyphen, with www)

**Project State:** All LinkedIn links correct and clickable. All 5 skill cards same height (341px min) in single row on desktop. Design card lists Typography Systems instead of Adobe XD.
---
