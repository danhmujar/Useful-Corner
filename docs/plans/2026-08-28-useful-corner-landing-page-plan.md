# The Useful Corner — Implementation Plan

Status: Historical implementation plan; completed locally
Date: 2026-08-28  
Source specification: `docs/specs/2026-08-28-useful-corner-landing-page-design.md`

## Phase 0 — Documentation discovery and allowed APIs

### Sources consulted

- Existing approved mockup: `outputs/useful-corner-mockup.html`
- Existing icons: `outputs/assets/pdf-unlocker.svg`, `outputs/assets/calculator.png`, and `outputs/assets/formatter.png`
- [Vite Getting Started](https://vite.dev/guide/)
- [Vite Static Deployment](https://vite.dev/guide/static-deploy.html)
- [React Quick Start](https://react.dev/learn)
- [React Rendering Lists](https://react.dev/learn/rendering-lists)
- [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)

### Confirmed APIs and patterns

- Scaffold using Vite's supported React template and retain the standard `dev`, `build`, and `preview` scripts.
- Confirm Node.js satisfies Vite's documented minimum before scaffolding.
- Create React function components at module top level.
- Store app records in an array and render spotlights with `map()`, using the stable app ID as `key`.
- Use `window.requestAnimationFrame(callback)` for synchronized visual updates and `window.cancelAnimationFrame(id)` during cleanup.
- Use `window.matchMedia('(prefers-reduced-motion: reduce)')` and a coarse/fine pointer query to select the correct motion behavior.
- Use normal browser `pointermove` and `mouseleave` listeners, registered and removed in the same effect lifecycle.
- Use Vite's `vite build` output in `dist` and `vite preview` only for local production-preview testing.

### Anti-patterns to avoid

- Do not use Create React App, class components, or randomly generated React keys.
- Do not update React state on every animation frame.
- Do not start multiple animation loops or leave listeners active after unmount.
- Do not use canvas, WebGL, a particle library, or a UI component framework for the orb effect.
- Do not use `vite preview` as a production server.
- Do not guess a GitHub Pages `base` value before the repository URL is chosen.

### Phase 0 verification

- [ ] Re-open the official documentation immediately before implementation if installed major versions differ from the sources above.
- [ ] Record the installed Node, React, and Vite versions.
- [ ] Confirm the chosen package manager and lockfile before adding dependencies.

## Phase 1 — Create the React/Vite project shell

### What to implement

1. Request write permission for `C:\AI\Project\Useful-Corner` and network permission for dependency installation.
2. Confirm the target directory is empty or absent; never initialize over unrelated files.
3. Scaffold the official Vite React JavaScript template in the target directory.
4. Install dependencies using the selected package manager and preserve its lockfile.
5. Remove starter demo content while retaining the standard Vite entry points and scripts.
6. Add the planned `components`, `data`, `styles`, and `public/app-icons` directories.
7. Copy the three reviewed icon assets into the project; do not move or delete the mockup assets.

### Documentation references

- Vite Getting Started: React template, project root behavior, and standard scripts.
- Design specification sections 4 and 5.

### Verification checklist

- [ ] `npm run dev` or the selected package-manager equivalent starts without errors.
- [ ] The starter route renders through `src/main.jsx` and `src/App.jsx`.
- [ ] The three icon files resolve locally.
- [ ] No starter logos or placeholder copy remain.

### Anti-pattern guards

- Do not add routing, state management, Tailwind, shadcn, animation packages, or other speculative dependencies.
- Do not write outside the approved project directory.
- Do not configure deployment during scaffolding.

## Phase 2 — Build the semantic content architecture

### What to implement

1. Create `src/data/apps.js` with the exact three app records from the specification.
2. Create top-level function components: `Header`, `Hero`, `AppSpotlight`, and `Footer`.
3. Render the three `AppSpotlight` instances from `apps.map(...)` with stable IDs as keys.
4. Implement semantic landmarks, one `h1`, sequential `h2` elements, the skip link, accessible icon navigation, benefit lists, and external app actions.
5. Add safe external-link attributes and the correct deployed URLs.

### Documentation references

- React Quick Start: function components and event/attribute syntax.
- React Rendering Lists: `map()` and stable keys.
- Design specification sections 5, 6, and 10.

### Verification checklist

- [ ] DOM order matches hero → unlocker → calculator → formatter → footer.
- [ ] Every header link resolves to an existing section ID.
- [ ] Every `Open app` link has the exact specified URL, `_blank`, and `noopener noreferrer`.
- [ ] The accessibility tree exposes meaningful link names and correct heading levels.

### Anti-pattern guards

- Do not duplicate app copy or URLs across multiple components.
- Do not use clickable `div` elements.
- Do not use index values or generated values as React keys.

## Phase 3 — Implement the visual system and responsive layout

### What to implement

1. Define the approved color, type, spacing, width, and motion tokens in `tokens.css`.
2. Load `Source Serif 4` and `Source Sans 3` explicitly and use the documented fallbacks.
3. Rebuild the approved sticky header, split hero, sharp editorial geometry, app frames, alternating desktop spotlight arrangement, and footer.
4. Add responsive stacking, narrow-phone typography, minimum 44×44px icon controls, and edge-safe tooltips.
5. Consolidate styles into the planned CSS files with one clear cascade order.

### Documentation references

- Existing mockup visual reference: `outputs/useful-corner-mockup.html`.
- Design specification sections 7 and 9.

### Verification checklist

- [ ] At 1440px, hero and spotlights visually match the approved composition.
- [ ] At 768px, spotlight content stacks without overlap.
- [ ] At 390px and 320px, the header remains readable and controls remain at least 44×44px.
- [ ] Computed document scroll width never exceeds client width.
- [ ] Tooltips stay inside the viewport or are disabled at constrained widths.
- [ ] Both required font families appear in the loaded font set.

### Anti-pattern guards

- Do not append a second theme override that silently cancels earlier mobile rules.
- Do not mask layout defects with `overflow-x: hidden` or `clip`.
- Do not use the WTW logo or reproduce an affiliation statement.

## Phase 4 — Implement the continuous ambient orb field

### What to implement

1. Create one `AmbientOrbField` component mounted once at the application root.
2. Render six to eight stable decorative orb elements from a fixed configuration array.
3. Position the field fixed behind the entire page and make hero/spotlight surfaces appropriately translucent.
4. Add independent slow drift through CSS animation.
5. In a React effect, register fine-pointer movement, compute distance-based repulsion, and update orb transforms through element refs within one `requestAnimationFrame` loop.
6. Cancel the frame and remove listeners during effect cleanup.
7. Skip the interactive loop on coarse pointers and when reduced motion is requested.
8. Make the field `aria-hidden`, non-focusable, and `pointer-events: none`.

### Documentation references

- MDN requestAnimationFrame: frame scheduling and returned request ID.
- MDN prefers-reduced-motion: reduced-motion media query behavior.
- Design specification section 8.

### Verification checklist

- [ ] Orbs remain visible behind the hero and each of the three spotlight sections while scrolling.
- [ ] Moving a fine pointer within the influence radius produces smooth movement away from the pointer.
- [ ] Orbs ease back instead of snapping when the pointer leaves.
- [ ] Touch-sized viewport testing shows ambient drift without pointer simulation.
- [ ] Reduced-motion emulation produces a static composition.
- [ ] Clicking, selecting text, scrolling, and using links behave identically with the orb layer present.
- [ ] Browser logs contain no animation or cleanup errors after navigation and reload.

### Anti-pattern guards

- Do not mount a separate field inside each section.
- Do not use React state for per-frame coordinates.
- Do not use layout-triggering `top` or `left` changes per frame; update transforms.
- Do not create motion that follows the pointer or obscures text; the specified behavior is repulsion.

## Phase 5 — Accessibility, metadata, and asset polish

### What to implement

1. Apply the approved title and description in `index.html`.
2. Add a simple favicon derived from the Useful Corner mark or one approved app-neutral asset.
3. Verify alt text, ARIA labels, landmark structure, focus order, focus visibility, and anchor offsets.
4. Optimize the Formatter image if it remains substantially larger than its rendered need, comparing the result visually before replacement.
5. Confirm all content remains usable with JavaScript disabled except decorative repulsion.

### Documentation references

- Vite Getting Started: `index.html` as the application entry and asset processing.
- Design specification sections 10–12.

### Verification checklist

- [ ] Page title and description match the specification.
- [ ] Keyboard-only navigation reaches skip link, header icons, and each app action in a logical order.
- [ ] Focus indicators remain visible on white, gray, and aubergine surfaces.
- [ ] Decorative orb elements are absent from the accessibility tree.
- [ ] App names remain available when images are disabled.

### Anti-pattern guards

- Do not rely on tooltip text as the only accessible name.
- Do not remove focus outlines without an accessible replacement.
- Do not use an app-specific logo as the umbrella site's identity.

## Phase 6 — Production build and responsive verification

### What to implement

1. Run the production build using the standard Vite build script.
2. Run the standard local production preview against `dist`.
3. Test the complete viewport matrix defined in the specification.
4. Exercise header anchors, all three external links without leaving the landing page tab, reduced motion, fine-pointer repulsion, touch behavior, and keyboard navigation.
5. Collect console errors, layout measurements, and representative screenshots.
6. Fix only evidence-backed defects, rerun the relevant check, and finish with a clean build.

### Documentation references

- Vite Static Deployment: `vite build`, `dist`, and `vite preview`.
- Design specification sections 13 and 14.

### Verification checklist

- [ ] Acceptance criteria 1–14 all pass.
- [ ] `npm run build` completes without errors.
- [ ] The production preview loads all local assets.
- [ ] No tested viewport has horizontal overflow, collision, clipped focus, or unreadable orb overlap.
- [ ] Browser console contains no errors or warnings caused by the site.
- [ ] Final screenshots cover desktop, tablet portrait, and mobile.

### Anti-pattern guards

- Do not treat a successful development server as proof of a successful production build.
- Do not deploy `vite preview`.
- Do not declare responsive completion without testing 320px and at least one ultrawide size.

## Phase 7 — Review and optional deployment

This phase begins only after the user reviews the completed local landing page.

1. Present the local final build and responsive screenshots.
2. Incorporate user-approved final visual adjustments.
3. Ask the user to choose GitHub Pages or Vercel.
4. For GitHub Pages, configure `base` only after the repository path is known and follow Vite's documented Actions flow.
5. For Vercel, connect or import the repository using Vite auto-detection.
6. Verify the deployed URL and all three external app links.

No deployment is authorized by this plan alone.

## Acceptance criteria carried from the specification

The following criteria are the implementation contract and must be verified verbatim during Phase 6:

1. The project runs locally through Vite.
2. The three header icons navigate to their corresponding spotlights.
3. Every `Open app` button opens the correct deployed application in a new tab.
4. The layout has no horizontal overflow or overlapping content from 320px to 2560px.
5. The header remains readable and usable at 320px.
6. Typography loads correctly without unintended fallbacks.
7. Keyboard navigation, focus visibility, semantic headings, and reduced-motion support work correctly.
8. The page uses no WTW logo or affiliation claim.
9. The production build completes without errors.
10. The finished page is visually verified on desktop, tablet, and mobile.
11. One continuous ambient orb layer remains visibly present behind the hero and all three app spotlights.
12. Orbs repel smoothly on fine-pointer devices, drift without pointer input, remain non-interactive on touch, and become static when reduced motion is requested.
13. The orb layer never blocks interaction or materially reduces content readability.
14. No demo, iframe, or separate tool-launcher section appears in the final page.
