#!/usr/bin/env python3
"""Render and compare all 21 PPTX slides against their website representations.

Requires libreoffice-impress, poppler-utils, Pillow, Node.js and Playwright.
This is a *cross-renderer raster regression*, not a claim of Microsoft
PowerPoint Desktop pixel identity. Every slide produces a three-panel image.
"""
from __future__ import annotations

import json
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageOps, ImageStat

ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT / "src" / "case-study"
OUT = ROOT / "test-results" / "visual-qa"
SIZE = (960, 540)
# Different rendering engines have unavoidable font antialiasing differences.
# These limits detect large visual regressions, not a zero-difference promise.
MAX_MAE = 25.0
MAX_STRONG_DIFFERENCE = 0.15

DECKS = [
    ("report", "footmate_report.pptx", 9, "report"),
    ("five-year", "footmate_5year_strategy.pptx", 6, "strategy"),
    ("business-strategy", "footmate_strategy_p0_p2.pptx", 6, None),
]


def run(command: list[str]) -> None:
    print("+", " ".join(command), flush=True)
    subprocess.run(command, cwd=ROOT, check=True, timeout=240)


def normalized(path: Path) -> Image.Image:
    if not path.is_file():
        raise AssertionError(f"Image missing: {path}")
    with Image.open(path) as source:
        return source.convert("RGB").resize(SIZE, Image.Resampling.LANCZOS)


def content_fraction(image: Image.Image) -> float:
    hist = ImageOps.grayscale(image).histogram()
    return sum(hist[:235]) / (SIZE[0] * SIZE[1])


def compare(name: str, number: int, rendered: Path, reference: Path) -> dict:
    a = normalized(rendered)
    b = normalized(reference)
    diff = ImageChops.difference(a, b)
    means = ImageStat.Stat(diff).mean
    mae = sum(means) / 3
    gray = ImageOps.grayscale(diff)
    strong_fraction = sum(gray.histogram()[51:]) / (SIZE[0] * SIZE[1])
    a_ink, b_ink = content_fraction(a), content_fraction(b)
    ok = (mae <= MAX_MAE and strong_fraction <= MAX_STRONG_DIFFERENCE
          and a_ink > 0.005 and b_ink > 0.005)

    panel = Image.new("RGB", (SIZE[0] * 3, SIZE[1] + 36), "#ffffff")
    heat = gray.point(lambda p: min(255, p * 4)).convert("RGB")
    panel.paste(a, (0, 36))
    panel.paste(b, (SIZE[0], 36))
    panel.paste(heat, (SIZE[0] * 2, 36))
    canvas = ImageDraw.Draw(panel)
    for index, label in enumerate(("PPTX / LibreOffice", "Website representation", "Pixel difference ×4")):
        canvas.text((index * SIZE[0] + 12, 10), label, fill="#111111")
    output = OUT / "comparisons" / f"{name}-{number:02d}.png"
    output.parent.mkdir(parents=True, exist_ok=True)
    panel.save(output, optimize=True)

    print(f"{name} #{number}: MAE={mae:.2f}/255, strong={strong_fraction:.1%}, "
          f"PPTX ink={a_ink:.1%}, web ink={b_ink:.1%}, {'PASS' if ok else 'FAIL'}", flush=True)
    return {
        "deck": name, "slide": number, "mae": round(mae, 3),
        "strong_difference_fraction": round(strong_fraction, 5),
        "rendered_ink_fraction": round(a_ink, 5),
        "reference_ink_fraction": round(b_ink, 5),
        "result": "PASS" if ok else "FAIL",
        "comparison_image": str(output.relative_to(ROOT)),
    }


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    results = []
    with tempfile.TemporaryDirectory(prefix="footmate-slides-") as scratch:
        work = Path(scratch)
        pdfs = work / "pdfs"
        pdfs.mkdir()
        sources = [str(CASE / "downloads" / filename) for _, filename, _, _ in DECKS]
        run([
            "libreoffice", "-env:UserInstallation=" + (work / "lo-profile").as_uri(),
            "--headless", "--convert-to", "pdf:impress_pdf_Export",
            "--outdir", str(pdfs), *sources,
        ])
        rendered = {}
        for name, filename, count, _ in DECKS:
            pdf = pdfs / (Path(filename).stem + ".pdf")
            assert pdf.is_file() and pdf.stat().st_size > 500, f"PDF export failed: {pdf}"
            prefix = str(work / name)
            run(["pdftoppm", "-r", "96", "-png", str(pdf), prefix])
            pages = sorted(work.glob(name + "-*.png"),
                           key=lambda p: int(p.stem.rsplit("-", 1)[-1]))
            assert len(pages) == count, f"{name}: expected {count} pages, got {len(pages)}"
            rendered[name] = pages

        web_dir = OUT / "web"
        run(["node", "qa/capture-strategy-web.cjs", str(web_dir)])
        assert len(list(web_dir.glob("strategy-web-*.png"))) == 6, "Expected six web renders"

        for name, _filename, count, folder in DECKS:
            for i in range(1, count + 1):
                reference = (
                    CASE / "previews" / folder / f"decision-{i}.jpg"
                    if folder else web_dir / f"strategy-web-{i:02d}.png"
                )
                results.append(compare(name, i, rendered[name][i - 1], reference))

    report = OUT / "report.json"
    report.write_text(json.dumps({
        "method": "LibreOffice headless PPTX → PDF → PNG versus website JPG/Chromium HTML",
        "resolution": list(SIZE),
        "max_mae": MAX_MAE,
        "max_strong_difference": MAX_STRONG_DIFFERENCE,
        "number_of_slides": len(results),
        "manual_renderer_notes": [
            {"deck": "report", "slide": 9,
             "note": "LibreOffice moves some title/footer text relative to the website; Microsoft PowerPoint Web was visually aligned with the website reference. Do not claim pixel identity across rendering engines."}
        ],
        "results": results,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = [
        "# FootMate 21-slide raster regression",
        "",
        "The 21 original PPTX slides were rendered by LibreOffice. Existing 15 slides",
        "were compared with their website JPG previews, and the six new slides with",
        "actual Chromium screenshots of the website. These are cross-renderer pixel",
        "comparisons, **not Microsoft PowerPoint Desktop pixel-identical output**.",
        "",
        "| Deck | Slide | Mean pixel difference / 255 | Pixels with difference > 50 | Result |",
        "| --- | ---: | ---: | ---: | --- |",
    ]
    for row in results:
        lines.append(f"| {row['deck']} | {row['slide']} | {row['mae']:.2f} | "
                     f"{100 * row['strong_difference_fraction']:.1f}% | {row['result']} |")
    lines.extend(["", "Each row has a three-panel comparison PNG in comparisons/.",
                  "", "## Renderer-specific visual note",
                  "Report slide 9: LibreOffice shifts selected text shapes compared with the website JPG.",
                  "An independent Microsoft PowerPoint Web visual check showed website-aligned title placement.",
                  "This does not establish exact Microsoft PowerPoint Desktop pixel identity."])
    (OUT / "README.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    assert len(results) == 21, f"Expected 21 slide comparisons, got {len(results)}"
    failed = [r for r in results if r["result"] != "PASS"]
    assert not failed, f"Visual regression: {len(failed)} slides exceeded limits: {failed}"
    print("PASS: 21/21 PPTX-versus-website pixel comparisons", flush=True)


if __name__ == "__main__":
    main()
