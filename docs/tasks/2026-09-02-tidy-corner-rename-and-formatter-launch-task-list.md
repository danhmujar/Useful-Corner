# The Tidy Corner rename and deferred formatter launch — task list

**Status:** Release 1 planned; Release 2 deferred  
**Specification:** `docs/specs/2026-09-02-tidy-corner-rename-and-formatter-launch-design.md`  
**Plan:** `docs/plans/2026-09-02-tidy-corner-rename-and-formatter-launch-plan.md`

## Approval and release gates

- [x] User approved the design and acceptance criteria.
- [x] Approved specification was written and committed.
- [ ] User reviews this implementation plan and task list.
- [ ] User explicitly authorizes Release 1 implementation.
- [ ] User approves the verified Release 1 candidate for repository rename and deployment.

## Release 1 — Branch safety

- [ ] Fetch `origin` and record the current status, graph, and `git cherry` relationship to `origin/main`.
- [ ] Confirm there are no unrelated working-tree edits.
- [ ] Create and verify a backup ref for the pre-cutover branch.
- [ ] Confirm the cached patch-equivalent formatter commit relationship still holds after fetch.
- [ ] Reconcile the branch onto current `origin/main` without duplicating or discarding commits.
- [ ] Confirm the responsive layout, specification, plan, and task-list commits each remain present once.

## Release 1 — Public and technical rename

- [ ] Change the package name to `tidy-corner` in `package.json`.
- [ ] Change both root package identities to `tidy-corner` in `package-lock.json` without updating dependencies.
- [ ] Change only the production Vite base path to `/Tidy-Corner/`.
- [ ] Rename the document-title brand prefix to The Tidy Corner.
- [ ] Rename the noscript heading to The Tidy Corner while keeping the formatter coming soon.
- [ ] Rename the visible and accessible header brand to The Tidy Corner.
- [ ] Rename the footer title to The Tidy Corner.
- [ ] Rename the favicon accessible label without redesigning the asset.
- [ ] Preserve generic descriptive uses of “useful.”
- [ ] Keep `status: 'coming-soon'` on the formatter record.
- [ ] Keep two-live/one-upcoming copy unchanged during Release 1.

## Release 1 — Tests and active documentation

- [ ] Update the header brand assertion to The Tidy Corner.
- [ ] Add focused assertions for the page-title prefix and footer brand.
- [ ] Confirm existing data-driven tests still prove the formatter has no iframe or Open app link.
- [ ] Update the README product name, repository URL, and `/Tidy-Corner/` base path.
- [ ] Update the active project identity in `AGENTS.md`.
- [ ] Add the implementation plan and task list to `docs/INDEX.md`.
- [ ] Keep dated pre-rename documents and filenames unchanged.
- [ ] Audit remaining old-name and old-path matches and classify every retained result as historical or migration documentation.

## Release 1 — Local verification

- [ ] Run `npm run build`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run test:e2e -- --reporter=line`.
- [ ] Run `npm run test:e2e:prod -- --reporter=line`.
- [ ] Run `git diff --check`.
- [ ] Inspect `dist/index.html` for `/Tidy-Corner/` asset paths.
- [ ] Confirm the preview-mode tests still serve from `/`.
- [ ] Confirm both live previews load under the CSP.
- [ ] Confirm the formatter remains Coming soon.
- [ ] Confirm the formatter/footer same-viewport and mobile readable-flow checks remain passing.
- [ ] Review the final Release 1 diff for scope creep.

## Release 1 — Repository and Pages cutover

- [ ] Obtain user approval for the verified cutover candidate.
- [ ] Rename the GitHub repository to `Tidy-Corner` in repository Settings.
- [ ] Change local `origin` to `https://github.com/danhmujar/Tidy-Corner.git` only after the rename succeeds.
- [ ] Verify the new remote with `git remote -v` and `git ls-remote --exit-code origin HEAD`.
- [ ] Integrate the verified branch into `main` without discarding history.
- [ ] Push `main` to trigger the existing GitHub Pages workflow.
- [ ] Confirm the workflow deploys the intended Release 1 commit.
- [ ] Open `https://danhmujar.github.io/Tidy-Corner/` in a clean browser session.
- [ ] Verify direct entry and header/hash navigation.
- [ ] Verify scripts, styles, favicon, and app icons resolve from `/Tidy-Corner/`.
- [ ] Verify PDF Unlocker and Calculator previews and Open app links.
- [ ] Verify the formatter still has no live preview or Open app link.
- [ ] Verify the About dialog, keyboard flow, and browser console.
- [ ] Record the old `/Useful-Corner/` result without requiring a redirect.

## Release 1 — Local workspace rename

- [ ] Close Codex, Vite, Playwright, editor terminals, and other handles on the workspace.
- [ ] From `C:\AI\Project`, rename `Useful-Corner` to `Tidy-Corner` with PowerShell `Rename-Item -LiteralPath`.
- [ ] Reopen the workspace from `C:\AI\Project\Tidy-Corner`.
- [ ] Verify the reopened worktree status and renamed remote.
- [ ] Mark Release 1 complete only after all applicable acceptance criteria pass.

## HARD STOP — Release 2 prerequisites

- [ ] Text & Markdown Formatter is publicly released at the approved production URL.
- [ ] Direct production use of the formatter succeeds.
- [ ] Actual iframe embedding from a Tidy Corner candidate succeeds.
- [ ] The formatter URL, icon, name, copy, and benefits are confirmed current.
- [ ] The user explicitly authorizes Release 2.

Do not check or execute any item below until every prerequisite above is complete.

## Release 2 — Activate the formatter

- [ ] Start from the current renamed Tidy Corner codebase, not an older page revision.
- [ ] Remove only `status: 'coming-soon'` from the formatter app record.
- [ ] Keep the formatter last in the app array.
- [ ] Confirm the existing header path displays the real formatter icon.
- [ ] Confirm the existing spotlight path displays the identity image and lazy iframe.
- [ ] Confirm the existing spotlight path displays the safe Open app link.
- [ ] Confirm ErrorBoundary displays the formatter fallback link.
- [ ] Keep reusable coming-soon component and CSS support for future tools.

## Release 2 — Update availability copy and tests

- [ ] Replace the hero's “coming next” phrase with a formatter cleanup action.
- [ ] Update the About introduction to describe three available tools.
- [ ] Remove the formatter's `(coming soon)` About label.
- [ ] Update the meta description to identify all three available tools.
- [ ] Turn the formatter noscript item into a safe link and remove “coming soon.”
- [ ] Update the README to describe three available tools and previews.
- [ ] Add an explicit formatter-live spotlight assertion.
- [ ] Add an explicit real formatter header-icon assertion.
- [ ] Assert the formatter origin is specifically present in `frame-src`.
- [ ] Assert the About dialog describes all three tools as available.
- [ ] Preserve the existing formatter anchor/footer regression tests.

## Release 2 — Local and deployed verification

- [ ] Run `npm run build`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run test:e2e -- --reporter=line`.
- [ ] Run `npm run test:e2e:prod -- --reporter=line`.
- [ ] Run `git diff --check`.
- [ ] Verify all three previews load under the CSP without console errors.
- [ ] Verify formatter click and direct-hash navigation on desktop and laptop viewports.
- [ ] Verify the compact final spotlight and visible footer remain unchanged.
- [ ] Verify short mobile viewports retain readable flow without clipping or overlap.
- [ ] Verify slow or failed formatter loading does not move or overlay the footer.
- [ ] Review the diff for old-layout restoration or unrelated changes.
- [ ] Obtain user approval for Release 2 deployment.
- [ ] Merge/push Release 2 to `main` and wait for the Pages workflow.
- [ ] Smoke-test all three deployed previews, icons, links, copy, anchors, and accessibility behavior.
- [ ] Mark Release 2 complete only after acceptance criteria 10-14 pass.

## Final acceptance audit

- [ ] AC 1 — Public brand surfaces identify the site as The Tidy Corner.
- [ ] AC 2 — Generic descriptive uses of “useful” remain intact.
- [ ] AC 3 — Package manifest and lockfile use `tidy-corner`.
- [ ] AC 4 — Repository, remote, and safe local workspace rename are complete.
- [ ] AC 5 — `/Tidy-Corner/` and its deployed assets load successfully.
- [ ] AC 6 — Release 1 retained the formatter Coming soon state.
- [ ] AC 7 — Release 1 preserved responsive layout and behavior.
- [ ] AC 8 — Active and historical documentation are correctly distinguished.
- [ ] AC 9 — No old Pages redirect is required.
- [ ] AC 10 — Release 2 waited for public release and explicit authorization.
- [ ] AC 11 — Release 2 used the existing app-data path without restoring old layout.
- [ ] AC 12 — Release 2 exposes the formatter icon, preview, link, and three-tool copy.
- [ ] AC 13 — Release 2 preserves the compact closing composition and footer behavior.
- [ ] AC 14 — Each release passed the complete verification suite before deployment.
