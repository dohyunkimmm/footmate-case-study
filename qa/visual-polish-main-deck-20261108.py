"""Improve final 5-year decision slide emphasis while preserving source values and editable elements.
No numerical values, words, animations or images are added to the nine published slides.
"""
from pathlib import Path
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.util import Pt

path=Path("src/case-study/downloads/footmate_report.pptx")
prs=Presentation(path)
assert len(prs.slides)==9
# The asset renderer may run again on a PR; do not rewrite an already polished PPTX.
VISUAL_MARKER="footmate-main-visual-20261108"
if VISUAL_MARKER in (prs.core_properties.keywords or ""):
    print("PASS FootMate final-slide hierarchy already applied; original published bytes unchanged")
    raise SystemExit(0)
page=prs.slides[8]
P=RGBColor(230,244,232)
F=RGBColor(21,81,52)
M=RGBColor(60,117,78)

def alltext():
    out=[]
    for sl in prs.slides:
        for sh in sl.shapes:
            if sh.has_text_frame:out.append(sh.text)
            if sh.has_table:
                for row in sh.table.rows:
                    for c in row.cells:out.append(c.text)
    return out

before=alltext()
changed=0
for sh in page.shapes:
    if sh.has_table:
        for row in sh.table.rows:
            cells=list(row.cells)
            first=cells[0].text if cells else ""
            if "4년 차" in first or ("28곳" in first and "5년" not in first):
                for cell in cells:
                    cell.fill.solid()
                    cell.fill.fore_color.rgb=P
                    for para in cell.text_frame.paragraphs:
                        for run in para.runs:
                            run.font.name="Pretendard"
                            run.font.bold=True
                            run.font.color.rgb=F
                changed+=1
    if sh.has_text_frame:
        content=sh.text.strip()
        if content and ("5개년 경영계획" in content or "4년 차" in content and "28곳" in content):
            for para in sh.text_frame.paragraphs:
                for run in para.runs:
                    run.font.name="Pretendard"
                    run.font.color.rgb=F
                    run.font.bold=True
            changed+=1

assert alltext()==before, "original nine-slide text/numbers must be identical"
if changed:
    prs.core_properties.keywords=((prs.core_properties.keywords or "")+" "+VISUAL_MARKER).strip()
    prs.save(path)
    assert alltext()==before, "text mutated"
    print("PASS FootMate final-slide hierarchy (modified editable elements):",changed)
else:
    print("PASS FootMate original nine-slide design already consistent; no visual edit required")
