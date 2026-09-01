# The Tidy Corner

The Tidy Corner is a lightweight React/Vite landing page for two available browser tools and a third tool in development:

- PDF Unlocker
- Calculator
- Text & Markdown Formatter

It provides a single navigable home page with live previews for available tools, a blurred coming-soon teaser, direct “Open app” links, responsive spotlight sections, and a continuous ambient light field.

## Run locally

```bash
npm install
npm run dev
```

For a production-style local preview:

```bash
npm run build
npm run preview -- --host 127.0.0.1
```

## Quality checks

```bash
npm run build
npm run lint
npm run test:e2e
```

To smoke-test the built bundle (including cross-origin previews under the CSP):

```bash
npm run test:e2e:prod
```

## GitHub Pages deployment

The repository workflow publishes the production build to
https://danhmujar.github.io/Tidy-Corner/ when changes land on `main`.

The Vite base path is set to `/Tidy-Corner/` for this repository site. If a custom domain is added later, change the base back to `/`.

GitHub Pages is configured to use GitHub Actions as its publishing source.

## Project structure

```text
src/
  components/       React page sections and motion behavior
  data/             App destinations and spotlight copy
  styles/           Design tokens and global/component CSS
public/app-icons/   Local app identity assets
assets/             Original mockup assets
docs/               Specifications, plans, and task history
```

## Interaction and motion

- The hero and each app spotlight hold blank for 250ms, then reveal with a restrained slide/fade stagger when entering the viewport.
- Reveals replay when a section leaves and re-enters the viewport.
- A soft cursor-centered magenta light follows fine-pointer movement across the page and hides over live previews or outside the webpage.
- An `About` control sits after the app icons in the header and opens an accessible modal with the tools, tech stack, privacy model, features, limitations, and developer credit.
- Ambient background orbs drift continuously and respond subtly to the pointer.
- Touch/coarse-pointer devices and `prefers-reduced-motion` receive a static, usable composition.
- Live previews remain interactive cross-origin iframes, with external links as the fallback action.

## Typography

- Sora: display headings and brand text
- Source Sans 3: general body copy
- DM Sans: supporting copy, controls, and tooltips
- IBM Plex Mono: labels and eyebrow text

See [docs/INDEX.md](docs/INDEX.md) for the documentation index and [AGENTS.md](AGENTS.md) for contribution guidance.
