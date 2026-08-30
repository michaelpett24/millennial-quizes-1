# OK Millennial

Fourteen quizzes that have already made up their minds about you.

The performance review asks about your greatest professional strength. The
symptom checker asks where the pain is. The receipt asks what you bought this
week. The Windows 98 build asks you to choose a screen name.

They are entirely different websites asking entirely different questions — 98
of them, no two the same — and every single one arrives at the same nine
conclusions about who you are.

**→ [Take one](https://michaelpett24.github.io/ok-millennial/)**

---

## The point

You don't send one link. You send fourteen different ones.

Your college roommate gets a corporate self-assessment. Your sister gets a
WebMD symptom checker. The group chat gets a DMV form. They each take a real,
different quiz — and then compare results and find the same verdict staring
back, worded identically.

| Quiz | Link | Opens with |
|---|---|---|
| Listicle Quiz | [`?s=quiz`](https://michaelpett24.github.io/ok-millennial/?s=quiz) | "What time did you actually get in bed last night?" |
| Performance Review | [`?s=hr`](https://michaelpett24.github.io/ok-millennial/?s=hr) | "Describe your greatest professional strength." |
| Symptom Checker | [`?s=webmd`](https://michaelpett24.github.io/ok-millennial/?s=webmd) | "Where would you say the discomfort is located?" |
| Windows 98 | [`?s=y2k`](https://michaelpett24.github.io/ok-millennial/?s=y2k) | "STEP 1: Please choose a screen name." |
| Top 8 | [`?s=myspace`](https://michaelpett24.github.io/ok-millennial/?s=myspace) | "currently listening to??" |
| Wellness Brand | [`?s=wellness`](https://michaelpett24.github.io/ok-millennial/?s=wellness) | "how are you? and then: how are you actually?" |
| Terminal | [`?s=terminal`](https://michaelpett24.github.io/ok-millennial/?s=terminal) | `$ uptime --since-last-real-rest` |
| Product Launch | [`?s=keynote`](https://michaelpett24.github.io/ok-millennial/?s=keynote) | "First, choose your configuration." |
| Government Form | [`?s=dmv`](https://michaelpett24.github.io/ok-millennial/?s=dmv) | "SECTION 1 — DECLARE YOUR HOUSING STATUS." |
| Horoscope | [`?s=astro`](https://michaelpett24.github.io/ok-millennial/?s=astro) | "The moon is transiting your house of rest." |
| Breaking News | [`?s=news`](https://michaelpett24.github.io/ok-millennial/?s=news) | "Where were you when you first noticed?" |
| Dating App | [`?s=dating`](https://michaelpett24.github.io/ok-millennial/?s=dating) | "My simple pleasures…" |
| Receipt | [`?s=receipt`](https://michaelpett24.github.io/ok-millennial/?s=receipt) | "SCAN ITEM 1 — WHAT DID YOU BUY THIS WEEK?" |
| Professional Network | [`?s=linkedin`](https://michaelpett24.github.io/ok-millennial/?s=linkedin) | "Let's start with your journey. 🧵" |

`?s=random` picks one for you, which is the correct way to send it to a group.

### Keeping it employable

Rude by default. `?spice=mild` swaps the profanity for work-appropriate
nonsense so you can drop it in a company Slack without a conversation
afterwards. There's a toggle at the bottom of every page, and it travels with
any link you copy.

---

## How it decides

Seven questions per quiz, five answers each. Four of them score points across
six axes:

`decay` · `cringe` · `broke` · `nostalgia` · `effort` · `cope`

The fifth is always an opt-out, worded in that site's voice — *DECLINE TO
ANSWER*, *VOID ITEM*, *the stars don't need to know*. Taking it costs you
nothing except that it's counted.

Your dominant axis picks one of six verdicts. Three more override it:

- **Terminal Millennial** — you took damage in every category at once.
- **Unverified** — you picked every flattering answer, which is its own diagnosis.
- **Non-Responsive** — you declined three or more times, on a quiz, that you
  clicked, voluntarily.

Every axis has to be winnable in every one of the fourteen sets, or the quiz is
broken. `tools/balance.js` proves it, and CI runs it on every push:

```bash
node tools/balance.js
```

```
AXIS WINNABILITY — playing greedily for one axis in each set

  set       decay  cring  broke  nosta  effor  cope
  quiz        ok     ok     ok     ok   liar     ok
  hr          ok     ok     ok     ok   liar     ok
  ...
```

(`liar` in the effort column is correct — playing every flattering answer is
exactly what triggers that verdict.) It exits non-zero if an axis can't win a
set, if any verdict becomes unreachable, or if a skin has no question set.

## Seeing it all at once

Reviewing this by hand meant playing fourteen quizzes. Don't:

```bash
python3 -m http.server 8099 &
node tools/contact-sheet.js
```

Writes `preview/skins.png` (all fourteen sites side by side) and
`preview/verdicts.png` (every verdict as plain readable copy — the only honest
way to judge whether a line earns its place).

---

## Adding a quiz

Three edits, no build step, no framework.

**1. Write the questions** in `assets/js/data.questions.js`, in that site's
voice — the framing device is what makes them funny:

```js
airline: [
  { id: 'boarding', q: "Select your boarding group.", a: [
    { t: "Group 8. I've accepted it.",              s: { cope: 3 } },
    { t: "I paid to board earlier. It changed nothing.", s: { broke: 3 } },
    { t: "I stand by the gate 40 minutes early.",   s: { effort: 3 } },
    { t: "I remember when this was free.",          s: { nostalgia: 3 } } ] },
  // ...six more
]
```

Don't write the opt-out — it's appended at render time from the skin's `none`.

**2. Add the copy** in `assets/js/data.skins.js` (`name`, `blurb`, `brand`,
`hed`, `dek`, `cta`, `fine`, `none`, `prog`, `computing`, `kicker`, `rxLabel`,
`restart`, `share`, optional `outro`). `{n}` is replaced with the live question
count so copy can't go stale.

**3. Add the look** in `assets/css/skins.css`:

```css
[data-skin="airline"] {
  --bg: #0b2545;
  --bg-card: #ffffff;
  --accent: #d64545;
  --radius: 2px;
}
```

Everything structural is already wired to those variables in `base.css`.
Override as few as you like, then add a signature rule or two if it needs real
character — see `y2k`'s title bar or `receipt`'s torn paper edge.

Then run `node tools/balance.js`. If it complains that an axis can't win your
set, that axis needs to appear in more of your questions.

---

## Running it locally

No build step. HTML, CSS, four `<script>` tags.

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Layout

```
index.html                    the shell
assets/css/base.css           structure — variables only, no colours
assets/css/skins.css          14 skins, one block each
assets/js/data.questions.js   14 quizzes, 98 questions
assets/js/data.verdicts.js    the nine ways of being told
assets/js/data.skins.js       voice and chrome per site
assets/js/app.js              scoring, routing, share links
tools/balance.js              proves every axis can still win every set
tools/contact-sheet.js        renders everything to one image
```

---

Deployed by GitHub Actions on every push to `main`.

MIT. Take it, reskin it, point it at your own friends.
