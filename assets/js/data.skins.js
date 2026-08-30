/* ok-millennial — the wardrobe.
   Same quiz, same insults, fourteen completely different websites.
   Add a skin: append an entry here + a [data-skin="id"] block in skins.css. */

const SKINS = {
  quiz: {
    name: 'Listicle Quiz',
    blurb: 'The 2014 clickbait personality quiz. Where it all began.',
    brand: 'OK Millennial',
    hed: 'Which Kind Of Tired Are You? 😩',
    dek: "{n} questions. Brutally accurate. Number 6 will personally attack you.",
    cta: "Let's Do This!!",
    fine: "{n} questions · takes a minute · you will not like it",
    prog: (i, n) => `Question ${i} of ${n}`,
    computing: 'Calculating your result…',
    kicker: 'YOUR RESULT',
    rxLabel: 'What This Says About You',
    restart: 'Take It Again',
    share: 'Share Your Result'
  },

  hr: {
    name: 'Performance Review',
    blurb: 'Sterile. Corporate. Somehow the meanest one.',
    brand: 'PeopleFirst™ Talent Portal',
    hed: 'Annual Self-Assessment',
    dek: 'This form takes approximately 3 minutes. Your responses are confidential and will be discussed at length.',
    cta: 'Begin Assessment',
    fine: "Est. completion time: 3 min · Retained for 7 years · Form PF-{n}",
    prog: (i, n) => `Section ${i} / ${n} · Required`,
    computing: 'Submitting to Workforce Analytics…',
    kicker: 'PERFORMANCE RATING',
    rxLabel: 'Development Opportunities',
    restart: 'Resubmit Form',
    share: 'Forward to Manager',
    outro: 'This review will be retained in your file indefinitely.'
  },

  webmd: {
    name: 'Symptom Checker',
    blurb: 'You looked up a headache and it said this.',
    brand: 'SymptomCheckr',
    hed: 'Check Your Symptoms',
    dek: 'Answer a few questions about how you have been feeling. This tool does not provide medical advice, but it is right.',
    cta: 'Start Symptom Check',
    fine: "Not a substitute for professional medical advice. Obviously.",
    prog: (i, n) => `Step ${i} of ${n}`,
    computing: 'Analyzing {n} symptoms against 1 condition…',
    kicker: 'PRIMARY DIAGNOSIS',
    rxLabel: 'Recommended Treatment',
    restart: 'Check Again',
    share: 'Send to a Loved One',
    outro: 'Consult a physician. Or don’t. You’ve been meaning to find one since you moved.'
  },

  y2k: {
    name: 'Windows 98',
    blurb: 'You have 1 new message. It is about your knees.',
    brand: 'MillennialQuiz98.exe',
    hed: 'Welcome To The Internet!!',
    dek: 'Please do not close this window while your personality downloads. Best viewed at 800x600.',
    cta: 'RUN PROGRAM',
    fine: "Requires 4MB RAM · Do not close this window · © 1998",
    prog: (i, n) => `Loading question ${i}/${n}…`,
    computing: 'Dialing up… please do not pick up the phone…',
    kicker: 'SYSTEM DIAGNOSIS',
    rxLabel: 'Error Log',
    restart: 'Restart Computer',
    share: 'E-Mail This Page',
    outro: 'You have (1) new message. It is from your spine.'
  },

  myspace: {
    name: 'Top 8',
    blurb: 'Black background, glitter text, one Fall Out Boy song autoplaying.',
    brand: 'xX_MillenniaL_Xx',
    hed: 'hey stranger ✨ take my survey',
    dek: 'repost this if u actually read it. no1 ever does. currently listening to: something that ruined you',
    cta: 'take the survey!! <3',
    fine: "{n} questions!! be honest!! no1 else has been",
    prog: (i, n) => `~*~ question ${i} of ${n} ~*~`,
    computing: 'loading… (song is still playing, sorry)',
    kicker: 'ur results',
    rxLabel: 'about me',
    restart: 'retake survey',
    share: 'repost to bulletin',
    outro: 'ur in my top 8. that’s all i can offer u right now.'
  },

  wellness: {
    name: 'Wellness Brand',
    blurb: 'Lowercase serif. Millennial pink. Devastating.',
    brand: 'hey.',
    hed: 'a moment for you.',
    dek: '{n} small questions. no wrong answers. (there are wrong answers.)',
    cta: 'begin',
    fine: "{n} questions. take your time. or don't.",
    prog: (i, n) => `${i} of ${n}`,
    computing: 'holding space for your results…',
    kicker: 'what we found',
    rxLabel: 'gentle suggestions',
    restart: 'start over',
    share: 'share this',
    outro: 'be well. drink water. it will not be enough.'
  },

  terminal: {
    name: 'Terminal',
    blurb: 'For the ones who describe themselves as "technical."',
    brand: 'millennial-diag v2.4.1',
    hed: '$ ./diagnose --self',
    dek: 'Running {n} assertions against subject. Do not interrupt the process.',
    cta: 'EXECUTE',
    fine: "{n} assertions · MIT licensed · no telemetry, we just guess",
    prog: (i, n) => `[${i}/${n}] awaiting input`,
    computing: 'compiling personality… 87%',
    kicker: 'PROCESS EXITED WITH CODE 1',
    rxLabel: 'stack trace',
    restart: 'rerun',
    share: 'pipe to friend',
    outro: '// 8 tests, 8 failed. this is expected behaviour.'
  },

  keynote: {
    name: 'Product Launch',
    blurb: 'One more thing: you.',
    brand: 'You',
    hed: 'Introducing You. Pro.',
    dek: 'The most advanced version of you ever made. Also the most tired. Available now, unfortunately.',
    cta: 'Learn More',
    fine: "{n} questions. Available today. Starting at your dignity.",
    prog: (i, n) => `${i} / ${n}`,
    computing: 'Rendering…',
    kicker: 'SPECIFICATIONS',
    rxLabel: 'Known Limitations',
    restart: 'Configure Again',
    share: 'Share',
    outro: 'Battery life: worse. Price: higher. Available in one colour: tired.'
  },

  dmv: {
    name: 'Government Form',
    blurb: 'Form 401-K. Please take a number.',
    brand: 'DEPARTMENT OF GENERATIONAL AFFAIRS',
    hed: 'FORM 401-K: DECLARATION OF MILLENNIAL STATUS',
    dek: 'Complete all sections in blue or black ink. Incomplete forms will be returned. Processing time: 6–8 weeks.',
    cta: 'BEGIN FORM',
    fine: "FORM 401-K · OMB NO. 1996-0000 · EST. BURDEN: {n} MIN",
    prog: (i, n) => `SECTION ${i} OF ${n} — MANDATORY`,
    computing: 'PROCESSING. DO NOT REFRESH. DO NOT APPROACH THE WINDOW.',
    kicker: 'DETERMINATION',
    rxLabel: 'NOTICE OF DEFICIENCY',
    restart: 'SUBMIT NEW FORM',
    share: 'REQUEST DUPLICATE COPY',
    outro: 'You may appeal this determination in person, weekdays, 9:00–11:30 AM.'
  },

  astro: {
    name: 'Horoscope',
    blurb: 'The stars have looked at your camera roll.',
    brand: 'co—starrr',
    hed: 'The universe has notes.',
    dek: 'Answer honestly. Mercury is not retrograde. This is just you.',
    cta: 'Read My Chart',
    fine: "{n} houses · read at your own risk · the stars don't care",
    prog: (i, n) => `house ${i} of ${n}`,
    computing: 'consulting the sky…',
    kicker: 'YOUR READING',
    rxLabel: 'the cosmos advises',
    restart: 'Read Again',
    share: 'Send to your person',
    outro: 'Today: nothing will happen. Tomorrow: see today.'
  },

  news: {
    name: 'Breaking News',
    blurb: 'We interrupt this broadcast to discuss your lower back.',
    brand: 'ACTION 9 NEWS',
    hed: 'BREAKING: LOCAL ADULT STILL LIKE THIS',
    dek: 'Our team has {n} questions for you. Officials are asking the public to remain calm.',
    cta: 'WATCH NOW',
    fine: "{n} QUESTIONS · THIS IS A DEVELOPING STORY · LIVE",
    prog: (i, n) => `DEVELOPING · ${i} OF ${n}`,
    computing: 'GOING LIVE TO THE SCENE…',
    kicker: 'THE REPORT',
    rxLabel: 'WHAT AUTHORITIES ARE SAYING',
    restart: 'REPLAY SEGMENT',
    share: 'SEND TIP',
    outro: 'We will stay on this story. We will not update it.'
  },

  dating: {
    name: 'Dating App',
    blurb: '34. 5 miles away. Loves: being asleep.',
    brand: 'Bümble',
    hed: 'Complete your profile',
    dek: 'Profiles with all {n} answers get 3x more matches. Yours will not.',
    cta: 'Continue',
    fine: "{n} prompts · Free to complete · Matches not guaranteed",
    prog: (i, n) => `Profile ${Math.round((i / n) * 100)}% complete`,
    computing: 'Finding your matches…',
    kicker: 'YOUR PROFILE',
    rxLabel: 'Prompts You Should Not Answer',
    restart: 'Edit Profile',
    share: 'Share Profile',
    outro: 'You’ve run out of likes for today. You used them all on one person. Again.'
  },

  receipt: {
    name: 'Receipt',
    blurb: 'An itemised list of what you have done.',
    brand: 'THANK YOU FOR YOUR VISIT',
    hed: '*** CUSTOMER SURVEY ***',
    dek: 'COMPLETE {n} ITEMS FOR A CHANCE TO WIN $500. NO PURCHASE NECESSARY. YOU WILL NOT WIN.',
    cta: 'BEGIN SURVEY',
    fine: "{n} ITEMS · NO CASH VALUE · KEEP FOR YOUR RECORDS",
    prog: (i, n) => `ITEM ${i}/${n}`,
    computing: 'PRINTING…',
    kicker: 'TOTAL',
    rxLabel: 'ITEMISED',
    restart: 'NEW TRANSACTION',
    share: 'EMAIL RECEIPT',
    outro: 'NO REFUNDS. NO EXCHANGES. STORE CREDIT ONLY.'
  },

  linkedin: {
    name: 'Professional Network',
    blurb: 'Humbled and honoured to announce that you are like this.',
    brand: 'LinkedOut',
    hed: "I'm humbled to share a quick reflection. 🙏",
    dek: "Most people won't read all {n} questions. Fewer will answer honestly. Here's why that matters. 🧵",
    cta: 'See more',
    fine: "{n} questions · 4 min read · 847 people found this insightful",
    prog: (i, n) => `Reflection ${i} of ${n}`,
    computing: 'Posting to your network…',
    kicker: 'KEY TAKEAWAY',
    rxLabel: '3 Lessons Any Founder Can Apply',
    restart: 'Repost',
    share: 'Share with your network',
    outro: 'Agree? Disagree? Let me know in the comments. 👇 #blessed #grindset #authenticity'
  }
};

const SKIN_IDS = Object.keys(SKINS);
const DEFAULT_SKIN = 'quiz';
