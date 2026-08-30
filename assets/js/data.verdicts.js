/* ok-millennial — the diagnosis.
   Fourteen quizzes all land here. Skins reframe the wrapper (DIAGNOSIS /
   PERFORMANCE RATING / YOUR READING) but the verdict underneath is the same.

   {n} = question count, {d} = times they declined to answer. */

const VERDICTS = {
  decay: {
    code: 'STRUCTURAL DAMAGE',
    title: 'Your Body Has Opened a Ticket',
    body: [
      "You are thirty-something and your spine is seventy-something. You weren't injured. You slept. That's the entire incident report — you lay down on purpose, in a bed you picked out and paid for, and woke up damaged.",
      "You now stretch before activities previously classified as nothing. Standing up. Getting a bowl down. Being tired in the general vicinity of a couch. At some point “going out” became “going,” and then that went too, and you didn't fight it. You were relieved.",
      "Nobody is coming to reverse this. It moves one direction and you are already making the noise."
    ],
    rx: [
      "Stop making the noise when you sit down. Everyone can hear it, and everyone has quietly decided something about you.",
      "It is not the mattress. You have bought two mattresses. It has never once been the mattress. It's you.",
      "You are one badly-timed sneeze from a six-week storyline, and you will tell everybody about it."
    ],
    share: "I got STRUCTURAL DAMAGE"
  },

  cringe: {
    code: 'PUBLIC EMBARRASSMENT',
    title: 'Gen Z Has Footage',
    body: [
      "There's a pause before you start talking in videos. There's a shape your jeans make. There's a way you say “adulting” that makes a 22-year-old go completely silent and study the floor until it passes.",
      "You are not being bullied. You are being documented. And the sick part is you'd love the video — you'd send it to the group chat, you'd caption it “this is SO me 😂”, and that caption is also the footage.",
      "You think you're in on it. You are not in on it. You are the joke doing a bit about being the joke, badly, to a room that stopped watching some time ago."
    ],
    rx: [
      "The socks were never the issue. It was never about the socks.",
      "Nobody has said “doggo” in years and the silence has been genuinely beautiful.",
      "Go one day without the laughing-crying emoji. You can't. Don't lie to me, you can't."
    ],
    share: "Apparently Gen Z has footage of me"
  },

  broke: {
    code: 'FISCALLY WHIMSICAL',
    title: 'You Are Not Saving. You Are Postponing.',
    body: [
      "You earn more than 22-year-old you could have imagined and you have less of it than 22-year-old you did. You know the exact asking price of a house you will never buy, on a street you drove down once, in a town you visited for somebody else's wedding.",
      "Your retirement strategy is a 401k you're afraid to open, a wallet you're afraid to open, and a warm private conviction that something is going to happen.",
      "Nothing is going to happen. There's no inheritance, no windfall, no year it all clicks. There is this, monthly, adjusted upward annually, until you die."
    ],
    rx: [
      "A subscription you forgot about has now consumed more content than you have.",
      "“I'm saving” is a vibe. It is not a number. You do not have a number and you know you don't.",
      "You're not getting the house. Genuinely — put it down and buy a better couch. You live on it anyway."
    ],
    share: "Turns out I'm FISCALLY WHIMSICAL"
  },

  nostalgia: {
    code: 'EMOTIONALLY HEADQUARTERED IN 2009',
    title: 'You Live in a Year That Has Closed',
    body: [
      "You still know your away message. You still defend a band that has broken up twice and reunited for money both times. Every playlist you build is a slow, sad rescue mission aimed at one specific summer.",
      "Here's the part nobody says out loud: it was never the music. It was that you were nineteen and nothing hurt and you had eleven dollars and it was fine. You are not chasing a decade. You are chasing a metabolism and a group of people who had time for you.",
      "They have jobs now. So do you. That's the whole story, and you're using a record player to avoid saying it."
    ],
    rx: [
      "Blockbuster is not coming back. Neither is that. Neither is your knee.",
      "You have rewatched that show more times than you have called the people you first watched it with.",
      "The record player has four hours on it. Your phone has four hours on it since lunch."
    ],
    share: "I'm EMOTIONALLY HEADQUARTERED IN 2009"
  },

  effort: {
    code: 'OPTIMIZED. STILL SAD.',
    title: 'You Have Turned Yourself Into a Project',
    body: [
      "Magnesium. Creatine. A walking pad under a standing desk. A sleep score you check before you are fully conscious — which is the least restful act a human being has ever performed, losing a test you sat unconscious.",
      "You've swapped a personality for a routine and you are doing GREAT, which is what people say in the half-second before a follow-up question. Your rings are closed. You are not.",
      "You have optimised your way to precisely nowhere, on schedule, with a chart to prove it. The chart is the only thing that has improved."
    ],
    rx: [
      "The water bottle is a bucket. You have brought a bucket to brunch and nobody said anything.",
      "Nobody has ever reached the end of a habit tracker and found a friend waiting there.",
      "You are not disciplined. You are frightened, on a schedule."
    ],
    share: "Verdict: OPTIMIZED. STILL SAD."
  },

  cope: {
    code: 'LOW POWER MODE',
    title: "You're a Streaming Service With a Pulse",
    body: [
      "You cancel plans with the ease and technical confidence of a professional. “I've got a thing.” You do not have a thing. The thing is a couch, a show you have already finished, and a phone held six inches from a television you are actively paying for.",
      "This isn't rest. Rest ends. This is a lifestyle, and it bills monthly, and you have been on it for years.",
      "The worst part is it's working. You've made yourself so unavailable that nobody asks any more, and you've decided that's peace."
    ],
    rx: [
      "You have saved 400 things to send to people and sent six.",
      "Rewatching isn't watching. It's hiding, with snacks.",
      "The plans you cancelled were with people who'd have made you feel better. Outstanding work."
    ],
    share: "I have been placed in LOW POWER MODE"
  },

  /* ---- specials: these outrank the dominant axis ---- */

  terminal: {
    code: 'TERMINAL MILLENNIAL',
    title: 'Nothing Can Be Done For You',
    body: [
      "You scored high in every single category, which is impressive the way a car fire is impressive. Tired, broke, cringe, nostalgic, over-optimised and horizontal — simultaneously, at full strength, in one body.",
      "You are an entire generation compressed into a single person holding a canvas tote. There is no dominant problem to work on because it is all of them, evenly, and they are load-bearing.",
      "Historians will use you as the example. There will be a slide. You will not be on it favourably."
    ],
    rx: [
      "Genuine respect. That is a lot of damage to sustain in {n} questions.",
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
      "You picked the good answers because you could see they were the good answers. That is the single most millennial act available to a human being: performing wellness for a website that is, at this moment, insulting you.",
      "Your back hurts. We both know your back hurts. You wanted to beat a quiz that has no winner, and you did it alone, in a browser, for nobody.",
      "Nobody is grading this. You cheated anyway. Sit with that."
    ],
    rx: [
      "Take it again honestly. Nobody's watching. That, specifically, is the problem.",
      "“I'm fine” is a complete sentence and, in your case, a work of fiction.",
      "Needing to win this says considerably more about you than losing would have."
    ],
    meter: 'Statements independently verified: <strong>0%</strong>',
    share: "I beat the quiz. The quiz says I'm lying"
  },

  evasive: {
    code: 'NON-RESPONSIVE',
    title: "You Wouldn't Even Answer the Quiz",
    body: [
      "You declined {d} times. On a quiz. That you clicked. Voluntarily. Nobody made you open this, nobody is reading your answers, and you still found a way to abstain from your own life {d} separate times.",
      "You've been doing this for years. You didn't choose the job, you “ended up” in it. You didn't choose the city, you “sort of stayed.” You didn't end that relationship, it “ran its course” — over eighteen months, while you waited.",
      "This asked you {n} small questions about yourself and you took the fifth. There's no result here because you didn't give us one. That is the result."
    ],
    rx: [
      "“None of these” was right there, and it was the easiest thing you did all week.",
      "Not deciding is a decision. It's just the one where somebody else picks.",
      "Go back. Answer them properly. You won't, but the option is technically there — as always."
    ],
    meter: 'Questions declined: <strong>{d}</strong>',
    share: "I declined to answer a quiz about myself"
  }
};

/* Rotating sign-offs. Softened automatically in ?spice=mild. */
const SIGNOFFS = [
  "Anyway. Go to bed. It's 9:40.",
  "That's the assessment. Now fuck off and drink some water.",
  "Please leave. Carefully. The knee.",
  "That's your result. Go be tired somewhere else.",
  "You may now resume holding your phone above your face until it lands on it.",
  "Close the laptop, champ. There's nothing else good in there.",
  "Screenshot it. Send it to the group chat. That was always the plan.",
  "None of this was a surprise to anyone but you.",
  "Go on then. Off you fuck."
];

const AXIS_LABELS = {
  decay:     'Physical Decline',
  cringe:    'Detectable Cringe',
  broke:     'Financial Fiction',
  nostalgia: 'Living in the Past',
  effort:    'Performative Wellness',
  cope:      'Horizontal Lifestyle'
};
