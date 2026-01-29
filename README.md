# Ryan Gerard Wilson Site

Lightweight static site built with vanilla HTML, CSS, and JavaScript for a simple GitHub Pages deployment. Markdown source files and exported PDFs for the resume and personal write-up live alongside the front-end assets.

## Project Layout
- `index.html` – landing page with the typewriter intro and document links.
- `assets/css/main.css` – terminal-inspired styling.
- `assets/js/main.js` – typewriter animation controller.
- `assets/docs/` – Markdown sources (`resume.md`, `my_story.md`) and published PDFs (`resume.pdf`, `my_story.pdf`).

## Local Preview
1. Install any static file server. A quick option is Python's built-in module: `python -m http.server 8000`.
2. Open `http://localhost:8000/` in a browser.
3. Confirm the animation plays and the PDF links open as expected.

## GitHub Pages Deployment
1. Push the repository to GitHub.
2. In the repository settings, enable GitHub Pages and select the `main` branch with the root directory.
3. Wait for the deployment to finish; the site will be served from `https://<username>.github.io/<repository>/`.

## Updating Content
- Edit the Markdown files in `assets/docs/` and regenerate the PDFs with your preferred toolchain before committing both formats.
- Tweak the copy or animation timing in `assets/js/main.js` as needed.
