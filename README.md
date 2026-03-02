````md
# README — Private Launderers Marketing Site (Static)

Premium, single-page marketing website for **Private Launderers (New York)** built in **pure HTML + CSS + vanilla JS** with an “old New York / speakeasy” luxury aesthetic.  
**Content source of truth:** the provided PDF and the provided logo image. No invented claims, pricing, testimonials, or FAQs.

---

## 1) What’s in this repo

### Files
- `index.html` — semantic single-page markup + SEO/meta + modal shell
- `styles.css` — theme, layout, responsiveness, animation, accessibility styles
- `script.js` — smooth scrolling, sticky nav behaviors, active section highlighting, reveal animations, back-to-top, modal, form validation

### Assets (expected)
- `assets/logo.png` — **required** (your provided logo)
- `assets/og-image.png` — optional (Open Graph preview image). If you don’t have one, remove the `og:image` tag or add a simple branded image.

**All asset paths are relative** (e.g., `./assets/logo.png`).

---

## 2) Quick start

### Option A — Open directly (simplest)
1. Ensure the folder structure matches the **Project structure** section below.
2. Double-click `index.html`.

> Note: Some browsers apply extra restrictions when opening local files. If you see odd behavior, use Option B.

### Option B — Run a tiny local server (recommended)
From the project root:

**Python**
```bash
python -m http.server 8080
````

**Node (npx)**

```bash
npx serve .
```

Then open:

* `http://localhost:8080`

---

## 3) Project structure (recommended)

```
private-launderers-site/
  index.html
  styles.css
  script.js
  assets/
    logo.png
    og-image.png        (optional but recommended)
```

---

## 4) Site architecture (single page)

The site is a single page with anchored sections:

* `#home` — Hero
* `#services` — Services cards + “Additional services”
* `#process` — How It Works steps
* `#about` — Brand story + quality pledge
* `#contact` — Contact details + form

Navigation uses anchor links and smooth scroll while accounting for sticky header height.

---

## 5) Content rules (how content is handled)

### Source of truth

All copy is derived from the provided PDF only. If the PDF does **not** provide:

* pricing → pricing section omitted
* testimonials → testimonials omitted
* FAQ → FAQ omitted
* additional addresses/hours/policies → not added

### Copy edits

Copy may be tightened for clarity, but meaning is preserved and no new facts are introduced.

---

## 6) Design system overview

### Visual tone

* Background: deep charcoal/near black
* Accent: warm brass/gold
* Motifs: thin dividers, small caps kicker labels, subtle borders and shadows
* Texture: subtle overlay via CSS gradients (no heavy images)

### Typography

Two Google Fonts:

* Headings: `Cormorant Garamond` (serif)
* Body: `Inter` (sans)

### Layout principles

* Mobile-first
* Balanced grid
* Generous whitespace
* Cards for scannability

---

## 7) Accessibility implementation notes

This site is designed to be WCAG-minded:

* **Semantic HTML:** `header/nav/main/section/footer`
* **Skip link:** “Skip to content”
* **Focus styles:** clear `:focus-visible` outlines and offsets
* **Keyboard navigation:**

  * mobile menu can be opened and closed with keyboard
  * Escape closes the mobile menu and modal
  * modal traps focus minimally (prevents focus from escaping)
* **Reduced motion:** respects `prefers-reduced-motion`

---

## 8) JavaScript behaviors (what script.js does)

### A) Mobile navigation

* Toggle button expands/collapses nav menu
* `aria-expanded` is updated
* Escape key closes the menu

### B) Smooth scrolling

* Clicking any `[data-scroll]` anchor scrolls smoothly to the section
* Sticky header offset is applied so headings don’t hide under the header
* URL hash is updated using `history.replaceState`

### C) Active section highlighting

* Uses `IntersectionObserver` on the main sections
* The nav link for the most-visible section gets `.is-active`

### D) Reveal-on-scroll animation

* Elements with `.reveal` fade/slide in when scrolled into view
* Disabled for users with reduced motion preferences

### E) “Back to top” button

* Appears after scrolling down ~650px
* Smooth scrolls to top on click

### F) Contact form validation + success state (no backend)

* Validates:

  * First name (required)
  * Last name (required)
  * Email (required, format)
  * Phone (optional, basic format)
  * Inquiry (required, min length)
* Displays inline errors
* Focuses first invalid field on submit
* Shows a success state (then auto-hides after ~8 seconds)

### G) Policy modal (Accessibility / Privacy)

* Opens a modal on click of footer policy buttons
* Escape closes the modal
* Content is currently a **summary**. If you want strict compliance with “PDF-only copy,” replace modal text with exact PDF wording.

---

## 9) How to change content safely (human + AI friendly)

**Golden rule:** update content only if it exists in the PDF. Do not add new claims.

### Common edits

#### Update phone/email/address/hours

In `index.html`, search for:

* `tel:` for phone
* `mailto:` for email
* the Address block under Contact
* Hours block under Contact

#### Add or remove a service card

1. In `index.html`, find:

```html
<section class="section" id="services">
```

2. Add/remove an `<article class="card">...</article>` inside `.cards`.
3. Keep headings consistent (use `<h3>`).
4. Ensure the copy is taken directly from the PDF.

#### Add a new section (only if PDF supports it)

Example: If the PDF later includes testimonials:

1. Add a new `<section id="testimonials">` with semantic headings.
2. Add a nav link in the header.
3. Add the id to `sectionIds` in `script.js` for active highlighting.

In `script.js`, update:

```js
const sectionIds = ['#home', '#services', '#process', '#about', '#contact'];
```

#### Change the primary CTA text

In `index.html`, update the button text in the hero:

```html
<a class="btn btn--primary" href="#contact" data-scroll>Request Pickup</a>
```

---

## 10) Validation logic details (AI implementers)

Validation is centralized in `validators`:

```js
const validators = {
  firstName: ...
  lastName: ...
  email: ...
  phone: ...
  inquiry: ...
};
```

To modify validation requirements:

* change validator functions
* keep error messages concise and user-friendly
* ensure required fields match the PDF’s “contact form fields”

---

## 11) SEO / metadata

In `index.html` `<head>`:

* `<title>` and `<meta name="description">` are set
* Open Graph tags exist
* `og:image` points to `./assets/og-image.png` (optional)

If you don’t have an OG image:

* remove the `og:image` tag, or
* create one and place it in `assets/`

---

## 12) Deployment (static hosting)

This is a pure static site and can be deployed to:

* GitHub Pages
* Netlify
* Vercel (static)
* Cloudflare Pages
* Any static web server / CDN

### GitHub Pages (quick)

1. Push repo to GitHub.
2. Settings → Pages
3. Deploy from branch (e.g., `main`, `/root`)

---

## 13) Known limitations / intentional choices

* No backend: contact form cannot actually send email.

  * Intended behavior: validate + show success state and encourage calling/emailing.
* Policy modal content is a summary. If you need exact text, replace with verbatim PDF passages.
* No frameworks by design (per requirements).

---

## 14) QA checklist (pre-launch)

### Visual

* [ ] Verify logo renders crisply on mobile and desktop
* [ ] Confirm gold accent contrast looks good across monitors
* [ ] Confirm no overflow/scrollbars on mobile widths (320px)

### Functional

* [ ] Sticky nav works
* [ ] Mobile menu opens/closes; Escape closes it
* [ ] Smooth scrolling offsets correctly (section headings visible)
* [ ] Active nav link updates while scrolling
* [ ] Back-to-top appears and scrolls up
* [ ] Form validates and shows success state

### Accessibility

* [ ] Tab through page: focus visible everywhere
* [ ] Use keyboard to open/close modal
* [ ] Reduced-motion users do not see animations

### Content integrity

* [ ] All claims match the PDF
* [ ] No extra sections (pricing/testimonials/faq) unless explicitly in PDF

---

## 15) AI operator instructions (for future edits)

When modifying this repo:

1. Treat the PDF as the sole truth source.
2. If a piece of information is missing in the PDF, do not add it.
3. Maintain:

   * typography pairing (Cormorant Garamond + Inter)
   * dark charcoal background + brass accents
   * restrained motion and effects
4. Update `sectionIds` in `script.js` whenever you add/remove anchored sections used in nav.

---

## 16) Contact / ownership

Brand + content belong to Private Launderers. This code is a lightweight static marketing site scaffold intended for production use with your existing assets.

```

If you want, paste your target folder structure and I’ll also add a short **“build/preview/deploy”** section tailored to your exact environment (Windows/macOS, GitHub Pages vs Netlify, etc.) without changing any code.
```
