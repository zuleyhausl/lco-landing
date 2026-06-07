// ===== LCO Landing — Quiz Logic =====

const QUESTIONS = [
  {
    text: "Your club just got promoted. What's your first move?",
    options: [
      { label: "Sign a star striker", type: "scout" },
      { label: "Redesign the tactical playbook", type: "tactician" },
      { label: "Expand the stadium", type: "builder" },
      { label: "Renegotiate the sponsorship deal", type: "closer" }
    ]
  },
  {
    text: "It's matchday. Your team is down 1-0 at halftime. What do you change?",
    options: [
      { label: "Switch formation from 4-3-3 to 4-2-3-1", type: "tactician" },
      { label: "Bring on your young academy gem", type: "scout" },
      { label: "Trust the system, no subs", type: "builder" },
      { label: "Push everyone forward, all-out attack", type: "closer" }
    ]
  },
  {
    text: "You've got £5M to spend. Where does it go?",
    options: [
      { label: "One world-class signing", type: "closer" },
      { label: "Three promising youngsters", type: "scout" },
      { label: "A new training facility", type: "builder" },
      { label: "Hire the best assistant coach in Europe", type: "tactician" }
    ]
  },
  {
    text: "End of season. Your club finishes 2nd. How do you feel?",
    options: [
      { label: "Proud — we built something real", type: "builder" },
      { label: "Frustrated — 2nd is the first loser", type: "closer" },
      { label: "Analyzing — what three tactical tweaks would've won it?", type: "tactician" },
      { label: "Already planning next season's transfer window", type: "scout" }
    ]
  },
  {
    text: "A rival club offers £15M for your star midfielder — 28, peak form, fan favorite. What do you do?",
    options: [
      { label: "Sell — reinvest in three players", type: "scout" },
      { label: "Sell — fund the new training complex", type: "builder" },
      { label: "Keep him — he's the heartbeat of the system", type: "tactician" },
      { label: "Keep him and use the leverage to win the league this year", type: "closer" }
    ]
  }
];

const RESULTS = {
  tactician: {
    title: "The Tactician",
    desc: "You see the pitch like a chessboard. Formations, pressing triggers, set-piece routines — you obsess over patterns most managers never notice. In LCO, you'll dominate by out-thinking opponents before kick-off.",
    stats: [
      { value: "94", label: "Tactical IQ" },
      { value: "82", label: "Patience" },
      { value: "78", label: "Adaptability" }
    ]
  },
  scout: {
    title: "The Scout",
    desc: "You don't buy stars — you make them. A 17-year-old in a third-tier league? You've already watched him three times. In LCO, your squad will be the youngest and hungriest on the leaderboard.",
    stats: [
      { value: "96", label: "Eye for Talent" },
      { value: "88", label: "Negotiation" },
      { value: "74", label: "Patience" }
    ]
  },
  builder: {
    title: "The Builder",
    desc: "Stadiums. Academies. Sponsorship empires. You're not here for a trophy — you're here for a dynasty. In LCO, you'll outlast every flash-in-the-pan manager and own the long game.",
    stats: [
      { value: "92", label: "Long-term Vision" },
      { value: "89", label: "Financial Sense" },
      { value: "80", label: "Discipline" }
    ]
  },
  closer: {
    title: "The Closer",
    desc: "Second place is the first loser. You make the bold call, push for the win, and don't sleep until the title is yours. In LCO, you'll be the manager every rival fears in the final stretch of the season.",
    stats: [
      { value: "97", label: "Killer Instinct" },
      { value: "91", label: "Pressure Handling" },
      { value: "72", label: "Restraint" }
    ]
  }
};

// State
let currentQuestion = 0;
const answers = []; // array of type strings, in order

// Elements
const cardEl = document.getElementById("quizCard");
const progressBarEl = document.getElementById("quizProgressBar");
const introStateEl = cardEl.querySelector('[data-state="intro"]');
const questionStateEl = cardEl.querySelector('[data-state="question"]');
const resultStateEl = cardEl.querySelector('[data-state="result"]');
const startBtn = document.getElementById("startQuizBtn");
const retakeBtn = document.getElementById("quizRetakeBtn");
const questionNumberEl = document.getElementById("quizQuestionNumber");
const questionTotalEl = document.getElementById("quizQuestionTotal");
const questionTextEl = document.getElementById("quizQuestionText");
const optionsListEl = document.getElementById("quizOptions");
const resultTitleEl = document.getElementById("quizResultTitle");
const resultDescEl = document.getElementById("quizResultDesc");
const resultStatsEl = document.getElementById("quizResultStats");

questionTotalEl.textContent = QUESTIONS.length;

// Helpers
function showState(name) {
  introStateEl.hidden = name !== "intro";
  questionStateEl.hidden = name !== "question";
  resultStateEl.hidden = name !== "result";
}

function updateProgress() {
  const pct = (currentQuestion / QUESTIONS.length) * 100;
  progressBarEl.style.width = pct + "%";
}

function renderQuestion() {
  const q = QUESTIONS[currentQuestion];
  questionNumberEl.textContent = currentQuestion + 1;
  questionTextEl.textContent = q.text;
  optionsListEl.innerHTML = "";
  q.options.forEach((opt) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz__option";
    btn.textContent = opt.label;
    btn.dataset.type = opt.type;
    btn.addEventListener("click", () => handleAnswer(opt.type));
    li.appendChild(btn);
    optionsListEl.appendChild(li);
  });
  updateProgress();
}

function handleAnswer(type) {
  answers.push(type);
  currentQuestion++;
  if (currentQuestion < QUESTIONS.length) {
    renderQuestion();
  } else {
    progressBarEl.style.width = "100%";
    setTimeout(showResult, 250); // small delay so progress bar fills before result
  }
}

function showResult() {
  // Tally
  const tally = { tactician: 0, scout: 0, builder: 0, closer: 0 };
  answers.forEach((t) => { tally[t]++; });
  // Find winner; tie-breaker = most recent answer of the tied types
  const max = Math.max(...Object.values(tally));
  const topTypes = Object.keys(tally).filter((t) => tally[t] === max);
  let winner;
  if (topTypes.length === 1) {
    winner = topTypes[0];
  } else {
    // Walk answers from the end; first one in topTypes wins
    for (let i = answers.length - 1; i >= 0; i--) {
      if (topTypes.includes(answers[i])) {
        winner = answers[i];
        break;
      }
    }
  }
  const result = RESULTS[winner];
  resultTitleEl.textContent = result.title;
  resultDescEl.textContent = result.desc;
  resultStatsEl.innerHTML = "";
  result.stats.forEach((stat) => {
    const wrap = document.createElement("div");
    wrap.className = "quiz__resultStat";
    wrap.innerHTML = '<span class="quiz__resultStatValue">' + stat.value + '</span><span class="quiz__resultStatLabel">' + stat.label + '</span>';
    resultStatsEl.appendChild(wrap);
  });
  showState("result");
}

function startQuiz() {
  currentQuestion = 0;
  answers.length = 0;
  renderQuestion();
  showState("question");
}

function resetQuiz() {
  currentQuestion = 0;
  answers.length = 0;
  progressBarEl.style.width = "0%";
  showState("intro");
}

// Wire up
startBtn.addEventListener("click", startQuiz);
retakeBtn.addEventListener("click", resetQuiz);

// ===== Email form handlers (hero + signup) =====
// Since this is a pre-launch landing page with no real backend,
// both forms just acknowledge the submission visually.

function handleSignupSubmit(form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    if (!input || !button) return;
    const originalText = button.textContent;
    button.textContent = "You're on the list ✓";
    button.disabled = true;
    button.style.background = "var(--accent-gold)";
    input.value = "";
    input.disabled = true;
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      button.style.background = "";
      input.disabled = false;
    }, 3500);
  });
}

const notifyForm = document.getElementById("notifyForm");
const signupForm = document.getElementById("signupForm");
if (notifyForm) handleSignupSubmit(notifyForm);
if (signupForm) handleSignupSubmit(signupForm);

// Also fix the quiz result CTA: scroll smoothly to the signup section instead of #top
const quizCtaBtn = document.getElementById("quizCtaBtn");
if (quizCtaBtn) {
  quizCtaBtn.setAttribute("href", "#signup");
  quizCtaBtn.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("signup")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
