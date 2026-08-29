# Implementation plan: hero viewport fit and scroll-aware header state

**Spec:** `docs/specs/2026-08-29-hero-fit-active-nav-design.md`  
**Date:** 2026-08-29

## Phase 0 — Documentation and pattern discovery

- Use the approved spec as the source of truth.
- Follow the existing reveal observer pattern in `src/components/Hero.jsx:3-43` and `src/components/AppSpotlight.jsx:5-48`.
- Follow the existing app-driven header mapping in `src/components/Header.jsx:3` and the single-source app list in `src/data/apps.js`.
- Keep component styling in `src/styles/components.css:1-275,912-1005` and preserve tokens from `src/styles/tokens.css`.
- Use browser assertions in `tests/header.spec.js:29-68` and `tests/spotlight.spec.js:9-113` as the verification pattern.

Allowed APIs/patterns: React `useEffect`/`useState`/`useRef`, browser `IntersectionObserver`, semantic `aria-current`, CSS `clamp()`/`svh`, and existing test selectors. Do not add per-frame React state or a second app registry.

## Phase 1 — Viewport-aware hero sizing

What to implement:

- Adjust the desktop `.hero` sizing and `.hero-copy` spacing in `src/styles/components.css` to use viewport-aware `svh`/`clamp()` values.
- Scale `.hero h1`, intro, and artwork caption/wedge so short desktop viewports retain the complete composition.
- Preserve the existing mobile media-query structure and reveal classes.

Verification:

- Add/extend Playwright assertions for representative desktop viewport sizes to ensure hero copy and artwork are within the viewport and not clipped.
- Run build, lint, and the existing accessibility/responsive suites.

Anti-pattern guards:

- Do not change the established typography families, palette, animation timing, or two-column/mobile breakpoint.
- Do not hide hero content with a new overflow rule.

## Phase 2 — Scroll-aware active header icons

What to implement:

- Extend `src/components/Header.jsx:3` with a small `IntersectionObserver` lifecycle that observes `#top` and each app section ID.
- Track only the active section ID in React state; mark matching icon links with `aria-current="location"` and an active class.
- Update the active ID immediately on click and let the observer reconcile it during scrolling.
- Add non-layout-shifting active styles beside `.icon-link` in `src/styles/components.css:66-110`.

Verification:

- Add header tests covering immediate click highlighting, `aria-current`, scroll synchronization, and unchanged 44px hit areas.
- Run full dev and production-preview browser suites.

Anti-pattern guards:

- Do not listen to `scroll` on every frame or update state from `requestAnimationFrame`.
- Do not apply active styling to the About control or remove existing hover/focus styles.

## Phase 3 — Final verification

- Run `npm run build` and `npm run lint`.
- Run `npm run test:e2e -- --reporter=line`.
- Run `npm run test:e2e:prod -- --reporter=line`.
- Run `git diff --check` and inspect the final diff for scope creep.

## Acceptance criteria (from the approved spec)

1. At large desktop resolutions, the complete hero copy and artwork remain visible within the first viewport without clipping.
2. Hero typography and spacing scale down gracefully at shorter desktop heights.
3. Clicking an app icon highlights that icon immediately.
4. Scrolling through the page moves the highlight to the spotlight currently in view.
5. Active styling does not shift header layout or reduce the 44px hit area.
6. Existing reduced-motion, keyboard, mobile, build, lint, and browser checks continue to pass.
