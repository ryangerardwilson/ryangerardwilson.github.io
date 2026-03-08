#!/usr/bin/env python3
import argparse
import html
import json
import re
from datetime import datetime, timezone
from pathlib import Path


def replace_tag_text(doc: str, tag: str, element_id: str, text: str) -> str:
    pattern = rf'(<{tag}[^>]*\bid="{re.escape(element_id)}"[^>]*>)(.*?)(</{tag}>)'
    replacement = rf'\1{html.escape(text or "")}\3'
    new_doc, count = re.subn(pattern, replacement, doc, flags=re.DOTALL)
    if count == 0:
        raise ValueError(f"Could not find <{tag} id=\"{element_id}\">")
    return new_doc


def replace_container_inner(doc: str, tag: str, element_id: str, inner_html: str) -> str:
    pattern = rf'(<{tag}[^>]*\bid="{re.escape(element_id)}"[^>]*>)(.*?)(</{tag}>)'
    replacement = rf'\1\n{inner_html}\n            \3' if tag == 'div' else rf'\1\n{inner_html}\n\3'
    new_doc, count = re.subn(pattern, replacement, doc, flags=re.DOTALL)
    if count == 0:
        raise ValueError(f"Could not find <{tag} id=\"{element_id}\"> container")
    return new_doc


def replace_attr_by_id(doc: str, tag: str, element_id: str, attr: str, value: str) -> str:
    pattern = rf'(<{tag}[^>]*\bid="{re.escape(element_id)}"[^>]*\b{re.escape(attr)}=")([^"]*)(")'
    replacement = rf'\1{html.escape(value or "", quote=True)}\3'
    new_doc, count = re.subn(pattern, replacement, doc)
    if count == 0:
        # Support tags where the attribute may not yet exist.
        pattern_no_attr = rf'(<{tag}[^>]*\bid="{re.escape(element_id)}"[^>]*)(>)'
        replacement_no_attr = rf'\1 {attr}="{html.escape(value or "", quote=True)}"\2'
        new_doc, count = re.subn(pattern_no_attr, replacement_no_attr, doc)
        if count == 0:
            raise ValueError(f"Could not find <{tag} id=\"{element_id}\"> for attr {attr}")
    return new_doc


def is_x_post_url(url: str) -> bool:
    return bool(re.match(r'^https?://(?:www\.)?(?:x|twitter)\.com/', url or '', flags=re.IGNORECASE))


def resolve_project_cta_label(cta: dict, projects_section: dict) -> str:
    if cta.get('label'):
        return cta.get('label') or ''
    if is_x_post_url(cta.get('url') or ''):
        return projects_section.get('xPostCtaLabel') or 'view post on X'
    return 'open link'


def parse_launch_date(value: str) -> datetime:
    if not value:
        return datetime(1970, 1, 1, tzinfo=timezone.utc)
    return datetime.fromisoformat(value.replace('Z', '+00:00'))


def sort_projects(projects: list[dict]) -> list[dict]:
    return sorted(
        projects,
        key=lambda project: (
            -parse_launch_date(project.get('launchDate') or '').timestamp(),
            project.get('name') or '',
        ),
    )


def render_projects(projects: list[dict], projects_section: dict) -> str:
    cards = []
    for project in sort_projects(projects):
        name = html.escape(project.get('name') or 'project')
        accent = html.escape(project.get('accent') or '')
        badge = html.escape(project.get('badge') or '')
        catch_line = html.escape(project.get('catchLine') or '')
        features = project.get('features') or []
        ctas = project.get('ctas') or []

        feature_items = '\n'.join(
            f'                        <li>{html.escape(feature)}</li>'
            for feature in features[:2]
        )

        cta_links = '\n'.join(
            (
                '                        '
                f'<a class="cta-button" href="{html.escape(cta.get("url") or "#", quote=True)}" '
                'target="_blank" rel="noopener noreferrer">'
                '<span class="chevron">&gt;</span>'
                f'<span>{html.escape(resolve_project_cta_label(cta, projects_section))}</span></a>'
            )
            for cta in ctas
        )

        badge_html = f'\n                        <span class="terminal-badge">{badge}</span>' if badge else ''

        card = (
            f'                <article class="terminal-card is-visible" data-accent="{accent}">\n'
            '                    <div class="terminal-header">\n'
            f'                        <h3 class="project-title">{name}</h3>{badge_html}\n'
            '                    </div>\n'
            f'                    <div class="catch-line">{catch_line}</div>\n'
            '                    <ul class="feature-list">\n'
            f'{feature_items}\n'
            '                    </ul>\n'
            '                    <div class="cta-row">\n'
            f'{cta_links}\n'
            '                    </div>\n'
            '                </article>'
        )
        cards.append(card)

    return '\n'.join(cards)


def render_resume_meta(meta_items: list[dict]) -> str:
    rows = []
    for item in meta_items:
        label = html.escape(item.get('label') or '')
        body = html.escape(item.get('body') or '')
        rows.append(
            '                <article class="resume-card">\n'
            f'                    <header>{label}</header>\n'
            f'                    <p>{body}</p>\n'
            '                </article>'
        )
    return '\n'.join(rows)


def render_timeline(entries: list[dict]) -> str:
    blocks = []
    for entry in entries:
        stamp = html.escape(entry.get('stamp') or '')
        headline = html.escape(entry.get('headline') or '')
        bullets = entry.get('bullets') or []
        bullet_items = '\n'.join(f'                            <li>{html.escape(text)}</li>' for text in bullets)
        blocks.append(
            '                <article class="timeline-entry is-visible" data-timeline>\n'
            f'                    <span class="timeline-stamp">{stamp}</span>\n'
            '                    <div class="timeline-card">\n'
            f'                        <header>{headline}</header>\n'
            '                        <ul>\n'
            f'{bullet_items}\n'
            '                        </ul>\n'
            '                    </div>\n'
            '                </article>'
        )
    return '\n'.join(blocks)


def main() -> None:
    parser = argparse.ArgumentParser(description='Pre-render copy.json into index.html')
    parser.add_argument('--input', required=True, help='Input index.html path')
    parser.add_argument('--copy', required=True, help='copy.json path')
    parser.add_argument('--output', required=True, help='Output index.html path')
    args = parser.parse_args()

    index_path = Path(args.input)
    copy_path = Path(args.copy)
    output_path = Path(args.output)

    doc = index_path.read_text(encoding='utf-8')
    copy_data = json.loads(copy_path.read_text(encoding='utf-8'))

    hero = copy_data.get('hero') or {}
    projects_section = copy_data.get('projectsSection') or {}
    projects = copy_data.get('projects') or []
    resume = copy_data.get('resume') or {}
    resume_pane = resume.get('pane') or {}
    timeline = copy_data.get('timeline') or {}

    doc = replace_tag_text(doc, 'h1', 'typewriter-h1', hero.get('h1') or '')
    doc = replace_tag_text(doc, 'p', 'typewriter-p1', hero.get('p1') or '')
    doc = replace_tag_text(doc, 'p', 'typewriter-p2', hero.get('p2') or '')
    doc = replace_tag_text(doc, 'p', 'typewriter-p3', hero.get('p3') or '')

    doc = replace_tag_text(doc, 'h2', 'projects-title', projects_section.get('title') or 'Projects')
    doc = replace_container_inner(doc, 'div', 'project-grid', render_projects(projects, projects_section))

    doc = replace_tag_text(doc, 'h2', 'resume-title', resume.get('title') or 'Resume Snapshot')
    doc = replace_tag_text(doc, 'p', 'resume-subtitle', resume.get('subtitle') or '')
    doc = replace_container_inner(doc, 'div', 'resume-meta', render_resume_meta(resume.get('meta') or []))

    doc = replace_tag_text(doc, 'header', 'resume-name', resume_pane.get('name') or '')
    doc = replace_tag_text(doc, 'p', 'resume-summary', resume_pane.get('summary') or '')
    doc = replace_tag_text(doc, 'span', 'resume-cta-label', resume_pane.get('ctaLabel') or '')
    doc = replace_tag_text(doc, 'span', 'resume-notes-label', resume_pane.get('notesLabel') or '')
    doc = replace_tag_text(doc, 'small', 'resume-note', resume_pane.get('note') or '')
    doc = replace_attr_by_id(doc, 'a', 'resume-cta', 'href', resume_pane.get('ctaHref') or 'resume.pdf')
    doc = replace_attr_by_id(doc, 'a', 'resume-notes', 'href', resume_pane.get('notesHref') or '#')
    doc = replace_attr_by_id(doc, 'img', 'resume-avatar', 'src', resume.get('avatarUrl') or resume_pane.get('avatarUrl') or '')

    doc = replace_tag_text(doc, 'h2', 'timeline-title', timeline.get('title') or 'My Story')
    doc = replace_tag_text(doc, 'p', 'timeline-subtitle', timeline.get('subtitle') or '')
    doc = replace_container_inner(doc, 'div', 'timeline-container', render_timeline(timeline.get('entries') or []))

    output_path.write_text(doc, encoding='utf-8')


if __name__ == '__main__':
    main()
