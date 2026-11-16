#!/usr/bin/env python3
"""Verify FootMate business strategy report integration and separate editable presentation.

Uses Python stdlib; existing 9+6 PPTX and financial inputs are checked by the
separate long-standing crosscheck script. This script does not render or mutate files.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from xml.etree import ElementTree as ET
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT / "src" / "case-study"
SOURCE = (CASE / "strategy-brief-data.js").read_text(encoding="utf-8")
prefix = "window.FOOTMATE_STRATEGY_SLIDES = "
assert SOURCE.startswith(prefix) and SOURCE.rstrip().endswith(";")
slides = json.loads(SOURCE[len(prefix):].strip()[:-1])
assert len(slides) == 6
assert [slide["id"] for slide in slides] == [
    "decision", "gtm", "corpdev", "portfolio", "kpi", "equity",
]
assert all(len(s["bullets"]) == 3 for s in slides)
public_slide_text = " ".join(str(value) for slide in slides for value in
                             (slide["phase"], slide["title"], slide["subtitle"],
                              slide["takeaway"], *slide["bullets"], slide["source"]))
for forbidden in ("P0", "P1", "P2", "전략 보완", "개인 분석", "Short-list", "핵심 판단"):
    assert forbidden not in public_slide_text, ("Unedited public slide language", forbidden)

assert all(all(s.get(key) for key in ("phase","title","subtitle","takeaway","source")) for s in slides)
assert all(any(word in " ".join([slide["title"],slide["subtitle"],slide["takeaway"],slide["source"],*slide["bullets"]])
                   for word in ("가정","보류","검증","미확인","미검증","실측","확인","제안"))
           for slide in slides), "Each slide must preserve a verification/assumption boundary"

pptx = CASE / "downloads" / "footmate_strategy_p0_p2.pptx"
assert pptx.is_file() and pptx.stat().st_size > 15_000
a = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
p = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
with ZipFile(pptx) as archive:
    assert archive.testzip() is None, "PPTX ZIP has corrupt entry"
    names = set(archive.namelist())
    essential = {"[Content_Types].xml", "ppt/presentation.xml", "ppt/slideMasters/slideMaster1.xml",
                 "ppt/slideLayouts/slideLayout1.xml", "ppt/theme/theme1.xml"}
    essential |= {f"ppt/slides/slide{i}.xml" for i in range(1, 7)}
    assert essential <= names, "PPTX component missing"
    presentation = ET.fromstring(archive.read("ppt/presentation.xml"))
    assert len(presentation.findall(f".//{p}sldId")) == 6
    for i, slide in enumerate(slides, start=1):
        root = ET.fromstring(archive.read(f"ppt/slides/slide{i}.xml"))
        text_boxes = root.findall(f".//{p}sp")
        assert len(text_boxes) >= 11, (i, "editable shapes missing")
        displayed = " ".join((e.text or "") for e in root.iter(f"{a}t"))
        for value in (slide["phase"], slide["title"], slide["subtitle"],
                      slide["takeaway"], *slide["bullets"], slide["source"]):
            assert value in displayed, (i, "web/PPTX text mismatch", value)
        assert "Pretendard" in archive.read(f"ppt/slides/slide{i}.xml").decode("utf-8")
        assert "핵심 판단" not in displayed, "Redundant banner label remains in PPTX"
        # This is a stand-alone deck; original 15 slides are never overwritten.
    assert len([name for name in names if re.fullmatch(r"ppt/slides/slide\d+\.xml", name)]) == 6

index = (ROOT / "index.html").read_text(encoding="utf-8")
viewer = (CASE / "strategy-brief.html").read_text(encoding="utf-8")
materials = (CASE / "materials.html").read_text(encoding="utf-8")
enhancement = (CASE / "strategy-brief.js").read_text(encoding="utf-8")
# Editorial regression: internal workstream labels must never appear in UI text.
for path_text in (viewer, enhancement):
    for forbidden in ("P0–P2", "P0 ", "P1 ", "P2 ", "P0 보완", "P1/P2",
                      "전략 보완", "개인 분석", "기존 발표자료 15장"):
        assert forbidden not in path_text, ("Public UI text not cleaned", forbidden)
assert 'download="footmate_business_strategy.pptx"' in viewer
assert 'download="footmate_business_strategy.pptx"' in materials
assert "download.download = 'footmate_business_strategy.pptx'" in enhancement
# Markdown filenames remain stable so existing citations and URLs do not break.
docs = [ROOT / "docs" / name for name in (
    "P0-GTM-ENTRY-STRATEGY-20261116.md",
    "P0-CORPDEV-CANDIDATE-SCREENING-20261116.md",
    "P0-EVIDENCE-REGISTER-20261116.md",
    "P1-PORTFOLIO-CAPITAL-ALLOCATION-20261116.md",
    "P1-STRATEGY-KPI-GOVERNANCE-20261116.md",
    "P2-EQUITY-STORY-EXECUTIVE-MEMO-20261116.md")]
for file in docs:
    rendered_words = re.sub(r"\]\([^)]*\)", "]()", file.read_text(encoding="utf-8"))
    assert not re.search(r"\bP[012]\b", rendered_words), ("Stage code in document", file.name)

for required in ("strategy-brief-data.js", "strategy-brief.js", "strategy-brief.css"):
    assert required in index
assert index.index('strategy-brief-data.js') < index.index('strategy-brief.js')
assert "window.FOOTMATE_STRATEGY_SLIDES" in enhancement
assert "slide.bullets.forEach" in enhancement
assert "attachBrief('#section-02', ['gtm']" in enhancement
assert "attachBrief('#section-03', ['corpdev']" in enhancement
assert "attachBrief('#section-08', ['portfolio', 'kpi', 'equity']" in enhancement
# Prevent the webpage summary from drifting away from the canonical slide data.
assert "Long-list · 조사 대상 8건" not in enhancement
assert "461만원" not in enhancement
assert "−387,160" not in enhancement
assert "−38.7만원" in slides[0]["bullets"][1]
assert "461만원" in slides[0]["bullets"][2] and "별도 승인" in slides[0]["bullets"][2]
assert "8건" in slides[2]["bullets"][0] and "0건" in slides[2]["takeaway"]
assert "30일 재참가" in slides[4]["bullets"][1]
assert "기회비용 포함" in slides[5]["bullets"][1]
assert "5→12→20→28→36곳" in slides[3]["bullets"][2]
original = (CASE / "nine-sections.js").read_text(encoding="utf-8")
assert all(term in original for term in ("626", "340", "461만원", "30일 재참가", "28곳"))
assert "−387,160원" in original, "Base cash loss changed"
assert "200만원" in original, "Labor opportunity cost qualification missing"
assert len(re.findall(r'"name": "', original)) >= 9
for required in ("strategy-brief-data.js", "strategy-brief.js", "strategy-brief.css",
                 "footmate_strategy_p0_p2.pptx"):
    assert required in viewer
for required in ("strategy-brief.html", "footmate_strategy_p0_p2.pptx"):
    assert required in materials
for section in ("#section-02", "#section-03", "#section-08"):
    assert section in enhancement
assert "<h1" not in enhancement and "<table" not in enhancement
assert "new slides" not in enhancement  # No invented slide count in existing decks.
print("PASS: public copy audit, website/PPTX parity, report assumptions and editable 6-slide deck")
