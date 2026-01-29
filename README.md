# Ryan Gerard Wilson Site

Lightweight static site built with vanilla HTML, CSS, and JavaScript for a simple GitHub Pages deployment. Markdown sources live alongside a build script that generates the PDFs during the GitHub Pages workflow.

## Project Layout
- `index.html` – landing page with the typewriter intro and document links.
- `assets/css/main.css` – terminal-inspired styling.
- `assets/js/main.js` – typewriter animation controller.
- `assets/docs/` – Markdown sources (`resume.md`, `my_story.md`).
- `scripts/md_to_pdf.py` – ReportLab-powered converter used by the deployment workflow.
- `.github/workflows/deploy.yml` – GitHub Actions pipeline that compiles PDFs and publishes the site.

## Local Preview
1. Install any static file server. A quick option is Python's built-in module: `python -m http.server 8000`.
2. Regenerate PDFs locally if needed: `pip install reportlab` followed by `python scripts/md_to_pdf.py assets/docs/resume.md assets/docs/resume.pdf` and the same for `my_story.md`.
3. Open `http://localhost:8000/` in a browser and confirm the animation plays and the PDF links resolve.

## GitHub Pages Deployment
1. Push the repository to GitHub.
2. In **Settings → Pages**, choose **GitHub Actions** as the source (one-time setup).
3. Each push to `main` runs `.github/workflows/deploy.yml`, which converts the Markdown files to PDF, bundles the static assets, and deploys the artifact via `actions/deploy-pages`.
4. The live site is available at `https://<username>.github.io/` after each successful workflow run.

## Updating Content
- Edit the Markdown files in `assets/docs/`; the workflow will rebuild the PDFs during deployment.
- For manual checks before committing, run the converter locally as noted above.
- Tweak the copy or animation timing in `assets/js/main.js` as needed.
