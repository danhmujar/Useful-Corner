# The Useful Corner — Task List

Status: Draft for user review; no implementation started  
Specification: `docs/specs/2026-08-28-useful-corner-landing-page-design.md`  
Plan: `docs/plans/2026-08-28-useful-corner-landing-page-plan.md`

## Approval gate

- [ ] User reviews and approves the design specification.
- [ ] User reviews and approves the implementation plan.
- [ ] User confirms the full-page orb behavior: persistent behind the hero and all spotlights.
- [ ] User authorizes implementation in `C:\AI\Project\Useful-Corner`.

## Project setup

- [ ] Request filesystem permission for the target project directory.
- [ ] Request network permission for framework dependency installation.
- [ ] Confirm the target directory is empty or absent.
- [ ] Verify the installed Node.js version satisfies the current Vite requirement.
- [ ] Scaffold the official Vite React JavaScript template.
- [ ] Install dependencies and preserve one package-manager lockfile.
- [ ] Remove all Vite starter content and assets.
- [ ] Create the approved source and asset directory structure.
- [ ] Copy the three app icons without modifying the mockup originals.

## Content and components

- [ ] Create the central app-data array with stable IDs.
- [ ] Add the PDF Unlocker URL and approved copy.
- [ ] Add the Calculator URL and approved copy.
- [ ] Add the Formatter URL and approved copy.
- [ ] Build the semantic sticky header.
- [ ] Build the hero.
- [ ] Build the reusable app spotlight.
- [ ] Render the app spotlights from data with stable React keys.
- [ ] Build the independent-collection footer.
- [ ] Add the skip link and correct heading hierarchy.
- [ ] Make all external app actions open safely in new tabs.

## Visual system

- [ ] Define color, typography, width, spacing, and motion tokens.
- [ ] Load Source Serif 4 explicitly.
- [ ] Load Source Sans 3 explicitly.
- [ ] Recreate the approved white/aubergine hero split.
- [ ] Recreate the magenta wedge and outlined-square anchor.
- [ ] Recreate square app frames with actual project icons.
- [ ] Implement alternating desktop spotlight layout.
- [ ] Implement stacked tablet/mobile spotlight layout.
- [ ] Add visible, theme-consistent keyboard focus styles.
- [ ] Make tooltips edge-safe or disable them at constrained widths.
- [ ] Keep mobile header controls at least 44×44px.
- [ ] Add a 320px-specific typography/header check.

## Full-page ambient orbs

- [ ] Build one root-level `AmbientOrbField` component.
- [ ] Add six to eight large, softly blurred orb definitions.
- [ ] Position the orb field behind the entire page.
- [ ] Make hero and spotlight surfaces reveal the same continuous field.
- [ ] Add independent slow CSS drift cycles.
- [ ] Add one fine-pointer repulsion loop using `requestAnimationFrame`.
- [ ] Store frame coordinates in refs rather than React state.
- [ ] Use transform-only per-frame updates.
- [ ] Ease orbs back after the pointer leaves.
- [ ] Disable pointer repulsion for coarse-pointer devices.
- [ ] Provide a static composition for reduced-motion users.
- [ ] Mark the field decorative and apply `pointer-events: none`.
- [ ] Cancel the frame and remove listeners during cleanup.
- [ ] Verify orb opacity never compromises text readability.

## Metadata, accessibility, and assets

- [ ] Add the approved page title and meta description.
- [ ] Add an app-neutral Useful Corner favicon.
- [ ] Verify semantic landmarks and sequential headings.
- [ ] Verify icon-link accessible names.
- [ ] Verify spotlight-image alt text.
- [ ] Verify keyboard focus order and visibility.
- [ ] Verify sticky-header anchor offsets.
- [ ] Verify WCAG AA text and control contrast.
- [ ] Compare and, if appropriate, optimize the Formatter image.
- [ ] Confirm core content and links remain usable without JavaScript.

## Build and QA

- [ ] Run the production Vite build.
- [ ] Start the local production preview from `dist`.
- [ ] Test 2560×1440.
- [ ] Test 1920×1080.
- [ ] Test 1440×900.
- [ ] Test 1366×768.
- [ ] Test 1024×768.
- [ ] Test 768×1024.
- [ ] Test 390×844.
- [ ] Test 320×568.
- [ ] Verify zero horizontal overflow at every tested width.
- [ ] Verify header icon navigation at desktop and mobile widths.
- [ ] Verify all three deployed app URLs.
- [ ] Verify fine-pointer repulsion.
- [ ] Verify touch/coarse-pointer behavior.
- [ ] Verify reduced-motion behavior.
- [ ] Verify keyboard-only navigation.
- [ ] Verify there are no browser console errors.
- [ ] Capture representative desktop, tablet, and mobile screenshots.
- [ ] Check every specification acceptance criterion.

## Final review and deployment gate

- [ ] Present the completed local landing page to the user.
- [ ] Apply only user-approved final adjustments.
- [ ] Obtain user approval before deployment.
- [ ] Choose GitHub Pages or Vercel.
- [ ] Configure the selected host from its official documentation.
- [ ] Verify the deployed landing page and all external app links.

