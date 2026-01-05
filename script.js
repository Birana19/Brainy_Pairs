const cards = document.querySelectorAll('.memory-card');
const movesEl = document.getElementById('moves');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const difficultySelect = document.getElementById('difficulty');
const gameBoard = document.querySelector('.memory-game');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

let moves = 0;
let score = 0;
let matchedPairs = 0;
let timer = 0;
let timerInterval = null;

const difficultyLevels = {
    easy: 6,
    medium: 12,
    hard: 16
};

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    if (!timerInterval) {
        timerInterval = setInterval(() => {
            timer++;
            timerEl.textContent = timer;
        }, 1000);
    }

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    moves++;
    movesEl.textContent = moves;

    const isMatch =
        firstCard.dataset.framework === secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedPairs++;
    score += 100;
    scoreEl.textContent = score;

    const visibleCards =
        document.querySelectorAll('.memory-card[style*="block"]').length;

    if (matchedPairs === visibleCards / 2) {
        endGame();
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1200);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function endGame() {
    clearInterval(timerInterval);

    document.getElementById('finalTime').textContent = timer;
    document.getElementById('finalMoves').textContent = moves;
    document.getElementById('finalScore').textContent = score;

    document.getElementById('winModal').style.display = 'flex';
}

document.getElementById('restart').addEventListener('click', restartGame);
difficultySelect.addEventListener('change', restartGame);

function restartGame() {

    clearInterval(timerInterval);
    timerInterval = null;

    timer = 0;
    moves = 0;
    score = 0;
    matchedPairs = 0;

    timerEl.textContent = 0;
    movesEl.textContent = 0;
    scoreEl.textContent = 0;

    document.getElementById('winModal').style.display = 'none';

    resetBoard();

    gameBoard.classList.remove('easy', 'medium', 'hard');
    gameBoard.classList.add(difficultySelect.value);

    const level = difficultySelect.value;
    const cardsToShow = difficultyLevels[level];

    cards.forEach(card => {
        card.classList.remove('flip');
        card.style.display = 'none';
        card.removeEventListener('click', flipCard);
    });

    const shuffled = [...cards].sort(() => 0.5 - Math.random());

    shuffled.slice(0, cardsToShow).forEach(card => {
        card.style.display = 'block';
        card.addEventListener('click', flipCard);
    });
}

// Start game initially
restartGame();
