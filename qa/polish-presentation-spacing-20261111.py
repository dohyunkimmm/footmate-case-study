#!/usr/bin/env python3
"""Proofread the *editable* FootMate presentation text and verify 15-slide geometry.

Only typographic whitespace is changed. No financial number, chart series,
slide position, size, or text style is intentionally modified.
Safe to re-run after preview generation.
"""
from __future__ import annotations

import re
import sys
from collections import Counter
from pathlib import Path
from pptx import Presentation

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "src" / "case-study" / "downloads"
DECKS = (
    ("report", ASSETS / "footmate_report.pptx", 9),
    ("strategy", ASSETS / "footmate_5year_strategy.pptx", 6),
)
NUMERIC = re.compile(r"(?<!\d)[+\-−–]?\d[\d,]*(?:\.\d+)?%?")
YEAR = re.compile(r"(\d+)\s*년\s*차(?=\b|[^가-힣])")
MONEY = re.compile(r"(\d[\d,]*(?:\.\d+)?)\s+만\s*원")
COUNTERS = re.compile(r"(\d[\d,]*(?:\.\d+)?)\s+(?=개년|개월|곳|건|회|명|석|주|원|%)")
BEFORE_PUNCT = re.compile(r"(?<=[가-힣0-9)])\s+([,:])")
OPEN_PAREN = re.compile(r"\(\s+")
CLOSE_PAREN = re.compile(r"\s+\)")

def cleaned(text: str) -> str:
    text = YEAR.sub(r"\1년 차", text)
    text = MONEY.sub(r"\1만 원", text)
    text = COUNTERS.sub(r"\1", text)
    text = BEFORE_PUNCT.sub(r"\1", text)
    text = OPEN_PAREN.sub("(", text)
    text = CLOSE_PAREN.sub(")", text)
    return text

def frames(slide):
    for shape in slide.shapes:
        if getattr(shape, "has_text_frame", False):
            yield shape.text_frame
        if getattr(shape, "has_table", False):
            for row in shape.table.rows:
                for cell in row.cells:
                    yield cell.text_frame

def runs(slide):
    for frame in frames(slide):
        for paragraph in frame.paragraphs:
            for run in paragraph.runs:
                yield run

def numbers(slide):
    return [token for run in runs(slide) for token in NUMERIC.findall(run.text)]

def charts(slide):
    return [tuple(tuple(series.values) for series in shape.chart.series)
            for shape in slide.shapes if getattr(shape, "has_chart", False)]

def coordinates(slide):
    return [(shape.left, shape.top, shape.width, shape.height)
            for shape in slide.shapes]

def inspect_geometry(deck, label):
    # Editable text should stay on the visible canvas. Decorative shapes are
    # intentionally excluded because they can extend beyond its edges.
    issues = []
    for page, slide in enumerate(deck.slides, 1):
        for shape in slide.shapes:
            if not getattr(shape, "has_text_frame", False) or not shape.text.strip():
                continue
            if shape.left < -9144 or shape.top < -9144 or \
               shape.left + shape.width > deck.slide_width + 9144 or \
               shape.top + shape.height > deck.slide_height + 9144:
                issues.append((page, shape.name, shape.text[:32]))
    if issues:
        print("TEXT_GEOMETRY_WARN", label, issues[:20])
    else:
        print("TEXT_GEOMETRY_OK", label)
    return issues

def main():
    check_only = "--check" in sys.argv[1:]
    changes = Counter()
    total = 0
    for label, path, expected in DECKS:
        deck = Presentation(path)
        assert len(deck.slides) == expected, (label, len(deck.slides))
        original = [(numbers(sl), charts(sl), coordinates(sl)) for sl in deck.slides]
        changed = 0
        cross_run = []
        for page, slide in enumerate(deck.slides, 1):
            for run in runs(slide):
                old = run.text
                new = cleaned(old)
                if old != new:
                    if check_only:
                        raise AssertionError((label, page, "unnormalized", old, new))
                    if NUMERIC.findall(old) != NUMERIC.findall(new):
                        raise AssertionError((label, page, "number changed", old, new))
                    run.text = new
                    changed += 1
                    changes[label, page] += 1
            # Detect candidates that span rich-text boundaries instead of
            # collapsing multiple runs and destroying their formatting.
            for frame in frames(slide):
                for para in frame.paragraphs:
                    whole = "".join(run.text for run in para.runs)
                    if cleaned(whole) != whole:
                        cross_run.append((page, whole[:100]))
        if cross_run:
            print("CROSS_RUN_REVIEW", label, cross_run[:15])
            raise AssertionError("Spacing issues span multiple styled runs")
        for index, slide in enumerate(deck.slides):
            assert (numbers(slide), charts(slide), coordinates(slide)) == original[index], \
                (label, index + 1, "numeric/chart/geometry drift")
        inspect_geometry(deck, label)
        if changed:
            deck.save(path)
            check = Presentation(path)
            assert len(check.slides) == expected
            for index, slide in enumerate(check.slides):
                assert (numbers(slide), charts(slide), coordinates(slide)) == original[index], \
                    (label, index + 1, "post-save numeric/chart/geometry drift")
                assert all(cleaned(run.text) == run.text for run in runs(slide))
        total += changed
        print("PROOFREAD_DECK", label, "slides", expected, "text_runs_fixed", changed)
    print("PROOFREAD_SUMMARY", "slides", 15, "runs_fixed", total,
          "by_slide", dict(sorted((str(k), v) for k,v in changes.items())))
    if check_only:
        print("PASS: all 15 editable slides pass Korean unit, punctuation and geometry checks")
    else:
        print("PASS: presentation typography normalized without changing numbers/charts/layout")

if __name__ == "__main__":
    main()
