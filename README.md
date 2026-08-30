# OK Millennial

A ten-question quiz that has already made up its mind about you.

It asks what time you got in bed, what your last three online orders were, and
what hurts. Then it tells you exactly what you are, at length, in whichever of
**fourteen completely different websites** you happened to open.

**→ [Take it](https://michaelpett24.github.io/ok-millennial/)**

---

## The point

The quiz never changes. The website does.

Send your college roommate a corporate performance review. Send your sister a
WebMD symptom checker. Send the group chat a Windows 98 dialog box. They all
take the same ten questions and receive the same eight possible verdicts —
they just won't realise it until someone screenshots a result and the wording
matches.

Every skin is one URL parameter:

| Skin | Link | What it pretends to be |
|---|---|---|
| Listicle Quiz | [`?s=quiz`](https://michaelpett24.github.io/ok-millennial/?s=quiz) | The 2014 clickbait personality quiz. Where it all began. |
| Performance Review | [`?s=hr`](https://michaelpett24.github.io/ok-millennial/?s=hr) | Sterile, corporate, somehow the meanest one. |
| Symptom Checker | [`?s=webmd`](https://michaelpett24.github.io/ok-millennial/?s=webmd) | You looked up a headache and it said this. |
| Windows 98 | [`?s=y2k`](https://michaelpett24.github.io/ok-millennial/?s=y2k) | You have 1 new message. It is about your knees. |
| Top 8 | [`?s=myspace`](https://michaelpett24.github.io/ok-millennial/?s=myspace) | Black background, glitter text, one song autoplaying. |
| Wellness Brand | [`?s=wellness`](https://michaelpett24.github.io/ok-millennial/?s=wellness) | Lowercase serif. Millennial pink. Devastating. |
| Terminal | [`?s=terminal`](https://michaelpett24.github.io/ok-millennial/?s=terminal) | For the ones who describe themselves as "technical." |
| Product Launch | [`?s=keynote`](https://michaelpett24.github.io/ok-millennial/?s=keynote) | One more thing: you. |
| Government Form | [`?s=dmv`](https://michaelpett24.github.io/ok-millennial/?s=dmv) | Form 401-K. Please take a number. |
| Horoscope | [`?s=astro`](https://michaelpett24.github.io/ok-millennial/?s=astro) | The stars have looked at your camera roll. |
| Breaking News | [`?s=news`](https://michaelpett24.github.io/ok-millennial/?s=news) | We interrupt this broadcast to discuss your lower back. |
| Dating App | [`?s=dating`](https://michaelpett24.github.io/ok-millennial/?s=dating) | 34. 5 miles away. Loves: being asleep. |
| Receipt | [`?s=receipt`](https://michaelpett24.github.io/ok-millennial/?s=receipt) | An itemised list of what you have done. |
| Professional Network | [`?s=linkedin`](https://michaelpett24.github.io/ok-millennial/?s=linkedin) | Humbled and honoured to announce that you are like this. |

`?s=random` picks one for you, which is the correct way to send it to a group.

### Keeping it employable

The site is rude by default. `?spice=mild` swaps the profanity for
work-appropriate nonsense so you can drop it in a company Slack without a
conversation afterwards. There's a toggle at the bottom of the page, and it
travels with any link you copy from the skin drawer.

---

## How it decides

Ten questions, four answers each. Every answer adds points across six axes:

`decay` · `cringe` · `broke` · `nostalgia` · `effort` · `cope`

Your dominant axis picks one of six verdicts. Two more are special:

- **Terminal Millennial** — you took damage in all six categories at once.
- **Unverified** — you picked every flattering answer, which is its own diagnosis.

The scoring is tuned so all eight are reachable and none of them swallows the
quiz. `tools/balance.js` proves it, and CI runs it on every push:

```bash
node tools/balance.js
```

```
DISTRIBUTION over 400,000 random playthroughs
  cringe       86347  21.6%
  effort       79316  19.8%
  cope         76050  19.0%
  decay        56728  14.2%
  nostalgia    40094  10.0%
  broke        33050   8.3%
  terminal     24353   6.1%
  liar          4062   1.0%
```

If you add or reword questions, run it again. It exits non-zero if any verdict
becomes unreachable.

---

## Adding a skin

Two edits, no build step, no framework.

**1. Add the copy** in `assets/js/data.skins.js`:

```js
airline: {
  name: 'Boarding Pass',
  blurb: 'Group 8. Basic Economy. No overhead bin access.',
  brand: 'SKYWEST GENERATIONAL',
  hed: 'Check in for your assessment',
  dek: '{n} questions. Seat selection is not available.',
  cta: 'Check In',
  prog: (i, n) => `Passenger ${i} of ${n}`,
  computing: 'Boarding…',
  kicker: 'BOARDING GROUP',
  rxLabel: 'Restrictions',
  restart: 'Rebook',
  share: 'Email Itinerary',
  outro: 'Your seat does not recline.'   // optional
}
```

`{n}` is replaced with the live question count, so the copy can't go stale when
you add questions.

**2. Add the look** in `assets/css/skins.css`:

```css
[data-skin="airline"] {
  --bg: #0b2545;
  --bg-card: #ffffff;
  --accent: #d64545;
  --font: "Helvetica Neue", Arial, sans-serif;
  --radius: 2px;
}
```

Everything structural — layout, spacing, the progress bar, the result bars — is
already wired to those variables in `assets/css/base.css`. Override as few or as
many as you like, then add a signature rule or two if the skin needs real
character (see `y2k`'s title bar or `receipt`'s torn paper edge).

It shows up in the drawer, the URL, and the copy-link list automatically.

---

## Running it locally

There is no build step. It's HTML, CSS and four `<script>` tags.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Layout

```
index.html               the whole shell
assets/css/base.css      structure — variables only, no colours
assets/css/skins.css     14 skins, one block each
assets/js/data.questions.js   the interrogation
assets/js/data.verdicts.js    the diagnosis
assets/js/data.skins.js       the wardrobe
assets/js/app.js              scoring, routing, share links
tools/balance.js         proves the maths still works
```

---

Deployed by GitHub Actions on every push to `main`.

MIT. Take it, reskin it, aim it at your own friends.
