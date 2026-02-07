# Ryan Gerard Wilson Site

Lightweight static site built with vanilla HTML, CSS, and JavaScript for a
simple GitHub Pages deployment. The resume is stored directly as a PDF and
bundled during the Pages workflow.

## Project Layout
- `index.html` – landing page with the typewriter intro and document links.
- `assets/css/main.css` – terminal-inspired styling.
- `assets/js/main.js` – typewriter animation controller and copy loader.
- `assets/data/copy.json` – centralised site copy (hero, projects, timeline, etc.).
- `resume.pdf` – production-ready resume served directly at `/resume.pdf`.
- `.github/workflows/deploy.yml` – GitHub Actions pipeline that bundles the static assets and deploys the site.

## Local Preview
1. Install any static file server. A quick option is Python's built-in module: `python -m http.server 8000`.
2. Ensure `resume.pdf` is in the project root so it serves at `http://localhost:8000/resume.pdf`.
3. Open `http://localhost:8000/` in a browser and confirm the animation plays and the PDF link resolves.

## GitHub Pages Deployment
1. Push the repository to GitHub.
2. In **Settings → Pages**, choose **GitHub Actions** as the source (one-time setup).
3. Each push to `main` runs `.github/workflows/deploy.yml`, which bundles the static assets (including `resume.pdf`) and deploys the artifact via `actions/deploy-pages`.
4. The live site is available at `https://<username>.github.io/` after each successful workflow run.

## Updating Content
- Replace `resume.pdf` in the repository root; the workflow will publish it as-is.
- Tweak the copy or animation timing in `assets/js/main.js` as needed.
