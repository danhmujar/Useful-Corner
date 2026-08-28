# Useful Corner Agent Guide

## Purpose

This repository contains the Useful Corner React/Vite landing page. It is a navigation surface for three independently deployed tools, not the tools themselves.

## Commands

- `npm run dev` starts the Vite development server.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview -- --host 127.0.0.1` serves the production bundle locally.
- `npm run lint` runs Oxlint.

Run `npm run build` and `npm run lint` after source or styling changes.

## Architecture

- `src/App.jsx` composes the page shell, ambient field, header, hero, spotlights, and footer.
- `src/data/apps.js` is the single source for app IDs, URLs, copy, accent themes, and icons.
- `src/components/Header.jsx` renders the icon navigation and hover tooltips.
- `src/components/Hero.jsx` owns hero copy/art markup and its intersection-triggered reveal lifecycle.
- `src/components/AppSpotlight.jsx` owns reusable live-preview sections and per-section reveal timing.
- `src/components/AmbientOrbField.jsx` owns drifting background orbs and the cursor-following light.
- `src/styles/tokens.css` defines palette, typography, spacing, and shared variables.
- `src/styles/global.css` defines page-level layering and ambient field styles.
- `src/styles/components.css` defines header, hero, spotlight, footer, and reveal styles.

## Design conventions

- Preserve the aubergine, purple, and magenta palette unless the user explicitly requests a visual change.
- Keep Sora for display headings/brand, Source Sans 3 for body text, DM Sans for supporting UI copy, and IBM Plex Mono for labels.
- Keep the layout responsive from 320px phones through ultrawide desktop widths.
- Maintain the sticky-header anchor offset and the 44px minimum mobile hit area.
- Keep iframe previews lazy-loaded and retain safe external `Open app` links.
- Do not add iframe `sandbox` or permission policies without validating the deployed app requirements.

## Motion conventions

- Hero and spotlight reveals use a 250ms blank hold, then transform/opacity-only slide/fade motion.
- Motion is driven by `IntersectionObserver`, `requestAnimationFrame`, or CSS animation; do not update React state per frame.
- Clean up observers, timers, event listeners, and animation frames on unmount.
- Keep `pointer-events: none` on decorative orb layers.
- Disable cursor-following motion for coarse pointers and reduced-motion preferences.

## Documentation

- `docs/specs/` contains design decisions and reference specifications.
- `docs/plans/` contains implementation plans.
- `docs/tasks/` contains the original task checklist and execution history.
- `docs/INDEX.md` is the documentation index.

Treat older specs as historical context when their status says superseded; current behavior is documented in the root README and this guide.
