# Hero Parallax Motion Plan

Source specification: `docs/specs/2026-08-29-hero-parallax-design.md`

## Phase 0 — Documentation discovery

Sources consulted:

- [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- [MDN matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [React useEffect cleanup](https://react.dev/reference/react/useEffect#my-effect-runs-twice-when-the-component-mounts)
- Existing `src/components/Hero.jsx` and `src/styles/components.css`

Allowed APIs and patterns:

- Use `useRef` and a client-only `useEffect` to retain DOM element references and frame IDs.
- Schedule one-shot visual updates with `requestAnimationFrame` and cancel the pending ID in cleanup.
- Use `window.matchMedia(...).matches` and the MediaQueryList `change` event for motion preference and compact layout changes.
- Register a passive `scroll` listener, use transform-only DOM updates, and restore modified transforms in cleanup.

Anti-pattern guards:

- Do not update React state during scroll.
- Do not transform hero copy or iframe previews.
- Do not use scroll-time `top`, `left`, scaling, rotation, or opacity updates.
- Do not retain event listeners, animation frames, or inline transforms after unmount.

## Phase 1 — Hero structure and parallax behavior

1. Remove the `.hero-square` markup and its CSS rule from `Hero.jsx` and `components.css`.
2. Add refs for the existing hero artwork, wedge, and caption layers in `Hero.jsx`.
3. Copy the documented effect lifecycle: schedule a single frame from passive scroll/resize/media handlers, clamp scroll travel, and update only the decorative transforms.
4. Reset and skip the effect for reduced-motion and compact layouts.

Verification:

- The outlined square no longer exists in source or rendered hero.
- One frame ID is pending at most once per input batch.
- Cleanup removes listeners, cancels the ID, and clears transforms.

## Phase 2 — Motion styling and verification

1. Add `will-change: transform` only to the animated hero layers.
2. Add reduced-motion and compact-layout CSS guards.
3. Run the production build and lint.
4. Verify the hero is subtly layered during desktop scrolling while all user-facing content remains still.

Verification:

- Acceptance criteria 1–6 in the source specification pass.
- Build and lint complete with no errors.
