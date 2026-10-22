"""Best-effort figure previews for public PDFs linked from the All Papers list.

Downloads are temporary. Original links and publication text remain untouched.
"""

import html
import re
import subprocess
import tempfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urlsplit

from build_paper_previews import build


ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "index.html").read_text(encoding="utf-8")
all_papers = source.split('<div id="0000" class="paper-list">', 1)[1]
all_papers = all_papers.split('<div id="2026" class="paper-list">', 1)[0]
entries = re.findall(r"<li>(.*?)</li>", all_papers, re.S)
pdf_link = re.compile(r'<a\s+[^>]*href="([^"]*)"[^>]*>\s*pdf\s*</a>', re.I | re.S)
allowed_hosts = {"openreview.net", "arxiv.org", "www.arxiv.org", "openaccess.thecvf.com",
                 "papers.nips.cc", "proceedings.iclr.cc", "www.nature.com", "ieeexplore.ieee.org"}

# Verified alternate copies for sources that block automated preview extraction.
# These are used only for generating images; the published PDF links stay intact.
alternate_pdf_urls = {
    4: "https://arxiv.org/pdf/2605.13403",
    5: "https://arxiv.org/pdf/2609.19716",
    7: "https://arxiv.org/pdf/2609.12577",
    10: "https://arxiv.org/pdf/2609.13742",
    11: "https://raw.githubusercontent.com/mlresearch/v306/main/assets/zhang26as/zhang26as.pdf",
    12: "https://raw.githubusercontent.com/mlresearch/v306/main/assets/zhang26jo/zhang26jo.pdf",
    43: "https://ojs.aaai.org/index.php/AAAI/article/download/32548/34703",
}


def source_url(entry):
    match = pdf_link.search(entry)
    if not match:
        return None
    url = html.unescape(match[1])
    parts = urlsplit(url)
    if parts.scheme != "https" or parts.hostname not in allowed_hosts:
        return None
    if "arxiv.org/abs/" in url:
        url = url.replace("/abs/", "/pdf/")
    if not (".pdf" in url or "/pdf" in url):
        return None
    return url


def one(index, url):
    destination = ROOT / "common" / "img" / "paper-previews" / f"external-{index}.webp"
    if destination.exists():
        return index, "cached"
    with tempfile.TemporaryDirectory(prefix="ov3-external-pdf-") as temporary:
        pdf = Path(temporary) / f"external-{index}.pdf"
        result = subprocess.run(
            ["curl", "-L", "--fail", "--silent", "--show-error", "--max-time", "35",
             "--max-filesize", "25000000", "-A", "Mozilla/5.0", url, "-o", str(pdf)],
            capture_output=True, text=True, timeout=40,
        )
        if result.returncode or not pdf.exists() or pdf.open("rb").read(4) != b"%PDF":
            return index, f"unavailable ({result.returncode})"
        build(pdf)
        return index, "figure"


def main():
    jobs = [(index, source_url(entry)) for index, entry in enumerate(entries)]
    jobs = [(index, url) for index, url in jobs if url]
    jobs.extend(alternate_pdf_urls.items())
    print(f"Attempting {len(jobs)} public PDF links", flush=True)
    with ThreadPoolExecutor(max_workers=4) as pool:
        futures = [pool.submit(one, index, url) for index, url in jobs]
        for future in as_completed(futures):
            try:
                index, result = future.result()
                print(index, result, flush=True)
            except Exception as exc:
                print("error", exc, flush=True)


if __name__ == "__main__":
    main()
