/* ok-millennial — the machine.
   One quiz. Fourteen costumes. Zero dependencies. */

(function () {
  'use strict';

  var root = document.documentElement;
  var stage = document.getElementById('stage');
  var skinbar = document.getElementById('skinbar');

  /* ---------------------------------------------------------------- state */

  var state = {
    skin: DEFAULT_SKIN,
    spice: 'spicy',
    step: -1,          // -1 = landing, 0..n-1 = questions, n = computing, n+1 = result
    answers: [],
    result: null,
    signoff: ''
  };

  /* --------------------------------------------------------------- spice
     Default is spicy. ?spice=mild makes it safe to send to a coworker,
     which is, frankly, the funnier delivery mechanism. */

  var MILD = {
    fuck: 'buzz', fucking: 'freaking', shit: 'crap', shitty: 'lousy',
    ass: 'butt', damn: 'darn', hell: 'heck', bitch: 'pal', piss: 'tick',
    crap: 'crap', dick: 'goof'
  };
  var MILD_RE = new RegExp('\\b(' + Object.keys(MILD).join('|') + ')\\b', 'gi');

  function matchCase(src, out) {
    if (src === src.toUpperCase() && src.length > 1) return out.toUpperCase();
    if (src[0] === src[0].toUpperCase()) return out[0].toUpperCase() + out.slice(1);
    return out;
  }

  function spice(text) {
    if (typeof text !== 'string') return text;
    // {n} keeps skin copy honest when questions are added or removed
    text = text.replace(/\{n\}/g, QUESTIONS.length);
    if (state.spice !== 'mild') return text;
    return text.replace(MILD_RE, function (m) { return matchCase(m, MILD[m.toLowerCase()]); });
  }

  /* -------------------------------------------------------------- scoring */

  // Max points each axis can possibly collect — used for the intensity meter.
  var AXIS_MAX = (function () {
    var m = {};
    Object.keys(AXIS_LABELS).forEach(function (ax) {
      m[ax] = QUESTIONS.reduce(function (n, q) {
        return n + Math.max.apply(null, [0].concat(q.a.map(function (a) { return a.s[ax] || 0; })));
      }, 0);
    });
    return m;
  })();

  function score(answers) {
    var totals = {};
    Object.keys(AXIS_LABELS).forEach(function (k) { totals[k] = 0; });

    answers.forEach(function (ai, qi) {
      var s = QUESTIONS[qi].a[ai].s;
      Object.keys(s).forEach(function (k) { totals[k] += s[k]; });
    });

    var axes  = Object.keys(AXIS_LABELS);
    var sum   = axes.reduce(function (n, k) { return n + totals[k]; }, 0);
    var order = axes.slice().sort(function (a, b) { return totals[b] - totals[a]; });
    var top   = order[0];
    var share = sum ? totals[top] / sum : 0;
    var min   = axes.reduce(function (n, k) { return Math.min(n, totals[k]); }, Infinity);

    // Specials outrank the dominant axis. Thresholds tuned in tools/balance.js.
    var key;
    if (top === 'effort' && share >= 0.5)      key = 'liar';      // picked every flattering answer
    else if (min >= 3 && share <= 0.24)        key = 'terminal';  // damage in all six categories
    else                                        key = top;

    return {
      key: key,
      verdict: VERDICTS[key],
      totals: totals,
      order: order,
      sum: sum,
      pct: Math.round((totals[top] / (AXIS_MAX[top] || 1)) * 100)
    };
  }

  /* --------------------------------------------------------------- render */

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function skin() { return SKINS[state.skin]; }

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
        '<p class="fineprint">' + esc(spice(s.fine || '{n} questions · takes a minute · ruins the afternoon')) + '</p>' +
      '</section>'
    );
  }

  function renderQuestion(i) {
    var s = skin(), q = QUESTIONS[i];
    var pct = Math.round((i / QUESTIONS.length) * 100);
    paint(
      '<section class="card question">' +
        '<div class="progress"><div class="progress-bar" style="width:' + pct + '%"></div></div>' +
        '<p class="kicker">' + esc(s.prog(i + 1, QUESTIONS.length)) + '</p>' +
        '<h2 class="q">' + esc(spice(q.q)) + '</h2>' +
        '<ul class="answers">' +
          q.a.map(function (a, ai) {
            return '<li><button class="answer" data-act="answer" data-i="' + ai + '">' +
                   '<span class="answer-key">' + 'ABCD'[ai] + '</span>' +
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
    setTimeout(function () {
      state.step = QUESTIONS.length + 1;
      render();
    }, 1400);
  }

  function renderResult() {
    var s = skin(), r = state.result, v = r.verdict;

    var bars = r.order.map(function (k) {
      var max = Math.max.apply(null, r.order.map(function (x) { return r.totals[x]; })) || 1;
      var w = Math.round((r.totals[k] / max) * 100);
      return '<li class="bar-row">' +
               '<span class="bar-label">' + esc(AXIS_LABELS[k]) + '</span>' +
               '<span class="bar-track"><span class="bar-fill" style="width:' + w + '%"></span></span>' +
             '</li>';
    }).join('');

    paint(
      '<section class="card result">' +
        '<p class="kicker">' + esc(s.kicker) + '</p>' +
        '<p class="verdict-code">' + esc(v.code) + '</p>' +
        '<h1 class="hed">' + esc(spice(v.title)) + '</h1>' +
        v.body.map(function (p) { return '<p class="body">' + esc(spice(p)) + '</p>'; }).join('') +

        '<div class="meter">' +
          '<p class="meter-head">' + (v.meter || 'Damage sustained: <strong>' + r.pct + '%</strong>') + '</p>' +
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
        '<p class="fineprint sendline">Now send it to someone else — ' +
          '<button class="linkish" data-act="opensend">pick a different disguise ↓</button></p>' +
      '</section>'
    );
  }

  function render() {
    if (state.step === -1) return renderLanding();
    if (state.step < QUESTIONS.length) return renderQuestion(state.step);
    if (state.step === QUESTIONS.length) return renderComputing();
    return renderResult();
  }

  /* ------------------------------------------------------------ skin bar */

  function linkFor(id) {
    try {
      var u = new URL(location.href);
      u.search = '';
      u.hash = '';
      u.searchParams.set('s', id);
      if (state.spice === 'mild') u.searchParams.set('spice', 'mild');
      return u.toString();
    } catch (e) {
      return location.href;
    }
  }

  function renderSkinbar() {
    skinbar.innerHTML =
      '<div class="skinbar-inner">' +
        '<div class="skinbar-head">' +
          '<h2>Same quiz. Different website.</h2>' +
          '<p>Fourteen skins. Send everyone a link and let them figure out they took the same one.</p>' +
        '</div>' +
        '<ul class="skinlist">' +
          SKIN_IDS.map(function (id) {
            var sk = SKINS[id];
            return '<li class="skinrow' + (id === state.skin ? ' is-active' : '') + '">' +
              '<button class="skinpick" data-act="skin" data-skin="' + id + '">' +
                '<span class="skinname">' + esc(sk.name) + '</span>' +
                '<span class="skinblurb">' + esc(sk.blurb) + '</span>' +
              '</button>' +
              '<button class="skincopy" data-act="copy" data-skin="' + id + '" title="Copy link to this version">Copy link</button>' +
            '</li>';
          }).join('') +
        '</ul>' +
        '<div class="skinbar-foot">' +
          '<button class="linkish" data-act="spice">' +
            (state.spice === 'mild' ? 'Language: polite — switch to rude' : 'Language: rude — switch to polite (safe for the group chat at work)') +
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

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () { toast('Link copied'); },
        function () { fallbackCopy(text); }
      );
    } else {
      fallbackCopy(text);
    }
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

  function doShare() {
    var r = state.result;
    var text = r.verdict.share + '. ' + r.pct + '% damage. See how bad yours is:';
    var url = linkFor(state.skin);
    if (navigator.share) {
      navigator.share({ title: 'OK Millennial', text: text, url: url }).catch(function () {});
    } else {
      copy(text + ' ' + url);
    }
  }

  // Sandboxed and file:// contexts can refuse history writes — never let that
  // break the quiz, the URL is a convenience.
  function setUrl(mutate) {
    try {
      var u = new URL(location.href);
      mutate(u);
      history.replaceState(null, '', u.toString());
    } catch (e) { /* the quiz works fine without it */ }
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
      state.answers = [];
      state.step = 0;
      render();

    } else if (act === 'answer') {
      state.answers[state.step] = parseInt(el.getAttribute('data-i'), 10);
      state.step++;
      if (state.step === QUESTIONS.length) {
        state.result = score(state.answers);
        state.signoff = SIGNOFFS[Math.floor(Math.random() * SIGNOFFS.length)];
      }
      render();

    } else if (act === 'back') {
      state.step = Math.max(0, state.step - 1);
      render();

    } else if (act === 'restart') {
      state.step = -1;
      state.answers = [];
      render();

    } else if (act === 'share') {
      doShare();

    } else if (act === 'skin') {
      setSkin(el.getAttribute('data-skin'), true);

    } else if (act === 'copy') {
      copy(linkFor(el.getAttribute('data-skin')));

    } else if (act === 'opensend' || act === 'togglebar') {
      skinbar.classList.toggle('open', act === 'opensend' ? true : !skinbar.classList.contains('open'));
      if (skinbar.classList.contains('open')) skinbar.scrollIntoView({ behavior: 'smooth', block: 'start' });

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

  // Keyboard: 1-4 answers a question, Esc goes back.
  document.addEventListener('keydown', function (e) {
    if (state.step < 0 || state.step >= QUESTIONS.length) return;
    if (e.key >= '1' && e.key <= '4') {
      var btn = stage.querySelector('[data-act="answer"][data-i="' + (+e.key - 1) + '"]');
      if (btn) btn.click();
    } else if (e.key === 'Escape' && state.step > 0) {
      state.step--;
      render();
    }
  });

  /* ----------------------------------------------------------------- boot */

  var params = new URLSearchParams(location.search);
  var want = params.get('s') || params.get('skin') || DEFAULT_SKIN;

  // ?v=<verdict> skips the quiz and shows one result. Used by tools/contact-sheet.js
  // to review every verdict in every skin without playing through each time.
  var forced = params.get('v');
  if (want === 'random' || want === 'roulette') {
    want = SKIN_IDS[Math.floor(Math.random() * SKIN_IDS.length)];
  }
  if (params.get('spice') === 'mild') state.spice = 'mild';

  if (forced && VERDICTS[forced]) {
    state.result = {
      key: forced,
      verdict: VERDICTS[forced],
      totals: (function () {
        // plausible-looking bars so the meter reads correctly in review
        var t = {}, ax = Object.keys(AXIS_LABELS);
        ax.forEach(function (k, i) { t[k] = k === forced ? 14 : 10 - i; });
        return t;
      })(),
      order: Object.keys(AXIS_LABELS).sort(function (a, b) {
        return (b === forced) - (a === forced);
      }),
      sum: 30,
      pct: 82
    };
    state.signoff = SIGNOFFS[0];
    state.step = QUESTIONS.length + 1;
  }

  setSkin(SKINS[want] ? want : DEFAULT_SKIN, false);
})();
