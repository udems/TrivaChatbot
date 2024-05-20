document.getElementById('sendButton').addEventListener('click', handleUserInput);
document.getElementById('userInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();  // Prevent form submission on Enter
        handleUserInput();
    }
});

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

async function fetchQuestions() {
    const response = await fetch('https://opentdb.com/api.php?amount=10');
    const data = await response.json();
    return data.results;
}

function displayMessage(message, sender) {
    const chatbox = document.getElementById('chatbox');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender;
    messageDiv.textContent = message;
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function startChat() {
    displayMessage('Hello! Welcome to the Trivia Chatbot.', 'bot');
    setTimeout(() => {
        askQuestion();
    }, 1000);
}

async function askQuestion() {
    if (questions.length === 0) {
        questions = await fetchQuestions();
    }
    const question = questions[currentQuestionIndex];
    displayMessage(`Question ${currentQuestionIndex + 1}: ${question.question}`, 'bot');

    const answers = [...question.incorrect_answers, question.correct_answer];
    answers.sort(() => Math.random() - 0.5);

    const answerList = document.createElement('ul');
    answers.forEach((answer, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = ` ${answer}`;
        listItem.className = 'choice';
        answerList.appendChild(listItem);
    });
    displayMessage('Options:', 'bot');
    document.getElementById('chatbox').appendChild(answerList);
}

function handleUserInput() {
    const userInput = document.getElementById('userInput').value.trim();
    if (userInput === '') return;
    displayMessage(userInput, 'user');
    document.getElementById('userInput').value = '';
    checkAnswer(userInput);
}

function checkAnswer(userAnswer) {
    const question = questions[currentQuestionIndex];
    const correctAnswer = question.correct_answer.toLowerCase();
    const userAnswerNormalized = userAnswer.toLowerCase();

    const isCorrect = question.incorrect_answers.map(ans => ans.toLowerCase()).concat(correctAnswer).includes(userAnswerNormalized);

    if (isCorrect) {
        displayMessage('Correct!', 'bot');
        score++;
    } else {
        displayMessage(`Incorrect! The correct answer was: ${correctAnswer}`, 'bot');
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        setTimeout(() => {
            askQuestion();
        }, 1000);
    } else {
        setTimeout(() => {
            displayMessage(`Quiz over! Your score is: ${score}/${questions.length}`, 'bot');
        }, 1000);
    }
}

// Start the chatbot
startChat();
