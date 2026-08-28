# The Useful Corner — Landing Page Design Specification

Status: Historical design reference; implementation completed
Date: 2026-08-28  
Target project: `C:\AI\Project\Useful-Corner`  
Reference mockup: `outputs/useful-corner-mockup.html`

## 1. Product definition

The Useful Corner is a friendly, polished landing page that gives one memorable entry point to three independently deployed utilities. Its primary job is navigation, not acquisition: a user bookmarks one page, quickly understands the available tools, and opens the needed app in a new tab.

The page is an independent personal utility collection. Its visual language may be inspired by the public Willis Towers Watson website, but it must not use the WTW logo, imply endorsement, or claim affiliation.

## 2. Goals

- Provide one consolidated location for all three tools.
- Preserve the approved hero, icon navigation, and app-spotlight structure.
- Make each app understandable through concise, witty, problem-focused copy.
- Make the three real app destinations immediately accessible.
- Create a distinctive full-page ambient light-orb background that responds to the pointer without distracting from content.
- Work beautifully from narrow phones through ultrawide desktop displays.
- Remain lightweight, accessible, and straightforward to maintain.

## 3. Non-goals

- No embedded app demos or iframes.
- No tool-launcher section separate from the header navigation.
- No authentication, database, analytics dashboard, or content-management system.
- No copied WTW logo, proprietary imagery, or statement of affiliation.
- No in-page execution of the three utilities.
- No deployment until the implementation has been reviewed and the user chooses a host.

## 4. Technology and architecture

The final site will be a single-route React application built with Vite. It will use JavaScript and plain CSS rather than a component library because the interface is small, custom, and visually specific.

Proposed source structure:

```text
Useful-Corner/
├── public/
│   └── app-icons/
├── src/
│   ├── components/
│   │   ├── AmbientOrbField.jsx
│   │   ├── AppSpotlight.jsx
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   └── Footer.jsx
│   ├── data/
│   │   └── apps.js
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── global.css
│   │   └── components.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

Responsibilities:

- `apps.js` is the single source of truth for app names, descriptions, benefits, icon paths, section IDs, and deployed URLs.
- `Header` renders the brand and three icon links.
- `Hero` renders the page thesis and supporting copy.
- `AppSpotlight` renders one app from data; the three instances use stable app IDs as React keys.
- `AmbientOrbField` owns the decorative full-page orb layer and pointer interaction.
- `Footer` provides the independent-collection description without affiliation language.
- Styles are consolidated into intentional layers; the final site must not retain the mockup's stacked override stylesheets.

## 5. Content and destinations

### PDF Unlocker

- Section ID: `unlocker`
- URL: `https://danhmujar.github.io/PDF-unlocker/`
- Headline: `When your PDF says “view only.”`
- Description: `Some restrictions outlive their usefulness. Remove owner-level printing, copying, and editing limits from PDFs you’re authorized to modify—all within your browser, with no cloud upload.`
- Benefits: `Local processing`, `Up to 20 files`, `ZIP downloads`

### Calculator

- Section ID: `calculator`
- URL: `https://danhmujar.github.io/Calculator/`
- Headline: `Percentages shouldn’t require a spreadsheet detour.`
- Description: `Answer everyday percentage questions, compare several calculations, or switch to scientific mode when the numbers get ambitious.`
- Benefits: `Percentage rows`, `Scientific mode`, `Excel-ready formulas`

### Text & Markdown Formatter

- Section ID: `formatter`
- URL: `https://text-markdown-formatter.vercel.app/`
- Headline: `Still removing <br> tags one by one?`
- Description: `Give your formatting cleanup a well-earned shortcut. Paste untidy text or Markdown and leave with polished content ready for Word, Outlook, Excel, and more.`
- Benefits: `Smart cleanup`, `Live preview`, `Office-friendly copy`

Every app action is labeled `Open app`, opens in a new tab, and uses `rel="noopener noreferrer"`.

## 6. Information architecture and user flow

1. The user lands on a concise hero explaining the collection.
2. The user may select a header icon to scroll directly to an app spotlight.
3. The user reads the app's problem-focused description and benefits.
4. The user selects `Open app` and the deployed utility opens in a new tab.
5. The landing page remains available in the original tab.

The sticky header contains the Useful Corner brand on the left and three app icons on the right. Icon tooltips appear only where sufficient space exists and must never create document overflow.

## 7. Visual system

### Direction

The page uses a restrained editorial system: sharp geometry, generous spacing, strong serif headlines, compact sans-serif utility text, and disciplined purple accents. It adapts the established mockup rather than copying the WTW site.

### Color tokens

- Aubergine: `#48086F`
- Primary purple: `#7F35B2`
- Magenta accent: `#D124B8`
- Charcoal: `#2A2A2B`
- Secondary text: `#525255`
- Pale gray: `#F1F0F2`
- Divider: `#DDD8E0`
- White: `#FFFFFF`

### Typography

- Display and spotlight headings: `Source Serif 4`, with Georgia as a fallback.
- Body, navigation, and buttons: `Source Sans 3`, with Arial as a fallback.
- The required font families must be requested explicitly and verified as loaded.
- Headline sizes use `clamp()` and receive a narrow-phone override so the hero does not become excessively tall at 320px.

### Geometry

- Borders and app frames remain square or nearly square.
- The hero retains its aubergine field, magenta corner wedge, and outlined square anchor.
- App frames use each project's actual icon and the established purple/magenta corner treatment.
- Orbs are the only rounded decorative shapes; that contrast makes the motion feel like light rather than a new component language.

## 8. Full-page ambient orb system

The final effect is one continuous page-level background, not a hero-only cluster and not a separate orb field recreated inside every section.

### Composition

- `AmbientOrbField` is mounted once near the application root.
- It occupies the full viewport with `position: fixed`, remains behind all site content, and persists as the user scrolls from the hero through all three spotlights.
- Six to eight large orbs, approximately 160–420px depending on viewport size, are distributed across the full screen.
- Hero surfaces reveal the orbs most clearly through the aubergine region.
- Spotlight backgrounds use translucent white or pale-gray surfaces so the same orb field remains faintly visible behind every section.
- Spotlight orb visibility remains approximately 4–12% effective opacity; hero visibility may reach approximately 24–45% depending on color and overlap.
- A soft vignette or mask protects text-heavy zones. No orb may reduce text contrast below an accessible level.

### Motion

- Orbs drift slowly on independent 10–20 second cycles.
- On fine-pointer devices, nearby orbs move away from the cursor within an approximately 180–240px influence radius.
- Maximum pointer displacement is approximately 28–48px, with eased return after the pointer leaves.
- Pointer movement updates mutable element styles through refs inside a single `requestAnimationFrame` loop; it must not trigger React state updates every frame.
- The animation loop is cancelled and event listeners are removed when the component unmounts.
- The decorative layer always uses `pointer-events: none` and cannot interfere with links, text selection, or scrolling.

### Touch and reduced motion

- Coarse-pointer devices receive ambient drift only; no simulated cursor interaction is added.
- With `prefers-reduced-motion: reduce`, drift and repulsion stop. Orbs remain as a balanced static composition.
- The orb layer is `aria-hidden="true"` and contributes no accessibility-tree content.

## 9. Responsive behavior

- Ultrawide and desktop: content is centered within a maximum-width shell; the hero uses the approved white/aubergine split and two-column spotlights.
- Tablet landscape: two-column spotlights remain only while both columns retain comfortable reading width.
- Tablet portrait and phone: spotlights stack visual first, copy second; the calculator follows the same reading order despite alternating on desktop.
- Mobile header icons remain at least 44×44px while the brand stays readable at 320px.
- Tooltips are disabled or edge-aligned when they cannot fit inside the viewport.
- No content, tooltip, decorative element, or focus outline creates horizontal scrolling.
- Orb count, sizes, blur, and opacity reduce on smaller screens to control density and rendering cost.

## 10. Accessibility and interaction

- Use semantic `header`, `nav`, `main`, `section`, and `footer` landmarks.
- Include a skip link to the app showcase.
- Maintain a single `h1` and sequential `h2` spotlight headings.
- Header icon links have descriptive accessible names; decorative icon copies use empty alt text.
- Spotlight icons include concise alt text when they convey the app identity.
- Keyboard focus uses a high-contrast purple outline consistent with the theme.
- Anchor navigation accounts for the sticky header using `scroll-margin-top` or `scroll-padding-top`.
- External links clearly include a visual external-opening cue without relying on that cue as the accessible name.
- All text and controls meet WCAG AA contrast targets.

## 11. Metadata and performance

- Page title: `The Useful Corner — Three handy web tools`
- Description: `One tidy place for a PDF unlocker, percentage calculator, and text and Markdown formatter.`
- App icons are stored locally and served through Vite's static asset handling.
- The Formatter PNG should be optimized or converted to a modern format if visual comparison shows no meaningful loss.
- The orb system uses CSS gradients and DOM elements; no animation or particle library is required.
- No unnecessary runtime dependencies are added beyond React, React DOM, Vite, and the official React Vite plugin.

## 12. Error handling and graceful degradation

- If JavaScript does not run, semantic content and external app links remain usable; only orb repulsion is lost.
- If a font request fails, the declared fallbacks preserve readable typography.
- If an app icon fails, the corresponding accessible app name remains available through link labeling and spotlight text.
- External application failures occur in the newly opened tab and do not break the landing page.

## 13. Verification matrix

Visual and functional checks must cover at least:

- 2560×1440 ultrawide
- 1920×1080 full HD
- 1440×900 desktop
- 1366×768 laptop
- 1024×768 tablet landscape
- 768×1024 tablet portrait
- 390×844 mobile
- 320×568 narrow mobile

At each size, verify header fit, hero composition, spotlight order, orb density, text contrast, link usability, and absence of horizontal overflow.

## 14. Acceptance criteria

1. The project runs locally through Vite.
2. The three header icons navigate to their corresponding spotlights.
3. Every `Open app` button opens the correct deployed application in a new tab.
4. The layout has no horizontal overflow or overlapping content from 320px to 2560px.
5. The header remains readable and usable at 320px.
6. Typography loads correctly without unintended fallbacks.
7. Keyboard navigation, focus visibility, semantic headings, and reduced-motion support work correctly.
8. The page uses no WTW logo or affiliation claim.
9. The production build completes without errors.
10. The finished page is visually verified on desktop, tablet, and mobile.
11. One continuous ambient orb layer remains visibly present behind the hero and all three app spotlights.
12. Orbs repel smoothly on fine-pointer devices, drift without pointer input, remain non-interactive on touch, and become static when reduced motion is requested.
13. The orb layer never blocks interaction or materially reduces content readability.
14. No demo, iframe, or separate tool-launcher section appears in the final page.

## 15. Decisions deferred until after implementation review

- Deployment host: GitHub Pages or Vercel.
- Final public URL and repository name.
- Whether a social-preview image is required before deployment.
