const questionCountSpan = document.querySelector(".quiz-app .count p span");
const bulletSpanContainer = document.querySelector(".bullet .spanContainer");
const quizAreaContainer = document.querySelector(".quiz-area");
const answersAreaContainer = document.querySelector(".answers-area");
const submitBtn = document.querySelector(".submit-btn");
const bulletContainer = document.querySelector(".bullet");
const resultContainer = document.querySelector(".result");
const countdownContainer = document.querySelector(".countdown");
const categoryContainer = document.querySelector(".category span");
let currentIndex = 0;
let rAnswer = 0;
let countDownInterval;
function getQuestions(category) {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (myRequest.readyState == 4 && myRequest.status == 200) {
            let questionsObject = JSON.parse(this.responseText);

            // Filter the questions based on the selected category
            let filteredQuestions = questionsObject.filter(
                (question) => question.category === category
            );

            // Shuffle the questions randomly
            filteredQuestions = shuffleArray(filteredQuestions);
            // Select the first 10 questions
            let selectedQuestions = filteredQuestions.slice(0, 10);
            let questionCount = selectedQuestions.length;
            console.log(selectedQuestions);
            createBullet(questionCount);
            addQuestionData(selectedQuestions[currentIndex], questionCount);
            countDown(5, questionCount);
            submitBtn.onclick = () => {
                let rightAnswer = selectedQuestions[currentIndex].rightAnswer;
                currentIndex++;
                checkAnswer(rightAnswer, questionCount);
                quizAreaContainer.innerHTML = "";
                answersAreaContainer.innerHTML = "";
                addQuestionData(selectedQuestions[currentIndex], questionCount);
                handleBullets();
                clearInterval(countDownInterval);
                countDown(5, questionCount);
                showResults(questionCount);
            };
        }
    };
    myRequest.open("GET", "Questions.json", true);
    myRequest.send();
}
// Get the category dropdown element
let categoryDropdown = document.getElementById("categoryDropdown");
// Add event listener to the category dropdown
categoryDropdown.addEventListener("change", function () {
    let selectedCategory = categoryDropdown.value;
    console.log(selectedCategory);
    getQuestions(selectedCategory);
    categoryContainer.textContent = selectedCategory;
    quizAreaContainer.innerHTML = "";
});

// Function to shuffle the questions array randomly
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function createBullet(num) {
    questionCountSpan.innerHTML = num;
    for (let i = 0; i < num; i++) {
        const bullet = document.createElement("span");
        bullet.classList.add(i === 0 && "active");
        bulletSpanContainer.appendChild(bullet);
    }
}
function addQuestionData(question, count) {
    if (currentIndex < count) {
        const questionTitle = document.createElement("h2");
        questionTitle.textContent = question.title;
        quizAreaContainer.appendChild(questionTitle);

        // Randomize the order of answers
        const answerIndexes = [1, 2, 3, 4];
        answerIndexes.sort(() => Math.random() - 0.5);

        for (let i = 0; i < 4; i++) {
            const answerDiv = document.createElement("div");
            answerDiv.className = "answer";
            const radioInput = document.createElement("input");
            radioInput.type = "radio";
            radioInput.name = "answer";
            radioInput.id = `answer_${i + 1}`;
            radioInput.dataset.answer = question[`answer_${answerIndexes[i]}`];
            radioInput.checked = i === 0;
            const label = document.createElement("label");
            label.htmlFor = `answer_${i + 1}`;
            label.textContent = question[`answer_${answerIndexes[i]}`];
            answerDiv.appendChild(radioInput);
            answerDiv.appendChild(label);
            answersAreaContainer.appendChild(answerDiv);
        }
    }
}

function checkAnswer(correctAns, count) {
    let answers = document.getElementsByName("answer");
    let chosenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            chosenAnswer = answers[i].dataset.answer;
        }
    }
    if (chosenAnswer === correctAns) {
        rAnswer++;
        console.log("Good Answer");
    }
}
function handleBullets() {
    let bullets = document.querySelectorAll(".bullet .spanContainer span ");
    let bulletsArray = Array.from(bullets);
    bulletsArray.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "active";
        }
    });
}
function showResults(count) {
    let results;
    if (currentIndex === count) {
        quizAreaContainer.remove();
        answersAreaContainer.remove();
        submitBtn.remove();
        bulletContainer.remove();
        if (rAnswer > count / 2 && rAnswer < count) {
            results = `<span class='good'>Good</span>,You Answered ${rAnswer} From ${count}`;
        } else if (rAnswer === count) {
            results = `<span class='perfect'>Perfect</span>,You Answered ${rAnswer} From ${count}`;
        } else {
            results = `<span class='bad'>Bad</span>,You Answered ${rAnswer} From ${count}`;
        }
        resultContainer.innerHTML = results;
        resultContainer.style.padding = "10px";
        resultContainer.style.marginTop = "10px";
    }
}
function countDown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownInterval = setInterval(function () {
            minutes = parseInt(duration / 60, 10);
            seconds = parseInt(duration % 60, 10);
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countdownContainer.innerHTML = `${minutes}:${seconds}`;
            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitBtn.click();
            }
        }, 1000);
    }
}
