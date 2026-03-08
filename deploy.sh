#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

HTML_OUT="build/resume.html"
PDF_OUT="resume.pdf"

python3 scripts/build_resume.py --copy assets/data/copy.json --html-out "$HTML_OUT"

if [ ! -d node_modules/playwright ]; then
  npm install
fi

if [ ! -d "${HOME}/.cache/ms-playwright" ] || [ -z "$(find "${HOME}/.cache/ms-playwright" -maxdepth 1 -mindepth 1 2>/dev/null)" ]; then
  npx playwright install chromium
fi

node scripts/render_resume_pdf.mjs "$HTML_OUT" "$PDF_OUT"

python3 scripts/pre_render_copy.py \
  --input index.html \
  --copy assets/data/copy.json \
  --output /tmp/index.prerendered.html

printf 'Built %s from assets/data/copy.json\n' "$PDF_OUT"

git add -A

if ! git diff --cached --quiet; then
  git commit -m "sync"
  git push
fi
