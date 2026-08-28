# Live Showcase Preview Implementation Plan

Source specification: `docs/specs/2026-08-28-live-showcase-preview-design.md`

## Phase 0 — Documentation discovery and allowed APIs

Sources consulted:

- [MDN iframe element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)
- [WHATWG iframe embedding](https://html.spec.whatwg.org/dev/iframe-embed-object.html)
- [MDN X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options)
- [MDN Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy)
- Existing `src/data/apps.js`, `src/components/AppSpotlight.jsx`, and `src/styles/components.css`

Allowed patterns:

- Use `src={app.href}`, a descriptive `title`, `loading="lazy"`, and `referrerPolicy="strict-origin-when-cross-origin"` on the iframe.
- Use a CSS-defined responsive frame height; cross-origin iframe content cannot be inspected or auto-resized by the parent page.
- Retain the outbound `Open app` anchor as the reliable fallback.

Anti-pattern guards:

- Do not add `sandbox` without verified capabilities: it can break third-party application scripts and storage.
- Do not add `allow` permission-policy tokens without a known requirement.
- Do not rely on iframe `error` or `load` events for framing-block detection.
- Do not use deprecated `frameBorder` or `scrolling` attributes.

## Phase 1 — Typography and reference assets

1. Copy the three original mockup assets into `public/app-icons`.
2. Extend `tokens.css` to explicitly request Sora, Source Sans 3, and IBM Plex Mono.
3. Assign Sora to display headings and navigation, Source Sans 3 to body copy, and IBM Plex Mono to the app labels.

Verification:

- Confirm each local image resolves from `/app-icons`.
- Confirm the three font-family declarations exist in the compiled CSS.
- Preserve all existing purple tokens.

## Phase 2 — Live preview cards

1. In `AppSpotlight.jsx`, render an iframe inside `.app-frame` from the existing `app.href` record.
2. Apply the documented iframe attributes and preserve the external `Open app` link.
3. In `components.css`, make the preview fill its existing frame, hide card overflow, and retain the responsive layout.
4. Keep a visually recognizable icon loading/fallback layer behind the iframe without affecting iframe interaction.

Verification:

- Each iframe source matches its corresponding deployed URL.
- Each iframe has a descriptive title and lazy loading.
- The preview has no border, card clipping, or horizontal overflow at narrow widths.
- The external action still has `_blank` and `noopener noreferrer`.

## Phase 3 — Production verification

1. Run `npm run build` and `npm run lint`.
2. Inspect the preview page in desktop and mobile screenshots.
3. Check the three iframe responses and external fallback links.

Verification:

- Acceptance criteria 1–8 from the source specification pass.
- Build and lint report no errors.
