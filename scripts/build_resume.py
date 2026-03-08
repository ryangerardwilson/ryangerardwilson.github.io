#!/usr/bin/env python3
import argparse
import base64
import json
from pathlib import Path
from datetime import datetime, timezone
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


def parse_iso_date(value: str) -> datetime:
    if not value:
        return datetime(1970, 1, 1, tzinfo=timezone.utc)
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def format_launch_date(value: str) -> str:
    dt = parse_iso_date(value)
    return f"{dt.strftime('%B')} {dt.day}, {dt.year}"


def build_lookup(items: list[dict], key: str) -> dict[str, dict]:
    return {item[key]: item for item in items}


def pick_items(lookup: dict, values: list[str], label: str) -> list:
    missing = [value for value in values if value not in lookup]
    if missing:
        missing_list = ", ".join(missing)
        raise ValueError(f"Missing {label} in resumePdf page config: {missing_list}")
    return [lookup[value] for value in values]


def pick_strings(values: list[str], ordered_values: list[str], label: str) -> list[str]:
    known = set(ordered_values)
    missing = [value for value in values if value not in known]
    if missing:
        missing_list = ", ".join(missing)
        raise ValueError(f"Missing {label} in resumePdf page config: {missing_list}")
    return [value for value in values]


def resolve_section(section: dict, resume: dict, lookups: dict) -> dict:
    kind = section["kind"]

    if kind in {"identity", "profile"}:
        resolved = {"kind": kind, "title": "Profile" if kind == "profile" else None}
        if kind == "profile":
            resolved["text"] = resume.get("profile") or ""
        return resolved

    if kind == "contact":
        return {"kind": kind, "title": "Contact", "items": lookups["contact"]}

    if kind == "education":
        return {"kind": kind, "title": "Education", "items": resume.get("education") or []}

    if kind == "skills":
        labels = section.get("labels") or []
        return {
            "kind": kind,
            "title": section.get("title", "Skills"),
            "items": pick_items(lookups["skills"], labels, "skill labels"),
        }

    if kind == "experience":
        roles = section.get("roles") or []
        return {
            "kind": kind,
            "title": section.get("title", "Experience"),
            "items": pick_items(lookups["experience"], roles, "experience roles"),
        }

    if kind == "projects":
        names = section.get("names") or []
        return {
            "kind": kind,
            "title": section.get("title", "Projects"),
            "subtitle": section.get("subtitle"),
            "items": pick_items(lookups["projects"], names, "project names"),
        }

    if kind == "certifications":
        titles = section.get("titles") or []
        return {
            "kind": kind,
            "title": section.get("title", "Certifications"),
            "items": pick_strings(titles, resume.get("certifications") or [], "certifications"),
        }

    raise ValueError(f"Unsupported resume section kind: {kind}")


def build_pages(resume: dict) -> list[dict]:
    lookups = {
        "contact": [format_contact(item) for item in resume.get("contact") or []],
        "skills": build_lookup(resume.get("skills") or [], "label"),
        "experience": build_lookup(resume.get("experience") or [], "role"),
        "projects": build_lookup(resume.get("projects") or [], "name"),
    }
    configured_pages = [resume[key] for key in sorted(resume.keys()) if key.startswith("page_")]
    pages = []
    for page in configured_pages:
        pages.append(
            {
                "left_sections": [resolve_section(section, resume, lookups) for section in page.get("left_sections") or []],
                "right_sections": [resolve_section(section, resume, lookups) for section in page.get("right_sections") or []],
            }
        )

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
    timeline_projects = copy_data.get("timeline", {}).get("projects") or []
    timeline_project_lookup = {item.get("title"): item for item in timeline_projects}
    enriched_projects = []
    for project in resume.get("projects") or []:
        project_copy = dict(project)
        timeline_project = timeline_project_lookup.get(project.get("name"))
        if not project_copy.get("launchDate") and timeline_project and timeline_project.get("date"):
            project_copy["launchDate"] = format_launch_date(timeline_project.get("date"))
        enriched_projects.append(project_copy)
    resume = dict(resume)
    resume["projects"] = enriched_projects

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
