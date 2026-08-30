/* ok-millennial — the diagnosis.
   Skins reframe these (DIAGNOSIS / PERFORMANCE RATING / YOUR STAR SIGN SAYS),
   but the roast underneath is the same roast. */

const VERDICTS = {
  decay: {
    code: 'STRUCTURAL DAMAGE',
    title: 'Your Body Has Opened a Ticket',
    body: [
      "You are thirty-something and your spine is seventy-something. You weren't injured. You slept. That's the whole incident report — you laid down on purpose and woke up compromised.",
      "You now stretch before activities that were previously classified as nothing. Standing up. Getting a bowl down. Being tired in the general vicinity of a couch. At some point “going out” became “going,” and then that went too."
    ],
    rx: [
      "Stop making the noise when you sit down. Everyone can hear it and it is not helping.",
      "It's not the mattress. You've bought two mattresses. It has never once been the mattress.",
      "You are one aggressive sneeze away from a six-week storyline."
    ],
    share: "I got STRUCTURAL DAMAGE"
  },

  cringe: {
    code: 'PUBLIC EMBARRASSMENT',
    title: 'Gen Z Has Footage',
    body: [
      "There's a pause before you start talking in videos. There's a shape your jeans make. There's a way you say “adulting” that makes a 22-year-old go completely silent and look at the floor.",
      "You are not being bullied. You are being documented. And the sick part is you'd love the video. You'd send it to the group chat. You'd caption it “this is SO me 😂”. Which is, itself, the footage."
    ],
    rx: [
      "The socks were never the issue. It was never about the socks.",
      "Nobody has said “doggo” in years and the silence has been beautiful.",
      "Try going one day without the laughing-crying emoji. You can't. Don't lie. You can't."
    ],
    share: "Apparently Gen Z has footage of me"
  },

  broke: {
    code: 'FISCALLY WHIMSICAL',
    title: 'You Are Not Saving. You Are Postponing.',
    body: [
      "You earn more than 22-year-old you could imagine and you have less of it than 22-year-old you did. You know the exact asking price of a house you will never buy, on a street you drove down once, in a town you visited for a wedding.",
      "Your retirement plan is a 401k you're scared to open, a wallet you're scared to open, and a warm private belief that something is going to happen. Something is not going to happen."
    ],
    rx: [
      "A subscription you forgot about has now consumed more content than you have.",
      "“I'm saving” is a vibe. It is not a number. You do not have a number.",
      "You're not getting the house. Genuinely, let it go and buy a nicer couch — you live on it anyway."
    ],
    share: "Turns out I'm FISCALLY WHIMSICAL"
  },

  nostalgia: {
    code: 'EMOTIONALLY HEADQUARTERED IN 2009',
    title: 'You Live in a Year That Has Closed',
    body: [
      "You still know your away message. You still defend a band that has broken up twice and reunited for money. Every playlist you build is a slow sad rescue mission aimed at one specific summer.",
      "Here's the thing nobody tells you: it wasn't the music. It was that you were nineteen and nothing hurt and you had eleven dollars and it was fine. You're trying to get back to a metabolism."
    ],
    rx: [
      "Blockbuster is not coming back. Neither is that. Neither is your knee.",
      "You have rewatched that show more times than you have called the people you watched it with.",
      "The record player has four hours on it. Your phone has four hours on it since lunch."
    ],
    share: "I'm EMOTIONALLY HEADQUARTERED IN 2009"
  },

  effort: {
    code: 'OPTIMIZED. STILL SAD.',
    title: 'You Have Turned Yourself Into a Project',
    body: [
      "Magnesium. Creatine. A walking pad under a standing desk. A sleep score you check before you are fully conscious, which is the least restful act a human being has ever performed.",
      "You've swapped a personality for a routine and you are doing GREAT — which is what people say right before a follow-up question. Your rings are closed. You are not."
    ],
    rx: [
      "Your sleep score is grading you on a test you take unconscious. You're losing to yourself while asleep.",
      "The water bottle is a bucket. You have brought a bucket to brunch.",
      "Nobody has ever reached the end of a habit tracker and found a friend waiting there."
    ],
    share: "Verdict: OPTIMIZED. STILL SAD."
  },

  cope: {
    code: 'LOW POWER MODE',
    title: "You're a Streaming Service With a Pulse",
    body: [
      "You cancel plans with the ease and technical confidence of a professional. “I've got a thing.” You do not have a thing. The thing is a couch, a show you have already seen, and a phone held six inches from a television you are paying for.",
      "This isn't rest. Rest ends. This is a lifestyle, and it bills monthly."
    ],
    rx: [
      "You have saved 400 things to send to people and sent six.",
      "Rewatching isn't watching. It's hiding, with snacks.",
      "The plans you cancelled were with people who would have made you feel better. Great work."
    ],
    share: "I have been placed in LOW POWER MODE"
  },

  /* specials — chosen by total score, not by axis */
  terminal: {
    code: 'TERMINAL MILLENNIAL',
    title: 'Nothing Can Be Done For You',
    body: [
      "You scored high in every single category, which is impressive the way a car fire is impressive. Tired, broke, cringe, nostalgic, over-optimised and horizontal — simultaneously, at full strength.",
      "You are an entire generation compressed into one person holding a canvas tote. Historians are going to use you as the example. There will be a slide."
    ],
    rx: [
      "Genuine respect. That was a lot of damage to sustain in {n} questions.",
      "Have you considered simply having been born in 2003 instead?",
      "This is the ninth quiz you've taken about yourself this year. It is August."
    ],
    meter: 'Categories affected: <strong>all six</strong>',
    share: "I am, clinically, a TERMINAL MILLENNIAL"
  },

  liar: {
    code: 'UNVERIFIED',
    title: 'You Lied on This Quiz',
    body: [
      "Nobody scores this low. You picked the good answers because you could see they were the good answers, which is the most millennial act available to a person: performing wellness for a website that is currently insulting you.",
      "Your back hurts. We both know your back hurts. You wanted to beat a quiz that has no winner, and you did it in front of everyone."
    ],
    rx: [
      "Take it again honestly. Nobody's watching. That, specifically, is the problem.",
      "“I'm fine” is a complete sentence and also, in your case, a work of fiction.",
      "Needing to win this says considerably more about you than losing would have."
    ],
    meter: 'Statements independently verified: <strong>0%</strong>',
    share: "I beat the quiz. The quiz says I'm lying"
  }
};

/* rotating sign-offs. {spice} lines get softened in mild mode. */
const SIGNOFFS = [
  "Anyway. Go to bed. It's 9:40.",
  "That's the assessment. Now fuck off and drink some water.",
  "Please leave. Carefully. The knee.",
  "This has been your results. Go be tired somewhere else.",
  "You may now return to holding your phone above your face until it falls on it.",
  "Close the laptop, champ. Nothing else good is in there.",
  "Screenshot it. Send it to the group chat. That's all you were ever going to do."
];

const AXIS_LABELS = {
  decay:     'Physical Decline',
  cringe:    'Detectable Cringe',
  broke:     'Financial Fiction',
  nostalgia: 'Living in the Past',
  effort:    'Performative Wellness',
  cope:      'Horizontal Lifestyle'
};
