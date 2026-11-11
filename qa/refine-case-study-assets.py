"""Refresh the original FootMate workbook and slide deck with review-ready notes.

The synthetic source values remain unchanged. The XLSX package is updated with
the Python standard library to preserve the supplied workbook structure/styles.
Only explanatory text and independent, input-gated QA formulas are added.
"""
from __future__ import annotations

from pathlib import Path
from zipfile import ZipFile
from io import BytesIO
import xml.etree.ElementTree as ET
import sys

ROOT = Path(__file__).resolve().parents[1]
XLSX = ROOT / "src/case-study/downloads/footmate_model.xlsx"
PPTX = ROOT / "src/case-study/downloads/footmate_report.pptx"
MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
PKG = "http://schemas.openxmlformats.org/package/2006/relationships"
OFFICE = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
CTYPE = "http://schemas.openxmlformats.org/package/2006/content-types"
ET.register_namespace("", MAIN)


def tag(ns, name):
    return "{" + ns + "}" + name


def update_workbook():
    with ZipFile(XLSX, "r") as original:
        infos = original.infolist()
        parts = {item.filename: original.read(item.filename) for item in infos}
    if 'name="원장입력"'.encode('utf-8') in parts['xl/workbook.xml']:
        print('PASS workbook: ledger template and independent checks already installed')
        return

    sheets = {i: ET.fromstring(parts[f"xl/worksheets/sheet{i}.xml"]) for i in range(1, 6)}

    def cell(root, addr, *, formula=None, value=None, kind=None):
        rownum = int("".join(c for c in addr if c.isdigit()))
        data = root.find(tag(MAIN, "sheetData"))
        row = next((r for r in data.findall(tag(MAIN, "row"))
                    if int(r.get("r")) == rownum), None)
        if row is None:
            row = ET.SubElement(data, tag(MAIN, "row"), {"r": str(rownum)})
        found = next((c for c in row.findall(tag(MAIN, "c"))
                      if c.get("r") == addr), None)
        if found is None:
            found = ET.Element(tag(MAIN, "c"), {"r": addr})
            # Excel accepts cells in address order.
            def colnum(ref):
                v = 0
                for ch in ref:
                    if not ch.isalpha():
                        break
                    v = v * 26 + ord(ch) - 64
                return v
            order = colnum(addr)
            before = next((i for i, existing in enumerate(row)
                           if existing.tag == tag(MAIN, "c") and
                           colnum(existing.get("r", "")) > order), len(row))
            row.insert(before, found)
        for child in list(found):
            if child.tag in {tag(MAIN, "f"), tag(MAIN, "v"), tag(MAIN, "is")}:
                found.remove(child)
        found.attrib.pop("t", None)
        if formula is not None:
            ET.SubElement(found, tag(MAIN, "f")).text = formula.lstrip("=")
            if kind == "str":
                found.set("t", "str")
            ET.SubElement(found, tag(MAIN, "v")).text = "" if value is None else str(value)
        elif kind == "text":
            found.set("t", "inlineStr")
            is_el = ET.SubElement(found, tag(MAIN, "is"))
            ET.SubElement(is_el, tag(MAIN, "t")).text = str(value)
        else:
            ET.SubElement(found, tag(MAIN, "v")).text = str(value)
        return found

    # Section A: annual outlook variants; the existing six-month outlook is retained.
    report = sheets[1]
    cell(report, "D5", value="연중 가상 비용 추세", kind="text")
    gross = 0
    cash = 0
    for row in range(6, 18):
        def cached(col):
            el = next(x for x in sheets[3].findall(f".//{tag(MAIN, 'c')}")
                      if x.get("r") == f"{col}{row}")
            v = el.find(tag(MAIN, "v"))
            return float(v.text)
        cash += cached("I")
        gross += cached("H")
        cell(sheets[3], f"P{row}", formula=f"=H{row}", value=int(cached("H")))
        cell(sheets[3], f"Q{row}", formula=f"=I{row}", value=int(cached("I")))
    cell(sheets[3], "P5", value="연중 비용 추세 매출", kind="text")
    cell(sheets[3], "Q5", value="연중 비용 추세 손익", kind="text")
    cell(report, "D6", formula="=SUM('월별손익'!P6:P17)", value=int(gross))
    cell(report, "D7", formula="=SUM('월별손익'!Q6:Q17)", value=int(cash))
    cell(report, "D8", formula="=D7-12*'가정'!B14", value=int(cash - 24000000))
    cell(report, "A30", value="전망 비교 기준", kind="text")
    cell(report, "A31", value="계획: 2027년 매월 계획 산식. 수정: 1~6월 가상·7~12월 계획.", kind="text")
    cell(report, "A32", value="비용 추세: 1~12월 합성 거래 집계를 적용한 별도 가정(실제 실적 아님).", kind="text")

    # Section B: the original file has monthly synthetic aggregates, not a booking-level ledger.
    # Independent checks are explicitly gated on real per-reservation records.
    checks = sheets[5]
    formulae = {
        "B6": """=IF(COUNTA('원장입력'!A2:A501)=0,"원장 입력 후 확인",ROUND(SUM('원장입력'!E2:E501)-SUM('합성집계'!C6:C17),0))""",
        "B7": """=IF(COUNTA('원장입력'!A2:A501)=0,"원장 입력 후 확인",ROUND(SUM('원장입력'!E2:E501)-SUM('원장입력'!F2:I501)-12*'가정'!B13-SUM('월별손익'!I6:I17),0))""",
        "B8": """=IF(COUNTA('원장입력'!A2:A501)=0,"원장 입력 후 확인",SUMPRODUCT(('원장입력'!A2:A501<>"")*(COUNTIF('원장입력'!A2:A501,'원장입력'!A2:A501)>1)))""",
        "B9": """=IF(COUNTA('원장입력'!A2:A501)=0,"원장 입력 후 확인",SUMPRODUCT(('원장입력'!A2:A501<>"")*('원장입력'!D2:D501>'원장입력'!C2:C501)))""",
    }
    labels = {
        "A6": "예약별 원장·월 수수료 대조",
        "A7": "예약별 원장·월 현금손익 대조",
        "A8": "중복 예약 ID 행 수",
        "A9": "환불금액 상한 초과 건수",
        "C6": "원장 등록 후 0", "C7": "원장 등록 후 0",
        "C8": "원장 등록 후 0", "C9": "원장 등록 후 0",
        "A12": "현재 공개 파일은 합성 월별 집계입니다. 예약별 원장을 입력하면 검증값이 표시됩니다.",
        "A13": "실제 고객·결제·환불 자료는 별도 확인하며 합성 수치를 실제 실적으로 간주하지 않습니다.",
    }
    for addr, label in labels.items():
        cell(checks, addr, value=label, kind="text")
    for addr, formula in formulae.items():
        cell(checks, addr, formula=formula, value="원장 입력 후 확인", kind="str")

    ledger = ET.Element(tag(MAIN, "worksheet"))
    views = ET.SubElement(ledger, tag(MAIN, "sheetViews"))
    view = ET.SubElement(views, tag(MAIN, "sheetView"),
                         {"workbookViewId": "0", "showGridLines": "0"})
    ET.SubElement(view, tag(MAIN, "pane"), {"ySplit": "1", "topLeftCell": "A2",
                                            "activePane": "bottomLeft", "state": "frozen"})
    cols = ET.SubElement(ledger, tag(MAIN, "cols"))
    ET.SubElement(cols, tag(MAIN, "col"),
                  {"min": "1", "max": "11", "width": "19", "customWidth": "1"})
    ET.SubElement(ledger, tag(MAIN, "sheetData"))
    headers = ["예약 ID", "거래월", "결제금액(원)", "환불금액(원)", "수수료 매출(원)",
               "결제비(원)", "고객지원비(원)", "IT비(원)", "유입비(원)", "거래 상태", "입력 안내"]
    for col, title in zip("ABCDEFGHIJK", headers):
        cell(ledger, f"{col}1", value=title, kind="text")
    cell(ledger, "K2", value="예약별 확인 자료가 있을 때 A~J에 입력. 현재 자료는 비어 있습니다.", kind="text")
    cell(ledger, "K3", value="비교 전에 월별 합성집계와 동일 기간·대상인지 확인합니다.", kind="text")

    # Package sheet6 without altering existing sheets' styles and references.
    book = ET.fromstring(parts["xl/workbook.xml"])
    sheetlist = book.find(tag(MAIN, "sheets"))
    if not any(el.get("name") == "원장입력" for el in sheetlist):
        relationships = ET.fromstring(parts["xl/_rels/workbook.xml.rels"])
        ids = {r.get("Id") for r in relationships}
        rid = next(f"rId{i}" for i in range(1, 100) if f"rId{i}" not in ids)
        ET.SubElement(relationships, tag(PKG, "Relationship"), {
            "Id": rid,
            "Type": OFFICE + "/worksheet",
            "Target": "worksheets/sheet6.xml",
        })
        ET.SubElement(sheetlist, tag(MAIN, "sheet"), {
            "name": "원장입력",
            "sheetId": str(max(int(x.get("sheetId")) for x in sheetlist) + 1),
            tag(OFFICE, "id"): rid,
        })
        parts["xl/_rels/workbook.xml.rels"] = ET.tostring(relationships, encoding="utf-8",
                                                          xml_declaration=True)
        types = ET.fromstring(parts["[Content_Types].xml"])
        ET.SubElement(types, tag(CTYPE, "Override"), {
            "PartName": "/xl/worksheets/sheet6.xml",
            "ContentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml",
        })
        parts["[Content_Types].xml"] = ET.tostring(types, encoding="utf-8",
                                                   xml_declaration=True)
    calc = book.find(tag(MAIN, "calcPr"))
    if calc is None:
        calc = ET.SubElement(book, tag(MAIN, "calcPr"))
    calc.set("fullCalcOnLoad", "1")
    calc.set("forceFullCalc", "1")
    calc.set("calcMode", "auto")
    parts["xl/workbook.xml"] = ET.tostring(book, encoding="utf-8", xml_declaration=True)
    for i, root in sheets.items():
        parts[f"xl/worksheets/sheet{i}.xml"] = ET.tostring(root, encoding="utf-8",
                                                            xml_declaration=True)
    parts["xl/worksheets/sheet6.xml"] = ET.tostring(ledger, encoding="utf-8",
                                                    xml_declaration=True)
    output = BytesIO()
    with ZipFile(output, "w") as dest:
        for info in infos:
            dest.writestr(info, parts.pop(info.filename))
        for name, data in parts.items():
            dest.writestr(name, data)
    XLSX.write_bytes(output.getvalue())
    with ZipFile(XLSX) as check:
        assert check.testzip() is None
        assert b"SUMPRODUCT" in check.read("xl/worksheets/sheet5.xml")
        assert b"sheet6.xml" in check.read("xl/_rels/workbook.xml.rels")
    assert int(gross) == 18681100 and int(cash) == -4840730
    print("PASS workbook: independent ledger checks, annual outlook variants, source totals unchanged")


def update_presentation():
    from pptx import Presentation
    from pptx.util import Inches, Pt
    from pptx.dml.color import RGBColor
    prs = Presentation(PPTX)
    assert len(prs.slides) == 10
    marker = "footmate-review-20261104"
    if marker in (prs.core_properties.keywords or ""):
        print("PASS presentation: refinements already present")
        return

    def replace(slidenum, old, new):
        found = 0
        for shape in prs.slides[slidenum - 1].shapes:
            frames = []
            if shape.has_text_frame:
                frames.append(shape.text_frame)
            if shape.has_table:
                frames.extend(c.text_frame for row in shape.table.rows for c in row.cells)
            for tf in frames:
                for paragraph in tf.paragraphs:
                    for run in paragraph.runs:
                        if old in run.text:
                            run.text = run.text.replace(old, new)
                            found += 1
        print(f"Slide {slidenum}: {old[:26]} -> {found} replacement(s)")
        assert found > 0, f"Slide {slidenum} could not find: {old}"

    replace(4, "복합 협상 시 동일 조건의 공급처 약 23곳 필요",
            "복합 협상안: 관리비 제외 약 23곳 · 추가 관리비 포함 약 28곳(가정)")
    replace(7, "동시 요청·취소 복원·서버 검증",
            "참가·취소 복원 구현 · 동시 요청은 후속 검증")
    replace(7, "예약 ID·환불·수수료 대사",
            "유료 전환 전 원장·환불·정산 대사 설계")
    replace(8, "36개월 고정 TCO 2,460만원",
            "36개월 기본 고정현금비 2,460만원")
    replace(9, "12개월 예상 ROI", "12개월 비용 대비 예상 손익률")
    replace(9, "예상 ROI", "비용 대비 손익률")

    # Concise additional notes preserve original composition and source chart.
    additions = [
        (5, "6월 손익 차이 · 물량·단가·비용 영향 분석", 6.67),
        (8, "※ 거래 변동비·추가 투자·세금 등은 별도 산정합니다.", 6.70),
        (9, "산식: (연 수수료 매출 − 총현금비용) ÷ 총현금비용 · 가정 기반", 6.88),
    ]
    for number, note, top in additions:
        slide = prs.slides[number - 1]
        shape = slide.shapes.add_textbox(Inches(.72), Inches(top), Inches(11.75), Inches(.31))
        p = shape.text_frame.paragraphs[0]
        run = p.add_run()
        run.text = note
        run.font.name = "Pretendard"
        run.font.size = Pt(11)
        run.font.color.rgb = RGBColor(37, 87, 64)
    prs.core_properties.keywords = ((prs.core_properties.keywords or "") + " " + marker).strip()
    prs.save(PPTX)
    check = Presentation(PPTX)
    assert len(check.slides) == 10
    assert len([x for x in check.slides[4].shapes if x.has_chart]) == 1
    print("PASS presentation: ten editable slides and chart retained")


if __name__ == "__main__":
    update_workbook()
    update_presentation()
