# Useful Corner Five-Pillar Audit

**Date:** 2026-08-29
**Scope:** Current React/Vite landing page and its three embedded app previews
**Overall result:** Post-remediation verification passes, including preview loading and translucent-surface contrast checks

## Verification performed

- `npm audit --omit=dev --audit-level=high` — 0 vulnerabilities
- `npm run build` — passed
- `npm run lint` — passed
- `git diff --check` — passed
- Production bundle: 204.56 kB JavaScript (64.30 kB gzip) and 16.97 kB CSS (4.29 kB gzip)
- Static searches for unsafe HTML injection, dynamic code execution, secrets, API keys, environment exposure, input surfaces, error boundaries, ARIA patterns, and animation lifecycle cleanup
- Automated WCAG contrast calculations for the core text palette and About modal translucent surface

The in-app browser automation connection was unavailable because its local runtime could not start. Live keyboard, screen-reader, and viewport interaction checks remain a manual follow-up and are not represented as completed in this report.

## Executive summary

The pillar sections below record the baseline audit. The final implementation status and re-test results are recorded in **Post-implementation verification**.

| Pillar | Status | Highest finding |
| --- | --- | --- |
| Security | Good | Medium: embedded-app trust boundary and no explicit CSP |
| Performance | Good | Medium: layout reads inside the continuous orb animation loop |
| Reliability | Good | Medium: no automated interaction coverage or top-level error boundary |
| Maintainability | Good | Medium: accumulated CSS overrides and compressed rules |
| Accessibility/UX | Good with follow-up | Medium: modal background is not made inert while open |

No user-input forms, Markdown rendering pipeline, Google GenAI integration, client-side API secrets, Framer Motion dependency, or TypeScript configuration exists in this project. Those originally proposed checks are therefore not applicable.

## 1. Security

### Verified strengths

- No `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `eval`, or `new Function` usage was found.
- The formatter headline contains the literal text `<br>`, but React renders it as text rather than executable HTML.
- No `import.meta.env`, `VITE_*`, API-key, or secret references were found.
- External `target="_blank"` links use `rel="noopener noreferrer"`.
- The project has only React and React DOM as runtime dependencies; the dependency audit reports 0 vulnerabilities.
- There are no user-controlled inputs requiring sanitization in the landing page.

### Findings

**[Medium] Embedded app previews are an explicit trust boundary.** The three cross-origin iframes are intentionally unsandboxed because each deployed application may require browser capabilities. This is consistent with repository guidance, but it means the landing page trusts those deployed origins. Keep URLs centralized in `src/data/apps.js`, validate origin changes during review, and do not add new preview origins casually.

**[Medium] No Content Security Policy is defined.** A CSP would provide defense in depth for scripts, frames, images, and connections. Before deployment, define a policy that explicitly allows the three iframe origins and Google Fonts. Test it against every preview before enforcement.

## 2. Performance

### Verified strengths

- Production output is modest for a React landing page: 63.90 kB JavaScript gzip and 4.37 kB CSS gzip.
- App previews use `loading="lazy"`.
- Hero and spotlight reveals use transforms and opacity.
- Pointer motion avoids React state updates per frame.
- Reduced-motion and coarse-pointer users do not receive cursor-following animation.
- Animation frames, observers, timers, and event listeners are cleaned up on unmount.

### Findings

**[Medium] The ambient animation reads layout every frame.** `AmbientOrbField` calls `getBoundingClientRect()` for every orb during each `requestAnimationFrame`. Mixing repeated layout reads with style writes can become costly on lower-powered devices. Cache orb centers on mount and resize, or derive their centers from known positions and sizes.

**[Low] Live iframes remain the dominant runtime cost.** Lazy loading prevents all previews from loading immediately, but each preview is still a complete external application. Keep lazy loading and avoid eager preloading.

## 3. Reliability

### Verified strengths

- `IntersectionObserver` fallbacks exist for hero and spotlight reveals.
- Observers and timers are disconnected or cleared.
- The About modal restores body overflow and removes its keyboard listener.
- External “Open app” links remain available when a preview is unusable.
- Static app configuration keeps URLs and content in one source.

### Findings

**[Medium] There is no automated browser-level regression coverage.** The most failure-prone behavior—modal focus management, iframe/orb interaction, responsive header layout, and replaying reveals—is currently validated manually. Add a small Playwright suite covering those flows.

**[Low] There is no top-level React error boundary.** A render-time exception would blank the page. A minimal boundary with a direct-tools fallback would improve graceful degradation, although the current component tree is small and low risk.

**[Low] Iframe failure is not explicitly communicated.** The external link is a functional fallback, but the frame itself has no timeout or unavailable state. Consider a lightweight status only if real preview failures become common.

## 4. Maintainability

### Verified strengths

- Components have clear responsibilities.
- App metadata is centralized in `src/data/apps.js`.
- Build and lint commands are documented and pass.
- `AGENTS.md`, the README, specs, and plans describe the current architecture.
- Dependencies and Vite configuration are minimal.

### Findings

**[Medium] Component CSS has accumulated order-dependent overrides.** `src/styles/components.css` contains compressed rule groups and later overrides for previously declared selectors. Consolidate each component’s final rules into one section to reduce specificity and regression risk.

**[Low] No test or type-check script exists.** This is a JavaScript project, so TypeScript strict mode is not a present requirement. If the project stays in JavaScript, add tests rather than migrating solely for audit compliance. JSDoc or runtime prop validation can be added if app metadata becomes dynamic.

## 5. Accessibility and UX

### Verified strengths

- Semantic `header`, `nav`, `main`, `section`, and `footer` elements are present.
- The page has a skip link and sticky-header scroll offset.
- Icon links have accessible names and iframe previews have descriptive titles.
- The About modal has dialog semantics, a labelled heading, Escape handling, a keyboard focus loop, focus restoration, backdrop dismissal, and body scroll locking.
- Interactive controls meet the documented 44px mobile target.
- Reduced-motion preferences disable decorative motion.
- Core text colors meet WCAG AA against white: aubergine 13.64:1, purple 6.88:1, magenta 4.51:1, and secondary gray 7.79:1.

### Findings

**[Medium] Background content is not made inert while the modal is open.** The focus loop handles ordinary Tab navigation, but adding `inert` to the page shell while the portalled dialog is open would more completely isolate background controls for assistive technology and programmatic focus. Do not mark the portalled dialog itself inert.

**[Low] Automated accessibility verification is absent.** Add keyboard assertions and an axe-based scan to the proposed browser suite. Manually verify the 320px header, modal scrolling, focus order, and contrast over translucent backgrounds.

## Recommended action order

1. Add browser-level tests for the About modal, header navigation, and iframe/orb boundary behavior.
2. Make the page shell inert while the About modal is open.
3. Cache ambient orb geometry instead of reading layout every frame.
4. Consolidate component CSS overrides.
5. Add and test a deployment-specific Content Security Policy.
6. Add a minimal error boundary if the landing page gains more dynamic behavior.

## Release assessment

No finding blocks release for the current static landing-page scope. Items 1–4 are the best next investments because they reduce regression risk and improve lower-powered-device and assistive-technology behavior without changing the visual design.

## Post-implementation verification

The recommended remediations were implemented in the working tree and reviewed against commit `be7f96a`.

### Verified implementations

- A top-level error boundary is mounted around the page shell.
- The About modal makes the page shell inert and restores its prior state when closed.
- Ambient orb centers are cached and refreshed on resize instead of reading every orb rectangle on each animation frame.
- A deployment-specific CSP is present.
- Playwright and axe coverage was added for desktop Chromium and a 320px mobile viewport.
- Component CSS was reformatted and consolidated into readable sections.
- `npm run build`, `npm run lint`, `npm audit --omit=dev --audit-level=high`, and `git diff --check` pass.
- The complete Playwright suite passes deterministically: 39 passed, 1 intentionally skipped for coarse pointers, with `npm run test:e2e`.
- `npm run test:e2e:prod` passes the same 39 checks against the built production preview, with 1 intentional coarse-pointer skip.

### Remediation status

**[Resolved] CSS visual regression.** Benefit and About-list markers are restored to `✦`; the LinkedIn credit is bold again and its arrow motion is preserved.

**[Resolved] Parallel test flakiness.** Playwright is configured with one worker so `npm run test:e2e` is deterministic; the full run now passes with one intentional coarse-pointer skip.

**[Resolved] Orb regression coverage.** The test now verifies hidden opacity over an iframe, reappearance at a current pointer coordinate, no `-1000px` jump, and page-exit hiding.

**[Resolved] CSP preview compatibility.** Browser coverage now scrolls each lazy preview into view and confirms that every configured origin loads as a child frame under the active policy. The dedicated `npm run test:e2e:prod` command repeats this against the built production preview; a final hosted-site smoke check is still recommended after publishing.

**[Resolved] Contrast verification.** Hex parsing works, core palette ratios are tested correctly, and the visible About modal text is checked against its composited translucent surface.

**[Resolved] Animation-aware accessibility timing.** The axe page scan waits for the intentional hero reveal to settle before measuring contrast, preventing false failures from sampling intermediate opacity values.

**[Resolved] Error fallback metadata.** The fallback now maps the canonical `apps` data source.

**[Resolved] Generated test output.** `playwright-report/` and `test-results/` are now ignored.

**[Resolved] Documentation synchronization.** The README and agent guide document `npm run test:e2e`, and this report distinguishes resolved and remaining work.

### Verification conclusion

The core implementations pass deterministic browser verification. After deployment, repeat the preview smoke check against the hosted URL to catch hosting-specific CSP or remote-frame behavior.
