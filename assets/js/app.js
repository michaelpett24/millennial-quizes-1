/* ok-millennial — the machine.
   Fourteen quizzes, one diagnosis engine, zero dependencies. */

(function () {
  'use strict';

  var root = document.documentElement;
  var stage = document.getElementById('stage');
  var skinbar = document.getElementById('skinbar');

  /* ---------------------------------------------------------------- state */

  var state = {
    skin: DEFAULT_SKIN,
    spice: 'spicy',
    step: -1,          // -1 landing, 0..n-1 questions, n computing, n+1 result
    answers: [],       // index per question; === q.a.length means they declined
    result: null,
    signoff: ''
  };

  function skin()  { return SKINS[state.skin]; }
  function set()   { return QUESTION_SETS[state.skin] || QUESTION_SETS[DEFAULT_SKIN]; }
  function count() { return set().length; }

  // The opt-out is appended at render time so 98 questions don't each have to
  // spell it out, and so it can speak in the skin's own voice.
  function answersFor(q) {
    return q.a.concat([{ t: skin().none || 'None of these', none: true }]);
  }
  function declined(qi) { return state.answers[qi] >= set()[qi].a.length; }

  /* --------------------------------------------------------------- spice
     Rude by default. ?spice=mild makes it safe to send to a coworker, which
     is the funnier delivery mechanism anyway. */

  var MILD = {
    fuck: 'buzz', fucking: 'freaking', shit: 'crap', shitty: 'lousy',
    ass: 'butt', damn: 'darn', hell: 'heck', bitch: 'pal', piss: 'tick',
    dick: 'goof', bastard: 'muppet'
  };
  var MILD_RE = new RegExp('\\b(' + Object.keys(MILD).join('|') + ')\\b', 'gi');

  function matchCase(src, out) {
    if (src === src.toUpperCase() && src.length > 1) return out.toUpperCase();
    if (src[0] === src[0].toUpperCase()) return out[0].toUpperCase() + out.slice(1);
    return out;
  }

  function spice(text) {
    if (typeof text !== 'string') return text;
    // {n} keeps copy honest when a quiz gains or loses questions
    text = text.replace(/\{n\}/g, count());
    if (state.spice !== 'mild') return text;
    return text.replace(MILD_RE, function (m) { return matchCase(m, MILD[m.toLowerCase()]); });
  }

  /* -------------------------------------------------------------- scoring */

  // Most points each axis can collect in the active quiz — drives the meter.
  function axisMax(ax) {
    return set().reduce(function (n, q) {
      return n + Math.max.apply(null, [0].concat(q.a.map(function (a) { return a.s[ax] || 0; })));
    }, 0);
  }

  function score(answers) {
    var qs = set();
    var totals = {}, axes = Object.keys(AXIS_LABELS);
    axes.forEach(function (k) { totals[k] = 0; });

    var dodged = 0;
    answers.forEach(function (ai, qi) {
      var a = qs[qi].a[ai];
      if (!a) { dodged++; return; }          // the appended opt-out
      Object.keys(a.s).forEach(function (k) { totals[k] += a.s[k]; });
    });

    var sum   = axes.reduce(function (n, k) { return n + totals[k]; }, 0);
    var order = axes.slice().sort(function (a, b) { return totals[b] - totals[a]; });
    var top   = order[0];
    var share = sum ? totals[top] / sum : 0;
    var min   = axes.reduce(function (n, k) { return Math.min(n, totals[k]); }, Infinity);

    // Specials outrank the dominant axis. Thresholds tuned in tools/balance.js.
    var key;
    if (dodged >= Math.ceil(qs.length * 0.4)) key = 'evasive';   // wouldn't answer
    else if (top === 'effort' && share >= 0.5) key = 'liar';     // every flattering answer
    else if (min >= 2 && share <= 0.26)        key = 'terminal'; // damage everywhere
    else                                        key = top;

    return {
      key: key,
      verdict: VERDICTS[key],
      totals: totals,
      order: order,
      sum: sum,
      dodged: dodged,
      pct: Math.round((totals[top] / (axisMax(top) || 1)) * 100)
    };
  }

  /* --------------------------------------------------------------- render */

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function paint(html) {
    stage.innerHTML = html;
    stage.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function renderLanding() {
    var s = skin();
    paint(
      '<section class="card landing">' +
        '<p class="kicker">' + esc(s.brand) + '</p>' +
        '<h1 class="hed">' + esc(spice(s.hed)) + '</h1>' +
        '<p class="dek">' + esc(spice(s.dek)) + '</p>' +
        '<button class="btn btn-primary" data-act="start">' + esc(s.cta) + '</button>' +
        '<p class="fineprint">' + esc(spice(s.fine || '{n} questions')) + '</p>' +
      '</section>'
    );
  }

  function renderQuestion(i) {
    var s = skin(), q = set()[i], list = answersFor(q);
    var pct = Math.round((i / count()) * 100);
    paint(
      '<section class="card question">' +
        '<div class="progress"><div class="progress-bar" style="width:' + pct + '%"></div></div>' +
        '<p class="kicker">' + esc(s.prog(i + 1, count())) + '</p>' +
        '<h2 class="q">' + esc(spice(q.q)) + '</h2>' +
        '<ul class="answers">' +
          list.map(function (a, ai) {
            return '<li><button class="answer' + (a.none ? ' answer-none' : '') +
                   '" data-act="answer" data-i="' + ai + '">' +
                   '<span class="answer-key">' + (ai + 1) + '</span>' +
                   '<span class="answer-text">' + esc(spice(a.t)) + '</span></button></li>';
          }).join('') +
        '</ul>' +
        (i > 0 ? '<button class="btn btn-ghost btn-back" data-act="back">← Back</button>' : '') +
      '</section>'
    );
  }

  function renderComputing() {
    paint(
      '<section class="card computing">' +
        '<div class="spinner" aria-hidden="true"></div>' +
        '<p class="computing-text">' + esc(spice(skin().computing)) + '</p>' +
      '</section>'
    );
    setTimeout(function () { state.step = count() + 1; render(); }, 1400);
  }

  function renderResult() {
    var s = skin(), r = state.result, v = r.verdict;

    var peak = r.order.reduce(function (m, k) { return Math.max(m, r.totals[k]); }, 0) || 1;
    var bars = r.order.map(function (k) {
      var w = Math.round((r.totals[k] / peak) * 100);
      return '<li class="bar-row">' +
               '<span class="bar-label">' + esc(AXIS_LABELS[k]) + '</span>' +
               '<span class="bar-track"><span class="bar-fill" style="width:' + w + '%"></span></span>' +
             '</li>';
    }).join('');

    var meter = v.meter
      ? v.meter.replace(/\{d\}/g, r.dodged)
      : 'Damage sustained: <strong>' + r.pct + '%</strong>';

    paint(
      '<section class="card result">' +
        '<p class="kicker">' + esc(s.kicker) + '</p>' +
        '<p class="verdict-code">' + esc(v.code) + '</p>' +
        '<h1 class="hed">' + esc(spice(v.title)) + '</h1>' +
        v.body.map(function (p) {
          return '<p class="body">' + esc(spice(p).replace(/\{d\}/g, r.dodged)) + '</p>';
        }).join('') +

        '<div class="meter">' +
          '<p class="meter-head">' + meter + '</p>' +
          '<ul class="bars">' + bars + '</ul>' +
        '</div>' +

        '<div class="rx">' +
          '<p class="rx-label">' + esc(s.rxLabel) + '</p>' +
          '<ul>' + v.rx.map(function (x) { return '<li>' + esc(spice(x)) + '</li>'; }).join('') + '</ul>' +
        '</div>' +

        (s.outro ? '<p class="outro">' + esc(spice(s.outro)) + '</p>' : '') +
        '<p class="signoff">' + esc(spice(state.signoff)) + '</p>' +

        '<div class="actions">' +
          '<button class="btn btn-primary" data-act="share">' + esc(s.share) + '</button>' +
          '<button class="btn btn-ghost" data-act="restart">' + esc(s.restart) + '</button>' +
        '</div>' +

        // The reveal: the other thirteen quizzes, surfaced where it pays off.
        '<div class="reveal">' +
          '<p class="reveal-hed">There are ' + (SKIN_IDS.length - 1) + ' more of these.</p>' +
          '<p class="reveal-dek">Different site, different questions, same eight ways of being told. ' +
            'Send someone a version they haven\'t seen.</p>' +
          '<button class="btn btn-ghost" data-act="opensend">Pick one to send →</button>' +
        '</div>' +
      '</section>'
    );
  }

  function render() {
    if (state.step === -1) return renderLanding();
    if (state.step < count()) return renderQuestion(state.step);
    if (state.step === count()) return renderComputing();
    return renderResult();
  }

  /* ------------------------------------------------------------ skin bar */

  function linkFor(id) {
    try {
      var u = new URL(location.href);
      u.search = ''; u.hash = '';
      u.searchParams.set('s', id);
      if (state.spice === 'mild') u.searchParams.set('spice', 'mild');
      return u.toString();
    } catch (e) { return location.href; }
  }

  function renderSkinbar() {
    skinbar.innerHTML =
      '<div class="skinbar-inner">' +
        '<div class="skinbar-head">' +
          '<h2>Fourteen quizzes. One diagnosis.</h2>' +
          '<p>Each one asks its own questions in its own voice, then reaches the ' +
            'same eight conclusions about you. Send everybody a different link.</p>' +
        '</div>' +
        '<ul class="skinlist">' +
          SKIN_IDS.map(function (id) {
            var sk = SKINS[id];
            return '<li class="skinrow' + (id === state.skin ? ' is-active' : '') + '">' +
              '<button class="skinpick" data-act="skin" data-skin="' + id + '">' +
                '<span class="skinname">' + esc(sk.name) + '</span>' +
                '<span class="skinblurb">' + esc(sk.blurb) + '</span>' +
              '</button>' +
              '<button class="skincopy" data-act="copy" data-skin="' + id + '">Copy link</button>' +
            '</li>';
          }).join('') +
        '</ul>' +
        '<div class="skinbar-foot">' +
          '<button class="linkish" data-act="spice">' +
            (state.spice === 'mild'
              ? 'Language: polite — switch to rude'
              : 'Language: rude — switch to polite (safe for the work group chat)') +
          '</button>' +
        '</div>' +
      '</div>';
  }

  /* -------------------------------------------------------------- actions */

  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast('Link copied'); }
    catch (e) { toast('Copy failed — ' + text); }
    document.body.removeChild(ta);
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () { toast('Link copied'); },
        function () { fallbackCopy(text); }
      );
    } else { fallbackCopy(text); }
  }

  function doShare() {
    var r = state.result;
    var text = r.verdict.share + '. See how badly you do:';
    var url = linkFor(state.skin);
    if (navigator.share) {
      navigator.share({ title: 'OK Millennial', text: text, url: url }).catch(function () {});
    } else { copy(text + ' ' + url); }
  }

  // Sandboxed and file:// contexts can refuse history writes — never let that
  // break the quiz, the URL is only a convenience.
  function setUrl(mutate) {
    try {
      var u = new URL(location.href);
      mutate(u);
      history.replaceState(null, '', u.toString());
    } catch (e) { /* fine without it */ }
  }

  function setSkin(id, push) {
    if (!SKINS[id]) id = DEFAULT_SKIN;
    state.skin = id;
    root.setAttribute('data-skin', id);
    document.title = SKINS[id].brand + ' — OK Millennial';
    if (push) setUrl(function (u) { u.searchParams.set('s', id); });
    renderSkinbar();
    render();
  }

  /* --------------------------------------------------------------- events */

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.getAttribute('data-act');

    if (act === 'start') {
      state.answers = []; state.step = 0; render();

    } else if (act === 'answer') {
      state.answers[state.step] = parseInt(el.getAttribute('data-i'), 10);
      state.step++;
      if (state.step === count()) {
        state.result = score(state.answers);
        state.signoff = SIGNOFFS[Math.floor(Math.random() * SIGNOFFS.length)];
      }
      render();

    } else if (act === 'back') {
      state.step = Math.max(0, state.step - 1); render();

    } else if (act === 'restart') {
      state.step = -1; state.answers = []; render();

    } else if (act === 'share') {
      doShare();

    } else if (act === 'skin') {
      setSkin(el.getAttribute('data-skin'), true);
      skinbar.classList.remove('open');

    } else if (act === 'copy') {
      copy(linkFor(el.getAttribute('data-skin')));

    } else if (act === 'opensend') {
      skinbar.classList.add('open');
      skinbar.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } else if (act === 'togglebar') {
      skinbar.classList.toggle('open');
      if (skinbar.classList.contains('open')) {
        skinbar.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

    } else if (act === 'spice') {
      state.spice = state.spice === 'mild' ? 'spicy' : 'mild';
      setUrl(function (u) {
        if (state.spice === 'mild') u.searchParams.set('spice', 'mild');
        else u.searchParams.delete('spice');
      });
      renderSkinbar();
      render();
    }
  });

  // 1-5 answers the current question (5 is always the opt-out), Esc goes back.
  document.addEventListener('keydown', function (e) {
    if (state.step < 0 || state.step >= count()) return;
    if (e.key >= '1' && e.key <= '5') {
      var btn = stage.querySelector('[data-act="answer"][data-i="' + (+e.key - 1) + '"]');
      if (btn) btn.click();
    } else if (e.key === 'Escape' && state.step > 0) {
      state.step--; render();
    }
  });

  /* ----------------------------------------------------------------- boot */

  var params = new URLSearchParams(location.search);
  var want = params.get('s') || params.get('skin') || DEFAULT_SKIN;
  if (want === 'random' || want === 'roulette') {
    want = SKIN_IDS[Math.floor(Math.random() * SKIN_IDS.length)];
  }
  if (params.get('spice') === 'mild') state.spice = 'mild';
  if (!SKINS[want]) want = DEFAULT_SKIN;

  // ?v=<verdict> skips the quiz and shows one result — used by
  // tools/contact-sheet.js to review copy without playing every quiz.
  var forced = params.get('v');
  if (forced && VERDICTS[forced]) {
    state.skin = want;
    var axes = Object.keys(AXIS_LABELS);
    var totals = {};
    axes.forEach(function (k, i) { totals[k] = k === forced ? 14 : 10 - i; });
    state.result = {
      key: forced, verdict: VERDICTS[forced], totals: totals,
      order: axes.slice().sort(function (a, b) { return totals[b] - totals[a]; }),
      sum: 30, dodged: 4, pct: 82
    };
    state.signoff = SIGNOFFS[0];
    state.step = QUESTION_SETS[want].length + 1;
  }

  setSkin(want, false);
})();
