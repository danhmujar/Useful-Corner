# Formatter closing viewport and footer anchor design

## Status

Approved for local implementation on 2026-09-01. This change remains uncommitted until the user explicitly requests a commit or push.

## Context

The landing page has three independently deployed tool spotlights followed by a separate site footer. Every spotlight currently uses a full-viewport composition. That works for the first two tools, but the formatter is the final destination: when a visitor clicks the formatter question-mark icon or opens `#formatter` directly, the footer should also be visibly present in the same viewport.

## Goal

Make the formatter a deliberate closing composition without changing the existing sticky-header anchor offset, iframe behavior, coming-soon treatment, or semantic footer landmark.

## Design

1. Recognize the final app spotlight through the existing app-map order and stable `showcase` child structure. The closing behavior applies to the last spotlight only, not to the app's status or visual accent.
2. Keep the first two spotlights at their current full-viewport scale and alternating desktop arrangement.
3. Give only the formatter spotlight a compact, viewport-aware vertical budget. Its preview, copy, and action remain intact, but its padding and preview cap are reduced enough to reserve a visible portion of the viewport for the footer.
4. Keep the footer as a separate `<footer>` after `<main>`. The footer must follow the formatter in normal document flow; it must not be fixed, absolutely positioned, or layered over the formatter content.
5. Keep the existing anchor behavior: the formatter section begins directly below the sticky header after click navigation and direct hash loading.
6. On short mobile viewports where the full formatter content and footer cannot physically fit together at readable sizes, preserve readable content and let the footer continue immediately below the formatter rather than clipping or overlaying content.

## Architecture and data flow

- `src/App.jsx` continues rendering the existing app map in stable order.
- `src/components/AppSpotlight.jsx` retains the existing app ID and accessibility structure.
- `src/styles/components.css` owns the final-child spotlight sizing, responsive spacing, and preview cap; the shared header offset remains in `src/styles/global.css`.
- `src/components/Footer.jsx` remains unchanged unless verification identifies a necessary responsive sizing issue.

## Failure and accessibility behavior

- A failed or slow preview must not change the formatter/footer positioning because the layout is based on the frame box, not iframe load state.
- The footer remains keyboard reachable in normal DOM order.
- No overlay or fixed footer may cover focus targets, text, or the preview.
- Reduced-motion behavior and the existing 44px header hit areas remain unchanged.

## Verification

- Click the formatter header icon and verify the formatter starts directly below the sticky header.
- Verify the footer intersects the same viewport at desktop and laptop/125% equivalent viewports, without overlapping the formatter.
- Verify direct `/#formatter` loading produces the same result after React renders.
- Verify the first two spotlights remain full-height and their existing layout tests still pass.
- Verify mobile layouts remain readable and the footer follows immediately after the formatter when the viewport is too short to show everything at once.
- Run `npm run test:e2e`, `npm run build`, `npm run lint`, and `git diff --check`.

## Acceptance Criteria

1. Clicking the formatter question-mark icon positions the formatter spotlight directly below the sticky header.
2. At supported desktop and laptop viewports, the formatter spotlight and a visible portion of the footer appear in the same viewport after anchor navigation.
3. Direct navigation to `/#formatter` produces the same anchored result after the page renders.
4. The footer remains a separate semantic footer in normal document flow and never overlays formatter content.
5. The first two spotlights retain their existing full-viewport behavior and alternating layout.
6. Short mobile viewports do not clip or cover formatter content; the footer follows immediately after the formatter when simultaneous visibility is not physically possible.
7. Existing build, lint, accessibility, and spotlight regression checks remain passing.
