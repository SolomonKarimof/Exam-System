// DOM elements
const loginForm = document.getElementById('login-form');
const dashboard = document.getElementById('dashboard');
const examInterface = document.getElementById('exam-interface');
const result = document.getElementById('result');
const review = document.getElementById('review');

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const userNameSpan = document.getElementById('user-name');
const examSelect = document.getElementById('exam-select');
const startExamButton = document.getElementById('start-exam');
const examTitle = document.getElementById('exam-title');
const timer = document.getElementById('timer');
const questionsDiv = document.getElementById('questions');
const submitExamButton = document.getElementById('submit-exam');
const resultQuestionsDiv = document.getElementById('result-questions');
const reviewQuestionsButton = document.getElementById('review-questions');
const showAnswersButton = document.getElementById('show-answers');
const takeAnotherExamButton = document.getElementById('take-another-exam');
const reviewQuestionsDiv = document.getElementById('review-questions-div');
const backToResultButton = document.getElementById('back-to-result');

// Sample questions (you'd typically fetch these from a server)
const exams = {
    math: [
        { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correctAnswer: 1 },
        { question: "What is 5 * 3?", options: ["10", "15", "20", "25"], correctAnswer: 1 }
    ],
    science: [
        { question: "What is the chemical symbol for water?", options: ["H2O", "CO2", "NaCl", "O2"], correctAnswer: 0 },
        { question: "What planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correctAnswer: 1 }
    ],
    english: [
        { question: "Which of these is a noun?", options: ["Run", "Happy", "Cat", "Quickly"], correctAnswer: 2 },
        { question: "What is the past tense of 'go'?", options: ["Goed", "Went", "Gone", "Going"], correctAnswer: 1 }
    ]
};

let currentExam;
let userAnswers;
let timeLeft;
let timerInterval;

// Event listeners
document.getElementById('login').addEventListener('submit', handleLogin);
startExamButton.addEventListener('click', startExam);
submitExamButton.addEventListener('click', submitExam);
reviewQuestionsButton.addEventListener('click', showReview);
showAnswersButton.addEventListener('click', showAnswers);
takeAnotherExamButton.addEventListener('click', goToDashboard);
backToResultButton.addEventListener('click', () => {
    review.style.display = 'none';
    result.style.display = 'block';
});

function handleLogin(e) {
    e.preventDefault();
    // In a real app, you'd validate credentials here
    loginForm.style.display = 'none';
    dashboard.style.display = 'block';
    userNameSpan.textContent = usernameInput.value;
}

function startExam() {
    currentExam = exams[examSelect.value];
    userAnswers = new Array(currentExam.length).fill(null);
    dashboard.style.display = 'none';
    examInterface.style.display = 'block';
    examTitle.textContent = `${examSelect.options[examSelect.selectedIndex].text} Exam`;
    renderQuestions();
    startTimer();
}

function renderQuestions() {
    questionsDiv.innerHTML = '';
    currentExam.forEach((q, index) => {
        const questionEl = document.createElement('div');
        questionEl.innerHTML = `
            <p>${index + 1}. ${q.question}</p>
            ${q.options.map((option, i) => `
                <label>
                    <input type="radio" name="q${index}" value="${i}" ${userAnswers[index] === i ? 'checked' : ''}>
                    ${option}
                </label>
            `).join('')}
        `;
        questionsDiv.appendChild(questionEl);
    });
}

function startTimer() {
    timeLeft = 30 * 60; // 30 minutes
    updateTimer();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitExam();
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timer.textContent = `Time Remaining: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function submitExam() {
    clearInterval(timerInterval);
    examInterface.style.display = 'none';
    result.style.display = 'block';
    
    userAnswers = currentExam.map((_, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        return selected ? parseInt(selected.value) : null;
    });
    
    showResult();
}

function showResult() {
    let score = 0;
    resultQuestionsDiv.innerHTML = '';
    currentExam.forEach((q, index) => {
        const isCorrect = userAnswers[index] === q.correctAnswer;
        if (isCorrect) score++;
        const resultEl = document.createElement('p');
        resultEl.textContent = `Question ${index + 1}: ${isCorrect ? 'Correct' : 'Incorrect'}`;
        resultQuestionsDiv.appendChild(resultEl);
    });
    const scoreEl = document.createElement('h3');
    scoreEl.textContent = `Your score: ${score}/${currentExam.length}`;
    resultQuestionsDiv.insertBefore(scoreEl, resultQuestionsDiv.firstChild);
}

function showReview() {
    result.style.display = 'none';
    review.style.display = 'block';
    renderReview();
}

function renderReview() {
    reviewQuestionsDiv.innerHTML = '';
    currentExam.forEach((q, index) => {
        const reviewEl = document.createElement('div');
        reviewEl.innerHTML = `
            <p><strong>${index + 1}. ${q.question}</strong></p>
            <p>Your answer: ${q.options[userAnswers[index]] || 'Not answered'}</p>
            <p>Correct answer: ${q.options[q.correctAnswer]}</p>
        `;
        reviewQuestionsDiv.appendChild(reviewEl);
    });
}

function showAnswers() {
    currentExam.forEach((q, index) => {
        const correctRadio = document.querySelector(`input[name="q${index}"][value="${q.correctAnswer}"]`);
        if (correctRadio) correctRadio.checked = true;
    });
}

function goToDashboard() {
    result.style.display = 'none';
    dashboard.style.display = 'block';
}

// Initially hide all sections except login
dashboard.style.display = 'none';
examInterface.style.display = 'none';
result.style.display = 'none';
review.style.display = 'none';