"""Lightly improve the readable table/footnote hierarchy on the existing final slide.

Keep all 9 slides, chart values, business assumptions and textual content intact.
Works on the editable PPTX and is safe on repeated preview builds.
"""
from pathlib import Path
from pptx import Presentation
from pptx.util import Inches, Pt

PPTX = Path("src/case-study/downloads/footmate_report.pptx")
MARKER = "footmate-final-readability-20261108"
prs = Presentation(PPTX)
assert len(prs.slides) == 9
if MARKER in (prs.core_properties.keywords or ""):
    print("PASS FootMate final-slide readability already applied; bytes unchanged")
    raise SystemExit(0)

def snapshot(p):
    result = []
    for slide in p.slides:
        for shape in slide.shapes:
            if shape.has_text_frame:
                result.append(("text", shape.text))
            if shape.has_table:
                result.append(("table", tuple(tuple(c.text for c in row.cells) for row in shape.table.rows)))
            if shape.has_chart:
                result.append(("chart", tuple(tuple(series.values) for series in shape.chart.series)))
    return result

before = snapshot(prs)
last = prs.slides[8]
# The source deck draws the financial table with editable text boxes, not a PPT table shape.
# Scope the change to its 7 columns × 6 rows, excluding the chart, title and decision banner.
cells = []
for shape in last.shapes:
    if not shape.has_text_frame or not shape.text.strip():
        continue
    x = shape.left / prs.slide_width
    y = shape.top / prs.slide_height
    if 0.57 <= x < 0.95 and 0.36 <= y < 0.72:
        cells.append(shape)
assert len(cells) == 42, f"Expected 42 editable text cells (7 columns × 6 rows), got {len(cells)}"
assert any(cell.text.strip() == "4년 차" for cell in cells)

styled_runs = 0
for shape in cells:
    frame = shape.text_frame
    frame.word_wrap = True
    frame.margin_left = min(frame.margin_left, Inches(0.03))
    frame.margin_right = min(frame.margin_right, Inches(0.03))
    frame.margin_top = min(frame.margin_top, Inches(0.03))
    frame.margin_bottom = min(frame.margin_bottom, Inches(0.03))
    for paragraph in frame.paragraphs:
        for run in paragraph.runs:
            if run.font.size is None or run.font.size < Pt(10.5):
                run.font.size = Pt(10.5)
            run.font.name = "Pretendard"
            styled_runs += 1
assert styled_runs >= 42, "Editable table text runs not located"

# Retain the scope/assumption disclosure at the bottom, but avoid tiny footnote text.
notes = 0
for shape in last.shapes:
    if not shape.has_text_frame:
        continue
    if "현금수지는 매출에서" not in shape.text:
        continue
    for paragraph in shape.text_frame.paragraphs:
        for run in paragraph.runs:
            current = run.font.size
            if current is None or current < Pt(10.5):
                run.font.size = Pt(10.5)
            run.font.name = "Pretendard"
            notes += 1
assert notes > 0, "Financial disclosure note not found"

assert snapshot(prs) == before, "Financial copy or numerical values changed"
prs.core_properties.keywords = ((prs.core_properties.keywords or "") + " " + MARKER).strip()
prs.save(PPTX)
verified = Presentation(PPTX)
assert len(verified.slides) == 9
assert snapshot(verified) == before
assert MARKER in (verified.core_properties.keywords or "")
print("PASS FootMate 9-slide final table and financial footnote readability; text and charts unchanged")
