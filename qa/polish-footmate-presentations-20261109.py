#!/usr/bin/env python3
"""Align editable FootMate decks and browser previews with the planning portfolio.
Preserve numerical assumptions, tables, geometry and original font sizes.
"""
from __future__ import annotations

import base64
import json
import re
import subprocess
from pathlib import Path
from tempfile import TemporaryDirectory

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.dml import MSO_COLOR_TYPE, MSO_FILL

ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT / "src/case-study"
DOWNLOADS = CASE / "downloads"
NAVY = RGBColor(20, 44, 57)
TEAL = RGBColor(8, 123, 96)
INK = RGBColor(27, 41, 49)
SLATE = RGBColor(82, 99, 109)
PAPER = RGBColor(245, 247, 246)
TINT = RGBColor(234, 245, 241)
LIME = RGBColor(205, 243, 93)
PALETTE = {
    # Existing strategy deck tokens
    "0F372C": NAVY, "1E6249": TEAL, "D1EEDD": TINT,
    "CAF7AC": LIME, "1E362E": INK, "657A6E": SLATE,
    "F8FBF8": PAPER,
    # Earlier business-report greens, if used as explicit RGB
    "0B4231": NAVY, "173329": INK, "155A40": TEAL,
    "326C50": TEAL, "E6F4E8": TINT, "EDF3ED": TINT,
}

def visit_runs(shape):
    if getattr(shape, "has_text_frame", False):
        for para in shape.text_frame.paragraphs:
            for run in para.runs:
                yield run
    if getattr(shape, "has_table", False):
        for row in shape.table.rows:
            for cell in row.cells:
                for para in cell.text_frame.paragraphs:
                    for run in para.runs:
                        yield run

def recolor(color):
    if color.type == MSO_COLOR_TYPE.RGB and color.rgb is not None:
        key = str(color.rgb).upper()
        if key in PALETTE:
            color.rgb = PALETTE[key]

def apply_color(shape):
    if getattr(shape, "has_text_frame", False) or getattr(shape, "has_table", False):
        for run in visit_runs(shape):
            if run.text:
                run.font.name = "Pretendard"
                recolor(run.font.color)
    try:
        if shape.fill.type == MSO_FILL.SOLID:
            recolor(shape.fill.fore_color)
    except (AttributeError, ValueError):
        pass
    try:
        if shape.line.fill.type == MSO_FILL.SOLID:
            recolor(shape.line.color)
    except (AttributeError, ValueError):
        pass
    if getattr(shape, "has_table", False):
        for row in shape.table.rows:
            for cell in row.cells:
                try:
                    if cell.fill.type == MSO_FILL.SOLID:
                        recolor(cell.fill.fore_color)
                except (AttributeError, ValueError):
                    pass

def replace_runs(slide, source, target):
    changed = 0
    for shape in slide.shapes:
        for run in visit_runs(shape):
            if source in run.text and (source != "400원" or run.text.strip() == source):
                changed += run.text.count(source)
                run.text = run.text.replace(source, target)
    return changed

main_path = DOWNLOADS / "footmate_report.pptx"
strategy_path = DOWNLOADS / "footmate_5year_strategy.pptx"
main = Presentation(main_path)
strategy = Presentation(strategy_path)
assert len(main.slides) == 9 and len(strategy.slides) == 6

checks = []
def rewrite(slides, targets, source, target, expected):
    targets = tuple(targets)
    changed = sum(replace_runs(slides[i], source, target) for i in targets)
    already = sum(run.text.count(target)
                  for i in targets for shape in slides[i].shapes for run in visit_runs(shape))
    if changed != expected and not (changed == 0 and already == expected):
        raise RuntimeError(f"Slide text mismatch ({changed}/{expected}): {source}")
    checks.append((source, target, changed))

rewrite(main.slides, range(9), "FootMate · 사업·IT 기획",
        "FootMate · 사업성 분석·경영계획", 9)
rewrite(main.slides, [0], "FootMate 경영계획·수익성·투자 판단",
        "FootMate 사업성 분석·경영계획", 1)
rewrite(main.slides, [4], "경유·취소·완료율 점검",
        "예약·취소·완료율 점검", 1)
rewrite(main.slides, [4], "400원", "+400원", 1)
rewrite(main.slides, [4], "CS·획득·IT비 점검",
        "고객 지원·확보·IT 비용 점검", 1)
rewrite(main.slides, [6], "36개월 기본 고정현금비 2,460만원",
        "36개월 운영·초기 구축비 2,460만 원", 1)
rewrite(main.slides, [6], "인력 기회비용 포함 9,660만원",
        "인력 기회비용 포함 9,660만 원", 1)
old_note = "가정 기반 분석 · 실제 계약·매출·운영 성과와 구분"
rewrite(main.slides, [0], old_note, "사업성 가정 · 실제 실적과 구분", 1)
rewrite(main.slides, [1, 4, 5], old_note, "사업성 검토 · 계획 시나리오", 3)

rewrite(strategy.slides, range(1, 5),
        "FOOTMATE  /  5-YEAR STRATEGY  /",
        "FootMate  /  5개년 경영계획  /", 4)
rewrite(strategy.slides, [0], "FOOTMATE", "FootMate", 1)
rewrite(strategy.slides, [0], "중장기 경영전략 및 수익성 개선",
        "5개년 경영계획·수익성 개선", 1)
rewrite(strategy.slides, [5], "FOOTMATE  /  경영진 의사결정",
        "FootMate  /  투자 판단", 1)
rewrite(strategy.slides, [5], "3  월별 실적 차이와 현금수지로 5개년 계획 점검",
        "3  월별 계획 차이·현금수지로 경영계획 점검", 1)
rewrite(strategy.slides, [5], "재무값은 계획 시나리오",
        "재무 수치는 계획 시나리오", 1)


# Slide-by-slide concision review (all nine report and six strategy slides).
rewrite(main.slides, [3], "복합 협상안: 관리비 제외 약 23곳 · 추가 관리비 포함 약 28곳(가정)",
        "복합안 손익분기 · 관리비 제외 약 23곳 / 포함 약 28곳(가정)", 1)
rewrite(main.slides, [6], "36개월 비용 참고치 · 다음 장은 12개월 분석. 변동비·추가 투자·세금 별도.",
        "36개월 비용 기준 · 다음 장은 12개월 분석. 변동비·추가 투자·세금 별도.", 1)
rewrite(main.slides, [7], "12개월 예약 가정 · 구축 300만 원·시범 50만 원 포함\n충당률 100% = 손익률 0%",
        "12개월 동일 예약 가정 · 구축 300만 원·시범 50만 원 포함\n충당률 100% = 손익률 0%", 1)
rewrite(main.slides, [8], "현금수지는 매출에서 거래·운영비와 투자비를 차감한 값 · 인력 기회비용 별도",
        "현금수지 = 매출 − 거래·운영비 − 투자비 · 기회비용 별도", 1)
rewrite(main.slides, [8], "운영자 제휴형 우선 · 8주 검증 → 지역별 손익·가용 현금 심사 → 추가 투자",
        "제휴형 우선 · 8주 검증 → 지역 손익·가용 현금 심사 → 추가 투자", 1)
rewrite(strategy.slides, [0], "5개년 계획 → 수익성 개선 → KPI 관리 → 투자·자원 배분",
        "수익성 개선 → 성과관리·예산 배분 → 단계별 투자", 1)
rewrite(strategy.slides, [1], "관리 지표: 공급 유지율 · 월 완료 예약 · 30일 재참가 · 건당 공헌이익 · 운영비",
        "관리 지표 · 공급 유지·완료 예약·30일 재참가·공헌이익·운영비", 1)
rewrite(strategy.slides, [1], "공급처 수는 계획 시나리오이며, 연차별 투자규모는 계약·운영 상황에 따라 조정합니다.",
        "공급처는 목표치이며, 투자 규모는 계약·운영 여건에 따라 조정합니다.", 1)
rewrite(strategy.slides, [2], "관리비 제외 시 약 23곳. 제휴 조건별 수익성 변화를 구분하여 판단합니다.",
        "관리비 제외 시 약 23곳 · 계약 조건별 수익성 비교", 1)
rewrite(strategy.slides, [3], "1년 차 기준 340원 · 2년 차부터 개선안 940원 · 추가 관리비·기회비용 반영",
        "1년 차 340원 · 2년 차부터 940원 · 관리비·기회비용 반영", 1)
rewrite(strategy.slides, [3], "건당 공헌이익 340원 → 940원 · 월 경제적 손익은 기존 연간 투자 후 현금수지와 별도 기준",
        "월 경제적 손익과 연간 투자 후 현금수지는 별도 기준", 1)
rewrite(strategy.slides, [4], "관리 주기: 월간 성과 분석 / 분기별 경영계획·투자 재검토",
        "관리 주기 · 월간 성과 / 분기별 계획·투자 검토", 1)
rewrite(strategy.slides, [5], "3  월별 계획 대비 차이와 현금수지로 5개년 계획 점검",
        "3  월별 계획 차이·현금수지로 경영계획 점검", 1)

# Remove an isolated vertical bar in the strategy cover (an old placeholder).
for shape in strategy.slides[0].shapes:
    for run in visit_runs(shape):
        if run.text.strip() == "|":
            run.text = ""

# Check every slide's long text runs, preserving numeric cards and actual data.
for deck_name, deck in (("report", main), ("strategy", strategy)):
    for index, slide in enumerate(deck.slides, 1):
        for shape in slide.shapes:
            for run in visit_runs(shape):
                for line in run.text.splitlines():
                    if len(line) > 50:
                        raise RuntimeError(
                            f"Long slide description {deck_name}/{index}: {len(line)} characters: {line}"
                        )


for deck in (main, strategy):
    for slide in deck.slides:
        for shape in slide.shapes:
            apply_color(shape)
main.save(main_path)
strategy.save(strategy_path)

# PDF renders are also the source of the published, clickable slide thumbnails.
with TemporaryDirectory(prefix="footmate-slide-sync-") as temporary:
    tmp = Path(temporary)
    for path in (main_path, strategy_path):
        subprocess.run(["libreoffice", "-env:UserInstallation=file:///tmp/footmate-polish-" + path.stem,
                        "--headless", "--convert-to", "pdf", "--outdir", str(tmp), str(path)],
                       check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        assert (tmp / (path.stem + ".pdf")).exists(), "Slide PDF conversion failed"
    subprocess.run(["pdftoppm", "-r", "96", "-png",
                    str(tmp / "footmate_report.pdf"), str(tmp / "report")], check=True)
    subprocess.run(["pdftoppm", "-r", "96", "-jpeg",
                    "-jpegopt", "quality=85",
                    str(tmp / "footmate_5year_strategy.pdf"), str(tmp / "strategy")], check=True)
    preview_file = CASE / "report-previews.js"
    raw = preview_file.read_text(encoding="utf-8").strip()
    prefix = "window.REPORT_SLIDES="
    assert raw.startswith(prefix) and raw.endswith(";")
    previews = json.loads(raw[len(prefix):-1])
    assert len(previews) == 9
    for i, slide in enumerate(previews, 1):
        png = tmp / f"report-{i}.png"
        assert png.exists()
        content = png.read_bytes()
        assert content.startswith(bytes.fromhex("89504e470d0a1a0a")) and len(content) > 5000
        slide["src"] = "data:image/png;base64," + base64.b64encode(content).decode("ascii")
    preview_file.write_text(prefix + json.dumps(previews, ensure_ascii=False, separators=(",", ":")) + ";\n",
                            encoding="utf-8")
    strategy_dir = CASE / "previews/strategy"
    strategy_dir.mkdir(parents=True, exist_ok=True)
    for i in range(1, 7):
        jpg = tmp / f"strategy-{i}.jpg"
        assert jpg.exists() and jpg.read_bytes().startswith(bytes.fromhex("ffd8ff"))
        (strategy_dir / f"slide-{i}.jpg").write_bytes(jpg.read_bytes())

print("PASS: revised 9+6 slide texts and generated 9 PNG + 6 JPG previews", len(checks))
