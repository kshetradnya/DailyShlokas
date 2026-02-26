#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'assets/js/shlokas.js'), 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(src, sandbox);

const known = sandbox.window.SHLOKAS || [];
const counts = sandbox.window.VERSE_COUNTS || {};

const knownMap = new Map();

function upsert(ch, vs, payload) {
  const key = `${ch}.${vs}`;
  knownMap.set(key, {
    id: key,
    chapter: ch,
    verse: vs,
    sanskrit: payload.sanskrit || '',
    english: payload.english || '',
    hindi: payload.hindi || '',
    meaning: payload.meaning || '',
    goal: payload.goal || ''
  });
}

known.forEach((v) => {
  const m = /^([0-9]+)\.([0-9]+)(?:-([0-9]+))?$/.exec(v.id);
  if (!m) return;
  const chapter = Number(m[1]);
  const start = Number(m[2]);
  const end = m[3] ? Number(m[3]) : start;
  for (let i = start; i <= end; i += 1) upsert(chapter, i, v);
});

const full = [];
for (let c = 1; c <= 18; c += 1) {
  const max = counts[c];
  for (let v = 1; v <= max; v += 1) {
    const id = `${c}.${v}`;
    const k = knownMap.get(id);
    full.push(k || {
      id,
      chapter: c,
      verse: v,
      sanskrit: '[OCR pending]',
      english: '[OCR pending]',
      hindi: '[OCR pending]',
      meaning: 'Meaning will be available after OCR cleanup.',
      goal: 'Read this verse mindfully for 2 minutes and reflect on one action.'
    });
  }
}

const outJson = {
  generatedAt: new Date().toISOString(),
  totalVerses: full.length,
  knownVersesLoaded: [...knownMap.keys()].length,
  data: full
};

const jsonPath = path.join(root, 'data/shlokas-full.json');
fs.writeFileSync(jsonPath, JSON.stringify(outJson, null, 2));

const jsPath = path.join(root, 'assets/js/shlokas-full.js');
const js = `window.SHLOKAS_FULL = ${JSON.stringify(full)};\n`;
fs.writeFileSync(jsPath, js);

console.log(`Generated ${full.length} verses.`);
console.log(`Known verses filled: ${[...knownMap.keys()].length}`);
console.log(`Wrote: ${jsonPath}`);
console.log(`Wrote: ${jsPath}`);
