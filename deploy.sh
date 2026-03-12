#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

HTML_OUT="build/resume.html"
PDF_OUT="resume.pdf"
HTML_OUT_2="build/resume2.html"
PDF_OUT_2="resume2.pdf"

build_resume_variant() {
  local resume_key="$1"
  local html_out="$2"
  local pdf_out="$3"

  python3 scripts/build_resume.py \
    --copy assets/data/copy.json \
    --resume-key "$resume_key" \
    --html-out "$html_out"

  node scripts/render_resume_pdf.mjs "$html_out" "$pdf_out"
}

if [ ! -d node_modules/playwright ]; then
  npm install
fi

if [ ! -d "${HOME}/.cache/ms-playwright" ] || [ -z "$(find "${HOME}/.cache/ms-playwright" -maxdepth 1 -mindepth 1 2>/dev/null)" ]; then
  npx playwright install chromium
fi

build_resume_variant "resumePdf" "$HTML_OUT" "$PDF_OUT"
build_resume_variant "resumePdf2" "$HTML_OUT_2" "$PDF_OUT_2"

python3 scripts/pre_render_copy.py \
  --input index.html \
  --copy assets/data/copy.json \
  --output /tmp/index.prerendered.html

printf 'Built %s and %s from assets/data/copy.json\n' "$PDF_OUT" "$PDF_OUT_2"

git add -A

if ! git diff --cached --quiet; then
  git commit -m "sync"
  git push
fi
