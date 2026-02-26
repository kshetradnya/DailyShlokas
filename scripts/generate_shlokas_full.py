#!/usr/bin/env python3
import json
import os
import re
from datetime import datetime, timezone

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
source = open(os.path.join(ROOT, 'assets/js/shlokas.js'), 'r', encoding='utf-8').read()

counts_match = re.search(r'window\.VERSE_COUNTS\s*=\s*\{([\s\S]*?)\};', source)
if not counts_match:
    raise SystemExit('VERSE_COUNTS not found')

counts = {}
for m in re.finditer(r'(\d+)\s*:\s*(\d+)', counts_match.group(1)):
    counts[int(m.group(1))] = int(m.group(2))

objs = re.findall(r'\{\s*id:\s*"([^"]+)"([\s\S]*?)\n\s*\},', source)
known = []
for vid, body in objs:
    def val(k):
        mm = re.search(rf'{k}:\s*"([\s\S]*?)",\n', body)
        return mm.group(1) if mm else ''
    known.append({
        'id': vid,
        'sanskrit': val('sanskrit'),
        'english': val('english'),
        'hindi': val('hindi'),
        'meaning': val('meaning'),
        'goal': val('goal')
    })

known_map = {}
for verse in known:
    m = re.match(r'^(\d+)\.(\d+)(?:-(\d+))?$', verse['id'])
    if not m:
        continue
    ch = int(m.group(1))
    start = int(m.group(2))
    end = int(m.group(3)) if m.group(3) else start
    for v in range(start, end + 1):
        key = f'{ch}.{v}'
        known_map[key] = {
            'id': key,
            'chapter': ch,
            'verse': v,
            'sanskrit': verse['sanskrit'],
            'english': verse['english'],
            'hindi': verse['hindi'],
            'meaning': verse['meaning'],
            'goal': verse['goal']
        }

full = []
for c in range(1, 19):
    maxv = counts[c]
    for v in range(1, maxv + 1):
        key = f'{c}.{v}'
        if key in known_map:
            full.append(known_map[key])
        else:
            full.append({
                'id': key,
                'chapter': c,
                'verse': v,
                'sanskrit': '[OCR pending]',
                'english': '[OCR pending]',
                'hindi': '[OCR pending]',
                'meaning': 'Meaning will be available after OCR cleanup.',
                'goal': 'Read this verse mindfully for 2 minutes and reflect on one action.'
            })

out_json = {
    'generatedAt': datetime.now(timezone.utc).isoformat(),
    'totalVerses': len(full),
    'knownVersesLoaded': len(known_map),
    'data': full
}

json_path = os.path.join(ROOT, 'data/shlokas-full.json')
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(out_json, f, ensure_ascii=False, indent=2)

js_path = os.path.join(ROOT, 'assets/js/shlokas-full.js')
with open(js_path, 'w', encoding='utf-8') as f:
    f.write('window.SHLOKAS_FULL = ' + json.dumps(full, ensure_ascii=False) + ';\n')

print(f'Generated {len(full)} verses.')
print(f'Known verses filled: {len(known_map)}')
print(f'Wrote: {json_path}')
print(f'Wrote: {js_path}')
