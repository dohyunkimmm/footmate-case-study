#!/usr/bin/env python3
"""Temporary audit for the three selected editable presentation slides."""
import json
from pathlib import Path
from pptx import Presentation

BASE=Path(__file__).resolve().parents[1]/"src/case-study/downloads"
for label, name, positions in [
    ("report","footmate_report.pptx",[8,9]),
    ("strategy","footmate_5year_strategy.pptx",[4])
]:
    ppt=Presentation(BASE/name)
    for number in positions:
        slide=ppt.slides[number-1]
        print("SLIDE_GEOMETRY",label,number,"SIZE",round(ppt.slide_width/914400,2),round(ppt.slide_height/914400,2))
        for i,sh in enumerate(slide.shapes):
            v={"i":i,"id":sh.shape_id,"name":sh.name,
               "type":str(sh.shape_type),
               "box":[round(getattr(sh,k)/914400,3) for k in ("left","top","width","height")]}
            if getattr(sh,"has_text_frame",False) and sh.text.strip():
                v["text"]=sh.text.replace("\n"," | ")[:125]
                sizes=sorted(set(round(run.font.size.pt,1) for p in sh.text_frame.paragraphs for run in p.runs if run.font.size))
                if sizes:v["font_sizes"]=sizes
            if getattr(sh,"has_table",False):
                v["table"]={"rows":len(sh.table.rows),"cols":len(sh.table.columns),
                    "col_widths":[round(c.width/914400,3) for c in sh.table.columns],
                    "row_heights":[round(r.height/914400,3) for r in sh.table.rows],
                    "headings":[[c.text.strip().replace("\n"," ")[:45] for c in row.cells] for row in list(sh.table.rows)[:2]]}
            if getattr(sh,"has_chart",False):
                v["chart"]={"series":len(sh.chart.series),"values":[list(s.values) for s in sh.chart.series]}
            print("SHAPE",json.dumps(v,ensure_ascii=False,separators=(",",":")))
