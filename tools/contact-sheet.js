/* tools/contact-sheet.js — look at everything at once.
   Renders all 14 skins side by side, and every verdict as plain readable copy,
   so the writing and the art direction can be judged without playing the quiz
   fourteen times.

   Usage:  python3 -m http.server 8099 &   # from the repo root
           node tools/contact-sheet.js
*/

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { chromium } = require(process.env.PW || 'playwright');

const BASE = process.env.BASE || 'http://127.0.0.1:8099';
const OUT  = process.env.OUT  || path.join(__dirname, '..', 'preview');
const CHROME = process.env.CHROME || undefined;

const dir = path.join(__dirname, '..', 'assets', 'js');
const data = vm.runInNewContext(
  ['data.questions.js', 'data.verdicts.js', 'data.skins.js']
    .map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n') +
  '\n({ QUESTION_SETS, VERDICTS, SKINS, SKIN_IDS, AXIS_LABELS })'
);

const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});

  /* ---------- 1. every skin, side by side ---------- */
  const CELL_W = 430, CELL_H = 560, SCALE = 0.62;
  const cells = data.SKIN_IDS.map(id => `
    <figure class="cell">
      <div class="frame"><iframe src="${BASE}/?s=${id}" scrolling="no" loading="eager"></iframe></div>
      <figcaption><b>${esc(data.SKINS[id].name)}</b><span>?s=${id}</span></figcaption>
    </figure>`).join('');

  const sheet = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;background:#111;color:#eee;font:14px/1.4 system-ui,sans-serif;padding:34px}
    h1{font:700 26px/1.2 system-ui;margin:0 0 4px}
    p.sub{margin:0 0 28px;color:#888}
    .grid{display:grid;grid-template-columns:repeat(4,${CELL_W * SCALE}px);gap:30px 24px}
    .frame{width:${CELL_W * SCALE}px;height:${CELL_H * SCALE}px;overflow:hidden;
           border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.5)}
    iframe{width:${CELL_W}px;height:${CELL_H}px;border:0;
           transform:scale(${SCALE});transform-origin:0 0}
    figure{margin:0}
    figcaption{margin-top:9px;display:flex;justify-content:space-between;gap:8px}
    figcaption b{font-size:13px}
    figcaption span{color:#777;font:11px ui-monospace,monospace}
  </style>
  <h1>OK Millennial — fourteen quizzes, one diagnosis</h1>
  <p class="sub">Each skin asks its own questions in its own voice, then reaches the same nine verdicts.</p>
  <div class="grid">${cells}</div>`;

  // tall viewport: Chromium won't paint iframes that are below the fold
  const rows = Math.ceil(data.SKIN_IDS.length / 4);
  const p1 = await browser.newPage({ viewport: { width: 1400, height: Math.round(220 + rows * (CELL_H * SCALE + 60)) } });
  await p1.setContent(sheet, { waitUntil: 'load' });
  await p1.waitForTimeout(2200);           // let every iframe paint
  await p1.screenshot({ path: path.join(OUT, 'skins.png'), fullPage: true });
  console.log('wrote preview/skins.png');
  await p1.close();

  /* ---------- 2. all eight verdicts, as readable copy ---------- */
  const verdicts = Object.entries(data.VERDICTS).map(([key, v]) => `
    <article>
      <p class="code">${esc(v.code)}</p>
      <h2>${esc(v.title)}</h2>
      ${v.body.map(b => `<p>${esc(b)}</p>`).join('')}
      <ul>${v.rx.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
      <p class="key">${esc(key)} · shares as “${esc(v.share)}”</p>
    </article>`).join('');

  const copy = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;background:#f6f5f2;color:#191712;
         font:16px/1.6 Georgia,"Iowan Old Style",serif;padding:48px}
    h1{font:800 30px/1.2 system-ui,sans-serif;margin:0 0 6px}
    p.sub{margin:0 0 34px;color:#7a7268;font:14px system-ui,sans-serif}
    .cols{column-count:2;column-gap:44px}
    article{break-inside:avoid;margin:0 0 30px;padding:24px 26px;background:#fff;
            border:1px solid #e6e2d9;border-radius:10px}
    .code{margin:0 0 6px;font:700 11px/1 ui-monospace,monospace;letter-spacing:.1em;color:#c0392b}
    h2{margin:0 0 12px;font-size:21px;line-height:1.2}
    article p{margin:0 0 11px}
    ul{margin:14px 0 0;padding-left:19px}
    li{margin-bottom:7px;font-size:14.5px;color:#4a443c}
    .key{margin:14px 0 0;font:12px system-ui,sans-serif;color:#9a9186}
  </style>
  <h1>The nine verdicts</h1>
  <p class="sub">Read these cold. If a line doesn't earn a reaction, it should be cut.</p>
  <div class="cols">${verdicts}</div>`;

  const p2 = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  await p2.setContent(copy, { waitUntil: 'load' });
  await p2.screenshot({ path: path.join(OUT, 'verdicts.png'), fullPage: true });
  console.log('wrote preview/verdicts.png');
  await p2.close();

  await browser.close();
})();
