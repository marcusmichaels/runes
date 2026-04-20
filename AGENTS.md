# AGENTS.md — Runes

**Runes** is a series of hands-on, interactive explainers for JavaScript operators. Each operator is a rune — a dense, encoded symbol you learn to read. Each page takes one rune and makes it click. Lives at `marcusmichaels.com/runes/`.

This file is the authoritative guide for building new pages.

## Goals

- Every operator explained **visually**, not just textually.
- Each page is **fully self-contained** (`index.html` + `script.js`) — no build tooling.
- **Consistent** styling via CSS variables and shared fonts.
- **SEO-first** on every page so they're discoverable individually.

## Current structure

```
runes/
  AGENTS.md             ← this file
  roadmap.md            ← full list of operators to cover
  index.html            ← homepage: grid of runes, done = linked, todo = faded
  shared/
    global.css          ← shared CSS variables + base styles + shared components
    rune-r.svg          ← brand mark (favicon + header logo, single source)
    runes-header.js     ← <runes-header> web component
    runes-footer.js     ← <runes-footer> web component
  modulo/               ← reference implementation
    index.html
    script.js
```

## Shared CSS (`shared/global.css`)

**All styles live in `shared/global.css`.** Pages link it and add no inline `<style>` of their own. The file covers:

- `:root` — font + color variables
- `body.mdst-ui` — page shell (max-width 960px, padding, background, text-align, counter-reset)
- `h1`, `header`, `.phonetic`, `.tagline`, `.rune`, `.intro`, `.progress`
- **Operator-page patterns**: `section`, `section + section`, `section h2`, `section h2::before` (numerals), `section p` prose block
- `.controls`, `.controls label`, `.counter`, `.formula`
- **Homepage grouping**: `.category`, `.category h2`
- **Homepage cards**: `.runes-grid`, `.rune-card`, `.rune-card--todo`, `.rune-card-symbol`, `.rune-card-name`, `.rune-card-hint`
- **Operator visualisations**: `.dots` / `.group` / `.dot`, `.slots` / `.slot` / `@keyframes pulse`, `.array-items` / `.array-item`

### Homepage vs operator-page markup (important)

Operator-page rules (numerals, top borders) are scoped to the `<section>` tag. To avoid accidentally applying those to the homepage, **the homepage uses `<div class="category">` for its groupings** instead of `<section>`. Operator pages use real `<section>` elements for their interactive blocks.

This keeps `global.css` free of page-type selectors — the distinction is purely in markup.

### When to add to shared

Anything visual that isn't truly one-off belongs in `global.css` from the start, so operator pages don't have to reimplement it. If a rule would only apply on one page, see if you can restructure the markup so the rule can live shared — that's usually the better shape.

### When to extract a JS helper

Same rule for JS: once `createPlayer`, `createDotGroup`, `$`, etc. have two+ consumers, move them into `shared/helpers.js` and link it from each page. Not yet done as of this writing.

## Brand mark (`shared/rune-r.svg`)

A minimal SVG — three strokes — of the Elder Futhark rune ᚱ (Raidho), the ancestor of the Latin letter R. Used as:

1. **Favicon**, linked from every page's `<head>`:
   ```html
   <link rel="icon" type="image/svg+xml" href="../shared/rune-r.svg" />
   ```
2. **Header logo**, inlined inside the `<runes-header>` web component (avoids an HTTP request for rendering). If the mark changes, update both the `.svg` file and the inline SVG string in `runes-header.js`.

## Shared header (`<runes-header>`)

A web component at `shared/runes-header.js`. Renders a small top bar: **rune logo + "Runes" wordmark** on the left (linking home), **GitHub icon** on the right (linking the repo). Flex layout, no hairline rule. Shadow DOM scoped.

The GitHub URL is a module-level `GITHUB_URL` constant inside `runes-header.js`. Update there if the repo moves.

Add to every page, just after `<body class="mdst-ui">` opens:

```html
<runes-header home="../"></runes-header>
```

And load the script near `</body>`:

```html
<script src="../shared/runes-header.js"></script>
```

The `home` attribute uses the same convention as the footer: `./` from the homepage, `../` from operator pages.

## Shared footer (`<runes-footer>`)

A web component lives at `shared/runes-footer.js`. It renders the page footer and ships **its own styles via Shadow DOM** — no separate CSS to link. Inherited properties (`font-family`, `color`) and CSS custom properties (`--color-muted`, `--color-ink`, `--color-hairline`) cross the shadow boundary, so it picks up the page's theme without leaking styles back out.

Add to every page, just before `</body>`:

```html
<runes-footer home="../"></runes-footer>
<script src="../shared/runes-footer.js"></script>
```

The `home` attribute is the relative path back to the Runes homepage:
- Homepage (`runes/index.html`): `home="./"`
- Operator pages (`runes/<op>/index.html`): `home="../"`

If the footer gains more content or slots in future, prefer adding attributes to the component over editing each page.

## Per-page conventions

### Folder naming

- **Kebab-case, human-readable**: `modulo/`, `strict-equality/`, `nullish-coalescing/`, `optional-chaining/`, `bitwise-and/`.
- Avoid symbolic names (`%/`, `&/`) — file systems, URLs, and humans all hate them.
- One folder per operator; resist combining.

### Files

- `index.html` — markup, meta tags, inline or linked styles.
- `script.js` — vanilla JS, no modules, no bundler.

### Visual/style system

Define these CSS variables in `:root`:

- `--font-serif: "Fraunces", ui-serif, Georgia, serif`
- `--font-mono: ui-monospace, SFMono-Regular, Menlo, monospace`
- Palette: `--color-accent`, `--color-accent-soft`, `--color-remainder`, `--color-remainder-soft`, `--color-highlight`, `--color-highlight-border`, `--color-ink`, `--color-muted`, `--color-hairline`, `--color-page`

Base dependencies loaded via CDN:

- `modest-ui` as the classless CSS base (applied via `<body class="mdst-ui">`)
- Fraunces from Google Fonts (variable weight + italic)

Visual motifs already in use (reuse wherever sensible):

- `h1` in Fraunces + phonetic/syntax line underneath in italic Fraunces
- **The rune itself (the operator symbol) displayed prominently below the phonetic** in monospace (`var(--font-mono)`), 5rem, accent color. Use mono (not Fraunces) so combinations like `&&=`, `??=`, `>>>` stay legible — serif ligatures mangle them.
- Section numbers as large muted italic numerals via CSS counters (`h2::before`)
- Live formula chips: white pill with soft two-layer shadow (`.formula`)
- Counters: `font-variant-numeric: tabular-nums` so digits don't jitter
- Interactive states: scale-up on `.active`, optional pulse animation on cycle wrap

Keep text prose left-aligned within a `max-width: 520px` centered block. Headings, controls, and visuals are centered.

### JS patterns

- `const $ = (id) => document.getElementById(id)` — standard one-liner at top of file.
- `createPlayer({ stepBtn, playBtn, resetBtn, render, intervalMs })` — step/auto-play/reset trio. Lifts the counter into a closure so module state stays minimal.
- `createDotGroup(count, isRemainder)` — reusable pattern for dot-grouping visualisations; generalise further if new shapes emerge.
- Prefer `const`/`let`; no `var`.
- No external JS libraries. Vanilla only.

### Content structure per page

Each page roughly follows this arc:

1. **Title** — operator name, in Fraunces.
2. **Phonetic or syntax line** — italic, muted. For symbolic operators this is the written-out name or pronunciation (e.g. `/ˈmɒdjʊləʊ/`).
3. **The rune itself** — the operator symbol (e.g. `%`, `&&`, `?.`) in monospace, large and accent-colored. Marked `aria-hidden="true"` so screen readers use the written name instead.
4. **One-sentence definition** — plain prose, single paragraph.
5. **2–4 interactive sections**, each with:
   - Short prose intro (left-aligned, `max-width: 520px`).
   - Controls (sliders, step/auto-play/reset buttons).
   - Live visual rendering.
   - Live formula chip showing the computation.

Avoid text-only sections. If you can't think of a visual for a section, cut it.

### SEO checklist (required on every page)

Copy and adapt from `modulo/index.html`:

- `<html lang="en">`
- `<title>` — operator + `"visually"` + ~10-word hook
- `<meta name="description">` — ≤ 160 chars, one sentence
- `<meta name="keywords">` — comma list of 6–8 relevant terms
- `<link rel="canonical">` — the deployed URL (e.g. `https://marcusmichaels.com/runes/<operator>/`)
- Open Graph: `og:type`, `og:title`, `og:description`, `og:url`, `og:locale`
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`
- JSON-LD structured data as `LearningResource` with `name`, `description`, `learningResourceType: "Interactive Tutorial"`, `educationalLevel`, `inLanguage`, `url`, `about`, `teaches`

The homepage (`runes/index.html`) uses `CollectionPage` + `ItemList` JSON-LD.

## Workflow for adding a new operator

1. Pick the next unchecked entry from `roadmap.md`.
2. Create `runes/<kebab-name>/`.
3. Copy `modulo/index.html` and `modulo/script.js`; find-replace variable names and element IDs.
4. Replace the rune character, phonetic, title, and three section contents with operator-specific visuals. Keep section counts to 2–4.
5. Update every SEO field: `<title>`, description, keywords, OG/Twitter tags, canonical URL, JSON-LD.
6. Sanity-check by opening the page locally: sections work, no console errors, SEO meta visible via view-source.
7. Mark the operator `[x]` in `roadmap.md`.
8. In `index.html` (homepage), remove the `rune-card--todo` modifier from that operator's card and wrap it in an `<a href="<kebab-name>/">`.
9. Update the homepage progress count (`X of 50`).

## Anti-goals

- No React, no bundler, no TypeScript for this project. The point is legibility — anyone should be able to `view-source` and learn.
- Don't pre-generalise. Two consumers before abstracting.
- Don't add prose where a visual would do. If a section is text-heavy, redesign it.
- Don't ship a page without SEO metadata.
