import os
import sys
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


def compile_text_to_pdf(text_file, pdf_file):
    try:
        with open(text_file, "r") as f:
            text = f.read()

        # Create the PDF canvas
        c = canvas.Canvas(pdf_file, pagesize=A4)

        # Add document metadata
        today = datetime.now().strftime("%Y-%m-%d")
        base = os.path.basename(text_file)
        title = f"{base} - {today}"
        subject = "Generated from Markdown"
        c.setTitle(title)
        c.setAuthor("Generated Script")
        c.setSubject(subject)
        c.setCreator("Simple MD to PDF Converter")

        # Layout and rendering
        width, height = A4
        left_margin = 72
        top_margin = 72
        bottom_margin = 72
        right_margin = 72
        usable_width = width - left_margin - right_margin

        font_size = 8
        line_spacing = 10
        textobject = c.beginText(left_margin, height - top_margin)
        textobject.setFont("Courier", font_size)
        textobject.setLeading(line_spacing)

        y = height - top_margin
        for line in text.splitlines():
            if line == "":
                textobject.textLine("")
                y -= line_spacing
            else:
                while len(line) > 0:
                    max_chars = int(usable_width / (font_size * 0.6))
                    chunk = line[:max_chars]
                    line = line[max_chars:]
                    textobject.textLine(chunk)
                    y -= line_spacing
            if y < bottom_margin:
                c.drawText(textobject)
                c.showPage()
                textobject = c.beginText(left_margin, height - top_margin)
                textobject.setFont("Courier", font_size)
                textobject.setLeading(line_spacing)
                y = height - top_margin

        c.drawText(textobject)
        c.save()

        print(f"Successfully converted {text_file} to {pdf_file} (Title: {title})")

    except Exception as e:
        print(f"Error: Failed to convert {text_file} to PDF: {e}")
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: ./md_to_pdf.py <input.md> <output.pdf>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    if not os.path.isfile(input_file):
        print(f"Error: Input file {input_file} does not exist.")
        sys.exit(1)

    compile_text_to_pdf(input_file, output_file)
