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

def parse_launch_date(value: str) -> datetime:
    if not value:
        return datetime(1970, 1, 1, tzinfo=timezone.utc)
    return datetime.fromisoformat(value.replace('Z', '+00:00'))


def sort_timeline_items(items: list[dict]) -> list[dict]:
    return sorted(
        items,
        key=lambda item: (
            -parse_launch_date(item.get('date') or '').timestamp(),
            item.get('type') or '',
            item.get('id') or '',
        ),
    )


def format_launch_date(value: str) -> str:
    if not value:
        return ''
    return parse_launch_date(value).strftime('%B %-d, %Y')


def render_github_link(url: str, project_name: str) -> str:
    if not url:
        return ''
    href = html.escape(url, quote=True)
    label = html.escape(f"Open {project_name} on GitHub", quote=True)
    github_path = (
        'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 '
        '0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13 '
        '-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66 '
        '.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15 '
        '-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 '
        '2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 '
        '2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 '
        '2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z'
    )
    return (
        f'<a class="project-github-link" href="{href}" target="_blank" '
        f'rel="noopener noreferrer" aria-label="{label}">'
        '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">'
        f'<path fill="currentColor" d="{github_path}"></path>'
        '</svg></a>'
    )


def resolve_timeline_label(item: dict) -> str:
    return item.get('label') or format_launch_date(item.get('date') or '')


def render_timeline_list(items: list[str], css_class: str = '') -> str:
    class_attr = f' class="{css_class}"' if css_class else ''
    li_items = '\n'.join(f'                            <li>{html.escape(text)}</li>' for text in items)
    return (
        f'                        <ul{class_attr}>\n'
        f'{li_items}\n'
        '                        </ul>\n'
    )


def render_timeline_item(item: dict) -> str:
    item_type = item.get('type') or 'lifeEvent'
    item_id = html.escape(item.get('id') or '')
    label = html.escape(resolve_timeline_label(item))
    title = html.escape(item.get('title') or '')
    bullets = item.get('bullets') or []

    if item_type == 'project':
        accent = html.escape(item.get('accent') or '')
        github_link = render_github_link(item.get('githubUrl') or '', item.get('title') or 'project')
        summary = html.escape(item.get('summary') or '')
        body = (
            f'                        <div class="terminal-header">\n'
            f'                            <header>{title}</header>{github_link}\n'
            '                        </div>\n'
            f'                        <div class="timeline-project-summary">{summary}</div>\n'
            f'{render_timeline_list(bullets, "feature-list") if bullets else ""}'
        )
        return (
            f'                <article class="timeline-entry is-visible" data-timeline data-kind="{html.escape(item_type)}" data-id="{item_id}">\n'
            f'                    <span class="timeline-stamp">{label}</span>\n'
            f'                    <div class="timeline-card timeline-card--project" data-accent="{accent}">\n'
            f'{body}'
            '                    </div>\n'
            '                </article>'
        )

    body = (
        f'                        <header>{title}</header>\n'
        f'{render_timeline_list(bullets) if bullets else ""}'
    )
    return (
        f'                <article class="timeline-entry is-visible" data-timeline data-kind="{html.escape(item_type)}" data-id="{item_id}">\n'
        f'                    <span class="timeline-stamp">{label}</span>\n'
        '                    <div class="timeline-card timeline-card--life">\n'
        f'{body}'
        '                    </div>\n'
        '                </article>'
    )


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


def render_timeline(items: list[dict]) -> str:
    return '\n'.join(render_timeline_item(item) for item in sort_timeline_items(items))


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
    resume = copy_data.get('resume') or {}
    resume_pane = resume.get('pane') or {}
    timeline = copy_data.get('timeline') or {}

    doc = replace_tag_text(doc, 'h1', 'typewriter-h1', hero.get('h1') or '')
    doc = replace_tag_text(doc, 'p', 'typewriter-p1', hero.get('p1') or '')
    doc = replace_tag_text(doc, 'p', 'typewriter-p2', hero.get('p2') or '')
    doc = replace_tag_text(doc, 'p', 'typewriter-p3', hero.get('p3') or '')

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
    doc = replace_container_inner(doc, 'div', 'timeline-container', render_timeline(timeline.get('items') or []))

    output_path.write_text(doc, encoding='utf-8')


if __name__ == '__main__':
    main()
