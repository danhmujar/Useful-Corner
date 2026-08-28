# Hero Parallax Motion Pass

Status: Approved for implementation
Date: 2026-08-29

## Purpose

Add a subtle editorial sense of depth to the existing hero without changing the approved purple color system or disturbing the interactive app previews.

## Scope

- Remove the non-interactive outlined square from the hero artwork.
- Apply scroll-driven parallax only to the decorative right-side hero artwork, its magenta wedge, and its caption.
- Keep the hero copy, header, app showcase, and live preview iframes stationary.
- Limit motion to fine-pointer desktop/tablet layouts. Touch-sized layouts and `prefers-reduced-motion: reduce` use the existing static composition.
- Use transform-only updates inside one `requestAnimationFrame` loop, with passive scroll listeners and effect cleanup.

## Motion design

- The right hero artwork shifts by no more than 12px over the hero's scroll range.
- The wedge and caption shift by no more than 20px, in the same direction but at slightly different rates.
- Motion must be quiet and continuous, with no scaling, rotation, opacity changes, or movement of readable hero copy.

## Acceptance Criteria

1. The outlined square is absent from the hero.
2. On eligible desktop/fine-pointer devices, the hero artwork produces a subtle scroll-depth effect.
3. The hero copy, header, spotlight content, and iframe previews do not move as part of the effect.
4. Reduced-motion and narrow/touch layouts remain static.
5. The effect uses transform-only visual updates, one animation frame at a time, and removes listeners and frames on unmount.
6. Build and lint checks complete without errors.
