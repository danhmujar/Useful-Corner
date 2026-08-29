# About Corner Tab — Implementation Plan

## Phase 0 — Documentation discovery

Sources consulted:

- `docs/specs/2026-08-29-about-fab-design.md`: approved placement, content scope, interaction, visual direction, and acceptance criteria.
- `src/App.jsx`: page composition point for mounting the new component.
- `src/styles/components.css`: existing ownership for component-level layout, controls, and motion.
- `src/styles/tokens.css`: active palette, typography, spacing, and shadow tokens.
- `src/components/Footer.jsx`: source for the existing Useful Corner description.
- `C:/AI/Project/Calculator/index.html`: About FAB/dialog markup pattern and content structure.
- `C:/AI/Project/Calculator/ui/ui.js`: modal open/close, Escape handling, focus restoration, and scroll locking pattern.
- `C:/AI/Project/Calculator/ui/styles.css`: glass modal/FAB reference; use interaction patterns only, not the rejected circular visual treatment.

Allowed APIs/patterns: native `<button>`, `document.addEventListener('keydown')`, `HTMLElement.focus()`, `document.activeElement`, `aria-hidden`, `aria-modal`, `role="dialog"`, and `inert`. No new dependencies or iframe APIs are needed.

Anti-patterns: do not use inline event handlers, per-frame React state, a circular `?` FAB, hardcoded replacement colors outside tokens, or unsafe HTML injection.

## Phase 1 — Component and content

Implement `src/components/AboutCorner.jsx` with a header tab and modal. Copy the Calculator dialog’s accessible event flow from `Calculator/ui/ui.js` while adapting content to Useful Corner and keeping the existing footer description as the canonical intro copy.

Verification:

- Component renders one tab and one hidden dialog.
- Dialog has a labelled heading, close button, and meaningful Useful Corner content.
- No unsafe HTML or inline handlers are introduced.

## Phase 2 — Shell integration

Mount `AboutCorner` in `src/components/Header.jsx` after the three app icons so it remains available across hero and spotlight sections. Keep it independent from the ambient orb and iframe lifecycle.

Verification:

- App builds with the component mounted once.
- Existing header, hero, spotlight, footer, and orb behavior remain present.

## Phase 3 — Editorial styling and responsive behavior

Add tab and modal rules to `src/styles/components.css`, using existing tokens and the site gutter/safe-area conventions. Implement restrained transform/opacity transitions and a reduced-motion fallback. Ensure the tab has a 44px minimum hit area on mobile.

Verification:

- Tab appears after the app icons in the header on desktop and mobile.
- Modal is readable and usable at narrow widths.
- Hover/focus states are visible and reduced motion disables transitions.

## Phase 4 — Interaction and accessibility verification

Verify open, close, Escape, backdrop click, focus containment/restoration, and body scroll locking in a browser. Check that the tab remains above decorative layers and does not interfere with the cursor orb or spotlight iframes.

Verification:

- All six acceptance criteria in the design spec pass.
- `npm run build` passes.
- `npm run lint` passes.
- `git diff --check` passes.

