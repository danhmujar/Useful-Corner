# Live Showcase Preview Revision

Status: Approved for implementation
Date: 2026-08-28
Source: User-approved refinement of the Useful Corner landing page.

## Purpose

Keep the implemented purple color theme while bringing the typography and app visuals closer to the approved mockup. Replace the static app-icon visual area with live, embedded previews of the three deployed tools.

## Scope

- Retain the current palette, page structure, app copy, direct `Open app` links, accessibility landmarks, and ambient-orb behavior.
- Load the mockup's typography trio explicitly: Sora for display headings, Source Sans 3 for body text, and IBM Plex Mono for app labels.
- Use the original PDF Unlocker, Calculator, and Formatter image assets copied from the reference mockup.
- Render every spotlight visual as a responsive, lazy-loaded iframe using the app's deployed URL.
- Keep an accessible external `Open app` link beneath every preview as an escape hatch for browser or host framing restrictions.

## Interaction and error behavior

- Iframes must have a specific `title`, `loading="lazy"`, and a restrictive sandbox that allows the hosted utilities' normal scripts, forms, downloads, and pop-up actions.
- The iframe is only a preview surface. The existing external action remains the reliable full-app route.
- If a host later rejects framing, the surrounding spotlight copy, icon, and external action remain readable and usable.
- Do not nest or duplicate iframes, make iframe content the only route to an app, or replace external links with JavaScript click handlers.

## Responsive behavior

- Desktop preview cards use the existing two-column spotlight arrangement with a stable visual ratio.
- Tablet and phone layouts place the preview card above the copy.
- Previews retain a visible border and enough height for useful interaction without producing horizontal overflow.

## Acceptance Criteria

1. The existing purple color theme remains the visual foundation of the landing page.
2. Sora, Source Sans 3, and IBM Plex Mono are explicitly requested and assigned to their intended text roles.
3. All three spotlight visuals use the original reference icons as their frame/loading identity.
4. Each spotlight contains a live, lazy-loaded iframe pointed at its deployed application URL.
5. Every iframe has a descriptive title and does not affect the existing keyboard access to the `Open app` external link.
6. Each external `Open app` action continues to open its deployed tool in a new tab with `noopener noreferrer`.
7. The showcase has no horizontal overflow at 320px, 390px, tablet, or desktop widths.
8. The production build and lint checks complete without errors.
