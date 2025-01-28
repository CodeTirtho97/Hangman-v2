const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-again");
const newGameBtn = document.getElementById("new-game");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const hintEl = document.getElementById("hint");
const timerEl = document.getElementById("timer");
const difficultyEl = document.getElementById("difficulty");

const figureParts = document.querySelectorAll(".figure-part");

// Word data with hints
const words = {
  easy: [
    { word: "cat", hint: "A common pet" },
    { word: "sun", hint: "Appears every day" },
    { word: "cup", hint: "Used for drinking" },
  ],
  medium: [
    { word: "apple", hint: "A fruit" },
    { word: "chair", hint: "Used for sitting" },
    { word: "house", hint: "Where people live" },
  ],
  hard: [
    { word: "dolphin", hint: "An aquatic mammal" },
    { word: "giraffe", hint: "The tallest animal" },
    { word: "galaxy", hint: "A collection of stars" },
  ],
};

let selectedWord = "";
let selectedHint = "";
let correctLetters = [];
let wrongLetters = [];
let timer;
let timeLeft = 60;

// Select random word and hint based on difficulty
function selectWord(difficulty) {
  const wordData = words[difficulty];
  const randomIndex = Math.floor(Math.random() * wordData.length);
  selectedWord = wordData[randomIndex].word;
  selectedHint = wordData[randomIndex].hint;
  displayWord();
  displayHint();
}

// Display the hidden word
function displayWord() {
  wordEl.innerHTML = `${selectedWord
    .split("")
    .map(
      (letter) =>
        `<span class='letters'>
            ${correctLetters.includes(letter) ? letter : ""}
            </span>`
    )
    .join("")}`;

  const innerWord = wordEl.innerText.replace(/\n/g, "");

  if (innerWord === selectedWord) {
    finalMessage.innerText = "Congratulations! You Won!";
    clearInterval(timer);
    popup.style.display = "flex";
  }
}

// Display the hint
function displayHint() {
  hintEl.textContent = selectedHint || "No hint available";
}

// Update wrong letters
function updateWrongLettersEl() {
  wrongLettersEl.innerHTML = `
        ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
        ${wrongLetters.map((letter) => `<span>${letter}</span>`).join("")}`;

  // Display figure parts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });

  // Check if lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = "Unfortunately You Lost!";
    clearInterval(timer);
    popup.style.display = "flex";
  }
}

// Show notification
function showNotification() {
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

// Start the timer
function startTimer() {
  clearInterval(timer);
  timeLeft = 60;
  timerEl.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      finalMessage.innerText = "Time's Up! You Lost!";
      popup.style.display = "flex";
    }
  }, 1000);
}

// Handle keydown event
window.addEventListener("keydown", (e) => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;

    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        updateWrongLettersEl();
      } else {
        showNotification();
      }
    }
  }
});

// Start a new game
function startGame() {
  const difficulty = difficultyEl.value;
  correctLetters = [];
  wrongLetters = [];
  selectWord(difficulty);
  updateWrongLettersEl();
  popup.style.display = "none";
  startTimer();
}

// Reset the game when clicking "Play Again" or "New Game"
playAgainBtn.addEventListener("click", startGame);
newGameBtn.addEventListener("click", startGame);

// Initial Game Setup
startGame();
