"""Update editable FootMate slide 5 chart using original embedded values.

Executed during the existing PPTX -> PDF -> PNG preview generation workflow.
No scenario figures or chart points are invented or changed.
"""
from pathlib import Path
import sys
from pptx import Presentation
from pptx.util import Inches,Pt
from pptx.dml.color import RGBColor
from pptx.enum.chart import XL_LEGEND_POSITION

src=Path(sys.argv[1] if len(sys.argv)>1 else "src/case-study/downloads/footmate_report.pptx")
prs=Presentation(src)
assert len(prs.slides)==10
marker="footmate-monthly-chart-v4"
if marker in (prs.core_properties.keywords or ""):
    print("PASS FootMate chart: already improved")
    sys.exit(0)

slide=prs.slides[4]
charts=[sh.chart for sh in slide.shapes if sh.has_chart]
assert len(charts)==1, f"FootMate page 5: expected one editable chart, got {len(charts)}"
chart=charts[0]
assert len(chart.series)==2, f"FootMate page 5: expected plan and revised forecast series, got {len(chart.series)}"
before=tuple(tuple(series.values) for series in chart.series)
assert all(len(series)==12 for series in before), "All 12 months must remain present"
assert all(v is not None for series in before for v in series),"Monthly series includes a missing value"

# Contrast: plan = forest green; updated outlook = bright, clearly distinct lime.
for series,color in zip(chart.series,(RGBColor(17,65,48),RGBColor(158,199,83))):
    series.format.fill.solid()
    series.format.fill.fore_color.rgb=color
chart.has_legend=True
chart.legend.position=XL_LEGEND_POSITION.BOTTOM
chart.legend.font.name="Pretendard"
chart.legend.font.size=Pt(12)
chart.value_axis.visible=True
chart.value_axis.tick_labels.font.name="Pretendard"
chart.value_axis.tick_labels.font.size=Pt(10.5)
chart.value_axis.tick_labels.number_format='#,##0'
chart.value_axis.has_major_gridlines=True
chart.value_axis.major_gridlines.format.line.color.rgb=RGBColor(224,234,224)
chart.value_axis.major_gridlines.format.line.width=Pt(.5)

# Replace generic note with exact differences from the underlying chart data.
def signed_money(v):
    return ("+" if v>0 else "−" if v<0 else "±")+f"{abs(v):,.0f}원"
diffs=[before[1][i]-before[0][i] for i in (0,5,11)]
note="계획 대비 손익 차이  |  "+ " · ".join(f"{n}월 {signed_money(d)}" for n,d in zip((1,6,12),diffs))
notes=[sh for sh in slide.shapes if sh.has_text_frame and ("상반기 모형 거래" in sh.text or "하반기 전망 비교" in sh.text)]
assert len(notes)==1, f"Expected original month-by-month commentary, found {len(notes)}"
sh=notes[0]
sh.text=note
sh.top=Inches(6.12)
sh.left=Inches(.67)
sh.width=Inches(12.0)
sh.height=Inches(.45)
for para in sh.text_frame.paragraphs:
    for run in para.runs:
        run.font.name="Pretendard";run.font.size=Pt(15);run.font.bold=True
        run.font.color.rgb=RGBColor(30,78,53)

prs.core_properties.keywords=((prs.core_properties.keywords or "")+" "+marker).strip()
prs.save(src)
result=Presentation(src)
charts2=[sh.chart for sh in result.slides[4].shapes if sh.has_chart]
assert len(charts2)==1
assert tuple(tuple(series.values) for series in charts2[0].series)==before,"Chart series unexpectedly changed"
assert note in "\n".join(sh.text for sh in result.slides[4].shapes if sh.has_text_frame)
print("PASS FootMate visual chart QA: 12 months and two original series, readable currency axis, stronger contrast, 1/6/12 differences")
