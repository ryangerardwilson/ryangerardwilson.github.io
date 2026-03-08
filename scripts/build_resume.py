#!/usr/bin/env python3
import argparse
import base64
import json
from pathlib import Path
from urllib.error import URLError
from urllib.request import urlopen

from jinja2 import Environment, FileSystemLoader, select_autoescape


def fetch_data_uri(url: str) -> str:
    if not url:
        return ""
    try:
        with urlopen(url, timeout=10) as response:
            content_type = response.headers.get_content_type() or "image/png"
            payload = base64.b64encode(response.read()).decode("ascii")
            return f"data:{content_type};base64,{payload}"
    except (URLError, TimeoutError, ValueError):
        return url


def format_contact(contact: dict) -> dict:
    value = (contact.get("value") or "").strip()
    href = (contact.get("href") or "").strip()
    return {
        "label": contact.get("label") or "",
        "value": value,
        "href": href,
        "display": value.replace("https://", "").replace("http://", ""),
    }


def split_list(items: list, first_count: int) -> tuple[list, list]:
    return items[:first_count], items[first_count:]


def build_pages(resume: dict, avatar_src: str) -> list[dict]:
    experience = resume.get("experience") or []
    projects = resume.get("projects") or []
    skills = resume.get("skills") or []
    certifications = resume.get("certifications") or []

    exp_page1, exp_rest = split_list(experience, 2)
    exp_page2, _ = split_list(exp_rest, 2)
    projects_page2, projects_rest = split_list(projects, 2)
    projects_page3, projects_page4 = split_list(projects_rest, 2)
    skills_page2, skills_page3 = split_list(skills, 4)

    return [
        {
            "left_sections": [
                {"title": None, "kind": "identity"},
                {"title": "Contact", "kind": "contact", "items": [format_contact(item) for item in resume.get("contact") or []]},
                {"title": "Education", "kind": "education", "items": resume.get("education") or []},
            ],
            "right_sections": [
                {"title": "Profile", "kind": "profile", "text": resume.get("profile") or ""},
                {"title": "Experience", "kind": "experience", "items": exp_page1},
            ],
        },
        {
            "left_sections": [
                {"title": "Skills", "kind": "skills", "items": skills_page2},
            ],
            "right_sections": [
                {"title": None, "kind": "experience", "items": exp_page2},
                {"title": "Projects", "kind": "projects", "items": projects_page2},
            ],
        },
        {
            "left_sections": [
                {"title": "Skills", "kind": "skills", "items": skills_page3},
            ],
            "right_sections": [
                {"title": None, "kind": "projects", "items": projects_page3},
            ],
        },
        {
            "left_sections": [
                {"title": "Certifications", "kind": "certifications", "items": certifications},
            ],
            "right_sections": [
                {"title": None, "kind": "projects", "items": projects_page4},
            ],
        },
    ]


def build_html(copy_path: Path, template_path: Path, css_path: Path, html_out: Path) -> None:
    copy_data = json.loads(copy_path.read_text(encoding="utf-8"))
    resume = copy_data.get("resumePdf") or {}
    basics = resume.get("basics") or {}
    avatar_src = fetch_data_uri(basics.get("avatarUrl") or "")

    env = Environment(
        loader=FileSystemLoader(str(template_path.parent)),
        autoescape=select_autoescape(["html", "xml"]),
        trim_blocks=True,
        lstrip_blocks=True,
    )
    template = env.get_template(template_path.name)

    html = template.render(
        css=css_path.read_text(encoding="utf-8"),
        basics=basics,
        avatar_src=avatar_src,
        pages=build_pages(resume, avatar_src),
    )

    html_out.parent.mkdir(parents=True, exist_ok=True)
    html_out.write_text(html, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build resume HTML from copy.json")
    parser.add_argument("--copy", default="assets/data/copy.json", help="Path to copy.json")
    parser.add_argument("--template", default="templates/resume.html.j2", help="Path to Jinja template")
    parser.add_argument("--css", default="assets/css/resume-pdf.css", help="Path to resume CSS")
    parser.add_argument("--html-out", default="build/resume.html", help="Path to generated HTML")
    args = parser.parse_args()

    build_html(
        copy_path=Path(args.copy),
        template_path=Path(args.template),
        css_path=Path(args.css),
        html_out=Path(args.html_out),
    )


if __name__ == "__main__":
    main()
