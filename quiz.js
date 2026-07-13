const quizData = window.QUIZ_DATA || [];
const $ = (selector) => document.querySelector(selector);

const el = {
  section: $("[data-quiz-section]"),
  card: $("[data-quiz-card]"),
  category: $("[data-quiz-category]"),
  progressText: $("[data-progress-text]"),
  progressBar: $("[data-progress-bar]"),
  frontLabel: $("[data-front-label]"),
  question: $("[data-question]"),
  choices: $("[data-choice-list]"),
  submit: $("[data-submit-answer]"),
  answerTitle: $("[data-answer-title]"),
  answerDescription: $("[data-answer-description]"),
  photos: $("[data-photo-strip]"),
  back: $("[data-show-question]"),
  next: $("[data-next-question]"),
  dots: $("[data-pagination-dots]"),
  result: $("[data-result-panel]"),
  score: $("[data-result-score]")
};

let current = 0;
let selected = null;
let score = 0;
let scored = false;

function renderDots() {
  el.dots.innerHTML = quizData.map((_, i) => `<span class="${i === current ? "active" : ""}"></span>`).join("");
}

function renderQuestion() {
  const q = quizData[current];
  if (!q) return showResult();

  selected = null;
  scored = false;
  el.card.classList.remove("is-flipped");
  el.category.textContent = q.category;
  el.progressText.textContent = `${current + 1} / ${quizData.length}`;
  el.progressBar.style.width = `${((current + 1) / quizData.length) * 100}%`;
  el.frontLabel.textContent = `${q.category} · ${String(current + 1).padStart(3, "0")}`;
  el.question.textContent = `Q. ${q.question}`;
  el.submit.disabled = true;

  el.choices.innerHTML = q.choices.map((choice, i) => `
    <button type="button" class="choice-button" data-choice="${i}">
      <span class="choice-index">${i + 1}</span>
      <span>${choice}</span>
    </button>
  `).join("");

  el.choices.querySelectorAll("[data-choice]").forEach(button => {
    button.addEventListener("click", () => {
      selected = Number(button.dataset.choice);
      el.choices.querySelectorAll(".choice-button").forEach(item => {
        item.classList.toggle("is-selected", Number(item.dataset.choice) === selected);
      });
      el.submit.disabled = false;
    });
  });

  renderDots();
}

function showAnswer() {
  const q = quizData[current];
  if (!scored && selected === q.answerIndex) score += 1;
  scored = true;

  el.answerTitle.textContent = `A. ${q.answerTitle}`;
  el.answerDescription.textContent = q.description;
  el.photos.innerHTML = q.images.map(image => `
    <figure class="photo-card">
      <img src="${image.src}" alt="${image.alt}">
    </figure>
  `).join("");
  el.next.textContent = current === quizData.length - 1 ? "RESULT →" : "NEXT →";
  el.card.classList.add("is-flipped");
}

function showResult() {
  el.section.hidden = true;
  el.result.classList.add("is-visible");
  el.score.textContent = `${score} / ${quizData.length}`;
}

el.submit.addEventListener("click", showAnswer);
el.back.addEventListener("click", () => el.card.classList.remove("is-flipped"));
el.next.addEventListener("click", () => {
  current += 1;
  renderQuestion();
});

renderQuestion();
