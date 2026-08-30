/* ok-millennial — the interrogation.
   Every skin asks the same questions. Only the outfit changes.

   Axes: decay, cringe, broke, nostalgia, effort, cope
   Scoring is balanced so all six axes are winnable — see tools/balance.js. */

const QUESTIONS = [
  {
    id: 'bedtime',
    q: "Be honest. What time did you actually get in bed last night?",
    a: [
      { t: "Before 10. And I'd do it again.",                s: { decay: 3 } },
      { t: "Midnight — but I was on my phone until 1:40.",   s: { cope: 3 } },
      { t: "Late! Like… 11:15?",                             s: { decay: 2, cringe: 1 } },
      { t: "I was up at 5:40 to work out first. Sorry.",     s: { effort: 3 } }
    ]
  },
  {
    id: 'skull',
    q: "A 23-year-old coworker replies to your message with 💀. This means:",
    a: [
      { t: "Something has gone extremely wrong.",            s: { cringe: 3 } },
      { t: "They think I'm hilarious. We're friends now.",   s: { cringe: 2, cope: 1 } },
      { t: "I use 💀 too. I'm in on it. I'm one of them.",   s: { cringe: 3, effort: 1 } },
      { t: "I stopped opening Slack in 2023.",               s: { cope: 3 } }
    ]
  },
  {
    id: 'cart',
    q: "Your last three online orders were:",
    a: [
      { t: "Magnesium, blackout curtains, air fryer liners", s: { effort: 3 } },
      { t: "A charger. A charger. A charger.",               s: { cope: 3 } },
      { t: "Something on Etsy for a house I don't own",      s: { broke: 3 } },
      { t: "Reading glasses. Just the cheap ones. It's fine.", s: { decay: 3 } }
    ]
  },
  {
    id: 'excuse',
    q: "Finish the sentence: “I'd love to, but…”",
    a: [
      { t: "“…I've got a thing.” (There is no thing.)",      s: { cope: 3 } },
      { t: "“…that's a weeknight.”",                         s: { decay: 3 } },
      { t: "“…parking down there is insane now.”",           s: { cringe: 3 } },
      { t: "“…I'm saving.” (For what? Unclear.)",            s: { broke: 3 } }
    ]
  },
  {
    id: 'owns',
    q: "Which of these is in your home right now, unironically?",
    a: [
      { t: "A record player with four hours on it",          s: { nostalgia: 3 } },
      { t: "A water bottle the size of a fire extinguisher", s: { effort: 3 } },
      { t: "Something in a font that says “But First, Coffee”", s: { cringe: 3 } },
      { t: "Four subscriptions I have forgotten about",      s: { broke: 3 } }
    ]
  },
  {
    id: 'money',
    q: "Describe your retirement strategy.",
    a: [
      { t: "A 401k I open when I'm feeling emotionally strong", s: { broke: 3 } },
      { t: "The band could get back together. I'd tour with them.", s: { nostalgia: 3 } },
      { t: "My parents' house. Eventually. Morbidly.",       s: { cope: 3 } },
      { t: "I have a spreadsheet and I am genuinely fine.",  s: { effort: 3 } }
    ]
  },
  {
    id: 'year',
    q: "You may return to one year. Right now. Choose.",
    a: [
      { t: "2007",                                           s: { nostalgia: 3 } },
      { t: "2014 — peak everything",                         s: { nostalgia: 2, cringe: 1 } },
      { t: "2019, for reasons we all understand",            s: { cope: 2, nostalgia: 2 } },
      { t: "None. Forward. Always forward.",                 s: { effort: 3 } }
    ]
  },
  {
    id: 'pain',
    q: "What hurts?",
    a: [
      { t: "Lower back. Ongoing. We're managing it.",        s: { decay: 3 } },
      { t: "My knee. From nothing. From literally nothing.", s: { decay: 3 } },
      { t: "Nothing! I feel great!",                          s: { effort: 3 } },
      { t: "My bank account, mostly.",                        s: { broke: 3 } }
    ]
  },
  {
    id: 'song',
    q: "Someone puts on a song from 2006. You:",
    a: [
      { t: "Know every word. Including the ad-libs.",        s: { nostalgia: 3 } },
      { t: "Grab the nearest arm and say “oh my GOD”",       s: { nostalgia: 3, cringe: 1 } },
      { t: "Mention that I saw them before they got big",    s: { cringe: 3 } },
      { t: "Don't recognise it. I only do podcasts now.",    s: { decay: 2, effort: 1 } }
    ]
  },
  {
    id: 'roll',
    q: "Final one. Your camera roll is, honestly:",
    a: [
      { t: "Screenshots. Thousands. Never opened again.",    s: { cope: 3 } },
      { t: "Memes I saved to send, and did not send.",       s: { cope: 2, cringe: 1 } },
      { t: "The dog. It's 900 photos of the dog.",           s: { cringe: 3 } },
      { t: "Progress pics in the same bathroom light",       s: { effort: 3 } }
    ]
  }
];
