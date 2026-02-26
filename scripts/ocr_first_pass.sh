#!/usr/bin/env bash
set -euo pipefail

PDF=${1:-/Users/vivekpatole/Downloads/BhagvadGita.pdf}
START_PAGE=${2:-1}
END_PAGE=${3:-24}

OUT_DIR="data/ocr/first-pass"
IMG_DIR="$OUT_DIR/pages"
TXT_DIR="$OUT_DIR/text"
mkdir -p "$IMG_DIR" "$TXT_DIR"

echo "Converting pages $START_PAGE to $END_PAGE..."
pdftoppm -jpeg -r 220 -f "$START_PAGE" -l "$END_PAGE" "$PDF" "$IMG_DIR/page" >/dev/null

echo "Running OCR..."
for img in "$IMG_DIR"/*.jpg; do
  b=$(basename "$img" .jpg)
  tesseract "$img" "$TXT_DIR/$b" -l eng+hin+san --oem 1 --psm 6 >/dev/null 2>&1 || true
done

cat "$TXT_DIR"/*.txt > "$OUT_DIR/first_pass_raw.txt" || true

echo "OCR first pass done."
echo "Raw output: $OUT_DIR/first_pass_raw.txt"
