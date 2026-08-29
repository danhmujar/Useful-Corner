# Hero viewport fit and scroll-aware header state

**Date:** 2026-08-29  
**Status:** Approved for implementation

## Purpose

Keep the landing-page hero fully composed across desktop resolutions and make the header clearly communicate which tool spotlight is currently in view.

## Design

### Hero viewport fit

The existing two-column hero composition, typography, palette, artwork, and reveal lifecycle remain unchanged. Responsive CSS will make the hero’s height, internal spacing, headline size, and artwork scale respond to viewport dimensions. `svh` and `clamp()` values will be used so shorter desktop viewports reduce the lockup proportionally while wide/tall viewports retain the editorial scale. The artwork remains clipped only to its own accent container; no hero copy or caption may be cut off in the first viewport. The existing stacked mobile layout remains intact.

### Scroll-aware header icons

The header will track the hero and each spotlight section with `IntersectionObserver`. The currently visible spotlight receives an active state and `aria-current="location"`; the state is removed when the hero or another spotlight becomes active. Clicking an icon updates the active state immediately while the observer keeps it synchronized during scrolling. Active styling uses border/background/color changes without changing dimensions, preserving the 44px hit area and leaving the About control unaffected.

## Accessibility and motion

The active state is exposed semantically with `aria-current`, not color alone. Existing keyboard focus styles, reduced-motion behavior, sticky-header offset, and decorative pointer behavior remain unchanged. Intersection observation is event-driven and does not update React state on every animation frame.

## Verification

The implementation must pass the existing build, lint, accessibility, responsive, reveal, and preview checks, plus focused assertions for hero viewport fit and active navigation state.

## Acceptance Criteria

1. At large desktop resolutions, the complete hero copy and artwork remain visible within the first viewport without clipping.
2. Hero typography and spacing scale down gracefully at shorter desktop heights.
3. Clicking an app icon highlights that icon immediately.
4. Scrolling through the page moves the highlight to the spotlight currently in view.
5. Active styling does not shift header layout or reduce the 44px hit area.
6. Existing reduced-motion, keyboard, mobile, build, lint, and browser checks continue to pass.
