# Cuzen General Supply Company Limited: website

Multi-page, static website for Cuzen General Supply (Dar es Salaam, Tanzania). Plain HTML, CSS and JavaScript. No framework and no runtime dependencies.

See [docs/SITE-PLAN.md](docs/SITE-PLAN.md) for the page structure and what each page is for.

## Run locally

```bash
npm install --include=dev   # only needed to rebuild pages or images
npm run dev                 # http://localhost:3000
```

## Edit the site

* Page content: `src/pages/*.html` (each file starts with a `<!--meta {...}-->` title and description).
* Shared header, footer, icons, quote drawer: `src/layout.html`.
* After editing either, run `npm run build`. It writes the finished `.html` files to the project root. **Commit those generated files**, because Vercel serves the root folder as is.
* Styles: `assets/css/main.css`. Behaviour: `assets/js/main.js`.
* Photos: put originals in `scripts/raw/`, list them in `scripts/images.mjs`, run `npm run images` to create optimised WebP files in `assets/img/`.
* Products on the products page use one line each, for example `{{item cement|Cement (premium brands)|Construction}}`. Add or remove lines, then run `npm run build`.

## Deploy on Vercel

1. Push this repository to GitHub.
2. In Vercel choose **Add New, Project**, import the repository.
3. Framework preset: **Other**. Leave the build command and output directory empty (the HTML is already built).
4. Deploy. Clean URLs (`/about`, `/products`) are set in `vercel.json`.

## Contact details used on the site

Edit them in `src/layout.html`, `src/pages/contact.html` and `assets/js/main.js` (WhatsApp number and email constants at the top).
