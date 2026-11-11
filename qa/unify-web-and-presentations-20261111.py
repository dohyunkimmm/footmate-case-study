#!/usr/bin/env python3
"""Unify FootMate's two editable decks and regenerate the exact published previews.
Design-only pass: never change business text, formulas, chart values or slide count.
"""
from __future__ import annotations
import base64
import json
import re
import subprocess
from pathlib import Path
from tempfile import TemporaryDirectory
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.dml import MSO_COLOR_TYPE, MSO_FILL
from pptx.util import Inches, Pt

ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT / "src/case-study"
REPORT = CASE / "downloads/footmate_report.pptx"
STRATEGY = CASE / "downloads/footmate_5year_strategy.pptx"
MARKER = "footmate-unified-visual-20261111"
NAVY = RGBColor(20, 44, 57)
DEEP = RGBColor(13, 37, 49)
TEAL = RGBColor(8, 123, 96)
TEAL_DARK = RGBColor(6, 93, 74)
LIME = RGBColor(205, 243, 93)
INK = RGBColor(27, 41, 49)
MUTED = RGBColor(82, 99, 109)
NEGATIVE = RGBColor(156, 67, 57)
SOFT = RGBColor(234, 245, 241)
PAPER = RGBColor(245, 247, 246)
BORDER = RGBColor(219, 229, 227)

def text_parts(deck):
    return [[s.text for s in slide.shapes if getattr(s, "has_text_frame", False) and s.text.strip()]
            for slide in deck.slides]

def all_runs(shape):
    if getattr(shape, "has_text_frame", False):
        for paragraph in shape.text_frame.paragraphs:
            for run in paragraph.runs:
                yield run
    if getattr(shape, "has_table", False):
        for row in shape.table.rows:
            for cell in row.cells:
                for paragraph in cell.text_frame.paragraphs:
                    for run in paragraph.runs:
                        yield run

def recolor_existing(shape):
    mapping = {
        "0F372C": NAVY, "1E6249": TEAL, "0B4231": NAVY,
        "173329": INK, "155A40": TEAL, "326C50": TEAL,
        "E6F4E8": SOFT, "EDF3ED": SOFT,
    }
    def visit_color(color):
        try:
            if color.type == MSO_COLOR_TYPE.RGB and str(color.rgb).upper() in mapping:
                color.rgb = mapping[str(color.rgb).upper()]
        except (AttributeError, ValueError):
            pass
    for run in all_runs(shape):
        if run.text.strip():
            run.font.name = "Pretendard"
            visit_color(run.font.color)
    try:
        if shape.fill.type == MSO_FILL.SOLID:
            visit_color(shape.fill.fore_color)
    except (AttributeError, ValueError):
        pass
    try:
        visit_color(shape.line.color)
    except (AttributeError, ValueError):
        pass

def outline(slide, x, y, w, h, color=TEAL, width=2):
    """Non-occluding outline to emphasize one decision without duplicating slide text."""
    box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE,
                                  Inches(x), Inches(y), Inches(w), Inches(h))
    box.fill.background()
    box.line.color.rgb = color
    box.line.width = Pt(width)
    return box

def left_rule(slide, x, y, h, color=TEAL):
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE,
                                Inches(x), Inches(y), Inches(.065), Inches(h))
    bar.fill.solid()
    bar.fill.fore_color.rgb = color
    bar.line.fill.background()

def top_marker(slide, slide_width_inches):
    """Shared visual identity; no content change."""
    x = slide_width_inches - .63
    dot = slide.shapes.add_shape(MSO_SHAPE.OVAL,
                                 Inches(x), Inches(.37), Inches(.083), Inches(.083))
    dot.fill.solid()
    dot.fill.fore_color.rgb = TEAL
    dot.line.fill.background()

def emphasize_text(slide, terms, color=TEAL_DARK):
    for shape in slide.shapes:
        if not getattr(shape, "has_text_frame", False):
            continue
        for paragraph in shape.text_frame.paragraphs:
            for run in paragraph.runs:
                if any(term in run.text for term in terms):
                    run.font.bold = True
                    run.font.color.rgb = color

def add_design(deck, kind):
    before = text_parts(deck)
    if MARKER not in (deck.core_properties.keywords or ""):
        for slide in deck.slides:
            for shape in slide.shapes:
                recolor_existing(shape)
            top_marker(slide, deck.slide_width / 914400)
        if kind == "report":
            # Three cover evidence cards; underline the risk/decision card.
            outline(deck.slides[0], 8.87, 4.48, 3.86, 1.38, TEAL, 1.7)
            # Make the operational responsibility and control slides easier to scan.
            for n in (1, 4, 5, 6):
                left_rule(deck.slides[n], .69, 2.46, 3.22, TEAL)
            # Selected unit-economics scenario.
            emphasize_text(deck.slides[3], ("940", "28곳"), TEAL_DARK)
            # Financial losses should have a stable, distinct semantic color.
            emphasize_text(deck.slides[7], ("−89.7%", "−47.5%", "−11.4%", "−14.6%"), NEGATIVE)
            # Final-year decision: keep the original editable chart and dense
            # financial evidence together, with an unobtrusive accent divider.
            left_rule(deck.slides[8], .69, 5.76, .35, TEAL)
        else:
            # 4th-year break-even gate is the turning point of the five-year plan.
            outline(deck.slides[1], 8.36, 2.10, 2.43, 2.17, TEAL, 2.3)
            # The negotiated 940 KRW contribution margin is the selected scenario.
            outline(deck.slides[2], 8.90, 2.09, 3.68, 2.17, TEAL, 2.3)
            emphasize_text(deck.slides[2], ("940", "28곳"), TEAL_DARK)
            # De-emphasize adjacent management rows; show the four workstreams.
            for y in (2.08, 3.12, 4.17, 5.22):
                left_rule(deck.slides[4], .74, y, .77, TEAL)
            # The closing decision stays the hero, not another data table.
            emphasize_text(deck.slides[5], ("수익성 있는 확대",), LIME)
        deck.core_properties.keywords = ((deck.core_properties.keywords or "") + " " + MARKER).strip()
    after = text_parts(deck)
    if before != after:
        raise AssertionError("Deck business copy was unexpectedly changed")
    return len(before)

def convert_decks_and_publish_previews():
    with TemporaryDirectory(prefix="footmate-unified-") as folder:
        temp = Path(folder)
        for ppt in (REPORT, STRATEGY):
            result = subprocess.run(
                ["libreoffice", "-env:UserInstallation=file:///tmp/footmate-design-" + ppt.stem,
                 "--headless", "--convert-to", "pdf", "--outdir", str(temp), str(ppt)],
                check=True, capture_output=True, text=True)
            pdf = temp / (ppt.stem + ".pdf")
            if not pdf.exists():
                raise RuntimeError("PDF render failed: " + result.stdout + result.stderr)
        subprocess.run(["pdftoppm", "-r", "96", "-png",
                        str(temp / "footmate_report.pdf"), str(temp / "report")], check=True)
        subprocess.run(["pdftoppm", "-r", "96", "-jpeg", "-jpegopt", "quality=87",
                        str(temp / "footmate_5year_strategy.pdf"), str(temp / "strategy")], check=True)
        preview_path = CASE / "report-previews.js"
        raw = preview_path.read_text(encoding="utf-8").strip()
        prefix = "window.REPORT_SLIDES="
        assert raw.startswith(prefix) and raw.endswith(";"), "Invalid browser preview source"
        previews = json.loads(raw[len(prefix):-1])
        assert len(previews) == 9
        for i, item in enumerate(previews, 1):
            picture = temp / ("report-" + str(i) + ".png")
            payload = picture.read_bytes()
            assert payload.startswith(bytes.fromhex("89504e470d0a1a0a")) and len(payload) > 5000
            item["src"] = "data:image/png;base64," + base64.b64encode(payload).decode("ascii")
        preview_path.write_text(prefix + json.dumps(previews, ensure_ascii=False, separators=(",", ":")) + ";\n",
                                encoding="utf-8")
        strategy_dir = CASE / "previews/strategy"
        for i in range(1, 7):
            picture = temp / ("strategy-" + str(i) + ".jpg")
            payload = picture.read_bytes()
            assert payload.startswith(bytes.fromhex("ffd8ff")) and len(payload) > 5000
            (strategy_dir / ("slide-" + str(i) + ".jpg")).write_bytes(payload)
        print("PREVIEW_SYNC 9 PNG and 6 JPG regenerated from the editable PPTX files")

def main():
    decks = [(REPORT, "report", 9), (STRATEGY, "strategy", 6)]
    for path, kind, count in decks:
        deck = Presentation(path)
        assert len(deck.slides) == count, (kind, len(deck.slides))
        actual = add_design(deck, kind)
        assert actual == count
        deck.save(path)
        check = Presentation(path)
        assert len(check.slides) == count
        assert MARKER in (check.core_properties.keywords or "")
        print("DECK_OK", kind, count, "editable slides")
    convert_decks_and_publish_previews()
    print("DESIGN_PASS all slides rendered and captions preserved")

if __name__ == "__main__":
    main()
