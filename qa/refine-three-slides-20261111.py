#!/usr/bin/env python3
"""Targeted, repeatable readability improvements for three FootMate PPT slides.

Scope: business report 08/09 and five-year strategy 04 only. Every text string,
editable chart value, slide count and non-targeted shape is preserved.
"""
from __future__ import annotations

import sys
from pathlib import Path
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.util import Inches, Pt

BASE=Path(__file__).resolve().parents[1]/"src/case-study/downloads"
FILES=(BASE/"footmate_report.pptx", BASE/"footmate_5year_strategy.pptx")
MARKER="footmate-priority-readability-20261111"
TEAL=RGBColor(8,123,96)
NAVY=RGBColor(20,44,57)
RED=RGBColor(156,67,57)
MINT=RGBColor(234,245,241)
MINT_LIGHT=RGBColor(242,249,246)
BASELINE=RGBColor(124,159,151)
EMU=914400

def shape_by_id(slide, identity):
    found=[s for s in slide.shapes if s.shape_id==identity]
    assert len(found)==1, (identity,len(found))
    return found[0]

def visual_text(slide):
    parts=[]
    for sh in slide.shapes:
        if getattr(sh,"has_text_frame",False):
            parts.append(("text",sh.shape_id,sh.text))
        if getattr(sh,"has_table",False):
            parts.append(("table",sh.shape_id,
                          tuple(tuple(c.text for c in row.cells) for row in sh.table.rows)))
    return tuple(parts)

def chart_values(slide):
    return tuple((sh.shape_id,tuple(tuple(series.values) for series in sh.chart.series))
                 for sh in slide.shapes if getattr(sh,"has_chart",False))

def scorecard(deck):
    return (tuple(visual_text(sl) for sl in deck.slides),
            tuple(chart_values(sl) for sl in deck.slides),
            tuple(len(sl.shapes) for sl in deck.slides))

def accent_runs(shape,color,bold=True,size=None):
    assert shape.has_text_frame
    for para in shape.text_frame.paragraphs:
        for run in para.runs:
            if run.text.strip():
                run.font.color.rgb=color
                if bold:run.font.bold=True
                if size is not None:run.font.size=Pt(size)

def accent_cell(cell,color,bold=True,size=None):
    for para in cell.text_frame.paragraphs:
        for run in para.runs:
            if run.text.strip():
                run.font.color.rgb=color
                if bold:run.font.bold=True
                if size is not None:run.font.size=Pt(size)

def improve_report_08(deck):
    slide=deck.slides[7]
    table=shape_by_id(slide,3).table
    assert len(table.rows)==5 and len(table.columns)==3
    assert table.cell(3,0).text.strip()=="확장"
    assert "−11.4%" in table.cell(3,2).text
    # Make the compared expansion row easy to locate without suppressing
    # the negative financial outcome.
    for cell in table.rows[3].cells:
        cell.fill.solid()
        cell.fill.fore_color.rgb=MINT
    accent_cell(table.cell(3,0), NAVY, size=15.0)
    accent_cell(table.cell(3,2), RED, size=16.0)
    print("DESIGN_08 scenario row highlighted; negative ROI remains red")

def improve_report_09(deck):
    slide=deck.slides[8]
    background=shape_by_id(slide,7)
    chart=shape_by_id(slide,62)
    table_title=shape_by_id(slide,61)
    assert getattr(chart,"has_chart",False)
    assert "연차별 산정 근거" in table_title.text
    # Share horizontal space more evenly: a native editable chart remains
    # left; the densely packed 7-column financial matrix gains ~14% width.
    original_left,original_width=background.left,background.width
    original_right=original_left+original_width
    new_left=Inches(7.0)
    new_width=original_right-new_left
    scale=new_width/original_width
    assert 1.12<scale<1.18,scale
    for sh in slide.shapes:
        if 7<=sh.shape_id<=54:
            sh.left=int(round(new_left+(sh.left-original_left)*scale))
            sh.width=int(round(sh.width*scale))
    table_title.left=new_left
    table_title.width=new_width
    chart.width=int(round(new_left-Inches(.15)-chart.left))
    assert chart.left+chart.width+Inches(.12)<new_left
    # The 4th-year row is the decision threshold; preserve exact values.
    fourth_background=shape_by_id(slide,39)
    fourth_background.fill.solid()
    fourth_background.fill.fore_color.rgb=MINT_LIGHT
    for identity in (40,41,45):  # 4th year, 28 partners, cash flow 2,207
        accent_runs(shape_by_id(slide,identity),TEAL)
    assert chart.width>=Inches(6.0)
    assert table_title.width>=Inches(5.4)
    print("DESIGN_09 matrix width",round(new_width/EMU,3),
          "chart width",round(chart.width/EMU,3),"fourth-year row highlighted")

def improve_strategy_04(deck):
    slide=deck.slides[3]
    zero=shape_by_id(slide,13)
    zero.line.color.rgb=BASELINE
    zero.line.width=Pt(1.6)
    accent_runs(shape_by_id(slide,14),NAVY)
    marker=shape_by_id(slide,28)
    size=Inches(.25)
    cx=marker.left+marker.width//2
    cy=marker.top+marker.height//2
    marker.left=cx-size//2
    marker.top=cy-size//2
    marker.width=size
    marker.height=size
    value=shape_by_id(slide,29)
    assert "+0.6만 원" in value.text
    accent_runs(value,TEAL,size=16.4)
    label=shape_by_id(slide,30)
    assert "4년 차 · 28곳" in label.text
    label.fill.solid()
    label.fill.fore_color.rgb=MINT
    accent_runs(label,TEAL,size=14.0)
    print("DESIGN_STRATEGY_04 break-even label, baseline, point emphasized")

def verify(report,strategy):
    r8=shape_by_id(report.slides[7],3).table
    assert r8.cell(3,0).fill.fore_color.rgb==MINT
    assert "−11.4%" in r8.cell(3,2).text
    r9=report.slides[8]
    chart=shape_by_id(r9,62)
    title=shape_by_id(r9,61)
    assert chart.width < Inches(6.35)
    assert title.width > Inches(5.4)
    assert chart.left+chart.width < title.left
    assert shape_by_id(r9,39).fill.fore_color.rgb==MINT_LIGHT
    s4=strategy.slides[3]
    assert shape_by_id(s4,30).fill.fore_color.rgb==MINT
    assert shape_by_id(s4,28).width==Inches(.25)
    assert "+0.6만 원" in shape_by_id(s4,29).text
    print("DESIGN_ASSERTIONS_PASS three selected slides")

def main():
    check="--check" in sys.argv[1:]
    report,strategy=(Presentation(p) for p in FILES)
    assert len(report.slides)==9 and len(strategy.slides)==6
    before=(scorecard(report),scorecard(strategy))
    flagged=[MARKER in (deck.core_properties.keywords or "")
             for deck in (report,strategy)]
    assert flagged[0]==flagged[1],flagged
    if not flagged[0]:
        assert not check, "Expected committed readable deck revisions"
        improve_report_08(report)
        improve_report_09(report)
        improve_strategy_04(strategy)
        for deck in (report,strategy):
            deck.core_properties.keywords=((deck.core_properties.keywords or "")+" "+MARKER).strip()
        assert before==(scorecard(report),scorecard(strategy)), "Slide text, numbers, chart data or shape counts changed"
        report.save(FILES[0])
        strategy.save(FILES[1])
    # Ensure editable PPTX round-trip retains all selected changes.
    final_r,final_s=(Presentation(p) for p in FILES)
    assert len(final_r.slides)==9 and len(final_s.slides)==6
    assert all(MARKER in (deck.core_properties.keywords or "") for deck in (final_r,final_s))
    verify(final_r,final_s)
    if check:
        assert before==(scorecard(final_r),scorecard(final_s))
    print("PASS: 9+6 slides; all text, numbers and native chart data preserved")

if __name__=="__main__":
    main()
