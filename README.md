# Private Launderers Marketing Site

A premium single-page marketing site for **Private Launderers (New York)** built with **HTML, CSS, and vanilla JavaScript**.

## Project Structure

- `index.html` — main page markup (semantic sections + modal shell)
- `styles.css` — design system, layout, responsive styles, component styles
- `script.js` — interaction modules (navigation, scrolling, reveal animations, form, modal)
- `preview.html` — legacy preview copy retained for reference

## Quick Start

### Open directly
Open `index.html` in your browser.

### Run local server (recommended)

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Content Guidelines

- Keep all business claims aligned to provided source content.
- Do not add pricing, testimonials, or FAQ content unless approved source material exists.
- Keep contact details consistent in both hero and contact sections.

## Accessibility Notes

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`)
- Skip link for keyboard users
- Visible `:focus-visible` treatment
- Escape closes mobile menu and modal
- Reduced-motion support for reveal animations

## JavaScript Modules

`script.js` is organized into clearly commented modules:

1. Shared DOM references and constants
2. Navigation + smooth scrolling
3. Active section highlighting
4. Back-to-top behavior
5. Reveal-on-scroll animations
6. Contact form validation and success state
7. Accessibility/privacy policy modal

## Maintenance Tips

- Keep CSS grouped by component/section.
- Add brief comments for any non-obvious logic.
- Prefer small helper functions over long anonymous handlers.
