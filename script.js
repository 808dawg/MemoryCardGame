// Card data with Font Awesome icons
const cardIcons = [
    'fa-heart', 'fa-star', 'fa-smile', 'fa-bolt',
    'fa-cloud', 'fa-moon', 'fa-sun', 'fa-tree',
    'fa-bell', 'fa-gift', 'fa-music', 'fa-car'
];

// Game variables
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let isProcessing = false;
let moves = 0;
let timer = null;
let seconds = 0;
let minutes = 0;
let gameStarted = false;

// DOM elements
const gameBoard = document.getElementById('game-board');
const movesCount = document.getElementById('moves-count');
const timeValue = document.getElementById('time');
const restartButton = document.getElementById('restart');
const winModal = document.getElementById('win-modal');
const finalMoves = document.getElementById('final-moves');
const finalTime = document.getElementById('final-time');
const playAgainButton = document.getElementById('play-again');

// Initialize game
function initializeGame() {
    // Reset game variables
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    isProcessing = false;
    moves = 0;
    seconds = 0;
    minutes = 0;
    gameStarted = false;
    clearInterval(timer);
    
    // Update UI
    movesCount.textContent = moves;
    timeValue.textContent = '00:00';
    
    // Clear game board
    gameBoard.innerHTML = '';
    
    // Create card pairs
    let cardPairs = [...cardIcons, ...cardIcons];
    
    // Shuffle cards
    cardPairs = shuffleArray(cardPairs);
    
    // Create card elements
    cardPairs.forEach((icon, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.cardIndex = index;
        
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.innerHTML = `<i class="fas ${icon}"></i>`;
        
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        
        card.appendChild(cardFront);
        card.appendChild(cardBack);
        
        card.addEventListener('click', flipCard);
        
        gameBoard.appendChild(card);
        cards.push(card);
    });
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Flip card
function flipCard() {
    if (isProcessing || this.classList.contains('flipped') || this.classList.contains('matched')) {
        return;
    }
    
    // Start timer on first card flip
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }
    
    this.classList.add('flipped');
    flippedCards.push(this);
    
    if (flippedCards.length === 2) {
        isProcessing = true;
        incrementMoves();
        checkForMatch();
    }
}

// Check for match
function checkForMatch() {
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];
    
    const icon1 = card1.querySelector('.card-front i').className;
    const icon2 = card2.querySelector('.card-front i').className;
    
    if (icon1 === icon2) {
        // Match found
        card1.classList.add('matched');
        card2.classList.add('matched');
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        matchedPairs++;
        
        // Check for win
        if (matchedPairs === cardIcons.length) {
            setTimeout(() => {
                stopTimer();
                showWinModal();
            }, 500);
        }
    } else {
        // No match
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 1000);
    }
    
    // Reset for next turn
    setTimeout(() => {
        flippedCards = [];
        isProcessing = false;
    }, 1000);
}

// Increment moves
function incrementMoves() {
    moves++;
    movesCount.textContent = moves;
}

// Timer functions
function startTimer() {
    timer = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        timeValue.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

// Show win modal
function showWinModal() {
    finalMoves.textContent = moves;
    finalTime.textContent = timeValue.textContent;
    winModal.style.display = 'flex';
}

// Event listeners
restartButton.addEventListener('click', () => {
    initializeGame();
});

playAgainButton.addEventListener('click', () => {
    winModal.style.display = 'none';
    initializeGame();
});

// Initialize game on load
document.addEventListener('DOMContentLoaded', initializeGame);