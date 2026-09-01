# The Tidy Corner rename and deferred formatter launch design

## Status

Approved by the user on 2026-09-02. This specification defines two separate releases. Release 1 renames the existing landing page while retaining its two-live-tools/one-coming-soon state. Release 2 remains deferred until Text & Markdown Formatter is publicly released and the user explicitly authorizes its landing-page launch.

## Context

The current landing page is deployed as The Useful Corner from the `Useful-Corner` repository and GitHub Pages project path. Its current layout contains live PDF Unlocker and Calculator previews plus a coming-soon Text & Markdown Formatter spotlight. The formatter is the compact final spotlight and intentionally shares its destination viewport with a visible portion of the footer.

The landing page has changed substantially since its original three-app design. The formatter must therefore be launched through a forward change to the current implementation rather than by reverting, restoring, or cherry-picking an older page version.

GitHub documents that repository renames redirect repository traffic but do not redirect GitHub Pages project-site URLs. Because the site has no users yet, this migration uses one canonical repository and accepts a clean Pages URL cutover without a legacy redirect repository. See [Renaming a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository).

## Goals

1. Rename the public product from The Useful Corner to The Tidy Corner.
2. Rename the technical identity and canonical deployment from `Useful-Corner` to `Tidy-Corner`.
3. Preserve the current layout, behavior, and formatter coming-soon treatment during Release 1.
4. Record a safe, manual Release 2 path that launches the formatter only after its public release and explicit user authorization.
5. Preserve historical documentation without presenting the old name as current guidance.

## Non-goals

- Release 1 does not launch the formatter or expose its iframe and external action.
- Release 1 does not redesign the page, change its palette or typography, or alter spotlight sizing and motion.
- The migration does not preserve or redirect the old `/Useful-Corner/` GitHub Pages project URL.
- The migration does not rewrite dated specifications, plans, audits, or task history to pretend they were authored under the new name.
- Release 2 does not restore an older layout or remove the reusable coming-soon capability from the components.

## Release structure

### Release 1: rename

Release 1 renames the current page while the formatter remains unavailable.

- Rename the GitHub repository to `Tidy-Corner`.
- Change the npm package identity to `tidy-corner` in both package manifest and lockfile.
- Change the production Vite base path to `/Tidy-Corner/`.
- Update the local Git remote after the GitHub repository rename.
- Rename public brand surfaces in the header, footer, document metadata, noscript fallback, favicon accessibility label, tests, README, and active contributor guidance.
- Retain generic descriptive uses of “useful” where the word does not name the product.
- Identify dated documents as pre-rename history through the documentation index rather than rewriting their content and filenames.
- Rename the local workspace directory after active tools and processes no longer depend on its current path.

### Release 2: formatter launch

Release 2 is a separate, deferred release. Its prerequisites are:

1. Text & Markdown Formatter is publicly released at its configured production URL.
2. The production app is suitable for iframe embedding from the landing page.
3. The user explicitly authorizes the landing-page launch.

When those prerequisites are met, Release 2 advances the current Tidy Corner codebase rather than reverting to an earlier landing page. It activates the formatter through the app data, updates all launch-sensitive copy and tests, and preserves the compact final spotlight and footer composition.

## Architecture and data flow

`src/data/apps.js` remains the single source of truth for availability. During Release 1, the formatter retains `status: 'coming-soon'`. `Header.jsx`, `AppSpotlight.jsx`, and `ErrorBoundary.jsx` continue deriving their states from this data. No second availability flag is introduced.

During Release 2, removing the formatter's coming-soon status selects the existing available-app rendering path. That path renders the configured icon, lazy-loaded iframe preview, and safe external “Open app” link. The existing coming-soon component path remains available for future tools.

Brand-specific strings are updated during Release 1. Generic marketing language that uses “useful” descriptively may remain. Copy that describes tool availability stays in its two-live/one-upcoming form during Release 1 and changes to three available tools only during Release 2.

The stylesheet architecture and component layout remain unchanged for the rename. In particular, the final-child spotlight rules continue controlling the formatter's compact closing composition independently of its availability status.

## Documentation policy

The root README, `AGENTS.md`, current source, current tests, package metadata, and this specification describe the active Tidy Corner implementation. Dated specifications, plans, audits, and task records remain historical artifacts under their existing paths. `docs/INDEX.md` must make the pre-rename status of those documents clear when the old name could otherwise appear current.

## Deployment sequence

Release 1 uses the following ordered cutover:

1. Preserve the current branch and its existing unpushed commit.
2. Apply and verify the brand, package, test, and base-path changes locally.
3. Rename the GitHub repository to `Tidy-Corner`.
4. Update the local `origin` remote to the new repository URL.
5. Merge or push the verified Release 1 changes to `main`.
6. Confirm that the existing GitHub Pages workflow publishes at `/Tidy-Corner/`.
7. Smoke-test direct loading, assets, hash navigation, app icons, and iframe previews on the deployed site.
8. Rename the local workspace directory separately after active tooling is closed or reconfigured.

If deployment fails, correct the repository settings, workflow, or `/Tidy-Corner/` base path. Do not restore an older landing-page layout as a deployment workaround.

## Failure and compatibility behavior

- The old `/Useful-Corner/` Pages path may return 404 after the repository rename; this is an accepted result of the clean cutover.
- Repository renaming and local remote changes are manual external steps and must be verified rather than assumed.
- Release 1 keeps the formatter unavailable even though its production URL is already present in app data.
- Release 2 must verify that the formatter preview loads under the active Content Security Policy before deployment.
- Slow or failed iframe loading must not change spotlight or footer positioning.
- Existing error-boundary links continue following each app's availability state.

## Verification strategy

For Release 1:

- Run `npm run build`.
- Run `npm run lint`.
- Run `npm run test:e2e`.
- Run `npm run test:e2e:prod`.
- Run `git diff --check`.
- Search for `Useful Corner`, `useful-corner`, and `/Useful-Corner/` and classify each remaining result as intentional pre-rename history or an error.
- Smoke-test the deployed `/Tidy-Corner/` page, including direct entry, local assets, header anchors, both live previews, formatter coming-soon state, and the About dialog.

For Release 2, repeat the same local and deployed checks while additionally verifying the formatter icon, iframe, external link, Content Security Policy, three-tool copy, compact final spotlight, and footer visibility.

## Acceptance Criteria

1. The public site identifies itself as “The Tidy Corner” in the header, footer, page title, noscript fallback, favicon accessible label, and other brand-specific surfaces.
2. Generic descriptive uses of “useful” remain unchanged when they do not name the site.
3. The npm package identity is `tidy-corner` in both `package.json` and `package-lock.json`.
4. The canonical GitHub repository is named `Tidy-Corner`, the local `origin` points to it, and the local workspace directory is renamed when safe to do so.
5. The production Vite base path is `/Tidy-Corner/`, and the deployed site loads its scripts, styles, favicon, and app icons successfully from that path.
6. Release 1 keeps Text & Markdown Formatter in its existing “Coming soon” state with no live iframe or active “Open app” link.
7. Release 1 preserves the current responsive layout, compact final spotlight, footer visibility, sticky-header offsets, motion behavior, accessibility behavior, and two existing live previews.
8. Active documentation describes The Tidy Corner and the new repository/deployment path, while dated pre-rename documents remain identifiable as historical records.
9. The old `/Useful-Corner/` Pages address is not required to redirect after the clean cutover.
10. Release 2 is not implemented or deployed until the formatter is publicly released and the user explicitly authorizes its landing-page launch.
11. The Release 2 checklist activates the formatter through the existing app-data availability path without reverting or restoring an older landing-page layout.
12. After Release 2, the formatter displays its real icon, lazy-loaded live preview, and external “Open app” link; launch-sensitive copy describes three available tools.
13. Release 2 preserves the formatter’s compact closing composition and same-viewport footer behavior.
14. Each release passes build, lint, browser, accessibility, production-preview, and whitespace validation before deployment.
