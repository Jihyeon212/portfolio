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


/**
 * 사진 캐러셀 마우스 드래그 기능
 * - 모바일: 기본 touch scroll
 * - PC: mouse drag scroll
 */
function enableDragScroll() {
  const sliders = document.querySelectorAll(".photo-strip");

  sliders.forEach((slider) => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    slider.addEventListener("mousedown", (e) => {
      isDown = true;

      slider.style.cursor = "grabbing";

      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });


    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.style.cursor = "grab";
    });


    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.style.cursor = "grab";
    });


    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;

      e.preventDefault();

      const x = e.pageX - slider.offsetLeft;

      const distance = (x - startX) * 1.5;

      slider.scrollLeft = scrollLeft - distance;
    });


    // 이미지 드래그 방지
    slider.querySelectorAll("img").forEach((img) => {
      img.addEventListener("dragstart", (e) => {
        e.preventDefault();
      });
    });
  });
}


/**
 * 페이지 하단 진행 표시
 */
function renderDots() {
  el.dots.innerHTML = quizData
    .map(
      (_, index) =>
        `<span class="${index === current ? "active" : ""}"></span>`
    )
    .join("");
}


/**
 * 질문 카드 렌더링
 */
function renderQuestion() {

  const q = quizData[current];

  if (!q) {
    showResult();
    return;
  }


  selected = null;
  scored = false;


  el.card.classList.remove("is-flipped");


  el.category.textContent = q.category;

  el.progressText.textContent =
    `${current + 1} / ${quizData.length}`;


  el.progressBar.style.width =
    `${((current + 1) / quizData.length) * 100}%`;


  el.frontLabel.textContent =
    `${q.category} · ${String(current + 1).padStart(3, "0")}`;


  el.question.textContent =
    `Q. ${q.question}`;


  el.submit.disabled = true;



  el.choices.innerHTML =
    q.choices
      .map(
        (choice, index) =>
          `
          <button 
            type="button"
            class="choice-button"
            data-choice="${index}"
          >
            <span class="choice-index">
              ${index + 1}
            </span>

            <span>
              ${choice}
            </span>

          </button>
          `
      )
      .join("");



  el.choices
    .querySelectorAll("[data-choice]")
    .forEach((button) => {

      button.addEventListener("click", () => {

        selected =
          Number(button.dataset.choice);


        el.choices
          .querySelectorAll(".choice-button")
          .forEach((item) => {

            item.classList.toggle(
              "is-selected",
              Number(item.dataset.choice) === selected
            );

          });


        el.submit.disabled = false;

      });

    });



  renderDots();

}



/**
 * 정답 카드 표시
 */
function showAnswer() {

  const q = quizData[current];


  if (!scored && selected === q.answerIndex) {
    score += 1;
  }


  scored = true;


  el.answerTitle.textContent =
    `A. ${q.answerTitle}`;


  el.answerDescription.textContent =
    q.description;



  el.photos.innerHTML =
    q.images
      .map(
        (image) =>
          `
          <figure class="photo-card">

            <img 
              src="${image.src}"
              alt="${image.alt}"
            >

          </figure>
          `
      )
      .join("");



  el.next.textContent =
    current === quizData.length - 1
      ? "RESULT →"
      : "NEXT →";



  el.card.classList.add("is-flipped");


  // ⭐ 캐러셀 drag 활성화
  enableDragScroll();

}



/**
 * 결과 화면
 */
function showResult() {

  el.section.hidden = true;

  el.result.classList.add(
    "is-visible"
  );


  el.score.textContent =
    `${score} / ${quizData.length}`;

}



/**
 * 이벤트
 */
el.submit.addEventListener(
  "click",
  showAnswer
);


el.back.addEventListener(
  "click",
  () => {
    el.card.classList.remove(
      "is-flipped"
    );
  }
);



el.next.addEventListener(
  "click",
  () => {

    current += 1;

    renderQuestion();

  }
);



renderQuestion();