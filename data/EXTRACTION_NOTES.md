# Bhagavad Gita Full Extraction Notes

The provided `BhagvadGita.pdf` is a scanned/image PDF. `pdftotext` returns no usable text, so OCR is required.

## Run OCR

```bash
./scripts/ocr_extract.sh /Users/vivekpatole/Downloads/BhagvadGita.pdf
```

## What this does

- Splits all PDF pages to JPEG files.
- Runs `tesseract` OCR for English + Hindi + Sanskrit hints.
- Stores raw OCR text in `data/ocr/text`.

## Why manual cleanup is still needed

OCR on Sanskrit/Devanagari mixes glyphs and punctuation. Verse boundary cleanup is needed before auto-loading all 700 verses.

## Current app status

The app is already functional with seeded multilingual shlokas in `assets/js/shlokas.js`, daily assignment logic, streaks, and achievements.

## Completed first OCR pass

First pass output is available at:

- `data/ocr/first-pass/first_pass_raw.txt`

Commands executed:

```bash
./scripts/ocr_first_pass.sh /Users/vivekpatole/Downloads/BhagvadGita.pdf 1 18
./scripts/ocr_first_pass.sh /Users/vivekpatole/Downloads/BhagvadGita.pdf 80 130
./scripts/generate_shlokas_full.py
```

This generated:

- `data/shlokas-full.json` (701 verse slots with known translations + OCR pending placeholders)
- `assets/js/shlokas-full.js` (same dataset for browser use)
