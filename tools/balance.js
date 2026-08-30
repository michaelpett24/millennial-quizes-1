/* tools/balance.js — sanity-check the quiz maths across all fourteen sets.
   Run: node tools/balance.js
   Fails (exit 1) if any axis can't win a set, or any verdict is unreachable. */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const dir = path.join(__dirname, '..', 'assets', 'js');
const src = ['data.questions.js', 'data.verdicts.js', 'data.skins.js']
  .map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n')
  + '\n({ QUESTION_SETS, VERDICTS, AXIS_LABELS, SKIN_IDS })';
const { QUESTION_SETS, VERDICTS, AXIS_LABELS, SKIN_IDS } = vm.runInNewContext(src);
const AXES = Object.keys(AXIS_LABELS);

/* Keep in lockstep with score() in assets/js/app.js.
   An answer index at or past q.a.length is the appended opt-out. */
function score(qs, picks) {
  const totals = {};
  AXES.forEach(k => (totals[k] = 0));
  let dodged = 0;
  picks.forEach((ai, qi) => {
    const a = qs[qi].a[ai];
    if (!a) { dodged++; return; }
    Object.keys(a.s).forEach(k => (totals[k] += a.s[k]));
  });
  const sum = AXES.reduce((n, k) => n + totals[k], 0);
  const order = [...AXES].sort((a, b) => totals[b] - totals[a]);
  const top = order[0];
  const share = sum ? totals[top] / sum : 0;
  const min = Math.min(...AXES.map(k => totals[k]));

  if (dodged >= Math.ceil(qs.length * 0.4)) return { key: 'evasive', totals, share };
  if (top === 'effort' && share >= 0.5)      return { key: 'liar', totals, share };
  if (min >= 2 && share <= 0.26)             return { key: 'terminal', totals, share };
  return { key: top, totals, share };
}

let failures = 0;
const seen = new Set();

/* ---------- every set: can each axis win it? ---------- */
console.log('AXIS WINNABILITY — playing greedily for one axis in each set\n');
const head = 'set'.padEnd(10) + AXES.map(a => a.slice(0, 5).padEnd(7)).join('');
console.log('  ' + head);

for (const id of Object.keys(QUESTION_SETS)) {
  const qs = QUESTION_SETS[id];
  const row = [];
  for (const ax of AXES) {
    // Play for one axis the way a person would: take the target answer where it
    // exists, otherwise take whichever answer feeds the *weakest* rival, rather
    // than always falling through to answer 0 and inflating one other axis.
    const running = {};
    AXES.forEach(k => (running[k] = 0));
    const picks = qs.map(q => {
      let best = -1, bestScore = -Infinity;
      q.a.forEach((a, i) => {
        const target = a.s[ax] || 0;
        const rivals = Object.keys(a.s)
          .filter(k => k !== ax)
          .reduce((n, k) => n + a.s[k] + running[k], 0);
        const v = target * 1000 - rivals;      // target dominates; rivals break ties
        if (v > bestScore) { bestScore = v; best = i; }
      });
      Object.keys(q.a[best].s).forEach(k => (running[k] += q.a[best].s[k]));
      return best;
    });
    const r = score(qs, picks);
    seen.add(r.key);
    const ok = r.key === ax || r.key === 'liar' || r.key === 'terminal';
    if (!ok) { failures++; }
    row.push((ok ? (r.key === ax ? '  ok  ' : r.key.slice(0, 5).padEnd(6)) : '  XX  ').padEnd(7));
  }
  console.log('  ' + id.padEnd(10) + row.join(''));
}

/* ---------- specials ---------- */
console.log('\nSPECIALS');
for (const id of Object.keys(QUESTION_SETS)) {
  const qs = QUESTION_SETS[id];
  // decline everything -> evasive
  const allNone = score(qs, qs.map(q => q.a.length));
  if (allNone.key !== 'evasive') { console.log(`  ${id}: declining all did NOT give evasive`); failures++; }
  seen.add(allNone.key);
}
console.log('  declining every question yields "evasive" in all ' +
            Object.keys(QUESTION_SETS).length + ' sets');

/* ---------- distribution over random play, per set ---------- */
const N = 40000;
console.log(`\nDISTRIBUTION — ${N.toLocaleString()} random playthroughs per set`);
const totalCounts = {};
for (const id of Object.keys(QUESTION_SETS)) {
  const qs = QUESTION_SETS[id];
  const counts = {};
  for (let i = 0; i < N; i++) {
    // include the opt-out as a fifth pickable option
    const picks = qs.map(q => Math.floor(Math.random() * (q.a.length + 1)));
    const k = score(qs, picks).key;
    counts[k] = (counts[k] || 0) + 1;
    totalCounts[k] = (totalCounts[k] || 0) + 1;
    seen.add(k);
  }
  const line = Object.entries(counts).sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} ${(100 * v / N).toFixed(0)}%`).join('  ');
  console.log('  ' + id.padEnd(10) + line);
}

const grand = Object.values(totalCounts).reduce((a, b) => a + b, 0);
console.log('\nOVERALL');
Object.entries(totalCounts).sort((a, b) => b[1] - a[1]).forEach(([k, v]) =>
  console.log('  ' + k.padEnd(10) + (100 * v / grand).toFixed(1) + '%'));

/* ---------- coverage ---------- */
const missing = Object.keys(VERDICTS).filter(k => !seen.has(k));
console.log('\nunreachable verdicts:', missing.join(', ') || 'none');
if (missing.length) failures++;

/* ---------- every skin needs a question set ---------- */
const setless = SKIN_IDS.filter(id => !QUESTION_SETS[id]);
console.log('skins without a question set:', setless.join(', ') || 'none');
if (setless.length) failures++;

console.log(failures ? `\nFAILED (${failures})` : '\nOK');
process.exitCode = failures ? 1 : 0;
