# AGENTS.md

## Project Instructions

- If the user asks to update `assets/data/copy.json`, review `~/Documents/agent_context/BRAND_GUIDELINES.md` first and ensure the copy changes align with it.
- GitHub profile source of truth: `https://github.com/ryangerardwilson`.
- When updating website copy or resume copy, use the `gh` CLI to review the latest published public repositories from `ryangerardwilson` that are not related to `genie` or `wiom`, and use that review to decide whether the site or resume should be refreshed.
- Treat `genie`- and `wiom`-related repositories as out of scope for that public-repo review unless the user explicitly asks to include them.
- For resume work, preserve the 2-page PDF limit. Content assigned to `resumePdf.page_1` must fit entirely on page 1, all remaining resume content must fit on page 2, and the generated `resume.pdf` must never exceed 2 pages.
- This repo has three resume variants in `assets/data/copy.json`:
  - `resumePdf` -> `resume.pdf`: main generalist/product variant with the headline `Product Engineer`.
  - `resumePdf2` -> `resume2.pdf`: data/backend variant with the headline `Data Scientist & Backend Engineer`.
  - `resumePdf3` -> `resume3.pdf`: AI architect variant with the headline `AI Solutions Architect | GenAI Delivery, ML Systems, and Platform Advisory`.
- `resumePdf2` and `resumePdf3` inherit from `resumePdf` via `extends`. Put shared changes in `resumePdf`; put variant-specific copy, skills, and project ordering only in the relevant child block.
- For resume-variant work, preserve the intended positioning:
  - `resume.pdf`: product engineer / agentic tooling orientation.
  - `resume2.pdf`: same project pool as `resume.pdf`, but reordered to emphasize data science and backend systems.
  - `resume3.pdf`: ordered to emphasize GenAI delivery, ML systems, platform advisory, and customer-facing AI architecture work.
- The 2-page limit and page-2 density constraints apply to every resume variant, not just `resume.pdf`.
- For resume work, keep the right-side column typography consistent across all pages. Do not introduce page-specific or section-specific font-size drift in the resume body copy.
- For resume work at the current font/layout settings, page 2 can handle at most 9 project headings before spillover becomes likely. Treat 9 as the hard planning limit unless you also tighten copy or layout and re-verify the 2-page constraint.
- `deploy.sh` must generate all three variants: `resume.pdf`, `resume2.pdf`, and `resume3.pdf`, before continuing with deployment.
