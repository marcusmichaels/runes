# Runes

JavaScript operators, decoded.

A visual field guide to JavaScript's operators.

Live at [marcusmichaels.com/runes](https://marcusmichaels.com/runes).

## How it's built

Vanilla. No React, no TypeScript, no bundler. Two files per page (`index.html` + `script.js`). Shared theme, favicon, and two small web components (`<runes-header>` + `<runes-footer>`) live in `shared/`.

## Run locally

```sh
# quick look
open index.html

# or a local server so relative links work properly
python3 -m http.server
```

## Structure

```
runes/
  index.html         homepage: grid of runes
  roadmap.md         the operators, current status
  AGENTS.md          conventions for building new pages
  shared/
    global.css
    rune-r.svg       brand mark (favicon + header logo)
    runes-header.js
    runes-footer.js
  modulo/            one folder per operator
    index.html
    script.js
```

## Progress

2 decoded so far. See [roadmap.md](./roadmap.md) for the full list.

## Adding more

Everything's in [AGENTS.md](./AGENTS.md): folder layout, styling, SEO checklist, steps.

## License

Not picked yet. Leaning MIT for the code, CC BY-NC for the content.
