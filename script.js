const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

let moves = 0;
let score = 0;
let matchedPairs = 0;
let timer = 0;
let timerInterval;

const movesEl = document.getElementById('moves');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');


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

    if (matchedPairs === cards.length / 2){
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
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Shuffle cards
(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
})();

cards.forEach(card => card.addEventListener('click', flipCard));


function endGame(){
    clearInterval(timerInterval);

    document.getElementById('finalTime').textContent = timer;
    document.getElementById('finalMoves').textContent = moves;
    document.getElementById('finalScore').textContent = score;
    
    document.getElementById('winModal').style.display = 'flex';
}

document.getElementById('restart').addEventListener('click', restartGame);

function restartGame(){
    clearInterval(timerInterval);
    timerInterval = null;
    timer = 0;
    moves = 0;
    score = 0;
    matchedPairs = 0;

    timerEl.textContent = 0;
    movesEl.textContent = 0;
    scoreEl.textContent = 0;

    document.getElementById('winModal').style.display ='none';

    cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flipCard);
        card.style.order = Math.floor(Math.random() * cards.length);
    });
}





