# The Tidy Corner rename and deferred formatter launch — implementation plan

**Status:** Release 1 planned; Release 2 deferred behind an explicit launch gate  
**Specification:** `docs/specs/2026-09-02-tidy-corner-rename-and-formatter-launch-design.md`  
**Task list:** `docs/tasks/2026-09-02-tidy-corner-rename-and-formatter-launch-task-list.md`  
**Date:** 2026-09-02

## Release boundary

This plan contains two releases that must not be combined:

- **Release 1 — rename:** Rename the current two-live-tools/one-coming-soon landing page to The Tidy Corner and move its canonical repository and Pages path to `Tidy-Corner`.
- **Release 2 — formatter launch:** Perform only after Text & Markdown Formatter is publicly released, iframe embedding is verified, and the user explicitly authorizes its landing-page launch.

Completing Release 1 is not authorization to begin Release 2.

## Phase 0 — Documentation discovery and allowed patterns

### Sources consulted

- Approved requirements and acceptance criteria: `docs/specs/2026-09-02-tidy-corner-rename-and-formatter-launch-design.md:1-123`.
- Active app registry: `src/data/apps.js:1-5`.
- Availability-driven header, spotlight, and fallback behavior: `src/components/Header.jsx:3-35`, `src/components/AppSpotlight.jsx:3-57`, and `src/components/ErrorBoundary.jsx:1-37`.
- Brand and availability copy: `index.html:1-18`, `src/components/Hero.jsx:1-60`, `src/components/AboutCorner.jsx:1-58`, `src/components/Footer.jsx:1`, and `public/favicon.svg:1`.
- Structural closing layout: `src/App.jsx:32-44`, `src/styles/tokens.css:1-3`, `src/styles/global.css:1-9`, and `src/styles/components.css:287-342,536-550,1057-1080,1139-1160`.
- Existing browser assertions: `tests/header.spec.js:1-192`, `tests/spotlight.spec.js:1-234`, `tests/about.spec.js:1-90`, and `tests/accessibility.spec.js:1-143`.
- Local and production browser configuration: `playwright.config.js:1-30`, `playwright.production.config.js:1-16`, and `package.json:6-14`.
- Package and deployment configuration: `package.json:1-29`, `package-lock.json:1-23`, `vite.config.js:1-8`, and `.github/workflows/deploy-pages.yml:1-50`.
- Active operational documentation: `README.md:1-59`, `AGENTS.md:1-53`, and `docs/INDEX.md:1-26`.
- Formatter closing-layout decision: `docs/specs/2026-09-01-formatter-footer-anchor-design.md:1-46`.
- Official GitHub repository rename behavior: [Renaming a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository).
- Official Pages project URL behavior: [What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
- Official remote update procedure: [Managing remote repositories](https://docs.github.com/en/get-started/git-basics/managing-remote-repositories).
- Official Pages workflow patterns: [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) and [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

### Allowed APIs and repository patterns

- Keep Vite's existing `defineConfig(({ command, mode }) => ...)` function and change only the production `base` literal in `vite.config.js:5-7`.
- Keep the `apps` array as the only availability registry. `status: 'coming-soon'` remains in Release 1 and is removed in Release 2; do not add another flag.
- Reuse the existing live-app rendering path in `Header.jsx:34`, `AppSpotlight.jsx:56`, and `ErrorBoundary.jsx:26`.
- Preserve iframe `loading="lazy"`, `referrerPolicy="strict-origin-when-cross-origin"`, and external-link `target="_blank" rel="noopener noreferrer"` attributes from `AppSpotlight.jsx:56`.
- Preserve the final-child layout selectors rather than adding formatter- or status-specific layout rules.
- Extend existing Playwright `getByRole`, `locator`, `expect`, and data-driven app-loop patterns; do not introduce another test framework.
- Keep the existing Pages workflow identifiers: `branches: [main]`, environment `github-pages`, artifact path `./dist`, and deployment step `id: deployment`.
- Use GitHub's documented repository Settings rename flow and `git remote set-url origin NEW_URL` for the cutover.

### Known repository state to preserve

- The current working branch is `codex/launch-two-live-tools`.
- Commit `3605864` contains the responsive spotlight centering work.
- Commit `d4e1232` contains the approved rename/launch specification.
- Commit `2c66a22` is patch-equivalent to `origin/main` commit `e5b8792`; re-check this after fetching before rebasing or merging.
- The local `origin` currently points to `https://github.com/danhmujar/Useful-Corner.git`.

### Phase 0 anti-pattern guards

- Do not globally replace the word `Useful`; generic descriptive uses remain valid.
- Do not rewrite or rename dated historical specifications, plans, audits, and task records.
- Do not remove the formatter's coming-soon status or change two-live/one-upcoming copy during Release 1.
- Do not alter layout CSS, palette, typography, motion, footer structure, CSP, or iframe policies for the rename.
- Do not create a legacy redirect repository or assume GitHub Pages redirects project URLs.
- Do not restore, revert, or cherry-pick the obsolete three-live-app page for Release 2.

## Phase 1 — Protect and reconcile the implementation branch

### What to implement

1. Fetch `origin`, then record `git status --short --branch`, `git log --graph --decorate --oneline --all -12`, and `git cherry -v origin/main HEAD`.
2. Confirm the working tree contains no unrelated edits and preserve every unpushed planning/layout commit with a backup ref such as `backup/tidy-corner-pre-cutover`.
3. Confirm `2c66a22` remains patch-equivalent to the current `origin/main` before using it as a rebase boundary.
4. If the inspected topology still matches Phase 0, copy the clean-history pattern `git rebase --onto origin/main 2c66a22 codex/launch-two-live-tools` so only the responsive-layout, specification, plan, and task-list commits replay over current `origin/main`.
5. If the topology differs, stop and derive a new non-destructive integration command from the observed commits. Never use `git reset --hard` or discard user work.

### Documentation references

- Repository snapshot and deployment ordering: approved specification lines 72-83.
- Branch preservation rule: repository `AGENTS.md` and Phase 0 state above.

### Verification checklist

- [ ] The backup ref resolves to the pre-integration HEAD.
- [ ] `git status --short` is clean after reconciliation.
- [ ] `git log` contains the responsive layout, approved spec, implementation plan, and task list exactly once.
- [ ] The branch is based on the current `origin/main` and contains no duplicate patch-equivalent formatter-preparation commit.
- [ ] Acceptance criterion 4 remains achievable: “The canonical GitHub repository is named `Tidy-Corner`, the local `origin` points to it, and the local workspace directory is renamed when safe to do so.”

### Anti-pattern guards

- Do not rebase from stale remote refs.
- Do not delete the backup ref during the release.
- Do not force-push or modify `main` in this phase.
- Do not use destructive reset/checkout commands to resolve divergence.

## Phase 2 — Implement and test Release 1 identity changes

### What to implement

1. Copy the existing root package identity pattern and replace only:
   - `package.json:2` with `"name": "tidy-corner"`.
   - `package-lock.json:2` and `package-lock.json:8` with `"name": "tidy-corner"`.
2. Copy the existing mode-aware base expression from `vite.config.js:6` and change only its production result to `/Tidy-Corner/`; keep local serve and preview at `/`.
3. Update brand-specific surfaces:
   - `index.html:12,16`: The Tidy Corner in the title prefix and noscript heading.
   - `src/components/Header.jsx:34`: visible brand and accessible back-to-top label.
   - `src/components/Footer.jsx:1`: footer title.
   - `public/favicon.svg:1`: SVG accessible label only; preserve its artwork.
4. Preserve the generic phrases in `index.html:6,12,16`, `Hero.jsx:59`, and `AboutCorner.jsx:49` because they describe useful things rather than naming the old site.
5. Update `tests/header.spec.js:21-24` to locate The Tidy Corner. Add focused checks for the page title and footer brand beside the existing header-brand test so current brand surfaces are regression-tested.
6. Update active documentation:
   - `README.md:1,3,39-46`: product name, repository Pages URL, and Vite base path.
   - `AGENTS.md:1,5`: active guide and project identity.
   - `docs/INDEX.md`: link this plan and task list and continue labeling older materials as pre-rename history.
7. Run a targeted repository search and classify each remaining `Useful Corner`, `useful-corner`, and `/Useful-Corner/` result. Keep only approved migration text and dated history.
8. Explicitly verify that `src/data/apps.js:4` still contains `status: 'coming-soon'` and that Release 1 copy still says two tools are available with another on the way.

### Documentation references

- Release 1 scope: approved specification lines 33-44 and 56-68.
- Vite base pattern: `vite.config.js:5-7`.
- Existing brand test pattern: `tests/header.spec.js:21-24`.
- Current formatter guards: `tests/header.spec.js:32-43` and `tests/spotlight.spec.js:9-37`.
- Historical-document policy: `docs/INDEX.md:7-26` and approved specification lines 66-68.

### Verification checklist

- [ ] The brand test finds The Tidy Corner in the header and footer and the document title starts with The Tidy Corner.
- [ ] Static inspection confirms the noscript heading and favicon label use The Tidy Corner.
- [ ] Package manifest and lockfile contain `tidy-corner` in all root identity fields.
- [ ] `vite.config.js` retains `/` for serve/preview and returns `/Tidy-Corner/` for the production build.
- [ ] The formatter still renders a question mark, teaser, and disabled Coming soon control with no iframe or Open app link.
- [ ] No CSS or component-layout changes appear in the Release 1 diff.
- [ ] Remaining old-name matches are limited to the approved migration specification or dated historical records.
- [ ] Acceptance criterion 1: “The public site identifies itself as “The Tidy Corner” in the header, footer, page title, noscript fallback, favicon accessible label, and other brand-specific surfaces.”
- [ ] Acceptance criterion 2: “Generic descriptive uses of “useful” remain unchanged when they do not name the site.”
- [ ] Acceptance criterion 3: “The npm package identity is `tidy-corner` in both `package.json` and `package-lock.json`.”
- [ ] Acceptance criterion 5: “The production Vite base path is `/Tidy-Corner/`, and the deployed site loads its scripts, styles, favicon, and app icons successfully from that path.”
- [ ] Acceptance criterion 6: “Release 1 keeps Text & Markdown Formatter in its existing “Coming soon” state with no live iframe or active “Open app” link.”
- [ ] Acceptance criterion 7: “Release 1 preserves the current responsive layout, compact final spotlight, footer visibility, sticky-header offsets, motion behavior, accessibility behavior, and two existing live previews.”
- [ ] Acceptance criterion 8: “Active documentation describes The Tidy Corner and the new repository/deployment path, while dated pre-rename documents remain identifiable as historical records.”
- [ ] Acceptance criterion 9: “The old `/Useful-Corner/` Pages address is not required to redirect after the clean cutover.”

### Anti-pattern guards

- Do not change the formatter record, URL, icon, status, or availability copy.
- Do not change `AboutCorner.jsx` merely because its heading contains the generic word “Useful.”
- Do not edit stylesheet/layout files unless verification reveals an independent regression and the user approves that scope expansion.
- Do not regenerate the entire lockfile or update dependencies for a package-name-only change.
- Do not rename dated documentation files or replace old names inside historical records.

## Phase 3 — Verify the complete Release 1 candidate locally

### What to implement

No new product behavior is added in this phase. Run the repository's established verification commands from the reconciled Release 1 branch:

1. `npm run build`
2. `npm run lint`
3. `npm run test:e2e -- --reporter=line`
4. `npm run test:e2e:prod -- --reporter=line`
5. `git diff --check`

Inspect built `dist/index.html` to confirm production scripts, styles, and favicon URLs use the `/Tidy-Corner/` base while the production-preview suite still serves at `/`. Review the complete diff for scope creep and rerun the targeted old-name audit.

### Documentation references

- Required project commands: `AGENTS.md:9-16` and `package.json:6-14`.
- Browser server configuration: `playwright.config.js:12-29` and `playwright.production.config.js:4-15`.
- Existing responsive/footer protection: `tests/header.spec.js:78-192` and `tests/spotlight.spec.js:39-234`.

### Verification checklist

- [ ] Build and lint exit successfully.
- [ ] Development and production-preview Playwright suites pass.
- [ ] Axe, keyboard, responsive, anchor, iframe, CSP, and footer checks remain passing.
- [ ] The production bundle contains the new base path and no unintended old base path.
- [ ] The final diff contains only Release 1 identity, tests, and active-documentation changes.
- [ ] Acceptance criterion 5 is verified locally: “The production Vite base path is `/Tidy-Corner/`, and the deployed site loads its scripts, styles, favicon, and app icons successfully from that path.”
- [ ] Acceptance criterion 6 is verified locally: “Release 1 keeps Text & Markdown Formatter in its existing “Coming soon” state with no live iframe or active “Open app” link.”
- [ ] Acceptance criterion 7 is verified locally: “Release 1 preserves the current responsive layout, compact final spotlight, footer visibility, sticky-header offsets, motion behavior, accessibility behavior, and two existing live previews.”
- [ ] Acceptance criterion 14 is verified locally: “Each release passes build, lint, browser, accessibility, production-preview, and whitespace validation before deployment.”

### Anti-pattern guards

- Do not waive a failing check because the change is “only a rename.”
- Do not modify production code to accommodate a stale local preview server; stop the server and rerun the configured suite.
- Do not treat a successful local root preview as proof that `/Tidy-Corner/` works on Pages; inspect the built paths and complete Phase 4.

## Phase 4 — Rename the canonical repository and deploy Release 1

### What to implement

1. After the local candidate passes and the user approves deployment, rename the GitHub repository through **Settings → Repository Name → `Tidy-Corner` → Rename**, following GitHub's official procedure.
2. Update the local remote only after the GitHub rename succeeds:

   ```powershell
   git remote set-url origin https://github.com/danhmujar/Tidy-Corner.git
   git remote -v
   git ls-remote --exit-code origin HEAD
   ```

3. Integrate the verified Release 1 branch into `main` without discarding history, then push `main`. The repository rename alone does not trigger the workflow; the push to `main` does.
4. Confirm the existing `.github/workflows/deploy-pages.yml` run succeeds. Use its `steps.deployment.outputs.page_url` result as the first authoritative deployed URL.
5. Smoke-test `https://danhmujar.github.io/Tidy-Corner/`:
   - direct entry returns successfully at the expected final URL;
   - JS, CSS, favicon, and all app icons resolve;
   - header and direct-hash navigation work;
   - PDF Unlocker and Calculator iframes load;
   - formatter remains Coming soon with no live iframe/action;
   - About dialog and keyboard behavior work;
   - no CSP or asset-path errors appear in the browser console.
6. Record the result of visiting the obsolete `/Useful-Corner/` path without treating a 404 as a Release 1 failure.

### Documentation references

- Repository rename and Pages URL exception: GitHub's [Renaming a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository).
- Project-site URL format: GitHub's [What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
- Remote update: GitHub's [Managing remote repositories](https://docs.github.com/en/get-started/git-basics/managing-remote-repositories).
- Existing deployment workflow: `.github/workflows/deploy-pages.yml:1-50`.
- Approved deployment order: specification lines 70-83.

### Verification checklist

- [ ] GitHub shows the canonical repository as `danhmujar/Tidy-Corner`.
- [ ] Local `origin` fetch and push URLs both use `https://github.com/danhmujar/Tidy-Corner.git`.
- [ ] The Pages workflow deployed the intended Release 1 commit from `main`.
- [ ] The new Pages URL and all base-path assets work in a clean browser session.
- [ ] Both live previews and every core interaction pass the deployed smoke test.
- [ ] The formatter remains unavailable on the deployed Release 1 site.
- [ ] Acceptance criterion 4 is partially verified: “The canonical GitHub repository is named `Tidy-Corner`, the local `origin` points to it, and the local workspace directory is renamed when safe to do so.”
- [ ] Acceptance criterion 5: “The production Vite base path is `/Tidy-Corner/`, and the deployed site loads its scripts, styles, favicon, and app icons successfully from that path.”
- [ ] Acceptance criterion 9: “The old `/Useful-Corner/` Pages address is not required to redirect after the clean cutover.”
- [ ] Acceptance criterion 14: “Each release passes build, lint, browser, accessibility, production-preview, and whitespace validation before deployment.”

### Anti-pattern guards

- Do not rename the GitHub repository before the local candidate is green.
- Do not update `origin` before GitHub confirms the rename.
- Do not assume the repository rename triggers a Pages deployment.
- Do not add a redirect repository or reuse `Useful-Corner` as another project.
- Do not silently change Pages workflow permissions, environment, artifact path, or action versions.

## Phase 5 — Rename and reopen the local workspace

### What to implement

After the deployed Release 1 site passes and all processes using the workspace are closed, rename the directory from its parent:

```powershell
Rename-Item -LiteralPath 'C:\AI\Project\Useful-Corner' -NewName 'Tidy-Corner'
Test-Path -LiteralPath 'C:\AI\Project\Tidy-Corner'
```

Reopen Codex/editor/terminal tooling at `C:\AI\Project\Tidy-Corner`, then run `git status --short --branch` and `git remote -v` from the reopened workspace.

### Documentation references

- Approved local rename sequence: specification lines 72-81.
- Windows safety rule: use one PowerShell process, literal validated paths, and run from the parent directory.

### Verification checklist

- [ ] The old workspace path is no longer the active checkout path.
- [ ] The new `C:\AI\Project\Tidy-Corner` directory exists and contains the expected repository.
- [ ] The reopened worktree is clean and points to the renamed origin.
- [ ] Acceptance criterion 4 is fully verified: “The canonical GitHub repository is named `Tidy-Corner`, the local `origin` points to it, and the local workspace directory is renamed when safe to do so.”

### Anti-pattern guards

- Do not rename the workspace while Codex, Vite, Playwright, editor terminals, or other processes still hold it open.
- Do not use recursive move/delete commands or unresolved environment variables.
- Do not combine the filesystem rename with source edits or the GitHub cutover.

## HARD STOP — Release 2 authorization gate

Do not execute any phase below until all three conditions are recorded as satisfied:

1. Text & Markdown Formatter is publicly released at `https://text-markdown-formatter.vercel.app/` or the user approves a replacement production URL.
2. The production app permits iframe embedding from The Tidy Corner.
3. The user explicitly authorizes Release 2.

Verification at this gate must quote acceptance criterion 10: “Release 2 is not implemented or deployed until the formatter is publicly released and the user explicitly authorizes its landing-page launch.”

## Phase 6 — Validate the formatter release candidate

### What to implement

1. Open the configured formatter URL directly and verify that it is the final public release.
2. Inspect its effective framing behavior and test an actual iframe navigation from a local Tidy Corner candidate; parent CSP presence alone is not proof of embeddability.
3. Confirm the current formatter record's URL, icon, name, copy, and benefits in `src/data/apps.js:4` remain accurate.
4. Confirm the formatter remains the last entry in the ordered `apps` array so the structural closing layout still applies.
5. Record explicit user authorization before editing availability state.

### Documentation references

- Release prerequisites: approved specification lines 46-54.
- Existing CSP: `index.html:8-10`.
- Frame-load verification pattern: `tests/spotlight.spec.js:201-229`.
- Final-child architecture: `src/App.jsx:37-43` and `src/styles/components.css:291-342`.

### Verification checklist

- [ ] The public formatter URL loads successfully and is the intended release.
- [ ] The formatter can navigate inside an iframe without `X-Frame-Options`, `frame-ancestors`, or parent-CSP blocking.
- [ ] The formatter record and icon asset are production-ready.
- [ ] Explicit user authorization for Release 2 is recorded.
- [ ] Acceptance criterion 10: “Release 2 is not implemented or deployed until the formatter is publicly released and the user explicitly authorizes its landing-page launch.”

### Anti-pattern guards

- Do not infer iframe compatibility from a successful direct navigation.
- Do not change the parent CSP or add iframe sandbox/permission policies without validating the formatter's requirements.
- Do not begin activation while any gate remains uncertain.

## Phase 7 — Activate the formatter through the existing data path

### What to implement

1. In `src/data/apps.js:4`, remove only `status: 'coming-soon'`. Keep the formatter last in the array and retain its ID, URL, icon, accent, copy, and benefits unless the released app requires an explicitly approved correction.
2. Reuse the existing live paths without formatter-specific branches:
   - real header icon from `Header.jsx:34`;
   - identity image, lazy iframe, and safe Open app link from `AppSpotlight.jsx:56`;
   - live fallback link from `ErrorBoundary.jsx:26`.
3. Update launch-sensitive copy while retaining the established voice:
   - `Hero.jsx:59`: replace “peek at what’s coming next” with a formatter cleanup action.
   - `AboutCorner.jsx:50`: describe three independent browser tools with no “another on the way” clause.
   - `AboutCorner.jsx:52`: remove the formatter's `(coming soon)` label.
   - `index.html:6`: identify PDF Unlocker, Calculator, and Text & Markdown Formatter as available.
   - `index.html:16`: make the formatter a safe direct link and remove “coming soon.”
   - `README.md:3,9`: describe three available tools and three live previews.
4. Extend tests so the launch gate cannot be hidden by data-driven branching:
   - add an explicit formatter-live assertion beside `tests/spotlight.spec.js:9-37`;
   - assert the formatter header uses its real image beside `tests/header.spec.js:32-43`;
   - assert the formatter origin is specifically allowed by `frame-src` beside `tests/spotlight.spec.js:201-207`;
   - assert three-tool About copy beside `tests/about.spec.js:29-30`;
   - preserve all footer/anchor checks at `tests/header.spec.js:114-172`.

### Documentation references

- Single-source activation design: approved specification lines 56-64.
- Existing live renderer: `src/components/AppSpotlight.jsx:56`.
- Existing status-driven tests: `tests/header.spec.js:32-43` and `tests/spotlight.spec.js:9-37`.
- Formatter/footer design: `docs/specs/2026-09-01-formatter-footer-anchor-design.md:15-46`.

### Verification checklist

- [ ] No second availability flag or formatter-specific renderer is introduced.
- [ ] The header displays `app-icons/formatter.png`, not the question mark.
- [ ] The formatter spotlight displays a lazy iframe and safe Open app link with no teaser, badge, or disabled control.
- [ ] ErrorBoundary exposes the formatter's live fallback link.
- [ ] Hero, About, metadata, noscript, and README consistently describe three available tools.
- [ ] The formatter remains the last spotlight and the footer remains a separate normal-flow landmark.
- [ ] Acceptance criterion 11: “The Release 2 checklist activates the formatter through the existing app-data availability path without reverting or restoring an older landing-page layout.”
- [ ] Acceptance criterion 12: “After Release 2, the formatter displays its real icon, lazy-loaded live preview, and external “Open app” link; launch-sensitive copy describes three available tools.”
- [ ] Acceptance criterion 13: “Release 2 preserves the formatter’s compact closing composition and same-viewport footer behavior.”

### Anti-pattern guards

- Do not add a second status or launch flag.
- Do not delete reusable coming-soon component/CSS support.
- Do not key the closing layout to the formatter ID, status, or aubergine accent.
- Do not reorder the apps, move/fix/overlay the footer, or alter the final-child sizing rules.
- Do not remove lazy loading, referrer policy, or external-link safety attributes.

## Phase 8 — Verify and deploy Release 2

### What to implement

1. Run the full command sequence from Phase 3.
2. Confirm the formatter participates in the actual frame-load/CSP test that previously skipped coming-soon apps.
3. Test formatter click navigation and direct `/#formatter` entry at desktop, laptop, and the readable mobile fallback.
4. Inspect slow/failure iframe behavior to confirm the frame box, compact closing composition, and footer position do not depend on load success.
5. Review the diff to confirm this is a forward change from current Tidy Corner and contains no old-layout restoration.
6. After user deployment approval, merge/push Release 2 to `main`, wait for the Pages workflow, and repeat the deployed smoke test with all three previews.

### Documentation references

- Full repository checks: `AGENTS.md:9-16`.
- Frame/CSP tests: `tests/spotlight.spec.js:201-229`.
- Anchor/footer tests: `tests/header.spec.js:114-172`.
- Release 2 verification requirement: approved specification lines 85-106.

### Verification checklist

- [ ] Build, lint, development browser, production browser, accessibility, and whitespace checks pass.
- [ ] All three configured iframes load under the active CSP without console blocking errors.
- [ ] Formatter click and direct-hash navigation preserve the closing layout and footer behavior.
- [ ] Short mobile viewports retain readable normal flow without clipping or overlap.
- [ ] The deployed site exposes three working icons, previews, and Open app links.
- [ ] Acceptance criterion 10: “Release 2 is not implemented or deployed until the formatter is publicly released and the user explicitly authorizes its landing-page launch.”
- [ ] Acceptance criterion 11: “The Release 2 checklist activates the formatter through the existing app-data availability path without reverting or restoring an older landing-page layout.”
- [ ] Acceptance criterion 12: “After Release 2, the formatter displays its real icon, lazy-loaded live preview, and external “Open app” link; launch-sensitive copy describes three available tools.”
- [ ] Acceptance criterion 13: “Release 2 preserves the formatter’s compact closing composition and same-viewport footer behavior.”
- [ ] Acceptance criterion 14: “Each release passes build, lint, browser, accessibility, production-preview, and whitespace validation before deployment.”

### Anti-pattern guards

- Do not deploy Release 2 based only on the generic data-driven test passing.
- Do not accept a direct-link-only formatter if the approved live preview is blocked.
- Do not fix an embed failure by weakening security without reviewing the released app's documented requirements.

## Final acceptance audit

Before closing either release, quote and mark the applicable approved criteria. After Release 2, all criteria must be true:

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
