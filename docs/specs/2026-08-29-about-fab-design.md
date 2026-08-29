# About Corner Tab — Design Spec

**Date:** 2026-08-29  
**Status:** Approved direction, pending implementation review  
**Feature:** Editorial About tab and accessible information modal

## Summary

Add a fixed bottom-left `About this corner →` text tab to the Useful Corner landing page. The control uses the existing editorial underline treatment instead of a circular glassmorphic FAB and opens a modal describing the collection, its privacy model, and the three independent tools.

## Interaction

- The tab remains visible while scrolling and respects desktop/mobile safe-area insets.
- Activating the tab opens an accessible modal with `role="dialog"`, `aria-modal="true"`, and a labelled heading.
- The modal closes through the close control, backdrop click, or Escape.
- Focus moves into the modal on open, is trapped while open, and returns to the tab on close.
- Page scrolling is locked while the modal is open.
- The modal and tab support keyboard focus styling and a minimum 44px mobile hit area.

## Content

The modal introduces Useful Corner as a personal collection of independent browser tools. It includes the three tool names, local-processing/privacy notes, a short feature summary, and the existing personal collection statement from the footer. It does not duplicate full app documentation or embed live previews.

## Visual Design

- The tab aligns to the main page gutter at the bottom-left.
- Typography uses existing tokens: DM Sans for supporting UI copy and Sora for the modal heading.
- The tab uses aubergine text, a magenta underline/accent, and a restrained hover lift/arrow shift.
- The modal uses the existing Useful Corner palette and layered surface styling, with a clear close control and readable responsive layout.

## Acceptance Criteria

1. A fixed bottom-left `About this corner →` control is visible on desktop and mobile and has a minimum 44px touch target.
2. Activating the control opens a labelled, keyboard-accessible About modal.
3. Escape, close-control activation, and backdrop activation close the modal and restore focus to the control.
4. Body scrolling is disabled while the modal is open and restored on close.
5. The modal content accurately describes Useful Corner, its three tools, and its local-processing privacy model.
6. The implementation respects reduced-motion preferences and the existing responsive design tokens.
