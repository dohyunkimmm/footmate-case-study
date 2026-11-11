"""Refresh FootMate's public ten-slide strategic deck without changing underlying numbers.
Keep editable charts/tables and existing Tossface web icon assets unchanged.
"""
from pathlib import Path
from pptx import Presentation

src=Path("src/case-study/downloads/footmate_report.pptx")
prs=Presentation(src)
assert len(prs.slides)==10

if "strategy-20261107" in (prs.core_properties.keywords or ""):
    assert any("5개년 경영계획 · 투자·성과관리 시나리오" in sh.text
               for sh in prs.slides[9].shapes if sh.has_text_frame)
    print("PASS FootMate: reviewed strategy file already aligned; no resave")
    raise SystemExit(0)

replacements={
  1:[("공급·참가·거래 데이터를 IT 투자와 운영 판단에 연결",
      "공급 확대·수익성·IT 투자를 경영성과 관리에 연결")],
  10:[("5개년 경영계획 · 제휴 공급 확대 시나리오",
       "5개년 경영계획 · 투자·성과관리 시나리오")],
}

def swap(slide,old,new):
    matches=0
    for shape in slide.shapes:
        frames=[]
        if shape.has_text_frame:frames.append(shape.text_frame)
        if shape.has_table:frames.extend(c.text_frame for row in shape.table.rows for c in row.cells)
        for frame in frames:
            for p in frame.paragraphs:
                v="".join(run.text for run in p.runs)
                if old in v:
                    assert v.count(old)==1,old
                    if p.runs:
                        p.runs[0].text=v.replace(old,new)
                        for run in p.runs[1:]:run.text=""
                    else:p.text=v.replace(old,new)
                    matches+=1
                elif new in v:
                    matches+=1
    assert matches==1,(old,matches)

before=[tuple(tuple(s.values) for s in sh.chart.series) for sh in prs.slides[4].shapes if sh.has_chart]
assert len(before)==1
for num,pairs in replacements.items():
    for old,new in pairs:swap(prs.slides[num-1],old,new)

font_count=0
for slide in prs.slides:
    for shape in slide.shapes:
        frames=[]
        if shape.has_text_frame:frames.append(shape.text_frame)
        if shape.has_table:frames.extend(c.text_frame for row in shape.table.rows for c in row.cells)
        for tf in frames:
            for p in tf.paragraphs:
                p.font.name="Pretendard"
                for run in p.runs:
                    run.font.name="Pretendard"
                    font_count+=1
        if shape.has_chart:
            c=shape.chart
            if c.has_legend:c.legend.font.name="Pretendard"
            c.category_axis.tick_labels.font.name="Pretendard"
            c.value_axis.tick_labels.font.name="Pretendard"
prs.core_properties.keywords=((prs.core_properties.keywords or "")+" strategy-20261107").strip()
prs.save(src)
check=Presentation(src)
assert len(check.slides)==10
after=[tuple(tuple(s.values) for s in sh.chart.series) for sh in check.slides[4].shapes if sh.has_chart]
assert before==after, "Source chart values were modified"
assert all(any(new in sh.text for sh in check.slides[n-1].shapes if sh.has_text_frame) for n,edits in replacements.items() for old,new in edits)
print("PASS FootMate: 10 editable slides, original chart values preserved, Pretendard runs:",font_count)
