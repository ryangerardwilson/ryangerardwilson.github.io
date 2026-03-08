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


def chunk_list(items: list, size: int) -> list[list]:
    return [items[index:index + size] for index in range(0, len(items), size)]


def build_pages(resume: dict) -> list[dict]:
    contact_items = [format_contact(item) for item in resume.get("contact") or []]
    education = resume.get("education") or []
    skills = resume.get("skills") or []
    certifications = resume.get("certifications") or []
    experience = resume.get("experience") or []
    projects = resume.get("projects") or []

    skill_pages = chunk_list(skills, 4)
    page_one = {
        "left_sections": [
            {"kind": "identity", "title": None},
            {"kind": "contact", "title": "Contact", "items": contact_items},
            {"kind": "education", "title": "Education", "items": education},
        ],
        "right_sections": [
            {"kind": "profile", "title": "Profile", "text": resume.get("profile") or ""},
            {"kind": "experience", "title": "Experience", "items": experience[:2]},
        ],
    }

    page_two = {
        "left_sections": [
            {"kind": "skills", "title": "Skills", "items": skill_pages[0] if skill_pages else []},
        ],
        "right_sections": [
            {"kind": "experience", "title": "Experience", "items": experience[2:]},
            {"kind": "projects", "title": "Projects", "items": projects[:2]},
        ],
    }

    page_three = {
        "left_sections": [
            {"kind": "skills", "title": "Skills", "items": skill_pages[1] if len(skill_pages) > 1 else []},
            {"kind": "certifications", "title": "Certifications", "items": certifications},
        ],
        "right_sections": [
            {"kind": "projects", "title": "Projects", "items": projects[2:]},
        ],
    }

    pages = [page_one, page_two, page_three]
    return [
        {
            "left_sections": [section for section in page["left_sections"] if section.get("items", [1])],
            "right_sections": [section for section in page["right_sections"] if section.get("items", [1])],
        }
        for page in pages
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
        pages=build_pages(resume),
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
