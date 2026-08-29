# About Corner Tab — Design Spec

**Date:** 2026-08-29  
**Status:** Implemented
**Feature:** Editorial About tab and accessible information modal

## Summary

Add an editorial `About` text tab in the header after the app icons. The control uses the existing editorial treatment instead of a circular glassmorphic FAB and opens a modal describing the collection, its privacy model, and the three independent tools.

## Interaction

- The tab sits beside the app icons in the header and respects the header’s responsive layout.
- Activating the tab opens an accessible modal with `role="dialog"`, `aria-modal="true"`, and a labelled heading.
- The modal closes through the close control, backdrop click, or Escape.
- Focus moves into the modal on open, is trapped while open, and returns to the tab on close.
- Page scrolling is locked while the modal is open.
- The modal and tab support keyboard focus styling and a minimum 44px mobile hit area.

## Content

The modal introduces Useful Corner as a personal collection of independent browser tools. It includes the three tool names, local-processing/privacy notes, a short feature summary, and the existing personal collection statement from the footer. It does not duplicate full app documentation or embed live previews.

## Visual Design

- The tab sits beside the app icons in the header action group.
- Typography uses existing tokens: DM Sans for supporting UI copy and Sora for the modal heading.
- The tab uses aubergine text and a restrained hover/focus treatment; it does not use a persistent underline or arrow.
- The modal uses the existing Useful Corner palette and layered surface styling, with a clear close control and readable responsive layout.

## Acceptance Criteria

1. An `About` control appears after the three app icons in the header on desktop and mobile and has a minimum 44px touch target.
2. Activating the control opens a labelled, keyboard-accessible About modal.
3. Escape, close-control activation, and backdrop activation close the modal and restore focus to the control.
4. Body scrolling is disabled while the modal is open and restored on close.
5. The modal content accurately describes Useful Corner, its three tools, and its local-processing privacy model.
6. The implementation respects reduced-motion preferences and the existing responsive design tokens.
