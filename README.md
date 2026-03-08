# Ryan Gerard Wilson Site

Lightweight static site built with vanilla HTML, CSS, and JavaScript for a
simple GitHub Pages deployment. The resume is generated locally from
`assets/data/copy.json`, committed as `resume.pdf`, and then published by the
Pages workflow.

## Project Layout
- `index.html` – landing page with the typewriter intro, unified timeline, and document links.
- `assets/css/main.css` – terminal-inspired styling.
- `assets/css/resume-pdf.css` – printable resume styling for the generated PDF.
- `assets/js/main.js` – typewriter animation controller and copy loader.
- `assets/data/copy.json` – centralised site copy (hero, unified timeline, website snapshot resume, full resume PDF source, footer).
- `templates/resume.html.j2` – Jinja template used to build `build/resume.html`.
- `scripts/build_resume.py` – renders resume HTML from `copy.json`.
- `scripts/render_resume_pdf.mjs` – prints the built resume HTML to `resume.pdf` via Playwright.
- `scripts/pre_render_copy.py` – build-time pre-renderer that injects copy into HTML for crawler-friendly output.
- `deploy.sh` – local build wrapper for generating `resume.pdf` before you commit/push.
- `resume.pdf` – generated resume served directly at `/resume.pdf`.
- `.github/workflows/deploy.yml` – GitHub Actions pipeline that bundles the static assets and deploys the site.

## Local Preview
1. Install any static file server. A quick option is Python's built-in module: `python -m http.server 8000`.
2. Run `./deploy.sh` once so the current `resume.pdf` exists.
3. Open `http://localhost:8000/` in a browser and confirm the animation plays and the PDF link resolves.
4. Optional for crawler parity: `python3 scripts/pre_render_copy.py --input index.html --copy assets/data/copy.json --output /tmp/index.prerendered.html`

## Resume Build
1. Edit `assets/data/copy.json`.
2. Update the structured resume source under `resumePdf`.
3. Run `./deploy.sh`.
4. Review the regenerated `resume.pdf`.
5. Commit and push; GitHub Actions will publish the already-built PDF at `/resume.pdf`.

Notes:
- `deploy.sh` builds `build/resume.html`, installs Playwright if needed, installs Chromium if missing, and renders `resume.pdf` locally.
- The homepage resume card still reads from `resume`; the printable document reads from `resumePdf`.
- The resume avatar is sourced from the X avatar URL stored in `resumePdf.basics.avatarUrl`.

## GitHub Pages Deployment
1. Push the repository to GitHub.
2. In **Settings → Pages**, choose **GitHub Actions** as the source (one-time setup).
3. Each push to `main` runs `.github/workflows/deploy.yml`, which bundles the static assets (including the locally generated `resume.pdf`) and deploys the artifact via `actions/deploy-pages`.
4. The live site is available at `https://<username>.github.io/` after each successful workflow run.
5. During CI, `scripts/pre_render_copy.py` injects `assets/data/copy.json` into `site/index.html` so bots can read full copy without executing JavaScript.

## Updating Content
- Update the resume source in `assets/data/copy.json`, then run `./deploy.sh` to regenerate `resume.pdf`.
- Tweak the copy or animation timing in `assets/js/main.js` as needed.
- Update timeline content in `assets/data/copy.json`; projects now live in `timeline.projects[]`, life events in `timeline.lifeEvents[]`, and the renderers merge both arrays into one date-sorted timeline.
