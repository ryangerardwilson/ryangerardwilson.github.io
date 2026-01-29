#!/usr/bin/env python3
import os
import sys
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


def compile_text_to_pdf(text_file, pdf_file):
    try:
        with open(text_file, "r", encoding="utf-8") as handle:
            text = handle.read()

        pdf_canvas = canvas.Canvas(pdf_file, pagesize=A4)

        today = datetime.now().strftime("%Y-%m-%d")
        base = os.path.splitext(os.path.basename(text_file))[0]
        title = f"{base} - {today}"
        pdf_canvas.setTitle(title)
        pdf_canvas.setAuthor("Generated Script")
        pdf_canvas.setSubject("Generated from Markdown")
        pdf_canvas.setCreator("Simple MD to PDF Converter")

        width, height = A4
        left_margin = 72
        top_margin = 72
        bottom_margin = 72
        right_margin = 72
        usable_width = width - left_margin - right_margin

        font_size = 8
        line_spacing = 10
        text_object = pdf_canvas.beginText(left_margin, height - top_margin)
        text_object.setFont("Courier", font_size)
        text_object.setLeading(line_spacing)

        y_position = height - top_margin
        for line in text.splitlines():
            if not line:
                text_object.textLine("")
                y_position -= line_spacing
            else:
                working_line = line
                while working_line:
                    max_chars = int(usable_width / (font_size * 0.6))
                    chunk = working_line[:max_chars]
                    working_line = working_line[max_chars:]
                    text_object.textLine(chunk)
                    y_position -= line_spacing

            if y_position < bottom_margin:
                pdf_canvas.drawText(text_object)
                pdf_canvas.showPage()
                text_object = pdf_canvas.beginText(left_margin, height - top_margin)
                text_object.setFont("Courier", font_size)
                text_object.setLeading(line_spacing)
                y_position = height - top_margin

        pdf_canvas.drawText(text_object)
        pdf_canvas.save()

        print(f"Successfully converted {text_file} to {pdf_file} (Title: {title})")

    except Exception as exc:  # pylint: disable=broad-except
        print(f"Error: Failed to convert {text_file} to PDF: {exc}")
        sys.exit(1)


def main():
    if len(sys.argv) != 3:
        print("Usage: ./md_to_pdf.py <input.md> <output.pdf>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    if not os.path.isfile(input_file):
        print(f"Error: Input file {input_file} does not exist.")
        sys.exit(1)

    compile_text_to_pdf(input_file, output_file)


if __name__ == "__main__":
    main()
