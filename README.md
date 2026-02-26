# DailyShloka

Bhagavad Gita themed static website with:

- Account login/register with language preference (Sanskrit/English/Hindi)
- One unique daily shlok per user, streaks, and 40 achievements
- Daily meaning + spiritual action goal + next-day completion prompt
- Chapter browser across all 18 chapters (701 verse slots)
- Author page, contact+feedback page, and bug report page
- Audio support (speech synthesis + ambient spiritual tones)

## Local run

Open `index.html` in a browser, or serve the folder with a static server.

## Data files

- `assets/js/shlokas.js`: curated daily shlok set
- `data/shlokas-full.json`: 701 full verse slots (known verses + OCR pending)
- `assets/js/shlokas-full.js`: browser-ready full verse dataset
- `data/ocr/first-pass/first_pass_raw.txt`: OCR first-pass raw text from PDF

## OCR utilities

```bash
./scripts/ocr_first_pass.sh /Users/vivekpatole/Downloads/BhagvadGita.pdf 80 130
./scripts/generate_shlokas_full.py
```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In GitHub: `Settings -> Pages -> Build and deployment -> Source: GitHub Actions`.
3. Workflow file: `.github/workflows/deploy-pages.yml`.

