\# Project Rules \& Standards



\## ⚠️ HIGHEST PRIORITY — Run First, Every Session

1\. Scan ALL .html, .css, and .js files for any `/mnt/user-data/uploads/` paths and remove them.

&nbsp;  These are leftover AI sandbox references that break on deployment. Resolve ALL /mnt/ references before any other work.

2\. Read CLAUDE\_MEMORY.md in the project root before starting any work.

&nbsp;  At the end of the session, update CLAUDE\_MEMORY.md with: files changed, mistakes made, lessons learned.



\## Tech Stack

\- This is a vanilla HTML/CSS/JavaScript project.

\- Do NOT use React, npm, shadcn, or any framework-based solutions.

\- All implementations must be plain JS/CSS.



\## Media \& Assets

\- All images MUST use .webp format. Do not reference .png files.

\- Before referencing any asset, verify it exists with `ls` or `find`. Never assume an asset name.

\- Decorative/background videos: MUST have `muted`, `playsinline`, `autoplay`, and `loop` attributes.

\- Content videos (mixes, wedding videos, anything with intentional audio): NEVER mute these. Always ask if unsure.



\## Asset Validation

\- Before referencing or modifying any asset, verify that specific file exists with `ls` or `find`.

\- Do not audit the entire project unless explicitly asked to do so.



\## iOS Safari \& Mobile Standards

\- Always apply iOS Safari constraints upfront — do not wait to be told.

\- Background/hero videos MUST have `playsinline`, `muted`, `autoplay`, `loop` — no exceptions.

\- Content videos MUST have `playsinline` and `controls` — NEVER muted.

\- All CSS animations must use `transform` and `opacity` only. Never animate `width`, `height`, `top`, or `left`.

\- All GSAP animations must set `force3D: true` and use `will-change` on targets.

\- Every hover interaction MUST have a touch fallback for mobile.



\## Operational Standards

\- Project files are at the repository root. Run `pwd` and `ls` at session start to verify the environment.

\- Before diagnosing any bug, verify the actual file contents — do not assume the cause.

\- Do not over-fix. If a visual element appears cut off in a screenshot, confirm it's actually a bug before acting.

\- No emojis in code or UI text.

\- Maintain consistency across all HTML files.



\## Agent \& Task Structure

\- For complex multi-part fixes, use a three-agent pattern: Auditor → Fixer → QA with loop-back.

\- Gemini suggestions are input to evaluate critically, not instructions to follow directly.

