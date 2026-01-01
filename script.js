const cards = document.querySelectorAll('.memory-card');

function flipCard(){
    this.classList.toggle('flip');
}

cards.forEach(card => card.addEventListener('click',flipCard));

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard(){
    if(lockBoard) return;
    this.classList.toggle('flip');
    this.classList.add('flip');

    if (!hasFlippedCard){
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    hasFlippedCard = false;

    checkForMatch();
}

function checkForMatch(){
    if (firstCard.dataset.framework === secondCard.dataset.framework){
        disableCards();
        return;
    }

    unflipCards();
}

function disableCards(){
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click',flipCard);
}

function unflipCards(){
    lockBoard = true;

    setTimeout(()=> {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        lockBoard = false;
        
    }, 1500);
}

cards.forEach(card => card.addEventListener('click', flipCard));
