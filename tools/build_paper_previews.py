"""Create small publication-card previews from local PDFs.

Requires PyMuPDF and Pillow. The largest placed figure in the opening pages is
used when available; otherwise a central crop of page two is used. Keep these
assets checked in so GitHub Pages does not need to run PDF tooling.
"""

from pathlib import Path
from io import BytesIO

import pymupdf
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "pub"
OUTPUT_DIR = ROOT / "common" / "img" / "paper-previews"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def visual_score(page, rect):
    pixmap = page.get_pixmap(matrix=pymupdf.Matrix(0.55, 0.55), clip=rect,
                             alpha=False)
    image = Image.open(BytesIO(pixmap.tobytes("png"))).convert("RGB")
    color = nonwhite = 0
    for red, green, blue in list(image.getdata())[::4]:
        low, high = min(red, green, blue), max(red, green, blue)
        if low < 220:
            nonwhite += 1
        if high - low > 28 and low < 225 and high > 80:
            color += 1
    return color * 3.5 + nonwhite * 0.45


def image_clusters(rectangles):
    clusters = []
    for anchor in sorted(rectangles, key=lambda value: value.y0):
        group = [rect for rect in rectangles
                 if anchor.y0 - 10 <= rect.y0 <= anchor.y0 + 175
                 and rect.y1 <= anchor.y0 + 205]
        if len(group) < 2:
            continue
        union = pymupdf.Rect(group[0])
        for rect in group[1:]:
            union.include_rect(rect)
        clusters.append(union)
    return clusters


def caption_crop(document):
    for page_index in range(min(7, len(document))):
        page = document[page_index]
        for block in page.get_text("blocks"):
            label = block[4].lstrip()
            if not label.startswith(("Figure 1", "Fig. 1", "Figure 2", "Fig. 2")):
                continue
            x0, y0, x1, _ = block[:4]
            if y0 < 160:
                continue
            if x0 >= page.rect.width * .45:
                left, right = page.rect.width * .49, page.rect.width * .94
            elif x1 <= page.rect.width * .55:
                left, right = page.rect.width * .07, page.rect.width * .51
            else:
                left, right = page.rect.width * .07, page.rect.width * .93
            height = 195 if right - left < page.rect.width * .55 else 250
            return page, pymupdf.Rect(left, max(30, y0 - height), right, y0 - 6)
    return None


def choose_crop(document):
    best = None
    for page_index in range(min(7, len(document))):
        page = document[page_index]
        page_area = page.rect.get_area()
        image_rects = []
        for image_info in page.get_images(full=True):
            image_rects.extend(rect & page.rect for rect in page.get_image_rects(image_info[0])
                               if (rect & page.rect).get_area() > 400)
        candidates = image_clusters(image_rects)
        candidates.extend(rect for rect in image_rects if rect.get_area() > 10000)
        candidates.extend(drawing["rect"] & page.rect for drawing in page.get_drawings()
                          if drawing["rect"].width > page.rect.width * 0.43
                          and drawing["rect"].height > 65)
        for rect in candidates:
            area = rect.get_area()
            if area < 9000 or area > page_area * 0.48 or rect.height > page.rect.height * 0.55:
                continue
            score = visual_score(page, rect) / (1 + page_index * 0.05)
            if best is None or score > best[0]:
                best = (score, page_index, rect)

    if best and best[0] > 170:
        _, page_index, rect = best
        page = document[page_index]
        if len(page.get_text("words", clip=rect)) > 90:
            caption = caption_crop(document)
            if caption:
                return *caption, False
        pad_x = min(24, rect.width * 0.06)
        pad_y = min(22, rect.height * 0.09)
        return page, pymupdf.Rect(rect.x0 - pad_x, rect.y0 - pad_y,
                                  rect.x1 + pad_x, rect.y1 + pad_y) & page.rect, False

    caption = caption_crop(document)
    if caption:
        return *caption, True

    for page_index in range(min(8, len(document))):
        page = document[page_index]
        for caption in ("Figure 1", "Fig. 1", "Figure 2", "Fig. 2"):
            found = page.search_for(caption)
            if found and found[0].y0 > 160:
                rect = page.rect
                y1 = found[0].y0 - 8
                return page, pymupdf.Rect(rect.x0 + rect.width * 0.07,
                                          max(rect.y0 + 35, y1 - 250),
                                          rect.x1 - rect.width * 0.07, y1), True

    page = document[min(1, len(document) - 1)]
    rect = page.rect
    return page, pymupdf.Rect(rect.x0 + rect.width * 0.075,
                              rect.y0 + rect.height * 0.19,
                              rect.x1 - rect.width * 0.075,
                              rect.y0 + rect.height * 0.60), True


def build(pdf):
    output = OUTPUT_DIR / f"{pdf.stem}.webp"
    document = pymupdf.open(pdf)
    page, crop, fallback = choose_crop(document)
    scale = min(2.2, 820 / max(crop.width, 1))
    pixmap = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), clip=crop,
                             alpha=False)
    image = Image.open(BytesIO(pixmap.tobytes("png"))).convert("RGB")
    image.thumbnail((960, 620), Image.Resampling.LANCZOS)
    image.save(output, "WEBP", quality=82, method=5)
    document.close()
    return "fallback" if fallback else "figure"


def main():
    counts = {"figure": 0, "fallback": 0, "cached": 0, "error": 0}
    for pdf in sorted(PDF_DIR.glob("*.pdf")):
        try:
            result = build(pdf)
            counts[result] += 1
            print(f"{result:8} {pdf.name}")
        except Exception as exc:
            counts["error"] += 1
            print(f"ERROR    {pdf.name}: {exc}")
    print(counts)


if __name__ == "__main__":
    main()
