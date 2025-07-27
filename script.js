let currentQuestionIndex = 0;
let questions = [];
let score = 0;

const categoryScreen = document.getElementById('category-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const scoreSpan = document.getElementById('score');
const quotePara = document.getElementById('quote');

const quotes = [
  "Keep trying, you're improving!",
  "Nice effort! You're getting there!",
  "Great work! You're a rising star!",
  "Excellent! You really know your stuff!",
  "Perfect! You're a Computer Champ! 🚀"
];

function startQuiz(difficulty) {
  categoryScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  quizScreen.innerHTML = "<p>Loading questions...</p>";

  let url = "https://opentdb.com/api.php?amount=10&category=18";
  if (difficulty !== 'random') url += `&difficulty=${difficulty}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      questions = data.results;
      currentQuestionIndex = 0;
      score = 0;
      showQuestion();
    });
}

function showQuestion() {
  const question = questions[currentQuestionIndex];
  const answers = [...question.incorrect_answers, question.correct_answer]
    .sort(() => Math.random() - 0.5);

  quizScreen.innerHTML = `
    <div class="question">
      <h3>Q${currentQuestionIndex + 1}: ${decodeHtml(question.question)}</h3>
      <div class="answers">
        ${answers.map(ans => `
          <button data-answer="${escapeQuotes(ans)}" onclick="selectAnswer(this, '${escapeQuotes(question.correct_answer)}')">
            ${decodeHtml(ans)}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}


function selectAnswer(button, correctAnswer) {
  const selected = button.getAttribute('data-answer');
  const isCorrect = selected === correctAnswer;

  if (isCorrect) {
    score++;
    button.style.backgroundColor = "green";
  } else {
    button.style.backgroundColor = "red";
  }

  // Disable all buttons after selection
  const allButtons = document.querySelectorAll('.answers button');
  allButtons.forEach(btn => btn.disabled = true);

  // Wait 800ms then go to next question
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 800);
}



function showResult() {
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  scoreSpan.textContent = score;

  let quoteIndex = Math.floor((score / 10) * quotes.length);
  if (quoteIndex >= quotes.length) quoteIndex = quotes.length - 1;
  quotePara.textContent = quotes[quoteIndex];
}

function retryQuiz() {
  resultScreen.classList.add('hidden');
  categoryScreen.classList.remove('hidden');
  quizScreen.innerHTML = '';
}

function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'");
}
