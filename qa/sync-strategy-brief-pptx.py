#!/usr/bin/env python3
"""One-time reproducible P0–P2 editable PPTX sync.

Read the same six source slides as the website. Keep all original FootMate 9+6
decks unchanged, preserve 16:9 editable shapes and historical design tokens.
Idempotent on the output from this script.
"""
from __future__ import annotations

import json
from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.text import MSO_ANCHOR
from pptx.util import Inches, Pt

ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT / "src" / "case-study"
DATA = (CASE / "strategy-brief-data.js").read_text(encoding="utf-8").strip()
PREFIX = "window.FOOTMATE_STRATEGY_SLIDES = "
assert DATA.startswith(PREFIX) and DATA.endswith(";")
slides = json.loads(DATA[len(PREFIX):-1])
assert len(slides) == 6 and all(len(s["bullets"]) == 3 for s in slides)
target = CASE / "downloads" / "footmate_strategy_p0_p2.pptx"
deck = Presentation(target)
assert len(deck.slides) == 6
assert round(deck.slide_width / deck.slide_height, 2) == round(16 / 9, 2)

INK = RGBColor(20,44,57)
GREEN = RGBColor(8,123,96)
BODY = RGBColor(27,41,49)
MUTED = RGBColor(82,99,109)

def content(shape, value, size, color, bold=False):
    shape.text = value
    tf = shape.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    for paragraph in tf.paragraphs:
        paragraph.space_before = Pt(0)
        paragraph.space_after = Pt(0)
        for run in paragraph.runs:
            font = run.font
            font.name = "Pretendard"
            font.size = Pt(size)
            font.bold = bold
            font.color.rgb = color

for index, (slide, data) in enumerate(zip(deck.slides, slides), 1):
    sh = {shape.name: shape for shape in slide.shapes}
    for name in ("Editable Text 4","Editable Text 5","Editable Text 6",
                 "Editable Text 9","Editable Text 10","Editable Text 12",
                 "Editable Text 14","Editable Text 16","Editable Text 18",
                 "Editable Text 20","Editable Text 21","Shape 17"):
        assert name in sh, (index, name)
    content(sh["Editable Text 4"], data["phase"], 12, GREEN, True)
    content(sh["Editable Text 5"], data["title"], 34, INK, True)
    content(sh["Editable Text 6"], data["subtitle"], 17, MUTED)
    content(sh["Editable Text 9"], "핵심 판단", 11, GREEN, True)
    content(sh["Editable Text 10"], data["takeaway"], 21, INK, True)
    for j, (text_shape, marker_name, item) in enumerate(zip(
        ("Editable Text 12","Editable Text 14","Editable Text 16"),
        ("Shape 11","Shape 13","Shape 15"), data["bullets"])):
        content(sh[text_shape], item, 19, BODY)
        sh[text_shape].top = Inches(3.55 + .82 * j)
        sh[marker_name].top = Inches(3.72 + .82 * j)
    # The fourth bullet was repetitive. Keep its editable placeholder blank
    # and remove the unneeded marker without shifting other slide objects.
    content(sh["Editable Text 18"], "", 19, BODY)
    sh["Shape 17"].fill.background()
    sh["Shape 17"].line.fill.background()
    content(sh["Editable Text 20"], data["source"], 10, MUTED)
    content(sh["Editable Text 21"], f"{index} / 6", 10, MUTED)
    assert "Pretendard" in str(sh["Editable Text 5"].text_frame.paragraphs[0].runs[0].font.name)

deck.save(target)
check = Presentation(target)
assert len(check.slides) == 6
for slide, data in zip(check.slides, slides):
    shown = " ".join(shape.text for shape in slide.shapes if shape.has_text_frame)
    for value in (data["phase"],data["title"],data["subtitle"],data["takeaway"],*data["bullets"],data["source"]):
        assert value in shown, value
print("PASS: regenerated 6 editable slides from canonical website content")
