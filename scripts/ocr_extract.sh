#!/usr/bin/env bash
set -euo pipefail

# OCR pipeline for scanned Bhagavad Gita PDF.
# Usage:
#   ./scripts/ocr_extract.sh /absolute/path/BhagvadGita.pdf

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 /absolute/path/BhagvadGita.pdf"
  exit 1
fi

PDF="$1"
OUT_DIR="data/ocr"
IMG_DIR="$OUT_DIR/pages"
TXT_DIR="$OUT_DIR/text"
mkdir -p "$IMG_DIR" "$TXT_DIR"

# Convert each page to image
pdftoppm -jpeg -r 220 "$PDF" "$IMG_DIR/page" >/dev/null

# OCR every page
for img in "$IMG_DIR"/*.jpg; do
  base=$(basename "$img" .jpg)
  tesseract "$img" "$TXT_DIR/$base" -l eng+hin+san --oem 1 --psm 6 >/dev/null 2>&1 || true
done

echo "OCR text exported to $TXT_DIR"
echo "Next step: clean and map verses into data/shlokas-full.json"
