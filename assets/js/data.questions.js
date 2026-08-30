/* ok-millennial — the interrogations.
   Every skin runs its OWN quiz, written in that skin's voice: the performance
   review asks review questions, the symptom checker asks about symptoms, the
   receipt asks what you bought. Only the scoring engine is shared.

   Axes: decay, cringe, broke, nostalgia, effort, cope
   Every question also gets a skin-flavoured opt-out appended at render time
   (SKINS[id].none) — declining is tracked, and enough of it is its own verdict.

   Run tools/balance.js after editing: it checks all 14 sets. */

const QUESTION_SETS = {

/* ------------------------------------------------------ 1. LISTICLE QUIZ */
quiz: [
  { id: 'bedtime', q: "Be honest. What time did you actually get in bed last night?", a: [
    { t: "Before 10. And I'd do it again.",                    s: { decay: 3 } },
    { t: "Midnight — but I was on my phone until 1:40.",       s: { cope: 3 } },
    { t: "Late! Like… 11:15?",                                 s: { decay: 2, cringe: 1 } },
    { t: "Up at 5:40 to work out first. Sorry.",               s: { effort: 3 } } ] },
  { id: 'skull', q: "A 23-year-old at work replies to you with 💀. This means:", a: [
    { t: "Something has gone extremely wrong.",                s: { cringe: 3 } },
    { t: "They think I'm hilarious. We're friends now.",       s: { cringe: 2, cope: 1 } },
    { t: "I use 💀 too. I'm in on it. I'm one of them.",       s: { cringe: 3, effort: 1 } },
    { t: "I stopped opening Slack in 2023.",                   s: { cope: 3 } } ] },
  { id: 'excuse', q: "Finish the sentence: “I'd love to, but…”", a: [
    { t: "“…I've got a thing.” (There is no thing.)",          s: { cope: 3 } },
    { t: "“…that's a weeknight.”",                             s: { decay: 3 } },
    { t: "“…parking down there is insane now.”",               s: { cringe: 3 } },
    { t: "“…I'm saving.” (For what? Unclear.)",                s: { broke: 3 } } ] },
  { id: 'owns', q: "Which of these is in your home right now, unironically?", a: [
    { t: "A record player with four hours on it",              s: { nostalgia: 3 } },
    { t: "A water bottle the size of a fire extinguisher",     s: { effort: 3 } },
    { t: "Something in a font that says “But First, Coffee”",  s: { cringe: 3 } },
    { t: "Four subscriptions I have forgotten about",          s: { broke: 3 } } ] },
  { id: 'pain', q: "What hurts?", a: [
    { t: "Lower back. Ongoing. We're managing it.",            s: { decay: 3 } },
    { t: "My knee. From nothing. From literally nothing.",     s: { decay: 3 } },
    { t: "Nothing! I feel great!",                              s: { effort: 3 } },
    { t: "My bank account, mostly.",                            s: { broke: 3 } } ] },
  { id: 'song', q: "Someone puts on a song from 2006. You:", a: [
    { t: "Know every word. Including the ad-libs.",            s: { nostalgia: 3 } },
    { t: "Grab the nearest arm and say “oh my GOD”",           s: { nostalgia: 3, cringe: 1 } },
    { t: "Mention that I saw them before they got big",        s: { cringe: 3 } },
    { t: "Don't recognise it. I only do podcasts now.",        s: { decay: 2, effort: 1 } } ] },
  { id: 'roll', q: "Your camera roll is, honestly:", a: [
    { t: "Screenshots. Thousands. Never opened again.",        s: { cope: 3 } },
    { t: "Memes I saved to send, and did not send.",           s: { cope: 2, cringe: 1 } },
    { t: "The dog. It's 900 photos of the dog.",               s: { cringe: 3 } },
    { t: "Progress pics in the same bathroom light",           s: { effort: 3 } } ] }
],

/* -------------------------------------------------- 2. PERFORMANCE REVIEW */
hr: [
  { id: 'strength', q: "In your own words, describe your greatest professional strength.", a: [
    { t: "I'm a people person who dreads every single meeting.",   s: { cope: 3 } },
    { t: "I answer emails at 11pm so I look committed.",           s: { effort: 3 } },
    { t: "I have done this exact job for nine years undetected.",  s: { broke: 3 } },
    { t: "I fixed the printer once and it became my personality.", s: { cringe: 3 } } ] },
  { id: 'balance', q: "How would you rate your current work-life balance?", a: [
    { t: "Excellent. I do nothing on either side.",                s: { cope: 3 } },
    { t: "The Sunday dread now starts Saturday at 4pm.",           s: { decay: 3 } },
    { t: "I read Slack in bed. That's balance. It's in bed.",      s: { cope: 2, cringe: 1 } },
    { t: "I built a spreadsheet to monitor it.",                   s: { effort: 3 } } ] },
  { id: 'exceeded', q: "Describe a recent occasion on which you exceeded expectations.", a: [
    { t: "I set them extremely low in advance.",                   s: { cope: 3 } },
    { t: "2014. The answer is 2014.",                              s: { nostalgia: 3 } },
    { t: "I stayed somewhere I hated for two extra years.",        s: { broke: 3 } },
    { t: "I ran a race and told absolutely everyone.",             s: { effort: 3 } } ] },
  { id: 'tech', q: "Rate your comfort adopting new tools and technology.", a: [
    { t: "I'm good with tech. I was born in 1988.",                s: { cringe: 3 } },
    { t: "A 24-year-old helped me and I laughed far too loudly.",  s: { cringe: 3 } },
    { t: "I still print things. On paper. To bring to a meeting.", s: { decay: 3 } },
    { t: "I run four productivity apps and produce nothing.",      s: { effort: 3 } } ] },
  { id: 'raise', q: "Is there anything you would like to raise with People Operations?", a: [
    { t: "My back. Is that you? Is that a People thing?",          s: { decay: 3 } },
    { t: "Why is everybody in this building twenty-six now.",      s: { cringe: 3 } },
    { t: "I would like to know what happened to the good chairs.", s: { nostalgia: 3 } },
    { t: "Compensation. Only compensation. Always compensation.",  s: { broke: 3 } } ] },
  { id: 'growth', q: "Identify one area for personal development this cycle.", a: [
    { t: "Sleeping through a single unbroken night.",              s: { decay: 3 } },
    { t: "Learning to say no. I will not learn this.",             s: { cope: 3 } },
    { t: "Returning to the shape I was in at university.",         s: { nostalgia: 3 } },
    { t: "Nothing — I'm tracking well against my own plan.",       s: { effort: 3 } } ] },
  { id: 'fiveyear', q: "Finally: where do you see yourself in five years?", a: [
    { t: "Here. Tired. Marginally worse.",                         s: { cope: 3 } },
    { t: "Doing this from a house I own. (I will not own it.)",    s: { broke: 3 } },
    { t: "Honestly? I'd settle for not being tired.",              s: { decay: 3 } },
    { t: "I have a five-year plan and I am on track.",             s: { effort: 3 } } ] }
],

/* ---------------------------------------------------- 3. SYMPTOM CHECKER */
webmd: [
  { id: 'located', q: "Where would you say the discomfort is located?", a: [
    { t: "Lower back. It is the lower back. It's always that.",   s: { decay: 3 } },
    { t: "Everywhere, vaguely, mostly after 9pm.",                s: { cope: 3 } },
    { t: "My knee. I did nothing. I want that on the record.",    s: { decay: 3 } },
    { t: "It presents as financial.",                             s: { broke: 3 } } ] },
  { id: 'onset', q: "When did you first notice these symptoms?", a: [
    { t: "Thirty. It was thirty.",                                s: { decay: 3 } },
    { t: "2016, and they never fully resolved.",                  s: { nostalgia: 3 } },
    { t: "When everyone at work started being younger than me.",  s: { cringe: 3 } },
    { t: "March. I've been logging it in an app since.",          s: { effort: 3 } } ] },
  { id: 'sleep', q: "Please describe your sleep.", a: [
    { t: "I sleep. I don't rest. Those are different.",           s: { cope: 3 } },
    { t: "Eight hours, tracked, scored, and still somehow bad.",  s: { effort: 3 } },
    { t: "I wake at 3am about a conversation from 2009.",         s: { nostalgia: 3 } },
    { t: "I pass out on the couch and relocate at 1am.",          s: { cope: 2, decay: 1 } } ] },
  { id: 'diet', q: "Have you noticed any changes in appetite or diet?", a: [
    { t: "I care about protein now. It happened overnight.",      s: { effort: 3 } },
    { t: "I can't eat late any more. That chapter is closed.",    s: { decay: 3 } },
    { t: "I eat standing over the sink and call it dinner.",      s: { cope: 3 } },
    { t: "Groceries now cost what a car payment used to.",        s: { broke: 3 } } ] },
  { id: 'alcohol', q: "Do you consume alcohol? If so, how would you describe it?", a: [
    { t: "Two drinks costs me two days now.",                     s: { decay: 3 } },
    { t: "I own nice bottles I am 'saving' for nothing.",         s: { broke: 3 } },
    { t: "I switched to seltzer and I mention it constantly.",    s: { cringe: 3 } },
    { t: "Only at weddings — which is most of my income.",        s: { broke: 2, cringe: 1 } } ] },
  { id: 'stress', q: "On a scale you may define yourself, rate your stress.", a: [
    { t: "I'm fine. I'm fine. I'm fine.",                         s: { cope: 3 } },
    { t: "I have a meditation app I use to feel guilty.",         s: { effort: 3 } },
    { t: "Most of it is a group chat I muted and still read.",    s: { cringe: 3 } },
    { t: "I miss when my largest problem was a ringtone.",        s: { nostalgia: 3 } } ] },
  { id: 'else', q: "Is there anything else your provider should know?", a: [
    { t: "I searched this already and it said something fatal.",  s: { cringe: 3 } },
    { t: "No physical since I was on my parents' insurance.",     s: { broke: 3 } },
    { t: "I'm not going to act on any of this.",                  s: { cope: 3 } },
    { t: "I know what you'll say. I've already bought the powder.", s: { effort: 3 } } ] }
],

/* -------------------------------------------------------- 4. WINDOWS 98 */
y2k: [
  { id: 'screenname', q: "STEP 1: Please choose a screen name.", a: [
    { t: "The one I used in 2001. I still use it. Everywhere.",   s: { nostalgia: 3 } },
    { t: "Something with an x on each side of it",                s: { nostalgia: 2, cringe: 1 } },
    { t: "firstname.lastname — I'm a professional now",           s: { effort: 3 } },
    { t: "I've paid for the same domain since 2009. It's blank.", s: { broke: 3 } } ] },
  { id: 'connection', q: "STEP 2: Select your connection speed.", a: [
    { t: "Fast enough. I have not restarted this router in a year.", s: { cope: 3 } },
    { t: "I pay for the top tier and use it to watch one show.",  s: { broke: 3 } },
    { t: "I miss the sound. I genuinely miss the sound.",         s: { nostalgia: 3 } },
    { t: "I ran a speed test this morning for no reason.",        s: { effort: 3 } } ] },
  { id: 'away', q: "STEP 3: Set your away message.", a: [
    { t: "Song lyrics. Ambiguous ones. Aimed at one person.",     s: { nostalgia: 3 } },
    { t: "“brb”. I was not brb. I was gone for six hours.",       s: { cope: 3 } },
    { t: "“Out of office” — I still check it. Constantly.",       s: { effort: 3 } },
    { t: "I don't do that any more. I just don't reply.",         s: { cope: 2, cringe: 1 } } ] },
  { id: 'error', q: "An error has occurred. What do you do?", a: [
    { t: "Restart it. That's my whole skillset.",                 s: { cringe: 3 } },
    { t: "Pay somebody. I pay somebody to fix things now.",        s: { broke: 3 } },
    { t: "Panic quietly and tell nobody.",                        s: { decay: 3 } },
    { t: "I'm good with computers, actually.",                    s: { cringe: 3 } } ] },
  { id: 'burn', q: "You are burning a CD. Who is it for?", a: [
    { t: "Someone who never mentioned it again.",                 s: { nostalgia: 3 } },
    { t: "Me. Track order took four hours.",                      s: { nostalgia: 2, effort: 1 } },
    { t: "I don't remember. That's the sad part.",                s: { decay: 3 } },
    { t: "I own this album on CD, vinyl, AND a subscription.",     s: { broke: 3 } } ] },
  { id: 'diskspace', q: "SYSTEM: You are low on disk space. What is taking up room?", a: [
    { t: "14,000 screenshots I will never open.",                 s: { cope: 3 } },
    { t: "Photos of a dog. Just the one dog.",                    s: { cringe: 3 } },
    { t: "Things I downloaded in 2009 and cannot delete.",        s: { nostalgia: 3 } },
    { t: "Nothing — I archive quarterly.",                        s: { effort: 3 } } ] },
  { id: 'shutdown', q: "FINAL STEP: It is safe to turn off your computer. Will you?", a: [
    { t: "No. I'll hold it above my face until it drops.",        s: { cope: 3 } },
    { t: "Yes. It's 9:40. I've had a big day.",                   s: { decay: 3 } },
    { t: "I have 60 tabs open and I need all of them.",           s: { effort: 2, cope: 1 } },
    { t: "I'll say I am and then I won't.",                       s: { cope: 2, cringe: 1 } } ] }
]
,

/* ------------------------------------------------------------ 5. TOP 8 */
myspace: [
  { id: 'listening', q: "currently listening to??", a: [
    { t: "something that ruined me in 2005 and still works",     s: { nostalgia: 3 } },
    { t: "whatever's free now. i cancelled the good one.",       s: { broke: 3 } },
    { t: "a podcast about how to be slightly better",            s: { effort: 3 } },
    { t: "nothing. silence. i'm so tired.",                      s: { decay: 3 } } ] },
  { id: 'top8', q: "who's in ur top 8 rn? be honest", a: [
    { t: "the same people. i just never see them.",              s: { cope: 3 } },
    { t: "my dog. multiple slots. it's the dog.",                s: { cringe: 3 } },
    { t: "people i'd have to text first and i won't",            s: { cope: 3 } },
    { t: "i have a group chat that's been quiet since march",    s: { decay: 2, cope: 1 } } ] },
  { id: 'regret', q: "biggest regret?? no wrong answers", a: [
    { t: "the hair. we all know it's the hair.",                 s: { cringe: 3 } },
    { t: "not buying when i could have. everyone says this.",    s: { broke: 3 } },
    { t: "leaving that city. i think about it weekly.",          s: { nostalgia: 3 } },
    { t: "nothing! everything happens for a reason!!",           s: { effort: 3 } } ] },
  { id: 'tenyears', q: "where do u see urself in 10 years", a: [
    { t: "i answered this in 2006 and i was so wrong",           s: { nostalgia: 3 } },
    { t: "same but with a worse back",                           s: { decay: 3 } },
    { t: "owning something. anything. a door.",                  s: { broke: 3 } },
    { t: "i have a vision board actually",                       s: { effort: 3 } } ] },
  { id: 'lastnight', q: "what did u do last night? spill", a: [
    { t: "cancelled and felt AMAZING about it",                  s: { cope: 3 } },
    { t: "in bed at 9:45 like a victorian child",                s: { decay: 3 } },
    { t: "meal prepped and posted about it",                     s: { effort: 3 } },
    { t: "scrolled people i knew in high school",                s: { nostalgia: 2, cringe: 1 } } ] },
  { id: 'pic', q: "post a pic of u from right now. no filter", a: [
    { t: "absolutely not. i take 40 and delete all of them.",    s: { cringe: 3 } },
    { t: "i can't afford to be anywhere photogenic rn",          s: { broke: 3 } },
    { t: "same bathroom. same light. progress pic. sorry.",      s: { effort: 3 } },
    { t: "i'm horizontal. i've been horizontal since 6.",        s: { cope: 3 } } ] },
  { id: 'repost', q: "will u repost this?", a: [
    { t: "no1 ever does. i still make them. every time.",        s: { cringe: 3 } },
    { t: "i'll screenshot it and send it to one person",         s: { cope: 3 } },
    { t: "yes and i'll tag people who'll resent it",             s: { cringe: 3 } },
    { t: "i miss when this was the whole internet",              s: { nostalgia: 3 } } ] }
],

/* ---------------------------------------------------- 6. WELLNESS BRAND */
wellness: [
  { id: 'howareyou', q: "how are you? and then: how are you actually?", a: [
    { t: "“good! busy!” — that's the whole script, every time",  s: { cringe: 3 } },
    { t: "tired in a way sleep has stopped fixing",              s: { decay: 3 } },
    { t: "fine. genuinely. i've done the work.",                 s: { effort: 3 } },
    { t: "i'd be better in a different year",                    s: { nostalgia: 3 } } ] },
  { id: 'lastdid', q: "when did you last do something purely for you?", a: [
    { t: "i bought a candle and felt it was too much",           s: { broke: 3 } },
    { t: "i lay on the floor for a while. that counts.",         s: { cope: 3 } },
    { t: "this morning. 5:40. i've optimised it.",               s: { effort: 3 } },
    { t: "a trip in 2019 i still describe to people",            s: { nostalgia: 3 } } ] },
  { id: 'rest', q: "what does rest look like for you?", a: [
    { t: "i call it protecting my peace. i'm avoiding people.",  s: { cringe: 3 } },
    { t: "lying down while the phone sits on my face",           s: { cope: 2, decay: 1 } },
    { t: "a walk i log, in a ring i close",                      s: { effort: 3 } },
    { t: "i genuinely don't know how to do it",                  s: { decay: 3 } } ] },
  { id: 'carrying', q: "what are you carrying that isn't yours?", a: [
    { t: "a thing someone said to me in 2011",                   s: { nostalgia: 3 } },
    { t: "a group chat i muted and still read hourly",           s: { cringe: 3 } },
    { t: "the number my rent goes up by",                        s: { broke: 3 } },
    { t: "nothing. i've released it. (i have not.)",             s: { effort: 3 } } ] },
  { id: 'morning', q: "describe your morning, gently.", a: [
    { t: "phone. immediately. before my eyes fully open.",       s: { cope: 3 } },
    { t: "supplements in a specific order. it's a lot.",         s: { effort: 3 } },
    { t: "i make a noise when i stand. it's new.",               s: { decay: 3 } },
    { t: "i tell busier people how busy i am. out loud.",        s: { cringe: 3 } } ] },
  { id: 'younger', q: "what would you tell yourself at twenty-two?", a: [
    { t: "buy it. whatever it was. just buy it.",                s: { broke: 3 } },
    { t: "stretch. i am not joking. stretch.",                   s: { decay: 3 } },
    { t: "those are the friends. that's it. that was them.",     s: { nostalgia: 3 } },
    { t: "nothing — i'd only ignore me again",                   s: { cope: 3 } } ] },
  { id: 'need', q: "last one. what do you need right now?", a: [
    { t: "for nobody to require anything of me until tuesday",   s: { cope: 3 } },
    { t: "a spine that works and a landlord who doesn't",        s: { decay: 2, broke: 1 } },
    { t: "to be 26 again for about a week",                      s: { nostalgia: 3 } },
    { t: "nothing! i'm doing the work and it's working!",        s: { effort: 3 } } ] }
],

/* -------------------------------------------------------- 7. TERMINAL */
terminal: [
  { id: 'uptime', q: "$ uptime --since-last-real-rest", a: [
    { t: "up 6 years, 0 restarts, load average: high",           s: { decay: 3 } },
    { t: "suspended nightly, never actually powered down",       s: { cope: 3 } },
    { t: "monitored continuously via three wearables",           s: { effort: 3 } },
    { t: "last known good state: 2016",                          s: { nostalgia: 3 } } ] },
  { id: 'top', q: "$ top — which process is consuming everything?", a: [
    { t: "one conversation from nine years ago, still resident", s: { nostalgia: 3 } },
    { t: "rent. rent is using 94% of available memory.",         s: { broke: 3 } },
    { t: "a habit tracker that has never once helped",           s: { effort: 3 } },
    { t: "nothing is running. that IS the problem.",             s: { cope: 3 } } ] },
  { id: 'deps', q: "$ check-dependencies", a: [
    { t: "caffeine (required), magnesium (unverified)",          s: { effort: 3 } },
    { t: "one streaming service, four unused, all billing",      s: { broke: 3 } },
    { t: "a heat pad. i own a heat pad now.",                    s: { decay: 3 } },
    { t: "a group chat that has not resolved since march",       s: { cope: 3 } } ] },
  { id: 'log', q: "$ git log --author=you --since=1.year", a: [
    { t: "1 commit: “misc changes”. no description.",            s: { cope: 3 } },
    { t: "400 commits, all to the same personal-improvement repo", s: { effort: 3 } },
    { t: "hundreds of branches, none merged, none deleted",      s: { cringe: 3 } },
    { t: "the good commits are all from a repo i left",          s: { nostalgia: 3 } } ] },
  { id: 'stack', q: "A junior asks what stack you use. You:", a: [
    { t: "name something that was current when I learned it",    s: { nostalgia: 3 } },
    { t: "say “it depends” and then talk for nine minutes",      s: { cringe: 3 } },
    { t: "admit I mostly restart things until they work",        s: { cringe: 3 } },
    { t: "have strong opinions I refresh quarterly",             s: { effort: 3 } } ] },
  { id: 'errors', q: "$ tail -f warnings.log", a: [
    { t: "[WARN] knee. no stack trace. no cause. just knee.",    s: { decay: 3 } },
    { t: "[WARN] 400 items saved to send. 6 sent.",              s: { cope: 3 } },
    { t: "[WARN] subscription renewed. subscription renewed.",   s: { broke: 3 } },
    { t: "log is empty. i suppress warnings.",                   s: { cope: 2, cringe: 1 } } ] },
  { id: 'exit', q: "$ exit — describe your shutdown procedure.", a: [
    { t: "kill -9. face-first. mid-episode.",                    s: { cope: 3 } },
    { t: "graceful shutdown initiated at 21:40",                 s: { decay: 3 } },
    { t: "wind-down routine, blue-light filter, tracked",        s: { effort: 3 } },
    { t: "process hangs. does not respond. still open.",         s: { cope: 3 } } ] }
],

/* --------------------------------------------------- 8. PRODUCT LAUNCH */
keynote: [
  { id: 'config', q: "First, choose your configuration.", a: [
    { t: "Base model. Nothing upgraded since 2019.",             s: { nostalgia: 3 } },
    { t: "Fully specced. Every accessory. Still slow.",          s: { effort: 3 } },
    { t: "Refurbished. Some scratches. Runs warm.",              s: { decay: 3 } },
    { t: "Whatever was on sale, honestly.",                      s: { broke: 3 } } ] },
  { id: 'battery', q: "Let's talk about battery life.", a: [
    { t: "All-day battery. The day now ends at 8:45pm.",         s: { decay: 3 } },
    { t: "Depletes on contact with other people.",               s: { cope: 3 } },
    { t: "Excellent — I charge it in a very specific routine.",  s: { effort: 3 } },
    { t: "It was incredible in 2011. Truly incredible.",         s: { nostalgia: 3 } } ] },
  { id: 'storage', q: "Storage. What are you actually keeping?", a: [
    { t: "14,000 screenshots. Zero retrieved.",                  s: { cope: 3 } },
    { t: "One dog, photographed exhaustively.",                  s: { cringe: 3 } },
    { t: "Everything from one specific year.",                   s: { nostalgia: 3 } },
    { t: "Nothing. I archive on a schedule.",                    s: { effort: 3 } } ] },
  { id: 'new', q: "So — what's new this year?", a: [
    { t: "A noise I make when I stand. It's standard now.",      s: { decay: 3 } },
    { t: "Nothing. Same as last year. Same as next.",            s: { cope: 3 } },
    { t: "A supplement regimen with a schedule.",                s: { effort: 3 } },
    { t: "Rent. Rent is what's new.",                            s: { broke: 3 } } ] },
  { id: 'compat', q: "A word on compatibility with newer devices.", a: [
    { t: "They use symbols I have to look up.",                  s: { cringe: 3 } },
    { t: "Supported, but with visible lag.",                     s: { cringe: 3 } },
    { t: "I've studied their formats deliberately.",             s: { effort: 3 } },
    { t: "Unsupported. I've stopped attempting it.",             s: { cope: 3 } } ] },
  { id: 'finish', q: "Available finishes.", a: [
    { t: "Matte. Tired. Non-reflective.",                        s: { decay: 3 } },
    { t: "Same haircut since 2009, in three colours.",           s: { nostalgia: 3 } },
    { t: "Athleisure. Exclusively. In public.",                  s: { cringe: 3 } },
    { t: "Optimised — skincare, in order, nightly.",             s: { effort: 3 } } ] },
  { id: 'pricing', q: "And now, pricing.", a: [
    { t: "More than last year for demonstrably less.",           s: { broke: 3 } },
    { t: "Available on a payment plan I'll never finish.",       s: { broke: 3 } },
    { t: "I'd pay anything to be 26 for one week.",              s: { nostalgia: 3 } },
    { t: "I've budgeted for this. There's a spreadsheet.",       s: { effort: 3 } } ] }
],

/* -------------------------------------------------- 9. GOVERNMENT FORM */
dmv: [
  { id: 'residence', q: "SECTION 1 — DECLARE YOUR CURRENT HOUSING STATUS.", a: [
    { t: "RENTING. INDEFINITELY. IT'S SMARTER. (IT IS NOT.)",    s: { broke: 3 } },
    { t: "OWNED. I NOW DISCUSS THE ROOF AT PARTIES.",            s: { decay: 2, broke: 1 } },
    { t: "I KNOW THE PRICE OF ONE I WILL NEVER BUY.",            s: { broke: 3 } },
    { t: "I WOULD RETURN TO MY COLLEGE TOWN TOMORROW.",          s: { nostalgia: 3 } } ] },
  { id: 'dependents', q: "SECTION 2 — LIST ALL DEPENDENTS.", a: [
    { t: "ONE DOG. TREATED AS A PERSON. LEGALLY UNCLEAR.",       s: { cringe: 3 } },
    { t: "FOUR SUBSCRIPTIONS I NO LONGER USE.",                  s: { broke: 3 } },
    { t: "A CHILD. THERE IS NO CLOCK ANY MORE.",                 s: { decay: 3 } },
    { t: "NONE. I AM THE DEPENDENT.",                            s: { cope: 3 } } ] },
  { id: 'reason', q: "SECTION 3 — STATE YOUR REASON FOR APPLYING.", a: [
    { t: "I WAS SENT THIS LINK AND I HAVE NO PLANS.",            s: { cope: 3 } },
    { t: "SOMEONE YOUNGER LOOKED AT ME STRANGELY.",              s: { cringe: 3 } },
    { t: "I WOULD LIKE A DIAGNOSIS. ANY DIAGNOSIS.",             s: { decay: 3 } },
    { t: "I ENJOY COMPLETING FORMS CORRECTLY.",                  s: { effort: 3 } } ] },
  { id: 'conditions', q: "SECTION 4 — DISCLOSE ALL PRE-EXISTING CONDITIONS.", a: [
    { t: "LOWER BACK. ONGOING. NO INCIDENT REPORT EXISTS.",      s: { decay: 3 } },
    { t: "KNEE. CAUSE UNKNOWN. INVESTIGATION CLOSED.",           s: { decay: 3 } },
    { t: "I AM FINE. I AM COMPLETELY FINE.",                     s: { effort: 3 } },
    { t: "EMOTIONAL. ONGOING SINCE APPROXIMATELY 2020.",         s: { cope: 3 } } ] },
  { id: 'assets', q: "SECTION 5 — DECLARE ALL ASSETS.", a: [
    { t: "POKÉMON CARDS. LOCATION: MOTHER'S ATTIC.",             s: { nostalgia: 3 } },
    { t: "A RECORD PLAYER. FOUR HOURS OF USE.",                  s: { nostalgia: 3 } },
    { t: "A 401(K) I OPEN ONLY WHEN EMOTIONALLY PREPARED.",      s: { broke: 3 } },
    { t: "A SPREADSHEET. I AM GENUINELY FINE.",                  s: { effort: 3 } } ] },
  { id: 'prior', q: "SECTION 6 — HAVE YOU BEEN THIS TIRED BEFORE? IF YES, WHEN?", a: [
    { t: "NO. THIS IS A NEW AND ESCALATING TIREDNESS.",          s: { decay: 3 } },
    { t: "YES. CONTINUOUSLY. SINCE ROUGHLY 2015.",               s: { cope: 3 } },
    { t: "I WAS NOT TIRED IN 2007. I REMEMBER IT CLEARLY.",      s: { nostalgia: 3 } },
    { t: "I AM NOT TIRED. I AM UP AT 5:40 DAILY.",               s: { effort: 3 } } ] },
  { id: 'signature', q: "SECTION 7 — BY SIGNING, YOU CERTIFY THE ABOVE IS TRUE.", a: [
    { t: "SIGNED. RELUCTANTLY. IN A CHAIR THAT HURTS.",          s: { decay: 3 } },
    { t: "SIGNED. I WOULD LIKE TO AMEND EVERYTHING.",            s: { cringe: 3 } },
    { t: "SIGNED. I WILL NOT ACT ON ANY OF IT.",                 s: { cope: 3 } },
    { t: "SIGNED, DATED, AND FILED IN A LABELLED FOLDER.",       s: { effort: 3 } } ] }
]
,

/* ------------------------------------------------------- 10. HOROSCOPE */
astro: [
  { id: 'moon', q: "The moon is currently transiting your house of rest. How is that going?", a: [
    { t: "I sleep eight hours and wake up owing someone money",   s: { decay: 3 } },
    { t: "I lie down at nine and hold a glowing rectangle",       s: { cope: 3 } },
    { t: "I've optimised it. Magnesium. Dark room. Still bad.",   s: { effort: 3 } },
    { t: "I slept perfectly until roughly 2015",                  s: { nostalgia: 3 } } ] },
  { id: 'retrograde', q: "Mercury is not retrograde. What have you been blaming on it?", a: [
    { t: "Not replying to anyone for eleven days",                s: { cope: 3 } },
    { t: "A text I sent that I still think about nightly",        s: { cringe: 3 } },
    { t: "My finances. It's structural, not planetary.",          s: { broke: 3 } },
    { t: "Nothing — I take full accountability, loudly",          s: { effort: 3 } } ] },
  { id: 'rising', q: "Your rising sign governs first impressions. What is yours doing?", a: [
    { t: "Pausing before I speak on camera. Every time.",         s: { cringe: 3 } },
    { t: "Telling a 24-year-old I'm 'basically the same age'",    s: { cringe: 3 } },
    { t: "Radiating a fatigue people can see from outside",       s: { decay: 3 } },
    { t: "Nothing — I don't leave the house",                     s: { cope: 3 } } ] },
  { id: 'saturn', q: "Saturn returns around thirty. What did yours take from you?", a: [
    { t: "My knees. It came for the knees specifically.",         s: { decay: 3 } },
    { t: "The friends. It quietly took most of the friends.",     s: { nostalgia: 3 } },
    { t: "My down payment, via a series of small decisions",      s: { broke: 3 } },
    { t: "Nothing! I emerged stronger and I journal about it!",   s: { effort: 3 } } ] },
  { id: 'venus', q: "Venus is asking about your relationships. All of them.", a: [
    { t: "I love them and I will not initiate anything, ever",    s: { cope: 3 } },
    { t: "My deepest bond is with an animal that can't speak",    s: { cringe: 3 } },
    { t: "The strongest ones peaked at twenty-three",             s: { nostalgia: 3 } },
    { t: "Excellent. We have a shared calendar and check in.",    s: { effort: 3 } } ] },
  { id: 'toxic', q: "Name your toxic trait. Astrologically. Be specific.", a: [
    { t: "Cancelling and feeling euphoric about it",              s: { cope: 3 } },
    { t: "Saying 'we should catch up' with no intention",         s: { cringe: 3 } },
    { t: "'I'm saving' — a vibe I have mistaken for a number",    s: { broke: 3 } },
    { t: "Making my routine into a personality and defending it", s: { effort: 3 } } ] },
  { id: 'yearcard', q: "One card remains. It shows a single year. Which is it?", a: [
    { t: "2007",                                                  s: { nostalgia: 3 } },
    { t: "2014 — peak everything, and I knew it at the time",     s: { nostalgia: 2, cringe: 1 } },
    { t: "2019, for reasons the cards understand",                s: { nostalgia: 2, cope: 1 } },
    { t: "None. Forward. The cards are a scam anyway.",           s: { effort: 3 } } ] }
],

/* --------------------------------------------------- 11. BREAKING NEWS */
news: [
  { id: 'where', q: "Take us back. Where were you when you first noticed?", a: [
    { t: "Standing up from a chair. It made a sound.",            s: { decay: 3 } },
    { t: "In a meeting where I was, abruptly, the oldest",        s: { cringe: 3 } },
    { t: "At a rent renewal. The number had changed.",            s: { broke: 3 } },
    { t: "On a couch. Where I remain. Live, from the couch.",     s: { cope: 3 } } ] },
  { id: 'scene', q: "Describe the scene for our viewers.", a: [
    { t: "Dark. One lamp. A show I've already finished twice.",   s: { cope: 3 } },
    { t: "A kitchen counter covered in labelled supplements",     s: { effort: 3 } },
    { t: "Boxes I moved here in 2016 and never opened",           s: { nostalgia: 3 } },
    { t: "A heating pad. There is a heating pad involved.",       s: { decay: 3 } } ] },
  { id: 'weekend', q: "Officials want to know: what did you have planned this weekend?", a: [
    { t: "Something. I cancelled it. I felt incredible.",         s: { cope: 3 } },
    { t: "A wedding. Another one. In another state.",             s: { broke: 3 } },
    { t: "A race, and then discussing the race at length",        s: { effort: 3 } },
    { t: "Nothing after 8pm. That's a hard boundary now.",        s: { decay: 3 } } ] },
  { id: 'thing', q: "Sources say you told someone you 'have a thing'. Care to comment?", a: [
    { t: "There was no thing. There has never been a thing.",     s: { cope: 3 } },
    { t: "No comment, but I did type and delete four replies.",   s: { cringe: 3 } },
    { t: "It was a thing. It was a very small, expensive thing.", s: { broke: 3 } },
    { t: "It was a scheduled recovery block. It's in my calendar.", s: { effort: 3 } } ] },
  { id: 'spending', q: "We're now getting reports regarding your spending.", a: [
    { t: "Four subscriptions. All active. None watched.",         s: { broke: 3 } },
    { t: "I bought a record player and used it four times.",      s: { nostalgia: 3 } },
    { t: "Everything is for the dog. The dog is fine.",           s: { cringe: 3 } },
    { t: "I track every transaction and it changes nothing.",     s: { effort: 3 } } ] },
  { id: 'footage', q: "Our cameras caught you at a wedding. Would you like to explain?", a: [
    { t: "The 2006 song played. I grabbed a stranger's arm.",     s: { nostalgia: 3 } },
    { t: "I danced once and it cost me four days.",               s: { decay: 3 } },
    { t: "I left at 9:15 and told nobody I was leaving.",         s: { cope: 3 } },
    { t: "I told three people I 'saw them before they got big'",  s: { cringe: 3 } } ] },
  { id: 'statement', q: "Anything you'd like to say to the public before we go?", a: [
    { t: "My lower back is a developing situation.",              s: { decay: 3 } },
    { t: "I'd like everyone to stop being twenty-four.",          s: { cringe: 3 } },
    { t: "I'm going to go lie down now. Live. On camera.",        s: { cope: 3 } },
    { t: "I'm doing great, actually. Truly. Great.",              s: { effort: 3 } } ] }
],

/* ------------------------------------------------------ 12. DATING APP */
dating: [
  { id: 'pleasures', q: "My simple pleasures…", a: [
    { t: "Cancelling. The plan, then the feeling. Unmatched.",    s: { cope: 3 } },
    { t: "A 2006 song coming on somewhere public",                s: { nostalgia: 3 } },
    { t: "Closing all three rings before 6pm",                    s: { effort: 3 } },
    { t: "Sitting down. Genuinely. The act itself.",              s: { decay: 3 } } ] },
  { id: 'goal', q: "A life goal of mine…", a: [
    { t: "Own a door. Any door. Attached to anything.",           s: { broke: 3 } },
    { t: "Sleep through one complete night",                      s: { decay: 3 } },
    { t: "Be twenty-six again for approximately one week",        s: { nostalgia: 3 } },
    { t: "Hit every target on the board above my desk",           s: { effort: 3 } } ] },
  { id: 'truths', q: "Two truths and a lie. Go.", a: [
    { t: "I'm easygoing / I'm low maintenance / I'm asleep",      s: { cope: 3 } },
    { t: "I'm 34 / I'm fine / my knee is fine",                   s: { decay: 3 } },
    { t: "I have savings / I have a plan / I have a spreadsheet", s: { broke: 3 } },
    { t: "I'm chill / I'm over it / I don't check their profile", s: { cringe: 3 } } ] },
  { id: 'looking', q: "I'm looking for…", a: [
    { t: "Someone who also wants to leave at 9:15",               s: { decay: 3 } },
    { t: "Someone to not text back at the same speed as me",      s: { cope: 3 } },
    { t: "Someone who remembers what this all used to cost",      s: { nostalgia: 3 } },
    { t: "A gym partner. That's it. That's the whole thing.",     s: { effort: 3 } } ] },
  { id: 'winme', q: "The way to win me over is…", a: [
    { t: "Say you're also tired. Immediately. First message.",    s: { cope: 3 } },
    { t: "Reference something cancelled in 2011",                 s: { nostalgia: 3 } },
    { t: "Have a spare room and a reasonable mortgage",           s: { broke: 3 } },
    { t: "Ask about my routine and mean it",                      s: { effort: 3 } } ] },
  { id: 'fear', q: "My most irrational fear…", a: [
    { t: "Being filmed by someone born after 2001",               s: { cringe: 3 } },
    { t: "Sneezing wrong and losing six weeks",                   s: { decay: 3 } },
    { t: "Someone finding my 2009 posts",                         s: { nostalgia: 2, cringe: 1 } },
    { t: "Nothing. I've worked through all of it.",               s: { effort: 3 } } ] },
  { id: 'together', q: "Together, we could…", a: [
    { t: "Both cancel and never speak of it again",               s: { cope: 3 } },
    { t: "Split rent and still not afford anything",              s: { broke: 3 } },
    { t: "Complain about our backs in perfect harmony",           s: { decay: 3 } },
    { t: "Meal prep on Sundays. I've thought about this a lot.",  s: { effort: 3 } } ] }
],

/* --------------------------------------------------------- 13. RECEIPT */
receipt: [
  { id: 'item1', q: "SCAN ITEM 1 — WHAT DID YOU BUY THIS WEEK?", a: [
    { t: "MAGNESIUM ...... 24.99",                      s: { effort: 3 } },
    { t: "READING GLASSES  12.99",                     s: { decay: 3 } },
    { t: "DOG ITEM ....... 61.40",                     s: { cringe: 3 } },
    { t: "NOTHING, BEING GOOD 0.00",                     s: { broke: 3 } } ] },
  { id: 'loyalty', q: "DO YOU HAVE A LOYALTY NUMBER?", a: [
    { t: "IT'S MY OLD PHONE NUMBER. FROM MY HOME TOWN.",          s: { nostalgia: 3 } },
    { t: "YES, AND IT HAS SAVED ME $4 SINCE 2019",                s: { broke: 3 } },
    { t: "I HAVE ELEVEN CARDS AND USE NONE",                      s: { cope: 3 } },
    { t: "SCANNED. TRACKED. I HAVE THE APP.",                     s: { effort: 3 } } ] },
  { id: 'subs', q: "RECURRING CHARGES ON FILE — PLEASE REVIEW.", a: [
    { t: "FOUR ACTIVE. ZERO WATCHED. ALL RENEWING.",              s: { broke: 3 } },
    { t: "ONE GYM. LAST VISIT: FEBRUARY.",                        s: { decay: 3 } },
    { t: "A FITNESS APP THAT SCORES MY SLEEP",                    s: { effort: 3 } },
    { t: "SOMETHING FROM 2013 I CANNOT CANCEL",                   s: { nostalgia: 3 } } ] },
  { id: 'roundup', q: "WOULD YOU LIKE TO ROUND UP FOR CHARITY?", a: [
    { t: "YES, AND I'LL FEEL SUPERIOR FOR ELEVEN SECONDS",        s: { cringe: 3 } },
    { t: "NO. OUT LOUD. TO A MACHINE.",                           s: { broke: 3 } },
    { t: "I PANIC-PRESSED YES. I ALWAYS PANIC-PRESS YES.",        s: { cringe: 3 } },
    { t: "I HAVE A GIVING LINE IN MY BUDGET",                     s: { effort: 3 } } ] },
  { id: 'returns', q: "RETURN POLICY: 30 DAYS. IS THERE ANYTHING YOU'D RETURN?", a: [
    { t: "THE RECORD PLAYER. FOUR HOURS OF USE.",                 s: { nostalgia: 3 } },
    { t: "MY LOWER BACK. NO RECEIPT. NO INCIDENT.",               s: { decay: 3 } },
    { t: "A DECADE. ROUGHLY 2012 THROUGH 2022.",                  s: { cope: 3 } },
    { t: "NOTHING — I RESEARCH BEFORE PURCHASE",                  s: { effort: 3 } } ] },
  { id: 'visit', q: "HOW WOULD YOU RATE YOUR VISIT TODAY?", a: [
    { t: "I SAT IN THE CAR AFTERWARDS. JUST SAT THERE.",          s: { decay: 3 } },
    { t: "I SAW SOMEONE FROM SCHOOL AND HID IN AN AISLE",         s: { cringe: 3 } },
    { t: "EVERYTHING COSTS MORE AND I SAID SO ALOUD",             s: { broke: 3 } },
    { t: "IN AND OUT. LIST. ROUTE. NINE MINUTES.",                s: { effort: 3 } } ] },
  { id: 'payment', q: "SELECT PAYMENT METHOD.", a: [
    { t: "CREDIT. I'LL DEAL WITH IT LATER. I WON'T.",             s: { broke: 3 } },
    { t: "FOUR INSTALMENTS. FOR GROCERIES.",                      s: { broke: 3 } },
    { t: "TAP. LOOK AWAY. DO NOT READ THE TOTAL.",                s: { cope: 3 } },
    { t: "DEBIT, LOGGED, CATEGORISED THIS EVENING",               s: { effort: 3 } } ] }
],

/* -------------------------------------------- 14. PROFESSIONAL NETWORK */
linkedin: [
  { id: 'journey', q: "Let's start with your journey. Where did it really begin? 🧵", a: [
    { t: "A job I got by knowing someone. I say 'hustle'.",       s: { cringe: 3 } },
    { t: "An unpaid internship I still describe as formative",    s: { broke: 3 } },
    { t: "2014. Peak me. I've been coasting since.",              s: { nostalgia: 3 } },
    { t: "5:40am, every day, for eleven years. 💪",               s: { effort: 3 } } ] },
  { id: 'failure', q: "What's a lesson that failure taught you? Be vulnerable. 🙏", a: [
    { t: "Nothing. I repeat it annually. Reliably.",              s: { cope: 3 } },
    { t: "That I should have bought property in 2013",            s: { broke: 3 } },
    { t: "That my body keeps score and it is winning",            s: { decay: 3 } },
    { t: "I reframe every failure as data. 📊",                   s: { effort: 3 } } ] },
  { id: 'routine', q: "Walk us through your morning routine. Founders want to know.", a: [
    { t: "Phone. Horizontal. Forty minutes. Then panic.",         s: { cope: 3 } },
    { t: "Cold plunge, journal, supplements, in that order",      s: { effort: 3 } },
    { t: "I make a sound getting out of bed. That's step one.",   s: { decay: 3 } },
    { t: "I hit snooze until it becomes a financial decision",    s: { broke: 2, cope: 1 } } ] },
  { id: 'flex', q: "Humble brag time — what's your biggest professional flex? 😌", a: [
    { t: "Nobody has noticed what I do for nine years",           s: { cope: 3 } },
    { t: "I fixed a printer once. In 2019. I still mention it.",  s: { cringe: 3 } },
    { t: "I'm the oldest person on my team and I bring it up",    s: { cringe: 3 } },
    { t: "I have never missed a single deadline. Ever.",          s: { effort: 3 } } ] },
  { id: 'unplug', q: "How do you unplug? Boundaries are so important. ✨", a: [
    { t: "I don't. I read Slack in bed and call it balance.",     s: { cope: 3 } },
    { t: "I have a 'no meetings' block I fill with meetings",     s: { effort: 3 } },
    { t: "I'm asleep at 9:40. That's my boundary. Biology.",      s: { decay: 3 } },
    { t: "I rewatch a show from 2011 until I feel nothing",       s: { nostalgia: 3 } } ] },
  { id: 'mentor', q: "Shout out a mentor who shaped you. Tag them below! 👇", a: [
    { t: "Someone who left in 2016. We've never spoken since.",   s: { nostalgia: 3 } },
    { t: "A manager who taught me what not to be. Growth!",       s: { cringe: 3 } },
    { t: "Nobody. I'd have to reach out and I will not.",         s: { cope: 3 } },
    { t: "My 5am accountability group. Iron sharpens iron. 🔥",   s: { effort: 3 } } ] },
  { id: 'takeaway', q: "Drop your biggest takeaway below. What's the one lesson? 👇", a: [
    { t: "Everything costs more and I have less. That's it.",     s: { broke: 3 } },
    { t: "Stretch. I'm serious. That's the whole post.",          s: { decay: 3 } },
    { t: "Nobody is reading this. I post anyway. Weekly.",        s: { cringe: 3 } },
    { t: "Consistency compounds. Show up. Every day. 🚀",         s: { effort: 3 } } ] }
]
};
