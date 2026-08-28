# The Useful Corner — Task List

Status: Historical execution checklist; implementation completed locally
Specification: `docs/specs/2026-08-28-useful-corner-landing-page-design.md`  
Plan: `docs/plans/2026-08-28-useful-corner-landing-page-plan.md`

## Approval gate

- [x] User reviews and approves the design specification.
- [x] User reviews and approves the implementation plan.
- [x] User confirms the full-page orb behavior: persistent behind the hero and all spotlights.
- [x] User authorizes implementation in `C:\AI\Project\Useful-Corner`.

## Project setup

- [x] Request filesystem permission for the target project directory.
- [x] Request network permission for framework dependency installation.
- [x] Confirm the target directory is empty or absent.
- [x] Verify the installed Node.js version satisfies the current Vite requirement.
- [x] Scaffold the official Vite React JavaScript template.
- [x] Install dependencies and preserve one package-manager lockfile.
- [x] Remove all Vite starter content and assets.
- [x] Create the approved source and asset directory structure.
- [x] Copy the three app icons without modifying the mockup originals.

## Content and components

- [x] Create the central app-data array with stable IDs.
- [x] Add the PDF Unlocker URL and approved copy.
- [x] Add the Calculator URL and approved copy.
- [x] Add the Formatter URL and approved copy.
- [x] Build the semantic sticky header.
- [x] Build the hero.
- [x] Build the reusable app spotlight.
- [x] Render the app spotlights from data with stable React keys.
- [x] Build the independent-collection footer.
- [x] Add the skip link and correct heading hierarchy.
- [x] Make all external app actions open safely in new tabs.

## Visual system

- [x] Define color, typography, width, spacing, and motion tokens.
- [x] Use the final Sora, Source Sans 3, DM Sans, and IBM Plex Mono typography system; Source Serif 4 was not retained.
- [x] Load Source Sans 3 explicitly.
- [x] Recreate the approved white/aubergine hero split.
- [x] Recreate the magenta wedge without the removed outlined-square anchor.
- [x] Recreate square app frames with actual project icons.
- [x] Implement alternating desktop spotlight layout.
- [x] Implement stacked tablet/mobile spotlight layout.
- [x] Add visible, theme-consistent keyboard focus styles.
- [x] Make tooltips edge-safe or disable them at constrained widths.
- [x] Keep mobile header controls at least 44×44px.
- [x] Add a 320px-specific typography/header check.

## Full-page ambient orbs

- [x] Build one root-level `AmbientOrbField` component.
- [x] Add six to eight large, softly blurred orb definitions.
- [x] Position the orb field behind the entire page.
- [x] Make hero and spotlight surfaces reveal the same continuous field.
- [x] Add independent slow CSS drift cycles.
- [x] Add one fine-pointer repulsion loop using `requestAnimationFrame`.
- [x] Store frame coordinates in refs rather than React state.
- [x] Use transform-only per-frame updates.
- [x] Ease orbs back after the pointer leaves.
- [x] Disable pointer repulsion for coarse-pointer devices.
- [x] Provide a static composition for reduced-motion users.
- [x] Mark the field decorative and apply `pointer-events: none`.
- [x] Cancel the frame and remove listeners during cleanup.
- [x] Verify orb opacity never compromises text readability.

## Metadata, accessibility, and assets

- [x] Add the approved page title and meta description.
- [x] Add an app-neutral Useful Corner favicon.
- [x] Verify semantic landmarks and sequential headings.
- [x] Verify icon-link accessible names.
- [x] Verify spotlight-image alt text.
- [x] Verify keyboard focus order and visibility.
- [x] Verify sticky-header anchor offsets.
- [x] Verify WCAG AA text and control contrast.
- [x] Use the original Formatter image without additional optimization.
- [x] Confirm core content and links remain usable without JavaScript.

## Build and QA

- [x] Run the production Vite build.
- [x] Start the local production preview from `dist`.
- [ ] Test 2560×1440.
- [ ] Test 1920×1080.
- [ ] Test 1440×900.
- [ ] Test 1366×768.
- [ ] Test 1024×768.
- [ ] Test 768×1024.
- [ ] Test 390×844.
- [ ] Test 320×568.
- [x] Verify zero horizontal overflow at every tested width.
- [x] Verify header icon navigation at desktop and mobile widths.
- [x] Verify all three deployed app URLs.
- [x] Verify fine-pointer repulsion.
- [x] Verify touch/coarse-pointer behavior.
- [x] Verify reduced-motion behavior.
- [x] Verify keyboard-only navigation.
- [x] Verify there are no browser console errors.
- [x] Capture representative desktop, tablet, and mobile screenshots.
- [x] Check every specification acceptance criterion.

## Final review and deployment gate

- [ ] Present the completed local landing page to the user.
- [ ] Apply only user-approved final adjustments.
- [ ] Obtain user approval before deployment.
- [ ] Choose GitHub Pages or Vercel.
- [ ] Configure the selected host from its official documentation.
- [ ] Verify the deployed landing page and all external app links.
