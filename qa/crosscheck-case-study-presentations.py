#!/usr/bin/env python3
"""Cross-check public FootMate case-study copy, main PPT and 5-year PPT using stdlib."""
from __future__ import annotations
from html import unescape
from pathlib import Path
from xml.etree import ElementTree as ET
from zipfile import ZipFile
import json
import re

ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT / "src" / "case-study"
JAVASCRIPT = (CASE / "nine-sections.js").read_text(encoding="utf-8")
TABLES = re.compile(r"<table\b[^>]*>.*?</table>", re.S | re.I)
ROWS = re.compile(r"<tr\b[^>]*>.*?</tr>", re.S | re.I)
CELLS = re.compile(r"<(?:th|td)\b[^>]*>(.*?)</(?:th|td)>", re.S | re.I)
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
PR = "{http://schemas.openxmlformats.org/package/2006/relationships}"

def plain(source: str) -> str:
    return unescape(re.sub(r"<[^>]*>", " ", source)).replace("\u00a0", " ").strip()

def no_spaces(source: str) -> str:
    return re.sub(r"\s+", "", source).replace("-", "−")

def cell_rows(markup: str) -> list[list[str]]:
    return [[no_spaces(plain(value)) for value in CELLS.findall(row)]
            for row in ROWS.findall(markup)]

tail = JAVASCRIPT.split("const sections = ", 1)[1]
sections = json.loads(tail[:tail.index("];\n") + 1])
assert len(sections) == 9, "Case study must have nine body sections"
body = "\n".join(item["title"] + " " + item["lead"] + " " + item["body"] for item in sections)
assert "가상 데이터" in body and "가정" in body, "Hypothetical data disclaimer disappeared"
five_year = next(table for table in TABLES.findall(sections[7]["body"])
                 if "5개년 경영계획" in table)
rows = cell_rows(five_year)
matrix = {row[0]: row[1:] for row in rows if row}

assert matrix["제휴공급처"] == ["5곳", "12곳", "20곳", "28곳", "36곳"]
assert matrix["수수료매출"] == ["901", "2,595", "4,327", "6,058", "7,788"]
assert matrix["거래변동비"] == ["646", "901", "1,502", "2,104", "2,704"]
assert matrix["현금운영비"] == ["770", "972", "1,260", "1,548", "1,836"]
assert matrix["구축·확장투자비"] == ["300", "100", "150", "200", "250"]
assert matrix["투자후현금수지"] == ["−815", "622", "1,415", "2,207", "2,998"]
assert matrix["기존수수료·결제조건유지시현금수지"] == ["−815", "−459", "−388", "−318", "−247"]

def deck(path: Path) -> tuple[list[str],list[list[list[str]]]]:
    with ZipFile(path) as archive:
        rels = ET.fromstring(archive.read("ppt/_rels/presentation.xml.rels"))
        by_id = {r.get("Id"): r.get("Target") for r in rels.findall(PR + "Relationship")}
        pres = ET.fromstring(archive.read("ppt/presentation.xml"))
        slides = []
        tables = []
        for elem in pres.findall(".//" + P + "sldId"):
            target = by_id[elem.get(R + "id")].lstrip("/")
            full = target if target.startswith("ppt/") else "ppt/" + target
            root = ET.fromstring(archive.read(full))
            slides.append(" ".join(t.text or "" for t in root.iter(A + "t")))
            slide_tables = []
            for table in root.iter(A + "tbl"):
                for row in table.findall(A + "tr"):
                    slide_tables.append(["".join(t.text or "" for t in cell.iter(A + "t"))
                                         for cell in row.findall(A + "tc")])
            tables.append(slide_tables)
    return slides, tables

main, main_tables = deck(CASE / "downloads" / "footmate_report.pptx")
strategy, strategy_tables = deck(CASE / "downloads" / "footmate_5year_strategy.pptx")
assert len(main) == 9 and len(strategy) == 6, (len(main), len(strategy))
# Keep visible slide text in Pretendard; decorative icons on the web use Tossface.
for filename,count in (("footmate_report.pptx",9),("footmate_5year_strategy.pptx",6)):
    with ZipFile(CASE / "downloads" / filename) as font_deck:
        for number in range(1,count+1):
            part=f"ppt/slides/slide{number}.xml"
            slide_xml=font_deck.read(part)
            slide_tree=ET.fromstring(slide_xml)
            for chunk in slide_tree.iter(A + "t"):
                for line in (chunk.text or "").splitlines():
                    assert len(line) <= 50, (filename, number, "description too long", line)
            families=set(re.findall(rb'<a:(?:latin|ea|cs)\b[^>]*\btypeface="([^"]+)"',slide_xml))
            assert families and families <= {b"Pretendard"}, (filename,number,families)
# Editorial parity: public brand, slide typography and readable terminology.
assert all("FootMate · 사업성 분석·경영계획" in slide for slide in main), "Main slide footers use old branding"
assert all("사업·IT 기획" not in slide for slide in main), "Former project label remained in main deck"
assert "사업성 분석·경영계획" in main[0], "Main cover identity mismatch"
assert "예약·취소·완료율 점검" in main[4], "The monthly variance typo has returned"
assert "+400원" in main[4] and "400원" in main[4], "Monthly fee variance sign mismatch"
assert "고객 지원·확보·IT 비용 점검" in main[4], "Expense analysis label differs from body"
assert "경유·취소·완료율" not in main[4], "Old typo returned"
assert "36개월 운영·초기 구축비 2,460만 원" in main[6], "36-month cost scope unclear"
assert all("5개년 경영계획" in slide for slide in strategy[1:5]), "5-year deck headers are inconsistent"
assert "월별 계획 차이·현금수지" in strategy[-1], "Scenario comparison must remain distinct from actual sales"
assert "재무 수치는 계획 시나리오" in strategy[-1], "Financial scenario statement is ambiguous"
assert "복합안 손익분기" in main[3], "Fourth-slide concise decision label missing"
assert "현금수지 = 매출" in main[8], "Ninth-slide cash-flow calculation missing"
assert "12개월 동일 예약 가정" in main[7], "Identical monthly booking premise must be explicit in ROI"
assert "관리 지표 · 공급 유지" in strategy[1], "Five-year deck metric caption did not sync"
assert "월 경제적 손익과 연간 투자 후 현금수지는 별도 기준" in strategy[3], "Economic vs cash-flow distinction missing"
assert "월 공급·거래 시나리오" in body and "월 공급·거래 시나리오 · 플랫폼 예약·취소 반영 산정 기준" not in body, "Table caption still verbose"
assert "추적 완료자만 분모" in body, "30-day cohort denominator disclosure missing"
assert "인력 기회비용 월 200만 원 별도" in body, "Financial scenario assumptions missing"

assert "제안 일정 · 실제 성과 아님" not in body, "Redundant negative label returned"
assert "실제 결제·환불·운영자 정산은 아직 구축하지 않았다" not in body, "Unnecessary negative phrasing returned"

print("DECKS", len(main), len(strategy), "font: Pretendard")
assert "수익성" in main[0] and "운영자 제휴" in main[0]
assert all(str(i) in no_spaces(main[2]) for i in ("626", "751,200"))
assert all(term in no_spaces(main[3]) for term in ("340원", "940원", "2,766"))
minus_normalized = no_spaces(main[4]).replace("−", "-").replace("–", "-").replace("—", "-")
assert all(term in minus_normalized for term in ("-39,600", "-217,040")), minus_normalized
assert "단계적 투자" in main[-1] and "9" in main[-1]
final_copy = no_spaces(main[-1]).replace("−", "-").replace("–", "-").replace("—", "-")
for key in ("제휴공급처", "수수료매출", "구축·확장투자비", "투자후현금수지", "기존수수료·결제조건유지시현금수지"):
    for cell in matrix[key]:
        expected = cell.replace("−", "-").replace("–", "-")
        assert expected in final_copy, (key, expected)
for index in range(5):
    operating = int(matrix["거래변동비"][index].replace(",", "")) + int(matrix["현금운영비"][index].replace(",", ""))
    assert f"{operating:,}" in final_copy, (index, operating)
assert all(term in no_spaces(strategy[1]) for term in ("5곳", "12곳", "20곳", "28곳", "36곳"))
assert all(term in no_spaces(strategy[2]) for term in ("340원", "700원", "940원", "28곳"))
expected_economics = ["−238.7만원", "−139.8만원", "−69.6만원", "+0.6만원", "+70.7만원"]
assert all(term in no_spaces(strategy[3]) for term in expected_economics), strategy[3]
assert all("경영계획시나리오" in no_spaces(s) for s in strategy[1:5]), \
    "5-year strategy slide scenario identifier was removed"
assert all("기존9장발표자료보완" not in no_spaces(s) for s in strategy[1:5]), \
    "Removed cross-deck filler appeared again"

for name, content in [
    ("body", body), ("README", (ROOT / "README.md").read_text(encoding="utf-8")),
    ("strategy generator", (ROOT / "qa" / "build-footmate-strategy-appendix-20261107.py").read_text(encoding="utf-8")),
    ("main slides", " ".join(main)), ("strategy slides", " ".join(strategy))
]:
    assert not re.search(r"Rolling\s*Forecast|수정\s*전망|재예측", content, re.I), name
    assert not re.search(r"(?:기존|총|발표자료)\s*10장", content), name
assert "후속 구축 범위" in body, "Implementation status must be clearly identified"
assert "자료 보완" in body and "목표 재점검" in body
assert "공급·책임 불명확 시 보류" not in body
assert "구독료·전환율 미확정" not in body
print("PASS: body vs 9-slide report vs 6-slide strategy figures, copy, and decisions match")
