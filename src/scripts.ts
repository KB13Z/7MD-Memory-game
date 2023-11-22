/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
/* eslint-disable no-lonely-if */

const cardsArray: string[] = ['red', 'red', 'blue', 'blue', 'green', 'green']; // array of colored cards
let numberOfMoves = 0; // number of moves player takes, while playing the game
let selectedCard: string | null = null; // selected card from cardsArray

// function "initializeGame" sets up the initial state of the game
function initializeGame(): void {
  // Fisher-Yates function for shuffling elements in array
  function shuffle(arr: string[]): string[] {
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  shuffle(cardsArray); // cards shuffled
  resetTimer(); // timer set to 0
  numberOfMoves = 0; // number of moves set to 0
  const moveCounterDisplay = document.querySelector('.js-move-counter') as HTMLElement;
  moveCounterDisplay.textContent = 'Moves: 0';
  moveCounterDisplay.style.display = 'none';
}

// starting game, by clicking on start button

const startButton = document.querySelector('.js-start-button') as HTMLButtonElement;
const memoryGame = document.querySelector('.js-memory-game') as HTMLDivElement;
startButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  memoryGame.style.display = 'flex';
  initializeGame();
  startTimer();
  const timerDisplay = document.querySelector('.js-timer') as HTMLElement;
  timerDisplay.style.display = 'flex';
  const moveCounterDisplay = document.querySelector('.js-move-counter') as HTMLElement;
  moveCounterDisplay.style.display = 'flex';
});

// create a function "handleCardClick" that takes in the index of the clicked card as a parameter.

let selectedCardIndex: number | null = null;

function handleCardClick(index: number): void {
  const clickedCard = document.querySelector(`.js-card:nth-child(${index + 1})`) as HTMLElement; // selecting clicked card
  const clickedCardValue = cardsArray[index]; // assigning value(color) to clicked card

  if (clickedCard.style.backgroundColor || selectedCardIndex === index) {
    return;
  }

  clickedCard.style.backgroundColor = clickedCardValue;

  if (selectedCard === null) {
    // first card in the pair
    selectedCard = clickedCardValue;
    selectedCardIndex = index;
  } else {
    // second card in the pair
    if (clickedCardValue === selectedCard) {
      // cards are matched
      selectedCard = null;
      selectedCardIndex = null;
      // Check, if all cards are matched
      if (allCardsMatched()) {
        displayWinner();
      }
    } else {
      // Cards are not matched, will return to default color
      setTimeout(() => {
        clickedCard.style.backgroundColor = '';
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const selectedCardElement = document.querySelector(`.js-card:nth-child(${selectedCardIndex! + 1})`) as HTMLElement;
        selectedCardElement.style.backgroundColor = '';
        selectedCard = null;
        selectedCardIndex = null;
      }, 700);
    }
  }
  numberOfMoves += 1; // adding a move after clicked card

  const moveCounterDisplay = document.querySelector('.js-move-counter') as HTMLElement;
  moveCounterDisplay.textContent = `Moves: ${numberOfMoves}`;
}

const cards = document.querySelectorAll('.js-card') as NodeListOf<HTMLElement>;
cards.forEach((card, index) => {
  card.addEventListener('click', () => handleCardClick(index));
}); // every card will be clicked only once, until all cards are matched

function allCardsMatched(): boolean {
  // check if all cards are matched
  for (const card of cards) {
    if (!card.style.backgroundColor) {
      return false;
    }
  }
  return true;
}

// ending screen appears after finishing games(matching all pairs)
function displayWinner(): void {
  const endScreen = document.querySelector('.js-end-screen') as HTMLDivElement;
  endScreen.style.display = 'flex';
  memoryGame.style.display = 'none';
  const winCount = localStorage.getItem('winCount') || '0';
  const updatedWinCount = parseInt(winCount, 10) + 1;
  localStorage.setItem('winCount', updatedWinCount.toString());

  const winCountDisplay = document.querySelector('.js-win-count') as HTMLElement;
  winCountDisplay.textContent = `Wins: ${updatedWinCount}`;

  stopTimer();
}

// function for resetting game
function resetGame(): void {
  startButton.style.display = 'flex';
  const endScreen = document.querySelector('.js-end-screen') as HTMLDivElement;
  endScreen.style.display = 'none';
  cards.forEach((card) => {
    card.style.backgroundColor = '';
  });
  initializeGame();
}

// adding resetGame function to reset button
const resetButton = document.querySelector('.js-reset-button') as HTMLButtonElement;
resetButton.addEventListener('click', resetGame);

let timer: string | number | NodeJS.Timeout;

// function for starting timer
function startTimer(): void {
  let seconds = 0;
  timer = setInterval(() => {
    seconds += 1;
    const timerDisplay = document.querySelector('.js-timer') as HTMLElement;
    timerDisplay.textContent = `Time: ${seconds}s`;
  }, 1000);
}

// function for stopping timer
function stopTimer(): void {
  clearInterval(timer);
}

// function for resetting timer back to 0
function resetTimer(): void {
  stopTimer();
  const timerDisplay = document.querySelector('.js-timer') as HTMLElement;
  timerDisplay.textContent = 'Time: 0s';
  timerDisplay.style.display = 'none';
}
