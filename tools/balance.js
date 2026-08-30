/* tools/balance.js — sanity-check the quiz maths.
   Run: node tools/balance.js
   Verifies every verdict is reachable and no single result swallows the quiz. */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const dir = path.join(__dirname, '..', 'assets', 'js');
const src = ['data.questions.js', 'data.verdicts.js']
  .map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n')
  + '\n({ QUESTIONS, VERDICTS, AXIS_LABELS })';
const { QUESTIONS, VERDICTS, AXIS_LABELS } = vm.runInNewContext(src);
const AXES = Object.keys(AXIS_LABELS);

/* Keep in lockstep with score() in assets/js/app.js */
function score(answers) {
  const totals = {};
  AXES.forEach(k => (totals[k] = 0));
  answers.forEach((ai, qi) => {
    const s = QUESTIONS[qi].a[ai].s;
    Object.keys(s).forEach(k => (totals[k] += s[k]));
  });
  const sum = AXES.reduce((n, k) => n + totals[k], 0);
  const order = [...AXES].sort((a, b) => totals[b] - totals[a]);
  const top = order[0];
  const share = sum ? totals[top] / sum : 0;
  const min = Math.min(...AXES.map(k => totals[k]));

  let key;
  if (top === 'effort' && share >= 0.5) key = 'liar';
  else if (min >= 3 && share <= 0.24) key = 'terminal';
  else key = top;
  return { key, totals, sum, share, min };
}

/* ---------- 1. per-axis opportunity ---------- */
console.log('AXIS OPPORTUNITY (max points achievable, questions it appears in)');
for (const ax of AXES) {
  let max = 0, qs = 0;
  for (const q of QUESTIONS) {
    const best = Math.max(0, ...q.a.map(a => a.s[ax] || 0));
    if (best) qs++;
    max += best;
  }
  console.log(`  ${ax.padEnd(10)} max ${String(max).padStart(3)}  in ${qs}/${QUESTIONS.length} questions`);
}

/* ---------- 2. can each axis actually win? ---------- */
console.log('\nAXIS WINNABILITY (play greedily for one axis)');
for (const ax of AXES) {
  const picks = QUESTIONS.map(q => {
    let bi = 0, bv = -1;
    q.a.forEach((a, i) => { const v = a.s[ax] || 0; if (v > bv) { bv = v; bi = i; } });
    return bi;
  });
  const r = score(picks);
  console.log(`  play-for-${ax.padEnd(10)} -> ${r.key.padEnd(9)} (${ax}=${r.totals[ax]}, share ${(r.share * 100).toFixed(0)}%, min ${r.min})`);
}

/* ---------- 3. distribution over random play ---------- */
const N = 400000;
const counts = {};
for (let i = 0; i < N; i++) {
  const picks = QUESTIONS.map(q => Math.floor(Math.random() * q.a.length));
  const k = score(picks).key;
  counts[k] = (counts[k] || 0) + 1;
}
console.log(`\nDISTRIBUTION over ${N.toLocaleString()} random playthroughs`);
Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([k, v]) =>
  console.log(`  ${k.padEnd(10)} ${String(v).padStart(7)}  ${(100 * v / N).toFixed(1)}%`));

const missing = Object.keys(VERDICTS).filter(k => !counts[k]);
console.log('\nunreachable by random play:', missing.join(', ') || 'none');
if (missing.length) process.exitCode = 1;
